import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { RiFileEditFill } from "react-icons/ri";

import {
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

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { LIEN_API_PERSONNE } from "../../config";

function EditFormComponent({ IDPersonneService, refreshData }) {
  const [open, setOpen] = useState(false);
  const [loadingInit, setLoadingInit] = useState(false);
  const [saving, setSaving] = useState(false);

  const [grades, setGrades] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [services, setServices] = useState([]);
  const [typePersonnelList, setTypePersonnelList] = useState([]);

  const initialForm = {
    IDPersonneService: null,
    PersonneID: null,
    NomPersonne: "",
    PrenomPersonne: "",
    Email: "",
    TelPro: "",
    DateEntreeDate: null, // dayjs
    WWGradeID: "",
    AdresseID: "",
    ServiceID: "",
    SiFrancais: true,
    SiTypePersonnel: false, // personnel?
    TypePersonnelID: "",
  };

  const [form, setForm] = useState(initialForm);

  const selectedServiceDetails = useMemo(() => {
    return services.find((s) => s.IDService === form.ServiceID) || null;
  }, [services, form.ServiceID]);

  const setField = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setForm(initialForm);
  };

  // Load when dialog opens
  useEffect(() => {
    if (!open || !IDPersonneService) return;

    let mounted = true;

    (async () => {
      setLoadingInit(true);
      try {
        const [personRes, gradesRes, addrRes, typeRes, servicesRes] =
          await Promise.all([
            axios.get(`${LIEN_API_PERSONNE}/api/Personne/${IDPersonneService}`),
            axios.get(`${LIEN_API_PERSONNE}/api/wwgrades`),
            axios.get(`${LIEN_API_PERSONNE}/api/Adresses`),
            axios.get(`${LIEN_API_PERSONNE}/api/typepersonnel`),
            axios.get(`${LIEN_API_PERSONNE}/api/affectation/services`),
          ]);

        if (!mounted) return;

        setGrades(gradesRes.data || []);
        setAddresses(addrRes.data || []);
        setTypePersonnelList(typeRes.data || []);
        setServices(servicesRes.data || []);

        const p = personRes.data || {};

        // Date: certaines APIs donnent DateEntreeDate ou DateEntree — on gère les 2
        const rawDate = p.DateEntreeDate || p.DateEntree || null;
        const parsedDate = rawDate ? dayjs(rawDate) : null;

        setForm({
          IDPersonneService: p.IDPersonneService ?? IDPersonneService,
          PersonneID: p.PersonneID ?? null,
          NomPersonne: p.NomPersonne || "",
          PrenomPersonne: p.PrenomPersonne || "",
          Email: p.Email || "",
          TelPro: p.TelPro || "",
          DateEntreeDate: parsedDate && parsedDate.isValid() ? parsedDate : null,
          WWGradeID: p.WWGradeID ?? "",
          AdresseID: p.AdresseID ?? "",
          ServiceID: p.ServiceID ?? "",
          SiFrancais: p.SiFrancais ?? true,
          SiTypePersonnel: p.SiTypePersonnel ?? false,
          TypePersonnelID: p.TypePersonnelID ?? "",
        });
      } catch (e) {
        console.error("Erreur chargement Edit:", e?.response?.data || e?.message);
        alert("Erreur lors du chargement des données.");
      } finally {
        if (mounted) setLoadingInit(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [open, IDPersonneService]);

  const validate = () => {
    if (!form.NomPersonne) return "Nom obligatoire";
    if (!form.PrenomPersonne) return "Prénom obligatoire";
    if (!form.Email) return "E-mail obligatoire";
    if (!form.AdresseID) return "Adresse obligatoire";
    if (!form.ServiceID) return "Service obligatoire";
    if (form.SiTypePersonnel && !form.TypePersonnelID) return "Type de personnel obligatoire";
    return "";
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) {
      alert(err);
      return;
    }

    if (!form.PersonneID) {
      alert("PersonneID manquant (impossible de sauvegarder).");
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

        // API attendait un ISO dans ton ancien code
        DateEntree: form.DateEntreeDate ? dayjs(form.DateEntreeDate).toISOString() : null,

        WWGradeID: form.WWGradeID || null,
        AdresseID: form.AdresseID,
        ServiceID: form.ServiceID,

        SiFrancais: form.SiFrancais,
        SiTypePersonnel: form.SiTypePersonnel,
        TypePersonnelID: form.SiTypePersonnel ? form.TypePersonnelID : null,

        // Tu avais aussi SiServicePrincipal dans l'ancien code,
        // mais il n'est pas présent dans le formulaire => on ne l'envoie pas.
      };

      const url = `${LIEN_API_PERSONNE}/api/personne/edit?id=${form.PersonneID}`;
      const res = await axios.put(url, payload, {
        headers: { "Content-Type": "application/json" },
      });

      if (res.status !== 200) throw new Error("Échec de l'enregistrement");

      alert("Les modifications ont été enregistrées avec succès !");
      setOpen(false);

      if (typeof refreshData === "function") {
        await refreshData();
      }
    } catch (e) {
      console.error("Erreur sauvegarde Edit:", e?.response?.data || e?.message);
      alert("Une erreur est survenue lors de l’enregistrement.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <IconButton size="small" title="Éditer" onClick={handleOpen} sx={{ ml: 0.5 }}>
        <RiFileEditFill style={{ fontSize: 18 }} />
      </IconButton>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>Éditer</DialogTitle>

        <DialogContent dividers>
          {loadingInit ? (
            <Stack direction="row" alignItems="center" spacing={2}>
              <CircularProgress size={20} />
              <Typography>Chargement…</Typography>
            </Stack>
          ) : (
            <Stack spacing={2}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Nom"
                    value={form.NomPersonne}
                    onChange={(e) => setField("NomPersonne", e.target.value)}
                    fullWidth
                    size="small"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Prénom"
                    value={form.PrenomPersonne}
                    onChange={(e) => setField("PrenomPersonne", e.target.value)}
                    fullWidth
                    size="small"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Téléphone"
                    value={form.TelPro}
                    onChange={(e) => setField("TelPro", e.target.value)}
                    fullWidth
                    size="small"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="E-mail"
                    value={form.Email}
                    onChange={(e) => setField("Email", e.target.value)}
                    fullWidth
                    size="small"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Date d'entrée"
                      value={form.DateEntreeDate}
                      onChange={(val) => setField("DateEntreeDate", val)}
                      slotProps={{ textField: { fullWidth: true, size: "small" } }}
                    />
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="grade-label">Grade</InputLabel>
                    <Select
                      labelId="grade-label"
                      label="Grade"
                      value={form.WWGradeID}
                      onChange={(e) => setField("WWGradeID", e.target.value)}
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

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="adresse-label">Adresse</InputLabel>
                    <Select
                      labelId="adresse-label"
                      label="Adresse"
                      value={form.AdresseID}
                      onChange={(e) => setField("AdresseID", e.target.value)}
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
                  <FormControl fullWidth size="small">
                    <InputLabel id="service-label">Service</InputLabel>
                    <Select
                      labelId="service-label"
                      label="Service"
                      value={form.ServiceID}
                      onChange={(e) => setField("ServiceID", e.target.value)}
                    >
                      {services.map((s) => (
                        <MenuItem key={s.IDService} value={s.IDService}>
                          {s.NomServiceFr}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      Personnel
                    </Typography>
                    <RadioGroup
                      row
                      value={form.SiTypePersonnel ? "true" : "false"}
                      onChange={(e) => setField("SiTypePersonnel", e.target.value === "true")}
                    >
                      <FormControlLabel value="true" control={<Radio />} label="Oui" />
                      <FormControlLabel value="false" control={<Radio />} label="Non" />
                    </RadioGroup>
                  </FormControl>

                  {form.SiTypePersonnel && (
                    <FormControl fullWidth size="small" sx={{ mt: 2 }}>
                      <InputLabel id="typep-label">Type de personnel</InputLabel>
                      <Select
                        labelId="typep-label"
                        label="Type de personnel"
                        value={form.TypePersonnelID}
                        onChange={(e) => setField("TypePersonnelID", e.target.value)}
                      >
                        {typePersonnelList.map((tp) => (
                          <MenuItem key={tp.IDTypePersonnel} value={tp.IDTypePersonnel}>
                            {tp.NomTypePersonnelFr}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      Langue
                    </Typography>
                    <RadioGroup
                      row
                      value={form.SiFrancais ? "true" : "false"}
                      onChange={(e) => setField("SiFrancais", e.target.value === "true")}
                    >
                      <FormControlLabel value="true" control={<Radio />} label="FR" />
                      <FormControlLabel value="false" control={<Radio />} label="NL" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>

              {selectedServiceDetails && (
                <Box sx={{ mt: 1, p: 2, borderRadius: 2, bgcolor: "action.hover" }}>
                  <Typography fontWeight={700} mb={1}>
                    Informations du service
                  </Typography>
                  <Typography variant="body2">
                    <strong>Chef du Service :</strong> {selectedServiceDetails.NomChefService}{" "}
                    {selectedServiceDetails.PrenomChefService}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Chef du Département :</strong> {selectedServiceDetails.NomChefDepartement}{" "}
                    {selectedServiceDetails.PrenomChefDepartement}
                  </Typography>
                </Box>
              )}
            </Stack>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Annuler
          </Button>
          <Button onClick={handleSubmit} variant="contained" disabled={saving || loadingInit}>
            {saving ? "Enregistrement..." : "Valider"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default EditFormComponent;
