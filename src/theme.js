import { createTheme } from "@mui/material/styles";

const PRIMARY_BLUE = "#003B68";
const ICON_TEAL = "#02B2AF";

const theme = createTheme({
  palette: {
    mode: "light",

    primary: {
      main: PRIMARY_BLUE,
      contrastText: "#ffffff",
    },

    secondary: {
      main: ICON_TEAL,
    },

    background: {
      default: "#f6f7fb",
      paper: "#ffffff",
    },
  },

  shape: {
    borderRadius: 12,
  },

 typography: {
  fontFamily: "Roboto, Arial, sans-serif",

  /* =========================
     TITRE PRINCIPAL DE PAGE
     ========================= */
  h1: {
    fontSize: "28px",
    fontWeight: 800,
    color: PRIMARY_BLUE,
    letterSpacing: "-0.5px",
  },

  /* =========================
     SOUS TITRE DE PAGE
     ========================= */
  h2: {
    fontSize: "20px",
    fontWeight: 700,
    color: PRIMARY_BLUE,
  },

  /* =========================
     TITRE DE SECTION / CARD
     ========================= */
  h3: {
    fontSize: "16px",
    fontWeight: 700,
    color: PRIMARY_BLUE,
  },

  /* =========================
     PETITS TITRES
     ========================= */
  h4: {
    fontSize: "15px",
    fontWeight: 600,
    color: PRIMARY_BLUE,
  },

  subtitle1: {
    fontWeight: 600,
    color: PRIMARY_BLUE,
  },

  body1: {
    fontSize: "14px",
  },

  body2: {
    fontSize: "13px",
    color: "#5c6b7a",
  },
},

  components: {
    /* =========================
       APP BAR (BARRE DU HAUT)
    ========================== */

    MuiFormLabel: {
  styleOverrides: {
    root: {
      fontSize: 13,
      fontWeight: 600,
      color: PRIMARY_BLUE,

      /* Astérisque avant le texte */
      "&.Mui-required": {
        display: "flex",
        alignItems: "center",
        gap: 4,
      },

      "& .MuiFormLabel-asterisk": {
        order: -1,               //  met l'étoile avant
        color: "#d32f2f",        // rouge
        marginRight: 4,
      },
    },
  },
},
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: PRIMARY_BLUE,
          color: "#ffffff",
          backgroundImage: "none",

          "& .MuiSvgIcon-root": {
            color: "#ffffff",
          },
        },
      },
    },

    /* =========================
       SIDEBAR (DRAWER)
    ========================== */
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#ffffff",
          color: PRIMARY_BLUE,
          borderRight: "1px solid rgba(0,0,0,0.08)",
        },
      },
    },

    /* =========================
       TEXTE MENU SIDEBAR
    ========================== */
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontWeight: 600,
          color: PRIMARY_BLUE,
        },
      },
    },

    /* =========================
       ICONES MENU
    ========================== */
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          color: ICON_TEAL,
          minWidth: 36,
        },
      },
    },

    /* =========================
       ICONES GENERALES (Cards etc.)
    ========================== */
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          color: ICON_TEAL,
        },
      },
    },

    /* =========================
       ✅ LABELS (TextField / Select / DatePicker)
       => plus besoin de InputLabelProps partout
    ========================== */
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: 13,
          fontWeight: 500,
        },
      },
    },

    /* utile pour RadioGroup / FormLabel ("Personnel", "Langue", etc.) */
    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontSize: 13,
          fontWeight: 600,
          color: PRIMARY_BLUE,
        },
      },
    },

    /* =========================
       ✅ CHAMPS EN "SMALL" PARTOUT
    ========================== */
    MuiTextField: {
      defaultProps: {
        size: "small",
      },
    },
    MuiFormControl: {
      defaultProps: {
        size: "small",
      },
    },

    /* =========================
       CARD
    ========================== */
    MuiCard: {
      defaultProps: { variant: "outlined" },
      styleOverrides: {
        root: {
          borderColor: "rgba(0,0,0,0.08)",
        },
      },
    },

    /* =========================
       BUTTON
    ========================== */
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

    /* =========================
       TABLE
    ========================== */
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

    /* =========================
       (OPTIONNEL) Dialog title un peu plus "pro"
    ========================== */
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