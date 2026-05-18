import { Box, Typography } from "@mui/material";
import { keyframes } from "@mui/system";

const rise = keyframes`
  0%,100% { opacity:.2; transform: translateY(6px) scaleY(.92); }
  50%      { opacity:1;  transform: translateY(0)  scaleY(1); }
`;

const blink = keyframes`
  0%,100% { opacity:.3; }
  50%      { opacity:1; }
`;

const badge = keyframes`
  0%,100% { transform: scale(1); }
  50%      { transform: scale(1.18); }
`;

const BLUE = "#5594b1";

const figures = [
  { head: 14, torso: { w: 20, h: 26 }, opacity: 0.75, delay: "0s" },
  { head: 16, torso: { w: 24, h: 34 }, opacity: 0.85, delay: "0.22s" },
  { head: 20, torso: { w: 28, h: 44 }, opacity: 1,    delay: "0.44s", main: true },
  { head: 16, torso: { w: 24, h: 30 }, opacity: 0.85, delay: "0.66s" },
  { head: 14, torso: { w: 20, h: 22 }, opacity: 0.75, delay: "0.88s" },
];

export default function PersonnelLoader() {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        gap: 4,
      }}
    >
      {/* ── Silhouettes ── */}
      <Box sx={{ display: "flex", alignItems: "flex-end", gap: "22px" }}>
        {figures.map((f, i) => (
          <Box
            key={i}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 0,
              position: "relative",
              animation: `${rise} 1.5s ease-in-out infinite`,
              animationDelay: f.delay,
            }}
          >
            {/* Badge sur la personne centrale */}
            {f.main && (
              <Box
                sx={{
                  position: "absolute",
                  top: -22,
                  right: -18,
                  background: "#e0ecf6",
                  borderRadius: "20px",
                  px: "7px",
                  py: "2px",
                  fontSize: 10,
                  fontWeight: 600,
                  color: "#2a6285",
                  whiteSpace: "nowrap",
                  animation: `${badge} 1.5s ease-in-out infinite`,
                  animationDelay: "0.44s",
                }}
              >
                Personnel
              </Box>
            )}

            {/* Tête */}
            <Box
              sx={{
                width: f.head,
                height: f.head,
                borderRadius: "50%",
                bgcolor: BLUE,
                opacity: f.opacity,
                flexShrink: 0,
              }}
            />

            {/* Cou */}
            <Box
              sx={{
                width: 6,
                height: f.main ? 6 : 4,
                bgcolor: BLUE,
                opacity: f.opacity,
              }}
            />

            {/* Corps */}
            <Box
              sx={{
                width: f.torso.w,
                height: f.torso.h,
                bgcolor: BLUE,
                opacity: f.opacity,
                borderRadius: "5px 5px 0 0",
                flexShrink: 0,
              }}
            />
          </Box>
        ))}
      </Box>

      {/* ── Ligne de sol ── */}
      <Box
        sx={{
          width: 220,
          height: "2px",
          background: `linear-gradient(90deg, transparent, ${BLUE} 30%, ${BLUE} 70%, transparent)`,
          borderRadius: "2px",
          opacity: 0.25,
          mt: -4,
        }}
      />

      {/* ── Texte + points ── */}
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
        <Typography
          variant="body2"
          sx={{ fontWeight: 500, color: "text.secondary", letterSpacing: "0.05em" }}
        >
          Chargement du personnel
        </Typography>

        <Box sx={{ display: "flex", gap: "5px" }}>
          {[0, 1, 2].map((i) => (
            <Box
              key={i}
              sx={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                bgcolor: BLUE,
                animation: `${blink} 1.2s ease-in-out infinite`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}