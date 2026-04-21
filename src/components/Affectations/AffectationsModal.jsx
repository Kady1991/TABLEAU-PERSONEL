import React, { useEffect, useState, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
  CircularProgress,
  IconButton,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  departementService,
  serviceService,
  sousServiceService,
  parseApiErrors,
} from "../../services/AffectationsService";
import PersonneAutocomplete from "./PersonneAutocomplete";

const CONFIG = {
  departement: {
    title: (edit) => (edit ? "Modifier le département" : "Nouveau département"),
  },
  service: {
    title: (edit) => (edit ? "Modifier le service" : "Nouveau service"),
  },
  sousservice: {
    title: (edit) =>
      edit ? "Modifier le sous-service" : "Nouveau sous-service",
  },
};

const EMPTY = {
  departement: {
    nomDepartementFr: "",
    nomDepartementNl: "",
    chefDepartementId: "",
  },
  service: {
    nomServiceFr: "",
    nomServiceNl: "",
    departementId: "",
    chefServiceId: "",
  },
  sousservice: {
    nomSousServiceFr: "",
    nomSousServiceNl: "",
    serviceId: "",
    parentSousServiceId: "",
    sousChefServiceId: "",
  },
};

const toStr = (val) => (val != null && val !== "" ? String(val) : "");

const normalizeForm = (type, data) => {
  const f = { ...EMPTY[type], ...data };
  if (type === "service") f.departementId = toStr(f.departementId);
  if (type === "sousservice") {
    f.serviceId = toStr(f.serviceId);
    f.parentSousServiceId = toStr(f.parentSousServiceId);
  }
  return f;
};

function AffectationsModal({
  open,
  onClose,
  onSaved,
  type,
  editData,
  defaultDepartementId,
  defaultServiceId,
  defaultParentSousServiceId,
  showParentSousService,
}) {
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [depts, setDepts] = useState([]);
  const [svcs, setSvcs] = useState([]);
  const [sousSvcs, setSousSvcs] = useState([]);
  const [chefDept, setChefDept] = useState(null);
  const [chefSvc, setChefSvc] = useState(null);
  const [chefSS, setChefSS] = useState(null);
  const [errors, setErrors] = useState({});

  const config = CONFIG[type] || CONFIG.departement;
  const isEdit = !!editData;

  // Chef N+1 par défaut — cherché dans depts (structure imbriquée avec chef inclus)
  //   1. Chef du service parent   → s'il a un chefServiceId
  //   2. Sinon chef du département parent → chefDepartementId
  const chefParDefaut = useMemo(() => {
    if (type !== "sousservice" || !form.serviceId) return null;

    // ── Chercher dans svcs (liste plate de serviceService.getAll())
    const svcFlat = svcs.find(
      (s) => String(s.idService) === String(form.serviceId),
    );

    // ── Chercher dans depts (structure imbriquée de departementService.getAll())
    let svcNested = null;
    let deptParent = null;
    for (const dept of depts) {
      const found = (dept.services ?? []).find(
        (s) => String(s.idService) === String(form.serviceId),
      );
      if (found) {
        svcNested = found;
        deptParent = dept;
        break;
      }
    }

    //  Cas 1 — chef du service (liste plate) — champ API: chefServiceID (D majuscule)
    if (svcFlat?.chefServiceID) {
      return {
        idPersonne: svcFlat.chefServiceID,
        nomPersonne: svcFlat.nomChefService ?? "",
        prenomPersonne: svcFlat.prenomChefService ?? "",
        fonction: "—",
      };
    }

    //  Cas 2 — chef du service (structure imbriquée)
    if (svcNested?.chefServiceID) {
      return {
        idPersonne: svcNested.chefServiceID,
        nomPersonne: svcNested.nomChefService ?? "",
        prenomPersonne: svcNested.prenomChefService ?? "",
        fonction: "—",
      };
    }

    //  Cas 3 — pas de chef de service → chef du département parent
    if (deptParent?.chefDepartementId) {
      return {
        idPersonne: deptParent.chefDepartementId,
        nomPersonne: deptParent.nomChefDepartement ?? "",
        prenomPersonne: deptParent.prenomChefDepartement ?? "",
        fonction: "—",
      };
    }

    return null;
  }, [type, form.serviceId, svcs, depts]);

  // Chef effectif affiché : choix explicite de l'utilisateur, sinon N+1 calculé
  const chefSSEffectif = chefSS ?? chefParDefaut;

  const resetForm = () => {
    setForm({});
    setChefDept(null);
    setChefSvc(null);
    setChefSS(null);
    setErrors({});
  };

  useEffect(() => {
    if (!open) return;

    Promise.all([
      departementService.getAll(),
      serviceService.getAll(),
      sousServiceService.getAll(),
    ])
      .then(([deptsRes, svcsRes, ssRes]) => {
        setDepts(deptsRes.data);
        setSvcs(svcsRes.data);
        setSousSvcs(ssRes.data);

        if (isEdit) {
          setForm(normalizeForm(type, editData));

          if (type === "departement" && editData?.chefDepartementId) {
            setChefDept({
              idPersonne: editData.chefDepartementId,
              nomPersonne: editData.nomChefDepartement,
              prenomPersonne: editData.prenomChefDepartement,
              fonction: "—",
            });
          }
          if (type === "service" && editData?.chefServiceId) {
            setChefSvc({
              idPersonne: editData.chefServiceId,
              nomPersonne: editData.nomChefService,
              prenomPersonne: editData.prenomChefService,
              fonction: "—",
            });
          }
          if (type === "sousservice" && editData?.sousChefServiceId) {
            setChefSS({
              idPersonne: editData.sousChefServiceId,
              nomPersonne: editData.nomSousChef,
              prenomPersonne: editData.prenomSousChef,
              fonction: "—",
            });
          }
        } else {
          const defaults = { ...EMPTY[type] };

          if (type === "service" && defaultDepartementId) {
            defaults.departementId = toStr(defaultDepartementId);
          }
          if (type === "sousservice") {
            defaults.serviceId = toStr(defaultServiceId);
            defaults.parentSousServiceId = toStr(defaultParentSousServiceId);
          }

          setForm(defaults);
          setChefDept(null);
          setChefSvc(null);
          setChefSS(null);
        }
      })
      .catch(console.error);

    setErrors({});
  }, [
    open,
    type,
    editData,
    defaultDepartementId,
    defaultServiceId,
    defaultParentSousServiceId,
  ]);

  const handleChange = (field) => (e) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: e.target.value };
      // reset sous-service parent si le service change
      if (field === "serviceId") updated.parentSousServiceId = "";
      return updated;
    });
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Payload strict — seuls les champs attendus par le backend sont envoyés
      // On évite de polluer avec les champs des autres types (nomChefX, idX, etc.)
      let payload;
      if (type === "departement") {
        payload = {
          nomDepartementFr: form.nomDepartementFr || null,
          nomDepartementNl: form.nomDepartementNl || null,
          chefDepartementId: chefDept?.idPersonne
            ? Number(chefDept.idPersonne)
            : null,
        };
      } else if (type === "service") {
        payload = {
          nomServiceFr: form.nomServiceFr || null,
          nomServiceNl: form.nomServiceNl || null,
          departementId: form.departementId ? Number(form.departementId) : null,
          chefServiceId: chefSvc?.idPersonne
            ? Number(chefSvc.idPersonne)
            : null,
        };
      } else {
        payload = {
          nomSousServiceFr: form.nomSousServiceFr || null,
          nomSousServiceNl: form.nomSousServiceNl || null,
          serviceId: form.serviceId ? Number(form.serviceId) : null,
          parentSousServiceId: form.parentSousServiceId
            ? Number(form.parentSousServiceId)
            : null,
          // N+1 : chef choisi, ou chef du service parent par défaut
          sousChefServiceId: chefSSEffectif?.idPersonne
            ? Number(chefSSEffectif.idPersonne)
            : null,
        };
      }

      if (type === "departement") {
        isEdit
          ? await departementService.update(editData.idDepartement, payload)
          : await departementService.create(payload);
      } else if (type === "service") {
        isEdit
          ? await serviceService.update(editData.idService, payload)
          : await serviceService.create(payload);
      } else {
        isEdit
          ? await sousServiceService.update(editData.idSousService, payload)
          : await sousServiceService.create(payload);
      }

      resetForm();
      onSaved();
      onClose();
    } catch (err) {
      if (err.response?.status === 400) {
        //  Log complet de la réponse 400 pour faciliter le débogage
        console.error("[400] Détail erreur backend:", err.response.data);
        setErrors((prev) => ({
          ...prev,
          ...parseApiErrors(err.response.data),
        }));
      } else {
        console.error(err);
      }
    } finally {
      setSaving(false);
    }
  };

  const renderFields = () => {
    switch (type) {
      case "departement":
        return (
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                size="medium"
                label="Nom FR"
                value={form.nomDepartementFr || ""}
                onChange={handleChange("nomDepartementFr")}
                error={!!errors.nomDepartementFr}
                helperText={errors.nomDepartementFr || ""}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                size="medium"
                label="Nom NL"
                value={form.nomDepartementNl || ""}
                onChange={handleChange("nomDepartementNl")}
                error={!!errors.nomDepartementNl}
                helperText={errors.nomDepartementNl || ""}
              />
            </Grid>
            <Grid item xs={12}>
              <PersonneAutocomplete
                label="Chef de département"
                value={chefDept}
                onChange={(val) => {
                  setChefDept(val);
                  setErrors((p) => ({ ...p, chefDepartementID: undefined }));
                }}
                error={!!errors.chefDepartementID}
                helperText={errors.chefDepartementID}
              />
            </Grid>
          </Grid>
        );

      case "service":
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                size="small"
                label="Département parent"
                value={form.departementId || ""}
                onChange={handleChange("departementId")}
              >
                {depts.map((d) => (
                  <MenuItem
                    key={d.idDepartement}
                    value={String(d.idDepartement)}
                  >
                    {d.nomDepartementFr}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                size="small"
                label="Nom FR"
                value={form.nomServiceFr || ""}
                onChange={handleChange("nomServiceFr")}
                error={!!errors.nomServiceFr}
                helperText={errors.nomServiceFr || ""}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                size="small"
                label="Nom NL"
                value={form.nomServiceNl || ""}
                onChange={handleChange("nomServiceNl")}
                error={!!errors.nomServiceNl}
                helperText={errors.nomServiceNl || ""}
              />
            </Grid>
            <Grid item xs={12}>
              <PersonneAutocomplete
                label="Chef de service"
                value={chefSvc}
                onChange={(val) => {
                  setChefSvc(val);
                  setErrors((p) => ({ ...p, chefServiceID: undefined }));
                }}
                error={!!errors.chefServiceID}
                helperText={errors.chefServiceID}
              />
            </Grid>
          </Grid>
        );

      case "sousservice":
        return (
          <Grid container spacing={2}>
            {/* ── Service parent ─────────────────────────────────────────── */}
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                size="small"
                label="Service parent"
                value={form.serviceId || ""}
                onChange={handleChange("serviceId")}
                error={!!errors.serviceId}
                helperText={errors.serviceId || ""}
              >
                {svcs.map((s) => (
                  <MenuItem key={s.idService} value={String(s.idService)}>
                    {s.nomServiceFr}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* ✅ Sous-service parent — affiché uniquement si showParentSousService */}
            {showParentSousService && (
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Sous-service parent (optionnel)"
                  value={form.parentSousServiceId || ""}
                  onChange={handleChange("parentSousServiceId")}
                  error={!!errors.parentSousServiceId}
                  helperText={errors.parentSousServiceId || ""}
                >
                  <MenuItem value="">— Aucun —</MenuItem>
                  {sousSvcs
                    .filter(
                      (ss) => String(ss.serviceId) === String(form.serviceId),
                    )
                    .map((ss) => (
                      <MenuItem
                        key={ss.idSousService}
                        value={String(ss.idSousService)}
                      >
                        {ss.nomSousServiceFr}
                      </MenuItem>
                    ))}
                </TextField>
              </Grid>
            )}

            {/* ── Noms ───────────────────────────────────────────────────── */}
            <Grid item xs={6}>
              <TextField
                fullWidth
                size="small"
                label="Nom FR"
                value={form.nomSousServiceFr || ""}
                onChange={handleChange("nomSousServiceFr")}
                error={!!errors.nomSousServiceFr}
                helperText={errors.nomSousServiceFr || ""}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                size="small"
                label="Nom NL"
                value={form.nomSousServiceNl || ""}
                onChange={handleChange("nomSousServiceNl")}
                error={!!errors.nomSousServiceNl}
                helperText={errors.nomSousServiceNl || ""}
              />
            </Grid>

            {/* ── Chef ───────────────────────────────────────────────────── */}
            <Grid item xs={12}>
              <PersonneAutocomplete
                label="Chef de sous-service"
                value={chefSSEffectif}
                onChange={(val) => {
                  setChefSS(val);
                  setErrors((p) => ({ ...p, sousChefServiceId: undefined }));
                }}
                required={false}
              />
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle
        sx={{
          pb: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography sx={{ fontSize: 18, fontWeight: 500 }}>
            {config.title(isEdit)}
          </Typography>
          <Typography sx={{ fontSize: 11, color: "text.secondary", mt: 0.3 }}>
            {type === "departement" && "Département"}
            {type === "service" && "Service"}
            {type === "sousservice" && "Sous-service"}
          </Typography>
        </Box>
        <IconButton size="small" onClick={handleClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <Divider />
      <DialogContent sx={{ pt: 2 }}>{renderFields()}</DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 2, gap: 1 }}>
        <Button
          variant="outlined"
          size="medium"
          onClick={handleClose}
          sx={{ textTransform: "none", borderRadius: 1.5 }}
        >
          Annuler
        </Button>
        <Button
          variant="contained"
          size="medium"
          onClick={handleSave}
          disabled={saving}
          sx={{
            textTransform: "none",
            borderRadius: 1.5,
            backgroundColor: "#1a3a5c",
            "&:hover": { backgroundColor: "#0C447C" },
          }}
        >
          {saving ? (
            <CircularProgress size={16} color="inherit" />
          ) : (
            "Enregistrer"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AffectationsModal;
