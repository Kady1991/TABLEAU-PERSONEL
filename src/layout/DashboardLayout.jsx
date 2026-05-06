import * as React from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Tooltip,
  Divider,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ArchiveIcon from "@mui/icons-material/Archive";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ApartmentIcon from "@mui/icons-material/Apartment";
import AddIcon from "@mui/icons-material/Add";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import logo from "../assets/logo_white.png";
import AjoutFormComponent from "../components/Forms/AjoutFormComponent.jsx";

const DRAWER_OPEN = 215;
const DRAWER_CLOSED = 62;

const NAV_SECTIONS = [
  {
    label: "Navigation",
    items: [
      { label: "Accueil", path: "/", icon: <DashboardIcon sx={{ fontSize: 20 }} />, end: true },
      { label: "Liste du personnel", path: "/personnels", icon: <PeopleAltIcon sx={{ fontSize: 20 }} />, end: true },
    ],
  },
  {
    label: "Donnees",
    items: [
      { label: "Archives", path: "/personnels/archives", icon: <ArchiveIcon sx={{ fontSize: 20 }} /> },
      { label: "Statistiques", path: "/personnels/statistics", icon: <AssessmentIcon sx={{ fontSize: 20 }} /> },
      { label: "Affectations", path: "/affectations", icon: <ApartmentIcon sx={{ fontSize: 20 }} /> },
    ],
  },
];

export default function DashboardLayout() {
  const theme = useTheme();
  const PRIMARY = theme.palette.primary.main;
  const TEAL = theme.palette.secondary.main;

  const [open, setOpen] = React.useState(true);
  const [openAdd, setOpenAdd] = React.useState(false);

  const toggle = () => setOpen((v) => !v);

  const drawer = (
    <Box sx={{
      width: open ? DRAWER_OPEN : DRAWER_CLOSED,
      transition: "width 0.25s ease",
      overflowX: "hidden",
      bgcolor: PRIMARY,
      borderRight: "none",
      display: "flex",
      flexDirection: "column",
      height: "100vh",
    }}>

      {/* ── Logo seul ── */}
<Box
  component="img"
  src={logo}
  alt="Logo Uccle"
  sx={{
    height: 80,
    width: "auto",
    objectFit: "contain",
    display: "block",
    mx: "auto",
  //  my: 1,
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    pb: 1.5,
  }}
/>

{/* ── Nav ── */}
<Box sx={{ flex: 1, px: 0.8, py: 1, overflowY: "auto", overflowX: "hidden" }}>

        {/* Bouton Nouveau membre */}
        <Tooltip title={!open ? "Nouveau membre" : ""} placement="right">
          <ListItemButton
            onClick={() => setOpenAdd(true)}
            sx={{
              borderRadius: "8px",
              mb: 1,
              px: 1,
              py: 0.9,
              minHeight: 42,
              justifyContent: open ? "flex-start" : "center",
              bgcolor: TEAL,
              "&:hover": { bgcolor: theme.palette.secondary.dark ?? "#019d9a" },
              "& .MuiListItemIcon-root": { color: "#fff !important" },
              "& .MuiListItemText-primary": {
                color: "#fff !important",
                fontSize: "14px !important",
                fontWeight: "500 !important",
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: open ? 30 : 0, color: "#fff !important", justifyContent: "center" }}>
              <AddIcon sx={{ fontSize: 20, color: "#fff !important" }} />
            </ListItemIcon>
            {open && (
              <ListItemText
                primary="Nouveau membre"
                primaryTypographyProps={{ fontSize: 14, fontWeight: 500, color: "#fff" }}
              />
            )}
          </ListItemButton>
        </Tooltip>

        {/* Sections */}
        {NAV_SECTIONS.map((section, si) => (
          <Box key={section.label}>
            {si > 0 && <Divider sx={{ my: 0.5, borderColor: "rgba(255,255,255,0.08)" }} />}
            {open && (
              <Typography sx={{
                fontSize: 9,
                fontWeight: 600,
                color: "rgba(255,255,255,0.3)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                px: 1, pt: 1, pb: 0.5,
                whiteSpace: "nowrap",
              }}>
                {section.label}
              </Typography>
            )}
            <List disablePadding>
              {section.items.map((item) => (
                <Tooltip key={item.path} title={!open ? item.label : ""} placement="right">
                  <ListItemButton
                    component={NavLink}
                    to={item.path}
                    end={item.end}
                    style={({ isActive }) => ({
                      borderRadius: "8px",
                      marginBottom: "2px",
                      paddingLeft: 8,
                      paddingRight: 8,
                      paddingTop: 7,
                      paddingBottom: 7,
                      minHeight: 42,
                      backgroundColor: isActive ? "rgba(255,255,255,0.15)" : "transparent",
                      color: isActive ? "#ffffff" : "rgba(255,255,255,0.65)",
                      justifyContent: open ? "flex-start" : "center",
                    })}
                    sx={{
                      "&:hover": { bgcolor: "rgba(255,255,255,0.08)", color: "#fff !important" },
                      "& .MuiListItemIcon-root": { color: "inherit !important" },
                      "& .MuiListItemText-primary": {
                        color: "inherit !important",
                        fontSize: "15px !important",
                        fontWeight: "400 !important",
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: open ? 30 : 0, justifyContent: "center", color: "inherit !important" }}>
                      {item.icon}
                    </ListItemIcon>
                    {open && <ListItemText primary={item.label} />}
                  </ListItemButton>
                </Tooltip>
              ))}
            </List>
          </Box>
        ))}
      </Box>

      {/* ── Utilisateur ── */}
      <Box sx={{ px: 0.8, py: 1, borderTop: "1px solid rgba(255,255,255,0.08)", flexShrink: 0 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, px: 1, py: 0.8, borderRadius: "8px" }}>
          <Box sx={{
            width: 34, height: 34, borderRadius: "50%",
            bgcolor: TEAL, color: "#fff",
            fontSize: 11, fontWeight: 700,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            KS
          </Box>
          {open && (
            <Box sx={{ overflow: "hidden", flex: 1 }}>
              <Typography sx={{ fontSize: 13, color: "#fff", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                Kady Sangare
              </Typography>
              <Typography sx={{ fontSize: 10, color: "rgba(255,255,255,0.4)", whiteSpace: "nowrap" }}>
                Administrateur · Uccle
              </Typography>
            </Box>
          )}
          {open && <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: TEAL, flexShrink: 0 }} />}
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AjoutFormComponent open={openAdd} onClose={() => setOpenAdd(false)} />

      {/* ── Sidebar ── */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          width: open ? DRAWER_OPEN : DRAWER_CLOSED,
          flexShrink: 0,
          transition: "width 0.25s ease",
          "& .MuiDrawer-paper": {
            width: open ? DRAWER_OPEN : DRAWER_CLOSED,
            transition: "width 0.25s ease",
            overflowX: "hidden",
            bgcolor: PRIMARY,
            border: "none",
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* ── Main ── */}
      <Box component="main" sx={{ flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh", bgcolor: "background.default", width: 0 }}>

        {/* ── Topbar ── */}
        <Box sx={{
          height: 70,
          bgcolor: PRIMARY,
          display: "flex",
          alignItems: "center",
          px: 2,
          gap: 1.5,
          flexShrink: 0,
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}>
          <Tooltip title={open ? "Reduire" : "Ouvrir"}>
            <IconButton
              onClick={toggle}
              sx={{
                color: "#fff",
                bgcolor: "rgba(255,255,255,0.1)",
                borderRadius: "8px",
                width: 34,
                height: 34,
                flexShrink: 0,
                "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
              }}
            >
              {open
                ? <ChevronLeftIcon sx={{ fontSize: 20 }} />
                : <MenuIcon sx={{ fontSize: 20 }} />
              }
            </IconButton>
          </Tooltip>
          <Box>
            <Typography sx={{ fontSize: 20, fontWeight: 600, color: "#fff", lineHeight: 1.2 }}>
              Gestion du personnel
            </Typography>
            <Typography sx={{ fontSize: 11, color: "rgba(255,255,255,0.45)", mt: 0.3 }}>
              Administration communale d&apos;Uccle
            </Typography>
          </Box>
        </Box>

        {/* ── Contenu ── */}
        <Box sx={{ flex: 1, p: 3, overflow: "auto" }}>
          <Box sx={{ maxWidth: 1400, mx: "auto" }}>
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}