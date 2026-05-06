import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import logo from "../../assets/logo_white.png";

export default function LoadingScreen() {
  const theme = useTheme();
  const PRIMARY = theme.palette.primary.main;
  const TEAL = theme.palette.secondary.main;

  return (
    <Box sx={{
      width: "100vw",
      height: "100vh",
      background: `linear-gradient(160deg, ${PRIMARY} 60%, #02434f 100%)`,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      position: "relative",
      gap: 4,
    }}>

      {/* Cercles décoratifs */}
      {[
        { size: 400, top: -100, right: -100 },
        { size: 300, bottom: -80, left: -80 },
        { size: 200, top: "50%", left: "50%", teal: true },
      ].map((c, i) => (
        <Box key={i} sx={{
          position: "absolute",
          width: c.size,
          height: c.size,
          borderRadius: "50%",
          border: `1px solid ${c.teal ? "rgba(2,178,175,0.1)" : "rgba(255,255,255,0.05)"}`,
          top: c.top ?? "auto",
          bottom: c.bottom ?? "auto",
          left: c.left ?? "auto",
          right: c.right ?? "auto",
          transform: c.teal ? "translate(-50%,-50%)" : "none",
          pointerEvents: "none",
        }} />
      ))}

      {/* Logo + titre */}
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
        <Box
          component="img"
          src={logo}
          alt="Logo Uccle"
          sx={{
            height: 140,
            width: "auto",
            objectFit: "contain",
            animation: "pulse 2s ease-in-out infinite",
            "@keyframes pulse": {
              "0%,100%": { transform: "scale(1)", opacity: 1 },
              "50%": { transform: "scale(1.05)", opacity: 0.85 },
            },
          }}
        />
        <Box sx={{ textAlign: "center" }}>
          <Typography sx={{ fontSize: 22, fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>
            Gestion du personnel
          </Typography>
          <Typography sx={{ fontSize: 13, color: "rgba(255,255,255,0.45)", mt: 0.5 }}>
            Administration communale d&apos;Uccle
          </Typography>
        </Box>
      </Box>

      {/* Barre + points */}
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5 }}>
        <Box sx={{
          width: 220,
          height: 3,
          bgcolor: "rgba(255,255,255,0.1)",
          borderRadius: 99,
          overflow: "hidden",
        }}>
          <Box sx={{
            height: "100%",
            bgcolor: TEAL,
            borderRadius: 99,
            animation: "load 2.4s ease-in-out infinite",
            "@keyframes load": {
              "0%": { width: "0%", marginLeft: "0%" },
              "60%": { width: "80%", marginLeft: "0%" },
              "100%": { width: "0%", marginLeft: "100%" },
            },
          }} />
        </Box>

        <Box sx={{ display: "flex", gap: 0.8 }}>
          {[0, 0.2, 0.4].map((delay, i) => (
            <Box key={i} sx={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              bgcolor: TEAL,
              animation: "bounce 1.2s ease-in-out infinite",
              animationDelay: `${delay}s`,
              "@keyframes bounce": {
                "0%,80%,100%": { transform: "scale(0.6)", opacity: 0.4 },
                "40%": { transform: "scale(1)", opacity: 1 },
              },
            }} />
          ))}
        </Box>

        <Typography sx={{ fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Chargement en cours...
        </Typography>
      </Box>
    </Box>
  );
}