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
  Snackbar,
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
}) {
  const [isArchived, setIsArchived] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null); // dayjs
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState({ open: false, type: "info", text: "" });

  const showToast = (type, text) => setToast({ open: true, type, text });
  const closeToast = () => setToast((t) => ({ ...t, open: false }));

  // ✅ Vérifie si la personne est déjà archivée
  // useEffect(() => {
  // let mounted = true;

  // const checkArchivedStatus = async () => {
  //   try {
  //     if (!email) return;

  //     const data = await PersonnelService.getByEmail(email);

  //     if (!mounted) return;

  //     if (data?.SiArchive !== undefined) {
  //       setIsArchived(Boolean(data.SiArchive));
  //     } else {
  //       setIsArchived(false);
  //     }
  //   } catch (error) {
  //     console.error(
  //       "Erreur check archive :",
  //       error?.response?.data || error?.message,
  //     );
  //   }
  // };

  //   checkArchivedStatus();

  //   return () => {
  //     mounted = false;
  //   };
  // }, [email]);

  const handleClick = () => {
    if (isArchived) {
      showToast("warning", "Cette personne est déjà archivée.");
      return;
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedDate(null);
  };

  const handleConfirm = async () => {
    if (!selectedDate) {
      showToast("error", "Veuillez sélectionner une date de sortie.");
      return;
    }
    if (!email) {
      showToast("error", "Email manquant, impossible d’archiver.");
      return;
    }

    const formattedDate = dayjs(selectedDate).format("YYYY-MM-DD");

    setLoading(true);
    try {
      await PersonnelService.archive(IDPersonneService, formattedDate);

      showToast(
        "success",
        `La personne ${prenomPersonne || ""} ${nomPersonne || ""} a été archivée avec succès.`,
      );

      setIsArchived(true);
      setOpen(false);
      setSelectedDate(null);

      // ✅ vider caches + refresh
      PersonnelService.clearCaches?.();

      if (typeof refreshData === "function") {
        await refreshData();
      }
    } catch (error) {
      console.error(
        "Erreur archivage :",
        error?.response?.data || error?.message,
      );
      showToast("error", "L'archivage a échoué.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <IconButton
        size="small"
        title={isArchived ? "Déjà archivé" : "Archiver"}
        onClick={handleClick}
        disabled={isArchived}
        sx={{
          ml: 0.5,
          color: isArchived ? "grey.400" : "error.main",
        }}
      >
        <MdDeleteForever style={{ fontSize: 20 }} />
      </IconButton>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
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
                slotProps={{ textField: { fullWidth: true, size: "small" } }}
              />
            </LocalizationProvider>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Annuler
          </Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            disabled={loading}
          >
            {loading ? "Archivage..." : "Archiver"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={toast.open}
        autoHideDuration={3500}
        onClose={closeToast}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={closeToast} severity={toast.type} variant="filled">
          {toast.text}
        </Alert>
      </Snackbar>
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
};

export default DeleteMembreComponent;
