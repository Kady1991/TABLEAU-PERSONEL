import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import logo from "../../assets/logo_white.png";

export default function LoadingScreen() {
  const { custom: { loading: t } } = useTheme();

  return (
    <Box sx={t.wrapper}>

      {/* ── Cercles décoratifs ── */}
      {[
        { size: 400, top: -100,  right: -100, teal: false },
        { size: 300, bottom: -80, left: -80,  teal: false },
        { size: 200, top: "50%", left: "50%", teal: true  },
      ].map((c, i) => (
        <Box
          key={i}
          sx={{
            position: "absolute",
            width:  c.size,
            height: c.size,
            borderRadius: "50%",
            border: `1px solid ${c.teal ? t.circle.borderB : t.circle.borderA}`,
            top:       c.top    ?? "auto",
            bottom:    c.bottom ?? "auto",
            left:      c.left   ?? "auto",
            right:     c.right  ?? "auto",
            transform: c.teal ? "translate(-50%,-50%)" : "none",
            pointerEvents: "none",
          }}
        />
      ))}

      {/* ── Logo + titres ── */}
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
        <Box
          component="img"
          src={logo}
          alt="Logo Uccle"
          sx={{
            height: t.logo.height,
            width: "auto",
            objectFit: "contain",
            animation: "pulse 2s ease-in-out infinite",
            "@keyframes pulse": {
              "0%,100%": { transform: "scale(1)",    opacity: 1    },
              "50%":     { transform: "scale(1.05)", opacity: 0.85 },
            },
          }}
        />
        <Box sx={{ textAlign: "center" }}>
          <Box component="p" sx={{ ...t.title, m: 0 }}>
            Gestion du personnel
          </Box>
          <Box component="p" sx={{ ...t.subtitle, m: 0 }}>
            Administration communale d&apos;Uccle
          </Box>
        </Box>
      </Box>

      {/* ── Barre + points ── */}
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1.5 }}>
        <Box sx={t.barTrack}>
          <Box
            sx={{
              ...t.barFill,
              animation: "load 2.4s ease-in-out infinite",
              "@keyframes load": {
                "0%":   { width: "0%",  marginLeft: "0%"   },
                "60%":  { width: "80%", marginLeft: "0%"   },
                "100%": { width: "0%",  marginLeft: "100%" },
              },
            }}
          />
        </Box>

        <Box sx={t.dotsWrapper}>
          {[0, 0.2, 0.4].map((delay, i) => (
            <Box
              key={i}
              sx={{
                ...t.dot,
                animation: "bounce 1.2s ease-in-out infinite",
                animationDelay: `${delay}s`,
                "@keyframes bounce": {
                  "0%,80%,100%": { transform: "scale(0.6)", opacity: 0.4 },
                  "40%":         { transform: "scale(1)",   opacity: 1   },
                },
              }}
            />
          ))}
        </Box>

        <Box component="p" sx={{ ...t.label, m: 0 }}>
          Chargement en cours...
        </Box>
      </Box>
    </Box>
  );
}