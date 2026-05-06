import { useEffect, useMemo, useState, useCallback } from "react";
import {
  Box,
  Card,
  CardContent,
  Stack,
  Button,
  Popover,
  Divider,
  Typography,
  Grid,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { LocalizationProvider, DesktopDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import PersonnelService from "../../services/PersonnelService";
import PropTypes from "prop-types";

dayjs.extend(isBetween);

const clean = (s) => (s ? String(s).trim() : "");
const isArchived = (v) =>
  v === true || v === 1 || String(v).toLowerCase() === "true";

// ── KPI Card ──────────────────────────────────────────────────────────────────
function KpiCard({ label, value, sub, color }) {
  return (
    <Card variant="outlined" sx={{ borderRadius: 1, height: "100%" }}>
      <CardContent sx={{ p: 2 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
          {label}
        </Typography>
        <Typography variant="h2" sx={{ color, fontWeight: 700 }}>
          {value}
        </Typography>
        {sub && (
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            {sub}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

KpiCard.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  sub: PropTypes.string,
  color: PropTypes.string,
};

// ── Mini bar horizontal ───────────────────────────────────────────────────────
function HBarRow({ label, present, depart, max, PRIMARY, TEAL }) {
  const pct = (v) => Math.round((v / (max || 1)) * 100);
  return (
    <Stack direction="row" alignItems="center" spacing={1} mb={1}>
      <Typography
        variant="body2"
        sx={{
          width: 130,
          fontWeight: 500,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          flexShrink: 0,
        }}
      >
        {label}
      </Typography>
      <Box
        sx={{
          flex: 1,
          height: 9,
          background: "rgba(0,0,0,0.07)",
          borderRadius: 1,
          overflow: "hidden",
          display: "flex",
        }}
      >
        <Box sx={{ width: `${pct(present)}%`, background: "#5594b1" }} />
        <Box sx={{ width: `${pct(depart)}%`, background: "#02B2AF", ml: "1px" }} />
      </Box>
      <Typography variant="body2" sx={{ whiteSpace: "nowrap", width: 64, textAlign: "right" }}>
        <span style={{ color: PRIMARY, fontWeight: 700 }}>{present}</span>
        {" / "}
        <span style={{ color: TEAL, fontWeight: 700 }}>{depart}</span>
      </Typography>
    </Stack>
  );
}

HBarRow.propTypes = {
  label: PropTypes.string,
  present: PropTypes.number,
  depart: PropTypes.number,
  max: PropTypes.number,
  PRIMARY: PropTypes.string,
  TEAL: PropTypes.string,
};

// ── Badge ─────────────────────────────────────────────────────────────────────
function Badge({ value, variant = "blue", PRIMARY }) {
  const RED = "#c0392b";
  const styles = {
    blue: { background: "#e0ecf6", color: PRIMARY },
    teal: { background: "#e0f7f7", color: "#007a78" },
    red: { background: "#fdecea", color: RED },
    gray: { background: "#f0f4f8", color: "#5c6b7a" },
  };
  return (
    <Chip
      label={value}
      size="small"
      sx={{
        height: 24,
        fontSize: 13,
        fontWeight: 700,
        borderRadius: 1,
        ...styles[variant],
      }}
    />
  );
}

Badge.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  variant: PropTypes.string,
  PRIMARY: PropTypes.string,
};

// ── Page ──────────────────────────────────────────────────────────────────────
export default function PersonnelStatisticsPage() {
  const theme = useTheme();
  const PRIMARY = theme.palette.primary.main;
  const TEAL = theme.palette.secondary.main;
  const RED = "#c0392b";

  const [personnes, setPersonnes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDept, setSelectedDept] = useState("");
  const [periodMode, setPeriodMode] = useState("global");
  const [startDate, setStartDate] = useState(dayjs().startOf("year"));
  const [endDate, setEndDate] = useState(dayjs().endOf("day"));
  const [anchorEl, setAnchorEl] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await PersonnelService.getAll();
        setPersonnes(Array.isArray(res?.data) ? res.data : []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ── isDepart en useCallback ─────────────────────────────────────────────────
  const isDepart = useCallback((p) => {
    const archived = isArchived(p?.SiArchive ?? p?.Archive ?? p?.Archived);
    const dSortie = p?.DateSortie && dayjs(p.DateSortie).isValid()
      ? dayjs(p.DateSortie)
      : null;
    if (periodMode === "global") return Boolean(dSortie) || archived;
    return (
      (dSortie && dSortie.isBetween(startDate.startOf("day"), endDate.endOf("day"), "day", "[]")) ||
      (!dSortie && archived)
    );
  }, [periodMode, startDate, endDate]);

  const departments = useMemo(() => {
    const set = new Set();
    personnes.forEach((p) => {
      const d = clean(p?.NomDepartementFr);
      if (d) set.add(d);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b, "fr"));
  }, [personnes]);

  const filteredByPeriod = useMemo(() => {
    if (periodMode === "global") return personnes;
    return personnes.filter((p) => {
      const dEntree = p?.DateEntree ? dayjs(p.DateEntree) : null;
      const dSortie = p?.DateSortie ? dayjs(p.DateSortie) : null;
      const entree = dEntree?.isValid() && dEntree.startOf("day").isBefore(endDate.endOf("day").add(1, "ms"));
      const pasParti = !dSortie?.isValid() || dSortie.endOf("day").isAfter(startDate.startOf("day").subtract(1, "ms"));
      return entree && pasParti;
    });
  }, [personnes, periodMode, startDate, endDate]);

  const filtered = useMemo(() => {
    if (!selectedDept) return filteredByPeriod;
    return filteredByPeriod.filter((p) => clean(p?.NomDepartementFr) === selectedDept);
  }, [filteredByPeriod, selectedDept]);

  const { totalPresent, totalDepart } = useMemo(() => {
    let p = 0, d = 0;
    filtered.forEach((per) => (isDepart(per) ? d++ : p++));
    return { totalPresent: p, totalDepart: d };
  }, [filtered, isDepart]);

  const statsByDept = useMemo(() => {
    const map = new Map();
    filteredByPeriod.forEach((p) => {
      const dept = clean(p?.NomDepartementFr) || "Sans département";
      if (!map.has(dept)) map.set(dept, { present: 0, depart: 0 });
      isDepart(p) ? map.get(dept).depart++ : map.get(dept).present++;
    });
    return Array.from(map.entries())
      .map(([dept, v]) => ({ dept, ...v, total: v.present + v.depart }))
      .sort((a, b) => b.total - a.total);
  }, [filteredByPeriod, isDepart]);

  const maxDept = Math.max(...statsByDept.map((d) => d.present + d.depart), 1);

  const statsBySvc = useMemo(() => {
    const map = new Map();
    filtered.forEach((p) => {
      const svc = clean(p?.NomServiceFr) || "Sans service";
      const dept = clean(p?.NomDepartementFr) || "-";
      const key = `${dept}|||${svc}`;
      if (!map.has(key)) map.set(key, { svc, dept, present: 0, depart: 0 });
      isDepart(p) ? map.get(key).depart++ : map.get(key).present++;
    });
    return Array.from(map.values())
      .map((v) => ({ ...v, total: v.present + v.depart }))
      .sort((a, b) => b.total - a.total);
  }, [filtered, isDepart]);

  const monthlyData = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => ({
      mois: dayjs().month(i).format("MMM"),
      Entrées: 0,
      Départs: 0,
    }));
    personnes.forEach((p) => {
      if (p?.DateEntree) { const m = dayjs(p.DateEntree).month(); if (!isNaN(m)) months[m].Entrées++; }
      if (p?.DateSortie) { const m = dayjs(p.DateSortie).month(); if (!isNaN(m)) months[m].Départs++; }
    });
    return months;
  }, [personnes]);

  const derniersMouvements = useMemo(() => {
    return [...personnes]
      .filter((p) => p?.DateEntree || p?.DateSortie)
      .sort((a, b) => dayjs(b.DateSortie ?? b.DateEntree).diff(dayjs(a.DateSortie ?? a.DateEntree)))
      .slice(0, 15)
      .map((p) => ({
        nom: `${p.NomPersonne ?? ""} ${p.PrenomPersonne ?? ""}`.trim(),
        service: clean(p?.NomServiceFr) || "-",
        dept: clean(p?.NomDepartementFr) || "-",
        date: p.DateSortie ? dayjs(p.DateSortie).format("DD/MM/YY") : dayjs(p.DateEntree).format("DD/MM/YY"),
        type: isDepart(p) ? "depart" : "entree",
      }));
  }, [personnes, isDepart]);

  const totalDept = statsByDept.reduce(
    (acc, r) => ({ present: acc.present + r.present, depart: acc.depart + r.depart, total: acc.total + r.total }),
    { present: 0, depart: 0, total: 0 }
  );
  const totalSvc = statsBySvc.reduce(
    (acc, r) => ({ present: acc.present + r.present, depart: acc.depart + r.depart, total: acc.total + r.total }),
    { present: 0, depart: 0, total: 0 }
  );

  const headSx = { borderBottomColor: "rgba(0,0,0,0.08)", py: 1.2 };
  const cellSx = { borderBottomColor: "rgba(0,0,0,0.06)", py: 1 };
  const totalSx = { ...cellSx, fontWeight: 700, background: "#f0f4f8", color: PRIMARY };

  return (
    <Box>
      <Typography variant="h1" mb={3}>
        Statistiques du personnel
      </Typography>

      {/* ── Filtres ── */}
      <Stack direction="row" spacing={2} alignItems="center" mb={3} flexWrap="wrap">
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Département</InputLabel>
          <Select value={selectedDept} label="Département" onChange={(e) => setSelectedDept(e.target.value)}>
            <MenuItem value="">Tous les départements</MenuItem>
            {departments.map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
          </Select>
        </FormControl>

        <Button
          variant="outlined"
          size="small"
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{ fontWeight: 600, color: PRIMARY, borderColor: "rgba(0,59,104,0.3)" }}
        >
          {periodMode === "global"
            ? "Période : toutes les dates"
            : `Du ${startDate.format("DD/MM/YY")} au ${endDate.format("DD/MM/YY")}`}
        </Button>

        {(selectedDept || periodMode !== "global") && (
          <Button size="small" onClick={() => { setSelectedDept(""); setPeriodMode("global"); }}>
            Réinitialiser
          </Button>
        )}
      </Stack>

      {/* ── Popover période ── */}
      <Popover open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}>
        <Box sx={{ p: 2, width: 300 }}>
          <Typography variant="h4" gutterBottom>Filtrer par intervalle</Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Stack spacing={2}>
              <DesktopDatePicker label="Date de début" value={startDate}
                onChange={(v) => { if (v) { setStartDate(dayjs(v).startOf("day")); setPeriodMode("range"); } }}
                slotProps={{ textField: { size: "small" } }} />
              <DesktopDatePicker label="Date de fin" value={endDate}
                onChange={(v) => { if (v) { setEndDate(dayjs(v).endOf("day")); setPeriodMode("range"); } }}
                slotProps={{ textField: { size: "small" } }} />
            </Stack>
          </LocalizationProvider>
          <Divider sx={{ my: 1.5 }} />
          <Button fullWidth onClick={() => { setPeriodMode("global"); setAnchorEl(null); }}>
            Toutes les dates
          </Button>
          <Button fullWidth variant="contained" sx={{ mt: 1 }} onClick={() => setAnchorEl(null)}>
            Appliquer
          </Button>
        </Box>
      </Popover>

      {loading ? (
        <Stack alignItems="center" py={6}><CircularProgress color="primary" /></Stack>
      ) : (
        <>
          {/* ── KPIs ── */}
          <Grid container spacing={2} mb={3}>
            <Grid item xs={6} sm={4}>
              <KpiCard label="Total présents" value={totalPresent} sub="membres en poste" color={PRIMARY} />
            </Grid>
            <Grid item xs={6} sm={4}>
              <KpiCard label="Total départs" value={totalDepart} sub="archivés / sortis" color={RED} />
            </Grid>
            <Grid item xs={6} sm={4}>
              <KpiCard label="Départements" value={departments.length} sub={`/ ${statsBySvc.length} services`} color={PRIMARY} />
            </Grid>
          </Grid>

          {/* ── Barres + Graphique ── */}
          <Grid container spacing={2} mb={2}>
            <Grid item xs={12} md={5}>
              <Card variant="outlined" sx={{ borderRadius: 1, height: "100%" }}>
                <CardContent>
                  <Typography variant="h4" mb={2}>Présents &amp; Départs par département</Typography>
                  <Stack direction="row" spacing={2} mb={2}>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <Box sx={{ width: 10, height: 10, borderRadius: 1, background: "#5594b1" }} />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>Présents</Typography>
                    </Stack>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <Box sx={{ width: 10, height: 10, borderRadius: 1, background: TEAL }} />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>Départs</Typography>
                    </Stack>
                  </Stack>
                  {statsByDept.map((row) => (
                    <HBarRow key={row.dept} label={row.dept} present={row.present} depart={row.depart} max={maxDept} PRIMARY={PRIMARY} TEAL={TEAL} />
                  ))}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={7}>
              <Card variant="outlined" sx={{ borderRadius: 1, height: "100%" }}>
                <CardContent>
                  <Typography variant="h4" mb={2}>Évolution mensuelle</Typography>
                  <Stack direction="row" spacing={2} mb={2}>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <Box sx={{ width: 10, height: 10, borderRadius: 1, background: "#5594b1" }} />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>Entrées</Typography>
                    </Stack>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <Box sx={{ width: 10, height: 10, borderRadius: 1, background: TEAL }} />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>Départs</Typography>
                    </Stack>
                  </Stack>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={monthlyData} barCategoryGap="30%">
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                      <XAxis dataKey="mois" tick={{ fontSize: 12, fill: theme.palette.text.secondary }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 12, fill: theme.palette.text.secondary }} axisLine={false} tickLine={false} allowDecimals={false} />
                      <Tooltip contentStyle={{ fontSize: 13, borderRadius: 8, border: "1px solid rgba(0,0,0,0.08)" }} cursor={{ fill: "rgba(0,59,104,0.04)" }} />
                      <Bar dataKey="Entrées" fill="#5594b1" radius={[3, 3, 0, 0]} />
                      <Bar dataKey="Départs" fill="#02B2AF" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* ── Tableau détaillé ── */}
          <Card variant="outlined" sx={{ borderRadius: 1 }}>
            <CardContent>
              <Typography variant="h4" mb={2}>Détail complet</Typography>

              <Tabs value={tabIndex} onChange={(_, v) => setTabIndex(v)}
                sx={{
                  mb: 2,
                  borderBottom: "1.5px solid rgba(0,59,104,0.12)",
                  minHeight: 40,
                  "& .MuiTab-root": { fontSize: 14, fontWeight: 600, textTransform: "none", color: theme.palette.text.secondary, minHeight: 40 },
                  "& .Mui-selected": { color: PRIMARY },
                  "& .MuiTabs-indicator": { backgroundColor: TEAL, height: 2.5 },
                }}
              >
                <Tab label="Par département" />
                <Tab label="Par service" />
                <Tab label="Derniers mouvements" />
              </Tabs>

              {tabIndex === 0 && (
                <Box sx={{ overflowX: "auto" }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={headSx}>Département</TableCell>
                        <TableCell sx={headSx} align="center">Présents</TableCell>
                        <TableCell sx={headSx} align="center">Départs</TableCell>
                        <TableCell sx={headSx} align="center">Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {statsByDept.map((row) => (
                        <TableRow key={row.dept} hover>
                          <TableCell sx={cellSx}>{row.dept}</TableCell>
                          <TableCell sx={cellSx} align="center"><Badge value={row.present} variant="blue" PRIMARY={PRIMARY} /></TableCell>
                          <TableCell sx={cellSx} align="center"><Badge value={row.depart} variant="teal" PRIMARY={PRIMARY} /></TableCell>
                          <TableCell sx={cellSx} align="center">{row.total}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell sx={totalSx}>TOTAL</TableCell>
                        <TableCell sx={totalSx} align="center"><Badge value={totalDept.present} variant="blue" PRIMARY={PRIMARY} /></TableCell>
                        <TableCell sx={totalSx} align="center"><Badge value={totalDept.depart} variant="teal" PRIMARY={PRIMARY} /></TableCell>
                        <TableCell sx={totalSx} align="center">{totalDept.total}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Box>
              )}

              {tabIndex === 1 && (
                <Box sx={{ overflowX: "auto" }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={headSx}>Service</TableCell>
                        <TableCell sx={headSx}>Département</TableCell>
                        <TableCell sx={headSx} align="center">Présents</TableCell>
                        <TableCell sx={headSx} align="center">Départs</TableCell>
                        <TableCell sx={headSx} align="center">Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {statsBySvc.map((row) => (
                        <TableRow key={`${row.dept}-${row.svc}`} hover>
                          <TableCell sx={cellSx}>{row.svc}</TableCell>
                          <TableCell sx={cellSx}><Badge value={row.dept} variant="gray" PRIMARY={PRIMARY} /></TableCell>
                          <TableCell sx={cellSx} align="center"><Badge value={row.present} variant="blue" PRIMARY={PRIMARY} /></TableCell>
                          <TableCell sx={cellSx} align="center"><Badge value={row.depart} variant="teal" PRIMARY={PRIMARY} /></TableCell>
                          <TableCell sx={cellSx} align="center">{row.total}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell sx={totalSx}>TOTAL</TableCell>
                        <TableCell sx={totalSx} />
                        <TableCell sx={totalSx} align="center"><Badge value={totalSvc.present} variant="blue" PRIMARY={PRIMARY} /></TableCell>
                        <TableCell sx={totalSx} align="center"><Badge value={totalSvc.depart} variant="teal" PRIMARY={PRIMARY} /></TableCell>
                        <TableCell sx={totalSx} align="center">{totalSvc.total}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Box>
              )}

              {tabIndex === 2 && (
                <Box sx={{ overflowX: "auto" }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={headSx}>Nom</TableCell>
                        <TableCell sx={headSx}>Service</TableCell>
                        <TableCell sx={headSx}>Département</TableCell>
                        <TableCell sx={headSx}>Date</TableCell>
                        <TableCell sx={headSx}>Mouvement</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {derniersMouvements.map((row, i) => (
                        <TableRow key={i} hover>
                          <TableCell sx={{ ...cellSx, fontWeight: 600 }}>{row.nom}</TableCell>
                          <TableCell sx={cellSx}>{row.service}</TableCell>
                          <TableCell sx={cellSx}>{row.dept}</TableCell>
                          <TableCell sx={cellSx}>{row.date}</TableCell>
                          <TableCell sx={cellSx}>
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                              <Box sx={{ width: 7, height: 7, borderRadius: 1, background: row.type === "entree" ? TEAL : RED }} />
                              <Badge value={row.type === "entree" ? "Entrée" : "Départ"} variant={row.type === "entree" ? "teal" : "red"} PRIMARY={PRIMARY} />
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </Box>
  );
}