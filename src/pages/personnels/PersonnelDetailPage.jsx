import {useEffect, useState } from "react";
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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RefreshIcon from "@mui/icons-material/Refresh";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import BusinessIcon from "@mui/icons-material/Business";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import WorkIcon from "@mui/icons-material/Work";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonnelService from "../../services/PersonnelService.js";

dayjs.locale("fr");

// SectionLabel

function SectionLabel({ children }) {
  const theme = useTheme();

  return (
    <Typography
      sx={{
        ...theme.custom.detail.sectionLabel,

        color: theme.palette.primary.main,
      }}
    >
      {children}
    </Typography>
  );
}

SectionLabel.propTypes = {
  children: PropTypes.node.isRequired,
};

// InfoRow

function InfoRow({ icon, label, value, accent, muted, danger }) {
  const theme = useTheme();

  if (value === undefined || value === null) return null;

  const valueStyle = accent
    ? theme.custom.detail.infoValueAccent
    : danger
      ? theme.custom.detail.infoValueDanger
      : muted
        ? theme.custom.detail.infoValueMuted
        : theme.custom.detail.infoValue;
  return (
    <Stack direction="row" alignItems="center" sx={theme.custom.detail.infoRow}>
      <Box sx={theme.custom.detail.infoIconBox}>{icon}</Box>

      <Typography sx={theme.custom.detail.infoLabel}>{label}</Typography>

      <Typography sx={valueStyle}>{value}</Typography>
    </Stack>
  );
}

InfoRow.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  accent: PropTypes.bool,
  muted: PropTypes.bool,
  danger: PropTypes.bool,
//  last: PropTypes.bool,
};

InfoRow.defaultProps = {
  value: undefined,
  accent: false,
  muted: false,
  danger: false,
  last: false,
};

// HierarchyCard

function HierarchyCard({ role, nom, prenom }) {
  const theme = useTheme();

  const fullName = [nom, prenom].filter(Boolean).join(" ");
  if (!fullName.trim()) return null;

  const initials = [nom, prenom]
    .filter(Boolean)
    .map((s) => s.charAt(0).toUpperCase())
    .join("");

  return (
    <Stack
      direction="row"
      alignItems="center"
      sx={theme.custom.detail.hierarchyCard}
    >
      <Box sx={theme.custom.detail.hierarchyAvatar}>{initials}</Box>
      <Box minWidth={0} flex={1}>
        <Typography sx={theme.custom.detail.hierarchyRole}>{role}</Typography>
        <Typography sx={theme.custom.detail.hierarchyName}>
          {fullName}
        </Typography>
      </Box>
    </Stack>
  );
}

HierarchyCard.propTypes = {
  role: PropTypes.string.isRequired,
  nom: PropTypes.string,
  prenom: PropTypes.string,
};

HierarchyCard.defaultProps = {
  nom: "",
  prenom: "",
};

// Page principale
export default function PersonnelDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
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

      const person = personRes.data || {};
      const grades = Array.isArray(gradesRes.data) ? gradesRes.data : [];
      const fonctions = Array.isArray(fonctionsRes.data)
        ? fonctionsRes.data
        : [];

      const { sousServiceService } =
        await import("../../services/AffectationsService.js");
      const sousServRes = await sousServiceService.getAll();
      const sousServData = Array.isArray(sousServRes?.data)
        ? sousServRes.data
        : [];

      const sousServTrouve = sousServData.find(
        (ss) => ss.nomSousServiceFr === person.NomSousServiceFr,
      );

      const gradeId =
        person.WWGradeID ??
        person.IDWWGrade ??
        person.GradeID ??
        person.WWGrade ??
        person.IdWWGrade ??
        person.IdGrade ??
        null;

      const fonctionId =
        person.FonctionID ?? person.IDFonction ?? person.IdFonction ?? null;

      const gradeTrouve =
        grades.find((g) => Number(g.IDWWGrade) === Number(gradeId)) ||
        grades.find((g) => Number(g.WWGradeID) === Number(gradeId)) ||
        grades.find((g) => Number(g.IdWWGrade) === Number(gradeId)) ||
        null;

      const fonctionTrouvee =
        fonctions.find((f) => Number(f.IDFonction) === Number(fonctionId)) ||
        fonctions.find((f) => Number(f.IdFonction) === Number(fonctionId)) ||
        null;

      const nomGrade =
        person.NomWWGradeFr ??
        person.NomGradeFr ??
        person.LibelleGradeFr ??
        gradeTrouve?.NomWWGradeFr ??
        gradeTrouve?.NomGradeFr ??
        null;

      const nomFonction =
        person.NomFonctionFr ??
        person.LibelleFonctionFr ??
        fonctionTrouvee?.NomFonctionFr ??
        fonctionTrouvee?.LibelleFonctionFr ??
        null;

      setPersonData({
        ...person,

        NomWWGradeFr: nomGrade,
        NomFonctionFr: nomFonction,
        NomSousChef: person.NomSousChef || sousServTrouve?.nomSousChef || null,
        PrenomSousChef:
          person.PrenomSousChef || sousServTrouve?.prenomSousChef || null,
      });
    } catch (e) {
      setError(e?.message || "Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id,]);

  const p = personData || {};
  const isArchive = p.SiArchive === "true" || p.SiArchive === true;
  const hasSortie = !!p.DateSortie;
  const initiales =
    p.NomPersonne && p.PrenomPersonne
      ? `${p.NomPersonne.charAt(0)}${p.PrenomPersonne.charAt(0)}`.toUpperCase()
      : "??";

  const adresse =
    [
      p.NomRueFr,
      p.Numero,
      p.Batiment ? `Bât. ${p.Batiment}` : null,
      p.Etage != null ? `Ét. ${p.Etage}` : null,
    ]

      .filter(Boolean)
      .join(" — ") || null;

  const dateEntree = p.DateEntree
    ? dayjs(p.DateEntree).format("D MMMM YYYY")
    : null;

  const dateSortie = hasSortie
    ? dayjs(p.DateSortie).format("D MMMM YYYY")
    : null;
  const hasHierarchie =
    p.NomSousChef || p.NomChefService || p.NomChefDepartement;

  return (
    <Box sx={theme.custom.detail.pageWrapper}>
      <Box sx={theme.custom.detail.contentWrapper}>
        {/* Navigation */}

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={theme.custom.detail.navigation}
        >
          <Button
            startIcon={<ArrowBackIcon sx={theme.custom.detail.backIcon} />}
            onClick={() => navigate(-1)}
            size="small"
            sx={theme.custom.detail.backBtn}
          >
            Retour
          </Button>

          <Tooltip title="Actualiser">
            <IconButton
              size="small"
              onClick={loadData}
              sx={theme.custom.detail.refreshBtn}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Stack>

        {/* Chargement */}

        {loading && (
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={theme.custom.detail.loadingWrapper}
            spacing={2}
          >
            <CircularProgress
              size={28}
              sx={theme.custom.detail.loadingProgress}
            />

            <Typography variant="body2" color="text.secondary">
              Chargement du profil...
            </Typography>
          </Stack>
        )}

        {/* Erreur */}

        {error && (
          <Alert severity="error" sx={theme.custom.detail.errorAlert}>
            {error}
          </Alert>
        )}

        {!loading && !error && !personData && (
          <Alert severity="warning">
            Aucune donnée trouvée pour cet utilisateur.
          </Alert>
        )}

        {/* Profil */}

        {!loading && !error && personData && (
          <Box sx={theme.custom.detail.card}>
            {/* Hero */}
            <Box sx={theme.custom.detail.heroBanner}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Box sx={theme.custom.detail.avatarHero}>{initiales}</Box>

                <Box flex={1} minWidth={0}>
                  <Typography sx={theme.custom.detail.heroNameBanner}>
                    {p.PrenomPersonne} {(p.NomPersonne || "").toUpperCase()}
                  </Typography>

                  <Typography sx={theme.custom.detail.heroEmailBanner}>
                    {p.Email || "Aucune adresse e-mail"}
                  </Typography>

                  <Stack direction="row" spacing={1} mt={1.2} flexWrap="wrap">
                    {p.NomFonctionFr && (
                      <Chip
                        label={p.NomFonctionFr}
                        size="small"
                        sx={theme.custom.detail.chipFonctionHero}
                      />
                    )}

                    {isArchive && (
                      <Chip
                        label="Archivé"
                        size="small"
                        sx={theme.custom.detail.chipArchiveHero}
                      />
                    )}
                  </Stack>
                </Box>

                <Box sx={theme.custom.detail.heroIdBox}>
                  <Typography sx={theme.custom.detail.heroIdLabel}>
                    ID
                  </Typography>

                  <Typography sx={theme.custom.detail.heroIdValue}>
                    {id}
                  </Typography>
                </Box>
              </Stack>
            </Box>

            {/* Contact */}

            <Box sx={theme.custom.detail.sectionCompact}>
              <SectionLabel>Contact</SectionLabel>

              <InfoRow
                icon={<EmailIcon />}
                label="E-mail"
                value={p.Email || "—"}
                accent
              />

              <InfoRow
                icon={<PhoneIcon />}
                label="Téléphone"
                value={p.TelPro || "—"}
                last
              />
            </Box>

            {/* Affectation */}

            <Box sx={theme.custom.detail.sectionCompact}>
              <SectionLabel>Affectation</SectionLabel>

              <InfoRow
                icon={<BusinessIcon />}
                label="Service"
                value={p.NomServiceFr || "—"}
              />

              <InfoRow
                icon={<AccountTreeIcon />}
                label="Département"
                value={p.NomDepartementFr || "—"}
              />

              <InfoRow
                icon={<EmojiEventsIcon />}
                label="Grade"
                value={p.NomWWGradeFr || "—"}
              />

              <InfoRow
                icon={<WorkIcon />}
                label="Fonction"
                value={p.NomFonctionFr || "—"}
              />

              <InfoRow
                icon={<CalendarMonthIcon />}
                label="Date d'entrée"
                value={dateEntree || "—"}
              />

              <InfoRow
                icon={<EventBusyIcon />}
                label="Date de sortie"
                value={dateSortie || "Non spécifiée"}
                danger={hasSortie}
                muted={!hasSortie}
              />

              <InfoRow
                icon={<LocationOnIcon />}
                label="Adresse"
                value={adresse || "—"}
                last
              />
            </Box>

            {/* Hiérarchie */}

            {hasHierarchie && (
              <Box sx={theme.custom.detail.hierarchySection}>
                <SectionLabel>Hiérarchie</SectionLabel>

                <Box sx={theme.custom.detail.hierarchyWrapper}>
                  {p.NomSousChef && (
                    <HierarchyCard
                      role="Sous-chef"
                      nom={p.NomSousChef}
                      prenom={p.PrenomSousChef}
                    />
                  )}

                  {p.NomChefService && (
                    <HierarchyCard
                      role="Chef de service"
                      nom={p.NomChefService}
                      prenom={p.PrenomChefService}
                    />
                  )}

                  {p.NomChefDepartement && (
                    <HierarchyCard
                      role="Chef de département"
                      nom={p.NomChefDepartement}
                      prenom={p.PrenomChefDepartement}
                    />
                  )}
                </Box>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}
