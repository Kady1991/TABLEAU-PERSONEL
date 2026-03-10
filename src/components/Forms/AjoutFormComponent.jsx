import { useEffect, useState, forwardRef } from "react";
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

import Autocomplete from "@mui/material/Autocomplete";
import CloseIcon from "@mui/icons-material/Close";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import PersonnelService from "../../services/PersonnelService";

// IMPORTANT : sortir initialForm du composant pour éviter les warnings liés à la réinitialisation 
// du formulaire à l'ouverture du dialog (et éviter de recréer l'objet à chaque render)
const INITIAL_FORM = {
  nom: "",
  prenom: "",
  telephone: "",
  email: "",
  DateEntreeDate: null,
  grade: "",
  adresse: "",
  service: "",
  SiTypePersonnel: false,
  TypePersonnelID: "",
  siFrancais: true,
};

const AjoutFormComponent = forwardRef(
  ({ open, onClose, onMemberUpdate, refreshData }, ref) => {
    const [loadingInit, setLoadingInit] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const [grades, setGrades] = useState([]);
    const [services, setServices] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [typePersonnelList, setTypePersonnelList] = useState([]);

    const [selectedServiceDetails, setSelectedServiceDetails] = useState(null);

    const [form, setForm] = useState(INITIAL_FORM);

    const isPersonnelSelected = form.SiTypePersonnel === true;

    const setField = (name, value) =>
      setForm((prev) => ({ ...prev, [name]: value }));

    const generateEmail = (prenom, nom) => {
      if (!prenom || !nom) return "";
      const prenoms = String(prenom).split(/[\s-]+/);
      const noms = String(nom).split(/[\s-]+/);

      const firstLettersPrenom = prenoms
        .filter((p) => p.trim() !== "")
        .map((p) => p.charAt(0).toLowerCase())
        .join("");

      const nomCleaned = noms.join("").toLowerCase();
      return `${firstLettersPrenom}${nomCleaned}@uccle.brussels`;
    };

    const handleNameChange = (nextNom, nextPrenom) => {
      const email = generateEmail(nextPrenom, nextNom);
      setField("email", email);
    };

    // Reset à l'ouverture (plus de warning initialForm)
    useEffect(() => {
      if (!open) return;
      setError("");
      setSelectedServiceDetails(null);
      setForm(INITIAL_FORM);
    }, [open]);

    // Chargement listes
    useEffect(() => {
      if (!open) return;
      let mounted = true;

      (async () => {
        setLoadingInit(true);
        setError("");

        try {
          const [gradesRes, servicesRes, addrRes, typeRes] = await Promise.all([
            PersonnelService.getGrades(),
            PersonnelService.getServices(),
            PersonnelService.getAdresses(),
            PersonnelService.getTypesPersonnel(),
          ]);

          if (!mounted) return;

          setGrades(Array.isArray(gradesRes?.data) ? gradesRes.data : []);
          setServices(Array.isArray(servicesRes?.data) ? servicesRes.data : []);
          setAddresses(Array.isArray(addrRes?.data) ? addrRes.data : []);
          setTypePersonnelList(Array.isArray(typeRes?.data) ? typeRes.data : []);
        } catch (e) {
          if (mounted) setError("Erreur lors du chargement des listes.");
        } finally {
          if (mounted) setLoadingInit(false);
        }
      })();

      return () => {
        mounted = false;
      };
    }, [open]);

    // Détails service
    useEffect(() => {
      if (!open || !form.service) {
        setSelectedServiceDetails(null);
        return;
      }

      let mounted = true;

      (async () => {
        try {
          const res = await PersonnelService.getServiceDetails(form.service);
          if (mounted) setSelectedServiceDetails(res?.data || null);
        } catch {
          if (mounted) setSelectedServiceDetails(null);
        }
      })();

      return () => {
        mounted = false;
      };
    }, [open, form.service]);

    const handleClose = () => {
      setForm(INITIAL_FORM);
      setSelectedServiceDetails(null);
      setError("");
      onClose?.();
    };

    const handleSubmit = async () => {
      if (
        !form.nom ||
        !form.prenom ||
        !form.email ||
        !form.DateEntreeDate ||
        !form.service ||
        !form.adresse
      ) {
        alert("Veuillez remplir les champs obligatoires.");
        return;
      }

      if (form.SiTypePersonnel === true && !form.TypePersonnelID) {
        alert("Veuillez sélectionner un type de personnel.");
        return;
      }

      setSaving(true);
      setError("");

      try {
        const payload = {
          NomPersonne: String(form.nom).toUpperCase(),
          PrenomPersonne: form.prenom,
          Email: form.email?.trim(),
          TelPro: form.telephone ? String(form.telephone).trim() : null,

          DateEntree: form.DateEntreeDate
            ? dayjs(form.DateEntreeDate).format("YYYY-MM-DD")
            : null,

          ServiceID: form.service ? Number(form.service) : null,
          AdresseID: form.adresse ? Number(form.adresse) : null,
          WWGradeID: form.grade ? Number(form.grade) : 0,

          SiFrancais: !!form.siFrancais,
          SiTypePersonnel: !!form.SiTypePersonnel,
          TypePersonnelID: form.SiTypePersonnel
            ? Number(form.TypePersonnelID)
            : 0,

          SiArchive: false,
        };

        const res = await PersonnelService.create(payload);
        const data = res?.data;

        if (data === "Personne Exists") {
          alert("Cet email est déjà attribué.");
          return;
        }

        if (data === "NOK") {
          const msg =
            "L'API a refusé l'ajout (NOK). Vérifie les champs / règles serveur.";
          setError(msg);
          alert(msg);
          return;
        }

        PersonnelService.clearCaches?.();

        if (typeof refreshData === "function") await refreshData();

        if (typeof onMemberUpdate === "function") {
          const serviceIdNum = payload.ServiceID;

          const nomService =
            services.find(
              (s) => Number(s.IDService) === Number(serviceIdNum),
            )?.NomServiceFr || "";

          const addedMember = {
            ...payload,
            IDPersonneService: data?.IDPersonneService || Date.now(),
            NomServiceFr: nomService,
          };

          onMemberUpdate(addedMember);
        }

        alert("Ajout réussi !");
        handleClose();
      } catch (e) {
        const msg = e?.response?.data || e?.message || "Erreur lors de l'envoi.";
        setError(String(msg));
        alert(String(msg));
      } finally {
        setSaving(false);
      }
    };

    return (
      <Dialog
        open={!!open}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        ref={ref}
      >
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
            <Typography variant="h6" fontWeight={700}>
              Ajouter un membre
            </Typography>
          </Stack>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ bgcolor: "background.paper" }}>
          {loadingInit ? (
            <Stack direction="row" alignItems="center" spacing={2} p={3}>
              <CircularProgress size={20} />
              <Typography>Chargement des listes...</Typography>
            </Stack>
          ) : (
            <Stack spacing={2}>
              {error && <Alert severity="error">{error}</Alert>}

              <Box sx={{ p: 1 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Nom"
                      required
                      fullWidth
                      size="small"
                      value={form.nom}
                      onChange={(e) => {
                        setField("nom", e.target.value);
                        handleNameChange(e.target.value, form.prenom);
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Prénom"
                      required
                      fullWidth
                      size="small"
                      value={form.prenom}
                      onChange={(e) => {
                        setField("prenom", e.target.value);
                        handleNameChange(form.nom, e.target.value);
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Téléphone"
                      fullWidth
                      size="small"
                      value={form.telephone}
                      onChange={(e) => setField("telephone", e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Email"
                      required
                      fullWidth
                      size="small"
                      value={form.email}
                      onChange={(e) => setField("email", e.target.value)}
                    />
                  </Grid>

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
                    <Autocomplete
                      size="small"
                      options={[
                        { IDWWGrade: "", NomWWGradeFr: "Aucun" },
                        ...grades,
                      ]}
                      getOptionLabel={(option) => option?.NomWWGradeFr || ""}
                      value={
                        grades.find((g) => g.IDWWGrade === form.grade) || {
                          IDWWGrade: "",
                          NomWWGradeFr: "Aucun",
                        }
                      }
                      isOptionEqualToValue={(option, value) =>
                        option.IDWWGrade === value.IDWWGrade
                      }
                      onChange={(_, nv) =>
                        setField("grade", nv ? nv.IDWWGrade : "")
                      }
                      renderInput={(params) => (
                        <TextField {...params} label="Grade" />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Autocomplete
                      size="small"
                      options={addresses}
                      getOptionLabel={(option) =>
                        option?.AdresseComplete || ""
                      }
                      value={
                        addresses.find((a) => a.IDAdresse === form.adresse) ||
                        null
                      }
                      isOptionEqualToValue={(option, value) =>
                        option.IDAdresse === value.IDAdresse
                      }
                      onChange={(_, nv) =>
                        setField("adresse", nv ? nv.IDAdresse : "")
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Adresse d'affectation"
                          required
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth size="small" required>
                      <InputLabel>Service</InputLabel>
                      <Select
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
                        <InputLabel>Type de personnel</InputLabel>
                        <Select
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
                  sx={{
                    mt: 1,
                    p: 2,
                    borderRadius: 2,
                    bgcolor: "action.hover",
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Typography fontWeight={700} variant="subtitle2" mb={1}>
                    Détails du service
                  </Typography>
                  <Typography variant="caption" display="block">
                    <strong>Chef Service :</strong>{" "}
                    {selectedServiceDetails.NomChefService}{" "}
                    {selectedServiceDetails.PrenomChefService}
                  </Typography>
                  <Typography variant="caption" display="block">
                    <strong>Chef Département :</strong>{" "}
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
            {saving ? "Enregistrement..." : "Valider"}
          </Button>
        </DialogActions>
      </Dialog>
    );
  },
);

AjoutFormComponent.propTypes = {
  open: PropTypes.any,
  onClose: PropTypes.func,
  onMemberUpdate: PropTypes.func,
  refreshData: PropTypes.func,
};

AjoutFormComponent.displayName = "AjoutFormComponent";

export default AjoutFormComponent;