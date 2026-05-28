import { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { Box, IconButton, Typography, useTheme, alpha } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import RestoreIcon from "@mui/icons-material/Restore";
import CloseIcon from "@mui/icons-material/Close";

export default function AlertRestoreSuccessComponent({ info, onClose, autoDismiss = 6000 }) {
  const theme   = useTheme();
  const teal    = theme.palette.secondary.main;
  const primary = theme.palette.primary.main;
  const radius  = `${theme.shape.borderRadius}px`;

  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const handleClose = useCallback(() => {
    setLeaving(true);
    setTimeout(() => { setVisible(false); onClose?.(); }, 300);
  }, [onClose]);

  useEffect(() => {
    if (!info) { setVisible(false); setLeaving(false); return; }
    setLeaving(false);
    setVisible(true);
    if (autoDismiss > 0) {
      const t = setTimeout(() => handleClose(), autoDismiss);
      return () => clearTimeout(t);
    }
  }, [info, autoDismiss, handleClose]);

  if (!visible || !info) return null;

  const fullName = `${info.prenom || ""} ${info.nom || ""}`.trim();

  return (
    <>
      <style>{`
        @keyframes restoreIn  { from { opacity:0; transform:translateY(-8px); max-height:0; }   to { opacity:1; transform:translateY(0); max-height:120px; } }
        @keyframes restoreOut { from { opacity:1; transform:translateY(0); max-height:120px; }  to { opacity:0; transform:translateY(-6px); max-height:0; } }
        .restore-banner         { animation: restoreIn  0.4s cubic-bezier(0.22,1,0.36,1) both; overflow:hidden; }
        .restore-banner.leaving { animation: restoreOut 0.3s cubic-bezier(0.55,0,0.45,1) both; }
      `}</style>

      <Box
        className={`restore-banner${leaving ? " leaving" : ""}`}
        sx={{
          mb: 2,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          px: 2,
          py: 1.25,
          borderRadius: radius,
          border: "0.5px solid",
          borderColor: alpha(teal, 0.3),
          borderLeft: `3px solid ${teal}`,
          background: alpha(teal, 0.06),
        }}
      >
        <Box sx={{
          width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
          background: alpha(teal, 0.12),
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <RestoreIcon sx={{ fontSize: 18, color: "secondary.main" }} />
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography sx={{
              fontSize: 13.5, fontWeight: 600, color: "primary.main",
              lineHeight: 1.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>
              {fullName || "Membre"} a été restauré(e)
            </Typography>
            {info.id && (
              <Box sx={{ px: 0.9, py: 0.2, borderRadius: "6px", background: alpha(primary, 0.08), flexShrink: 0 }}>
                <Typography sx={{ fontSize: 11, fontWeight: 600, color: "primary.main", lineHeight: 1.4 }}>
                  #{info.id}
                </Typography>
              </Box>
            )}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mt: 0.4 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <CheckCircleOutlineIcon sx={{ fontSize: 11, color: "secondary.main" }} />
              <Typography sx={{ fontSize: 12, color: "secondary.main" }}>Restauré avec succès</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <GroupAddIcon sx={{ fontSize: 11, color: "secondary.main" }} />
              <Typography sx={{ fontSize: 12, color: "secondary.main" }}>Réintégré aux effectifs actifs</Typography>
            </Box>
          </Box>
        </Box>

        <IconButton
          size="small"
          onClick={handleClose}
          aria-label="Fermer la notification"
          sx={{ color: "secondary.main", flexShrink: 0, borderRadius: radius, "&:hover": { background: alpha(teal, 0.1) } }}
        >
          <CloseIcon sx={{ fontSize: 16 }} />
        </IconButton>
      </Box>
    </>
  );
}

AlertRestoreSuccessComponent.propTypes = {
  info: PropTypes.shape({
    prenom: PropTypes.string,
    nom:    PropTypes.string,
    id:     PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  onClose:     PropTypes.func,
  autoDismiss: PropTypes.number,
};