import { useEffect, useMemo, useState, forwardRef } from "react";
import PropTypes from "prop-types";
import dayjs from "dayjs";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  Grid,
  CircularProgress,
  IconButton,
} from "@mui/material";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";

import PersonnelService from "../../services/PersonnelService";

const FormServiceComponent = forwardRef(function FormServiceComponent(
  { IDPersonneService, refreshData, ...props },
  ref
) {
  const [open, setOpen] = useState(false);
  const [loadingInit, setLoadingInit] = useState(false);
  const [saving, setSaving] = useState(false);

  const [grades, setGrades] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [otherServices, setOtherServices] = useState([]);

  const initialForm = {
    NomPersonne: "",
    PrenomPersonne: "",
    NomServiceFr: "",
    TelPro: "",
    Email: "",
    DateEntree: null,
    WWGradeID: "",
    AdresseID: "",
    ServiceID: "",
    SiFrancais: true,
  };

  const [form, setForm] = useState(initialForm);

  const selectedServiceDetails = useMemo(() => {
    return (
      otherServices.find((s) => String(s.IDService) === String(form.ServiceID)) ||
      null
    );
  }, [otherServices, form.ServiceID]);

  const setField = (name, value) =>
    setForm((prev) => ({ ...prev, [name]: value }));

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setForm(initialForm);
  };

  //  Chargement: personne + référentiels (via PersonnelService)
  useEffect(() => {
    if (!open || !IDPersonneService) return;
    let mounted = true;

    (async () => {
      setLoadingInit(true);
      try {
        const [personRes, gradesRes, addrRes, servicesRes] = await Promise.all([
          PersonnelService.getById(IDPersonneService),
          PersonnelService.getGrades(),
          PersonnelService.getAdresses(),
          PersonnelService.getServices(),
        ]);

        if (!mounted) return;

        setGrades(Array.isArray(gradesRes?.data) ? gradesRes.data : []);
        setAddresses(Array.isArray(addrRes?.data) ? addrRes.data : []);
        setOtherServices(Array.isArray(servicesRes?.data) ? servicesRes.data : []);

        const p = personRes?.data || {};
        setForm((prev) => ({
          ...prev,
          NomPersonne: p.NomPersonne || "",
          PrenomPersonne: p.PrenomPersonne || "",
          NomServiceFr: p.NomServiceFr || "",
          Email: p.Email || "",
          TelPro: p.TelPro || "",
        }));
      } catch (e) {
        console.error("Erreur chargement:", e);
      } finally {
        if (mounted) setLoadingInit(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [open, IDPersonneService]);

  const validate = () => {
    if (!form.Email) return "E-mail obligatoire";
    if (!form.DateEntree) return "Date d'entrée obligatoire";
    if (!form.WWGradeID) return "Grade obligatoire";
    if (!form.AdresseID) return "Adresse obligatoire";
    if (!form.ServiceID) return "Service supplémentaire obligatoire";
    return "";
  };

  //  Submit via PersonnelService.create (comme ton code axios.post)
  const handleSubmit = async () => {
    const err = validate();
    if (err) {
      alert(err);
      return;
    }

    setSaving(true);
    try {
      const payload = {
        NomPersonne: form.NomPersonne,
        PrenomPersonne: form.PrenomPersonne,
        Email: form.Email?.trim(),
        TelPro: form.TelPro ? String(form.TelPro).trim() : null,
        DateEntree: form.DateEntree
          ? dayjs(form.DateEntree).format("YYYY-MM-DD")
          : null,

        WWGradeID: form.WWGradeID ? Number(form.WWGradeID) : 0,
        AdresseID: form.AdresseID ? Number(form.AdresseID) : null,
        ServiceID: form.ServiceID ? Number(form.ServiceID) : null,

        SiFrancais: !!form.SiFrancais,

        // on garde le même comportement (tu avais false / null)
        SiTypePersonnel: false,
        TypePersonnelID: 0,
        SiArchive: false,
      };

      await PersonnelService.create(payload);

      //  évite sessionStorage.clear() (trop violent)
      PersonnelService.clearCaches?.();

      alert("Ajout réussi !");
      setOpen(false);

      if (typeof refreshData === "function") {
        await refreshData();
      }
    } catch (e) {
      console.error("Erreur envoi:", e);
      alert("Erreur lors de l'ajout.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div ref={ref} {...props} style={{ display: "inline-block" }}>
      <IconButton size="small" onClick={handleOpen}>
        <MedicalServicesIcon fontSize="small" color="primary" />
      </IconButton>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>Ajouter un service supplémentaire</DialogTitle>

        <DialogContent dividers>
          {loadingInit ? (
            <Stack direction="row" alignItems="center" spacing={2} p={3}>
              <CircularProgress size={24} />
              <Typography>Chargement des ressources...</Typography>
            </Stack>
          ) : (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Nom"
                    value={form.NomPersonne}
                    fullWidth
                    disabled
                    size="small"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Prénom"
                    value={form.PrenomPersonne}
                    fullWidth
                    disabled
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
                      value={form.DateEntree}
                      onChange={(val) => setField("DateEntree", val)}
                      slotProps={{
                        textField: { fullWidth: true, size: "small" },
                      }}
                    />
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Grade</InputLabel>
                    <Select
                      label="Grade"
                      value={form.WWGradeID}
                      onChange={(e) => setField("WWGradeID", e.target.value)}
                    >
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
                    <InputLabel>Service supplémentaire</InputLabel>
                    <Select
                      label="Service supplémentaire"
                      value={form.ServiceID}
                      onChange={(e) => setField("ServiceID", e.target.value)}
                    >
                      {otherServices.map((s) => (
                        <MenuItem key={s.IDService} value={s.IDService}>
                          {s.NomServiceFr}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Adresse d&apos;affectation</InputLabel>
                    <Select
                      label="Adresse d'affectation"
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
              </Grid>

              {selectedServiceDetails ? (
                <Box sx={{ p: 2, bgcolor: "action.hover", borderRadius: 1 }}>
                  <Typography variant="subtitle2" color="primary">
                    Détails du service sélectionné :
                  </Typography>
                  <Typography variant="body2">
                    Chef: {selectedServiceDetails.NomChefService}{" "}
                    {selectedServiceDetails.PrenomChefService}
                  </Typography>
                </Box>
              ) : null}
            </Stack>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="inherit" disabled={saving}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} variant="contained" disabled={saving}>
            {saving ? "Enregistrement..." : "Valider"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
});

FormServiceComponent.propTypes = {
  IDPersonneService: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  refreshData: PropTypes.func,
};

FormServiceComponent.displayName = "FormServiceComponent";

export default FormServiceComponent;