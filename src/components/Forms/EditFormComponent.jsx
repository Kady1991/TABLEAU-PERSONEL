import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
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

import Autocomplete from "@mui/material/Autocomplete";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import PersonnelService from "../../services/PersonnelService";

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
  ServiceID: "",
  FonctionID: "",
  CodeID: "",
  SiFrancais: true,
  SiTypePersonnel: false,
  TypePersonnelID: "",
};

const clean = (v) => (v == null ? "" : String(v).trim());

function EditFormComponent({ IDPersonneService, refreshData }) {
  const [open, setOpen] = useState(false);
  const [loadingInit, setLoadingInit] = useState(false);
  const [saving, setSaving] = useState(false);

  const [grades, setGrades] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [services, setServices] = useState([]);
  // const [typePersonnelList, setTypePersonnelList] = useState([]);
  const [fonctions, setFonctions] = useState([]);

  const [serviceDetails, setServiceDetails] = useState(null);
  const [form, setForm] = useState(initialForm);

  const setField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setServiceDetails(null);
    setForm(initialForm);
  };

  const selectedServiceLabel = useMemo(() => {
    const s = services.find(
      (x) => String(x.IDService) === String(form.ServiceID),
    );
    return s?.NomServiceFr || s?.NomServiceNl || "";
  }, [services, form.ServiceID]);

  const selectedFonction = useMemo(() => {
    return (
      fonctions.find(
        (f) => String(f.IDFonction ?? f.IdFonction) === String(form.FonctionID),
      ) || null
    );
  }, [fonctions, form.FonctionID]);

  const codesDisponibles = useMemo(() => {
    return selectedFonction?.Codes || [];
  }, [selectedFonction]);

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
          //typeRes,
          servicesRes,
          fonctionsRes,
        ] = await Promise.all([
          PersonnelService.getById(IDPersonneService),
          PersonnelService.getGrades(),
          PersonnelService.getAdresses(),
          //PersonnelService.getTypesPersonnel(),
          PersonnelService.getServices(),
          PersonnelService.getFonctions(),
        ]);

        if (!mounted) return;

        const gradesData = Array.isArray(gradesRes?.data) ? gradesRes.data : [];
        const addressesData = Array.isArray(addrRes?.data) ? addrRes.data : [];
        // const typePersonnelData = Array.isArray(typeRes?.data)
        //   ? typeRes.data
        //   : [];
        const servicesData = Array.isArray(servicesRes?.data)
          ? servicesRes.data
          : [];
        const fonctionsData = Array.isArray(fonctionsRes?.data)
          ? fonctionsRes.data
          : [];

        setGrades(gradesData);
        setAddresses(addressesData);
        //setTypePersonnelList(typePersonnelData);
        setServices(servicesData);
        setFonctions(fonctionsData);

        const p = personRes?.data || {};

        const rawDate = p.DateEntreeDate || p.DateEntree || null;
        const parsedDate = rawDate ? dayjs(rawDate) : null;

        const gradeIdDirect =
          p.WWGradeID ?? p.IDWWGrade ?? p.IdWWGrade ?? p.GradeID ?? "";

        const gradeFound =
          gradesData.find(
            (g) =>
              String(g.IDWWGrade ?? g.WWGradeID ?? g.IdWWGrade) ===
              String(gradeIdDirect),
          ) ||
          gradesData.find(
            (g) =>
              clean(g.NomWWGradeFr) === clean(p.NomWWGradeFr) ||
              clean(g.NomWWGradeNl) === clean(p.NomWWGradeNl) ||
              clean(g.NomGradeFr) === clean(p.NomGradeFr),
          ) ||
          null;

        const finalGradeId =
          gradeFound?.IDWWGrade ??
          gradeFound?.WWGradeID ??
          gradeFound?.IdWWGrade ??
          "";

        const serviceIdDirect = p.ServiceID ?? p.IDService ?? p.IdService ?? "";

        const serviceFound =
          servicesData.find(
            (s) => String(s.IDService) === String(serviceIdDirect),
          ) ||
          servicesData.find(
            (s) =>
              clean(s.NomServiceFr) === clean(p.NomServiceFr) ||
              clean(s.NomServiceNl) === clean(p.NomServiceNl),
          ) ||
          null;

        const finalServiceId = serviceFound?.IDService ?? "";

        const adresseIdDirect = p.AdresseID ?? p.IDAdresse ?? p.IdAdresse ?? "";

        const personNomRueFr = clean(p.NomRueFr);
        const personNomRueNl = clean(p.NomRueNl);
        const personNumero = clean(p.Numero);
        const personBatiment = clean(p.Batiment);
        const personEtage = clean(p.Etage);

        const personAdresseTexte = clean(
          [p.NomRueFr, p.Numero, p.Batiment, p.Etage].filter(Boolean).join(" "),
        );

        const addressFound =
          addressesData.find(
            (a) => String(a.IDAdresse) === String(adresseIdDirect),
          ) ||
          addressesData.find(
            (a) =>
              clean(a.AdresseComplete) === clean(p.AdresseComplete) ||
              clean(a.AdresseComplete) === personAdresseTexte,
          ) ||
          addressesData.find(
            (a) =>
              clean(a.NomRueFr) === personNomRueFr &&
              clean(a.Numero) === personNumero,
          ) ||
          addressesData.find(
            (a) =>
              clean(a.NomRueNl) === personNomRueNl &&
              clean(a.Numero) === personNumero,
          ) ||
          addressesData.find(
            (a) =>
              clean(a.NomRueFr) === personNomRueFr &&
              clean(a.Numero) === personNumero &&
              clean(a.Batiment) === personBatiment,
          ) ||
          addressesData.find(
            (a) =>
              clean(a.NomRueFr) === personNomRueFr &&
              clean(a.Numero) === personNumero &&
              clean(a.Batiment) === personBatiment &&
              clean(a.Etage) === personEtage,
          ) ||
          null;

        const finalAdresseId = addressFound?.IDAdresse ?? "";

        const fonctionIdDirect =
          p.FonctionID ?? p.IDFonction ?? p.IdFonction ?? "";

        const fonctionFound =
          fonctionsData.find(
            (f) =>
              String(f.IDFonction ?? f.IdFonction) === String(fonctionIdDirect),
          ) ||
          fonctionsData.find(
            (f) =>
              clean(f.NomFonctionFr) === clean(p.NomFonctionFr) ||
              clean(f.NomFonctionNl) === clean(p.NomFonctionNl) ||
              clean(f.LibelleFonctionFr) === clean(p.LibelleFonctionFr),
          ) ||
          null;

        const finalFonctionId =
          fonctionFound?.IDFonction ?? fonctionFound?.IdFonction ?? "";

        const codeIdDirect = p.CodeID ?? p.IDCode ?? p.Idcode ?? "";
        const codesSource = fonctionFound?.Codes || [];

        const codeFound =
          codesSource.find(
            (c) => String(c.Idcode ?? c.IDCode) === String(codeIdDirect),
          ) ||
          codesSource.find(
            (c) =>
              clean(c.NomCode) === clean(p.NomCode) ||
              clean(c.Code) === clean(p.Code),
          ) ||
          null;

        const finalCodeId = codeFound?.Idcode ?? codeFound?.IDCode ?? "";

        const typePersonnelIdDirect =
          p.TypePersonnelID ?? p.IDTypePersonnel ?? "";

        setForm({
          IDPersonneService: p.IDPersonneService ?? IDPersonneService,
          PersonneID: p.PersonneID ?? null,
          NomPersonne: p.NomPersonne || "",
          PrenomPersonne: p.PrenomPersonne || "",
          Email: p.Email || "",
          TelPro: p.TelPro || "",
          DateEntreeDate:
            parsedDate && parsedDate.isValid() ? parsedDate : null,
          WWGradeID: finalGradeId,
          AdresseID: finalAdresseId,
          ServiceID: finalServiceId,
          FonctionID: finalFonctionId,
          CodeID: finalCodeId,
          SiFrancais: p.SiFrancais ?? true,
          SiTypePersonnel: p.SiTypePersonnel ?? false,
          //TypePersonnelID: typePersonnelIdDirect,
        });
      } catch (e) {
        console.error(
          "Erreur chargement Edit :",
          e?.response?.data || e?.message,
        );
        alert("Erreur lors du chargement des données.");
      } finally {
        if (mounted) setLoadingInit(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [open, IDPersonneService]);

  useEffect(() => {
    if (!open || !form.ServiceID) {
      setServiceDetails(null);
      return;
    }

    let mounted = true;

    (async () => {
      try {
        const res = await PersonnelService.getServiceDetails?.(form.ServiceID);
        if (mounted) setServiceDetails(res?.data || null);
      } catch {
        if (mounted) setServiceDetails(null);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [open, form.ServiceID]);

  const validate = () => {
    if (!form.NomPersonne) return "Nom obligatoire";
    if (!form.PrenomPersonne) return "Prénom obligatoire";
    if (!form.Email) return "E-mail obligatoire";
    if (!form.AdresseID) return "Adresse obligatoire";
    if (!form.ServiceID) return "Service obligatoire";
    // if (form.SiTypePersonnel && !form.TypePersonnelID) {
    //   return "Type de personnel obligatoire";
    // }
    // return "";
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
        DateEntree: form.DateEntreeDate
          ? dayjs(form.DateEntreeDate).format("YYYY-MM-DD")
          : null,
        WWGradeID: form.WWGradeID || null,
        //IDWWGrade: form.WWGradeID || null,
        AdresseID: form.AdresseID,
        ServiceID: form.ServiceID,
        FonctionID: form.FonctionID || null,
        CodeID: form.CodeID || null,
        SiFrancais: form.SiFrancais,
        SiTypePersonnel: form.SiTypePersonnel,
        TypePersonnelID: form.SiTypePersonnel ? form.TypePersonnelID : null,
      };

      console.log("[EDIT] payload =", payload);

      await PersonnelService.update(form.IDPersonneService, payload);

      PersonnelService.clearCaches?.();

      alert("Modifications enregistrées !");
      handleClose();

      if (typeof refreshData === "function") {
        await refreshData();
      }
    } catch (e) {
      console.error(
        "Erreur sauvegarde Edit :",
        e?.response?.data || e?.message,
      );
      alert("Une erreur est survenue lors de l’enregistrement.");
    } finally {
      setSaving(false);
    }
  };
  return (
    <>
      <IconButton
        size="small"
        title="Éditer"
        onClick={handleOpen}
        sx={{ ml: 0.5 }}
      >
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
                      slotProps={{
                        textField: { fullWidth: true, size: "small" },
                      }}
                    />
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    size="small"
                    options={grades}
                    getOptionLabel={(option) =>
                      option?.NomWWGradeFr || option?.NomWWGradeNl || ""
                    }
                    value={
                      grades.find(
                        (g) =>
                          String(g.IDWWGrade ?? g.WWGradeID ?? g.IdWWGrade) ===
                          String(form.WWGradeID),
                      ) || null
                    }
                    isOptionEqualToValue={(option, value) =>
                      String(
                        option.IDWWGrade ??
                          option.WWGradeID ??
                          option.IdWWGrade,
                      ) ===
                      String(
                        value.IDWWGrade ?? value.WWGradeID ?? value.IdWWGrade,
                      )
                    }
                    onChange={(e, nv) =>
                      setField(
                        "WWGradeID",
                        nv
                          ? (nv.IDWWGrade ?? nv.WWGradeID ?? nv.IdWWGrade)
                          : "",
                      )
                    }
                    renderOption={(props, option) => {
                      const { key, ...restProps } = props;
                      return (
                        <li
                          {...restProps}
                          key={`grade-${option.IDWWGrade ?? option.WWGradeID ?? option.IdWWGrade}`}
                        >
                          {option?.NomWWGradeFr ||
                            option?.NomWWGradeNl ||
                            "Sans libellé"}
                        </li>
                      );
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Grade" fullWidth />
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
                        (a) => String(a.IDAdresse) === String(form.AdresseID),
                      ) || null
                    }
                    isOptionEqualToValue={(option, value) =>
                      String(option.IDAdresse) === String(value.IDAdresse)
                    }
                    onChange={(e, nv) =>
                      setField("AdresseID", nv ? nv.IDAdresse : "")
                    }
                    renderOption={(props, option) => {
                      const { key, ...restProps } = props;
                      return (
                        <li {...restProps} key={`adresse-${option.IDAdresse}`}>
                          {option?.AdresseComplete || "Sans libellé"}
                        </li>
                      );
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Adresse" fullWidth />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    size="small"
                    options={services}
                    getOptionLabel={(option) =>
                      option?.NomServiceFr || option?.NomServiceNl || ""
                    }
                    value={
                      services.find(
                        (s) => String(s.IDService) === String(form.ServiceID),
                      ) || null
                    }
                    isOptionEqualToValue={(option, value) =>
                      String(option.IDService) === String(value.IDService)
                    }
                    onChange={(e, nv) =>
                      setField("ServiceID", nv ? nv.IDService : "")
                    }
                    renderOption={(props, option) => {
                      const { key, ...restProps } = props;
                      return (
                        <li {...restProps} key={`service-${option.IDService}`}>
                          {option?.NomServiceFr ||
                            option?.NomServiceNl ||
                            "Sans libellé"}
                        </li>
                      );
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Service" fullWidth />
                    )}
                  />

                  {selectedServiceLabel ? (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ mt: 0.5, display: "block" }}
                    >
                      Service sélectionné : <b>{selectedServiceLabel}</b>
                    </Typography>
                  ) : null}
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    size="small"
                    options={fonctions}
                    getOptionLabel={(option) =>
                      option?.NomFonctionFr || option?.NomFonctionNl || ""
                    }
                    value={
                      fonctions.find(
                        (f) =>
                          String(f.IDFonction ?? f.IdFonction) ===
                          String(form.FonctionID),
                      ) || null
                    }
                    isOptionEqualToValue={(option, value) =>
                      String(option.IDFonction ?? option.IdFonction) ===
                      String(value.IDFonction ?? value.IdFonction)
                    }
                    onChange={(e, nv) => {
                      setField(
                        "FonctionID",
                        nv ? (nv.IDFonction ?? nv.IdFonction) : "",
                      );
                      setField("CodeID", "");
                    }}
                    renderOption={(props, option) => {
                      const { key, ...restProps } = props;
                      return (
                        <li
                          {...restProps}
                          key={`fonction-${option.IDFonction ?? option.IdFonction}`}
                        >
                          {option?.NomFonctionFr ||
                            option?.NomFonctionNl ||
                            "Sans libellé"}
                        </li>
                      );
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Fonction" fullWidth />
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
                        (c) =>
                          String(c.Idcode ?? c.IDCode) === String(form.CodeID),
                      ) || null
                    }
                    isOptionEqualToValue={(option, value) =>
                      String(option.Idcode ?? option.IDCode) ===
                      String(value.Idcode ?? value.IDCode)
                    }
                    onChange={(e, nv) =>
                      setField("CodeID", nv ? (nv.Idcode ?? nv.IDCode) : "")
                    }
                    renderOption={(props, option) => {
                      const { key, ...restProps } = props;
                      return (
                        <li
                          {...restProps}
                          key={`code-${option.Idcode ?? option.IDCode}`}
                        >
                          {option?.NomCode || "Sans libellé"}
                        </li>
                      );
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Code fonction" fullWidth />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      Personnel
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
                        control={<Radio />}
                        label="Oui"
                      />
                      <FormControlLabel
                        value="false"
                        control={<Radio />}
                        label="Non"
                      />
                    </RadioGroup>
                  </FormControl>

                  {/* {form.SiTypePersonnel && (
                    <FormControl fullWidth size="small" sx={{ mt: 2 }}>
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
                  )} */}
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      Langue
                    </Typography>
                    <RadioGroup
                      row
                      value={form.SiFrancais ? "true" : "false"}
                      onChange={(e) =>
                        setField("SiFrancais", e.target.value === "true")
                      }
                    >
                      <FormControlLabel
                        value="true"
                        control={<Radio />}
                        label="FR"
                      />
                      <FormControlLabel
                        value="false"
                        control={<Radio />}
                        label="NL"
                      />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>

              {serviceDetails && (
                <Box
                  sx={{ mt: 1, p: 2, borderRadius: 2, bgcolor: "action.hover" }}
                >
                  <Typography fontWeight={700} mb={1}>
                    Informations du service
                  </Typography>
                  <Typography variant="body2">
                    <strong>Chef du Service :</strong>{" "}
                    {serviceDetails.NomChefService}{" "}
                    {serviceDetails.PrenomChefService}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Chef du Département :</strong>{" "}
                    {serviceDetails.NomChefDepartement}{" "}
                    {serviceDetails.PrenomChefDepartement}
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
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={saving || loadingInit}
          >
            {saving ? "Enregistrement..." : "Valider"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

EditFormComponent.propTypes = {
  IDPersonneService: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  refreshData: PropTypes.func,
};

export default EditFormComponent;
