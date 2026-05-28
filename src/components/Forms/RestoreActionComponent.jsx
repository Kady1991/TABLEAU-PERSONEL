import { useState } from "react";
import PropTypes from "prop-types";
import { MdRestore } from "react-icons/md";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import PersonnelService from "../../services/PersonnelService";

function RestoreActionComponent({
  IDPersonneService,
  nomPersonne,
  prenomPersonne,
  email,
//  refreshData,
  onRestoreSuccess,
  onRestoreLocal,
}) {
  const [open,    setOpen]    = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOpen = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setOpen(true);
  };

  const handleClose = (event) => {
    event?.preventDefault?.();
    event?.stopPropagation?.();
    if (loading) return;
    setOpen(false);
  };

  const handleRestore = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!IDPersonneService) {
      console.error("IDPersonneService manquant :", IDPersonneService);
      onRestoreSuccess?.({ type: "error", text: "Identifiant manquant pour la restauration." });
      return;
    }

    setLoading(true);

    try {
      await PersonnelService.archive(IDPersonneService);

      // Mise à jour locale
      onRestoreLocal?.(IDPersonneService);

      // Fermeture de la popup
      setOpen(false);

      // Notification → bannière AlertRestoreSuccessComponent
      onRestoreSuccess?.({
        prenom: prenomPersonne || "",
        nom:    nomPersonne    || "",
        id:     IDPersonneService,
      });

      // Nettoyage du cache
      PersonnelService.clearCaches?.();

    } catch (error) {
      const errors = error?.response?.data?.errors;
      console.error("Erreur restauration complète :", error);
      console.error("ID envoyé :", IDPersonneService);
      console.error("Status :", error?.response?.status);
      console.error("Data brut :", error?.response?.data);
      console.error("Errors JSON :", JSON.stringify(errors, null, 2));
      if (errors) {
        Object.entries(errors).forEach(([key, value]) => {
          console.error("Champ en erreur :", key, value);
        });
      }
      console.error("Message :", error?.message);
      onRestoreSuccess?.({ type: "error", text: "La restauration a échoué." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <IconButton
        size="small"
        title={loading ? "Restauration..." : "Restaurer"}
        onMouseDown={(event) => event.stopPropagation()}
        onClick={handleOpen}
        disabled={loading}
        sx={{ ml: 0.5, color: "success.main" }}
      >
        <MdRestore style={{ fontSize: 20 }} />
      </IconButton>

      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="xs"
        onClick={(event) => event.stopPropagation()}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <DialogTitle>Restaurer la personne</DialogTitle>

        <DialogContent dividers>
          <Stack spacing={1}>
            <Typography>
              Confirmer la restauration de :{" "}
              <strong>{prenomPersonne} {nomPersonne}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              ID : {IDPersonneService} — Email : {email || "-"}
            </Typography>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="inherit" disabled={loading}>
            Annuler
          </Button>
          <Button type="button" onClick={handleRestore} variant="contained" disabled={loading}>
            {loading ? "Restauration..." : "Restaurer"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

RestoreActionComponent.propTypes = {
  IDPersonneService: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  nomPersonne:       PropTypes.string,
  prenomPersonne:    PropTypes.string,
  email:             PropTypes.string,
  refreshData:       PropTypes.func,
  onRestoreSuccess:  PropTypes.func,
  onRestoreLocal:    PropTypes.func,
};

export default RestoreActionComponent;