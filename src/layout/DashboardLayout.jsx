    import * as React from "react";
    import { NavLink, Outlet, useLocation } from "react-router-dom";
    import {
    AppBar,
    Box,
    CssBaseline,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    } from "@mui/material";

    import MenuIcon from "@mui/icons-material/Menu";
    import DashboardIcon from "@mui/icons-material/Dashboard";
    import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
    import ArchiveIcon from "@mui/icons-material/Archive";
    import AssessmentIcon from "@mui/icons-material/Assessment";
    import AddIcon from "@mui/icons-material/Add";
    import logo from "../assets/logo_white.png";
    const drawerWidth = 240;

    const navItems = [
    { label: "Accueil", path: "/", icon: <DashboardIcon fontSize="small" /> },
    {
        label: "Liste du personnels",
        path: "/personnels",
        icon: <PeopleAltIcon fontSize="small" />,
    },
    {
        label: "Archives",
        path: "/personnels/archives",
        icon: <ArchiveIcon fontSize="small" />,
    },
    {
        label: "Statistiques",
        path: "/personnels/statistics",
        icon: <AssessmentIcon fontSize="small" />,
    },
    {
        label: "Nouveau membre",
        path: "/personnels/new",
        icon: <AddIcon fontSize="small" />,
    },
    ];

    export default function DashboardLayout() {
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const location = useLocation();

    const handleDrawerToggle = () => setMobileOpen((v) => !v);

    // const getPageTitle = () => {
    //     const found = navItems.find((n) => n.path === location.pathname);
    //     if (found) return found.label;

    //     if (location.pathname.startsWith("/personnels/")) {
    //     return "Détail personnel";
    //     }

    //     return "Dashboard";
    // };

    const drawer = (
        <Box sx={{ height: "100%" }}>
        <Toolbar>
            <Typography variant="subtitle1" fontWeight={800}>
            Uccle • Personnel
            </Typography>
        </Toolbar>

        <Divider />

        {/* <Box sx={{ px: 2, pt: 1 }}>
            <Typography variant="caption" color="text.secondary">
            Navigation
            </Typography>
        </Box> */}

        <List sx={{ px: 1 }}>
           {navItems.map((item) => (
  <ListItemButton
    key={item.path}
    component={NavLink}
    to={item.path}
    end={item.path === "/" || item.path === "/personnels"}
    onClick={() => setMobileOpen(false)}
    sx={{
      borderRadius: 1,
      my: 0.5,
      "&.active": {
        bgcolor: "action.selected",
        fontWeight: 700,
      },
    }}
  >
    <ListItemIcon sx={{ minWidth: 34 }}>
      {item.icon}
    </ListItemIcon>
    <ListItemText primary={item.label} />
  </ListItemButton>
))}

        </List>
        </Box>
    );

    return (
        <Box sx={{ display: "flex" }}>
        <CssBaseline />

        {/* HEADER */}
        <AppBar
  position="fixed"
  elevation={0}
  sx={{
    bgcolor: "#003B68",
    color: "#ffffff",
    zIndex: (theme) => theme.zIndex.drawer + 1,
  }}
>

            <Toolbar sx={{ gap: 1 }}>
            <IconButton
                edge="start"
                color="inherit"
                onClick={handleDrawerToggle}
                sx={{ display: { md: "none" } }}
            >
                <MenuIcon />
            </IconButton>

            {/* <Typography variant="body2" color="text.secondary">
                {getPageTitle()}
            </Typography> */}

<Box
  sx={{
    display: "flex",
    alignItems: "center",
    gap: 1.2,
    minWidth: 0, // permet au texte de se couper proprement
  }}
>
  <Box
    component="img"
    src={logo}
    alt="Logo"
    sx={{
      height: { xs: 28, sm: 50 },
      width: "auto",
      objectFit: "contain",
      flexShrink: 0,
    }}
  />

  <Typography
    variant="subtitle1"
    sx={{
        color: "#ffffff",
      fontWeight: 600,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      maxWidth: { xs: 170, sm: 300, md:500 },
    }}
  >
    Gestion du personnel
  </Typography>
</Box>

            <Box sx={{ flex: 1 }} />

            {/* <Typography variant="caption" color="text.secondary">
                Custom Theme
            </Typography> */}
            </Toolbar>
        </AppBar>

        {/* SIDEBAR */}
        <Box
            component="nav"
            sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        >
            {/* Mobile */}
            <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
                display: { xs: "block", md: "none" },
                "& .MuiDrawer-paper": { width: drawerWidth },
            }}
            >
            {drawer}
            </Drawer>

            {/* Desktop */}
            <Drawer
            variant="permanent"
            open
            sx={{
                display: { xs: "none", md: "block" },
                "& .MuiDrawer-paper": {
                width: drawerWidth,
                boxSizing: "border-box",
                borderRight: "1px solid",
                borderColor: "divider",
                backgroundColor: "background.paper",
                },
            }}
            >
            {drawer}
            </Drawer>
        </Box>

        {/* CONTENU */}
        <Box
            component="main"
            sx={{
            flexGrow: 1,
            width: { md: `calc(100% - ${drawerWidth}px)` },
            bgcolor: "background.default",
            minHeight: "100vh",
            }}
        >
            <Toolbar />
            <Box sx={{ p: 3 }}>
            <Box sx={{ maxWidth: 1400, mx: "auto" }}>
                <Outlet />
            </Box>
            </Box>
        </Box>
        </Box>
    );
    }
