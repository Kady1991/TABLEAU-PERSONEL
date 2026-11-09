import { Box, Typography } from "@mui/material";
import logo from "../../assets/logo_white.png";

const BUILDINGS = [
  { w: 15, h: 30 }, { w: 20, h: 40 }, { w: 20, h: 30 },
  { w: 20, h: 40 }, { w: 10, h: 30 }, { w: 25, h: 40 },
  { w: 20, h: 30 }, { w: 20, h: 20 }, { w: 10, h: 40 },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        position: "relative",
        width: "100%",
        height: { xs: 48, md: 50 },
        bgcolor: "primary.main",
        borderTop: "2.5px solid",
        borderColor: "secondary.main",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        px: { xs: 2, md: 3 },
        flexShrink: 0,
        mt: "auto",
      }}
    >
      {/* Skyline (desktop uniquement) */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          position: "absolute",
          bottom: 0,
          right: 0,
          alignItems: "flex-end",
          pointerEvents: "none",
          width: 340,
        }}
      >
        {BUILDINGS.map((b, i) => (
          <Box
            key={i}
            sx={{ width: b.w, height: b.h, mr: "3px", flexShrink: 0, bgcolor: "common.white", opacity: 0.18 }}
          />
        ))}
      </Box>

      {/* Logo */}
      <Box
        component="img"
        src={logo}
        alt="Logo Uccle"
        sx={{ height: { xs: 28, md: 60 }, objectFit: "contain", flexShrink: 0 }}
      />

      {/* Copyright */}
      <Box sx={{ flex: 1, display: "flex", justifyContent: { xs: "flex-end", md: "center" } }}>
        <Typography variant="caption" sx={{ color: "common.white", opacity: 0.75, whiteSpace: "nowrap" }}>
          &copy; {year} Commune d&apos;Uccle
          <Box component="span" sx={{ display: { xs: "none", md: "inline" } }}>
            {" "}&middot; Tous droits r&eacute;serv&eacute;s
          </Box>
        </Typography>
      </Box>
    </Box>
  );
}