import axios from "axios";
import { LIEN_API_PERSONNE } from "../config";

const http = axios.create({
  baseURL: LIEN_API_PERSONNE,
  // headers: {
  //   "Content-Type": "application/json",
  // },
  // Décommente si nécessaire pour IIS / SSO
  withCredentials: true,
});

const PersonnelService = {
  // Récupérer tous le personnel
  getAll: () => http.get("/api/Personnes/liste"),

  // Récupérer une personne par ID
  getById: (id) => http.get(`/api/Personnes/${id}`),

  // créer une personne
  create: (payload) => http.post(`/api/Personnes/`, payload),

  //Modifier une personne
  update: (id, payload) => http.put(`/api/personnes/edit?id=${id}`, payload),

  // Restaurer une personne archivée
  restore: (id) => http.put(`/api/personnes/desarchiver?id=${id}`),

  // Référentiels
  getGrades: () => http.get("/api/infos/wwgrades"),
  getAdresses: () => http.get("/api/infos/Adresses"),
  getTypesPersonnel: () => http.get("/api/infos/typepersonnel"),
  getServices: () => http.get("/api/infos/services"),
  getCodes: () => http.get("/api/infos/codes"),
  getFonctions: () => http.get("/api/infos/fonctions"),
  getFonction: (id) => http.get(`/api/infos/fonction?idFonction=${id}`),
};

export default PersonnelService;
