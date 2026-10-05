import { createTheme } from "@mui/material/styles";

const PRIMARY_BLUE = "#003B68";
const ICON_TEAL = "#02B2AF";
const RED = "#c0392b";
const BORDER = "rgba(0,0,0,0.08)";
const BORDER_LIGHT = "rgba(0,0,0,0.05)";
const GRAY = "#5c6b7a";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: PRIMARY_BLUE, contrastText: "#ffffff" },
    secondary: { main: ICON_TEAL },
    error: { main: RED },
    background: { default: "#f6f7fb", paper: "#ffffff" },
  },

  shape: { borderRadius: 12 },

  custom: {
    // ── LoadingScreen ──────────────────────────────────────────
    loading: {
      wrapper: {
        width: "100vw",
        height: "100vh",
        background: `linear-gradient(160deg, ${PRIMARY_BLUE} 60%, #02434f 100%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        position: "relative",
        gap: 4,
      },
      circle: {
        borderA: "rgba(255,255,255,0.05)",
        borderB: "rgba(2,178,175,0.1)",
      },
      logo: { height: 140 },
      title: {
        fontSize: 22,
        fontWeight: 700,
        color: "#ffffff",
        lineHeight: 1.2,
      },
      subtitle: { fontSize: 13, color: "rgba(255,255,255,0.45)", mt: 0.5 },
      label: {
        fontSize: 11,
        color: "rgba(255,255,255,0.3)",
        letterSpacing: "0.08em",
        textTransform: "uppercase",
      },
      barTrack: {
        width: 220,
        height: 3,
        bgcolor: "rgba(255,255,255,0.1)",
        borderRadius: 99,
        overflow: "hidden",
      },
      barFill: { height: "100%", bgcolor: ICON_TEAL, borderRadius: 99 },
      dot: { width: 6, height: 6, borderRadius: "50%", bgcolor: ICON_TEAL },
      dotsWrapper: { display: "flex", gap: 0.8 },

      loadingWrapper: {
        height: "calc(100vh - 100px)",
      },

      loadingProgress: {
        color: "primary.main",
      },
    },

    // ── Footer desktop ─────────────────────────────────────────
    footer: {
      wrapper: {
        position: "relative",
        width: "100%",
        height: 50,
        bgcolor: PRIMARY_BLUE,
        borderTop: `2.5px solid ${ICON_TEAL}`,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        px: 3,
        flexShrink: 0,
        mt: "auto",
      },
      skyline: {
        wrapper: {
          position: "absolute",
          bottom: 0,
          right: 0,
          display: "flex",
          alignItems: "flex-end",
          pointerEvents: "none",
          width: 340,
        },
        brick: { flexShrink: 0, mr: "3px", bgcolor: "rgba(255,255,255,0.18)" },
      },
      logo: { width: 60, height: 60, objectFit: "contain" },
      logoBox: {
        width: 60,
        height: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
      text: {
        fontSize: 12,
        color: "rgba(255,255,255,0.73)",
        whiteSpace: "nowrap",
      },
      copyrightBox: { flex: 1, display: "flex", justifyContent: "center" },
      versionBox: { flexShrink: 0, textAlign: "right", zIndex: 1 },
    },

    // ── Footer mobile ──────────────────────────────────────────
    footerMobile: {
      wrapper: {
        width: "100%",
        height: 48,
        bgcolor: "#2f5157",
        borderTop: `2px solid ${ICON_TEAL}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 2,
        flexShrink: 0,
      },
      logo: { height: 28, objectFit: "contain" },
      text: { fontSize: 11, color: "rgba(255,255,255,0.5)" },
    },

    // ── Sidebar / Topbar ───────────────────────────────────────
    sidebarBg: PRIMARY_BLUE,
    topbarBg: PRIMARY_BLUE,

    // ── PersonnelArchivesListPage ──────────────────────────────
    archives: {
      page: { fontFamily: "Roboto, Arial, sans-serif" },
      kpiCard: { borderRadius: "12px", height: "100%" },
      kpiContent: { p: "1rem 1.25rem !important" },
      kpiLabel: { fontSize: 12, fontWeight: 600, color: GRAY, mb: 0.5 },
      kpiValueLong: {
        fontSize: 16,
        fontWeight: 700,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      },
      kpiValueShort: { fontSize: 24, fontWeight: 700 },
      kpiSub: { fontSize: 11, color: GRAY, mt: 0.5 },
      loadingBanner: {
        sx: {
          background: "#e0f7f7",
          borderRadius: "10px",
          border: `1px solid rgba(2,178,175,0.2)`,
        },
      },
      loadingBannerText: { fontSize: 12, color: "#007a78" },
      loadingBannerSpinner: { color: ICON_TEAL },
      gridWrapper: {
        height: "calc(100vh - 320px)",
        bgcolor: "background.paper",
        borderRadius: "12px",
        border: `1px solid ${BORDER}`,
        overflow: "hidden",
      },
      gridSx: {
        border: "none",
        "& .MuiDataGrid-cell": { display: "flex", alignItems: "center" },
        "& .MuiDataGrid-columnHeaders": { borderBottom: `1px solid #d7e1ef` },
        "& .MuiDataGrid-row": { borderBottom: `1px solid #d7e1ef` },
      },
      backButton: {
        borderRadius: "10px",
        fontWeight: 600,
        textTransform: "none",
        color: PRIMARY_BLUE,
        borderColor: "rgba(0,59,104,0.25)",
      },
    },

    // ── PersonnelDetailPage ────────────────────────────────────
    detail: {
      pageWrapper: {
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
      },

      contentWrapper: {
        width: "100%",
        maxWidth: 720,
        mx: "auto",
        flex: 1,
        minHeight: 0,
        overflow: "hidden",
      },

      cardContainer: {
        width: "100%",
        maxHeight: "calc(100vh - 85px)",
        overflow: "hidden",
      },

      heroBanner: {
        bgcolor: "primary.main",
        color: "primary.contrastText",
        px: { xs: 2, sm: 3 },
        py: 2.5,
      },

      heroNameBanner: {
        fontSize: { xs: 18, sm: 22 },
        fontWeight: 600,
        lineHeight: 1.2,
        color: "inherit",
      },

      heroEmailBanner: {
        fontSize: 12,
        mt: 0.5,
        color: "rgba(255,255,255,0.75)",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      },

      avatarHero: {
        width: 64,
        height: 64,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        fontSize: 20,
        fontWeight: 600,
        bgcolor: "background.paper",
        color: "primary.main",
      },

      page: {
        width: "100%",
        maxWidth: 900,
        mx: "auto",
        px: { xs: 1.5, sm: 2.5 },
        py: 2,
      },

      // Navigation

      navigation: {
        direction: "row",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 1.5,
      },

      backBtn: {
        minWidth: 0,
        px: 1,
        fontSize: 13,
        fontWeight: 500,
        color: "primary.main",
        textTransform: "none",
      },

      backIcon: {
        fontSize: 18,
        color: "primary.main",
      },

      refreshBtn: {
        width: 34,
        height: 34,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        bgcolor: "background.paper",
        "&:hover": {
          bgcolor: "action.hover",
        },
      },

      iconSm: {
        fontSize: 18,
        color: "primary.main",
      },

      iconXsm: {
        fontSize: 17,
        color: "primary.main",
      },

      // Carte principale
      card: {
        width: "100%",
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        boxShadow: "0 4px 18px rgba(0,0,0,0.07)",
        overflow: "hidden",
        maxHeight: "calc(100vh - 85px)",
      },

      // En-tête profil
      hero: {
        px: 3,
        py: 2,
        borderBottom: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
      },

      avatar: {
        width: 64,
        height: 64,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        fontSize: 20,
        fontWeight: 600,
      },

      heroName: {
        fontSize: { xs: 17, sm: 20 },
        fontWeight: 600,
        lineHeight: 1.25,
        mb: 0.4,
      },

      heroEmail: {
        fontSize: 12,
        mb: 1,
      },

      chipGrade: {
        height: 24,
        fontSize: 11,
        fontWeight: 500,
      },

      chipFonction: {
        height: 25,
        fontSize: 11,
        fontWeight: 500,
        borderRadius: 1.5,
      },
      chipFonctionHero: {
        height: 25,
        fontSize: 11,
        fontWeight: 500,
        borderRadius: 1.5,
        bgcolor: "rgba(255,255,255,0.15)",
        color: "inherit",
        border: "1px solid rgba(255,255,255,0.25)",
      },

      chipArchiveHero: {
        height: 25,
        fontSize: 11,
        fontWeight: 500,
        borderRadius: 1.5,
        bgcolor: "error.main",
        color: "common.white",
      },

      heroIdBox: {
        textAlign: "right",
        flexShrink: 0,
        display: { xs: "none", sm: "block" },
      },

      heroIdLabel: {
        fontSize: 9,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        color: "rgba(255,255,255,0.6)",
      },

      heroIdValue: {
        fontSize: 15,
        fontWeight: 600,
        color: "common.white",
      },
      sectionCompact: {
        px: 2,
        pt: 1,
        pb: 1,
      
      },

      hierarchySection: {
        px: 3,
        pt: 2,
        pb: 2.5,
      },

      errorAlert: {
        mb: 2,
      },
      chipOutlined: {
        height: 25,
        fontSize: 11,
        fontWeight: 500,
        borderRadius: 1.5,
      },

      idBox: {
        textAlign: "right",
        flexShrink: 0,
        pl: 2,
      },

      idLabel: {
        fontSize: 9,
        color: "text.disabled",
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        mb: 0.3,
      },

      idValue: {
        fontSize: 14,
        fontWeight: 600,
        color: "primary.main",
      },

      // Sections
      section: {
        px: 3,
        pt: 2,
        pb: 1.5,
        borderBottom: "1px solid",
        borderColor: "divider",
      },

      sectionLast: {
        px: 3,
        pt: 2,
        pb: 2.5,
      },

      sectionLabel: {
        fontSize: 10,
        fontWeight: 600,
        color: "primary.main",
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        mb: 1.2,
      },

      // Informations
      infoRow: {
        minHeight: 38,
        py: 0.4,
        borderBottom: "1px solid",
        borderColor: "divider",
        "&:last-child": {
          borderBottom: "none",
        },
      },

      infoIconBox: {
        width: 32,
        height: 32,
        borderRadius: 1.5,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        bgcolor: "rgba(0,59,104,0.07)",
        "& svg": {
          fontSize: 16,
        },
      },

      infoLabel: {
        width: 125,
        flexShrink: 0,
        fontSize: 12,
        color: "text.secondary",
        ml: 1.5,
      },

      infoValue: {
        flex: 1,
        minWidth: 0,
        fontSize: 13,
        color: "text.primary",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
      },

      infoValueAccent: {
        color: "primary.main",
        fontWeight: 500,
      },

      infoValueDanger: {
        color: "error.main",
        fontWeight: 500,
      },

      infoValueMuted: {
        color: "text.disabled",
        fontStyle: "italic",
        fontWeight: 400,
      },

      // Hiérarchie
      hierarchyWrapper: {
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(3, 1fr)",
        },
        gap: 1.5,
      },

      hierarchyCard: {
        flex: 1,
        minWidth: 0,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        px: 1.5,
        py: 1.25,
        bgcolor: "background.paper",
        transition: "border-color 0.2s, box-shadow 0.2s",
        "&:hover": {
          borderColor: "primary.main",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        },
      },

      hierarchyAvatar: {
        width: 36,
        height: 36,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        bgcolor: "rgba(0,59,104,0.07)",
        color: "primary.main",
        fontSize: 11,
        fontWeight: 600,
      },

      hierarchyRole: {
        fontSize: 9,
        color: "text.disabled",
        textTransform: "uppercase",
        letterSpacing: "0.07em",
        mb: 0.3,
      },

      hierarchyName: {
        fontSize: 13,
        fontWeight: 500,
        color: "text.primary",
      },

      // Chargement
      loading: {
        height: "calc(100vh - 100px)",
      },

      loadingIcon: {
        color: "primary.main",
      },
    },

    // ── PersonnelStatisticsPage ─────────────────────────────────
    stats: {
      barColors: {
        present: "#48b4b2",
        depart: RED, // ← était ICON_TEAL, maintenant rouge
      },
      kpiIconBg: "#e0ecf6",
      chipGray: { bgcolor: "#f0f4f8", color: GRAY },
      tableStripe: "rgba(14, 68, 109, 0.03)",
      totalRow: { bgcolor: "#f0f4f8", color: PRIMARY_BLUE },
      trendUp: "#1e8e5a",
      trendDown: RED,
    },
  },

  // ── Typographie ───────────────────────────────────────────────

  // ── Typographie ───────────────────────────────────────────────
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    h1: {
      fontSize: "25px",
      fontWeight: 600,
      color: PRIMARY_BLUE,
      letterSpacing: "-0.5px",
      lineHeight: 1,
      marginBottom: "24px",
    },
    h2: {
      fontSize: "22px",
      fontWeight: 400,
      color: PRIMARY_BLUE,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: "16px",
      fontWeight: 700,
      color: PRIMARY_BLUE,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: "15px",
      fontWeight: 600,
      color: PRIMARY_BLUE,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: "13px",
      fontWeight: 700,
      color: PRIMARY_BLUE,
      textTransform: "uppercase",
      letterSpacing: "0.05em",
      lineHeight: 1.4,
    },
    h6: {
      fontSize: "11px",
      fontWeight: 600,
      color: GRAY,
      textTransform: "uppercase",
      letterSpacing: "0.08em",
      lineHeight: 1.4,
    },
    subtitle1: {
      fontSize: "14px",
      fontWeight: 600,
      color: PRIMARY_BLUE,
      lineHeight: 1.4,
    },
    subtitle2: {
      fontSize: "13px",
      fontWeight: 500,
      color: GRAY,
      lineHeight: 1.4,
    },
    body1: { fontSize: "14px", color: "#374151", lineHeight: 1.6 },
    body2: { fontSize: "13px", color: GRAY, lineHeight: 1.5 },
    caption: { fontSize: "11px", color: "#7b93a8", lineHeight: 1.4 },
    overline: {
      fontSize: "10px",
      fontWeight: 600,
      color: "#7b93a8",
      textTransform: "uppercase",
      letterSpacing: "0.09em",
      lineHeight: 1.4,
    },
    button: { fontSize: "13px", fontWeight: 600, textTransform: "none" },
  },

  components: {
    MuiInputLabel: {
      styleOverrides: {
        root: { fontSize: 13, fontWeight: 600, color: PRIMARY_BLUE },
        asterisk: {
          color: "#d32f2f",
          order: -1,
          marginRight: 4,
          marginLeft: 0,
          fontWeight: 800,
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: { fontSize: 13, fontWeight: 600, color: PRIMARY_BLUE },
      },
    },
    MuiTextField: { defaultProps: { size: "small" } },
    MuiFormControl: { defaultProps: { size: "small" } },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: PRIMARY_BLUE,
          color: "#ffffff",
          backgroundImage: "none",
          "& .MuiSvgIcon-root": { color: "#ffffff" },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#ffffff",
          color: PRIMARY_BLUE,
          borderRight: `1px solid ${BORDER}`,
        },
      },
    },
    MuiListItemText: {
      styleOverrides: { primary: { fontWeight: 600, color: PRIMARY_BLUE } },
    },
    MuiListItemIcon: {
      styleOverrides: { root: { color: ICON_TEAL, minWidth: 36 } },
    },
    MuiSvgIcon: { styleOverrides: { root: { color: ICON_TEAL } } },
    MuiCard: {
      defaultProps: { variant: "outlined" },
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          border: `1px solid ${BORDER}`,
          borderRadius: 12,
          overflow: "hidden",
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: { padding: "16px", "&:last-child": { paddingBottom: "16px" } },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          padding: "10px 16px",
          borderBottom: `1px solid rgba(0,0,0,0.07)`,
        },
        title: { fontSize: "15px", fontWeight: 600, color: PRIMARY_BLUE },
        action: { margin: 0, alignSelf: "center" },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          height: 22,
          fontSize: 12,
          fontWeight: 600,
          borderRadius: "99px",
        },
        colorSuccess: { backgroundColor: "#e0f7f7", color: "#007a78" },
        colorError: { backgroundColor: "#fdecea", color: RED },
        colorPrimary: { backgroundColor: "#e0ecf6", color: PRIMARY_BLUE },
        colorSecondary: { backgroundColor: "#e0f7f7", color: "#007a78" },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { textTransform: "none", borderRadius: 10, fontWeight: 600 },
      },
    },
    MuiTableHead: {
      styleOverrides: { root: { backgroundColor: "rgba(0,59,104,0.03)" } },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&.MuiTableRow-hover:hover, &:hover": {
            backgroundColor: "rgba(0,59,104,0.03)",
          },
          "&:last-child td": { borderBottom: "none" },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontSize: 11,
          fontWeight: 700,
          color: PRIMARY_BLUE,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          paddingTop: 8,
          paddingBottom: 8,
          borderBottomColor: BORDER,
        },
        body: {
          fontSize: 13,
          paddingTop: 8,
          paddingBottom: 8,
          borderBottomColor: BORDER_LIGHT,
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: { root: { fontWeight: 800, color: PRIMARY_BLUE } },
    },
  },
});

export default theme;
