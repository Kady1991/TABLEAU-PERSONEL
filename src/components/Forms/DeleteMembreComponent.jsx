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
  refreshData,
  onArchiveSuccess,
  onArchiveLocal,
}) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setOpen(true);
  };

  const handleClose = (event) => {
    event?.preventDefault?.();
    event?.stopPropagation?.();
    if (loading) return;
    setOpen(false);
    setSelectedDate(null);
  };

  const handleConfirm = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!selectedDate || !dayjs(selectedDate).isValid()) {
      onArchiveSuccess?.({
        type: "error",
        text: "Veuillez sélectionner une date de sortie.",
      });
      return;
    }

    const formattedDate = dayjs(selectedDate).format("YYYY-MM-DD");
    setLoading(true);

    try {
      // 1. Exécution de l'archivage côté serveur
      await PersonnelService.archive(IDPersonneService, formattedDate);

      // 2. Mise à jour LOCALE immédiate du tableau
      onArchiveLocal?.(IDPersonneService);

      // 3. Fermeture de la modale et reset
      setOpen(false);
      setSelectedDate(null);

      // 4. Notification de succès
      onArchiveSuccess?.({
        type: "success",
        text: `La personne ${prenomPersonne || ""} ${nomPersonne || ""} a été archivée avec succès.`,
      });

      // 5. Nettoyage des caches et rafraîchissement global
      if (PersonnelService.clearCaches) {
          PersonnelService.clearCaches();
      }
      
      // On déclenche le refreshData après un très court délai pour laisser l'état local se stabiliser
      setTimeout(() => {
        refreshData?.();
      }, 100);

    } catch (error) {
      console.error(
        "Erreur archivage :",
        error?.response?.data || error?.message
      );

      onArchiveSuccess?.({
        type: "error",
        text: "L'archivage a échoué.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <IconButton
        size="small"
        title={loading ? "Archivage..." : "Archiver"}
        onMouseDown={(event) => event.stopPropagation()}
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
        onClick={(event) => event.stopPropagation()}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <DialogTitle>Archiver la personne</DialogTitle>

        <DialogContent dividers>
          <Stack spacing={1.2}>
            <Typography>
              Vous allez archiver :{" "}
              <strong>
                {prenomPersonne} {nomPersonne}
              </strong>
            </Typography>

            <Typography variant="body2" color="text.secondary">
              ID : {IDPersonneService} — Email : {email || "-"}
            </Typography>

            <Alert severity="info">
              Sélectionnez une <strong>date de sortie</strong> avant d’archiver.
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
                    onClick: (event) => event.stopPropagation(),
                    onMouseDown: (event) => event.stopPropagation(),
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
          <Button
            type="button"
            onClick={handleConfirm}
            variant="contained"
            disabled={loading}
          >
            {loading ? "Archivage..." : "Archiver"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

DeleteMembreComponent.propTypes = {
  IDPersonneService: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  nomPersonne: PropTypes.string,
  prenomPersonne: PropTypes.string,
  email: PropTypes.string,
  refreshData: PropTypes.func,
  onArchiveSuccess: PropTypes.func,
  onArchiveLocal: PropTypes.func,
};

export default DeleteMembreComponent;