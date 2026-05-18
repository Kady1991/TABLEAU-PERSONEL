import { useEffect, useMemo, useState, useCallback, useRef } from "react";
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
import PersonnelLoader from "../../components/Loading/PersonnelLoaderComponent.jsx";
import PropTypes from "prop-types";

dayjs.extend(isBetween);

// ── Styles d'animation globaux ────────────────────────────────────────────────
const GLOBAL_STYLES = `
  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.93); }
    to   { opacity: 1; transform: scale(1); }
  }
  @keyframes barGrow {
    from { transform: scaleX(0); transform-origin: left; }
    to   { transform: scaleX(1); transform-origin: left; }
  }
  @keyframes countUp {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .anim-fade-slide-up {
    animation: fadeSlideUp 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  .anim-scale-in {
    animation: scaleIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
  }
  .anim-fade-in {
    animation: fadeIn 0.4s ease both;
  }
`;

// Injecte les styles une seule fois
if (typeof document !== "undefined" && !document.getElementById("personnel-stats-styles")) {
  const style = document.createElement("style");
  style.id = "personnel-stats-styles";
  style.textContent = GLOBAL_STYLES;
  document.head.appendChild(style);
}

// ── Hook : compteur animé ─────────────────────────────────────────────────────
function useAnimatedCount(target, duration = 700) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = null;
    const from = 0;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(from + (target - from) * eased));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return display;
}

// ── Hook : observer intersection (déclenche l'animation à l'entrée dans le viewport) ──
function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  const optionsRef = useRef(options);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold: 0.12, ...optionsRef.current });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

const clean = (s) => (s ? String(s).trim() : "");
const isArchived = (v) =>
  v === true || v === 1 || String(v).toLowerCase() === "true";

const BAR_BLUE = "#5594b1";
const RED      = "#c0392b";

// ── KPI Card animée ───────────────────────────────────────────────────────────
function KpiCard({ label, value, sub, color, delay = 0 }) {
  const animated = useAnimatedCount(typeof value === "number" ? value : 0);
  return (
    <Card
      className="anim-scale-in"
      sx={{ height: "100%", style: `animation-delay: ${delay}ms` }}
      style={{ animationDelay: `${delay}ms` }}
    >
      <CardContent>
        <Typography variant="subtitle2" gutterBottom>
          {label}
        </Typography>
        <Typography
          variant="h2"
          sx={{
            color,
            transition: "color 0.3s ease",
          }}
        >
          {typeof value === "number" ? animated : value}
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
  delay: PropTypes.number,
};

// ── Mini bar horizontale animée ───────────────────────────────────────────────
function HBarRow({ label, present, depart, max, PRIMARY, TEAL, delay = 0 }) {
  const [ref, inView] = useInView();
  const pct = (v) => Math.round((v / (max || 1)) * 100);
  return (
    <Stack
      ref={ref}
      direction="row"
      alignItems="center"
      spacing={1}
      mb={1}
      sx={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateX(0)" : "translateX(-12px)",
        transition: `opacity 0.4s ease ${delay}ms, transform 0.4s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
      }}
    >
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
        <Box
          sx={{
            width: inView ? `${pct(present)}%` : "0%",
            bgcolor: BAR_BLUE,
            transition: `width 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${delay + 80}ms`,
          }}
        />
        <Box
          sx={{
            width: inView ? `${pct(depart)}%` : "0%",
            bgcolor: TEAL,
            ml: "1px",
            transition: `width 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${delay + 160}ms`,
          }}
        />
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
  delay: PropTypes.number,
};

// ── Badge Chip ────────────────────────────────────────────────────────────────
function Badge({ value, variant = "blue", PRIMARY }) {
  const styles = {
    blue: { background: "#e0ecf6", color: PRIMARY },
    teal: { background: "#e0f7f7", color: "#007a78" },
    red:  { background: "#fdecea", color: RED },
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

// ── Légende commune ───────────────────────────────────────────────────────────
function Legend({ items }) {
  return (
    <Stack direction="row" spacing={2} mb={2}>
      {items.map(({ label, color }) => (
        <Stack key={label} direction="row" spacing={0.5} alignItems="center">
          <Box sx={{ width: 10, height: 10, borderRadius: 1, bgcolor: color }} />
          <Typography variant="body2" fontWeight={600}>
            {label}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}

Legend.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({ label: PropTypes.string, color: PropTypes.string })
  ),
};

// ── Ligne de tableau animée ───────────────────────────────────────────────────
function AnimatedTableRow({ children, delay = 0, ...props }) {
  const [ref, inView] = useInView();
  return (
    <TableRow
      ref={ref}
      sx={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(8px)",
        transition: `opacity 0.35s ease ${delay}ms, transform 0.35s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
      }}
      hover
      {...props}
    >
      {children}
    </TableRow>
  );
}

AnimatedTableRow.propTypes = {
  children: PropTypes.node,
  delay: PropTypes.number,
};

// ── Page ──────────────────────────────────────────────────────────────────────
export default function PersonnelStatisticsPage() {
  const theme   = useTheme();
  const PRIMARY = theme.palette.primary.main;
  const TEAL    = theme.palette.secondary.main;

  const [personnes,    setPersonnes]    = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [selectedDept, setSelectedDept] = useState("");
  const [periodMode,   setPeriodMode]   = useState("global");
  const [startDate,    setStartDate]    = useState(dayjs().startOf("year"));
  const [endDate,      setEndDate]      = useState(dayjs().endOf("day"));
  const [anchorEl,     setAnchorEl]     = useState(null);
  const [tabIndex,     setTabIndex]     = useState(0);
  const [mounted,      setMounted]      = useState(false);

  useEffect(() => {
    // Léger délai pour laisser le DOM se stabiliser avant les animations
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

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

  const isDepart = useCallback((p) => {
    const archived = isArchived(p?.SiArchive ?? p?.Archive ?? p?.Archived);
    const dSortie  = p?.DateSortie && dayjs(p.DateSortie).isValid() ? dayjs(p.DateSortie) : null;
    if (periodMode === "global") return Boolean(dSortie) || archived;
    return (
      (dSortie && dSortie.isBetween(startDate.startOf("day"), endDate.endOf("day"), "day", "[]")) ||
      (!dSortie && archived)
    );
  }, [periodMode, startDate, endDate]);

  const departments = useMemo(() => {
    const set = new Set();
    personnes.forEach((p) => { const d = clean(p?.NomDepartementFr); if (d) set.add(d); });
    return Array.from(set).sort((a, b) => a.localeCompare(b, "fr"));
  }, [personnes]);

  const filteredByPeriod = useMemo(() => {
    if (periodMode === "global") return personnes;
    return personnes.filter((p) => {
      const dEntree = p?.DateEntree ? dayjs(p.DateEntree) : null;
      const dSortie = p?.DateSortie ? dayjs(p.DateSortie) : null;
      const entree   = dEntree?.isValid() && dEntree.startOf("day").isBefore(endDate.endOf("day").add(1, "ms"));
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
      const svc  = clean(p?.NomServiceFr) || "Sans service";
      const dept = clean(p?.NomDepartementFr) || "-";
      const key  = `${dept}|||${svc}`;
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
        nom:     `${p.NomPersonne ?? ""} ${p.PrenomPersonne ?? ""}`.trim(),
        service: clean(p?.NomServiceFr) || "-",
        dept:    clean(p?.NomDepartementFr) || "-",
        date:    p.DateSortie ? dayjs(p.DateSortie).format("DD/MM/YY") : dayjs(p.DateEntree).format("DD/MM/YY"),
        type:    isDepart(p) ? "depart" : "entree",
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

  const totalRowSx = { fontWeight: 700, bgcolor: "#f0f4f8", color: PRIMARY };

  return (
    <Box>
      {/* ── Titre animé ── */}
      <Typography
        variant="h1"
        className="anim-fade-slide-up"
        style={{ animationDelay: "0ms" }}
      >
        Statistiques du personnel
      </Typography>

      {/* ── Filtres animés ── */}
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        mb={3}
        flexWrap="wrap"
        className="anim-fade-slide-up"
        style={{ animationDelay: "80ms" }}
      >
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Département</InputLabel>
          <Select
            value={selectedDept}
            label="Département"
            onChange={(e) => setSelectedDept(e.target.value)}
          >
            <MenuItem value="">Tous les départements</MenuItem>
            {departments.map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
          </Select>
        </FormControl>

        <Button
          variant="outlined"
          size="small"
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{ transition: "box-shadow 0.2s ease", "&:hover": { boxShadow: "0 2px 10px rgba(0,0,0,0.12)" } }}
        >
          {periodMode === "global"
            ? "Période : toutes les dates"
            : `Du ${startDate.format("DD/MM/YY")} au ${endDate.format("DD/MM/YY")}`}
        </Button>

        {(selectedDept || periodMode !== "global") && (
          <Button
            size="small"
            className="anim-fade-in"
            onClick={() => { setSelectedDept(""); setPeriodMode("global"); }}
          >
            Réinitialiser
          </Button>
        )}
      </Stack>

      {/* ── Popover période ── */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        TransitionProps={{ timeout: 250 }}
      >
        <Box sx={{ p: 2, width: 300 }}>
          <Typography variant="h4" gutterBottom>Filtrer par intervalle</Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Stack spacing={2}>
              <DesktopDatePicker
                label="Date de début"
                value={startDate}
                onChange={(v) => { if (v) { setStartDate(dayjs(v).startOf("day")); setPeriodMode("range"); } }}
                slotProps={{ textField: { size: "small" } }}
              />
              <DesktopDatePicker
                label="Date de fin"
                value={endDate}
                onChange={(v) => { if (v) { setEndDate(dayjs(v).endOf("day")); setPeriodMode("range"); } }}
                slotProps={{ textField: { size: "small" } }}
              />
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
        <PersonnelLoader />
      ) : (
        <Box
          sx={{
            opacity: mounted ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        >
          {/* ── KPIs ── */}
          <Grid container spacing={2} mb={3}>
            {[
              { label: "Total présents", value: totalPresent, sub: "membres en poste",       color: PRIMARY, delay: 120 },
              { label: "Total départs",  value: totalDepart,  sub: "archivés / sortis",       color: RED,     delay: 200 },
              { label: "Départements",   value: departments.length, sub: `/ ${statsBySvc.length} services`, color: PRIMARY, delay: 280 },
            ].map(({ label, value, sub, color, delay }) => (
              <Grid item xs={6} sm={4} key={label}>
                <KpiCard label={label} value={value} sub={sub} color={color} delay={delay} />
              </Grid>
            ))}
          </Grid>

          {/* ── Barres + Graphique ── */}
          <Grid container spacing={2} mb={2}>
            <Grid item xs={12} md={5}>
              <Card
                className="anim-fade-slide-up"
                style={{ animationDelay: "320ms", height: "100%" }}
              >
                <CardContent>
                  <Typography variant="h3" gutterBottom>
                    Présents &amp; Départs par département
                  </Typography>
                  <Legend items={[
                    { label: "Présents", color: BAR_BLUE },
                    { label: "Départs",  color: TEAL },
                  ]} />
                  {statsByDept.map((row, i) => (
                    <HBarRow
                      key={row.dept}
                      label={row.dept}
                      present={row.present}
                      depart={row.depart}
                      max={maxDept}
                      PRIMARY={PRIMARY}
                      TEAL={TEAL}
                      delay={i * 50}
                    />
                  ))}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={7}>
              <Card
                className="anim-fade-slide-up"
                style={{ animationDelay: "400ms", height: "100%" }}
              >
                <CardContent>
                  <Typography variant="h3" gutterBottom>
                    Évolution mensuelle
                  </Typography>
                  <Legend items={[
                    { label: "Entrées", color: BAR_BLUE },
                    { label: "Départs", color: TEAL },
                  ]} />
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={monthlyData} barCategoryGap="30%">
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
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
                        contentStyle={{
                          fontSize: 13,
                          borderRadius: 8,
                          border: "1px solid rgba(0,0,0,0.08)",
                        }}
                        cursor={{ fill: "rgba(0,59,104,0.04)" }}
                        animationDuration={200}
                      />
                      <Bar dataKey="Entrées" fill={BAR_BLUE} radius={[3, 3, 0, 0]} isAnimationActive animationDuration={800} animationEasing="ease-out" />
                      <Bar dataKey="Départs" fill={TEAL}     radius={[3, 3, 0, 0]} isAnimationActive animationDuration={800} animationEasing="ease-out" animationBegin={150} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* ── Tableau détaillé ── */}
          <Card
            className="anim-fade-slide-up"
            style={{ animationDelay: "480ms" }}
          >
            <CardContent>
              <Typography variant="h3" gutterBottom>
                Détail complet
              </Typography>

              <Tabs
                value={tabIndex}
                onChange={(_, v) => setTabIndex(v)}
                sx={{ mb: 2 }}
              >
                <Tab label="Par département" />
                <Tab label="Par service" />
                <Tab label="Derniers mouvements" />
              </Tabs>

              {/* ── Tab 0 : Par département ── */}
              {tabIndex === 0 && (
                <Box
                  key="tab-dept"
                  className="anim-fade-in"
                  sx={{ overflowX: "auto" }}
                >
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Département</TableCell>
                        <TableCell align="center">Présents</TableCell>
                        <TableCell align="center">Départs</TableCell>
                        <TableCell align="center">Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {statsByDept.map((row, i) => (
                        <AnimatedTableRow key={row.dept} delay={i * 35}>
                          <TableCell>{row.dept}</TableCell>
                          <TableCell align="center"><Badge value={row.present} variant="blue"  PRIMARY={PRIMARY} /></TableCell>
                          <TableCell align="center"><Badge value={row.depart}  variant="teal"  PRIMARY={PRIMARY} /></TableCell>
                          <TableCell align="center">{row.total}</TableCell>
                        </AnimatedTableRow>
                      ))}
                      <TableRow>
                        <TableCell sx={totalRowSx}>TOTAL</TableCell>
                        <TableCell sx={totalRowSx} align="center"><Badge value={totalDept.present} variant="blue" PRIMARY={PRIMARY} /></TableCell>
                        <TableCell sx={totalRowSx} align="center"><Badge value={totalDept.depart}  variant="teal" PRIMARY={PRIMARY} /></TableCell>
                        <TableCell sx={totalRowSx} align="center">{totalDept.total}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Box>
              )}

              {/* ── Tab 1 : Par service ── */}
              {tabIndex === 1 && (
                <Box
                  key="tab-svc"
                  className="anim-fade-in"
                  sx={{ overflowX: "auto" }}
                >
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Service</TableCell>
                        <TableCell>Département</TableCell>
                        <TableCell align="center">Présents</TableCell>
                        <TableCell align="center">Départs</TableCell>
                        <TableCell align="center">Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {statsBySvc.map((row, i) => (
                        <AnimatedTableRow key={`${row.dept}-${row.svc}`} delay={i * 35}>
                          <TableCell>{row.svc}</TableCell>
                          <TableCell><Badge value={row.dept} variant="gray" PRIMARY={PRIMARY} /></TableCell>
                          <TableCell align="center"><Badge value={row.present} variant="blue" PRIMARY={PRIMARY} /></TableCell>
                          <TableCell align="center"><Badge value={row.depart}  variant="teal" PRIMARY={PRIMARY} /></TableCell>
                          <TableCell align="center">{row.total}</TableCell>
                        </AnimatedTableRow>
                      ))}
                      <TableRow>
                        <TableCell sx={totalRowSx}>TOTAL</TableCell>
                        <TableCell sx={totalRowSx} />
                        <TableCell sx={totalRowSx} align="center"><Badge value={totalSvc.present} variant="blue" PRIMARY={PRIMARY} /></TableCell>
                        <TableCell sx={totalRowSx} align="center"><Badge value={totalSvc.depart}  variant="teal" PRIMARY={PRIMARY} /></TableCell>
                        <TableCell sx={totalRowSx} align="center">{totalSvc.total}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Box>
              )}

              {/* ── Tab 2 : Derniers mouvements ── */}
              {tabIndex === 2 && (
                <Box
                  key="tab-mvt"
                  className="anim-fade-in"
                  sx={{ overflowX: "auto" }}
                >
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
                      {derniersMouvements.map((row, i) => (
                        <AnimatedTableRow key={i} delay={i * 35}>
                          <TableCell sx={{ fontWeight: 600 }}>{row.nom}</TableCell>
                          <TableCell>{row.service}</TableCell>
                          <TableCell>{row.dept}</TableCell>
                          <TableCell>{row.date}</TableCell>
                          <TableCell>
                            <Stack direction="row" alignItems="center" spacing={0.5}>
                              <Box sx={{
                                width: 7, height: 7, borderRadius: 1,
                                bgcolor: row.type === "entree" ? TEAL : RED,
                              }} />
                              <Badge
                                value={row.type === "entree" ? "Entrée" : "Départ"}
                                variant={row.type === "entree" ? "teal" : "red"}
                                PRIMARY={PRIMARY}
                              />
                            </Stack>
                          </TableCell>
                        </AnimatedTableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      )}
    </Box>
  );
}