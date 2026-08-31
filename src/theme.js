import { createTheme } from "@mui/material/styles";

const PRIMARY_BLUE = "#003B68";
const ICON_TEAL    = "#02B2AF";
const RED          = "#c0392b";
const BORDER       = "rgba(0,0,0,0.08)";
const BORDER_LIGHT = "rgba(0,0,0,0.05)";
const GRAY         = "#5c6b7a";

const theme = createTheme({
  palette: {
    mode: "light",
    primary:    { main: PRIMARY_BLUE, contrastText: "#ffffff" },
    secondary:  { main: ICON_TEAL },
    error:      { main: RED },
    background: { default: "#f6f7fb", paper: "#ffffff" },
  },

  shape: { borderRadius: 12 },

  custom: {

    // ── LoadingScreen ──────────────────────────────────────────
    loading: {
      wrapper: {
        width: "100vw", height: "100vh",
        background: `linear-gradient(160deg, ${PRIMARY_BLUE} 60%, #02434f 100%)`,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        overflow: "hidden", position: "relative", gap: 4,
      },
      circle:     { borderA: "rgba(255,255,255,0.05)", borderB: "rgba(2,178,175,0.1)" },
      logo:       { height: 140 },
      title:      { fontSize: 22, fontWeight: 700, color: "#ffffff", lineHeight: 1.2 },
      subtitle:   { fontSize: 13, color: "rgba(255,255,255,0.45)", mt: 0.5 },
      label:      { fontSize: 11, color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em", textTransform: "uppercase" },
      barTrack:   { width: 220, height: 3, bgcolor: "rgba(255,255,255,0.1)", borderRadius: 99, overflow: "hidden" },
      barFill:    { height: "100%", bgcolor: ICON_TEAL, borderRadius: 99 },
      dot:        { width: 6, height: 6, borderRadius: "50%", bgcolor: ICON_TEAL },
      dotsWrapper:{ display: "flex", gap: 0.8 },
    },

    // ── Footer desktop ─────────────────────────────────────────
    footer: {
      wrapper: {
        position: "relative", width: "100%", height: 50,
        bgcolor: PRIMARY_BLUE, borderTop: `2.5px solid ${ICON_TEAL}`,
        overflow: "hidden", display: "flex", alignItems: "center",
        px: 3, flexShrink: 0, mt: "auto",
      },
      skyline: {
        wrapper: { position: "absolute", bottom: 0, right: 0, display: "flex", alignItems: "flex-end", pointerEvents: "none", width: 340 },
        brick:   { flexShrink: 0, mr: "3px", bgcolor: "rgba(255,255,255,0.18)" },
      },
      logo:         { width: 60, height: 60, objectFit: "contain" },
      logoBox:      { width: 60, height: 60, display: "flex", alignItems: "center", justifyContent: "center" },
      text:         { fontSize: 12, color: "rgba(255,255,255,0.73)", whiteSpace: "nowrap" },
      copyrightBox: { flex: 1, display: "flex", justifyContent: "center" },
      versionBox:   { flexShrink: 0, textAlign: "right", zIndex: 1 },
    },

    // ── Footer mobile ──────────────────────────────────────────
    footerMobile: {
      wrapper: {
        width: "100%", height: 48, bgcolor: "#2f5157",
        borderTop: `2px solid ${ICON_TEAL}`,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        px: 2, flexShrink: 0,
      },
      logo: { height: 28, objectFit: "contain" },
      text: { fontSize: 11, color: "rgba(255,255,255,0.5)" },
    },

    // ── Sidebar / Topbar ───────────────────────────────────────
    sidebarBg: PRIMARY_BLUE,
    topbarBg:  PRIMARY_BLUE,

    // ── PersonnelArchivesListPage ──────────────────────────────
    archives: {
      page:           { fontFamily: "Roboto, Arial, sans-serif" },
      kpiCard:        { borderRadius: "12px", height: "100%" },
      kpiContent:     { p: "1rem 1.25rem !important" },
      kpiLabel:       { fontSize: 12, fontWeight: 600, color: GRAY, mb: 0.5 },
      kpiValueLong:   { fontSize: 16, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
      kpiValueShort:  { fontSize: 24, fontWeight: 700 },
      kpiSub:         { fontSize: 11, color: GRAY, mt: 0.5 },
      loadingBanner: {
        sx: { background: "#e0f7f7", borderRadius: "10px", border: `1px solid rgba(2,178,175,0.2)` },
      },
      loadingBannerText:    { fontSize: 12, color: "#007a78" },
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
        "& .MuiDataGrid-cell":          { display: "flex", alignItems: "center" },
        "& .MuiDataGrid-columnHeaders": { borderBottom: `1px solid #d7e1ef` },
        "& .MuiDataGrid-row":           { borderBottom: `1px solid #d7e1ef` },
      },
      backButton: {
        borderRadius: "10px", fontWeight: 600,
        textTransform: "none", color: PRIMARY_BLUE,
        borderColor: "rgba(0,59,104,0.25)",
      },
    },

    // ── PersonnelDetailPage ────────────────────────────────────
    detail: {
      // Page
      page:       { maxWidth: 720, mx: "auto", px: { xs: 1, sm: 2 }, py: 2 },
      // Nav
      backBtn:    { fontWeight: 500, color: "secondary.main", fontSize: 13 },
      refreshBtn: { border: "0.5px solid", borderColor: "divider", borderRadius: 1.5, bgcolor: "background.paper" },
      // Tailles d'icônes — évite les sx={{ fontSize }} inline répétés
      iconSm:  { fontSize: 14 },   // toutes les icônes InfoRow
      iconXsm: { fontSize: 15 },   // icône bouton retour / refresh
      // Card principale
      card: {
        bgcolor: "background.paper", borderRadius: 3,
        boxShadow: "0 2px 12px rgba(0,0,0,0.09), 0 0 0 0.5px rgba(0,0,0,0.07)",
        overflow: "hidden",
      },
      // Hero
      hero:      { px: 2.5, py: 2, borderBottom: "0.5px solid", borderColor: "divider" },
      avatar: {
        width: 60, height: 60, borderRadius: "50%",
        bgcolor: "action.selected", display: "flex",
        alignItems: "center", justifyContent: "center",
        fontSize: 20, fontWeight: 500, color: "text.secondary", flexShrink: 0,
      },
      heroName:     { fontSize: 18, fontWeight: 500, mb: 0.3 },
      heroEmail:    { fontSize: 12, mb: 1 },
      chipGrade:    { fontSize: 11, height: 22, fontWeight: 500 },
      chipFonction: { fontSize: 11, height: 22, fontWeight: 500 },
      chipOutlined: { fontSize: 11, height: 22, fontWeight: 500 },
      // ID
      idBox:   { textAlign: "right", flexShrink: 0 },
      idLabel: { fontSize: 10, color: "text.disabled", mb: 0.3 },
      idValue: { fontSize: 15, fontWeight: 500, color: "text.secondary" },
      // Sections
      section:     { px: 2.5, pt: 1.5, pb: 1, borderBottom: "0.5px solid", borderColor: "divider" },
      sectionLast: { px: 2.5, pt: 1.5, pb: 2 },
      sectionLabel: {
        fontSize: 10, fontWeight: 500, color: "secondary.main",
        textTransform: "uppercase", letterSpacing: "0.09em", mb: 1,
      },
      // InfoRow
      infoRow: {
        py: 1, borderBottom: "0.5px solid", borderColor: "divider",
        "&:last-child": { borderBottom: "none" },
      },
      infoIconBox: {
        width: 26, height: 26, borderRadius: 1.5,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      },
      infoLabel: { fontSize: 12, color: "text.secondary", width: 130, flexShrink: 0 },
      infoValue: { fontSize: 13, flex: 1 },
      // HierarchyCard
      hierCard: {
        flex: 1, border: "0.5px solid", borderColor: "divider",
        borderRadius: 2, px: 1.5, py: 1.25,
      },
      hierAvatar: {
        width: 34, height: 34, borderRadius: "50%",
        bgcolor: "action.selected", display: "flex",
        alignItems: "center", justifyContent: "center",
        fontSize: 11, fontWeight: 500, color: "text.secondary", flexShrink: 0,
      },
      hierRole: { fontSize: 10, color: "text.disabled", textTransform: "uppercase", letterSpacing: "0.06em", mb: 0.3 },
      hierName: { fontSize: 13, fontWeight: 500, color: "text.primary" },
    },

    // ── PersonnelStatisticsPage ─────────────────────────────────
   stats: {
      barColors: {
        present: "#48b4b2",
        depart:  RED,        // ← était ICON_TEAL, maintenant rouge
      },
      kpiIconBg:   "#e0ecf6",
      chipGray:    { bgcolor: "#f0f4f8", color: GRAY },
      tableStripe: "rgba(0,59,104,0.025)",
      totalRow:    { bgcolor: "#f0f4f8", color: PRIMARY_BLUE },
      trendUp:     "#1e8e5a",
      trendDown:   RED,
    },
  },

  // ── Typographie ───────────────────────────────────────────────

  // ── Typographie ───────────────────────────────────────────────
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    h1: { fontSize: "25px", fontWeight: 600, color: PRIMARY_BLUE, letterSpacing: "-0.5px", lineHeight: 1, marginBottom: "24px" },
    h2: { fontSize: "22px", fontWeight: 400, color: PRIMARY_BLUE, lineHeight: 1.3 },
    h3: { fontSize: "16px", fontWeight: 700, color: PRIMARY_BLUE, lineHeight: 1.4 },
    h4: { fontSize: "15px", fontWeight: 600, color: PRIMARY_BLUE, lineHeight: 1.4 },
    h5: { fontSize: "13px", fontWeight: 700, color: PRIMARY_BLUE, textTransform: "uppercase", letterSpacing: "0.05em", lineHeight: 1.4 },
    h6: { fontSize: "11px", fontWeight: 600, color: GRAY, textTransform: "uppercase", letterSpacing: "0.08em", lineHeight: 1.4 },
    subtitle1: { fontSize: "14px", fontWeight: 600, color: PRIMARY_BLUE, lineHeight: 1.4 },
    subtitle2: { fontSize: "13px", fontWeight: 500, color: GRAY,         lineHeight: 1.4 },
    body1:     { fontSize: "14px", color: "#374151", lineHeight: 1.6 },
    body2:     { fontSize: "13px", color: GRAY,      lineHeight: 1.5 },
    caption:   { fontSize: "11px", color: "#7b93a8", lineHeight: 1.4 },
    overline:  { fontSize: "10px", fontWeight: 600, color: "#7b93a8", textTransform: "uppercase", letterSpacing: "0.09em", lineHeight: 1.4 },
    button:    { fontSize: "13px", fontWeight: 600, textTransform: "none" },
  },

  components: {
    MuiInputLabel: {
      styleOverrides: {
        root: { fontSize: 13, fontWeight: 600, color: PRIMARY_BLUE },
        asterisk: { color: "#d32f2f", order: -1, marginRight: 4, marginLeft: 0, fontWeight: 800 },
      },
    },
    MuiFormLabel:   { styleOverrides: { root: { fontSize: 13, fontWeight: 600, color: PRIMARY_BLUE } } },
    MuiTextField:   { defaultProps: { size: "small" } },
    MuiFormControl: { defaultProps: { size: "small" } },
    MuiAppBar: {
      styleOverrides: {
        root: { backgroundColor: PRIMARY_BLUE, color: "#ffffff", backgroundImage: "none", "& .MuiSvgIcon-root": { color: "#ffffff" } },
      },
    },
    MuiDrawer: {
      styleOverrides: { paper: { backgroundColor: "#ffffff", color: PRIMARY_BLUE, borderRight: `1px solid ${BORDER}` } },
    },
    MuiListItemText:  { styleOverrides: { primary: { fontWeight: 600, color: PRIMARY_BLUE } } },
    MuiListItemIcon:  { styleOverrides: { root: { color: ICON_TEAL, minWidth: 36 } } },
    MuiSvgIcon:       { styleOverrides: { root: { color: ICON_TEAL } } },
    MuiCard: {
      defaultProps: { variant: "outlined" },
      styleOverrides: { root: { backgroundColor: "#ffffff", border: `1px solid ${BORDER}`, borderRadius: 12, overflow: "hidden" } },
    },
    MuiCardContent: {
      styleOverrides: { root: { padding: "16px", "&:last-child": { paddingBottom: "16px" } } },
    },
    MuiCardHeader: {
      styleOverrides: {
        root:   { padding: "10px 16px", borderBottom: `1px solid rgba(0,0,0,0.07)` },
        title:  { fontSize: "15px", fontWeight: 600, color: PRIMARY_BLUE },
        action: { margin: 0, alignSelf: "center" },
      },
    },
    MuiChip: {
      styleOverrides: {
        root:           { height: 22, fontSize: 12, fontWeight: 600, borderRadius: "99px" },
        colorSuccess:   { backgroundColor: "#e0f7f7", color: "#007a78" },
        colorError:     { backgroundColor: "#fdecea", color: RED },
        colorPrimary:   { backgroundColor: "#e0ecf6", color: PRIMARY_BLUE },
        colorSecondary: { backgroundColor: "#e0f7f7", color: "#007a78" },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { textTransform: "none", borderRadius: 10, fontWeight: 600 } },
    },
    MuiTableHead:  { styleOverrides: { root: { backgroundColor: "rgba(0,59,104,0.03)" } } },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&.MuiTableRow-hover:hover, &:hover": { backgroundColor: "rgba(0,59,104,0.03)" },
          "&:last-child td": { borderBottom: "none" },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: { fontSize: 11, fontWeight: 700, color: PRIMARY_BLUE, textTransform: "uppercase", letterSpacing: "0.05em", paddingTop: 8, paddingBottom: 8, borderBottomColor: BORDER },
        body: { fontSize: 13, paddingTop: 8, paddingBottom: 8, borderBottomColor: BORDER_LIGHT },
      },
    },
    MuiDialogTitle: { styleOverrides: { root: { fontWeight: 800, color: PRIMARY_BLUE } } },
  },
});

export default theme;