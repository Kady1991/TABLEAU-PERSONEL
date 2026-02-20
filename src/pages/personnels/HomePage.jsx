import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ArchiveIcon from "@mui/icons-material/Archive";
import AssessmentIcon from "@mui/icons-material/Assessment";
import AddIcon from "@mui/icons-material/Add";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Tooltip from "@mui/material/Tooltip";
import { DataGrid, GridToolbar, GridActionsCellItem } from "@mui/x-data-grid";
import PersonnelService from "../../services/PersonnelService";
import FormServiceComponent from "../../components/Forms/FormServiceComponent.jsx";
import EditFormComponent from "../../components/Forms/EditFormComponent.jsx";
import DeleteMembreComponent from "../../components/Forms/DeleteMembreComponent.jsx";

import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

const CACHE_KEY = "home_personnels_actifs_cache_v1";

function StatCard({ title, subtitle, icon, onClick, right }) {
  return (
    <Card variant="outlined">
      <CardActionArea onClick={onClick} sx={{ height: "100%" }}>
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                display: "grid",
                placeItems: "center",
                bgcolor: "action.hover",
                flexShrink: 0,
              }}
            >
              {icon}
            </Box>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography fontWeight={700} noWrap>
                {title}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {subtitle}
              </Typography>
            </Box>

            {/* ✅ petit chiffre/infos à droite */}
            {right ? <Box sx={{ flexShrink: 0 }}>{right}</Box> : null}
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

function HomePage() {
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [stats, setStats] = useState({ actifs: 0, archives: 0 });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async ({ force = false } = {}) => {
    try {
      setLoading(true);
      setError("");

      if (!force) {
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
          const actifsCached = JSON.parse(cached);
          setRows(actifsCached);

          // ✅ on a les actifs via le cache
          setStats((p) => ({ ...p, actifs: actifsCached.length }));
          setLoading(false);

          // ✅ on calcule juste "archives" en arrière-plan (1 seul appel)
          // (facultatif mais utile pour afficher le chiffre exact)
          try {
            const res = await PersonnelService.getAll();
            const all = Array.isArray(res.data) ? res.data : [];
            const archives = all.filter((p) => p?.SiArchive === true).length;
            setStats({ actifs: actifsCached.length, archives });
          } catch {
            // ignore
          }

          return;
        }
      }

      const res = await PersonnelService.getAll();
      const all = Array.isArray(res.data) ? res.data : [];

      const actifs = all.filter((p) => p?.SiArchive === false);
      const archives = all.filter((p) => p?.SiArchive === true);

      setRows(actifs);
      setStats({ actifs: actifs.length, archives: archives.length });

      sessionStorage.setItem(CACHE_KEY, JSON.stringify(actifs));
    } catch (e) {
      setError(e?.message || "Erreur lors du chargement des personnels");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const refreshData = async () => {
    sessionStorage.removeItem(CACHE_KEY);
    await load({ force: true });
  };

  const columns = useMemo(
    () => [
      {
        field: "actions",
        type: "actions",
        headerName: "Actions",
        width: 220,
        getActions: ({ row }) => [
          <GridActionsCellItem
            key="fiche"
            icon={
              <Tooltip title="Voir la fiche du personnel" arrow>
                <VisibilityIcon />
              </Tooltip>
            }
            label=""
            onClick={() => navigate(`/personnels/${row.IDPersonneService}`)}
            showInMenu={false}
          />,

          <Box key="service" sx={{ display: "inline-flex" }}>
            <FormServiceComponent
              IDPersonneService={row.IDPersonneService}
              refreshData={refreshData}
            />
          </Box>,

          <Box key="edit" sx={{ display: "inline-flex" }}>
            <EditFormComponent
              IDPersonneService={row.IDPersonneService}
              refreshData={refreshData}
            />
          </Box>,

          <Box key="delete" sx={{ display: "inline-flex" }}>
            <DeleteMembreComponent
              IDPersonneService={row.IDPersonneService}
              nomPersonne={row.NomPersonne}
              prenomPersonne={row.PrenomPersonne}
              email={row.Email}
              refreshData={refreshData}
            />
          </Box>,
        ],
      },

      { field: "NomPersonne", headerName: "NOM", width: 200 },
      { field: "PrenomPersonne", headerName: "PRENOM", width: 200 },
      { field: "Email", headerName: "E-mail", width: 250 },
      { field: "TelPro", headerName: "TEL", width: 150 },
      { field: "SiFrancaisString", headerName: "RÔLE", width: 150 },

      { field: "DateEntree", headerName: "ENTREE SERVICE", width: 200 },

      { field: "NomWWGradeNl", headerName: "GRADE(nl)", width: 200 },
      { field: "NomWWGradeFr", headerName: "GRADE", width: 200 },

      { field: "NomServiceNl", headerName: "AFFECTATION (nl)", width: 250 },
      { field: "NomServiceFr", headerName: "AFFECTATION", width: 250 },

      { field: "NomRueNl", headerName: "LOCALISATION(nl)", width: 250 },
      { field: "NomRueFr", headerName: "LOCALISATION", width: 250 },
      { field: "Numero", headerName: "N°", width: 100 },

      {
        field: "NomChefService",
        headerName: "NOM CHEF DU SERVICE",
        width: 250,
      },
      {
        field: "PrenomChefService",
        headerName: "PRENOM CHEF DU SERVICE",
        width: 250,
      },
      {
        field: "EmailChefService",
        headerName: "E-MAIL CHEF DU SERVICE",
        width: 250,
      },

      { field: "NomDepartementNl", headerName: "DEPARTEMENT(nl)", width: 250 },
      { field: "NomDepartementFr", headerName: "DEPARTEMENTS", width: 250 },
      {
        field: "NomChefDepartement",
        headerName: "NOM CHEF DEPARTEMENT",
        width: 250,
      },
      {
        field: "PrenomChefDepartement",
        headerName: "PRENOM CHEF DEPARTEMENT",
        width: 250,
      },
      {
        field: "EmailChefDepartement",
        headerName: "E-MAIL CHEF DEPARTEMENT",
        width: 250,
      },

      { field: "P+C:UENSION", headerName: "P+C:UENSION", width: 150 },
      { field: "Batiment", headerName: "Batiment", width: 100 },
      { field: "Etage", headerName: "Etage", width: 100 },
      { field: "BatimentNl", headerName: "Batiment(nl)", width: 100 },

      { field: "IDPersonneService", headerName: "ID", width: 90 },
    ],
    [navigate],
  );

  return (
    <Box>
      {/* Header style template */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        {/* <Typography variant="h1" fontWeight={700}>
          Dashboard
        </Typography> */}
      </Stack>

      {/* Cards navigation */}
      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            lg: "1fr 1fr 1fr 1fr",
          },
          mb: 2,
        }}
      >
        <StatCard
          title="Nouveau"
          subtitle="Ajouter un nouveau membre"
          icon={<AddIcon fontSize="small" />}
          onClick={() => navigate("/personnels/new")}
        />

        <StatCard
          title="Personnels"
          subtitle="Liste des personnels actifs"
          icon={<PeopleAltIcon fontSize="small" />}
          onClick={() => navigate("/personnels")}
          right={
            <Typography variant="body2" fontWeight={800}>
              {loading ? "…" : stats.actifs}
            </Typography>
          }
        />

        <StatCard
          title="Archives"
          subtitle="Personnels archivés"
          icon={<ArchiveIcon fontSize="small" />}
          onClick={() => navigate("/personnels/archives")}
          right={
            <Typography variant="body2" fontWeight={800}>
              {loading ? "…" : stats.archives}
            </Typography>
          }
        />

        <StatCard
          title="Statistiques"
          subtitle="Vue globale"
          icon={<AssessmentIcon fontSize="small" />}
          onClick={() => navigate("/personnels/statistics")}
          right={
            <Stack spacing={0.2} alignItems="flex-end">
              <Stack direction="row" spacing={1} alignItems="center">
                <ArrowDownwardIcon
                  sx={{ fontSize: 20, color: "success.main" }}
                />
                <Typography
                  variant="caption"
                  sx={{ fontWeight: 800, color: "success.main" }}
                >
                  {loading ? "…" : stats.actifs}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1.9} alignItems="center">
                <ArrowUpwardIcon sx={{ fontSize: 20, color: "error.main" }} />
                <Typography
                  variant="caption"
                  sx={{ fontWeight: 800, color: "error.main" }}
                >
                  {loading ? "…" : stats.archives}
                </Typography>
              </Stack>
            </Stack>
          }
        />
      </Box>

      {/* Tableau */}
      <Card variant="outlined">
        <CardContent>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={1}
          >
            <Typography fontWeight={700}>
              Tableau des personnels (actifs)
            </Typography>
            <Button size="small" onClick={() => navigate("/personnels")}>
              Ouvrir en plein écran
            </Button>
          </Stack>

          <Divider sx={{ mb: 2 }} />

          {error && <Alert severity="error">{error}</Alert>}

          {loading && (
            <Stack direction="row" alignItems="center" spacing={2}>
              <CircularProgress size={20} />
              <Typography variant="body2" color="text.secondary">
                Chargement…
              </Typography>
            </Stack>
          )}

          {!loading && !error && (
            <Box sx={{ width: "100%", height: "calc(100vh - 420px)" }}>
              <DataGrid
                rows={rows}
                columns={columns}
                getRowId={(row) => row.IDPersonneService}
                loading={loading}
                disableRowSelectionOnClick
                showCellRightBorder
                showColumnRightBorder
                checkboxSelection
                pageSizeOptions={[25, 50, 100]}
                initialState={{
                  pagination: { paginationModel: { pageSize: 10, page: 0 } },
                }}
                slots={{ toolbar: GridToolbar }}
                slotProps={{
                  toolbar: {
                    showQuickFilter: true,
                    quickFilterProps: { debounceMs: 300 },
                    printOptions: { disableToolbarButton: true },
                  },
                  loadingOverlay: {
                    variant: "linear-progress",
                    noRowsVariant: "linear-progress",
                  },
                }}
                sx={{
                  "& .MuiDataGrid-toolbarContainer": {
                    justifyContent: "flex-end",
                    gap: 1,
                    p: 1,
                  },
                  "& .MuiDataGrid-columnHeaders": {
                    borderBottom: "1px solid #d7e1ef",
                  },
                  "& .MuiDataGrid-row": {
                    borderBottom: "1px solid #d7e1ef",
                  },
                }}
              />
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default HomePage;
