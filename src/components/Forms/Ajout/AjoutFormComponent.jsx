import { useEffect, useState, forwardRef, useCallback } from "react";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import { IoPersonAddSharp } from "react-icons/io5";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  LinearProgress,
  Radio,
  RadioGroup,
  Snackbar,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import CloseIcon              from "@mui/icons-material/Close";
import PersonIcon             from "@mui/icons-material/Person";
import CalendarTodayIcon      from "@mui/icons-material/CalendarToday";
import WorkIcon               from "@mui/icons-material/Work";
import SettingsIcon           from "@mui/icons-material/Settings";
import AutoFixHighIcon        from "@mui/icons-material/AutoFixHigh";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs }       from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker }         from "@mui/x-date-pickers/DatePicker";
import { departementService, serviceService } from "../../../services/AffectationsService";
import PersonnelService       from "../../../services/PersonnelService";
import ServiceTreeSelect      from "../ServiceTreeSelect";
import AlertSuccessComponent  from "../../Alert/AlertSuccessComponent";
import { useTheme }           from "@mui/material/styles";

// ── buildFlatOptions ──────────────────────────────────────────────────────────
// departementsList : données de /api/affectations/departement
//   → contient nomChefDepartement pour les services racine
// servicesList     : données de /api/affectations/service
//   → contient les sousServices avec leur propre nomChefDepartement
const buildFlatOptions = (departementsList, servicesList) => {
  const result = [];

  // Map idService → données complètes depuis /api/affectations/service
  // (avec sousServices et children)
  const serviceMap = new Map();
  (servicesList || []).forEach((s) => {
    serviceMap.set(s.idService ?? s.IDService, s);
  });

  // Map idDepartement → { nomChefDepartement, prenomChefDepartement }
  const deptChefMap = new Map();
  (departementsList || []).forEach((d) => {
    deptChefMap.set(d.idDepartement, {
      nomChefDepartement:    d.nomChefDepartement    ?? "",
      prenomChefDepartement: d.prenomChefDepartement ?? "",
    });
  });

  // On itère sur departementsList pour garder l'ordre et avoir le chef département
  (departementsList || []).forEach((dept) => {
    const deptChef = deptChefMap.get(dept.idDepartement) || {};

    (dept.services || []).forEach((svcFromDept) => {
      const svcId = svcFromDept.idService ?? svcFromDept.IDService;

      // Données enrichies depuis serviceMap (qui a les sousServices complets)
      const svcFull = serviceMap.get(svcId) || svcFromDept;

      // ── Service racine ──────────────────────────────────────────────────
      result.push({
        id:             `service-${svcId}`,
        value:          `service-${svcId}`,
        realServiceId:  svcId,
        parentServiceId: null,
        hasChildren:    (svcFull.sousServices?.length ?? 0) > 0,
        label:          svcFull.nomServiceFr ?? svcFromDept.nomServiceFr ?? "",
        type:           "service",
        nomDepartementFr:      dept.nomDepartementFr      ?? "",
        nomChefDepartement:    deptChef.nomChefDepartement,
        prenomChefDepartement: deptChef.prenomChefDepartement,
        nomChefService:        svcFull.nomChefService  ?? svcFromDept.nomChefService  ?? "",
        prenomChefService:     svcFull.prenomChefService ?? svcFromDept.prenomChefService ?? "",
        nomSousChef:    "",
        prenomSousChef: "",
      });

      // ── Sous-services (depuis serviceMap qui les a complets) ────────────
      (svcFull.sousServices || []).forEach((ss) => {
        const sousId = ss.idSousService ?? ss.IDSousService;

        result.push({
          id:             `sous-${sousId}`,
          value:          `sous-${sousId}`,
          realServiceId:  sousId,
          parentServiceId: svcId,
          hasChildren:    (ss.children?.length ?? 0) > 0,
          label:          "— " + (ss.nomSousServiceFr ?? ""),
          type:           "sousService",
          nomDepartementFr:      ss.nomDepartementFr      ?? dept.nomDepartementFr      ?? "",
          nomChefDepartement:    ss.nomChefDepartement     ?? deptChef.nomChefDepartement    ?? "",
          prenomChefDepartement: ss.prenomChefDepartement  ?? deptChef.prenomChefDepartement ?? "",
          nomChefService:        ss.nomChefService  ?? svcFull.nomChefService  ?? "",
          prenomChefService:     ss.prenomChefService ?? svcFull.prenomChefService ?? "",
          nomSousChef:    ss.nomSousChef    ?? "",
          prenomSousChef: ss.prenomSousChef ?? "",
        });

        // ── Children ──────────────────────────────────────────────────────
        (ss.children || []).forEach((child) => {
          const childId = child.idSousService ?? child.IDSousService;

          result.push({
            id:             `child-${childId}`,
            value:          `child-${childId}`,
            realServiceId:  childId,
            parentServiceId: svcId,
            parentSousServiceId: sousId,
            hasChildren:    false,
            label:          "—— " + (child.nomSousServiceFr ?? ""),
            type:           "child",
            nomDepartementFr:      child.nomDepartementFr      ?? ss.nomDepartementFr      ?? dept.nomDepartementFr      ?? "",
            nomChefDepartement:    child.nomChefDepartement     ?? ss.nomChefDepartement    ?? deptChef.nomChefDepartement    ?? "",
            prenomChefDepartement: child.prenomChefDepartement  ?? ss.prenomChefDepartement ?? deptChef.prenomChefDepartement ?? "",
            nomChefService:        child.nomChefService  ?? ss.nomChefService  ?? svcFull.nomChefService  ?? "",
            prenomChefService:     child.prenomChefService ?? ss.prenomChefService ?? svcFull.prenomChefService ?? "",
            nomSousChef:    child.nomSousChef    ?? ss.nomSousChef    ?? "",
            prenomSousChef: child.prenomSousChef ?? ss.prenomSousChef ?? "",
          });
        });
      });
    });
  });

  return result;
};

// ── Constantes ────────────────────────────────────────────────────────────────
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

// ── SectionTitle ──────────────────────────────────────────────────────────────
function SectionTitle({ icon, label }) {
  const theme = useTheme();
  return (
    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5, mt: 1 }}>
      <Box sx={{ color: theme.palette.secondary.main, display: "flex", alignItems: "center" }}>{icon}</Box>
      <Typography sx={{ fontSize: 11, fontWeight: 600, color: theme.palette.secondary.main, textTransform: "uppercase", letterSpacing: "0.07em", whiteSpace: "nowrap" }}>
        {label}
      </Typography>
      <Divider sx={{ flex: 1 }} />
    </Stack>
  );
}
SectionTitle.propTypes = { icon: PropTypes.node.isRequired, label: PropTypes.string.isRequired };

// ── Composant principal ───────────────────────────────────────────────────────
const AjoutFormComponent = forwardRef(({ open, onClose, onMemberUpdate, refreshData }, ref) => {
  const theme   = useTheme();
  const PRIMARY = theme.palette.primary.main;
  const TEAL    = theme.palette.secondary.main;

  const [loadingInit,  setLoadingInit]  = useState(false);
  const [saving,       setSaving]       = useState(false);
  const [error,        setError]        = useState("");
  const [snackbar,     setSnackbar]     = useState({ open: false, message: "", severity: "success" });
  const [grades,       setGrades]       = useState([]);
  const [addresses,    setAddresses]    = useState([]);
  const [fonctions,    setFonctions]    = useState([]);
  const [servicesFlat, setServicesFlat] = useState([]);
  const [selectedServiceDetails, setSelectedServiceDetails] = useState(null);
  const [form,    setFormState] = useState(INITIAL_FORM);
  const [touched, setTouched]   = useState(INITIAL_TOUCHED);
  const [successData, setSuccessData] = useState({
    open: false, nom: "", prenom: "", service: "", departement: "", IDPersonneService: null,
  });

  const showSnackbar  = (message, severity = "success") => setSnackbar({ open: true, message, severity });
  const closeSnackbar = () => setSnackbar((prev) => ({ ...prev, open: false }));
  const setField      = (name, value) => setFormState((prev) => ({ ...prev, [name]: value }));
  const touch         = (name) => setTouched((prev) => ({ ...prev, [name]: true }));

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

  const selectedFonction = fonctions.find((f) => Number(f.IDFonction) === Number(form.fonction)) || null;
  const selectedGrade    = grades.find((g) => Number(g.IDWWGrade)    === Number(form.grade))    || null;
  const selectedAddress  = addresses.find((a) => Number(a.IDAdresse)  === Number(form.adresse))  || null;
  const codesDisponibles = selectedFonction?.Codes || [];
  const showPreview      = !!(form.nom && form.prenom && form.email);
  const previewService   = selectedServiceDetails?.label?.replace(/^[-— ]+/, "") || "";

  const handleNameChange = useCallback((nextNom, nextPrenom) => {
    setField("email", generateEmail(nextPrenom, nextNom));
  }, []);

  // ── Chargement ───────────────────────────────────────────────────────────
  // - departementService.getAll() → chef département des services racine
  // - serviceService.getAll()     → sous-services complets avec leur nomChefDepartement
  useEffect(() => {
    if (!open) return;
    let mounted = true;
    (async () => {
      setLoadingInit(true);
      setError("");
      try {
        const [gradesRes, deptRes, svcRes, addrRes, fonRes] = await Promise.all([
          PersonnelService.getGrades(),
          departementService.getAll(),
          serviceService.getAll(),
          PersonnelService.getAdresses(),
          PersonnelService.getFonctions(),
        ]);
        if (!mounted) return;

        setServicesFlat(buildFlatOptions(deptRes?.data || [], svcRes?.data || []));
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

  useEffect(() => {
    if (!form.service) { setSelectedServiceDetails(null); return; }
    setSelectedServiceDetails(servicesFlat.find((s) => s.value === form.service) || null);
  }, [form.service, servicesFlat]);

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
        ServiceID:
  selectedServiceDetails?.type === "service"
    ? selectedServiceDetails.realServiceId
    : selectedServiceDetails.parentServiceId,
SousServiceID:
  selectedServiceDetails?.type === "child"
    ? selectedServiceDetails.parentSousServiceId
    : selectedServiceDetails?.type === "sousService"
      ? selectedServiceDetails.realServiceId
      : null,

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

      console.log("════════════════════");
console.log("selectedServiceDetails :", selectedServiceDetails);

console.log("TYPE :", selectedServiceDetails?.type);
console.log("realServiceId :", selectedServiceDetails?.realServiceId);
console.log("parentServiceId :", selectedServiceDetails?.parentServiceId);

console.log("PAYLOAD :", payload);
console.log("════════════════════");


      const response = await PersonnelService.create(payload);

      if (response.data === "Personne Exists") { showSnackbar("Cet email est déjà attribué.", "warning"); return; }
      if (response.data === "NOK")             { showSnackbar("L'API a refusé l'ajout.", "error");        return; }

      clearCaches();

      const refreshRes = await PersonnelService.getAll();
      const allPersonnels = Array.isArray(refreshRes?.data)  ? refreshRes.data  : [];
      const createdPerson = allPersonnels.sort(  (a, b) =>
      Number(b.IDPersonneService) - Number(a.IDPersonneService)  ).find(   (p) =>  String(p.Email).toLowerCase() ===  String(form.email).toLowerCase()  );
      const newId = createdPerson?.IDPersonneService || null;
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

  return (
    <>
      <Dialog open={!!open} onClose={handleClose} fullWidth maxWidth="md" ref={ref}>

        <DialogTitle sx={{ pb: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box sx={{ width: 36, height: 36, borderRadius: 2, background: "#e0f7f7", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <IoPersonAddSharp style={{ fontSize: 18, color: TEAL }} />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={600}>Ajouter un membre</Typography>
              <Typography variant="body2" color="text.secondary">
                {filledCount} / {requiredFields.length} champs obligatoires remplis
              </Typography>
            </Box>
          </Stack>
          <IconButton onClick={handleClose} size="small"><CloseIcon fontSize="small" /></IconButton>
        </DialogTitle>

        <Box sx={{ px: 3, pb: 1 }}>
          <LinearProgress variant="determinate" value={progressPct} sx={{
            height: 4, borderRadius: 99, bgcolor: "rgba(0,0,0,0.06)",
            "& .MuiLinearProgress-bar": { bgcolor: progressPct === 100 ? TEAL : PRIMARY, borderRadius: 99 },
          }} />
        </Box>

        <DialogContent dividers sx={{ bgcolor: "background.paper" }}>
          {loadingInit ? (
            <Stack direction="row" alignItems="center" spacing={2} p={3}>
              <CircularProgress size={20} />
              <Typography>Chargement des listes...</Typography>
            </Stack>
          ) : (
            <Stack spacing={0} sx={{ p: 1 }}>
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

              {/* ── Identité ── */}
              <SectionTitle icon={<PersonIcon sx={{ fontSize: 14 }} />} label="Identité" />
              <Grid container spacing={2} mb={2}>
                <Grid item xs={12} sm={6}>
                  <TextField label="Nom" required fullWidth size="small" value={form.nom}
                    error={!!fieldErrors.nom} helperText={fieldErrors.nom}
                    onChange={(e) => { setField("nom", e.target.value); handleNameChange(e.target.value, form.prenom); }}
                    onBlur={() => touch("nom")}
                    InputProps={{ endAdornment: form.nom ? <CheckCircleOutlineIcon sx={{ fontSize: 16, color: TEAL }} /> : null }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="Prénom" required fullWidth size="small" value={form.prenom}
                    error={!!fieldErrors.prenom} helperText={fieldErrors.prenom}
                    onChange={(e) => { setField("prenom", e.target.value); handleNameChange(form.nom, e.target.value); }}
                    onBlur={() => touch("prenom")}
                    InputProps={{ endAdornment: form.prenom ? <CheckCircleOutlineIcon sx={{ fontSize: 16, color: TEAL }} /> : null }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="Téléphone" fullWidth size="small" value={form.telephone}
                    onChange={(e) => setField("telephone", e.target.value)} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Tooltip title="Généré automatiquement depuis le nom et prénom" placement="top">
                    <TextField label="Email" required fullWidth size="small" value={form.email}
                      error={!!fieldErrors.email} helperText={fieldErrors.email}
                      onChange={(e) => setField("email", e.target.value)}
                      onBlur={() => touch("email")}
                      sx={{ "& .MuiInputBase-root": { bgcolor: form.email ? "rgba(2,178,175,0.05)" : "action.hover" } }}
                      InputProps={{ endAdornment: (
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <AutoFixHighIcon sx={{ fontSize: 14, color: TEAL, opacity: 0.7 }} />
                          {form.email && <CheckCircleOutlineIcon sx={{ fontSize: 16, color: TEAL }} />}
                        </Stack>
                      )}}
                    />
                  </Tooltip>
                </Grid>
              </Grid>

              {/* ── Affectation ── */}
              <SectionTitle icon={<CalendarTodayIcon sx={{ fontSize: 14 }} />} label="Affectation" />
              <Grid container spacing={2} mb={2}>
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker label="Date d'entrée" value={form.DateEntreeDate}
                      onChange={(val) => { setField("DateEntreeDate", val); touch("DateEntreeDate"); }}
                      slotProps={{ textField: { required: true, fullWidth: true, size: "small", error: !!fieldErrors.DateEntreeDate, helperText: fieldErrors.DateEntreeDate, onBlur: () => touch("DateEntreeDate") } }}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Autocomplete size="small" options={grades}
                    getOptionLabel={(o) => o?.NomWWGradeFr || ""}
                    value={grades.find((g) => Number(g.IDWWGrade) === Number(form.grade)) || null}
                    isOptionEqualToValue={(o, v) => Number(o.IDWWGrade) === Number(v.IDWWGrade)}
                    onChange={(_, nv) => setField("grade", nv ? Number(nv.IDWWGrade) : 0)}
                    renderInput={(params) => <TextField {...params} label="Grade" />}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Autocomplete size="small" options={addresses || []}
                    getOptionLabel={(o) => o?.AdresseComplete ?? ""}
                    value={addresses.find((a) => a.IDAdresse === form.adresse) || null}
                    onChange={(_, nv) => { setField("adresse", nv ? nv.IDAdresse : null); touch("adresse"); }}
                    renderInput={(params) => (
                      <TextField {...params} label="Adresse d'affectation" required
                        error={!!fieldErrors.adresse} helperText={fieldErrors.adresse}
                        onBlur={() => touch("adresse")} />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box onBlur={() => touch("service")}>
                    <ServiceTreeSelect
                      servicesFlat={servicesFlat}
                      value={servicesFlat.find((s) => s.value === form.service) || null}
                      onChange={(nv) => {
                        if (!nv) { setField("service", ""); setSelectedServiceDetails(null); return; }
                        setField("service", nv.value);
                        setSelectedServiceDetails(nv);
                        touch("service");
                      }}
                      required
                    />
                    {fieldErrors.service && (
                      <Typography sx={{ fontSize: 11, color: "error.main", mt: 0.5, ml: 1.5 }}>{fieldErrors.service}</Typography>
                    )}
                  </Box>
                </Grid>

                {selectedServiceDetails && (
                  <Grid item xs={12}>
                    <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: "action.hover", border: "1px solid", borderColor: "divider", display: "flex", gap: 3, flexWrap: "wrap" }}>
                      <Typography variant="body2"><strong>Chef Département :</strong> {selectedServiceDetails.nomChefDepartement || "-"} {selectedServiceDetails.prenomChefDepartement || ""}</Typography>
                      <Typography variant="body2"><strong>Chef Service :</strong> {selectedServiceDetails.nomChefService || "-"} {selectedServiceDetails.prenomChefService || ""}</Typography>
                      {selectedServiceDetails.nomSousChef && (
                        <Typography variant="body2"><strong>Sous-chef :</strong> {selectedServiceDetails.nomSousChef} {selectedServiceDetails.prenomSousChef || ""}</Typography>
                      )}
                    </Box>
                  </Grid>
                )}
              </Grid>

              {/* ── Fonction ── */}
              <SectionTitle icon={<WorkIcon sx={{ fontSize: 14 }} />} label="Fonction" />
              <Grid container spacing={2} mb={2}>
                <Grid item xs={12} sm={6}>
                  <Autocomplete size="small" options={fonctions}
                    getOptionLabel={(o) => typeof o === "string" ? o : o?.NomFonctionFr || ""}
                    isOptionEqualToValue={(o, v) => Number(o.IDFonction) === Number(v.IDFonction)}
                    value={fonctions.find((f) => Number(f.IDFonction) === Number(form.fonction)) || null}
                    onChange={(_, nv) => { setField("fonction", nv ? Number(nv.IDFonction) : 0); setField("codeFonction", ""); }}
                    renderOption={({ key, ...props }, option) => <li key={key} {...props}>{option.NomFonctionFr}</li>}
                    renderInput={(params) => <TextField {...params} label="Fonction" required />}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Tooltip title={!selectedFonction ? "Sélectionnez d'abord une fonction" : ""} placement="top">
                    <span>
                      <Autocomplete size="small" options={codesDisponibles}
                        disabled={!selectedFonction}
                        getOptionLabel={(o) => o?.NomCode || ""}
                        value={codesDisponibles.find((c) => Number(c.Idcode) === Number(form.codeFonction)) || null}
                        isOptionEqualToValue={(o, v) => Number(o.Idcode) === Number(v.Idcode)}
                        onChange={(_, nv) => setField("codeFonction", nv ? Number(nv.Idcode) : 0)}
                        renderInput={(params) => (
                          <TextField {...params} label="Code fonction" required
                            sx={{ "& .MuiInputBase-root": { bgcolor: !selectedFonction ? "action.disabledBackground" : "transparent" } }} />
                        )}
                      />
                    </span>
                  </Tooltip>
                </Grid>
              </Grid>

              {/* ── Paramètres ── */}
              <SectionTitle icon={<SettingsIcon sx={{ fontSize: 14 }} />} label="Paramètres" />
              <Grid container spacing={2} mb={1}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500, color: PRIMARY }}>
                    <span style={{ color: "#d32f2f" }}>*</span> Personnel
                  </Typography>
                  <RadioGroup row value={form.SiTypePersonnel ? "true" : "false"}
                    onChange={(e) => setField("SiTypePersonnel", e.target.value === "true")}>
                    <FormControlLabel value="true"  control={<Radio size="small" />} label="Oui" />
                    <FormControlLabel value="false" control={<Radio size="small" />} label="Non" />
                  </RadioGroup>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500, color: PRIMARY }}>
                    <span style={{ color: "#d32f2f" }}>*</span> Langue
                  </Typography>
                  <RadioGroup row value={form.siFrancais ? "true" : "false"}
                    onChange={(e) => setField("siFrancais", e.target.value === "true")}>
                    <FormControlLabel value="true"  control={<Radio size="small" />} label="FR" />
                    <FormControlLabel value="false" control={<Radio size="small" />} label="NL" />
                  </RadioGroup>
                </Grid>
              </Grid>

              {/* ── Aperçu ── */}
              {showPreview && (
                <Box sx={{ mt: 1, p: 1.5, borderRadius: 2, border: "1px solid", borderColor: TEAL, bgcolor: "rgba(2,178,175,0.04)" }}>
                  <Typography sx={{ fontSize: 11, fontWeight: 600, color: TEAL, textTransform: "uppercase", letterSpacing: "0.06em", mb: 0.8 }}>
                    Aperçu du membre
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Box sx={{ width: 36, height: 36, borderRadius: "50%", bgcolor: "#E6F1FB", color: PRIMARY, fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {`${form.nom.charAt(0)}${form.prenom.charAt(0)}`.toUpperCase()}
                    </Box>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: PRIMARY }}>
                        {form.nom.toUpperCase()} {form.prenom}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {form.email}{previewService ? ` · ${previewService}` : ""}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              )}
            </Stack>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 1.5, justifyContent: "space-between" }}>
          <Typography variant="body2" color="text.secondary">
            <span style={{ color: "#d32f2f" }}>*</span> Champs obligatoires
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button onClick={handleClose} color="inherit" disabled={saving || loadingInit}>Annuler</Button>
            <Button onClick={handleSubmit} variant="contained" disabled={saving || loadingInit}>
              {saving ? "Enregistrement..." : "Valider"}
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={closeSnackbar} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert onClose={closeSnackbar} severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
      </Snackbar>

      <AlertSuccessComponent
        open={successData.open}
        onClose={() => setSuccessData((prev) => ({ ...prev, open: false }))}
        nom={successData.nom}
        prenom={successData.prenom}
        service={successData.service}
        departement={successData.departement}
        IDPersonneService={successData.IDPersonneService}
      />
    </>
  );
});

AjoutFormComponent.propTypes = {
  open: PropTypes.any, onClose: PropTypes.func,
  onMemberUpdate: PropTypes.func, refreshData: PropTypes.func,
};
AjoutFormComponent.displayName = "AjoutFormComponent";
export default AjoutFormComponent;