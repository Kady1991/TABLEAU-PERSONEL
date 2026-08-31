import { useState } from "react";
import dayjs from "dayjs";
import { MdDeleteForever } from "react-icons/md";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import PropTypes from "prop-types";
import PersonnelService from "../../services/PersonnelService";

function DeleteMembreComponent({
  IDPersonneService,
  nomPersonne,
  prenomPersonne,
  email,
  onArchiveSuccess,
  onArchiveLocal,
}) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [open,         setOpen]         = useState(false);
  const [loading,      setLoading]      = useState(false);

  const handleClick = (e) => { e.preventDefault(); e.stopPropagation(); setOpen(true); };

  const handleClose = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    if (loading) return;
    setOpen(false);
    setSelectedDate(null);
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!selectedDate || !dayjs(selectedDate).isValid()) {
      onArchiveSuccess?.({ type: "error", text: "Veuillez sélectionner une date de sortie." });
      return;
    }

    const formattedDate        = dayjs(selectedDate).format("YYYY-MM-DD");
    const formattedDateDisplay = dayjs(selectedDate).format("DD/MM/YYYY");
    setLoading(true);

    try {
      await PersonnelService.archive(IDPersonneService, formattedDate);

      setOpen(false);
      setSelectedDate(null);

      PersonnelService.clearCaches?.();
      sessionStorage.removeItem("personnels_archives_cache_v2_dates");

      // Mise à jour locale IMMÉDIATE (synchrone) : évite la course avec
      // un éventuel refreshData/re-render déclenché par onArchiveSuccess,
      // qui écrasait l'état avant que le setTimeout précédent ne s'exécute
      // (obligeant l'utilisateur à archiver deux fois).
      onArchiveLocal?.(IDPersonneService);

      onArchiveSuccess?.({
        prenom: prenomPersonne || "",
        nom:    nomPersonne    || "",
        date:   formattedDateDisplay,
        id:     IDPersonneService,
      });

    } catch (error) {
      console.error("Erreur archivage :", error?.response?.data || error?.message);
      onArchiveSuccess?.({ type: "error", text: "L'archivage a échoué." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <IconButton
        size="small"
        title={loading ? "Archivage..." : "Archiver"}
        onMouseDown={(e) => e.stopPropagation()}
        onClick={handleClick}
        disabled={loading}
        sx={{ ml: 0.5, color: "error.main" }}
      >
        <MdDeleteForever style={{ fontSize: 20 }} />
      </IconButton>

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="xs"
        sx={{
          "& .MuiDialog-paper": {
            overflow: "visible",
          },
          "& .MuiDialogContent-root": {
            overflow: "visible",
          },
        }}
      >
        <DialogTitle>Archiver la personne</DialogTitle>

        <DialogContent dividers>
          <Stack spacing={1.2}>
            <Typography>
              Vous allez archiver :{" "}
              <strong>{prenomPersonne} {nomPersonne}</strong>
            </Typography>

            <Typography variant="body2" color="text.secondary">
              ID : {IDPersonneService} — Email : {email || "-"}
            </Typography>

            <Alert severity="info">
              Sélectionnez une <strong>date de sortie</strong> avant d&apos;archiver.
            </Alert>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date de sortie"
                value={selectedDate}
                onChange={(val) => setSelectedDate(val)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: "small",
                  },
                }}
              />
            </LocalizationProvider>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="inherit" disabled={loading}>
            Annuler
          </Button>
          <Button type="button" onClick={handleConfirm} variant="contained" disabled={loading}>
            {loading ? "Archivage..." : "Archiver"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

DeleteMembreComponent.propTypes = {
  IDPersonneService: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  nomPersonne:       PropTypes.string,
  prenomPersonne:    PropTypes.string,
  email:             PropTypes.string,
  onArchiveSuccess:  PropTypes.func,
  onArchiveLocal:    PropTypes.func,
};

export default DeleteMembreComponent;