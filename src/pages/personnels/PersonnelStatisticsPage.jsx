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
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
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

// ── Hook : observer intersection ──────────────────────────────────────────────
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

// ── KPI Card animée (icône + tendance) ────────────────────────────────────────
function KpiCard({ label, value, sub, colorKey, icon: Icon, trend, delay = 0 }) {
  const theme = useTheme();
  const color = colorKey === "red" ? theme.palette.error.main : theme.palette.primary.main;
  const animated = useAnimatedCount(typeof value === "number" ? value : 0);

  const TrendIcon = trend > 0 ? TrendingUpIcon : trend < 0 ? TrendingDownIcon : TrendingFlatIcon;
  const trendColor = trend > 0
    ? theme.custom.stats.trendUp
    : trend < 0
      ? theme.custom.stats.trendDown
      : theme.palette.text.secondary;

  return (
    <Card
      className="anim-scale-in"
      style={{ animationDelay: `${delay}ms` }}
      sx={{
        height: "100%",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 4,
          bgcolor: color,
        },
      }}
    >
      <CardContent>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
          <Typography variant="subtitle2" gutterBottom>
            {label}
          </Typography>
          {Icon && (
            <Box
              sx={{
                width: 34,
                height: 34,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: theme.custom.stats.kpiIconBg,
                color,
                flexShrink: 0,
              }}
            >
              <Icon fontSize="small" />
            </Box>
          )}
        </Stack>

        <Typography variant="h2" sx={{ color, transition: "color 0.3s ease" }}>
          {typeof value === "number" ? animated : value}
        </Typography>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 0.5 }}>
          {sub && (
            <Typography variant="body2" color="text.secondary">
              {sub}
            </Typography>
          )}
          {trend !== undefined && (
            <Stack direction="row" alignItems="center" spacing={0.3} sx={{ color: trendColor }}>
              <TrendIcon sx={{ fontSize: 15 }} />
              <Typography variant="body2" sx={{ fontWeight: 700, color: trendColor }}>
                {trend > 0 ? `+${trend}` : trend}
              </Typography>
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}

KpiCard.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  sub: PropTypes.string,
  colorKey: PropTypes.oneOf(["primary", "red"]),
  icon: PropTypes.elementType,
  trend: PropTypes.number,
  delay: PropTypes.number,
};

// ── Mini bar horizontale animée ───────────────────────────────────────────────
function HBarRow({ label, present, depart, max, delay = 0 }) {
  const theme = useTheme();
  const { present: presentColor, depart: departColor } = theme.custom.stats.barColors;
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
            bgcolor: presentColor,
            transition: `width 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${delay + 80}ms`,
          }}
        />
        <Box
          sx={{
            width: inView ? `${pct(depart)}%` : "0%",
            bgcolor: departColor,
            ml: "1px",
            transition: `width 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${delay + 160}ms`,
          }}
        />
      </Box>
      <Typography variant="body2" sx={{ whiteSpace: "nowrap", width: 64, textAlign: "right" }}>
        <span style={{ color: presentColor, fontWeight: 700 }}>{present}</span>
        {" / "}
        <span style={{ color: departColor, fontWeight: 700 }}>{depart}</span>
      </Typography>
    </Stack>
  );
}

HBarRow.propTypes = {
  label: PropTypes.string,
  present: PropTypes.number,
  depart: PropTypes.number,
  max: PropTypes.number,
  delay: PropTypes.number,
};

// ── Badge Chip — s'appuie sur les MuiChip color overrides existants ──────────
function Badge({ value, variant = "blue" }) {
  const theme = useTheme();
  if (variant === "gray") {
    return (
      <Chip
        label={value}
        size="small"
        sx={{ ...theme.custom.stats.chipGray, fontWeight: 700 }}
      />
    );
  }
  // blue → colorPrimary, teal → colorSecondary, red → colorError (déjà définis dans theme.js)
  const colorMap = { blue: "primary", teal: "secondary", red: "error" };
  return (
    <Chip
      label={value}
      size="small"
      color={colorMap[variant]}
      sx={{ fontWeight: 700 }}
    />
  );
}

Badge.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  variant: PropTypes.oneOf(["blue", "teal", "red", "gray"]),
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

// ── En-tête de colonne triable ────────────────────────────────────────────────
function SortableHeaderCell({ label, sortKey, sort, onSort, align = "left" }) {
  const active = sort.key === sortKey;
  return (
    <TableCell
      align={align}
      onClick={() => onSort(sortKey)}
      sx={{ cursor: "pointer", userSelect: "none", whiteSpace: "nowrap", "&:hover": { opacity: 0.75 } }}
    >
      <Stack direction="row" spacing={0.3} alignItems="center" justifyContent={align === "center" ? "center" : "flex-start"}>
        <span>{label}</span>
        {active && (
          sort.dir === "asc"
            ? <ArrowUpwardIcon sx={{ fontSize: 14 }} />
            : <ArrowDownwardIcon sx={{ fontSize: 14 }} />
        )}
      </Stack>
    </TableCell>
  );
}

SortableHeaderCell.propTypes = {
  label: PropTypes.string,
  sortKey: PropTypes.string,
  sort: PropTypes.shape({ key: PropTypes.string, dir: PropTypes.string }),
  onSort: PropTypes.func,
  align: PropTypes.string,
};

// ── Ligne de tableau animée (zebra intégré) ───────────────────────────────────
function AnimatedTableRow({ children, delay = 0, index = 0, ...props }) {
  const theme = useTheme();
  const [ref, inView] = useInView();
  return (
    <TableRow
      ref={ref}
      sx={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(8px)",
        transition: `opacity 0.35s ease ${delay}ms, transform 0.35s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
        bgcolor: index % 2 === 1 ? theme.custom.stats.tableStripe : "transparent",
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
  index: PropTypes.number,
};

// ── État vide ──────────────────────────────────────────────────────────────
function EmptyState({ message }) {
  return (
    <Box className="anim-fade-in" sx={{ py: 5, textAlign: "center", color: "text.secondary" }}>
      <Typography variant="body2">{message}</Typography>
    </Box>
  );
}

EmptyState.propTypes = {
  message: PropTypes.string,
};

// ── Page ──────────────────────────────────────────────────────────────────────
export default function PersonnelStatisticsPage() {
  const theme = useTheme();
  const { present: presentColor, depart: departColor } = theme.custom.stats.barColors;

  const [personnes,    setPersonnes]    = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [selectedDept, setSelectedDept] = useState("");
  const [periodMode,   setPeriodMode]   = useState("global");
  const [startDate,    setStartDate]    = useState(dayjs().startOf("year"));
  const [endDate,      setEndDate]      = useState(dayjs().endOf("day"));
  const [anchorEl,     setAnchorEl]     = useState(null);
  const [tabIndex,     setTabIndex]     = useState(0);
  const [mounted,      setMounted]      = useState(false);
  const [deptSort,     setDeptSort]     = useState({ key: "total", dir: "desc" });
  const [svcSort,      setSvcSort]      = useState({ key: "total", dir: "desc" });

  useEffect(() => {
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

  const sortedByDept = useMemo(() => {
    const arr = [...statsByDept];
    arr.sort((a, b) => {
      const av = deptSort.key === "dept" ? a.dept.toLowerCase() : a[deptSort.key];
      const bv = deptSort.key === "dept" ? b.dept.toLowerCase() : b[deptSort.key];
      if (av < bv) return deptSort.dir === "asc" ? -1 : 1;
      if (av > bv) return deptSort.dir === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [statsByDept, deptSort]);

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

  const sortedBySvc = useMemo(() => {
    const arr = [...statsBySvc];
    arr.sort((a, b) => {
      const av = ["svc", "dept"].includes(svcSort.key) ? a[svcSort.key].toLowerCase() : a[svcSort.key];
      const bv = ["svc", "dept"].includes(svcSort.key) ? b[svcSort.key].toLowerCase() : b[svcSort.key];
      if (av < bv) return svcSort.dir === "asc" ? -1 : 1;
      if (av > bv) return svcSort.dir === "asc" ? 1 : -1;
      return 0;
    });
    return arr;
  }, [statsBySvc, svcSort]);

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

  const { trendEntrees, trendDeparts } = useMemo(() => {
    const cur  = dayjs().month();
    const prev = (cur + 11) % 12;
    return {
      trendEntrees: monthlyData[cur].Entrées - monthlyData[prev].Entrées,
      trendDeparts: monthlyData[cur].Départs - monthlyData[prev].Départs,
    };
  }, [monthlyData]);

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

  const totalRowSx = { fontWeight: 700, ...theme.custom.stats.totalRow };

  const handleDeptSort = (key) => {
    setDeptSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "desc" }));
  };
  const handleSvcSort = (key) => {
    setSvcSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "desc" }));
  };

  const applyShortcut = (mode) => {
    const now = dayjs();
    if (mode === "mois")   { setStartDate(now.startOf("month")); setEndDate(now.endOf("day")); }
    if (mode === "annee")  { setStartDate(now.startOf("year"));  setEndDate(now.endOf("day")); }
    if (mode === "12mois") { setStartDate(now.subtract(12, "month").startOf("day")); setEndDate(now.endOf("day")); }
    setPeriodMode("range");
  };

  return (
    <Box>
      <Typography variant="h1" className="anim-fade-slide-up" style={{ animationDelay: "0ms" }}>
        Statistiques du personnel
      </Typography>

      {/* ── Filtres ── */}
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
          <Select value={selectedDept} label="Département" onChange={(e) => setSelectedDept(e.target.value)}>
            <MenuItem value="">Tous les départements</MenuItem>
            {departments.map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
          </Select>
        </FormControl>

        <Button
          variant="outlined"
          size="small"
          startIcon={<EventOutlinedIcon fontSize="small" />}
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{ transition: "box-shadow 0.2s ease", "&:hover": { boxShadow: "0 2px 10px rgba(0,0,0,0.12)" } }}
        >
          {periodMode === "global"
            ? "Période : toutes les dates"
            : `Du ${startDate.format("DD/MM/YY")} au ${endDate.format("DD/MM/YY")}`}
        </Button>

        {(selectedDept || periodMode !== "global") && (
          <Button size="small" className="anim-fade-in" onClick={() => { setSelectedDept(""); setPeriodMode("global"); }}>
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
        <Box sx={{ p: 2, width: 320 }}>
          <Typography variant="h4" gutterBottom>Filtrer par intervalle</Typography>

          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 1.5 }}>
            <Chip label="Ce mois" size="small" onClick={() => applyShortcut("mois")} />
            <Chip label="Cette année" size="small" onClick={() => applyShortcut("annee")} />
            <Chip label="12 derniers mois" size="small" onClick={() => applyShortcut("12mois")} />
          </Stack>

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
      ) : personnes.length === 0 ? (
        <Card className="anim-fade-in"><CardContent><EmptyState message="Aucune donnée de personnel disponible." /></CardContent></Card>
      ) : (
        <Box sx={{ opacity: mounted ? 1 : 0, transition: "opacity 0.3s ease" }}>
          {/* ── KPIs ── */}
          <Grid container spacing={2} mb={3}>
            <Grid item xs={6} sm={4}>
              <KpiCard
                label="Total présents"
                value={totalPresent}
                sub="membres en poste"
                colorKey="primary"
                icon={PeopleAltOutlinedIcon}
                trend={trendEntrees}
                delay={120}
              />
            </Grid>
            <Grid item xs={6} sm={4}>
              <KpiCard
                label="Total départs"
                value={totalDepart}
                sub="archivés / sortis"
                colorKey="red"
                icon={LogoutOutlinedIcon}
                trend={trendDeparts}
                delay={200}
              />
            </Grid>
            <Grid item xs={6} sm={4}>
              <KpiCard
                label="Départements"
                value={departments.length}
                sub={`/ ${statsBySvc.length} services`}
                colorKey="primary"
                icon={AccountTreeOutlinedIcon}
                delay={280}
              />
            </Grid>
          </Grid>

          {/* ── Barres + Graphique ── */}
          <Grid container spacing={2} mb={2}>
            <Grid item xs={12} md={5}>
              <Card className="anim-fade-slide-up" style={{ animationDelay: "320ms", height: "100%" }}>
                <CardContent>
                  <Typography variant="h3" gutterBottom>
                    Présents &amp; Départs par département
                  </Typography>
                  <Legend items={[
                    { label: "Présents", color: presentColor },
                    { label: "Départs",  color: departColor },
                  ]} />
                  {statsByDept.length === 0 ? (
                    <EmptyState message="Aucune donnée pour ce filtre." />
                  ) : statsByDept.map((row, i) => (
                    <HBarRow
                      key={row.dept}
                      label={row.dept}
                      present={row.present}
                      depart={row.depart}
                      max={maxDept}
                      delay={i * 50}
                    />
                  ))}
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={7}>
              <Card className="anim-fade-slide-up" style={{ animationDelay: "400ms", height: "100%" }}>
                <CardContent>
                  <Typography variant="h3" gutterBottom>
                    Évolution mensuelle
                  </Typography>
                  <Legend items={[
                    { label: "Entrées", color: presentColor },
                    { label: "Départs", color: departColor },
                  ]} />
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={monthlyData} barCategoryGap="30%">
                      <defs>
                        <linearGradient id="gradEntrees" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={presentColor} stopOpacity={1} />
                          <stop offset="100%" stopColor={presentColor} stopOpacity={0.55} />
                        </linearGradient>
                        <linearGradient id="gradDeparts" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={departColor} stopOpacity={1} />
                          <stop offset="100%" stopColor={departColor} stopOpacity={0.55} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                      <XAxis dataKey="mois" tick={{ fontSize: 12, fill: theme.palette.text.secondary }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 12, fill: theme.palette.text.secondary }} axisLine={false} tickLine={false} allowDecimals={false} />
                      <Tooltip
                        contentStyle={{ fontSize: 13, borderRadius: theme.shape.borderRadius, border: "1px solid rgba(0,0,0,0.08)" }}
                        cursor={{ fill: "rgba(0,59,104,0.04)" }}
                        animationDuration={200}
                      />
                      <Bar dataKey="Entrées" fill="url(#gradEntrees)" radius={[3, 3, 0, 0]} isAnimationActive animationDuration={800} animationEasing="ease-out" />
                      <Bar dataKey="Départs" fill="url(#gradDeparts)" radius={[3, 3, 0, 0]} isAnimationActive animationDuration={800} animationEasing="ease-out" animationBegin={150} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* ── Tableau détaillé ── */}
          <Card className="anim-fade-slide-up" style={{ animationDelay: "480ms" }}>
            <CardContent>
              <Typography variant="h3" gutterBottom>
                Détail complet
              </Typography>

              <Tabs value={tabIndex} onChange={(_, v) => setTabIndex(v)} sx={{ mb: 2 }}>
                <Tab label="Par département" />
                <Tab label="Par service" />
                <Tab label="Derniers mouvements" />
              </Tabs>

              {/* ── Tab 0 : Par département ── */}
              {tabIndex === 0 && (
                <Box key="tab-dept" className="anim-fade-in" sx={{ overflowX: "auto" }}>
                  {sortedByDept.length === 0 ? (
                    <EmptyState message="Aucune donnée pour ce filtre." />
                  ) : (
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <SortableHeaderCell label="Département" sortKey="dept" sort={deptSort} onSort={handleDeptSort} />
                          <SortableHeaderCell label="Présents" sortKey="present" sort={deptSort} onSort={handleDeptSort} align="center" />
                          <SortableHeaderCell label="Départs" sortKey="depart" sort={deptSort} onSort={handleDeptSort} align="center" />
                          <SortableHeaderCell label="Total" sortKey="total" sort={deptSort} onSort={handleDeptSort} align="center" />
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {sortedByDept.map((row, i) => (
                          <AnimatedTableRow key={row.dept} delay={i * 35} index={i}>
                            <TableCell>{row.dept}</TableCell>
                            <TableCell align="center"><Badge value={row.present} variant="blue" /></TableCell>
                            <TableCell align="center"><Badge value={row.depart}  variant="teal" /></TableCell>
                            <TableCell align="center">{row.total}</TableCell>
                          </AnimatedTableRow>
                        ))}
                        <TableRow>
                          <TableCell sx={totalRowSx}>TOTAL</TableCell>
                          <TableCell sx={totalRowSx} align="center"><Badge value={totalDept.present} variant="blue" /></TableCell>
                          <TableCell sx={totalRowSx} align="center"><Badge value={totalDept.depart}  variant="teal" /></TableCell>
                          <TableCell sx={totalRowSx} align="center">{totalDept.total}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  )}
                </Box>
              )}

              {/* ── Tab 1 : Par service ── */}
              {tabIndex === 1 && (
                <Box key="tab-svc" className="anim-fade-in" sx={{ overflowX: "auto" }}>
                  {sortedBySvc.length === 0 ? (
                    <EmptyState message="Aucune donnée pour ce filtre." />
                  ) : (
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <SortableHeaderCell label="Service" sortKey="svc" sort={svcSort} onSort={handleSvcSort} />
                          <SortableHeaderCell label="Département" sortKey="dept" sort={svcSort} onSort={handleSvcSort} />
                          <SortableHeaderCell label="Présents" sortKey="present" sort={svcSort} onSort={handleSvcSort} align="center" />
                          <SortableHeaderCell label="Départs" sortKey="depart" sort={svcSort} onSort={handleSvcSort} align="center" />
                          <SortableHeaderCell label="Total" sortKey="total" sort={svcSort} onSort={handleSvcSort} align="center" />
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {sortedBySvc.map((row, i) => (
                          <AnimatedTableRow key={`${row.dept}-${row.svc}`} delay={i * 35} index={i}>
                            <TableCell>{row.svc}</TableCell>
                            <TableCell><Badge value={row.dept} variant="gray" /></TableCell>
                            <TableCell align="center"><Badge value={row.present} variant="blue" /></TableCell>
                            <TableCell align="center"><Badge value={row.depart}  variant="teal" /></TableCell>
                            <TableCell align="center">{row.total}</TableCell>
                          </AnimatedTableRow>
                        ))}
                        <TableRow>
                          <TableCell sx={totalRowSx}>TOTAL</TableCell>
                          <TableCell sx={totalRowSx} />
                          <TableCell sx={totalRowSx} align="center"><Badge value={totalSvc.present} variant="blue" /></TableCell>
                          <TableCell sx={totalRowSx} align="center"><Badge value={totalSvc.depart}  variant="teal" /></TableCell>
                          <TableCell sx={totalRowSx} align="center">{totalSvc.total}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  )}
                </Box>
              )}

              {/* ── Tab 2 : Derniers mouvements ── */}
              {tabIndex === 2 && (
                <Box key="tab-mvt" className="anim-fade-in" sx={{ overflowX: "auto" }}>
                  {derniersMouvements.length === 0 ? (
                    <EmptyState message="Aucun mouvement récent." />
                  ) : (
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
                          <AnimatedTableRow key={i} delay={i * 35} index={i}>
                            <TableCell sx={{ fontWeight: 600 }}>{row.nom}</TableCell>
                            <TableCell>{row.service}</TableCell>
                            <TableCell>{row.dept}</TableCell>
                            <TableCell>{row.date}</TableCell>
                            <TableCell>
                              <Stack direction="row" alignItems="center" spacing={0.5}>
                                <Box sx={{
                                  width: 7, height: 7, borderRadius: 1,
                                  bgcolor: row.type === "entree" ? departColor : theme.palette.error.main,
                                }} />
                                <Badge
                                  value={row.type === "entree" ? "Entrée" : "Départ"}
                                  variant={row.type === "entree" ? "teal" : "red"}
                                />
                              </Stack>
                            </TableCell>
                          </AnimatedTableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      )}
    </Box>
  );
}