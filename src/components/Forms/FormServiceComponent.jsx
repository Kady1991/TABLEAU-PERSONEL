    import { useEffect, useMemo, useState } from "react";
    import axios from "axios";
    import dayjs from "dayjs";

    import { LIEN_API_PERSONNE } from "../../config";

    import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Radio,
    RadioGroup,
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

    function FormServiceComponent({ IDPersonneService, refreshData }) {
    const [open, setOpen] = useState(false);
    const [loadingInit, setLoadingInit] = useState(false);
    const [saving, setSaving] = useState(false);

    const [grades, setGrades] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [otherServices, setOtherServices] = useState([]);
    const [typePersonnelList, setTypePersonnelList] = useState([]);

    const initialForm = {
        NomPersonne: "",
        PrenomPersonne: "",
        NomServiceFr: "",
        TelPro: "",
        Email: "",
        DateEntree: null, // dayjs
        WWGradeID: "",
        AdresseID: "",
        ServiceID: "",
        siPersonnel: false,
        TypePersonnelID: "",
        SiFrancais: true,
    };

    const [form, setForm] = useState(initialForm);

    const selectedServiceDetails = useMemo(() => {
        return otherServices.find((s) => s.IDService === form.ServiceID) || null;
    }, [otherServices, form.ServiceID]);

    const setField = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

    const handleOpen = () => setOpen(true);

    const handleClose = () => {
        setOpen(false);
        // Reset léger (optionnel)
        setForm((prev) => ({
        ...prev,
        DateEntree: null,
        WWGradeID: "",
        AdresseID: "",
        ServiceID: "",
        siPersonnel: false,
        TypePersonnelID: "",
        SiFrancais: true,
        }));
    };

    // Load data when opening
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
            setOtherServices(servicesRes.data || []);

            // Pre-fill form with person
            const p = personRes.data || {};
            setForm((prev) => ({
            ...prev,
            NomPersonne: p.NomPersonne || "",
            PrenomPersonne: p.PrenomPersonne || "",
            NomServiceFr: p.NomServiceFr || "",
            Email: p.Email || "",
            TelPro: p.TelPro || "",
            // champs ajout service
            DateEntree: null,
            WWGradeID: "",
            AdresseID: "",
            ServiceID: "",
            siPersonnel: false,
            TypePersonnelID: "",
            SiFrancais: true,
            }));
        } catch (e) {
            console.error("Erreur chargement données FormService:", e?.response?.data || e?.message);
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
        if (form.siPersonnel && !form.TypePersonnelID) return "Type de personnel obligatoire";
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
            NomPersonne: form.NomPersonne,
            PrenomPersonne: form.PrenomPersonne,
            Email: form.Email,
            TelPro: form.TelPro || null,
            DateEntree: form.DateEntree ? dayjs(form.DateEntree).format("DD/MM/YYYY") : null,
            WWGradeID: form.WWGradeID,
            AdresseID: form.AdresseID,
            ServiceID: form.ServiceID,
            SiFrancais: form.SiFrancais,
            TypePersonnelID: form.siPersonnel ? form.TypePersonnelID : null,
        };

        await axios.post(`${LIEN_API_PERSONNE}/api/Personne`, payload);

        alert("Ajout réussi !");
        setOpen(false);

        if (typeof refreshData === "function") {
            await refreshData();
        }
        } catch (e) {
        console.error("Erreur envoi FormService:", e?.response?.data || e?.message);
        alert("Erreur lors de l'ajout.");
        } finally {
        setSaving(false);
        }
    };

    return (
        <>
        <IconButton size="small" onClick={handleOpen} title="Ajouter un service">
            <MedicalServicesIcon fontSize="small" />
        </IconButton>

        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
            <DialogTitle>Ajouter un service supplémentaire</DialogTitle>

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
                    <TextField label="Nom" value={form.NomPersonne} fullWidth disabled size="small" />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                    <TextField label="Prénom" value={form.PrenomPersonne} fullWidth disabled size="small" />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                    <TextField label="Service principal" value={form.NomServiceFr} fullWidth disabled size="small" />
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
                        value={form.DateEntree}
                        onChange={(val) => setField("DateEntree", val)}
                        slotProps={{ textField: { fullWidth: true, size: "small" } }}
                        />
                    </LocalizationProvider>
                    </Grid>

                    <Grid item xs={12}>
                    <FormControl fullWidth size="small">
                        <InputLabel id="grade-label">Grade</InputLabel>
                        <Select
                        labelId="grade-label"
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

                    <Grid item xs={12}>
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

                    <Grid item xs={12}>
                    <FormControl fullWidth size="small">
                        <InputLabel id="service-label">Service supplémentaire</InputLabel>
                        <Select
                        labelId="service-label"
                        label="Service supplémentaire"
                        value={form.ServiceID}
                        onChange={(e) => setField("ServiceID", e.target.value)}
                        >
                        {otherServices.map((s) => (
                            <MenuItem key={s.IDService} value={s.IDService}>
                            {s.NomServiceFr} {s.NomServiceNl}
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
                        value={form.siPersonnel}
                        onChange={(e) => setField("siPersonnel", e.target.value === "true")}
                        >
                        <FormControlLabel value="true" control={<Radio />} label="Oui" />
                        <FormControlLabel value="false" control={<Radio />} label="Non" />
                        </RadioGroup>
                    </FormControl>

                    {form.siPersonnel && (
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
                        value={form.SiFrancais}
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
                        Informations du service sélectionné
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
                {saving ? "Validation..." : "Valider"}
            </Button>
            </DialogActions>
        </Dialog>
        </>
    );
    }

    export default FormServiceComponent;
