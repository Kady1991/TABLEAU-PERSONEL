import { createTheme } from "@mui/material/styles";

const PRIMARY_BLUE = "#003B68";
const ICON_TEAL = "#02B2AF";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: PRIMARY_BLUE, contrastText: "#ffffff" },
    secondary: { main: ICON_TEAL },
    background: { default: "#f6f7fb", paper: "#ffffff" },
  },

  shape: { borderRadius: 12 },

  typography: {
    fontFamily: "Roboto, Arial, sans-serif",

    h1: {
      fontSize: "28px",
      fontWeight: 800,
      color: PRIMARY_BLUE,
      letterSpacing: "-0.5px",
    },
    h2: { fontSize: "20px", fontWeight: 700, color: PRIMARY_BLUE },
    h3: { fontSize: "16px", fontWeight: 700, color: PRIMARY_BLUE },
    h4: { fontSize: "15px", fontWeight: 600, color: PRIMARY_BLUE },

    subtitle1: { fontWeight: 600, color: PRIMARY_BLUE },
    body1: { fontSize: "14px" },
    body2: { fontSize: "13px", color: "#5c6b7a" },
  },

  components: {
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: 13,
          fontWeight: 600,
          color: PRIMARY_BLUE,
        },
        asterisk: {
          color: "#d32f2f",
          order: -1,
          marginRight: 4,
          marginLeft: 0,
          fontWeight: 800,
        },
      },
    },

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
          borderRight: "1px solid rgba(0,0,0,0.08)",
        },
      },
    },

    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontWeight: 600,
          color: PRIMARY_BLUE,
        },
      },
    },

    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: ICON_TEAL,
          minWidth: 36,
        },
      },
    },

    MuiSvgIcon: {
      styleOverrides: {
        root: { color: ICON_TEAL },
      },
    },

    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontSize: 13,
          fontWeight: 600,
          color: PRIMARY_BLUE,
        },
      },
    },

    MuiTextField: {
      defaultProps: { size: "small" },
    },
    MuiFormControl: {
      defaultProps: { size: "small" },
    },

    MuiCard: {
      defaultProps: { variant: "outlined" },
      styleOverrides: {
        root: {
          borderColor: "rgba(0,0,0,0.08)",
        },
      },
    },

    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 10,
          fontWeight: 600,
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        head: {
          fontSize: 12,
          fontWeight: 700,
          color: PRIMARY_BLUE,
          borderBottomColor: "rgba(0,0,0,0.08)",
        },
        body: {
          borderBottomColor: "rgba(0,0,0,0.06)",
        },
      },
    },

    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontWeight: 800,
          color: PRIMARY_BLUE,
        },
      },
    },
  },
});

export default theme;