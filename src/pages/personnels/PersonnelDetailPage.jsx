import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ArrowBackIcon        from "@mui/icons-material/ArrowBack";
import RefreshIcon          from "@mui/icons-material/Refresh";
import EmailIcon            from "@mui/icons-material/Email";
import PhoneIcon            from "@mui/icons-material/Phone";
import BusinessIcon         from "@mui/icons-material/Business";
import AccountTreeIcon      from "@mui/icons-material/AccountTree";
import EmojiEventsIcon      from "@mui/icons-material/EmojiEvents";
import WorkIcon             from "@mui/icons-material/Work";
import CalendarMonthIcon    from "@mui/icons-material/CalendarMonth";
import EventBusyIcon        from "@mui/icons-material/EventBusy";
import LocationOnIcon       from "@mui/icons-material/LocationOn";
import PersonnelService     from "../../services/PersonnelService.js";

dayjs.locale("fr");

// ─────────────────────────────────────────────────────────────
// SectionLabel
// ─────────────────────────────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <Typography sx={{
      fontSize: 10,
      fontWeight: 600,
      color: "secondary.main",
      textTransform: "uppercase",
      letterSpacing: "0.1em",
      pt: 1.75,
      pb: 1.25,
      borderTop: "0.5px solid",
      borderColor: "divider",
    }}>
      {children}
    </Typography>
  );
}
SectionLabel.propTypes = {
  children: PropTypes.node.isRequired,
};

// ─────────────────────────────────────────────────────────────
// InfoRow
// ─────────────────────────────────────────────────────────────
function InfoRow({ icon, label, value, accent, muted, danger, last }) {
  if (value === undefined || value === null) return null;

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1.5}
      sx={{
        py: 1.25,
        borderBottom: last ? "none" : "0.5px solid",
        borderColor: "divider",
      }}
    >
      <Box sx={{
        width: 28,
        height: 28,
        borderRadius: 1.75,
        background: "rgba(2,178,175,0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        "& svg": { fontSize: 14, color: "secondary.main" },
      }}>
        {icon}
      </Box>

      <Typography sx={{ fontSize: 13, color: "text.secondary", width: 130, flexShrink: 0 }}>
        {label}
      </Typography>

      <Typography sx={{
        fontSize: 14,
        flex: 1,
        color: accent  ? "secondary.main"
            : danger  ? "error.main"
            : muted   ? "text.disabled"
            : "text.primary",
        fontStyle:  muted ? "italic" : "normal",
        fontWeight: muted ? 400 : 500,
      }}>
        {value}
      </Typography>
    </Stack>
  );
}
InfoRow.propTypes = {
  icon:   PropTypes.node.isRequired,
  label:  PropTypes.string.isRequired,
  value:  PropTypes.string,
  accent: PropTypes.bool,
  muted:  PropTypes.bool,
  danger: PropTypes.bool,
  last:   PropTypes.bool,
};
InfoRow.defaultProps = {
  value:  undefined,
  accent: false,
  muted:  false,
  danger: false,
  last:   false,
};

// ─────────────────────────────────────────────────────────────
// HierarchyCard
// ─────────────────────────────────────────────────────────────
const hierColors = {
  souschef: { bg: "#f0edfb", color: "#5a3fb5" },
  chef:     { bg: "#e0f4f4", color: "#027b79" },
  dept:     { bg: "#e0ecf6", color: "#003B68" },
};

function HierarchyCard({ role, nom, prenom, variant }) {
  const fullName = [nom, prenom].filter(Boolean).join(" ");
  if (!fullName.trim()) return null;

  const initials = [nom, prenom]
    .filter(Boolean)
    .map(s => s.charAt(0).toUpperCase())
    .join("");

  const c = hierColors[variant] || hierColors.chef;

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1.25}
      sx={{
        flex: 1,
        border: "0.5px solid",
        borderColor: "divider",
        borderRadius: 2.5,
        px: 1.75,
        py: 1.5,
        minWidth: 0,
      }}
    >
      <Box sx={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        bgcolor: c.bg,
        color: c.color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 12,
        fontWeight: 500,
        flexShrink: 0,
      }}>
        {initials}
      </Box>
      <Box minWidth={0}>
        <Typography sx={{
          fontSize: 10,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          color: "text.disabled",
          mb: 0.4,
        }}>
          {role}
        </Typography>
        <Typography sx={{
          fontSize: 14,
          fontWeight: 500,
          color: "text.primary",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}>
          {fullName}
        </Typography>
      </Box>
    </Stack>
  );
}
HierarchyCard.propTypes = {
  role:    PropTypes.string.isRequired,
  nom:     PropTypes.string,
  prenom:  PropTypes.string,
  variant: PropTypes.oneOf(["souschef", "chef", "dept"]),
};
HierarchyCard.defaultProps = {
  nom:     "",
  prenom:  "",
  variant: "chef",
};

// ─────────────────────────────────────────────────────────────
// Page principale
// ─────────────────────────────────────────────────────────────
export default function PersonnelDetail() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const theme    = useTheme();

  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState("");
  const [personData, setPersonData] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [personRes, gradesRes, fonctionsRes] = await Promise.all([
        PersonnelService.getById(id),
        PersonnelService.getGrades(),
        PersonnelService.getFonctions(),
      ]);

      const person    = personRes.data || {};
      const grades    = Array.isArray(gradesRes.data)    ? gradesRes.data    : [];
      const fonctions = Array.isArray(fonctionsRes.data) ? fonctionsRes.data : [];

      const { sousServiceService } = await import("../../services/AffectationsService.js");
      const sousServRes  = await sousServiceService.getAll();
      const sousServData = Array.isArray(sousServRes?.data) ? sousServRes.data : [];
      const sousServTrouve = sousServData.find(
        ss => ss.nomSousServiceFr === person.NomSousServiceFr
      );

      const gradeId    = person.WWGradeID ?? person.IDWWGrade ?? person.GradeID ?? person.WWGrade ?? person.IdWWGrade ?? person.IdGrade ?? null;
      const fonctionId = person.FonctionID ?? person.IDFonction ?? person.IdFonction ?? null;

      const gradeTrouve =
        grades.find(g => Number(g.IDWWGrade) === Number(gradeId)) ||
        grades.find(g => Number(g.WWGradeID) === Number(gradeId)) ||
        grades.find(g => Number(g.IdWWGrade) === Number(gradeId)) || null;

      const fonctionTrouvee =
        fonctions.find(f => Number(f.IDFonction) === Number(fonctionId)) ||
        fonctions.find(f => Number(f.IdFonction) === Number(fonctionId)) || null;

      const nomGrade    = person.NomWWGradeFr  ?? person.NomGradeFr        ?? person.LibelleGradeFr          ?? gradeTrouve?.NomWWGradeFr    ?? gradeTrouve?.NomGradeFr    ?? null;
      const nomFonction = person.NomFonctionFr ?? person.LibelleFonctionFr ?? fonctionTrouvee?.NomFonctionFr  ?? fonctionTrouvee?.LibelleFonctionFr ?? null;

      setPersonData({
        ...person,
        NomWWGradeFr:   nomGrade,
        NomFonctionFr:  nomFonction,
        NomSousChef:    person.NomSousChef    || sousServTrouve?.nomSousChef    || null,
        PrenomSousChef: person.PrenomSousChef || sousServTrouve?.prenomSousChef || null,
      });
    } catch (e) {
      setError(e?.message || "Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [id]); // eslint-disable-line

  const p          = personData || {};
  const isArchive  = p.SiArchive === "true" || p.SiArchive === true;
  const hasSortie  = !!p.DateSortie;

  const initiales = p.NomPersonne && p.PrenomPersonne
    ? `${p.NomPersonne.charAt(0)}${p.PrenomPersonne.charAt(0)}`.toUpperCase()
    : "??";

  const adresse = [
    p.NomRueFr,
    p.Numero,
    p.Batiment  ? `Bât. ${p.Batiment}` : null,
    p.Etage != null ? `Ét. ${p.Etage}` : null,
  ].filter(Boolean).join(" — ") || null;

  const dateEntree = p.DateEntree ? dayjs(p.DateEntree).format("D MMMM YYYY") : null;
  const dateSortie = hasSortie    ? dayjs(p.DateSortie).format("D MMMM YYYY") : null;

  const hasHierarchie = p.NomSousChef || p.NomChefService || p.NomChefDepartement;

  const avatarBg    = isArchive ? "rgba(192,57,43,0.1)"   : "rgba(0,59,104,0.08)";
  const avatarColor = isArchive ? "error.main"             : "primary.main";
  const dotColor    = isArchive ? theme.palette.error.main : "#22c55e";

  return (
    <Box sx={{ maxWidth: 720, mx: "auto", px: { xs: 1, sm: 2 }, py: 2 }}>

      {/* Nav */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2.5}>
        <Button
          startIcon={<ArrowBackIcon sx={{ fontSize: "15px !important" }} />}
          onClick={() => navigate(-1)}
          size="small"
          sx={{ fontWeight: 500, color: "secondary.main", fontSize: 13 }}
        >
          Retour
        </Button>
        <Tooltip title="Actualiser">
          <IconButton
            size="small"
            onClick={loadData}
            sx={{ border: "0.5px solid", borderColor: "divider", borderRadius: 1.5, bgcolor: "background.paper" }}
          >
            <RefreshIcon sx={{ fontSize: "15px !important" }} />
          </IconButton>
        </Tooltip>
      </Stack>

      {loading && (
        <Stack alignItems="center" py={8} spacing={2}>
          <CircularProgress size={28} />
          <Typography variant="body2" color="text.secondary">Chargement du profil...</Typography>
        </Stack>
      )}
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {!loading && !error && !personData && (
        <Alert severity="warning">Aucune donnée trouvée pour cet utilisateur.</Alert>
      )}

      {!loading && !error && personData && (
        <Box sx={{
          bgcolor: "background.paper",
          border: "0.5px solid",
          borderColor: "divider",
          borderRadius: 3,
          overflow: "hidden",
        }}>

          {/* Hero */}
          <Stack direction="row" alignItems="flex-start" spacing={1.75} sx={{ px: 3, pt: 2.75, pb: 2.5 }}>
            <Box sx={{ position: "relative", flexShrink: 0 }}>
              <Box sx={{
                width: 50, height: 50, borderRadius: "50%",
                bgcolor: avatarBg, color: avatarColor,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 17, fontWeight: 500,
              }}>
                {initiales}
              </Box>
              <Box sx={{
                position: "absolute", bottom: 0, right: 0,
                width: 12, height: 12, borderRadius: "50%",
                bgcolor: dotColor,
                border: "2px solid", borderColor: "background.paper",
              }} />
            </Box>

            <Box flex={1} minWidth={0}>
              <Typography sx={{ fontSize: 18, fontWeight: 500, color: "primary.main", mb: 0.4 }}>
                {p.PrenomPersonne} {(p.NomPersonne || "").toUpperCase()}
              </Typography>
              <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 1 }}>
                {p.Email}
              </Typography>
              <Stack direction="row" gap={0.75} flexWrap="wrap">
                {p.NomFonctionFr && (
                  <Chip label={p.NomFonctionFr} size="small" sx={{
                    fontSize: 12, height: 24, fontWeight: 500,
                    bgcolor: "rgba(2,178,175,0.1)", color: "secondary.main", borderRadius: "99px",
                  }} />
                )}
                {isArchive && (
                  <Chip label="Archivé" size="small" sx={{
                    fontSize: 12, height: 24, fontWeight: 500,
                    bgcolor: "rgba(192,57,43,0.1)", color: "error.main", borderRadius: "99px",
                  }} />
                )}
              </Stack>
            </Box>

            <Box sx={{ textAlign: "right", flexShrink: 0 }}>
              <Typography sx={{ fontSize: 10, color: "text.disabled", mb: 0.3 }}>IDPersonneService</Typography>
              <Typography sx={{ fontSize: 18, fontWeight: 500, color: "primary.main" }}>{id}</Typography>
            </Box>
          </Stack>

          {/* Contact */}
          <Box sx={{ px: 3 }}>
            <SectionLabel>Contact</SectionLabel>
            <InfoRow icon={<EmailIcon />} label="E-mail"    value={p.Email  || "—"} accent />
            <InfoRow icon={<PhoneIcon />} label="Téléphone" value={p.TelPro || "—"} last />
          </Box>

          {/* Affectation */}
          <Box sx={{ px: 3 }}>
            <SectionLabel>Affectation</SectionLabel>
            <InfoRow icon={<BusinessIcon />}      label="Service"        value={p.NomServiceFr     || "—"} />
            <InfoRow icon={<AccountTreeIcon />}   label="Département"    value={p.NomDepartementFr || "—"} />
            <InfoRow icon={<EmojiEventsIcon />}   label="Grade"          value={p.NomWWGradeFr     || "—"} />
            <InfoRow icon={<WorkIcon />}           label="Fonction"       value={p.NomFonctionFr    || "—"} />
            <InfoRow icon={<CalendarMonthIcon />} label="Date d'entrée"  value={dateEntree         || "—"} />
            <InfoRow
              icon={<EventBusyIcon />}
              label="Date de sortie"
              value={dateSortie || "Non spécifiée"}
              danger={hasSortie}
              muted={!hasSortie}
            />
            <InfoRow icon={<LocationOnIcon />}    label="Adresse"        value={adresse            || "—"} last />
          </Box>

          {/* Hiérarchie */}
          {hasHierarchie && (
            <Box sx={{ px: 3, pb: 2.75 }}>
              <SectionLabel>Hiérarchie</SectionLabel>
              <Stack direction="row" spacing={1.25} sx={{ mt: 0.5 }} flexWrap="wrap">
                {p.NomSousChef && (
                  <HierarchyCard
                    role="Sous-chef"
                    nom={p.NomSousChef}
                    prenom={p.PrenomSousChef}
                    variant="souschef"
                  />
                )}
                {p.NomChefService && (
                  <HierarchyCard
                    role="Chef de service"
                    nom={p.NomChefService}
                    prenom={p.PrenomChefService}
                    variant="chef"
                  />
                )}
                {p.NomChefDepartement && (
                  <HierarchyCard
                    role="Chef de département"
                    nom={p.NomChefDepartement}
                    prenom={p.PrenomChefDepartement}
                    variant="dept"
                  />
                )}
              </Stack>
            </Box>
          )}

        </Box>
      )}
    </Box>
  );
}