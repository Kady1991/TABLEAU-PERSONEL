import PropTypes from "prop-types";
import { Box, Card, CardContent, Divider, Stack, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import SemiGauge from "./SemiGauge";

const COLORS = {
  grisBleu: "#abbdc2",
  vertEau: "#84beb5",
  bleuOcean: "#5594b1",
};

function padToLength(arr, length) {
  const safe = Array.isArray(arr) ? arr : [];
  const out = safe.map((v) => Number(v ?? 0));
  while (out.length < length) out.push(0);
  return out.slice(0, length);
}

function StatisticsCharts({
  statsComputed,
  series,
  currentTitle,
  currentSubtitle = "",
  hideBarChart = false,
  mode = "global",
}) {
  const xAxis = Array.isArray(statsComputed?.xAxis) ? statsComputed.xAxis : [];
  const totalEntries = Number(statsComputed?.totalEntries ?? 0);
  const totalExits = Number(statsComputed?.totalExits ?? 0);

  const total = totalEntries + totalExits;
  const presenceRate = total ? Math.round((totalEntries / total) * 100) : 0;
  const exitRate = total ? Math.round((totalExits / total) * 100) : 0;

  const helperText =
    mode === "global"
      ? "Vue globale par département"
      : mode === "Département"
      ? "Détail par service (dans ce département)"
      : "Détail du service sélectionné";

  const isServiceMode = Boolean(currentSubtitle);
  const serviceCenterText = `Service ${currentTitle} du département ${currentSubtitle}`;

  const canRenderBar =
    !hideBarChart &&
    xAxis.length > 0 &&
    Array.isArray(series) &&
    series.length >= 2;

  // ✅ sécurise les data pour éviter le crash x-charts
  const actifsData = padToLength(series?.[0]?.data, xAxis.length);
  const sortiesData = padToLength(series?.[1]?.data, xAxis.length);

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", lg: "3fr 1fr" },
        gap: 3,
      }}
    >
      {/* COLONNE GAUCHE */}
      <Box>
        <Box sx={{ mb: 4}}>
          <Typography variant="h2" sx={{ fontWeight: 700, color: "#0f172a" }}>
            {currentTitle }
          </Typography>

          {currentSubtitle ? (
            <Typography sx={{ color: "#64748b", mt: 0.5 }}>
              Département : <b>{currentSubtitle}</b>
            </Typography>
          ) : (
            <Typography sx={{ color: "#64748b", mt: 0.5 }}>{helperText}</Typography>
          )}
        </Box>

        {canRenderBar && (
          <Card
            sx={{
              borderRadius: 2,
              boxShadow: "0 10px 25px rgba(0,0,0,0.03)",
              border: "none",
              mb: 3,
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  color: "#5594b1",
                  fontSize: "1.3rem",
                }}
              >
                Mouvements (Actifs / Sorties)
              </Typography>

              <Box sx={{ width: "100%", overflowX: "auto" }}>
                <BarChart
                  height={260}
                  xAxis={[{ scaleType: "band", data: xAxis }]}
                  series={[
                    { data: actifsData, label: "Actifs", color: COLORS.bleuOcean },
                    { data: sortiesData, label: "Sorties", color: COLORS.vertEau },
                  ]}
                  margin={{ left: 30, right: 30, top: 30, bottom: 50 }}
                  slotProps={{ legend: { hidden: false } }}
                />
              </Box>
            </CardContent>
          </Card>
        )}

        {/* JAUGES */}
        <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
          <Card sx={{ flex: 1, borderRadius: 2, border: "none", boxShadow: "0 4px 15px rgba(0,0,0,0.02)" }}>
            <CardContent>
              <Typography textAlign="center" sx={{ fontWeight: 800, mb: 1, color: "#64748b" }}>
                Taux de présence
              </Typography>
              <SemiGauge value={presenceRate} color={COLORS.vertEau} />
            </CardContent>
          </Card>

          <Card sx={{ flex: 1, borderRadius: 2, border: "none", boxShadow: "0 4px 15px rgba(0,0,0,0.02)" }}>
            <CardContent>
              <Typography textAlign="center" sx={{ fontWeight: 800, mb: 1, color: "#64748b" }}>
                Taux de sorties
              </Typography>
              <SemiGauge value={exitRate} color={COLORS.grisBleu} />
            </CardContent>
          </Card>
        </Stack>
      </Box>

      {/* COLONNE DROITE */}
      <Card sx={{ borderRadius: 2, height: 600,marginTop:10, border: "none", boxShadow: "0 10px 25px rgba(0,0,0,0.03)" }}>
        <CardContent sx={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
<Box
  sx={{
    width: "100%",
    height: 400, // Aligné sur la hauteur du graphique
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }}
>
  <PieChart
    width={300}
    height={400}
    // Supprime les marges par défaut qui décalent le dessin
    margin={{ top: 0, bottom: 0, left: 0, right: 0 }}
    series={[
      {
        innerRadius: 80,
        outerRadius: 110,
        paddingAngle: 4,
        // cx et cy positionnent le centre du cercle par rapport au SVG
        cx: "50%", 
        cy: "50%",
        data: [
          { value: totalEntries, color: COLORS.bleuOcean, label: "Actifs" },
          { value: totalExits, color: COLORS.vertEau, label: "Sorties" },
        ],
      },
    ]}
    slotProps={{ legend: { hidden: true } }}
  />
</Box>

          <Typography variant="h3" sx={{ fontWeight: 900, mt: 1, mb: 0.5 }}>
            Répartition
          </Typography>

          <Typography
            sx={{
              color: "#64748b",
              mb: 2,
              textAlign: "center",
              maxWidth: 340,
              mx: "auto",
              fontWeight: 600,
              lineHeight: 1.35,
            }}
          >
            {isServiceMode ? serviceCenterText : currentTitle}
          </Typography>

          <Stack spacing={2} sx={{ px: 4, width: "100%" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography color="text.secondary">Personnel total actifs</Typography>
              <Typography sx={{ fontWeight: 600 }}>{totalEntries}</Typography>
            </Box>

            <Divider />

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography color="text.secondary">Personnel total archivés</Typography>
              <Typography sx={{ fontWeight: 600 }}>{totalExits}</Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

StatisticsCharts.propTypes = {
  statsComputed: PropTypes.shape({
    xAxis: PropTypes.array,
    data: PropTypes.array,
    totalEntries: PropTypes.number,
    totalExits: PropTypes.number,
  }),
  series: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      data: PropTypes.array,
    })
  ),
  currentTitle: PropTypes.string,
  currentSubtitle: PropTypes.string,
  hideBarChart: PropTypes.bool,
  mode: PropTypes.string,
};

export default StatisticsCharts;