import axios from "axios";
import { LIEN_API_PERSONNE } from "../config";


const http = axios.create({
  baseURL: LIEN_API_PERSONNE,
  headers: {
    "Content-Type": "application/json",
  },
  // Décommente si nécessaire pour IIS / SSO
  // withCredentials: true,
});

const PersonnelService = {
  // Récupérer tous les personnels
  getAll: () => http.get("/api/Personne"),

  // Récupérer un personnel par ID
  getById: (id) => http.get(`/api/Personne/${id}`),

  //Modifier un personnel
  update: (id, payload) =>
    http.put(`/api/personne/edit?id=${id}`, payload),

  // Restaurer un personnel archivé
  restore: (id) =>
    http.put(`/api/personne/desarchiver?id=${id}`),

  // Référentiels
  getGrades: () => http.get("/api/wwgrades"),
  getAdresses: () => http.get("/api/Adresses"),
  getTypesPersonnel: () => http.get("/api/typepersonnel"),
  getServices: () => http.get("/api/affectation/services"),
};

export default PersonnelService;
