import axios from "axios";
import { LIEN_API_PERSONNE } from "../config";

const http = axios.create({
  baseURL: LIEN_API_PERSONNE,
  withCredentials: true,
});

const PersonnelService = {
  getAll: () => http.get("/api/personnes/liste"),

  getById: (id) => http.get(`/api/personnes/${id}`),

  create: (payload) => http.post("/api/personnes", payload),

  update: async (id, payload) => {
    console.log("[SERVICE UPDATE] id =", id);
    console.log("[SERVICE UPDATE] payload =", payload);

    const attempts = [
      {
        name: "PUT /api/personnes/edit?id=ID",
        run: () => http.put(`/api/personnes/edit?id=${id}`, payload),
      },
      {
        name: "POST /api/personnes/ID",
        run: () => http.post(`/api/personnes/${id}`, payload),
      },
      {
        name: "POST /api/personnes/edit (id dans body)",
        run: () =>
          http.post("/api/personnes/edit", {
            id,
            ...payload,
          }),
      },
    ];

    let lastError = null;

    for (const attempt of attempts) {
      try {
        console.log(`[SERVICE UPDATE TEST] tentative: ${attempt.name}`);
        const res = await attempt.run();
        console.log(`[SERVICE UPDATE TEST] succès: ${attempt.name}`);
        return res;
      } catch (error) {
        lastError = error;
        console.log(
          `[SERVICE UPDATE TEST] échec: ${attempt.name}`,
          error?.response?.status,
          error?.response?.data || error?.message,
        );
      }
    }

    throw lastError;
  },

  archive: (id, formattedDate) =>
    http.put("/api/personnes/archive", null, {
      params: {
        id,
        date: formattedDate,
      },
    }),

  getGrades: () => http.get("/api/infos/wwgrades"),
  getAdresses: () => http.get("/api/infos/adresses"),
  getTypesPersonnel: () => http.get("/api/infos/typepersonnel"),
  getServices: () => http.get("/api/infos/services"),
  getCodes: () => http.get("/api/infos/codes"),
  getFonctions: () => http.get("/api/infos/fonctions"),
  getFonction: (id) => http.get(`/api/infos/fonction?idFonction=${id}`),

  clearCaches: () => {
    localStorage.removeItem("personnels_cache");
    localStorage.removeItem("personnels_archives_cache");
    localStorage.removeItem("personnels_archives_cache_v2_dates");
  },
};

export default PersonnelService;