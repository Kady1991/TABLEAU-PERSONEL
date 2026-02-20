import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";

import PersonnelService from "../../services/PersonnelService";

function PersonnelStatisticsPage() {
  const [personnes, setPersonnes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedYear, setSelectedYear] = useState("Global");
  const [selectedDepartment, setSelectedDepartment] = useState("");

  // ✅ Charger les données depuis l'API
  const load = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await PersonnelService.getAll();
      const all = Array.isArray(res.data) ? res.data : [];

      setPersonnes(all);
    } catch (e) {
      setError(e?.message || "Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // ✅ Liste des départements
  const departments = useMemo(() => {
    const set = new Set(
      personnes.map((p) => p?.NomDepartementFr).filter(Boolean)
    );
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [personnes]);

  // ✅ Liste des années (basée sur les données, + Global)
  const years = useMemo(() => {
    const set = new Set();
    personnes.forEach((p) => {
      if (!p?.DateEntree) return;
      const y = new Date(p.DateEntree).getFullYear();
      if (!Number.isNaN(y)) set.add(y);
    });
    return Array.from(set).sort((a, b) => b - a); // récentes d'abord
  }, [personnes]);

  // ✅ Calcul des stats (bar chart + pie chart)
  const statsComputed = useMemo(() => {
    const stats = {};
    let totalEntries = 0;
    let totalExits = 0;

    personnes.forEach((person) => {
      const department = person?.NomDepartementFr || "Non spécifié";
      const service = person?.NomServiceFr || "Non spécifié";
      const entryYear = person?.DateEntree ? new Date(person.DateEntree).getFullYear() : null;

      // Filtrer par année (sauf Global)
      if (selectedYear !== "Global") {
        const y = parseInt(selectedYear, 10);
        if (entryYear !== y) return;
      }

      // Filtrer par département
      if (selectedDepartment && department !== selectedDepartment) return;

      // Axe X : si on filtre un département => on groupe par service, sinon par département
      const key = selectedDepartment ? service : department;

      if (!stats[key]) stats[key] = { entries: 0, exits: 0 };

      // Présents (SiArchive false)
      if (person?.SiArchive === false) {
        stats[key].entries += 1;
        totalEntries += 1;
      }

      // Sorties (SiArchive true)
      if (person?.SiArchive === true) {
        stats[key].exits += 1;
        totalExits += 1;
      }
    });

    const xAxis = Object.keys(stats);
    const data = xAxis.map((k) => stats[k]);

    return {
      xAxis,
      data,
      totalEntries,
      totalExits,
    };
  }, [personnes, selectedYear, selectedDepartment]);

  const series = useMemo(() => {
    return [
      {
        label: "Présents",
        data: statsComputed.data.map((item) => item.entries),
      },
      {
        label: "Sorties",
        data: statsComputed.data.map((item) => item.exits),
      },
    ];
  }, [statsComputed.data]);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      {/* Header style template */}
      <Stack mb={2}>
        <Typography variant="h6" fontWeight={700}>
          Statistiques
        </Typography>
        {/* <Typography variant="body2" color="text.secondary">
          Filtre par année et département, bar chart (présents/sorties) + répartition globale.
        </Typography> */}
      </Stack>

      {/* Filtres */}
      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardContent>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              select
              label="Année"
              size="small"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              sx={{ width: { xs: "100%", sm: 180 } }}
            >
              <MenuItem value="Global">Global</MenuItem>
              {years.map((y) => (
                <MenuItem key={y} value={String(y)}>
                  {y}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Département"
              size="small"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              sx={{ width: { xs: "100%", sm: 320 } }}
            >
              <MenuItem value="">Tous les départements</MenuItem>
              {departments.map((dept) => (
                <MenuItem key={dept} value={dept}>
                  {dept}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </CardContent>
      </Card>

      {/* Graph Bar */}
      <Card variant="outlined" sx={{ mb: 2 }}>
        <CardContent>
          <Typography fontWeight={700} mb={1}>
            Présents / Sorties
          </Typography>

          {statsComputed.xAxis.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              Aucun résultat pour ces filtres.
            </Typography>
          ) : (
            <Box sx={{ width: "100%", overflowX: "auto" }}>
              <Box sx={{ minWidth: 900 }}>
                <BarChart
                  height={360}
                  xAxis={[{ scaleType: "band", data: statsComputed.xAxis }]}
                  series={series}
                  margin={{ left: 40, right: 20, top: 20, bottom: 70 }}
                />
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Pie */}
      <Card variant="outlined">
        <CardContent>
          <Typography fontWeight={700} mb={1}>
            Répartition globale
          </Typography>

          <PieChart
            series={[
              {
                data: [
                  {
                    value: statsComputed.totalEntries,
                    label: selectedDepartment
                      ? `Présents (${selectedDepartment})`
                      : "Présents (Tous)",
                  },
                  {
                    value: statsComputed.totalExits,
                    label: selectedDepartment
                      ? `Sorties (${selectedDepartment})`
                      : "Sorties (Tous)",
                  },
                ],
                highlightScope: { fade: "global", highlight: "item" },
                faded: { innerRadius: 30, additionalRadius: -30 },
              },
            ]}
            height={320}
          />

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mt={2}>
            <Box sx={{ flex: 1, p: 1.5, borderRadius: 2, bgcolor: "action.hover" }}>
              <Typography variant="caption" color="text.secondary">
                PRÉSENTS
              </Typography>
              <Typography fontWeight={800}>{statsComputed.totalEntries}</Typography>
            </Box>

            <Box sx={{ flex: 1, p: 1.5, borderRadius: 2, bgcolor: "action.hover" }}>
              <Typography variant="caption" color="text.secondary">
                SORTIES
              </Typography>
              <Typography fontWeight={800}>{statsComputed.totalExits}</Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

export default PersonnelStatisticsPage;
