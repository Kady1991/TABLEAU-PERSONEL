import { useEffect, useMemo, useState } from "react";
import {
  Box,
  CardContent,
  Stack,
  Button,
  Popover,
  Divider,
} from "@mui/material";
import { LocalizationProvider, StaticDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import PersonnelService from "../../services/PersonnelService";
import StatisticsCharts from "../../components/Statistics/StatisticsCharts";
import AutoCompleteDeptService from "../../components/AutoComplete/AutoCompleteDeptService";

const clean = (s) => (s ? String(s).trim() : "");
const GLOBAL_LABEL = "Global (tous)";
const isArchived = (v) => v === true || v === 1 || String(v).toLowerCase() === "true";

function PersonnelStatisticsPage() {
  const [personnes, setPersonnes] = useState([]);
  const [loading, setLoading] = useState(true);

  // valeur affichée (Global / Departement / Service)
  const [selectedLabel, setSelectedLabel] = useState(GLOBAL_LABEL);

  // texte dans l’autocomplete
  const [inputValue, setInputValue] = useState("");

  // période
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [periodMode, setPeriodMode] = useState("global");
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const res = await PersonnelService.getAll();
        setPersonnes(Array.isArray(res?.data) ? res.data : []);
      } catch (e) {
        console.error(e);
        setPersonnes([]);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // departements + servicesByDept (pour retrouver le dept parent d’un service)
  const { departments, servicesByDept } = useMemo(() => {
    const map = new Map();

    personnes.forEach((p) => {
      const dept = clean(p?.NomDepartementFr) || "Sans département";
      const svc = clean(p?.NomServiceFr) || "Sans service";
      if (!map.has(dept)) map.set(dept, new Set());
      map.get(dept).add(svc);
    });

    const departments = Array.from(map.keys()).sort((a, b) => a.localeCompare(b, "fr"));
    const servicesByDept = {};
    departments.forEach((d) => {
      servicesByDept[d] = Array.from(map.get(d) || []).sort((a, b) => a.localeCompare(b, "fr"));
    });

    return { departments, servicesByDept };
  }, [personnes]);

  // type selection (global/dept/service)
  const selectionInfo = useMemo(() => {
    if (!selectedLabel || selectedLabel === GLOBAL_LABEL) {
      return { type: "global", dept: "", service: "", parentDept: "" };
    }

    if (departments.includes(selectedLabel)) {
      return { type: "dept", dept: selectedLabel, service: "", parentDept: "" };
    }

    // sinon service => retrouver le dept parent
    let parentDept = "";
    for (const d of departments) {
      if ((servicesByDept[d] || []).includes(selectedLabel)) {
        parentDept = d;
        break;
      }
    }
    return { type: "service", dept: "", service: selectedLabel, parentDept };
  }, [selectedLabel, departments, servicesByDept]);

  // Filtre data selon période + selection
  const filteredData = useMemo(() => {
    return personnes.filter((p) => {
      const matchDate =
        periodMode === "date"
          ? dayjs(p?.DateEntree).isSame(selectedDate, "day")
          : true;

      if (!matchDate) return false;

      if (selectionInfo.type === "global") return true;

      if (selectionInfo.type === "dept") {
        return clean(p?.NomDepartementFr) === selectionInfo.dept;
      }

      if (selectionInfo.type === "service") {
        return clean(p?.NomServiceFr) === selectionInfo.service;
      }

      return true;
    });
  }, [personnes, periodMode, selectedDate, selectionInfo]);

  // Stats calculées (xAxis + totals)
  const statsComputed = useMemo(() => {
    const map = new Map();
    let entries = 0;
    let exits = 0;

    const keyOf = (p) => {
      if (selectionInfo.type === "global") return clean(p?.NomDepartementFr) || "Inconnu";
      if (selectionInfo.type === "dept") return clean(p?.NomServiceFr) || "Sans service";
      if (selectionInfo.type === "service") return clean(p?.NomServiceFr) || selectionInfo.service;
      return "Inconnu";
    };

    filteredData.forEach((p) => {
      const key = keyOf(p);
      if (!map.has(key)) map.set(key, { entries: 0, exits: 0 });

      if (isArchived(p?.SiArchive)) {
        map.get(key).exits += 1;
        exits += 1;
      } else {
        map.get(key).entries += 1;
        entries += 1;
      }
    });

    return {
      xAxis: Array.from(map.keys()),
      data: Array.from(map.values()),
      totalEntries: entries,
      totalExits: exits,
    };
  }, [filteredData, selectionInfo]);

  const series = useMemo(() => {
    const data = statsComputed?.data ?? [];
    return [
      { label: "Actifs", data: data.map((d) => Number(d?.entries ?? 0)) },
      { label: "Sorties", data: data.map((d) => Number(d?.exits ?? 0)) },
    ];
  }, [statsComputed]);

  const hideBarChart = selectionInfo.type === "service";
  const currentSubtitle = selectionInfo.type === "service" ? selectionInfo.parentDept : "";

  return (
    <Box>
      <CardContent>
        <Stack direction="row" spacing={3} alignItems="center">
          <AutoCompleteDeptService
            personnes={personnes}
            value={inputValue}
            onChange={setInputValue}
            loading={loading}
            onSelect={(option) => {
              
              const next = option?.label ? option.label : GLOBAL_LABEL;
              setSelectedLabel(next);
            }}
          />

          <Button
            variant="contained"
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{ borderRadius: 1, height: 40, bgcolor: "#5594b1" }}
          >
            {periodMode === "global" ? "Période: Global" : selectedDate.format("DD/MM/YYYY")}
          </Button>
        </Stack>
      </CardContent>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <StaticDatePicker
            orientation="landscape"
            value={selectedDate}
            onChange={(val) => {
              setSelectedDate(val);
              setPeriodMode("date");
            }}
            onAccept={() => setAnchorEl(null)}
          />
        </LocalizationProvider>

        <Divider />

        <Button
          fullWidth
          onClick={() => {
            setPeriodMode("global");
            setAnchorEl(null);
          }}
        >
          Toutes les dates
        </Button>
      </Popover>

      <StatisticsCharts
        statsComputed={statsComputed}
        series={series}
        currentTitle={selectedLabel || GLOBAL_LABEL}
        currentSubtitle={currentSubtitle}
        hideBarChart={hideBarChart}
        mode={
          selectionInfo.type === "global"
            ? "global"
            : selectionInfo.type === "dept"
            ? "Département"
            : "Service"
        }
      />
    </Box>
  );
}

export default PersonnelStatisticsPage;