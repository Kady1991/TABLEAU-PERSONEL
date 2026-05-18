import { useEffect, useState, useCallback } from "react";
import dayjs from "dayjs";
import { serviceService } from "../../../services/AffectationsService";
import PersonnelService from "../../../services/PersonnelService";
import { buildFlatOptions } from "./serviceHelpers";

const INITIAL_FORM = {
  nom: "", prenom: "", telephone: "", email: "",
  DateEntreeDate: null, grade: 0, adresse: "", service: "",
  fonction: "", codeFonction: "", SiTypePersonnel: false,
  TypePersonnelID: "", siFrancais: true,
};

const INITIAL_TOUCHED = {
  nom: false, prenom: false, email: false,
  adresse: false, service: false, DateEntreeDate: false,
};

const generateEmail = (prenom, nom) => {
  if (!prenom || !nom) return "";
  const firstLettersPrenom = prenom.split(/[\s-]+/).filter(Boolean).map((p) => p.charAt(0).toLowerCase()).join("");
  return `${firstLettersPrenom}${nom.split(/[\s-]+/).join("").toLowerCase()}@uccle.brussels`;
};

const clearCaches = () => {
  try {
    sessionStorage.removeItem("personnels_actifs_cache_v1");
    sessionStorage.removeItem("Personnels_actifs_cache_v1");
    sessionStorage.removeItem("home_personnels_actifs_cache_v1");
  } catch (e) { console.error(e); }
};

export function useAjoutForm({ open, onClose, onMemberUpdate, refreshData }) {
  const [loadingInit, setLoadingInit] = useState(false);
  const [saving,      setSaving]      = useState(false);
  const [error,       setError]       = useState("");
  const [snackbar,    setSnackbar]    = useState({ open: false, message: "", severity: "success" });

  const [grades,      setGrades]      = useState([]);
  const [addresses,   setAddresses]   = useState([]);
  const [fonctions,   setFonctions]   = useState([]);
  const [servicesFlat, setServicesFlat] = useState([]);
  const [selectedServiceDetails, setSelectedServiceDetails] = useState(null);

  const [form,    setFormState] = useState(INITIAL_FORM);
  const [touched, setTouched]   = useState(INITIAL_TOUCHED);

  const [successData, setSuccessData] = useState({
    open: false, nom: "", prenom: "", service: "", departement: "", IDPersonneService: null,
  });

  // ── Helpers ───────────────────────────────────────────────────────────────
  const showSnackbar = (message, severity = "success") => setSnackbar({ open: true, message, severity });
  const closeSnackbar = () => setSnackbar((prev) => ({ ...prev, open: false }));
  const setField = (name, value) => setFormState((prev) => ({ ...prev, [name]: value }));
  const touch = (name) => setTouched((prev) => ({ ...prev, [name]: true }));

  // ── Validation ────────────────────────────────────────────────────────────
  const fieldErrors = {
    nom:            touched.nom            && !form.nom            ? "Nom obligatoire"    : "",
    prenom:         touched.prenom         && !form.prenom         ? "Prénom obligatoire" : "",
    email:          touched.email          && !form.email          ? "Email obligatoire"  : "",
    adresse:        touched.adresse        && !form.adresse        ? "Adresse obligatoire": "",
    service:        touched.service        && !form.service        ? "Service obligatoire": "",
    DateEntreeDate: touched.DateEntreeDate && !form.DateEntreeDate ? "Date obligatoire"   : "",
  };

  const requiredFields = ["nom", "prenom", "email", "DateEntreeDate", "adresse", "service"];
  const filledCount    = requiredFields.filter((f) => f === "DateEntreeDate" ? !!form.DateEntreeDate : !!form[f]).length;
  const progressPct    = Math.round((filledCount / requiredFields.length) * 100);

  // ── Dérivés ───────────────────────────────────────────────────────────────
  const selectedFonction = fonctions.find((f) => Number(f.IDFonction) === Number(form.fonction)) || null;
  const selectedGrade    = grades.find((g) => Number(g.IDWWGrade) === Number(form.grade)) || null;
  const selectedAddress  = addresses.find((a) => Number(a.IDAdresse) === Number(form.adresse)) || null;
  const codesDisponibles = selectedFonction?.Codes || [];
  const showPreview      = !!(form.nom && form.prenom && form.email);
  const previewService   = selectedServiceDetails?.label?.replace(/^[-— ]+/, "") || "";

  // ── Chargement initial ────────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    let mounted = true;
    (async () => {
      setLoadingInit(true);
      setError("");
      try {
        // On n'utilise plus /api/infos/services — ses données sont incohérentes
        // pour les sous-services. /api/affectations/service est la seule source fiable.
        const [gradesRes, affectServicesRes, addrRes, fonRes] = await Promise.all([
          PersonnelService.getGrades(),
          serviceService.getAll(),
          PersonnelService.getAdresses(),
          PersonnelService.getFonctions(),
        ]);
        if (!mounted) return;
        const flat = buildFlatOptions(affectServicesRes?.data || []);
        setServicesFlat(flat);
        setGrades(Array.isArray(gradesRes?.data)  ? gradesRes.data  : []);
        setAddresses(Array.isArray(addrRes?.data) ? addrRes.data    : []);
        setFonctions(Array.isArray(fonRes?.data)  ? fonRes.data     : []);
      } catch (e) {
        console.error(e);
        setError("Erreur lors du chargement des listes.");
      } finally {
        if (mounted) setLoadingInit(false);
      }
    })();
    return () => { mounted = false; };
  }, [open]);

  // Sync selectedServiceDetails quand form.service change
  useEffect(() => {
    if (!form.service) { setSelectedServiceDetails(null); return; }
    setSelectedServiceDetails(servicesFlat.find((s) => s.value === form.service) || null);
  }, [form.service, servicesFlat]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleNameChange = useCallback((nextNom, nextPrenom) => {
    setField("email", generateEmail(nextPrenom, nextNom));
  }, []);

  const handleServiceChange = useCallback((nv) => {
    if (!nv) { setField("service", ""); setSelectedServiceDetails(null); return; }
    setField("service", nv.value);
    setSelectedServiceDetails(nv);
    touch("service");
  }, []);

  const handleClose = useCallback(() => {
    setFormState(INITIAL_FORM);
    setTouched(INITIAL_TOUCHED);
    setSelectedServiceDetails(null);
    setError("");
    onClose?.();
  }, [onClose]);

  const handleSubmit = useCallback(async () => {
    setTouched({ nom: true, prenom: true, email: true, adresse: true, service: true, DateEntreeDate: true });

    if (!form.nom || !form.prenom || !form.email || !form.DateEntreeDate || !form.service || !form.adresse) {
      showSnackbar("Veuillez remplir tous les champs obligatoires.", "error");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const payload = {
        NomPersonne:     form.nom.toUpperCase(),
        PrenomPersonne:  form.prenom,
        Email:           form.email?.trim(),
        TelPro:          form.telephone ? String(form.telephone).trim() : null,
        DateEntree:      form.DateEntreeDate ? dayjs(form.DateEntreeDate).format("YYYY-MM-DD") : null,
        ServiceID:       selectedServiceDetails?.realServiceId ?? null,
        AdresseID:       form.adresse  ? Number(form.adresse)  : null,
        WWGradeID:       Number(form.grade)       || 0,
        IDWWGrade:       Number(form.grade)       || 0,
        FonctionID:      form.fonction ? Number(form.fonction) : 0,
        CodeID:          form.codeFonction ? Number(form.codeFonction) : 0,
        SiFrancais:      !!form.siFrancais,
        SiTypePersonnel: !!form.SiTypePersonnel,
        TypePersonnelID: form.SiTypePersonnel ? Number(form.TypePersonnelID) : 0,
        SiArchive:       false,
      };

      const response = await PersonnelService.create(payload);

      if (response.data === "Personne Exists") { showSnackbar("Cet email est déjà attribué.", "warning"); return; }
      if (response.data === "NOK")             { showSnackbar("L'API a refusé l'ajout.", "error");        return; }

      clearCaches();

      const newId       = response?.data?.IDPersonneService || response?.data?.id || null;
      const serviceLabel = selectedServiceDetails?.label?.replace(/^[-— ]+/, "") || "";
      const deptLabel    = selectedServiceDetails?.nomDepartementFr || "";

      const addedMember = {
        ...payload,
        IDPersonneService: newId,
        NomServiceFr:      serviceLabel,
        NomDepartementFr:  deptLabel,
        NomFonctionFr:     selectedFonction?.NomFonctionFr  || selectedFonction?.LibelleFonctionFr || "",
        NomFonctionNl:     selectedFonction?.NomFonctionNl  || selectedFonction?.LibelleFonctionNl || "",
        NomWWGradeFr:      selectedGrade?.NomWWGradeFr       || selectedGrade?.NomGradeFr           || selectedGrade?.LibelleGradeFr || "",
        NomWWGradeNl:      selectedGrade?.NomWWGradeNl       || selectedGrade?.NomGradeNl           || selectedGrade?.LibelleGradeNl || "",
        NomRueFr:          selectedAddress?.NomRueFr  || selectedAddress?.NomRue  || selectedAddress?.RueFr || "",
        NomRueNl:          selectedAddress?.NomRueNl  || selectedAddress?.RueNl   || "",
        Numero:            selectedAddress?.Numero    || "",
        Batiment:          selectedAddress?.Batiment  || "",
        BatimentNl:        selectedAddress?.BatimentNl || "",
        Etage:             selectedAddress?.Etage     || "",
      };

      if (typeof onMemberUpdate === "function") onMemberUpdate(addedMember);
      if (typeof refreshData    === "function") await refreshData();

      handleClose();
      setSuccessData({ open: true, nom: form.nom, prenom: form.prenom, service: serviceLabel, departement: deptLabel, IDPersonneService: newId });

    } catch (err) {
      const msg = typeof err?.response?.data === "string" ? err.response.data : err?.message || "Erreur lors de l'envoi.";
      setError(msg);
      showSnackbar(msg, "error");
    } finally {
      setSaving(false);
    }
  }, [form, selectedServiceDetails, selectedFonction, selectedGrade, selectedAddress, handleClose, onMemberUpdate, refreshData]);

  return {
    // state
    form, touched, fieldErrors, loadingInit, saving, error,
    snackbar, successData,
    grades, addresses, fonctions, servicesFlat,
    selectedServiceDetails, selectedFonction, selectedGrade, codesDisponibles,
    // computed
    filledCount, progressPct, showPreview, previewService,
    // handlers
    setField, touch, handleNameChange, handleServiceChange,
    handleClose, handleSubmit, closeSnackbar,
    setSuccessData,
  };
}