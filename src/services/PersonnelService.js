import axios from "axios";
import { LIEN_API_PERSONNE } from "../config";
import { XMLParser } from "fast-xml-parser";

const http = axios.create({
  baseURL: LIEN_API_PERSONNE,
  headers: {
    "Content-Type": "application/json",
  },
});

const PersonnelService = {
  // ===============================
  // PERSONNES
  // ===============================

  getAll: () => http.get("/api/Personne"),

  getById: (id) => http.get(`/api/Personne/${id}`),

  create: (payload) => http.post("/api/Personne", payload),

  update: (id, payload) =>
    http.put(`/api/personne/edit?id=${id}`, payload),

  restore: (id) =>
    http.put(`/api/personne/desarchiver?id=${id}`),

  // ===============================
  // RÉFÉRENTIELS
  // ===============================

  getGrades: () => http.get("/api/wwgrades"),

  getAdresses: () => http.get("/api/Adresses"),

  getTypesPersonnel: () => http.get("/api/typepersonnel"),

  getServices: () => http.get("/api/affectation/services"),

  // ===============================
  // SERVICE DETAILS
  // ===============================

  getServiceDetails: (serviceId) =>
    http.get(`/api/affectation/${serviceId}`),

  // ===============================
  // UTILITAIRE CACHE
  // ===============================

  clearCaches: () => {
    try {
      sessionStorage.removeItem("personnels_actifs_cache_v1");
      sessionStorage.removeItem("Personnels_actifs_cache_v1");
      sessionStorage.removeItem("home_personnels_actifs_cache_v1");
      sessionStorage.removeItem("personnels_archives_cache_v2_dates");
    } catch (e) {
      console.error("Erreur vidage cache:", e);
    }
  },

  // ===============================
  // XML → JSON (pour DetailMembreComponent)
  // ===============================

  getByIdXmlParsed: async (id) => {
    const response = await http.get(`/api/Personne/${id}`, {
      headers: {
        Accept: "application/xml",
      },
    });

    if (!response?.data) {
      throw new Error("Réponse API vide.");
    }

    if (typeof response.data !== "string") {
      throw new Error("La réponse API n'est pas du XML.");
    }

    const parser = new XMLParser({
      ignoreAttributes: false,
    });

    const jsonData = parser.parse(response.data);

    return jsonData?.WhosWhoModelView ?? null;
  },
  //  Recherche par email (utilisée par DeleteMembreComponent)
getByEmail: async (email) => {
  const res = await http.get(`/api/personne?email=${encodeURIComponent(email)}`);
  return res?.data;
},

//  Archive par email + dateSortie
archiveByEmail: async (email, dateSortieYYYYMMDD) => {
  const url = `/api/personne/delete?email=${encodeURIComponent(email)}&dateSortie=${encodeURIComponent(
    dateSortieYYYYMMDD
  )}`;
  return http.put(url);
},
};

export default PersonnelService;