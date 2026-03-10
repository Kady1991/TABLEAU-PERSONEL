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
  PersonneID,
  nomPersonne,
  prenomPersonne,
  email,
  refreshData,
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRestore = async () => {
    if (!PersonneID) return;

    setLoading(true);
    try {
      await PersonnelService.restore(PersonneID);

      //  vider caches + refresh
      PersonnelService.clearCaches?.();

      if (typeof refreshData === "function") {
        await refreshData();
      }

      setOpen(false);
    } catch (error) {
      console.error(
        "Erreur restauration :",
        error?.response?.data || error?.message
      );
      alert("Erreur lors de la restauration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <IconButton
        size="small"
        title="Restaurer"
        onClick={() => setOpen(true)}
        sx={{ ml: 0.5, color: "success.main" }}
      >
        <MdRestore style={{ fontSize: 20 }} />
      </IconButton>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Restaurer la personne</DialogTitle>

        <DialogContent dividers>
          <Stack spacing={1}>
            <Typography>
              Confirmer la restauration de :{" "}
              <strong>
                {nomPersonne} {prenomPersonne}
              </strong>
            </Typography>

            {email ? (
              <Typography variant="body2" color="text.secondary">
                Email : {email}
              </Typography>
            ) : null}
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)} color="inherit">
            Annuler
          </Button>
          <Button onClick={handleRestore} variant="contained" disabled={loading}>
            {loading ? "Restauration..." : "Restaurer"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

RestoreActionComponent.propTypes = {
  PersonneID: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  nomPersonne: PropTypes.string,
  prenomPersonne: PropTypes.string,
  email: PropTypes.string,
  refreshData: PropTypes.func,
};

export default RestoreActionComponent;