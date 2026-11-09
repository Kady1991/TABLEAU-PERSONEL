import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  Chip,
  CircularProgress,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ArchiveIcon from "@mui/icons-material/Archive";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import PersonRemoveAlt1Icon from "@mui/icons-material/PersonRemoveAlt1";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import BoltIcon from "@mui/icons-material/Bolt";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useTheme } from "@mui/material/styles";
import PropTypes from "prop-types";
import PersonnelService from "../../services/PersonnelService";
import {
  FadeSlideIn,
  AnimatedNumber,
  StaggerChildren,
} from "../../components/Animations/AnimatedHomePage";
import { Sparkline } from "../../components/Animations/HomeCharts";
import { rowAnimation } from "../../components/Animations/HomeAnimations";

import AjoutFormComponent from "../../components/Forms/Ajout/AjoutFormComponent";

// ── Helpers ───────────────────────────────────────────────────────────────────
const isArchived = (v) =>
  v === true || v === 1 || String(v).toLowerCase() === "true";

const clean = (s) => (s ? String(s).trim() : "");

const toDate = (v) => {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
};

const fmtDate = (d) => (d ? d.toLocaleDateString("fr-BE") : "-");

const monthEnd = (offset) => {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() - offset + 1, 0, 23, 59, 59);
};

const sameMonth = (d, ref) =>
  d && d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth();

const delta = (cur, prev) => {
  if (prev === 0) return cur > 0 ? 100 : 0;
  return Math.round(((cur - prev) / prev) * 1000) / 10;
};

const initials = (p) =>
  `${(p.NomPersonne ?? "").charAt(0)}${(p.PrenomPersonne ?? "").charAt(0)}`.toUpperCase();

// ── KPI Card ──────────────────────────────────────────────────────────────────
function KpiCard({ label, value, trend, trendLabel, color, icon, series, onClick, loading }) {
  const { iconCircle } = useTheme().custom;
  const up = trend >= 0;
  const TrendIcon = up ? TrendingUpIcon : TrendingDownIcon;
  return (
    <Card sx={{ height: "100%" }}>
      <CardActionArea onClick={onClick} sx={{ height: "100%", p: 2 }}>
        <Stack direction="row" spacing={1.5} alignItems="flex-start">
          <Box sx={iconCircle(48, color)}>{icon}</Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle1">{label}</Typography>
            <Stack direction="row" alignItems="flex-end" justifyContent="space-between">
              <Typography variant="h2">
                {loading ? (
                  "…"
                ) : (
                  <AnimatedNumber
                    value={value}
                    delay={300}
                    format={(n) => n.toLocaleString("fr-BE")}
                  />
                )}
              </Typography>
              <Sparkline data={series} color={color} />
            </Stack>
          </Box>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={0.8} sx={{ mt: 1.5 }}>
          <TrendIcon fontSize="small" sx={{ color }} />
          <Typography variant="body1" sx={{ fontWeight: 700, color }}>
            {up ? "+" : ""}
            {trend.toLocaleString("fr-BE")}%
          </Typography>
          <Typography variant="body2">{trendLabel}</Typography>
        </Stack>
      </CardActionArea>
    </Card>
  );
}
KpiCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  trend: PropTypes.number.isRequired,
  trendLabel: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  icon: PropTypes.node,
  series: PropTypes.arrayOf(PropTypes.number),
  onClick: PropTypes.func,
  loading: PropTypes.bool,
};

// ── Petits composants ─────────────────────────────────────────────────────────
function SectionTitle({ icon, title, right }) {
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Avatar sx={{ width: 36, height: 36 }}>{icon}</Avatar>
        <Typography variant="h4">{title}</Typography>
      </Stack>
      {right}
    </Stack>
  );
}
SectionTitle.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string.isRequired,
  right: PropTypes.node,
};

function SeeAll({ to }) {
  const navigate = useNavigate();
  return (
    <Typography variant="subtitle1" onClick={() => navigate(to)} sx={{ cursor: "pointer" }}>
      Voir tout →
    </Typography>
  );
}
SeeAll.propTypes = { to: PropTypes.string.isRequired };

function TypeChip({ type }) {
  return (
    <Chip
      label={type === "entree" ? "Entrée" : "Départ"}
      color={type === "entree" ? "secondary" : "warning"}
    />
  );
}
TypeChip.propTypes = { type: PropTypes.oneOf(["entree", "depart"]).isRequired };

function Loader() {
  return (
    <Stack alignItems="center" sx={{ py: 4 }}>
      <CircularProgress size={24} />
    </Stack>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const navigate = useNavigate();
  const { chart: c, home } = useTheme().custom;

  const [personnes, setPersonnes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [openAdd, setOpenAdd] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await PersonnelService.getAll();
      setPersonnes(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setError(e?.message || "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const actifs = useMemo(
    () => personnes.filter((p) => !isArchived(p?.SiArchive)),
    [personnes],
  );
  const archives = useMemo(
    () => personnes.filter((p) => isArchived(p?.SiArchive)),
    [personnes],
  );

  // ── Série des 6 derniers mois : actifs / archivés à la fin de chaque mois
  const serie = useMemo(() => {
    const out = [];
    for (let i = 5; i >= 0; i--) {
      const end = monthEnd(i);
      let a = 0;
      let b = 0;
      personnes.forEach((p) => {
        const entree = toDate(p?.DateEntree);
        if (entree && entree > end) return;
        const sortie = toDate(p?.DateSortie);
        const archive = isArchived(p?.SiArchive) && (!sortie || sortie <= end);
        if (archive) b += 1;
        else a += 1;
      });
      out.push({ actifs: a, archives: b });
    }
    return out;
  }, [personnes]);

  // ── KPI mensuels ────────────────────────────────────────────────────────────
  const now = new Date();
  const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const entreesMois = personnes.filter((p) => sameMonth(toDate(p?.DateEntree), now)).length;
  const entreesPrev = personnes.filter((p) => sameMonth(toDate(p?.DateEntree), prevMonth)).length;
  const departsMois = personnes.filter(
    (p) => isArchived(p?.SiArchive) && sameMonth(toDate(p?.DateSortie), now),
  ).length;
  const departsPrev = personnes.filter(
    (p) => isArchived(p?.SiArchive) && sameMonth(toDate(p?.DateSortie), prevMonth),
  ).length;

  const last = serie[serie.length - 1] || { actifs: 0, archives: 0 };
  const prev = serie[serie.length - 2] || { actifs: 0, archives: 0 };

  // Mini séries pour les sparklines des entrées / départs
  const monthlyCounts = (fn) =>
    Array.from({ length: 6 }, (_, k) => {
      const ref = new Date(now.getFullYear(), now.getMonth() - (5 - k), 1);
      return personnes.filter((p) => fn(p, ref)).length;
    });
  const entreesSerie = monthlyCounts((p, ref) => sameMonth(toDate(p?.DateEntree), ref));
  const departsSerie = monthlyCounts(
    (p, ref) => isArchived(p?.SiArchive) && sameMonth(toDate(p?.DateSortie), ref),
  );

  // ── Tableaux ────────────────────────────────────────────────────────────────
  const dernieresEntrees = useMemo(
    () =>
      personnes
        .filter((p) => toDate(p?.DateEntree))
        .sort((a, b) => toDate(b.DateEntree) - toDate(a.DateEntree))
        .slice(0, 5),
    [personnes],
  );

  const mouvements = useMemo(() => {
    const events = [];
    personnes.forEach((p) => {
      const e = toDate(p?.DateEntree);
      const s = toDate(p?.DateSortie);
      if (e) events.push({ p, date: e, type: "entree" });
      if (s && isArchived(p?.SiArchive)) events.push({ p, date: s, type: "depart" });
    });
    return events.sort((a, b) => b.date - a.date).slice(0, 5);
  }, [personnes]);

  const onSearch = (e) => {
    e.preventDefault();
    const q = search.trim();
    navigate(q ? `/personnels?search=${encodeURIComponent(q)}` : "/personnels");
  };

  const quick = [
    {
      label: "Liste du personnel",
      sub: "Consulter et gérer les membres",
      path: "/personnels",
      color: c.actif,
      icon: <PeopleAltIcon />,
    },
    {
      label: "Ajouter un membre",
      sub: "Encoder un nouveau membre",
      onClick: () => setOpenAdd(true),
      color: c.entree,
      icon: <AddIcon />,
    },
    {
      label: "Archives",
      sub: "Voir les membres archivés",
      path: "/personnels/archives",
      color: c.archive,
      icon: <ArchiveIcon />,
    },
    {
      label: "Statistiques",
      sub: "Tableaux et graphiques",
      path: "/personnels/statistics",
      color: c.actif,
      icon: <AssessmentIcon />,
    },
  ];

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* ── En-tête ── */}
      <FadeSlideIn delay={0}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Box>
            <Typography variant="h1" sx={{ mb: 0.5 }}>
              Tableau de bord
            </Typography>
            <Typography variant="body2">
              Gestion du personnel • Administration communale d&apos;Uccle
            </Typography>
          </Box>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <form onSubmit={onSearch}>
              <TextField
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un membre du personnel..."
                sx={{ width: { xs: 220, md: 340 }, bgcolor: "background.paper" }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </form>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenAdd(true)}
              sx={{ whiteSpace: "nowrap" }}
            >
              Nouveau membre
            </Button>
            <IconButton
              sx={{ bgcolor: "background.paper", border: "1px solid", borderColor: "divider" }}
            >
              <NotificationsNoneIcon />
            </IconButton>
          </Stack>
        </Stack>
      </FadeSlideIn>

      {/* ── KPIs ── */}
      <StaggerChildren baseDelay={0} step={100} sx={{ mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} lg={3}>
            <KpiCard
              label="Personnel actif"
              value={actifs.length}
              trend={delta(last.actifs, prev.actifs)}
              trendLabel="depuis le mois dernier"
              color={c.actif}
              icon={<PeopleAltIcon />}
              series={serie.map((s) => s.actifs)}
              onClick={() => navigate("/personnels")}
              loading={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <KpiCard
              label="Personnels archivés"
              value={archives.length}
              trend={delta(last.archives, prev.archives)}
              trendLabel="depuis le mois dernier"
              color={c.archive}
              icon={<ArchiveIcon />}
              series={serie.map((s) => s.archives)}
              onClick={() => navigate("/personnels/archives")}
              loading={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <KpiCard
              label="Entrées ce mois"
              value={entreesMois}
              trend={delta(entreesMois, entreesPrev)}
              trendLabel="vs mois dernier"
              color={c.entree}
              icon={<PersonAddAlt1Icon />}
              series={entreesSerie}
              onClick={() => navigate("/personnels")}
              loading={loading}
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <KpiCard
              label="Départs ce mois"
              value={departsMois}
              trend={delta(departsMois, departsPrev)}
              trendLabel="vs mois dernier"
              color={c.depart}
              icon={<PersonRemoveAlt1Icon />}
              series={departsSerie}
              onClick={() => navigate("/personnels/archives")}
              loading={loading}
            />
          </Grid>
        </Grid>
      </StaggerChildren>

      {/* ── Dernières entrées + Mouvements récents ── */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={6}>
          <FadeSlideIn delay={550}>
            <Card sx={{ p: 2, height: "100%" }}>
              <SectionTitle
                icon={<PersonAddAlt1Icon fontSize="small" />}
                title="Dernières entrées"
                right={<SeeAll to="/personnels" />}
              />
              {loading ? (
                <Loader />
              ) : (
                <Box sx={{ overflowX: "auto" }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Nom</TableCell>
                        <TableCell>Prénom</TableCell>
                        <TableCell>Service</TableCell>
                        <TableCell>Date d&apos;entrée</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dernieresEntrees.map((p, i) => (
                        <TableRow
                          key={p.IDPersonneService}
                          hover
                          sx={[{ cursor: "pointer" }, rowAnimation(0.7 + i * 0.08)]}
                          onClick={() => navigate(`/personnels/${p.IDPersonneService}`)}
                        >
                          <TableCell sx={{ fontWeight: 700 }}>
                            <Stack direction="row" spacing={1.2} alignItems="center">
                              <Avatar
                                sx={{
                                  width: 30,
                                  height: 30,
                                  fontSize: 11,
                                  fontWeight: 700,
                                  bgcolor: "secondary.light",
                                  color: "secondary.dark",
                                }}
                              >
                                {initials(p)}
                              </Avatar>
                              <span>{p.NomPersonne ?? "-"}</span>
                            </Stack>
                          </TableCell>
                          <TableCell>{p.PrenomPersonne ?? "-"}</TableCell>
                          <TableCell sx={{ color: "text.secondary" }}>
                            {clean(p?.NomServiceFr) || "-"}
                          </TableCell>
                          <TableCell sx={{ color: "text.secondary" }}>
                            {fmtDate(toDate(p.DateEntree))}
                          </TableCell>
                        </TableRow>
                      ))}
                      {dernieresEntrees.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4}>Aucune entrée.</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </Box>
              )}
            </Card>
          </FadeSlideIn>
        </Grid>

        <Grid item xs={12} md={6}>
          <FadeSlideIn delay={650}>
            <Card sx={{ p: 2, height: "100%" }}>
              <SectionTitle
                icon={<AccessTimeIcon fontSize="small" />}
                title="Mouvements récents"
                right={<SeeAll to="/personnels/archives" />}
              />
              {loading ? (
                <Loader />
              ) : (
                <Box sx={{ overflowX: "auto" }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Nom</TableCell>
                        <TableCell>Service</TableCell>
                        <TableCell>Type</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {mouvements.map((m, i) => (
                        <TableRow
                          key={`${m.p.IDPersonneService}-${m.type}-${i}`}
                          hover
                          sx={[{ cursor: "pointer" }, rowAnimation(0.8 + i * 0.08)]}
                          onClick={() => navigate(`/personnels/${m.p.IDPersonneService}`)}
                        >
                          <TableCell sx={{ color: "text.secondary" }}>
                            {fmtDate(m.date)}
                          </TableCell>
                          <TableCell>
                            <Box component="span" sx={{ fontWeight: 700 }}>
                              {m.p.NomPersonne ?? ""}
                            </Box>{" "}
                            {m.p.PrenomPersonne ?? ""}
                          </TableCell>
                          <TableCell sx={{ color: "text.secondary" }}>
                            {clean(m.p?.NomServiceFr) || "-"}
                          </TableCell>
                          <TableCell>
                            <TypeChip type={m.type} />
                          </TableCell>
                        </TableRow>
                      ))}
                      {mouvements.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4}>Aucun mouvement.</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </Box>
              )}
            </Card>
          </FadeSlideIn>
        </Grid>
      </Grid>

      {/* ── Accès rapides ── */}
      <FadeSlideIn delay={750}>
        <Card sx={{ p: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
            <BoltIcon color="primary" />
            <Typography variant="h4">Accès rapides</Typography>
          </Stack>
          <Grid container spacing={2}>
            {quick.map((item) => (
              <Grid item xs={12} sm={6} lg={3} key={item.label}>
                <Box
                  onClick={item.onClick ?? (() => navigate(item.path))}
                  sx={home.quickTile(item.color)}
                >
                  <Box sx={(t) => t.custom.iconCircle(44, item.color)}>{item.icon}</Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="subtitle1" noWrap>
                      {item.label}
                    </Typography>
                    <Typography variant="body2" noWrap>
                      {item.sub}
                    </Typography>
                  </Box>
                  <ChevronRightIcon sx={{ color: "text.secondary" }} />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Card>
      </FadeSlideIn>

      {/* ── Formulaire d'ajout d'un membre (recharge les données après un ajout) ── */}
      <AjoutFormComponent
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onMemberUpdate={fetchData}
        refreshData={fetchData}
      />
    </Box>
  );
}