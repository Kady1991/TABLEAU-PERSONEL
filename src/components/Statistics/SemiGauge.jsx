import PropTypes from "prop-types";
import { Box, Typography } from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";

function SemiGauge({ value = 0, color = "#84beb5" }) {
  const v = Math.max(0, Math.min(100, Math.round(value)));

  return (
    <Box sx={{ position: "relative", width: "100%", height: 150 }}>
      <PieChart
        height={250}
        series={[
          {
            startAngle: -90,
            endAngle: 90,
            innerRadius: 65,
            outerRadius: 85,
            data: [
              { value: v, color: color },
              { value: 100 - v, color: "#f1f5f9" },
            ],
          },
        ]}
        slotProps={{ legend: { hidden: true } }}
        margin={{ top: -30, right:10 }}
      />

      <Box
        sx={{
          position: "absolute",
          bottom: 20,
          left: 0,
          right: 0,
          textAlign: "center",
        }}
      >
        <Typography sx={{ fontWeight: 400, fontSize: 20, color: "#334155" }}>
          {v}%
        </Typography>
      </Box>
    </Box>
  );
}

SemiGauge.propTypes = {
  value: PropTypes.number,
  color: PropTypes.string,
};

export default SemiGauge;