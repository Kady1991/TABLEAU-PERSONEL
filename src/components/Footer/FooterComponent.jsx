import { Box, Stack, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import logo from "../../assets/logo_white.png";

const BUILDINGS = [
  { w: 15, h: 30 }, { w: 20, h: 40 }, { w: 20, h: 30 },
  { w: 20, h: 40 }, { w: 10, h: 30 }, { w: 25, h: 40 },
  { w: 20, h: 30 }, { w: 20, h: 20 }, { w: 10, h: 40 },
];

export default function Footer() {
  const theme    = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const year     = new Date().getFullYear();

  // ── Mobile ───────────────────────────────────────────────────
  if (isMobile) {
    const m = theme.custom.footerMobile;
    return (
      <Box component="footer" sx={m.wrapper}>
        <img src={logo} alt="Logo Uccle" style={m.logo} />
        <Box component="span" sx={m.text}>
          &copy; {year} Commune d&apos;Uccle
        </Box>
      </Box>
    );
  }

  // ── Desktop ──────────────────────────────────────────────────
  const f = theme.custom.footer;
  return (
    <Box component="footer" sx={f.wrapper}>

      {/* Skyline */}
      <Box sx={f.skyline.wrapper}>
        {BUILDINGS.map((b, i) => (
          <Box key={i} sx={{ ...f.skyline.brick, width: b.w, height: b.h }} />
        ))}
      </Box>

      {/* Logo */}
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ flexShrink: 0 }}>
        <Box sx={f.logoBox}>
          <img src={logo} alt="Logo Uccle" style={f.logo} />
        </Box>
      </Stack>

      {/* Copyright */}
      <Box sx={f.copyrightBox}>
        <Box component="span" sx={f.text}>
          &copy; {year} Commune d&apos;Uccle &middot; Tous droits r&eacute;serv&eacute;s
        </Box>
      </Box>

      {/* Mise à jour */}
      <Box sx={f.versionBox}>
        <Box component="span" sx={f.text}>
          Mise &agrave; jour 07/05/{year}
        </Box>
      </Box>
    </Box>
  );
}