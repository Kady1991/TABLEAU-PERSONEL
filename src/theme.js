import { createTheme, alpha } from "@mui/material/styles";

// ═══════════════════════════════════════════════════════════════
// 1. PALETTE UNIQUE : toutes les couleurs de l'app, une seule fois.
// ═══════════════════════════════════════════════════════════════
const C = {
  blue: "#053a63",
  blueSoft: "#e0ecf6",
  teal: "#02B2AF",
  tealMid: "#48b4b2",
  tealSoft: "#e0f7f7",
  tealDark: "#007a78",
  red: "#c0392b",
  redMid: "#ee6a6a",
  redSoft: "#fdecea",
  orange: "#f57c00",
  orangeSoft: "#fff3e0",
  orangeDark: "#e65100",
  green: "#10b160",
  white: "#ffffff",
  text: "#374151",
  textMuted: "#5c6b7a",
  textFaint: "#7b93a8",
  line: "rgba(0,0,0,0.08)",
  surface: "#F4F7FA",
  background: "#f6f7fb",
};

const theme = createTheme({
  // ═════════════════════════════════════════════════════════════
  // 2. COULEURS PAR NOM
  // ═════════════════════════════════════════════════════════════
  palette: {
    mode: "light",
    primary: { main: C.blue, light: C.blueSoft, contrastText: C.white },
    secondary: { main: C.teal, light: C.tealSoft, dark: C.tealDark },
    error: { main: C.red, light: C.redSoft },
    warning: { main: C.orange, light: C.orangeSoft, dark: C.orangeDark },
    success: { main: C.green },
    text: { primary: C.text, secondary: C.textMuted, disabled: C.textFaint },
    divider: C.line,
    background: { default: C.background, paper: C.white },
  },

  shape: { borderRadius: 12 },

  // ═════════════════════════════════════════════════════════════
  // 3. TYPOGRAPHIE : 1 style par rôle
  //    h1 titre de page · h2 grand titre · h3 titre de carte
  //    h4 sous-titre de carte · h5 intitulé en majuscules
  //    h6 petit label grisé · subtitle1/2 · body1/2 · caption · overline
  // ═════════════════════════════════════════════════════════════
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    h1: {
      fontSize: "25px",
      fontWeight: 600,
      color: C.blue,
      letterSpacing: "-0.5px",
      lineHeight: 1,
      marginBottom: "24px",
    },
    h2: { fontSize: "22px", fontWeight: 600, color: C.blue, lineHeight: 1.2 },
    h3: { fontSize: "16px", fontWeight: 700, color: C.blue, lineHeight: 1.4 },
    h4: { fontSize: "15px", fontWeight: 600, color: C.blue, lineHeight: 1.4 },
    h5: {
      fontSize: "13px",
      fontWeight: 700,
      color: C.blue,
      textTransform: "uppercase",
      letterSpacing: "0.05em",
      lineHeight: 1.4,
    },
    h6: {
      fontSize: "11px",
      fontWeight: 600,
      color: C.textMuted,
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      lineHeight: 1.4,
    },
    subtitle1: { fontSize: "14px", fontWeight: 600, color: C.blue, lineHeight: 1.4 },
    subtitle2: { fontSize: "13px", fontWeight: 500, color: C.textMuted, lineHeight: 1.4 },
    body1: { fontSize: "14px", color: C.text, lineHeight: 1.6 },
    body2: { fontSize: "13px", color: C.textMuted, lineHeight: 1.5 },
    caption: { fontSize: "11px", color: C.textFaint, lineHeight: 1.4 },
    overline: {
      fontSize: "10px",
      fontWeight: 600,
      color: C.textFaint,
      textTransform: "uppercase",
      letterSpacing: "0.09em",
      lineHeight: 1.4,
    },
    button: { fontSize: "13px", fontWeight: 600, textTransform: "none" },
  },

  // ═════════════════════════════════════════════════════════════
  // 4. COMPOSANTS : style par défaut de chaque composant MUI
  // ═════════════════════════════════════════════════════════════
  components: {
    // ── Formulaires ──────────────────────────────────────────
    MuiTextField: { defaultProps: { size: "small" } },
    MuiFormControl: { defaultProps: { size: "small" } },
    MuiFormLabel: {
      styleOverrides: {
        root: { fontSize: 13, fontWeight: 600, color: C.blue },
        asterisk: ({ theme }) => ({
          color: theme.palette.error.main,
          fontWeight: 800,
        }),
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        asterisk: { order: -1, marginRight: 4, marginLeft: 0 },
      },
    },

    // ── Navigation ───────────────────────────────────────────
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: C.blue,
          color: C.white,
          backgroundImage: "none",
          "& .MuiSvgIcon-root": { color: C.white },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: ({ theme }) => ({
          color: C.blue,
          borderRight: `1px solid ${theme.palette.divider}`,
        }),
      },
    },
    MuiListItemText: {
      styleOverrides: { primary: { fontWeight: 600, color: C.blue } },
    },
    MuiListItemIcon: {
      styleOverrides: { root: { color: C.teal, minWidth: 36 } },
    },

    // ── Icônes : turquoise par défaut (color="inherit" / "primary" pour changer)
    MuiSvgIcon: { defaultProps: { color: "secondary" } },

    // ── Cartes ───────────────────────────────────────────────
    MuiCard: {
      defaultProps: { variant: "outlined" },
      styleOverrides: { root: { overflow: "hidden" } },
    },
    MuiCardContent: {
      styleOverrides: {
        root: { padding: 16, "&:last-child": { paddingBottom: 16 } },
      },
    },
    MuiCardHeader: {
      defaultProps: { titleTypographyProps: { variant: "h4" } },
      styleOverrides: {
        root: ({ theme }) => ({
          padding: "10px 16px",
          borderBottom: `1px solid ${theme.palette.divider}`,
        }),
        action: { margin: 0, alignSelf: "center" },
      },
    },

    // ── Chips ────────────────────────────────────────────────
    MuiChip: {
      styleOverrides: {
        root: { height: 22, fontSize: 12, fontWeight: 600, borderRadius: 99 },
        colorPrimary: ({ theme }) => ({
          backgroundColor: theme.palette.primary.light,
          color: theme.palette.primary.main,
        }),
        colorSecondary: ({ theme }) => ({
          backgroundColor: theme.palette.secondary.light,
          color: theme.palette.secondary.dark,
        }),
        colorSuccess: ({ theme }) => ({
          backgroundColor: theme.palette.secondary.light,
          color: theme.palette.secondary.dark,
        }),
        colorError: ({ theme }) => ({
          backgroundColor: theme.palette.error.light,
          color: theme.palette.error.main,
        }),
        colorWarning: ({ theme }) => ({
          backgroundColor: theme.palette.warning.light,
          color: theme.palette.warning.dark,
        }),
      },
    },

    // ── Avatars ──────────────────────────────────────────────
    MuiAvatar: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.primary.light,
          color: theme.palette.primary.main,
          fontWeight: 600,
        }),
      },
    },

    // ── Boutons ──────────────────────────────────────────────
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { borderRadius: 10 } },
    },

    // ── Tooltips ─────────────────────────────────────────────
    MuiTooltip: {
      styleOverrides: {
        tooltip: { backgroundColor: C.blue, fontSize: 12, fontWeight: 500 },
        arrow: { color: C.blue },
      },
    },

    // ── Dialogues ────────────────────────────────────────────
    MuiDialogTitle: {
      styleOverrides: { root: { fontWeight: 800, color: C.blue } },
    },

    // ── Tableaux classiques ──────────────────────────────────
    MuiTableHead: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: alpha(theme.palette.primary.main, 0.03),
        }),
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: ({ theme }) => ({
          "&.MuiTableRow-hover:hover, &:hover": {
            backgroundColor: alpha(theme.palette.primary.main, 0.03),
          },
          "&:last-child td": { borderBottom: "none" },
        }),
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: ({ theme }) => ({
          fontSize: 11,
          fontWeight: 700,
          color: C.blue,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          paddingTop: 8,
          paddingBottom: 8,
          borderBottomColor: theme.palette.divider,
        }),
        body: ({ theme }) => ({
          fontSize: 13,
          paddingTop: 8,
          paddingBottom: 8,
          borderBottomColor: theme.palette.divider,
        }),
      },
    },

    // ── DataGrid (liste du personnel, archives…) ─────────────
    MuiDataGrid: {
      styleOverrides: {
        root: ({ theme }) => ({
          border: "none",
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: C.surface,
            borderBottom: `1px solid ${theme.palette.divider}`,
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.04em",
            color: theme.palette.text.primary,
          },
          "& .MuiDataGrid-cell": { display: "flex", alignItems: "center" },
          "& .MuiDataGrid-row": {
            borderBottom: `1px solid ${theme.palette.divider}`,
          },
          "& .MuiDataGrid-row.Mui-selected": {
            backgroundColor: alpha(theme.palette.secondary.main, 0.06),
          },
        }),
      },
    },
  },

  // ═════════════════════════════════════════════════════════════
  // 5. CUSTOM : ce qui n'existe pas dans MUI
  // ═════════════════════════════════════════════════════════════
  custom: {
    // Couleurs des graphiques
    chart: {
      actif: C.blue,
      actifSoft: C.tealMid,
      entree: C.teal,
      depart: C.orange,
      archive: C.red,
      archiveSoft: C.redMid,
    },

    // Rond coloré + icône blanche

        // Page d'accueil
    home: {
      quickTile: (color) => ({
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        p: 1.5,
        borderRadius: 2,
        backgroundColor: alpha(color, 0.2),
        cursor: "pointer",
        transition: "transform 0.15s",
        "&:hover": { transform: "translateY(-2px)" },
      }),
    },
    iconCircle: (size, color) => ({
      width: size,
      height: size,
      borderRadius: "50%",
      backgroundColor: color,
      color: C.white,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
      "& .MuiSvgIcon-root": { color: "inherit" },
    }),

    // ── Page « Personnels archivés » ─────────────────────────
    archives: {
      header: {
        wrapper: {
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 1.5,
          mb: 2.5,
        },
        title: { mb: 0.5 },
        backButton: {
          height: 44,
          px: 2.25,
          color: "primary.main",
          borderColor: "divider",
          bgcolor: "background.paper",
        },
      },

      
      statsRow: { flexWrap: "wrap", gap: 2, mb: 2.5 },
      statCard: {
        root: {
          flex: "1 1 260px",
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: "12px",
          px: 2.25,
          py: 1.75,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1.5,
          minWidth: 0,
        },
        body: { minWidth: 0 },
        label: { fontSize: 13, color: "text.secondary" },
        value: (clickable) => ({
          m: 0,
          p: 0,
          border: 0,
          background: "none",
          textAlign: "left",
          maxWidth: "100%",
          fontFamily: "inherit",
          fontSize: clickable ? 18 : 28,
          fontWeight: 700,
          lineHeight: 1.2,
          color: "error.main",
          cursor: clickable ? "pointer" : "default",
          "&:hover": clickable ? { textDecoration: "underline" } : undefined,
        }),
        sub: { fontSize: 12, color: "text.secondary", textAlign: "right" },
      },

      loadingBanner: {
        wrapper: {
          mb: 1.5,
          px: 2,
          py: 0.8,
          bgcolor: "secondary.light",
          borderRadius: "10px",
          border: "1px solid",
          borderColor: (theme) => alpha(theme.palette.secondary.main, 0.2),
        },
        dot: (index) => ({
          width: 5,
          height: 5,
          borderRadius: "50%",
          bgcolor: "error.main",
          "@keyframes blink": {
            "0%,100%": { opacity: 0.3 },
            "50%": { opacity: 1 },
          },
          animation: "blink 1.2s ease-in-out infinite",
          animationDelay: `${index * 0.2}s`,
        }),
        text: { fontSize: 12, color: "success.main" },
      },

      bulkBar: {
        wrapper: {
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1.5,
          px: 2.25,
          py: 1.25,
          bgcolor: "secondary.light",
          borderBottom: "1px solid",
          borderColor: (theme) => alpha(theme.palette.secondary.main, 0.3),
        },
        label: { fontSize: 14, fontWeight: 600, color: "primary.main" },
        buttons: { flexWrap: "wrap", gap: 1 },
        exportButton: {
          height: 44,
          color: "primary.main",
          borderColor: "primary.main",
          bgcolor: "background.paper",
        },
        clearButton: {
          height: 44,
          color: "primary.main",
          textDecoration: "underline",
        },
      },

      gridWrapper: { height: "calc(100vh - 360px)", bgcolor: "background.paper", minHeight: 520 },

      viewButton: {
        borderRadius: "8px",
        color: "primary.main",
        borderColor: "divider",
      },

      toolbar: {
        container: {
          flexDirection: "column",
          alignItems: "stretch",
          gap: 1.5,
          p: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
        },
        topRow: { flexWrap: "wrap", alignItems: "center", gap: 1.5 },
        search: { flex: "1 1 280px" },
        searchInput: { height: 44, borderRadius: "10px", fontSize: 14 },
        searchIcon: { color: "text.secondary" },
        buttons: { flexWrap: "wrap", gap: 1 },
        button: {
          height: 44,
          px: 1.75,
          color: "primary.main",
          border: "1px solid",
          borderColor: "divider",
        },
        filterRow: { flexWrap: "wrap", alignItems: "center", gap: 1.25 },
        filterLabel: { fontSize: 13, fontWeight: 600, color: "text.secondary" },
        select: {
          minWidth: 170,
          height: 44,
          borderRadius: "10px",
          fontSize: 14,
          bgcolor: "background.paper",
        },
        resetButton: {
          height: 44,
          color: "success.main",
          textDecoration: "underline",
        },
      },
    },


        // ── Page « Détail personnel » ────────────────────────────
    detail: {
      pageWrapper: { width: "100%" },
      contentWrapper: { maxWidth: 860, mx: "auto" },
      navigation: { mb: 2 },
      backIcon: { color: "inherit" },
      backBtn: { color: "primary.main", borderRadius: "8px" },
      refreshBtn: {
        color: "primary.main",
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
      },
      loadingWrapper: { py: 8 },
      loadingProgress: { color: "secondary.main" },
      errorAlert: { mb: 2 },

      card: {
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: "12px",
        overflow: "hidden",
      },

      // Bandeau du haut
      heroBanner: { bgcolor: "primary.main", p: 3 },
      avatarHero: {
        width: 64,
        height: 64,
        borderRadius: "50%",
        bgcolor: "secondary.main",
        color: "common.white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 22,
        fontWeight: 700,
        flexShrink: 0,
      },
      heroNameBanner: {
        fontSize: 22,
        fontWeight: 700,
        color: "common.white",
        lineHeight: 1.2,
      },
      heroEmailBanner: { fontSize: 13, color: "rgba(255,255,255,0.75)", mt: 0.5 },
      chipFonctionHero: { bgcolor: "secondary.main", color: "common.white" },
      chipArchiveHero: { bgcolor: "error.light", color: "error.main" },
      heroIdBox: {
        textAlign: "right",
        px: 1.5,
        py: 0.75,
        borderRadius: "10px",
        bgcolor: "rgba(255,255,255,0.12)",
      },
      heroIdLabel: {
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: "0.09em",
        color: "rgba(255,255,255,0.65)",
      },
      heroIdValue: { fontSize: 18, fontWeight: 700, color: "common.white" },

      // Sections
      sectionCompact: {
        px: 3,
        py: 2,
        borderBottom: "1px solid",
        borderColor: "divider",
      },
      sectionLabel: {
        fontSize: 11,
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        mb: 1,
      },
      infoRow: {
        py: 1,
        borderBottom: "1px dashed",
        borderColor: "divider",
        "&:last-child": { borderBottom: "none" },
      },
      infoIconBox: {
        width: 32,
        display: "flex",
        alignItems: "center",
        flexShrink: 0,
        "& .MuiSvgIcon-root": { fontSize: 20 },
      },
      infoLabel: { width: 140, flexShrink: 0, fontSize: 13, color: "text.secondary" },
      infoValue: { fontSize: 14, fontWeight: 500, color: "text.primary", minWidth: 0 },
      infoValueAccent: { fontSize: 14, fontWeight: 600, color: "primary.main", minWidth: 0 },
      infoValueDanger: { fontSize: 14, fontWeight: 600, color: "error.main", minWidth: 0 },
      infoValueMuted: {
        fontSize: 14,
        fontStyle: "italic",
        color: "text.disabled",
        minWidth: 0,
      },

      // Hiérarchie
      hierarchySection: { px: 3, py: 2 },
      hierarchyWrapper: {
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
        gap: 1.5,
      },
      hierarchyCard: {
        gap: 1.5,
        p: 1.5,
        borderRadius: "10px",
        bgcolor: "background.default",
        border: "1px solid",
        borderColor: "divider",
      },
      hierarchyAvatar: {
        width: 36,
        height: 36,
        borderRadius: "50%",
        bgcolor: "primary.light",
        color: "primary.main",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 13,
        fontWeight: 700,
        flexShrink: 0,
      },
      hierarchyRole: {
        fontSize: 10,
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        color: "text.disabled",
      },
      hierarchyName: { fontSize: 14, fontWeight: 600, color: "primary.main" },
    },
  },
});

export default theme;