import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  Chip,
  Divider,
  Grid,
  MenuItem,
  Popover,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { alpha, useTheme } from "@mui/material/styles";
import { LocalizationProvider, DesktopDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import PropTypes from "prop-types";
import PersonnelService from "../../services/PersonnelService";
import PersonnelLoader from "../../components/Loading/PersonnelLoaderComponent.jsx";
import { AnimatedNumber } from "../../components/Animations/AnimatedHomePage";

dayjs.extend(isBetween);

// ── Utilitaires ───────────────────────────────────────────────────────────────
const clean = (s) => (s ? String(s).trim() : "");
const isArchived = (v) =>
  v === true || v === 1 || String(v).toLowerCase() === "true";
const archivedOf = (p) => isArchived(p?.SiArchive ?? p?.Archive ?? p?.Archived);
const toDay = (v) => {
  const d = v ? dayjs(v) : null;
  return d?.isValid() ? d : null;
};
const fmtInt = (n) => Number(n).toLocaleString("fr-BE");
const fmtPct = (n) => `${n.toFixed(1).replace(".", ",")} %`;
const sortFr = (list) => [...list].sort((a, b) => a.localeCompare(b, "fr"));

const downloadCsv = (filename, header, rows) => {
  const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const csv =
    "\uFEFF" + [header, ...rows].map((r) => r.map(esc).join(";")).join("\r\n");
  const url = URL.createObjectURL(
    new Blob([csv], { type: "text/csv;charset=utf-8;" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

// ── Carte chiffre clé ─────────────────────────────────────────────────────────
function KpiCard({ label, value, count, sub, color, icon }) {
  const { iconCircle } = useTheme().custom;
  return (
    <Card sx={{ p: 2, height: "100%" }}>
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Box sx={iconCircle(44, color)}>{icon}</Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="subtitle2">{label}</Typography>
          <Typography variant="h2">
            {count !== undefined ? (
              <AnimatedNumber value={count} delay={200} format={fmtInt} />
            ) : (
              value
            )}
          </Typography>
          <Typography variant="caption">{sub}</Typography>
        </Box>
      </Stack>
    </Card>
  );
}
KpiCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  count: PropTypes.number,
  sub: PropTypes.string,
  color: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
};

// ── Page ──────────────────────────────────────────────────────────────────────
export default function PersonnelStatisticsPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { entree: colorIn, archive: colorOut, actif: colorPresent } =
    theme.custom.chart;

  const [personnes, setPersonnes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);

  const [dept, setDept] = useState("");
  const [service, setService] = useState("");
  const [periodMode, setPeriodMode] = useState("global");
  const [shortcut, setShortcut] = useState(null);
  const [startDate, setStartDate] = useState(dayjs().startOf("year"));
  const [endDate, setEndDate] = useState(dayjs().endOf("day"));
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await PersonnelService.getAll();
        setPersonnes(Array.isArray(res?.data) ? res.data : []);
        setLastUpdate(dayjs());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ── Filtres ─────────────────────────────────────────────────────────────────
  const departments = useMemo(
    () =>
      sortFr(
        new Set(personnes.map((p) => clean(p?.NomDepartementFr)).filter(Boolean)),
      ),
    [personnes],
  );

  const services = useMemo(
    () =>
      sortFr(
        new Set(
          personnes
            .filter((p) => !dept || clean(p?.NomDepartementFr) === dept)
            .map((p) => clean(p?.NomServiceFr))
            .filter(Boolean),
        ),
      ),
    [personnes, dept],
  );

  const inRange = useCallback(
    (d) =>
      periodMode === "global" ||
      d.isBetween(startDate.startOf("day"), endDate.endOf("day"), "day", "[]"),
    [periodMode, startDate, endDate],
  );

  // Département + service
  const scoped = useMemo(
    () =>
      personnes.filter(
        (p) =>
          (!dept || clean(p?.NomDepartementFr) === dept) &&
          (!service || clean(p?.NomServiceFr) === service),
      ),
    [personnes, dept, service],
  );

  // + période : membres présents à un moment de la période
  const filtered = useMemo(() => {
    if (periodMode === "global") return scoped;
    return scoped.filter((p) => {
      const e = toDay(p?.DateEntree);
      const s = toDay(p?.DateSortie);
      return (
        e &&
        !e.isAfter(endDate.endOf("day")) &&
        (!s || !s.isBefore(startDate.startOf("day")))
      );
    });
  }, [scoped, periodMode, startDate, endDate]);

  // Un départ = un membre archivé (et sorti dans la période, s'il y en a une)
  const isDepart = useCallback(
    (p) => {
      if (!archivedOf(p)) return false;
      const s = toDay(p?.DateSortie);
      return !s || inRange(s);
    },
    [inRange],
  );

  // ── Chiffres clés ───────────────────────────────────────────────────────────
  const { totalPresent, totalDepart } = useMemo(() => {
    let present = 0;
    let depart = 0;
    filtered.forEach((p) => (isDepart(p) ? depart++ : present++));
    return { totalPresent: present, totalDepart: depart };
  }, [filtered, isDepart]);

  const totalEntrees = useMemo(
    () =>
      scoped.filter((p) => {
        const e = toDay(p?.DateEntree);
        return e && inRange(e);
      }).length,
    [scoped, inRange],
  );

  const tauxRotation = useMemo(() => {
    const total = totalPresent + totalDepart;
    return total ? (totalDepart / total) * 100 : 0;
  }, [totalPresent, totalDepart]);

  // ── Évolution mensuelle ─────────────────────────────────────────────────────
  const monthly = useMemo(() => {
    const now = dayjs();
    const from = (periodMode === "global" ? now.subtract(11, "month") : startDate).startOf("month");
    const to = (periodMode === "global" ? now : endDate).startOf("month");
    const first = to.diff(from, "month") > 35 ? to.subtract(35, "month") : from;

    const rows = [];
    const byKey = {};
    for (let m = first; !m.isAfter(to); m = m.add(1, "month")) {
      const row = {
        mois: m
          .toDate()
          .toLocaleDateString("fr-BE", { month: "short", year: "2-digit" })
          .replace(".", ""),
        Entrées: 0,
        Départs: 0,
      };
      byKey[m.format("YYYY-MM")] = row;
      rows.push(row);
    }
    scoped.forEach((p) => {
      const e = toDay(p?.DateEntree);
      const s = toDay(p?.DateSortie);
      if (e && byKey[e.format("YYYY-MM")]) byKey[e.format("YYYY-MM")].Entrées++;
      if (s && archivedOf(p) && byKey[s.format("YYYY-MM")])
        byKey[s.format("YYYY-MM")].Départs++;
    });
    return rows;
  }, [scoped, periodMode, startDate, endDate]);

  const monthlySummary = useMemo(() => {
    const e = monthly.reduce((sum, m) => sum + m.Entrées, 0);
    const d = monthly.reduce((sum, m) => sum + m.Départs, 0);
    return { e, d, net: e - d };
  }, [monthly]);

  // ── Camembert : répartition des présents (département, puis service, puis fonction)
  const donut = useMemo(() => {
    const field = !dept ? "NomDepartementFr" : !service ? "NomServiceFr" : "NomFonctionFr";
    const counts = {};
    let total = 0;
    filtered.forEach((p) => {
      if (isDepart(p)) return;
      const key = clean(p?.[field]) || "Non renseigné";
      counts[key] = (counts[key] || 0) + 1;
      total++;
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const items = sorted.slice(0, 5).map(([name, value]) => ({ name, value }));
    const rest = sorted.slice(5);
    if (rest.length) {
      items.push({
        name: `Autres (${rest.length})`,
        value: rest.reduce((sum, [, v]) => sum + v, 0),
        other: true,
      });
    }
    return {
      total,
      items,
      by: !dept ? "département" : !service ? "service" : "fonction",
    };
  }, [filtered, isDepart, dept, service]);

  // Une seule couleur (celle des présents), de plus en plus claire ; gris pour « Autres »
  const donutShades = [1, 0.75, 0.55, 0.38, 0.24];
  const donutColor = (it, i) =>
    it.other ? theme.palette.text.disabled : alpha(colorPresent, donutShades[i]);

  // ── Derniers mouvements ─────────────────────────────────────────────────────
  const mouvements = useMemo(() => {
    const events = [];
    scoped.forEach((p) => {
      const e = toDay(p?.DateEntree);
      const s = toDay(p?.DateSortie);
      if (e && inRange(e)) events.push({ p, date: e, type: "entree" });
      if (s && archivedOf(p) && inRange(s)) events.push({ p, date: s, type: "depart" });
    });
    return events.sort((a, b) => b.date.valueOf() - a.date.valueOf());
  }, [scoped, inRange]);

  // ── Actions ─────────────────────────────────────────────────────────────────
  const applyShortcut = (mode) => {
    const now = dayjs();
    if (mode === "mois") setStartDate(now.startOf("month"));
    if (mode === "annee") setStartDate(now.startOf("year"));
    if (mode === "12mois") setStartDate(now.subtract(12, "month").startOf("day"));
    setEndDate(now.endOf("day"));
    setShortcut(mode);
    setPeriodMode("range");
  };

  const resetFilters = () => {
    setDept("");
    setService("");
    setPeriodMode("global");
    setShortcut(null);
  };

  const handleExportCsv = () =>
    downloadCsv(
      `mouvements-personnel-${dayjs().format("YYYY-MM-DD")}.csv`,
      ["Nom", "Prénom", "Service", "Département", "Date", "Mouvement"],
      mouvements.map(({ p, date, type }) => [
        p.NomPersonne,
        p.PrenomPersonne,
        clean(p?.NomServiceFr),
        clean(p?.NomDepartementFr),
        date.format("DD/MM/YYYY"),
        type === "entree" ? "Entrée" : "Départ",
      ]),
    );

  const shortcutChip = (mode, label) => (
    <Chip
      key={mode}
      label={label}
      clickable
      color={shortcut === mode && periodMode === "range" ? "primary" : "default"}
      onClick={() => applyShortcut(mode)}
    />
  );

  const hidePrint = { "@media print": { display: "none" } };
  const hasFilter = dept || service || periodMode !== "global";

  return (
    <Box>
      {/* ── Titre + exports ── */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-end"
        flexWrap="wrap"
        sx={{ gap: 2, mb: 2 }}
      >
        <Box>
          <Typography variant="h1" sx={{ mb: 0.5 }}>
            Statistiques du personnel
          </Typography>
          {lastUpdate && (
            <Typography variant="body2">
              Données mises à jour le {lastUpdate.format("DD/MM/YYYY [à] HH:mm")} ·{" "}
              {fmtInt(personnes.length)} membres au total
            </Typography>
          )}
        </Box>
        <Stack direction="row" spacing={1} sx={hidePrint}>
          <Button
            variant="outlined"
            startIcon={<FileDownloadOutlinedIcon fontSize="small" />}
            onClick={handleExportCsv}
            disabled={loading || mouvements.length === 0}
          >
            Export CSV
          </Button>
          <Button
            variant="contained"
            startIcon={<PrintOutlinedIcon fontSize="small" color="inherit" />}
            onClick={() => window.print()}
            disabled={loading}
          >
            Imprimer / PDF
          </Button>
        </Stack>
      </Stack>

      {/* ── Filtres : ils pilotent toute la page ── */}
      <Card sx={{ p: 1.5, mb: 3, ...hidePrint }}>
        <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap" useFlexGap>
          <TextField
            select
            label="Département"
            value={dept}
            onChange={(e) => {
              setDept(e.target.value);
              setService("");
            }}
            sx={{ minWidth: 240 }}
            InputLabelProps={{ shrink: true }}
            SelectProps={{ displayEmpty: true, renderValue: (v) => v || "Tous les départements" }}
          >
            <MenuItem value="">Tous les départements</MenuItem>
            {departments.map((d) => (
              <MenuItem key={d} value={d}>
                {d}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Service"
            value={service}
            onChange={(e) => setService(e.target.value)}
            sx={{ minWidth: 240 }}
            InputLabelProps={{ shrink: true }}
            SelectProps={{ displayEmpty: true, renderValue: (v) => v || "Tous les services" }}
          >
            <MenuItem value="">Tous les services</MenuItem>
            {services.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </TextField>

          <Button
            variant="outlined"
            startIcon={<EventOutlinedIcon fontSize="small" />}
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            {periodMode === "global"
              ? "Toutes les dates"
              : `Du ${startDate.format("DD/MM/YY")} au ${endDate.format("DD/MM/YY")}`}
          </Button>

          {shortcutChip("mois", "Ce mois")}
          {shortcutChip("annee", "Cette année")}
          {shortcutChip("12mois", "12 derniers mois")}

          {hasFilter && <Button onClick={resetFilters}>Réinitialiser</Button>}
        </Stack>
      </Card>

      {/* ── Période personnalisée ── */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Box sx={{ p: 2, width: 320 }}>
          <Typography variant="h4" gutterBottom>
            Filtrer par intervalle
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Stack spacing={2}>
              <DesktopDatePicker
                label="Date de début"
                value={startDate}
                onChange={(v) => {
                  if (v) {
                    setStartDate(dayjs(v).startOf("day"));
                    setPeriodMode("range");
                    setShortcut(null);
                  }
                }}
              />
              <DesktopDatePicker
                label="Date de fin"
                value={endDate}
                onChange={(v) => {
                  if (v) {
                    setEndDate(dayjs(v).endOf("day"));
                    setPeriodMode("range");
                    setShortcut(null);
                  }
                }}
              />
            </Stack>
          </LocalizationProvider>
          <Divider sx={{ my: 1.5 }} />
          <Button
            fullWidth
            onClick={() => {
              setPeriodMode("global");
              setShortcut(null);
              setAnchorEl(null);
            }}
          >
            Toutes les dates
          </Button>
          <Button fullWidth variant="contained" sx={{ mt: 1 }} onClick={() => setAnchorEl(null)}>
            Appliquer
          </Button>
        </Box>
      </Popover>

      {loading ? (
        <PersonnelLoader />
      ) : personnes.length === 0 ? (
        <Typography variant="body2" sx={{ py: 5, textAlign: "center" }}>
          Aucune donnée de personnel disponible.
        </Typography>
      ) : (
        <>
          {/* ── Chiffres clés ── */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <KpiCard
                label="Présents"
                count={totalPresent}
                sub="membres en poste"
                color={colorPresent}
                icon={<PeopleAltOutlinedIcon />}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <KpiCard
                label="Entrées"
                count={totalEntrees}
                sub={periodMode === "global" ? "depuis le début" : "sur la période"}
                color={colorIn}
                icon={<LoginOutlinedIcon />}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <KpiCard
                label="Départs"
                count={totalDepart}
                sub="archivés / sortis"
                color={colorOut}
                icon={<LogoutOutlinedIcon />}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <KpiCard
                label="Taux de rotation"
                value={fmtPct(tauxRotation)}
                sub="départs / effectif total"
                color={theme.palette.text.secondary}
                icon={<AutorenewOutlinedIcon />}
              />
            </Grid>
          </Grid>

          {/* ── Camembert + évolution mensuelle ── */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} md={5}>
              <Card sx={{ p: 2, height: "100%" }}>
                <Typography variant="h3">Répartition des présents</Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Par {donut.by}
                </Typography>
                {donut.total === 0 ? (
                  <Typography variant="body2" sx={{ py: 4, textAlign: "center" }}>
                    Aucun présent pour ces filtres.
                  </Typography>
                ) : (
                  <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap" useFlexGap>
                    <Box sx={{ position: "relative", width: 170, height: 170, flexShrink: 0 }}>
                      <PieChart width={170} height={170}>
                        <Pie
                          data={donut.items}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={52}
                          outerRadius={80}
                          paddingAngle={2}
                          stroke="none"
                        >
                          {donut.items.map((it, i) => (
                            <Cell key={it.name} fill={donutColor(it, i)} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(v, n) => [`${fmtInt(v)} présents`, n]}
                          contentStyle={{
                            fontSize: 13,
                            borderRadius: theme.shape.borderRadius,
                            border: `1px solid ${theme.palette.divider}`,
                          }}
                        />
                      </PieChart>
                      <Box
                        sx={{
                          position: "absolute",
                          inset: 0,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          pointerEvents: "none",
                        }}
                      >
                        <Typography variant="h3">{fmtInt(donut.total)}</Typography>
                        <Typography variant="caption">présents</Typography>
                      </Box>
                    </Box>
                    <Stack spacing={1} sx={{ flex: 1, minWidth: 140 }}>
                      {donut.items.map((it, i) => (
                        <Stack key={it.name} direction="row" spacing={1} alignItems="center">
                          <Box
                            sx={{
                              width: 10,
                              height: 10,
                              borderRadius: 0.5,
                              bgcolor: donutColor(it, i),
                              flexShrink: 0,
                            }}
                          />
                          <Typography variant="body2" noWrap sx={{ flex: 1, minWidth: 0 }}>
                            {it.name}
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>
                            {fmtPct((it.value / donut.total) * 100)}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </Stack>
                )}
              </Card>
            </Grid>

            <Grid item xs={12} md={7}>
          <Card sx={{ p: 2, height: "100%" }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="flex-start"
              flexWrap="wrap"
              sx={{ gap: 1, mb: 1 }}
            >
              <Box>
                <Typography variant="h3">Évolution mensuelle</Typography>
                <Typography variant="body2">
                  {fmtInt(monthlySummary.e)} entrées, {fmtInt(monthlySummary.d)} départs, solde net{" "}
                  {monthlySummary.net > 0 ? "+" : ""}
                  {fmtInt(monthlySummary.net)}
                </Typography>
              </Box>
              <Stack direction="row" spacing={2}>
                {[
                  ["Entrées", colorIn],
                  ["Départs", colorOut],
                ].map(([label, color]) => (
                  <Stack key={label} direction="row" spacing={0.5} alignItems="center">
                    <Box sx={{ width: 10, height: 10, borderRadius: 0.5, bgcolor: color }} />
                    <Typography variant="body2">{label}</Typography>
                  </Stack>
                ))}
              </Stack>
            </Stack>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthly} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} vertical={false} />
                <XAxis
                  dataKey="mois"
                  tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  cursor={{ fill: theme.palette.action.hover }}
                  contentStyle={{
                    fontSize: 13,
                    borderRadius: theme.shape.borderRadius,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                />
                <Bar dataKey="Entrées" fill={colorIn} radius={[3, 3, 0, 0]} />
                <Bar dataKey="Départs" fill={colorOut} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
            </Grid>
          </Grid>

          {/* ── Derniers mouvements ── */}
          <Card sx={{ p: 2 }}>
            <Typography variant="h3">Derniers mouvements</Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Les 10 plus récents (l&apos;export CSV contient tout)
            </Typography>
            {mouvements.length === 0 ? (
              <Typography variant="body2" sx={{ py: 4, textAlign: "center" }}>
                Aucun mouvement pour ces filtres.
              </Typography>
            ) : (
              <Box sx={{ overflowX: "auto" }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Nom</TableCell>
                      <TableCell>Service</TableCell>
                      <TableCell>Département</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Mouvement</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mouvements.slice(0, 10).map(({ p, date, type }, i) => (
                      <TableRow
                        key={`${p.IDPersonneService}-${type}-${i}`}
                        hover
                        sx={{ cursor: "pointer" }}
                        onClick={() => navigate(`/personnels/${p.IDPersonneService}`)}
                      >
                        <TableCell sx={{ fontWeight: 700 }}>
                          {`${p.NomPersonne ?? ""} ${p.PrenomPersonne ?? ""}`.trim()}
                        </TableCell>
                        <TableCell sx={{ color: "text.secondary" }}>
                          {clean(p?.NomServiceFr) || "-"}
                        </TableCell>
                        <TableCell sx={{ color: "text.secondary" }}>
                          {clean(p?.NomDepartementFr) || "-"}
                        </TableCell>
                        <TableCell sx={{ color: "text.secondary" }}>
                          {date.format("DD/MM/YYYY")}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={type === "entree" ? "Entrée" : "Départ"}
                            color={type === "entree" ? "secondary" : "error"}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            )}
          </Card>
        </>
      )}
    </Box>
  );
}