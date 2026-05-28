    import { useEffect, useState } from "react";
    import PropTypes from "prop-types";
    import { Box, IconButton, Typography, useTheme } from "@mui/material";
    import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
    import ArchiveIcon from "@mui/icons-material/Archive";
    import CloseIcon from "@mui/icons-material/Close";
    import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

    export default function AlertArchiveSuccessComponent({ info, onClose, autoDismiss = 6000 }) {
    const theme = useTheme();
    const red   = theme.palette.error.main;  // #c0392b

    const [visible, setVisible] = useState(false);
    const [leaving, setLeaving] = useState(false);

    useEffect(() => {
        if (!info) { setVisible(false); setLeaving(false); return; }
        setLeaving(false);
        setVisible(true);
        if (autoDismiss > 0) {
        const t = setTimeout(() => handleClose(), autoDismiss);
        return () => clearTimeout(t);
        }
    }, [info]);

    const handleClose = () => {
        setLeaving(true);
        setTimeout(() => { setVisible(false); onClose?.(); }, 300);
    };

    if (!visible || !info) return null;

    const fullName = `${info.prenom || ""} ${info.nom || ""}`.trim();

    return (
        <>
        <style>{`
            @keyframes bannerIn  { from { opacity:0; transform:translateY(-8px); max-height:0; }   to { opacity:1; transform:translateY(0); max-height:120px; } }
            @keyframes bannerOut { from { opacity:1; transform:translateY(0);    max-height:120px; } to { opacity:0; transform:translateY(-6px); max-height:0; } }
            .archive-banner         { animation: bannerIn  0.4s cubic-bezier(0.22,1,0.36,1) both; overflow:hidden; }
            .archive-banner.leaving { animation: bannerOut 0.3s cubic-bezier(0.55,0,0.45,1) both; }
        `}</style>

        <Box
            className={`archive-banner${leaving ? " leaving" : ""}`}
            sx={{
            mb: 2,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            px: 2,
            py: 1.25,
            borderRadius: `${theme.shape.borderRadius}px`,
            border: "0.5px solid",
            borderColor: "error.light",
            borderLeft: `3px solid ${red}`,
            background: theme.palette.error.light + "18",
            }}
        >
            {/* Icône */}
            <Box sx={{
            width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
            background: theme.palette.error.light + "30",
            display: "flex", alignItems: "center", justifyContent: "center",
            }}>
            <ArchiveIcon sx={{ fontSize: 18, color: "error.main" }} />
            </Box>

            {/* Texte */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography sx={{
                fontSize: 13.5, fontWeight: 600, color: "error.dark",
                lineHeight: 1.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>
                {fullName || "Membre"} est maintenant archivé(e)
                </Typography>
                {info.id && (
                <Box sx={{ px: 0.9, py: 0.2, borderRadius: "6px", background: theme.palette.error.light + "30", flexShrink: 0 }}>
                    <Typography sx={{ fontSize: 11, fontWeight: 600, color: "error.dark", lineHeight: 1.4 }}>
                    #{info.id}
                    </Typography>
                </Box>
                )}
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mt: 0.4 }}>
                {info.date && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <CalendarTodayIcon sx={{ fontSize: 11, color: "error.main" }} />
                    <Typography sx={{ fontSize: 12, color: "error.main" }}>
                    Date de sortie : {info.date}
                    </Typography>
                </Box>
                )}
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <CheckCircleOutlineIcon sx={{ fontSize: 12, color: "error.main" }} />
                <Typography sx={{ fontSize: 12, color: "error.main" }}>
                    Archivé avec succès
                </Typography>
                </Box>
            </Box>
            </Box>

            {/* Bouton fermer */}
            <IconButton
            size="small"
            onClick={handleClose}
            aria-label="Fermer la notification"
            sx={{ color: "error.main", flexShrink: 0, borderRadius: `${theme.shape.borderRadius}px`, "&:hover": { background: theme.palette.error.light + "30" } }}
            >
            <CloseIcon sx={{ fontSize: 18 }} />
            </IconButton>
        </Box>
        </>
    );
    }

    AlertArchiveSuccessComponent.propTypes = {
    info: PropTypes.shape({
        prenom: PropTypes.string,
        nom:    PropTypes.string,
        date:   PropTypes.string,
        id:     PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
    onClose:     PropTypes.func,
    autoDismiss: PropTypes.number,
    };