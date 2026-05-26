import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import { RiFileEditFill } from "react-icons/ri";

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
  FormControl,
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

import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import WorkIcon from "@mui/icons-material/Work";
import SettingsIcon from "@mui/icons-material/Settings";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

import Autocomplete from "@mui/material/Autocomplete";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useTheme } from "@mui/material/styles";

import { serviceService } from "../../services/AffectationsService";
import PersonnelService from "../../services/PersonnelService";
import ServiceTreeSelect from "./ServiceTreeSelect";

// ─────────────────────────────────────────────────────────────
// Helpers — identiques à AjoutFormComponent
// ─────────────────────────────────────────────────────────────
const clean = (v) => (v == null ? "" : String(v).trim());

const buildFlatOptions = (servicesList) => {
  const result = [];
  servicesList.forEach((s) => {
    const svcId = s.idService ?? s.IDService;
    const hasSousServices = s.sousServices && s.sousServices.length > 0;
result.push({
  id: `service-${svcId}`,
  value: `service-${svcId}`,

  realServiceId: svcId,

  parentServiceId: null,
  parentSousServiceId: null,

  hasChildren: hasSousServices,

  label: s.nomServiceFr ?? s.NomServiceFr ?? "",
  type: "service",

  nomChefDepartement: "",
  prenomChefDepartement: "",

  nomChefService:
    s.nomChefService ?? s.NomChefService ?? "",

  prenomChefService:
    s.prenomChefService ?? s.PrenomChefService ?? "",

  nomSousChef: "",
  prenomSousChef: "",
});
    s.sousServices?.forEach((ss) => {
      const sousId = ss.idSousService ?? ss.IDSousService;
      const hasChildren = ss.children && ss.children.length > 0;
      result.push({
        id: `sous-${sousId}`,
        value: `sous-${sousId}`,
        realServiceId: sousId,
        parentServiceId: svcId,
        hasChildren,
        label: "— " + (ss.nomSousServiceFr ?? ss.NomSousServiceFr ?? ""),
        type: "sousService",
        nomChefDepartement: ss.nomChefDepartement ?? "",
        prenomChefDepartement: ss.prenomChefDepartement ?? "",
        nomChefService: ss.nomChefService ?? s.nomChefService ?? "",
        prenomChefService: ss.prenomChefService ?? s.prenomChefService ?? "",
        nomSousChef: ss.nomSousChef ?? "",
        prenomSousChef: ss.prenomSousChef ?? "",
      });
      ss.children?.forEach((child) => {
        const childId = child.idSousService ?? child.IDSousService;
        result.push({
          id: `child-${childId}`,
          value: `child-${childId}`,
          realServiceId: childId,
          parentServiceId: svcId,
          hasChildren: false,
          label: "—— " + (child.nomSousServiceFr ?? child.NomSousServiceFr ?? ""),
          type: "child",
          nomChefDepartement: child.nomChefDepartement ?? ss.nomChefDepartement ?? "",
          prenomChefDepartement:
            child.prenomChefDepartement ?? ss.prenomChefDepartement ?? "",
          nomChefService:
            child.nomChefService ?? ss.nomChefService ?? s.nomChefService ?? "",
          prenomChefService:
            child.prenomChefService ?? ss.prenomChefService ?? s.prenomChefService ?? "",
          nomSousChef: child.nomSousChef ?? ss.nomSousChef ?? "",
          prenomSousChef: child.prenomSousChef ?? ss.prenomSousChef ?? "",
        });
      });
    });
  });
  return result;
};

const enrichWithChefDepartement = (flatOptions, infosFlat) => {
  const chefMap = new Map();
  infosFlat.forEach((row) => {
    const sousId = row.IDSousService ?? 0;
    const childId = row.IDSousSousService ?? 0;
    const svcId = row.IDService ?? 0;
    let key;
    if (childId && childId !== 0) key = childId;
    else if (sousId && sousId !== 0) key = sousId;
    else key = svcId;
    if (!chefMap.has(key) && (row.NomChefDepartement || row.PrenomChefDepartement)) {
      chefMap.set(key, {
        nomChefDepartement: row.NomChefDepartement ?? "",
        prenomChefDepartement: row.PrenomChefDepartement ?? "",
      });
    }
  });
  return flatOptions.map((opt) => {
    const chefInfo = chefMap.get(opt.realServiceId);
    if (chefInfo && !opt.nomChefDepartement) return { ...opt, ...chefInfo };
    return opt;
  });
};

// ─────────────────────────────────────────────────────────────
// SectionTitle — identique à AjoutFormComponent
// ─────────────────────────────────────────────────────────────
function SectionTitle({ icon, label }) {
  const theme = useTheme();
  return (
    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5, mt: 1 }}>
      <Box sx={{ color: theme.palette.secondary.main, display: "flex", alignItems: "center" }}>
        {icon}
      </Box>
      <Typography
        sx={{
          fontSize: 11,
          fontWeight: 600,
          color: theme.palette.secondary.main,
          textTransform: "uppercase",
          letterSpacing: "0.07em",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </Typography>
      <Divider sx={{ flex: 1 }} />
    </Stack>
  );
}
SectionTitle.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
};

// ─────────────────────────────────────────────────────────────
// State initial
// ─────────────────────────────────────────────────────────────
const initialForm = {
  IDPersonneService: null,
  PersonneID: null,
  NomPersonne: "",
  PrenomPersonne: "",
  Email: "",
  TelPro: "",
  DateEntreeDate: null,
  WWGradeID: "",
  AdresseID: "",
  serviceValue: "",   // valeur interne ServiceTreeSelect (ex: "sous-42")
  ServiceID: "",      // realServiceId envoyé à l'API
  SousServiceID: "",
  FonctionID: "",
  CodeID: "",
  SiFrancais: true,
  SiTypePersonnel: false,
  TypePersonnelID: "",
};

// ─────────────────────────────────────────────────────────────
// EditFormComponent
// ─────────────────────────────────────────────────────────────
function EditFormComponent({ IDPersonneService, refreshData }) {
  const theme = useTheme();
  const PRIMARY = theme.palette.primary.main;
  const TEAL = theme.palette.secondary.main;

  const [open, setOpen] = useState(false);
  const [loadingInit, setLoadingInit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const [grades, setGrades] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [fonctions, setFonctions] = useState([]);
  const [servicesFlat, setServicesFlat] = useState([]);
  const [selectedServiceDetails, setSelectedServiceDetails] = useState(null);
  const [form, setForm] = useState(initialForm);

  // ── Snackbar ────────────────────────────────────────────────
  const showSnackbar = (message, severity = "success") =>
    setSnackbar({ open: true, message, severity });
  const closeSnackbar = () => setSnackbar((prev) => ({ ...prev, open: false }));

  const setField = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setSelectedServiceDetails(null);
    setForm(initialForm);
  };

  // ── Progression ─────────────────────────────────────────────
  const requiredFields = ["NomPersonne", "PrenomPersonne", "Email", "DateEntreeDate", "AdresseID", "ServiceID"];
  const filledCount = requiredFields.filter((f) => {
    if (f === "DateEntreeDate") return !!form.DateEntreeDate;
    return !!form[f];
  }).length;
  const progressPct = Math.round((filledCount / requiredFields.length) * 100);

  // ── Dérivés ─────────────────────────────────────────────────
  const selectedFonction = useMemo(
    () =>
      fonctions.find(
        (f) => String(f.IDFonction ?? f.IdFonction) === String(form.FonctionID)
      ) || null,
    [fonctions, form.FonctionID]
  );
  const codesDisponibles = useMemo(() => selectedFonction?.Codes || [], [selectedFonction]);

  // ── Preview ─────────────────────────────────────────────────
  const showPreview = form.NomPersonne && form.PrenomPersonne && form.Email;
  const previewInitials =
    `${form.NomPersonne.charAt(0)}${form.PrenomPersonne.charAt(0)}`.toUpperCase();
  const previewServiceLabel =
    selectedServiceDetails?.label?.replace(/^[-— ]+/, "") || "";

  // ── Chargement à l'ouverture ────────────────────────────────
  useEffect(() => {
    if (!open || !IDPersonneService) return;
    let mounted = true;

    (async () => {
      setLoadingInit(true);
      try {
        const [
          personRes,
          gradesRes,
          addrRes,
          affectServicesRes,  // liste imbriquée → ServiceTreeSelect
          infosServicesRes,   // liste plate → enrichWithChefDepartement
          fonctionsRes,
        ] = await Promise.all([
          PersonnelService.getById(IDPersonneService),
          PersonnelService.getGrades(),
          PersonnelService.getAdresses(),
          serviceService.getAll(),          // ← même API qu'AjoutFormComponent
          PersonnelService.getServices(),   // ← pour enrichWithChefDepartement
          PersonnelService.getFonctions(),
        ]);

        if (!mounted) return;

        // ── Listes de référence ──
        const gradesData = Array.isArray(gradesRes?.data) ? gradesRes.data : [];
        const addressesData = Array.isArray(addrRes?.data) ? addrRes.data : [];
        const fonctionsData = Array.isArray(fonctionsRes?.data) ? fonctionsRes.data : [];

        // ── Build servicesFlat (copie exacte de AjoutFormComponent) ──
        const flat = buildFlatOptions(affectServicesRes?.data || []);
        const enriched = enrichWithChefDepartement(flat, infosServicesRes?.data || []);

        setGrades(gradesData);
        setAddresses(addressesData);
        setFonctions(fonctionsData);
        setServicesFlat(enriched);

        // ── Données de la personne ──
        const p = personRes?.data || {};
        const rawDate = p.DateEntreeDate || p.DateEntree || null;
        const parsedDate = rawDate ? dayjs(rawDate) : null;

        // Grade
        const gradeIdDirect = p.WWGradeID ?? p.IDWWGrade ?? p.IdWWGrade ?? p.GradeID ?? "";
        const gradeFound =
          gradesData.find((g) =>
            String(g.IDWWGrade ?? g.WWGradeID ?? g.IdWWGrade) === String(gradeIdDirect)
          ) ||
          gradesData.find(
            (g) =>
              clean(g.NomWWGradeFr) === clean(p.NomWWGradeFr) ||
              clean(g.NomWWGradeNl) === clean(p.NomWWGradeNl) ||
              clean(g.NomGradeFr) === clean(p.NomGradeFr)
          ) ||
          null;
        const finalGradeId =
          gradeFound?.IDWWGrade ?? gradeFound?.WWGradeID ?? gradeFound?.IdWWGrade ?? "";

        // Adresse
        const adresseIdDirect = p.AdresseID ?? p.IDAdresse ?? p.IdAdresse ?? "";
        const personNomRueFr = clean(p.NomRueFr);
        const personNomRueNl = clean(p.NomRueNl);
        const personNumero = clean(p.Numero);
        const personBatiment = clean(p.Batiment);
        const personEtage = clean(p.Etage);
        const personAdresseTexte = clean(
          [p.NomRueFr, p.Numero, p.Batiment, p.Etage].filter(Boolean).join(" ")
        );
        const addressFound =
          addressesData.find((a) => String(a.IDAdresse) === String(adresseIdDirect)) ||
          addressesData.find(
            (a) =>
              clean(a.AdresseComplete) === clean(p.AdresseComplete) ||
              clean(a.AdresseComplete) === personAdresseTexte
          ) ||
          addressesData.find(
            (a) =>
              clean(a.NomRueFr) === personNomRueFr && clean(a.Numero) === personNumero
          ) ||
          addressesData.find(
            (a) =>
              clean(a.NomRueNl) === personNomRueNl && clean(a.Numero) === personNumero
          ) ||
          addressesData.find(
            (a) =>
              clean(a.NomRueFr) === personNomRueFr &&
              clean(a.Numero) === personNumero &&
              clean(a.Batiment) === personBatiment
          ) ||
          addressesData.find(
            (a) =>
              clean(a.NomRueFr) === personNomRueFr &&
              clean(a.Numero) === personNumero &&
              clean(a.Batiment) === personBatiment &&
              clean(a.Etage) === personEtage
          ) ||
          null;
        const finalAdresseId = addressFound?.IDAdresse ?? "";

        // Service — recherche dans servicesFlat par realServiceId
        const serviceIdDirect = p.ServiceID ?? p.IDService ?? p.IdService ?? "";
        const serviceOptFound =
          enriched.find(
            (s) => String(s.realServiceId) === String(serviceIdDirect)
          ) ||
          enriched.find(
            (s) =>
              clean(s.label.replace(/^[-— ]+/, "")) === clean(p.NomServiceFr) ||
              clean(s.label.replace(/^[-— ]+/, "")) === clean(p.NomServiceNl)
          ) ||
          null;

        // Fonction
        const fonctionIdDirect = p.FonctionID ?? p.IDFonction ?? p.IdFonction ?? "";
        const fonctionFound =
          fonctionsData.find((f) =>
            String(f.IDFonction ?? f.IdFonction) === String(fonctionIdDirect)
          ) ||
          fonctionsData.find(
            (f) =>
              clean(f.NomFonctionFr) === clean(p.NomFonctionFr) ||
              clean(f.NomFonctionNl) === clean(p.NomFonctionNl) ||
              clean(f.LibelleFonctionFr) === clean(p.LibelleFonctionFr)
          ) ||
          null;
        const finalFonctionId =
          fonctionFound?.IDFonction ?? fonctionFound?.IdFonction ?? "";

        // Code
        const codeIdDirect = p.CodeID ?? p.IDCode ?? p.Idcode ?? "";
        const codesSource = fonctionFound?.Codes || [];
        const codeFound =
          codesSource.find(
            (c) => String(c.Idcode ?? c.IDCode) === String(codeIdDirect)
          ) ||
          codesSource.find(
            (c) =>
              clean(c.NomCode) === clean(p.NomCode) ||
              clean(c.Code) === clean(p.Code)
          ) ||
          null;
        const finalCodeId = codeFound?.Idcode ?? codeFound?.IDCode ?? "";

        if (serviceOptFound) setSelectedServiceDetails(serviceOptFound);

        setForm({
          IDPersonneService: p.IDPersonneService ?? IDPersonneService,
          PersonneID: p.PersonneID ?? null,
          NomPersonne: p.NomPersonne || "",
          PrenomPersonne: p.PrenomPersonne || "",
          Email: p.Email || "",
          TelPro: p.TelPro || "",
          DateEntreeDate: parsedDate && parsedDate.isValid() ? parsedDate : null,
          WWGradeID: finalGradeId,
          AdresseID: finalAdresseId,
          serviceValue: serviceOptFound?.value ?? "",
          ServiceID: serviceOptFound?.realServiceId ?? "",
          FonctionID: finalFonctionId,
          CodeID: finalCodeId,
          SiFrancais: p.SiFrancais ?? true,
          SiTypePersonnel: p.SiTypePersonnel ?? false,
          TypePersonnelID: p.TypePersonnelID ?? "",
        });
      } catch (e) {
        console.error("Erreur chargement Edit :", e?.response?.data || e?.message);
        showSnackbar("Erreur lors du chargement des données.", "error");
      } finally {
        if (mounted) setLoadingInit(false);
      }
    })();

    return () => { mounted = false; };
  }, [open, IDPersonneService]);

  // ── Validation ──────────────────────────────────────────────
  const validate = () => {
    if (!form.NomPersonne) return "Nom obligatoire";
    if (!form.PrenomPersonne) return "Prénom obligatoire";
    if (!form.Email) return "E-mail obligatoire";
    if (!form.AdresseID) return "Adresse obligatoire";
    if (!form.ServiceID) return "Service obligatoire";
    return "";
  };

  // ── Submit ──────────────────────────────────────────────────
  const handleSubmit = async () => {
    const err = validate();
    if (err) { showSnackbar(err, "error"); return; }
    if (!form.PersonneID) {
      showSnackbar("PersonneID manquant (impossible de sauvegarder).", "error");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        IDPersonneService: form.IDPersonneService,
        PersonneID: form.PersonneID,
        NomPersonne: form.NomPersonne,
        PrenomPersonne: form.PrenomPersonne,
        Email: form.Email,
        TelPro: form.TelPro || null,
        DateEntree: form.DateEntreeDate
          ? dayjs(form.DateEntreeDate).format("YYYY-MM-DD")
          : null,
        WWGradeID: form.WWGradeID || null,
        AdresseID: form.AdresseID,
        ServiceID: form.ServiceID,       // realServiceId
        SousServiceID: form.SousServiceID || null,
        FonctionID: form.FonctionID || null,
        CodeID: form.CodeID || null,
        SiFrancais: form.SiFrancais,
        SiTypePersonnel: form.SiTypePersonnel,
        TypePersonnelID: form.SiTypePersonnel ? form.TypePersonnelID : null,
      };

      await PersonnelService.update(form.IDPersonneService, payload);
      PersonnelService.clearCaches?.();
      showSnackbar("Modifications enregistrées !", "success");
      handleClose();
      if (typeof refreshData === "function") await refreshData();
    } catch (e) {
      console.error("Erreur sauvegarde Edit :", e?.response?.data || e?.message);
      showSnackbar("Une erreur est survenue lors de l'enregistrement.", "error");
    } finally {
      setSaving(false);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────
  return (
    <>
      {/* Bouton déclencheur */}
      <IconButton size="small" title="Éditer" onClick={handleOpen} sx={{ ml: 0.5 }}>
        <RiFileEditFill style={{ fontSize: 18 }} />
      </IconButton>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">

        {/* ── Header ── */}
        <DialogTitle
          sx={{ pb: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 36, height: 36, borderRadius: 2,
                background: "#e0f7f7",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <RiFileEditFill style={{ fontSize: 18, color: TEAL }} />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={600}>Éditer un membre</Typography>
              <Typography variant="body2" color="text.secondary">
                {filledCount} / {requiredFields.length} champs obligatoires remplis
              </Typography>
            </Box>
          </Stack>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        {/* ── Barre de progression ── */}
        <Box sx={{ px: 3, pb: 1 }}>
          <LinearProgress
            variant="determinate"
            value={progressPct}
            sx={{
              height: 4, borderRadius: 99, bgcolor: "rgba(0,0,0,0.06)",
              "& .MuiLinearProgress-bar": {
                bgcolor: progressPct === 100 ? TEAL : PRIMARY,
                borderRadius: 99,
              },
            }}
          />
        </Box>

        <DialogContent dividers sx={{ bgcolor: "background.paper" }}>
          {loadingInit ? (
            <Stack direction="row" alignItems="center" spacing={2} p={3}>
              <CircularProgress size={20} />
              <Typography>Chargement des données...</Typography>
            </Stack>
          ) : (
            <Stack spacing={0} sx={{ p: 1 }}>

              {/* ══ Identité ══ */}
              <SectionTitle icon={<PersonIcon sx={{ fontSize: 14 }} />} label="Identité" />
              <Grid container spacing={2} mb={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Nom" required fullWidth size="small"
                    value={form.NomPersonne}
                    onChange={(e) => setField("NomPersonne", e.target.value)}
                    InputProps={{
                      endAdornment: form.NomPersonne
                        ? <CheckCircleOutlineIcon sx={{ fontSize: 16, color: TEAL }} />
                        : null,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Prénom" required fullWidth size="small"
                    value={form.PrenomPersonne}
                    onChange={(e) => setField("PrenomPersonne", e.target.value)}
                    InputProps={{
                      endAdornment: form.PrenomPersonne
                        ? <CheckCircleOutlineIcon sx={{ fontSize: 16, color: TEAL }} />
                        : null,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Téléphone" fullWidth size="small"
                    value={form.TelPro}
                    onChange={(e) => setField("TelPro", e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="E-mail" required fullWidth size="small"
                    value={form.Email}
                    onChange={(e) => setField("Email", e.target.value)}
                    sx={{
                      "& .MuiInputBase-root": {
                        bgcolor: form.Email ? "rgba(2,178,175,0.05)" : "action.hover",
                      },
                    }}
                    InputProps={{
                      endAdornment: form.Email
                        ? <CheckCircleOutlineIcon sx={{ fontSize: 16, color: TEAL }} />
                        : null,
                    }}
                  />
                </Grid>
              </Grid>

              {/* ══ Affectation ══ */}
              <SectionTitle
                icon={<CalendarTodayIcon sx={{ fontSize: 14 }} />}
                label="Affectation"
              />
              <Grid container spacing={2} mb={2}>

                {/* Date */}
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Date d'entrée"
                      value={form.DateEntreeDate}
                      onChange={(val) => setField("DateEntreeDate", val)}
                      slotProps={{
                        textField: { required: true, fullWidth: true, size: "small" },
                      }}
                    />
                  </LocalizationProvider>
                </Grid>

                {/* Grade */}
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    size="small"
                    options={grades}
                    getOptionLabel={(o) => o?.NomWWGradeFr || o?.NomWWGradeNl || ""}
                    value={
                      grades.find(
                        (g) =>
                          String(g.IDWWGrade ?? g.WWGradeID ?? g.IdWWGrade) ===
                          String(form.WWGradeID)
                      ) || null
                    }
                    isOptionEqualToValue={(o, v) =>
                      String(o.IDWWGrade ?? o.WWGradeID ?? o.IdWWGrade) ===
                      String(v.IDWWGrade ?? v.WWGradeID ?? v.IdWWGrade)
                    }
                    onChange={(_, nv) =>
                      setField("WWGradeID", nv ? (nv.IDWWGrade ?? nv.WWGradeID ?? nv.IdWWGrade) : "")
                    }
                    renderOption={(props, o) => (
                      <li {...props} key={`grade-${o.IDWWGrade ?? o.WWGradeID ?? o.IdWWGrade}`}>
                        {o?.NomWWGradeFr || o?.NomWWGradeNl || "Sans libellé"}
                      </li>
                    )}
                    renderInput={(params) => <TextField {...params} label="Grade" fullWidth />}
                  />
                </Grid>

                {/* Adresse */}
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    size="small"
                    options={addresses}
                    getOptionLabel={(o) => o?.AdresseComplete || ""}
                    value={
                      addresses.find(
                        (a) => String(a.IDAdresse) === String(form.AdresseID)
                      ) || null
                    }
                    isOptionEqualToValue={(o, v) =>
                      String(o.IDAdresse) === String(v.IDAdresse)
                    }
                    onChange={(_, nv) => setField("AdresseID", nv ? nv.IDAdresse : "")}
                    renderOption={(props, o) => (
                      <li {...props} key={`adresse-${o.IDAdresse}`}>
                        {o?.AdresseComplete || "Sans libellé"}
                      </li>
                    )}
                    renderInput={(params) => (
                      <TextField {...params} label="Adresse *" fullWidth />
                    )}
                  />
                </Grid>

                {/* ── ServiceTreeSelect ── identique à AjoutFormComponent ── */}
                <Grid item xs={12} sm={6}>
                  <ServiceTreeSelect
                    servicesFlat={servicesFlat}
                    value={
                      servicesFlat.find((s) => s.value === form.serviceValue) || null
                    }
                 onChange={(nv) => {
  if (!nv) {
    setField("serviceValue", "");
    setField("ServiceID", "");
    setField("SousServiceID", "");
    setSelectedServiceDetails(null);
    return;
  }

  setField("serviceValue", nv.value);

  // Service racine
  const finalServiceId =
    nv.type === "service"
      ? nv.realServiceId
      : nv.parentServiceId;

  // Sous-service
  const finalSousServiceId =
    nv.type === "child"
      ? nv.parentSousServiceId
      : nv.type === "sousService"
        ? nv.realServiceId
        : null;

  setField("ServiceID", finalServiceId);
  setField("SousServiceID", finalSousServiceId);

  setSelectedServiceDetails(nv);
}}
                    required
                  />
                </Grid>

                {/* Détails service */}
                {selectedServiceDetails && (
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        p: 1.5, borderRadius: 2, bgcolor: "action.hover",
                        border: "1px solid", borderColor: "divider",
                        display: "flex", gap: 3, flexWrap: "wrap",
                      }}
                    >
                      <Typography variant="body2">
                        <strong>Chef Département :</strong>{" "}
                        {selectedServiceDetails.nomChefDepartement || "-"}{" "}
                        {selectedServiceDetails.prenomChefDepartement || ""}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Chef Service :</strong>{" "}
                        {selectedServiceDetails.nomChefService || "-"}{" "}
                        {selectedServiceDetails.prenomChefService || ""}
                      </Typography>
                      {selectedServiceDetails.nomSousChef && (
                        <Typography variant="body2">
                          <strong>Sous-chef :</strong>{" "}
                          {selectedServiceDetails.nomSousChef}{" "}
                          {selectedServiceDetails.prenomSousChef || ""}
                        </Typography>
                      )}
                    </Box>
                  </Grid>
                )}
              </Grid>

              {/* ══ Fonction ══ */}
              <SectionTitle icon={<WorkIcon sx={{ fontSize: 14 }} />} label="Fonction" />
              <Grid container spacing={2} mb={2}>
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    size="small"
                    options={fonctions}
                    getOptionLabel={(o) => o?.NomFonctionFr || o?.NomFonctionNl || ""}
                    value={
                      fonctions.find(
                        (f) =>
                          String(f.IDFonction ?? f.IdFonction) === String(form.FonctionID)
                      ) || null
                    }
                    isOptionEqualToValue={(o, v) =>
                      String(o.IDFonction ?? o.IdFonction) ===
                      String(v.IDFonction ?? v.IdFonction)
                    }
                    onChange={(_, nv) => {
                      setField("FonctionID", nv ? (nv.IDFonction ?? nv.IdFonction) : "");
                      setField("CodeID", "");
                    }}
                    renderOption={(props, o) => (
                      <li {...props} key={`fonction-${o.IDFonction ?? o.IdFonction}`}>
                        {o?.NomFonctionFr || o?.NomFonctionNl || "Sans libellé"}
                      </li>
                    )}
                    renderInput={(params) => (
                      <TextField {...params} label="Fonction" fullWidth />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Tooltip
                    title={!selectedFonction ? "Sélectionnez d'abord une fonction" : ""}
                    placement="top"
                  >
                    <span>
                      <Autocomplete
                        size="small"
                        options={codesDisponibles}
                        disabled={!selectedFonction}
                        getOptionLabel={(o) => o?.NomCode || ""}
                        value={
                          codesDisponibles.find(
                            (c) =>
                              String(c.Idcode ?? c.IDCode) === String(form.CodeID)
                          ) || null
                        }
                        isOptionEqualToValue={(o, v) =>
                          String(o.Idcode ?? o.IDCode) === String(v.Idcode ?? v.IDCode)
                        }
                        onChange={(_, nv) =>
                          setField("CodeID", nv ? (nv.Idcode ?? nv.IDCode) : "")
                        }
                        renderOption={(props, o) => (
                          <li {...props} key={`code-${o.Idcode ?? o.IDCode}`}>
                            {o?.NomCode || "Sans libellé"}
                          </li>
                        )}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Code fonction"
                            fullWidth
                            sx={{
                              "& .MuiInputBase-root": {
                                bgcolor: !selectedFonction
                                  ? "action.disabledBackground"
                                  : "transparent",
                              },
                            }}
                          />
                        )}
                      />
                    </span>
                  </Tooltip>
                </Grid>
              </Grid>

              {/* ══ Paramètres ══ */}
              <SectionTitle icon={<SettingsIcon sx={{ fontSize: 14 }} />} label="Paramètres" />
              <Grid container spacing={2} mb={1}>
                <Grid item xs={12} sm={6}>
                  <FormControl>
                    <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500, color: PRIMARY }}>
                      Personnel
                    </Typography>
                    <RadioGroup
                      row
                      value={form.SiTypePersonnel ? "true" : "false"}
                      onChange={(e) =>
                        setField("SiTypePersonnel", e.target.value === "true")
                      }
                    >
                      <FormControlLabel value="true" control={<Radio size="small" />} label="Oui" />
                      <FormControlLabel value="false" control={<Radio size="small" />} label="Non" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl>
                    <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500, color: PRIMARY }}>
                      Langue
                    </Typography>
                    <RadioGroup
                      row
                      value={form.SiFrancais ? "true" : "false"}
                      onChange={(e) => setField("SiFrancais", e.target.value === "true")}
                    >
                      <FormControlLabel value="true" control={<Radio size="small" />} label="FR" />
                      <FormControlLabel value="false" control={<Radio size="small" />} label="NL" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>

              {/* ══ Aperçu membre ══ */}
              {showPreview && (
                <Box
                  sx={{
                    mt: 1, p: 1.5, borderRadius: 2,
                    border: "1px solid", borderColor: TEAL,
                    bgcolor: "rgba(2,178,175,0.04)",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 11, fontWeight: 600, color: TEAL,
                      textTransform: "uppercase", letterSpacing: "0.06em", mb: 0.8,
                    }}
                  >
                    Aperçu du membre
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Box
                      sx={{
                        width: 36, height: 36, borderRadius: "50%",
                        bgcolor: "#E6F1FB", color: PRIMARY,
                        fontSize: 12, fontWeight: 700,
                        display: "flex", alignItems: "center",
                        justifyContent: "center", flexShrink: 0,
                      }}
                    >
                      {previewInitials}
                    </Box>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: PRIMARY }}>
                        {form.NomPersonne.toUpperCase()} {form.PrenomPersonne}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {form.Email}
                        {previewServiceLabel ? ` · ${previewServiceLabel}` : ""}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              )}

            </Stack>
          )}
        </DialogContent>

        {/* ── Footer ── */}
        <DialogActions sx={{ px: 3, py: 1.5, justifyContent: "space-between" }}>
          <Typography variant="body2" color="text.secondary">
            <span style={{ color: "#d32f2f" }}>*</span> Champs obligatoires
          </Typography>
          <Stack direction="row" spacing={1}>
            <Button onClick={handleClose} color="inherit" disabled={saving || loadingInit}>
              Annuler
            </Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              disabled={saving || loadingInit}
            >
              {saving ? "Enregistrement..." : "Valider"}
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>

      {/* ── Snackbar ── */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={closeSnackbar} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

EditFormComponent.propTypes = {
  IDPersonneService: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  refreshData: PropTypes.func,
};

export default EditFormComponent;