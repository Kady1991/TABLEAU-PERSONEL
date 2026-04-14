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

  update: (id, payload) => {
    console.log("ID:", id);
    console.log("Payload:", payload);
    return http.put(`/api/personnes/edit/${id}`, payload);
  },

  archive: (id, formattedDate) =>
    http.put("/api/personnes/archive", null, {
      params: {
        id,
        date: formattedDate,
      },
    }),

restore: (id) =>
  http.get("/api/personnes/desarchiver", {
    params: { id: id },
  }),

  getGrades: () => http.get("/api/infos/wwgrades"),
  getAdresses: () => http.get("/api/infos/adresses"),
  // getTypesPersonnel: () => http.get("/api/infos/typepersonnel"),
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