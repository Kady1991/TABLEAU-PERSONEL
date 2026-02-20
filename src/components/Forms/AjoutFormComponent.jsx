import { useEffect, useState } from "react";
import axios from "axios";
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
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { LIEN_API_PERSONNE } from "../../config";

function AjoutFormComponent({ open, onClose, onMemberUpdate, refreshData }) {
  const [loadingInit, setLoadingInit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [grades, setGrades] = useState([]);
  const [services, setServices] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [typePersonnelList, setTypePersonnelList] = useState([]);

  const [selectedServiceDetails, setSelectedServiceDetails] = useState(null);

  const initialForm = {
    nom: "",
    prenom: "",
    telephone: "",
    email: "",
    DateEntreeDate: null, // dayjs
    grade: "",
    adresse: "",
    service: "",
    SiTypePersonnel: false, // Personnel : Oui/Non
    TypePersonnelID: "",
    siFrancais: true, // Langue
  };

  const [form, setForm] = useState(initialForm);

  const isPersonnelSelected = form.SiTypePersonnel === true;

  const setField = (name, value) =>
    setForm((prev) => ({ ...prev, [name]: value }));

  const generateEmail = (prenom, nom) => {
    if (!prenom || !nom) return "";
    const prenoms = prenom.split(/[\s-]+/);
    const noms = nom.split(/[\s-]+/);

    const firstLettersPrenom = prenoms
      .filter((p) => p.trim() !== "")
      .map((p) => p.charAt(0).toLowerCase())
      .join("");

    const nomCleaned = noms.join("").toLowerCase();
    return `${firstLettersPrenom}${nomCleaned}@uccle.brussels`;
  };

  // Charge les listes quand on ouvre
  useEffect(() => {
    if (!open) return;

    let mounted = true;

    (async () => {
      setLoadingInit(true);
      setError("");

      try {
        const [gradesRes, servicesRes, addrRes, typeRes] = await Promise.all([
          axios.get(`${LIEN_API_PERSONNE}/api/wwgrades`),
          axios.get(`${LIEN_API_PERSONNE}/api/affectation/services`),
          axios.get(`${LIEN_API_PERSONNE}/api/Adresses`),
          axios.get(`${LIEN_API_PERSONNE}/api/typepersonnel`),
        ]);

        if (!mounted) return;

        setGrades(gradesRes.data || []);
        setServices(servicesRes.data || []);
        setAddresses(addrRes.data || []);
        setTypePersonnelList(typeRes.data || []);
      } catch (e) {
        console.error(
          "Erreur chargement listes:",
          e?.response?.data || e?.message,
        );
        setError(
          "Erreur lors du chargement des listes (grades/services/adresses).",
        );
      } finally {
        if (mounted) setLoadingInit(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [open]);

  // Détails service (optionnel)
  useEffect(() => {
    if (!open) return;
    if (!form.service) {
      setSelectedServiceDetails(null);
      return;
    }

    let mounted = true;

    (async () => {
      try {
        const res = await axios.get(
          `${LIEN_API_PERSONNE}/api/affectation/${form.service}`,
        );
        if (mounted) setSelectedServiceDetails(res.data || null);
      } catch (e) {
        console.error(
          "Erreur détails service:",
          e?.response?.data || e?.message,
        );
        if (mounted) setSelectedServiceDetails(null);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [open, form.service]);

  const validate = () => {
    if (!form.nom) return "Nom obligatoire";
    if (!form.prenom) return "Prénom obligatoire";
    if (!form.email) return "Email obligatoire";
    if (!form.DateEntreeDate) return "Date d'entrée obligatoire";
    if (!form.adresse) return "Adresse obligatoire";
    if (!form.service) return "Service obligatoire";
    if (isPersonnelSelected && !form.TypePersonnelID)
      return "Type de personnel obligatoire";
    return "";
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) {
      alert(err);
      return;
    }

    setSaving(true);
    try {
      const payload = {
        NomPersonne: form.nom,
        PrenomPersonne: form.prenom,
        Email: form.email,
        TelPro: form.telephone || null,
        DateEntree: form.DateEntreeDate
          ? dayjs(form.DateEntreeDate).format("YYYY-MM-DD")
          : null,
        WWGradeID: form.grade || null,
        AdresseID: form.adresse,
        ServiceID: form.service,
        SiFrancais: form.siFrancais,
        SiTypePersonnel: form.SiTypePersonnel,
        TypePersonnelID: isPersonnelSelected ? form.TypePersonnelID : null,
        SiArchive: false,
      };

      const res = await axios.post(
        `${LIEN_API_PERSONNE}/api/Personne`,
        payload,
      );

      if (res.data === "Personne Exists") {
        alert("Cet email est déjà attribué.");
        return;
      }

      alert("Ajout réussi !");
      setForm(initialForm);

      if (typeof onMemberUpdate === "function") onMemberUpdate();
      if (typeof refreshData === "function") await refreshData();

      onClose?.();
    } catch (e) {
      console.error("Erreur ajout:", e?.response?.data || e?.message);
      alert("Erreur lors de l'envoi des données. Veuillez réessayer.");
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setForm(initialForm);
    setSelectedServiceDetails(null);
    setError("");
    onClose?.();
  };

  const handleNameChange = (nextNom, nextPrenom) => {
    const email = generateEmail(nextPrenom, nextNom);
    setField("email", email);
  };

  return (
    <Dialog open={!!open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle
        sx={{
          pb: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Stack direction="row" spacing={1.2} alignItems="center">
          <IoPersonAddSharp style={{ fontSize: 22 }} />
          <Typography variant="h1" fontWeight={700}>
            Ajouter un membre
          </Typography>
        </Stack>

        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ bgcolor: "background.paper" }}>
        {loadingInit ? (
          <Stack direction="row" alignItems="center" spacing={2}>
            <CircularProgress size={20} />
            <Typography>Chargement…</Typography>
          </Stack>
        ) : (
          <Stack spacing={2}>
            {error ? <Alert severity="error">{error}</Alert> : null}

            {/* ✅ Bloc gris comme sur ta capture */}
            <Box
              sx={{
                borderRadius: 2,
                p: 2,
                // border: "1px solid #e3e8ef",
                // backgroundColor: "#fafbfd", // très léger
              }}
            >
              <Grid container spacing={2}>
                {/* Ligne 1 : Nom / Prénom */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Nom"
                    required
                    value={form.nom}
                    onChange={(e) => {
                      const v = e.target.value;
                      setField("nom", v);
                      handleNameChange(v, form.prenom);
                    }}
                    fullWidth
                    size="small"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Prénom"
                    required
                    value={form.prenom}
                    onChange={(e) => {
                      const v = e.target.value;
                      setField("prenom", v);
                      handleNameChange(form.nom, v);
                    }}
                    fullWidth
                    size="small"
                  />
                </Grid>

                {/* Ligne 2 : Téléphone / Email */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Téléphone"
                    value={form.telephone}
                    onChange={(e) => setField("telephone", e.target.value)}
                    fullWidth
                    size="small"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email"
                    required
                    value={form.email}
                    onChange={(e) => setField("email", e.target.value)}
                    fullWidth
                    size="small"
                  />
                </Grid>

                {/* Ligne 3 : Date d'entrée / Grade */}
                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Date d'entrée"
                      value={form.DateEntreeDate}
                      onChange={(val) => setField("DateEntreeDate", val)}
                      slotProps={{
                        textField: {
                          required: true,
                          fullWidth: true,
                          size: "small",
                        },
                      }}
                    />
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="grade-label">Grade</InputLabel>
                    <Select
                      labelId="grade-label"
                      label="Grade"
                      value={form.grade}
                      onChange={(e) => setField("grade", e.target.value)}
                    >
                      <MenuItem value="">
                        <em>Aucun</em>
                      </MenuItem>
                      {grades.map((g) => (
                        <MenuItem key={g.IDWWGrade} value={g.IDWWGrade}>
                          {g.NomWWGradeFr}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Ligne 4 : Adresse / Service */}
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small" required>
                    <InputLabel id="adresse-label">Adresse</InputLabel>
                    <Select
                      labelId="adresse-label"
                      label="Adresse"
                      value={form.adresse}
                      onChange={(e) => setField("adresse", e.target.value)}
                    >
                      {addresses.map((a) => (
                        <MenuItem key={a.IDAdresse} value={a.IDAdresse}>
                          {a.AdresseComplete}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small" required>
                    <InputLabel id="service-label">Service</InputLabel>
                    <Select
                      labelId="service-label"
                      label="Service"
                      value={form.service}
                      onChange={(e) => setField("service", e.target.value)}
                    >
                      {services.map((s) => (
                        <MenuItem key={s.IDService} value={s.IDService}>
                          {s.NomServiceFr}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Ligne 5 : Personnel / Langue (comme sur ta capture) */}
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    <span style={{ color: "#d32f2f" }}>*</span> Personnel
                  </Typography>
                  <RadioGroup
                    row
                    value={form.SiTypePersonnel ? "true" : "false"}
                    onChange={(e) =>
                      setField("SiTypePersonnel", e.target.value === "true")
                    }
                  >
                    <FormControlLabel
                      value="true"
                      control={<Radio size="small" />}
                      label="Oui"
                    />
                    <FormControlLabel
                      value="false"
                      control={<Radio size="small" />}
                      label="Non"
                    />
                  </RadioGroup>

                  {isPersonnelSelected && (
                    <FormControl
                      fullWidth
                      size="small"
                      sx={{ mt: 1.5 }}
                      required
                    >
                      <InputLabel id="typep-label">
                        Type de personnel
                      </InputLabel>
                      <Select
                        labelId="typep-label"
                        label="Type de personnel"
                        value={form.TypePersonnelID}
                        onChange={(e) =>
                          setField("TypePersonnelID", e.target.value)
                        }
                      >
                        {typePersonnelList.map((tp) => (
                          <MenuItem
                            key={tp.IDTypePersonnel}
                            value={tp.IDTypePersonnel}
                          >
                            {tp.NomTypePersonnelFr}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    <span style={{ color: "#d32f2f" }}>*</span> Langue
                  </Typography>
                  <RadioGroup
                    row
                    value={form.siFrancais ? "true" : "false"}
                    onChange={(e) =>
                      setField("siFrancais", e.target.value === "true")
                    }
                  >
                    <FormControlLabel
                      value="true"
                      control={<Radio size="small" />}
                      label="FR"
                    />
                    <FormControlLabel
                      value="false"
                      control={<Radio size="small" />}
                      label="NL"
                    />
                  </RadioGroup>
                </Grid>
              </Grid>
            </Box>

            {selectedServiceDetails && (
              <Box
                sx={{ mt: 0.5, p: 2, borderRadius: 2, bgcolor: "action.hover" }}
              >
                <Typography fontWeight={700} mb={1}>
                  Détails du service
                </Typography>
                <Typography variant="body2">
                  <strong>Chef du Service :</strong>{" "}
                  {selectedServiceDetails.NomChefService}{" "}
                  {selectedServiceDetails.PrenomChefService}
                </Typography>
                <Typography variant="body2">
                  <strong>Chef du Département :</strong>{" "}
                  {selectedServiceDetails.NomChefDepartement}{" "}
                  {selectedServiceDetails.PrenomChefDepartement}
                </Typography>
              </Box>
            )}
          </Stack>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={handleClose}
          color="inherit"
          disabled={saving || loadingInit}
        >
          Annuler
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={saving || loadingInit}
        >
          {saving ? "Validation..." : "Valider"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AjoutFormComponent;
