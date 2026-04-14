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
 // FormControl,
  FormControlLabel,
  Grid,
  IconButton,
 // InputLabel,
 // MenuItem,
  Radio,
  RadioGroup,
 //Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import Autocomplete from "@mui/material/Autocomplete";
import CloseIcon from "@mui/icons-material/Close";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import PersonnelService from "../../services/PersonnelService.js";

const INITIAL_FORM = {
  nom: "",
  prenom: "",
  telephone: "",
  email: "",
  DateEntreeDate: null,
  grade: 0,
  adresse: "",
  service: "",
  fonction: "",
  codeFonction: "",
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
    // const [typePersonnelList, setTypePersonnelList] = useState([]);
    const [fonctions, setFonctions] = useState([]);

    const [selectedServiceDetails, setSelectedServiceDetails] = useState(null);
    const [form, setForm] = useState(INITIAL_FORM);

    // const isPersonnelSelected = form.SiTypePersonnel === true;

    const setField = (name, value) => {
      setForm((prev) => ({ ...prev, [name]: value }));
    };

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

    const selectedFonction =
      fonctions.find((f) => Number(f.IDFonction) === Number(form.fonction)) ||
      null;

    const selectedGrade =
      grades.find((g) => Number(g.IDWWGrade) === Number(form.grade)) || null;

    const selectedService =
      services.find((s) => Number(s.IDService) === Number(form.service)) ||
      null;

    const selectedAddress =
      addresses.find((a) => Number(a.IDAdresse) === Number(form.adresse)) ||
      null;

    const codesDisponibles = selectedFonction?.Codes || [];

    const handleNameChange = (nextNom, nextPrenom) => {
      const email = generateEmail(nextPrenom, nextNom);
      setField("email", email);
    };

    useEffect(() => {
      if (!open) return;

      setError("");
      setSelectedServiceDetails(null);
      setForm(INITIAL_FORM);
    }, [open]);

    useEffect(() => {
      if (!open) return;
      let mounted = true;

      (async () => {
        setLoadingInit(true);
        setError("");

        try {
          const [gradesRes, servicesRes, addrRes, fonRes] = await Promise.all([
            PersonnelService.getGrades(),
            PersonnelService.getServices(),
            PersonnelService.getAdresses(),
            // PersonnelService.getTypesPersonnel(),
            PersonnelService.getFonctions(),
          ]);

          if (!mounted) return;

          setGrades(Array.isArray(gradesRes?.data) ? gradesRes.data : []);
          setServices(Array.isArray(servicesRes?.data) ? servicesRes.data : []);
          setAddresses(Array.isArray(addrRes?.data) ? addrRes.data : []);
          // setTypePersonnelList(
          //   Array.isArray(typeRes?.data) ? typeRes.data : [],
          // );
          setFonctions(Array.isArray(fonRes?.data) ? fonRes.data : []);
        } catch (e) {
          console.error(e);
          setError("Erreur lors du chargement des listes.");
        } finally {
          if (mounted) setLoadingInit(false);
        }
      })();

      return () => {
        mounted = false;
      };
    }, [open]);

    useEffect(() => {
      if (!form.service) {
        setSelectedServiceDetails(null);
        return;
      }

      const service =
        services.find((s) => Number(s.IDService) === Number(form.service)) ||
        null;

      setSelectedServiceDetails(service);
    }, [form.service, services]);

    const clearCaches = () => {
      try {
        sessionStorage.removeItem("personnels_actifs_cache_v1");
        sessionStorage.removeItem("Personnels_actifs_cache_v1");
        sessionStorage.removeItem("home_personnels_actifs_cache_v1");
      } catch (e) {
        console.error("Erreur vidage cache:", e);
      }
    };

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
          NomPersonne: form.nom.toUpperCase(),
          PrenomPersonne: form.prenom,
          Email: form.email?.trim(),
          TelPro: form.telephone ? String(form.telephone).trim() : null,

          DateEntree: form.DateEntreeDate
            ? dayjs(form.DateEntreeDate).format("YYYY-MM-DD")
            : null,

          ServiceID: form.service ? Number(form.service) : null,
          AdresseID: form.adresse ? Number(form.adresse) : null,

          WWGradeID: Number(form.grade) || 0,
          IDWWGrade: Number(form.grade) || 0,

          FonctionID: form.fonction ? Number(form.fonction) : 0,
          CodeID: form.codeFonction ? Number(form.codeFonction) : 0,

          SiFrancais: !!form.siFrancais,
          SiTypePersonnel: !!form.SiTypePersonnel,

          TypePersonnelID: form.SiTypePersonnel
            ? Number(form.TypePersonnelID)
            : 0,

          SiArchive: false,
        };

        console.log("GRADE DANS FORM =", form.grade);
        console.log("FONCTION DANS FORM =", form.fonction);
        console.log("SERVICE DANS FORM =", form.service);
        console.log("GRADE ENVOYÉ =", payload.WWGradeID);
        console.log("FONCTION ENVOYÉE =", payload.FonctionID);
        console.log("SERVICE ENVOYÉ =", payload.ServiceID);
        console.log("PAYLOAD =", payload);
        console.log("[AJOUT] payload JSON =", JSON.stringify(payload, null, 2));

        const response = await PersonnelService.create(payload);

        console.log("[AJOUT] response.data :", response.data);
        console.log("[AJOUT] status :", response.status);

        if (response.data === "Personne Exists") {
          alert("Cet email est déjà attribué.");
          return;
        }

        if (response.data === "NOK") {
          const msg =
            "L'API a refusé l'ajout (NOK). Vérifie les champs / règles serveur.";
          setError(msg);
          alert(msg);
          return;
        }

        if (response.data === "OK-create") {
          alert("Ajout réussi !");
        }

        clearCaches();

        const nomServiceFr = selectedService?.NomServiceFr || "";
        const nomServiceNl = selectedService?.NomServiceNl || "";

        const nomFonctionFr =
          selectedFonction?.NomFonctionFr ||
          selectedFonction?.LibelleFonctionFr ||
          "";

        const nomFonctionNl =
          selectedFonction?.NomFonctionNl ||
          selectedFonction?.LibelleFonctionNl ||
          "";

        const nomGradeFr =
          selectedGrade?.NomWWGradeFr ||
          selectedGrade?.NomGradeFr ||
          selectedGrade?.LibelleGradeFr ||
          "";

        const nomGradeNl =
          selectedGrade?.NomWWGradeNl ||
          selectedGrade?.NomGradeNl ||
          selectedGrade?.LibelleGradeNl ||
          "";

        const addedMember = {
          ...payload,
          IDPersonneService:
            response?.data?.IDPersonneService ||
            response?.data?.id ||
            Date.now(),

          NomServiceFr: nomServiceFr,
          NomServiceNl: nomServiceNl,

          NomFonctionFr: nomFonctionFr,
          NomFonctionNl: nomFonctionNl,

          NomWWGradeFr: nomGradeFr,
          NomWWGradeNl: nomGradeNl,

          NomRueFr:
            selectedAddress?.NomRueFr ||
            selectedAddress?.NomRue ||
            selectedAddress?.RueFr ||
            "",

          NomRueNl: selectedAddress?.NomRueNl || selectedAddress?.RueNl || "",

          Numero: selectedAddress?.Numero || "",
          Batiment: selectedAddress?.Batiment || "",
          BatimentNl: selectedAddress?.BatimentNl || "",
          Etage: selectedAddress?.Etage || "",
        };

        console.log("[AJOUT] addedMember enrichi =", addedMember);

        if (typeof onMemberUpdate === "function") {
          onMemberUpdate(addedMember);
        }

        if (typeof refreshData === "function") {
          await refreshData();
        }

        handleClose();
      } catch (err) {
        console.log("Validation errors:", err?.response?.data?.errors);

        const msg =
          typeof err?.response?.data === "string"
            ? err.response.data
            : err?.message || "Erreur lors de l'envoi.";

        setError(msg);
        alert(msg);
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
                      options={grades}
                      getOptionLabel={(option) => option?.NomWWGradeFr || ""}
                      value={
                        grades.find(
                          (g) => Number(g.IDWWGrade) === Number(form.grade),
                        ) || null
                      }
                      isOptionEqualToValue={(option, value) =>
                        Number(option.IDWWGrade) === Number(value.IDWWGrade)
                      }
                      onChange={(e, nv) => {
                        console.log("GRADE CHOISI =", nv);
                        setField("grade", nv ? Number(nv.IDWWGrade) : 0);
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label="Grade" />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Autocomplete
                      size="small"
                      options={addresses}
                      getOptionLabel={(option) => option?.AdresseComplete || ""}
                      value={
                        addresses.find(
                          (a) => Number(a.IDAdresse) === Number(form.adresse),
                        ) || null
                      }
                      isOptionEqualToValue={(option, value) =>
                        Number(option.IDAdresse) === Number(value.IDAdresse)
                      }
                      onChange={(e, nv) =>
                        setField("adresse", nv ? Number(nv.IDAdresse) : "")
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
                    <Autocomplete
                      size="small"
                      options={services}
                      getOptionLabel={(option) => option?.NomServiceFr || ""}
                      value={
                        services.find(
                          (s) => Number(s.IDService) === Number(form.service),
                        ) || null
                      }
                      isOptionEqualToValue={(option, value) =>
                        Number(option.IDService) === Number(value.IDService)
                      }
                      onChange={(e, nv) =>
                        setField("service", nv ? Number(nv.IDService) : "")
                      }
                      renderInput={(params) => (
                        <TextField {...params} label="Service" required />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Autocomplete
                      size="small"
                      options={fonctions}
                      getOptionLabel={(option) => option?.NomFonctionFr || ""}
                      value={
                        fonctions.find(
                          (f) => Number(f.IDFonction) === Number(form.fonction),
                        ) || null
                      }
                      isOptionEqualToValue={(option, value) =>
                        Number(option.IDFonction) === Number(value.IDFonction)
                      }
                      onChange={(e, nv) => {
                        setField("fonction", nv ? Number(nv.IDFonction) : 0);
                        setField("codeFonction", "");
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label="Fonction" required />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Autocomplete
                      size="small"
                      options={codesDisponibles}
                      getOptionLabel={(option) => option?.NomCode || ""}
                      value={
                        codesDisponibles.find(
                          (c) => Number(c.Idcode) === Number(form.codeFonction),
                        ) || null
                      }
                      isOptionEqualToValue={(option, value) =>
                        Number(option.Idcode) === Number(value.Idcode)
                      }
                      onChange={(e, nv) =>
                        setField("codeFonction", nv ? Number(nv.Idcode) : 0)
                      }
                      renderInput={(params) => (
                        <TextField {...params} label="Code fonction" required />
                      )}
                    />
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
                    {/* 
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
                    )} */}
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
