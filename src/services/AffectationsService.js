import axios from "axios";
import { LIEN_API_PERSONNE } from "../config";

const api = axios.create({
  baseURL: LIEN_API_PERSONNE + "/api/",
  withCredentials: true, // Windows Auth (Negotiate)
  headers: { "Content-Type": "application/json" },
});

export const personneService = {
  search: (q) => api.get(`/personnes/search?q=${encodeURIComponent(q)}`),
};

// ── DEPARTEMENT ───────────────────────────────────────────────────────────────
export const departementService = {
  getAll: () => api.get("/affectations/departement"),
  getById: (id) => api.get(`/affectations/departement/${id}`),
  create: (data) => api.post("/affectations/departement", data),
  update: (id, data) => api.put(`/affectations/departement/${id}`, data),
  remove: (id) => api.delete(`/affectations/departement/${id}`),
};
// ── SERVICE ───────────────────────────────────────────────────────────────────
export const serviceService = {
  getAll: () => api.get("/affectations/service"),
  getById: (id) => api.get(`/affectations/service/${id}`),
  getByDepartement: (departementId) =>
    api.get(`/affectations/service/departement/${departementId}`),
  create: (data) => api.post("/affectations/service", data),
  update: (id, data) => api.put(`/affectations/service/${id}`, data),
  remove: (id) => api.delete(`/affectations/service/${id}`),
};

// ── SOUS-SERVICE ──────────────────────────────────────────────────────────────
export const sousServiceService = {
  getAll: () => api.get("/affectations/sousservice"),
  getById: (id) => api.get(`/affectations/sousservice/${id}`),
  getByService: (serviceId) =>
    api.get(`/affectations/sousservice/service/${serviceId}`),
  getByParent: (parentId) =>
    api.get(`/affectations/sousservice/parent/${parentId}`),
  create: (data) => api.post("/affectations/sousservice", data),
  update: (id, data) => api.put(`/affectations/sousservice/${id}`, data),
  remove: (id) => api.delete(`/affectations/sousservice/${id}`),
};

// utils/parseApiErrors.js
export function parseApiErrors(responseData) {
  const errors = {};
  if (responseData?.errors) {
    for (const [field, messages] of Object.entries(responseData.errors)) {
      // Normalise la clé en camelCase : "NomDepartementFr" → "nomDepartementFr"
      const key = field.charAt(0).toLowerCase() + field.slice(1);
      errors[key] = Array.isArray(messages) ? messages[0] : messages;
    }
  }
  return errors;
}
