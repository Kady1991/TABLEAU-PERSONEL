import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ArchiveIcon from "@mui/icons-material/Archive";
import AssessmentIcon from "@mui/icons-material/Assessment";
import { useTheme } from "@mui/material/styles";
import PersonnelService from "../../services/PersonnelService";
// import {
//   FadeSlideIn,
//   AnimatedNumber,
//   AnimatedBar,
//   StaggerChildren,
// } from "../../components/Animations/AnimatedHomePage";

import {
  FadeSlideIn,
  AnimatedNumber,
  StaggerChildren,
} from "../../components/Animations/AnimatedHomePage";
import PropTypes from "prop-types";

KpiCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  sub: PropTypes.string,
  color: PropTypes.string,
  icon: PropTypes.node,
  onClick: PropTypes.func,
  loading: PropTypes.bool,
};
const isArchived = (v) =>
  v === true || v === 1 || String(v).toLowerCase() === "true";

const clean = (s) => (s ? String(s).trim() : "");

// ── KPI Card cliquable ────────────────────────────────────────────────────────
function KpiCard({ label, value, sub, color, icon, onClick, loading }) {
  return (
    <Card variant="outlined" sx={{ borderRadius: 1, height: "100%" }}>
      <CardActionArea onClick={onClick} sx={{ height: "100%" }}>
        <CardContent sx={{ p: 2 }}>
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: 2,
              background: `${color}18`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 1.5,
              color,
            }}
          >
            {icon}
          </Box>

          <Typography variant="body1" sx={{ mb: 0.5, fontWeight: 600 }}>
            {label}
          </Typography>

          <Typography variant="h2" sx={{ color, fontWeight: 700 }}>
            {loading ? (
              "…"
            ) : (
              <AnimatedNumber
                value={value}
                delay={300}
                format={
                  typeof value === "string" && value.includes("%")
                    ? undefined
                    : (n) => n.toLocaleString("fr-BE")
                }
              />
            )}
          </Typography>

          <Stack
            direction="row"
            alignItems="center"
            spacing={0.8}
            mt={1.2}
            pt={1.2}
            sx={{ borderTop: "1px solid rgba(0,0,0,0.07)" }}
          >
            <Box
              sx={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: color,
                flexShrink: 0,
              }}
            />
            <Typography variant="body1">{sub}</Typography>
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const navigate = useNavigate();
  const theme = useTheme();

  const PRIMARY = theme.palette.primary.main;
  const TEAL = theme.palette.secondary.main;
  const RED = "#c0392b";

  const [personnes, setPersonnes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await PersonnelService.getAll();
        setPersonnes(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        setError(e?.message || "Erreur de chargement");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const actifs = useMemo(
    () => personnes.filter((p) => !isArchived(p?.SiArchive)),
    [personnes],
  );
  const archives = useMemo(
    () => personnes.filter((p) => isArchived(p?.SiArchive)),
    [personnes],
  );
  const tauxActivite =
    personnes.length > 0
      ? Math.round((actifs.length / personnes.length) * 100)
      : 0;

  // ── Top 6 actifs récents ────────────────────────────────────────────────────
  const recentActifs = useMemo(() => {
    return [...actifs]
      .sort(
        (a, b) =>
          Number(b?.IDPersonneService ?? 0) - Number(a?.IDPersonneService ?? 0),
      )
      .slice(0, 7);
  }, [actifs]);

  // ── Derniers mouvements ─────────────────────────────────────────────────────
  const derniersMouvements = useMemo(() => {
    return [...personnes]
      .filter((p) => p?.DateEntree || p?.DateSortie)
      .sort((a, b) => {
        const da = new Date(b.DateSortie || b.DateEntree || 0);
        const db = new Date(a.DateSortie || a.DateEntree || 0);
        return da - db;
      })
      .slice(0, 5)
      .map((p) => ({
        id: p.IDPersonneService,
        nom: `${p.NomPersonne ?? ""} ${p.PrenomPersonne ?? ""}`.trim(),
        initiales: `${(p.NomPersonne ?? "").charAt(0)}${(
          p.PrenomPersonne ?? ""
        ).charAt(0)}`.toUpperCase(),
        service: clean(p?.NomServiceFr) || "-",
        date: p.DateSortie
          ? new Date(p.DateSortie).toLocaleDateString("fr-BE")
          : p.DateEntree
            ? new Date(p.DateEntree).toLocaleDateString("fr-BE")
            : "-",
        type: isArchived(p?.SiArchive) ? "depart" : "entree",
      }));
  }, [personnes]);

  const sectionCard = {
    background: theme.palette.background.paper,
    border: "1px solid rgba(0,0,0,0.08)",
    borderRadius: "12px",
    overflow: "hidden",
  };

  const sectionHeader = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    px: 2,
    py: 1.2,
    borderBottom: "1px solid rgba(0,0,0,0.07)",
  };

  const headSx = {
    fontSize: 11,
    fontWeight: 700,
    color: PRIMARY,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
    py: 1,
    borderBottomColor: "rgba(0,0,0,0.08)",
  };

  const cellSx = {
    fontSize: 13,
    py: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  };

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* ── KPIs ── */}
      <StaggerChildren baseDelay={0} step={100} sx={{ mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <KpiCard
              label="Personnels actifs"
              value={actifs.length.toLocaleString("fr-BE")}
              sub="membres en poste"
              color={PRIMARY}
              icon={<PeopleAltIcon sx={{ fontSize: 20 }} />}
              onClick={() => navigate("/personnels")}
              loading={loading}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <KpiCard
              label="Personnels archivés"
              value={archives.length.toLocaleString("fr-BE")}
              sub="membres sortis"
              color={RED}
              icon={<ArchiveIcon sx={{ fontSize: 20 }} />}
              onClick={() => navigate("/personnels/archives")}
              loading={loading}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <KpiCard
              label="Taux d'activité"
              value={`${tauxActivite}%`}
              sub="actifs / total"
              color={TEAL}
              icon={<AssessmentIcon sx={{ fontSize: 20 }} />}
              onClick={() => navigate("/personnels/statistics")}
              loading={loading}
            />
          </Grid>
        </Grid>
      </StaggerChildren>

      {/* ── Liste personnel + Mouvements ── */}
      <Grid container spacing={2} mb={2}>
        {/* Liste du personnel récent */}
        <Grid item xs={12} md={6}>
          <FadeSlideIn delay={300}>
            <Box sx={{ ...sectionCard, height: "100%", minHeight: 400 }}>
              <Box sx={sectionHeader}>
                <Typography variant="h4">Liste du personnel actif</Typography>
                <Typography
                  variant="body1"
                  onClick={() => navigate("/personnels")}
                  sx={{ color: PRIMARY, cursor: "pointer", fontWeight: 700 }}
                >
                  Voir tout →
                </Typography>
              </Box>

              {loading ? (
                <Stack alignItems="center" py={4}>
                  <CircularProgress size={24} sx={{ color: PRIMARY }} />
                </Stack>
              ) : (
                <Box sx={{ overflowX: "auto" }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={headSx}>Nom</TableCell>
                        <TableCell sx={headSx}>Prénom</TableCell>
                        <TableCell sx={headSx}>Service</TableCell>
                        <TableCell sx={headSx}>Fonction</TableCell>
                        <TableCell sx={headSx}>Entrée</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentActifs.map((p) => (
                        <TableRow
                          key={p.IDPersonneService}
                          hover
                          sx={{ cursor: "pointer" }}
                          onClick={() =>
                            navigate(`/personnels/${p.IDPersonneService}`)
                          }
                        >
                          <TableCell
                            sx={{ ...cellSx, fontWeight: 600, color: PRIMARY }}
                          >
                            {p.NomPersonne ?? "-"}
                          </TableCell>
                          <TableCell sx={cellSx}>
                            {p.PrenomPersonne ?? "-"}
                          </TableCell>
                          <TableCell
                            sx={{
                              ...cellSx,
                              color: "text.secondary",
                              maxWidth: 150,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {clean(p?.NomServiceFr) || "-"}
                          </TableCell>
                          <TableCell
                            sx={{
                              ...cellSx,
                              color: "text.secondary",
                              maxWidth: 150,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {clean(p?.NomFonctionFr) || "-"}
                          </TableCell>
                          <TableCell
                            sx={{
                              ...cellSx,
                              color: "text.secondary",
                              fontSize: 12,
                            }}
                          >
                            {p.DateEntree || "-"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              )}

              <Divider />
              <Box
                sx={{
                  px: 2,
                  py: 1,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  {actifs.length.toLocaleString("fr-BE")} membres actifs au
                  total
                </Typography>
                <Typography
                  variant="body1"
                  onClick={() => navigate("/personnels")}
                  sx={{ color: PRIMARY, cursor: "pointer", fontWeight: 700 }}
                >
                  Ouvrir en plein écran →
                </Typography>
              </Box>
            </Box>
          </FadeSlideIn>
        </Grid>

        {/* Derniers mouvements */}
        <Grid item xs={12} md={6}>
          <FadeSlideIn delay={450}>
            <Box sx={{ ...sectionCard, height: "100%", minHeight: 400 }}>
              <Box sx={sectionHeader}>
                <Typography variant="h4">Derniers mouvements</Typography>
                <Typography
                  variant="body1"
                  onClick={() => navigate("/personnels/archives")}
                  sx={{ color: PRIMARY, cursor: "pointer", fontWeight: 700 }}
                >
                  Archives →
                </Typography>
              </Box>

              {loading ? (
                <Stack alignItems="center" py={4}>
                  <CircularProgress size={24} sx={{ color: PRIMARY }} />
                </Stack>
              ) : derniersMouvements.length === 0 ? (
                <Typography variant="body1" sx={{ p: 2 }}>
                  Aucun mouvement.
                </Typography>
              ) : (
                derniersMouvements.map((m) => (
                  <Stack
                    key={m.id}
                    direction="row"
                    alignItems="center"
                    spacing={1.5}
                    sx={{
                      px: 2,
                      py: 1.2,
                      borderBottom: "1px solid rgba(0,0,0,0.05)",
                      "&:last-child": { borderBottom: "none" },
                    }}
                  >
                    <Box
                      sx={{
                        width: 34,
                        height: 34,
                        borderRadius: "50%",
                        background: m.type === "entree" ? "#e0f7f7" : "#fdecea",
                        color: m.type === "entree" ? "#007a78" : RED,
                        fontSize: 11,
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {m.initiales}
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="body1"
                        sx={{ fontWeight: 600, color: PRIMARY }}
                        noWrap
                      >
                        {m.nom}
                      </Typography>
                      <Typography variant="body1" noWrap>
                        {m.service} · {m.date}
                      </Typography>
                    </Box>
                    <Chip
                      label={m.type === "entree" ? "Entrée" : "Départ"}
                      size="small"
                      sx={{
                        height: 22,
                        fontSize: 12,
                        fontWeight: 600,
                        borderRadius: "99px",
                        background: m.type === "entree" ? "#e0f7f7" : "#fdecea",
                        color: m.type === "entree" ? "#007a78" : RED,
                      }}
                    />
                  </Stack>
                ))
              )}
            </Box>
          </FadeSlideIn>
        </Grid>
      </Grid>

      {/* ── Navigation rapide ── */}
      <FadeSlideIn delay={600}>
        <Box sx={sectionCard}>
          <Box sx={sectionHeader}>
            <Typography variant="h4">Navigation rapide</Typography>
          </Box>
          <Grid container>
            {[
              {
                label: "Liste du personnel",
                sub: `${actifs.length.toLocaleString("fr-BE")} actifs`,
                path: "/personnels",
                color: PRIMARY,
                bg: "#e0ecf6",
                icon: <PeopleAltIcon sx={{ fontSize: 18 }} />,
              },
              {
                label: "Archives",
                sub: `${archives.length.toLocaleString("fr-BE")} archivés`,
                path: "/personnels/archives",
                color: RED,
                bg: "#fdecea",
                icon: <ArchiveIcon sx={{ fontSize: 18 }} />,
              },
              {
                label: "Statistiques",
                sub: "Vue globale",
                path: "/personnels/statistics",
                color: TEAL,
                bg: "#e0f7f7",
                icon: <AssessmentIcon sx={{ fontSize: 18 }} />,
              },
            ].map((item, i) => (
              <Grid item xs={12} sm={4} key={item.path}>
                <Box
                  onClick={() => navigate(item.path)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    px: 2,
                    py: 1.5,
                    cursor: "pointer",
                    borderRight: {
                      sm: i < 2 ? "1px solid rgba(0,0,0,0.07)" : "none",
                    },
                    "&:hover": {
                      background: theme.palette.background.default,
                    },
                    transition: "background 0.15s",
                  }}
                >
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: 2,
                      background: item.bg,
                      color: item.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Box>
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: 600, color: PRIMARY }}
                    >
                      {item.label}
                    </Typography>
                    <Typography variant="body1">{item.sub}</Typography>
                  </Box>
                  <Typography
                    sx={{
                      ml: "auto",
                      fontSize: 20,
                      color: "text.secondary",
                      lineHeight: 1,
                    }}
                  >
                    ›
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </FadeSlideIn>
    </Box>
  );
}
