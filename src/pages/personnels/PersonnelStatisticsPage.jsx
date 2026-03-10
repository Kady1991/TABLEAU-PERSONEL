import { useEffect, useMemo, useState } from "react";
import {
  Box,
  CardContent,
  Stack,
  Button,
  Popover,
  Divider,
  Typography,
} from "@mui/material";
import { LocalizationProvider, DesktopDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);

import PersonnelService from "../../services/PersonnelService";
import StatisticsCharts from "../../components/Statistics/StatisticsCharts";
import AutoCompleteDeptService from "../../components/AutoComplete/AutoCompleteDeptService";

const clean = (s) => (s ? String(s).trim() : "");
const GLOBAL_LABEL = "Global (tous)";
const isArchived = (v) =>
  v === true || v === 1 || String(v).toLowerCase() === "true";

function PersonnelStatisticsPage() {
  const [personnes, setPersonnes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLabel, setSelectedLabel] = useState(GLOBAL_LABEL);
  const [inputValue, setInputValue] = useState("");

  const [periodMode, setPeriodMode] = useState("global");
  const [startDate, setStartDate] = useState(dayjs().startOf("year"));
  const [endDate, setEndDate] = useState(dayjs().endOf("day"));
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

  const { departments, servicesByDept } = useMemo(() => {
    const map = new Map();

    personnes.forEach((p) => {
      const dept = clean(p?.NomDepartementFr) || "Sans département";
      const svc = clean(p?.NomServiceFr) || "Sans service";
      if (!map.has(dept)) map.set(dept, new Set());
      map.get(dept).add(svc);
    });

    const depts = Array.from(map.keys()).sort((a, b) =>
      a.localeCompare(b, "fr")
    );
    const svcs = {};

    depts.forEach((d) => {
      svcs[d] = Array.from(map.get(d) || []).sort((a, b) =>
        a.localeCompare(b, "fr")
      );
    });

    return { departments: depts, servicesByDept: svcs };
  }, [personnes]);

  const selectionInfo = useMemo(() => {
    if (!selectedLabel || selectedLabel === GLOBAL_LABEL) {
      return { type: "global", dept: "", service: "", parentDept: "" };
    }

    if (departments.includes(selectedLabel)) {
      return { type: "dept", dept: selectedLabel, service: "", parentDept: "" };
    }

    let parentDept = "";
    for (const d of departments) {
      if ((servicesByDept[d] || []).includes(selectedLabel)) {
        parentDept = d;
        break;
      }
    }

    return { type: "service", dept: "", service: selectedLabel, parentDept };
  }, [selectedLabel, departments, servicesByDept]);

  const filteredData = useMemo(() => {
    return personnes.filter((p) => {
      if (periodMode === "range") {
        const dEntree = p?.DateEntree ? dayjs(p.DateEntree) : null;
        const dSortie = p?.DateSortie ? dayjs(p.DateSortie) : null;

        const estDejaEntre =
          dEntree && dEntree.isValid()
            ? dEntree.startOf("day").isBefore(endDate.endOf("day").add(1, "millisecond"))
            : false;

        const estPasPartiAvant =
          !dSortie || !dSortie.isValid()
            ? true
            : dSortie.endOf("day").isAfter(startDate.startOf("day").subtract(1, "millisecond"));

        if (!estDejaEntre || !estPasPartiAvant) return false;
      }

      if (selectionInfo.type === "global") return true;
      if (selectionInfo.type === "dept") {
        return clean(p?.NomDepartementFr) === selectionInfo.dept;
      }
      if (selectionInfo.type === "service") {
        return clean(p?.NomServiceFr) === selectionInfo.service;
      }
      return true;
    });
  }, [personnes, periodMode, startDate, endDate, selectionInfo]);

  const statsComputed = useMemo(() => {
    const map = new Map();
    let entries = 0;
    let exits = 0;

    const keyOf = (p) => {
      if (selectionInfo.type === "global") {
        return clean(p?.NomDepartementFr) || "Inconnu";
      }
      if (selectionInfo.type === "dept") {
        return clean(p?.NomServiceFr) || "Sans service";
      }
      return clean(p?.NomServiceFr) || selectionInfo.service;
    };

    filteredData.forEach((p) => {
      const key = keyOf(p);
      if (!map.has(key)) {
        map.set(key, { entries: 0, exits: 0 });
      }

      const dSortie =
        p?.DateSortie && dayjs(p.DateSortie).isValid()
          ? dayjs(p.DateSortie)
          : null;

      const archived = isArchived(
        p?.SiArchive ?? p?.Archive ?? p?.Archived ?? p?.archive ?? p?.IsArchived
      );

      let isExit = false;

      if (periodMode === "global") {
        isExit = Boolean(dSortie) || archived;
      } else {
        isExit =
          (dSortie &&
            dSortie.isBetween(
              startDate.startOf("day"),
              endDate.endOf("day"),
              "day",
              "[]"
            )) ||
          (!dSortie && archived);
      }

      if (isExit) {
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
  }, [filteredData, selectionInfo, startDate, endDate, periodMode]);

  const series = useMemo(() => {
    const data = statsComputed?.data ?? [];
    return [
      {
        label: "Effectifs Actifs",
        data: data.map((d) => Number(d?.entries ?? 0)),
        color: "#5594b1",
      },
      {
        label: "Sorties (Départs)",
        data: data.map((d) => Number(d?.exits ?? 0)),
        color: "#d32f2f",
      },
    ];
  }, [statsComputed]);

  return (
    <Box>
      <CardContent>
        <Stack direction="row" spacing={3} alignItems="center">
          <AutoCompleteDeptService
            personnes={personnes}
            value={inputValue}
            onChange={setInputValue}
            loading={loading}
            onSelect={(opt) => setSelectedLabel(opt?.label || GLOBAL_LABEL)}
          />

          <Button
            variant="contained"
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{
              borderRadius: 1,
              height: 40,
              bgcolor: "#5594b1",
              textTransform: "none",
            }}
          >
            {periodMode === "global"
              ? "Période: Global"
              : `Du ${startDate.format("DD/MM/YY")} au ${endDate.format("DD/MM/YY")}`}
          </Button>
        </Stack>
      </CardContent>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Box sx={{ p: 2, width: 320 }}>
          <Typography variant="subtitle2" gutterBottom>
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
                  }
                }}
                slotProps={{
                  actionBar: { actions: ["today"] },
                  textField: { size: "small" },
                }}
              />

              <DesktopDatePicker
                label="Date de fin"
                value={endDate}
                onChange={(v) => {
                  if (v) {
                    setEndDate(dayjs(v).endOf("day"));
                    setPeriodMode("range");
                  }
                }}
                slotProps={{
                  actionBar: { actions: ["today"] },
                  textField: { size: "small" },
                }}
              />
            </Stack>
          </LocalizationProvider>

          <Divider sx={{ my: 1.5 }} />

          <Button
            fullWidth
            onClick={() => {
              setPeriodMode("global");
              setAnchorEl(null);
            }}
          >
            Toutes les dates
          </Button>

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 1, bgcolor: "#5594b1" }}
            onClick={() => setAnchorEl(null)}
          >
            Appliquer
          </Button>
        </Box>
      </Popover>

      <StatisticsCharts
        statsComputed={statsComputed}
        series={series}
        currentTitle={selectedLabel || GLOBAL_LABEL}
        currentSubtitle={
          selectionInfo.type === "service" ? selectionInfo.parentDept : ""
        }
        hideBarChart={selectionInfo.type === "service"}
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