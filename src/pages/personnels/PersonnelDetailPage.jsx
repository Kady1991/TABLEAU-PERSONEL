import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import ArrowBackIcon     from "@mui/icons-material/ArrowBack";
import RefreshIcon       from "@mui/icons-material/Refresh";
import EmailIcon         from "@mui/icons-material/Email";
import PhoneIcon         from "@mui/icons-material/Phone";
import BusinessIcon      from "@mui/icons-material/Business";
import AccountTreeIcon   from "@mui/icons-material/AccountTree";
import EmojiEventsIcon   from "@mui/icons-material/EmojiEvents";
import WorkIcon          from "@mui/icons-material/Work";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnIcon    from "@mui/icons-material/LocationOn";
import PersonnelService  from "../../services/PersonnelService.js";

dayjs.locale("fr");

// ── SectionLabel ──────────────────────────────────────────────
function SectionLabel({ children }) {
  const { custom: { detail: t } } = useTheme();
  return <Typography sx={t.sectionLabel}>{children}</Typography>;
}

// ── InfoRow ───────────────────────────────────────────────────
function InfoRow({ icon, label, value, accent, muted }) {
  const theme = useTheme();
  const t     = theme.custom.detail;
  if (value === undefined) return null;

  return (
    <Stack direction="row" alignItems="center" spacing={1.5} sx={t.infoRow}>
      {/* iconSm gère le fontSize de toutes les icônes InfoRow */}
      <Box sx={{ ...t.infoIconBox, bgcolor: `${theme.palette.secondary.main}18`, color: theme.palette.secondary.main }}>
        {icon}
      </Box>
      <Typography sx={t.infoLabel}>{label}</Typography>
      <Typography sx={{
        ...t.infoValue,
        color:      accent ? "primary.main" : muted ? "text.disabled" : "text.primary",
        fontWeight: accent ? 500 : 400,
        fontStyle:  muted  ? "italic" : "normal",
      }}>
        {value}
      </Typography>
    </Stack>
  );
}

// ── HierarchyCard ─────────────────────────────────────────────
function HierarchyCard({ role, nom, prenom }) {
  const { custom: { detail: t } } = useTheme();
  const fullName = [nom, prenom].filter(Boolean).join(" ");
  if (!fullName.trim()) return null;
  const initials = [nom, prenom].filter(Boolean).map((s) => s.charAt(0).toUpperCase()).join("");

  return (
    <Stack direction="row" alignItems="center" spacing={1.25} sx={t.hierCard}>
      <Box sx={t.hierAvatar}>{initials}</Box>
      <Box>
        <Typography sx={t.hierRole}>{role}</Typography>
        <Typography sx={t.hierName}>{fullName}</Typography>
      </Box>
    </Stack>
  );
}

// ── Page ──────────────────────────────────────────────────────
export default function PersonnelDetail() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const theme    = useTheme();
  const t        = theme.custom.detail;

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

    // ── Logs de diagnostic ──────────────────────────────────────────────
console.log("📋 getById :", JSON.stringify({
  NomServiceFr:       person.NomServiceFr,
  NomSousServiceFr:   person.NomSousServiceFr,

  NomSousChef:        person.NomSousChef,
  PrenomSousChef:     person.PrenomSousChef,

  NomChefService:     person.NomChefService,
  NomChefDepartement: person.NomChefDepartement,

  NomDepartementFr:   person.NomDepartementFr,
  ServiceID:          person.ServiceID,
  SousServiceID:      person.SousServiceID,
}, null, 2));

    const { sousServiceService } = await import("../../services/AffectationsService.js");
    const sousServRes  = await sousServiceService.getAll();
    const sousServData = Array.isArray(sousServRes?.data) ? sousServRes.data : [];
    const sousServTrouve = sousServData.find(
      ss => ss.nomSousServiceFr === person.NomSousServiceFr
    );
    console.log(" sousservice trouvé :", JSON.stringify(sousServTrouve, null, 2));
    // ────────────────────────────────────────────────────────────────────

    const gradeId    = person.WWGradeID ?? person.IDWWGrade ?? person.GradeID ?? person.WWGrade ?? person.IdWWGrade ?? person.IdGrade ?? null;
    const fonctionId = person.FonctionID ?? person.IDFonction ?? person.IdFonction ?? null;

    const gradeTrouve =
      grades.find((g) => Number(g.IDWWGrade)  === Number(gradeId)) ||
      grades.find((g) => Number(g.WWGradeID)  === Number(gradeId)) ||
      grades.find((g) => Number(g.IdWWGrade)  === Number(gradeId)) || null;
    const fonctionTrouvee =
      fonctions.find((f) => Number(f.IDFonction) === Number(fonctionId)) ||
      fonctions.find((f) => Number(f.IdFonction) === Number(fonctionId)) || null;

    const nomGrade    = person.NomWWGradeFr ?? person.NomGradeFr ?? person.LibelleGradeFr ?? gradeTrouve?.NomWWGradeFr ?? gradeTrouve?.NomGradeFr ?? null;
    const nomFonction = person.NomFonctionFr ?? person.LibelleFonctionFr ?? fonctionTrouvee?.NomFonctionFr ?? fonctionTrouvee?.LibelleFonctionFr ?? null;

    // setPersonData({ ...person, NomWWGradeFr: nomGrade, NomFonctionFr: nomFonction });
    setPersonData({
  ...person,

  NomWWGradeFr: nomGrade,
  NomFonctionFr: nomFonction,

  NomSousChef:
    person.NomSousChef ||
    sousServTrouve?.nomSousChef ||
    null,

  PrenomSousChef:
    person.PrenomSousChef ||
    sousServTrouve?.prenomSousChef ||
    null,
});
  } catch (e) {
    setError(e?.message || "Erreur lors du chargement");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => { loadData(); }, [id]); // eslint-disable-line

  const p = personData || {};

  const initiales = p.NomPersonne && p.PrenomPersonne
    ? `${p.NomPersonne.charAt(0)}${p.PrenomPersonne.charAt(0)}`.toUpperCase()
    : "??";

  const adresse = [
    p.NomRueFr,
    p.Numero,
    p.Batiment  ? `Bât. ${p.Batiment}` : null,
    p.Etage != null ? `Ét. ${p.Etage}` : null,
  ].filter(Boolean).join(" — ") || null;

  const dateEntree    = p.DateEntree ? dayjs(p.DateEntree).format("D MMMM YYYY") : null;
  const dateSortie    = p.DateSortie ? dayjs(p.DateSortie).format("D MMMM YYYY") : "Non spécifiée";
  const hasHierarchie = p.NomChefService || p.NomChefDepartement;

  return (
    <Box sx={t.page}>

      {/* Nav — iconXsm gère le fontSize des icônes boutons */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2.5}>
        <Button startIcon={<ArrowBackIcon sx={t.iconXsm} />} onClick={() => navigate(-1)} size="small" sx={t.backBtn}>
          Retour
        </Button>
        <Tooltip title="Actualiser">
          <IconButton size="small" onClick={loadData} sx={t.refreshBtn}>
            <RefreshIcon sx={t.iconXsm} />
          </IconButton>
        </Tooltip>
      </Stack>

      {loading && (
        <Stack alignItems="center" py={8} spacing={2}>
          <CircularProgress size={28} />
          <Typography variant="body2" color="text.secondary">Chargement du profil...</Typography>
        </Stack>
      )}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && !personData && (
        <Alert severity="warning">Aucune donnée trouvée pour cet utilisateur.</Alert>
      )}

      {!loading && !error && personData && (
        <Box sx={t.card}>

          {/* Hero */}
          <Stack direction="row" alignItems="center" spacing={2} sx={t.hero}>
            <Box sx={t.avatar}>{initiales}</Box>

            <Box flex={1}>
              <Typography sx={t.heroName}>
                {p.PrenomPersonne} {(p.NomPersonne || "").toUpperCase()}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={t.heroEmail}>
                {p.Email}
              </Typography>
              <Stack direction="row" flexWrap="wrap" gap={0.75}>
                {p.NomWWGradeFr && (
                  <Chip label={p.NomWWGradeFr} size="large" sx={{ ...t.chipGrade, bgcolor: `${theme.palette.primary.main}14`, color: "primary.main" }} />
                )}
                {p.NomFonctionFr && (
                  <Chip label={p.NomFonctionFr} size="large" sx={{ ...t.chipFonction, bgcolor: `${theme.palette.secondary.main}14`, color: "secondary.main" }} />
                )}
                {p.SiTypePersonnel && (
                  <Chip label="Personnel" size="large" variant="outlined" sx={t.chipOutlined} />
                )}
                {p.SiArchive === "true" && (
                  <Chip label="Archivé" size="large" color="error" sx={{ height: 22 }} />
                )}
              </Stack>
            </Box>

            <Box sx={t.idBox}>
              <Typography sx={t.idLabel}>IDPersonneService</Typography>
              <Typography sx={t.idValue}>{id}</Typography>
            </Box>
          </Stack>

          {/* Contact — iconSm gère le fontSize des icônes InfoRow */}
          <Box sx={t.section}>
            <SectionLabel>Contact</SectionLabel>
            <InfoRow icon={<EmailIcon sx={t.iconSm} />} label="E-mail"    value={p.Email  || "-"} accent />
            <InfoRow icon={<PhoneIcon sx={t.iconSm} />} label="Téléphone" value={p.TelPro || "-"} />
          </Box>

          {/* Affectation */}
          <Box sx={t.section}>
            <SectionLabel>Affectation</SectionLabel>
            <InfoRow icon={<BusinessIcon      sx={t.iconSm} />} label="Service"        value={p.NomServiceFr     || "-"} />
            <InfoRow icon={<AccountTreeIcon   sx={t.iconSm} />} label="Département"    value={p.NomDepartementFr || "-"} />
            <InfoRow icon={<EmojiEventsIcon   sx={t.iconSm} />} label="Grade"          value={p.NomWWGradeFr     || "-"} />
            <InfoRow icon={<WorkIcon          sx={t.iconSm} />} label="Fonction"       value={p.NomFonctionFr    || "-"} />
            <InfoRow icon={<CalendarMonthIcon sx={t.iconSm} />} label="Date d'entrée"  value={dateEntree || "-"} />
            <InfoRow icon={<CalendarTodayIcon sx={t.iconSm} />} label="Date de sortie" value={dateSortie} muted={!p.DateSortie} />
            <InfoRow icon={<LocationOnIcon    sx={t.iconSm} />} label="Adresse"        value={adresse || "-"} />
          </Box>

          {/* Hiérarchie */}
{/* Hiérarchie */}
{hasHierarchie && (
  <Box sx={t.sectionLast}>
    <SectionLabel>Hiérarchie</SectionLabel>

    <Stack direction="row" spacing={1.25} flexWrap="wrap">

      {/* N+1 */}
      {p.NomSousChef && (
        <HierarchyCard
          role="Sous-chef"
          nom={p.NomSousChef}
          prenom={p.PrenomSousChef}
        />
      )}

      {/* N+2 */}
      {p.NomChefService && (
        <HierarchyCard
          role={p.NomSousChef ? "Chef de service" : "Chef de service"}
          nom={p.NomChefService}
          prenom={p.PrenomChefService}
        />
      )}

      {/* N+3 */}
      {p.NomChefDepartement && (
        <HierarchyCard
          role="Chef de département"
          nom={p.NomChefDepartement}
          prenom={p.PrenomChefDepartement}
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