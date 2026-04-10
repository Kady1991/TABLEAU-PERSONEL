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
  refreshData,
  onRestoreSuccess,
  onRestoreLocal,
}) {
  // Etat pour ouvrir/fermer la popup
  const [open, setOpen] = useState(false);

  // Etat pour gérer le chargement (désactiver les boutons pendant l'appel API)
  const [loading, setLoading] = useState(false);

  // Ouvre la popup
  const handleOpen = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setOpen(true);
  };

  // Ferme la popup
  const handleClose = (event) => {
    event?.preventDefault?.();
    event?.stopPropagation?.();

    // Empêche de fermer si une requête est en cours
    if (loading) return;

    setOpen(false);
  };

  // Fonction principale de restauration
  const handleRestore = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    // Vérification que l'ID est présent
    if (!IDPersonneService) {
      console.error("IDPersonneService manquant :", IDPersonneService);

      onRestoreSuccess?.({
        type: "error",
        text: "Identifiant manquant pour la restauration.",
      });
      return;
    }

    // Activation du loader
    setLoading(true);

    try {
      // Appel API pour restaurer la personne
      await PersonnelService.restore(IDPersonneService);

      // Mise à jour locale (optionnel)
      onRestoreLocal?.(IDPersonneService);

      // Fermeture de la popup
      setOpen(false);

      // Message de succès
      onRestoreSuccess?.({
        type: "success",
        text: `La personne ${prenomPersonne || ""} ${nomPersonne || ""} a été restaurée avec succès.`,
      });

      // Nettoyage du cache
      PersonnelService.clearCaches?.();

      // Rafraîchissement des données
      refreshData?.();
    } catch (error) {
      // Récupération des erreurs détaillées du backend (ASP.NET)
      const errors = error?.response?.data?.errors;

      console.error("Erreur restauration complète :", error);

      // ID envoyé à l'API
      console.error("ID envoyé :", IDPersonneService);

      // Code HTTP (400, 404, etc.)
      console.error("Status :", error?.response?.status);

      // Données complètes retournées par l'API
      console.error("Data brut :", error?.response?.data);

      // Affichage clair des erreurs de validation
      console.error(
        "Errors JSON :",
        JSON.stringify(errors, null, 2)
      );

      // Parcours des champs en erreur pour plus de lisibilité
      if (errors) {
        Object.entries(errors).forEach(([key, value]) => {
          console.error("Champ en erreur :", key, value);
        });
      }

      // Message global
      console.error("Message :", error?.message);

      // Message utilisateur
      onRestoreSuccess?.({
        type: "error",
        text: "La restauration a échoué.",
      });
    } finally {
      // Désactivation du loader
      setLoading(false);
    }
  };

  return (
    <>
      {/* Bouton pour ouvrir la popup */}
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

      {/* Popup de confirmation */}
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
              <strong>
                {prenomPersonne} {nomPersonne}
              </strong>
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

          <Button
            type="button"
            onClick={handleRestore}
            variant="contained"
            disabled={loading}
          >
            {loading ? "Restauration..." : "Restaurer"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

// Définition des types de props
RestoreActionComponent.propTypes = {
  IDPersonneService: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
  nomPersonne: PropTypes.string,
  prenomPersonne: PropTypes.string,
  email: PropTypes.string,
  refreshData: PropTypes.func,
  onRestoreSuccess: PropTypes.func,
  onRestoreLocal: PropTypes.func,
};

export default RestoreActionComponent;