import { Box, Stack, Typography } from "@mui/material";
import { growBar, drawLine, fadeIn, drawDonut } from "./HomeAnimations";
import PropTypes from "prop-types";

// ── Sparkline ─────────────────────────────────────────────────────────────────
export function Sparkline({ data, color, width = 110, height = 40 }) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => [
    (i / (data.length - 1)) * width,
    height - 4 - ((v - min) / range) * (height - 8),
  ]);
  const line = pts.map((p) => p.join(",")).join(" ");
  const area = `0,${height} ${line} ${width},${height}`;
  const id = `spark-${color.replace("#", "")}`;
  return (
    <svg width={width} height={height} style={{ display: "block" }}>
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <Box
        component="polygon"
        points={area}
        fill={`url(#${id})`}
        sx={{ animation: `${fadeIn} 0.8s ease 0.6s both` }}
      />
      <Box
        component="polyline"
        points={line}
        fill="none"
        stroke={color}
        strokeWidth="1.6"
        strokeLinejoin="round"
        strokeLinecap="round"
        pathLength={1}
        sx={{
          strokeDasharray: 1,
          animation: `${drawLine} 1.1s ease-out 0.3s both`,
        }}
      />
    </svg>
  );
}
Sparkline.propTypes = {
  data: PropTypes.arrayOf(PropTypes.number),
  color: PropTypes.string.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
};

// ── Donut ─────────────────────────────────────────────────────────────────────
export function Donut({ actifs, archives, colorA, colorB }) {
  const total = actifs + archives;
  const size = 200;
  const stroke = 38;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pctA = total ? actifs / total : 0;
  const pctB = total ? archives / total : 0;
  return (
    <Box sx={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#eef1f5" strokeWidth={stroke} />
        <Box
          component="circle"
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={colorA}
          strokeWidth={stroke}
          strokeDasharray={`${c * pctA} ${c}`}
          sx={{ animation: `${drawDonut} 1s ease-out 0.4s both` }}
        />
        <Box
          component="circle"
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={colorB}
          strokeWidth={stroke}
          strokeDasharray={`${c * pctB} ${c}`}
          strokeDashoffset={-c * pctA}
          sx={{ animation: `${drawDonut} 0.8s ease-out 1.2s both` }}
        />
      </svg>
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{ position: "absolute", inset: 0 }}
      >
        <Typography variant="h3" sx={{ fontWeight: 700 }}>
          {total.toLocaleString("fr-BE")}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          personnes
        </Typography>
      </Stack>
    </Box>
  );
}
Donut.propTypes = {
  actifs: PropTypes.number.isRequired,
  archives: PropTypes.number.isRequired,
  colorA: PropTypes.string.isRequired,
  colorB: PropTypes.string.isRequired,
};

// ── Graphique en barres (actifs / archivés par mois) ──────────────────────────
export function EffectifsBarChart({ data, chartMax, colorA, colorB }) {
  return (
    <>
      <Box sx={{ display: "flex", height: 240 }}>
        {/* Axe Y */}
        <Stack justifyContent="space-between" sx={{ pr: 1, pb: 3.5 }}>
          {[4, 3, 2, 1, 0].map((k) => (
            <Typography key={k} variant="caption" color="text.secondary">
              {Math.round((chartMax / 4) * k).toLocaleString("fr-BE")}
            </Typography>
          ))}
        </Stack>

        {/* Barres */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "stretch",
            borderBottom: "1px solid rgba(0,0,0,0.12)",
            backgroundImage: "linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px)",
            backgroundSize: "100% 25%",
            mb: 3.5,
            position: "relative",
          }}
        >
          {data.map((s, si) => (
            <Box
              key={s.label}
              sx={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-end",
                gap: 0.5,
                position: "relative",
              }}
            >
              {[
                { v: s.actifs, c: colorA },
                { v: s.archives, c: colorB },
              ].map((bar, idx) => (
                <Box
                  key={idx}
                  sx={{
                    width: { xs: 14, md: 36 },
                    height: `${(bar.v / chartMax) * 100}%`,
                    background: bar.c,
                    borderRadius: "2px 2px 0 0",
                    position: "relative",
                    transformOrigin: "bottom",
                    animation: `${growBar} 0.8s cubic-bezier(0.22, 1, 0.36, 1) ${
                      0.4 + si * 0.1 + idx * 0.05
                    }s both`,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      position: "absolute",
                      top: -18,
                      left: "50%",
                      transform: "translateX(-50%)",
                      fontWeight: 700,
                      fontSize: 11,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {bar.v.toLocaleString("fr-BE")}
                  </Typography>
                </Box>
              ))}
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  position: "absolute",
                  bottom: -24,
                  whiteSpace: "nowrap",
                  textTransform: "capitalize",
                }}
              >
                {s.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Légende */}
      <Stack direction="row" spacing={3} justifyContent="center">
        {[
          { l: "Actifs", c: colorA },
          { l: "Archivés", c: colorB },
        ].map((x) => (
          <Stack key={x.l} direction="row" spacing={1} alignItems="center">
            <Box sx={{ width: 10, height: 10, borderRadius: "50%", background: x.c }} />
            <Typography variant="caption">{x.l}</Typography>
          </Stack>
        ))}
      </Stack>
    </>
  );
}
EffectifsBarChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      actifs: PropTypes.number.isRequired,
      archives: PropTypes.number.isRequired,
    }),
  ).isRequired,
  chartMax: PropTypes.number.isRequired,
  colorA: PropTypes.string.isRequired,
  colorB: PropTypes.string.isRequired,
};