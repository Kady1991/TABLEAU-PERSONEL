import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Alert, Box, Button, Stack, Typography } from "@mui/material";
import { DataGrid, GridToolbar, GridActionsCellItem } from "@mui/x-data-grid";
import Tooltip from "@mui/material/Tooltip";
import VisibilityIcon from "@mui/icons-material/Visibility";
//import ArchiveIcon from "@mui/icons-material/Archive";
import AddIcon from "@mui/icons-material/Add";
import FormServiceComponent from "../../components/Forms/FormServiceComponent.jsx";
import EditFormComponent from "../../components/Forms/EditFormComponent.jsx";
import DeleteMembreComponent from "../../components/Forms/DeleteMembreComponent.jsx";
import AjoutFormComponent from "../../components/Forms/AjoutFormComponent.jsx";

import PersonnelService from "../../services/PersonnelService";

const CACHE_KEY = "personnels_actifs_cache_v1";

function PersonnelListPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal ajout via route /personnels/new
  const isNewRoute = location.pathname === "/personnels/new";
  const [openAdd, setOpenAdd] = useState(false);

  const load = async ({ force = false } = {}) => {
    try {
      setLoading(true);
      setError("");

      //  cache (retour sur page = instant)
      if (!force) {
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
          setRows(JSON.parse(cached));
          setLoading(false);
          return;
        }
      }

      const res = await PersonnelService.getAll();
      const all = Array.isArray(res.data) ? res.data : [];
      const actifs = all.filter((p) => p?.SiArchive === false);

      setRows(actifs);
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(actifs));
    } catch (e) {
      setError(e?.message || "Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    setOpenAdd(isNewRoute);
  }, [isNewRoute]);

  const refreshData = async () => {
    sessionStorage.removeItem(CACHE_KEY);
    await load({ force: true });
  };

  const handleCloseAdd = async () => {
    setOpenAdd(false);
    navigate("/personnels");
    await refreshData();
  };

  //  Colonnes : Actions + toutes tes colonnes (visibles) avec scroll horizontal
  const columns = useMemo(
    () => [
      { field: "IDPersonneService", headerName: "ID", width: 90 },
    {
  field: "actions",
  type: "actions",
  headerName: "Actions",
  width: 240,
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

    <Tooltip title="Modifier le service" arrow key="service">
      <Box sx={{ display: "inline-flex" }}>
        <FormServiceComponent
          IDPersonneService={row.IDPersonneService}
          refreshData={refreshData}
        />
      </Box>
    </Tooltip>,

    <Tooltip title="Modifier les informations" arrow key="edit">
      <Box sx={{ display: "inline-flex" }}>
        <EditFormComponent
          IDPersonneService={row.IDPersonneService}
          refreshData={refreshData}
        />
      </Box>
    </Tooltip>,

    <Tooltip title="Archiver / Supprimer le personnel" arrow key="delete">
      <Box sx={{ display: "inline-flex" }}>
        <DeleteMembreComponent
          IDPersonneService={row.IDPersonneService}
          nomPersonne={row.NomPersonne}
          prenomPersonne={row.PrenomPersonne}
          email={row.Email}
          refreshData={refreshData}
        />
      </Box>
    </Tooltip>,
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

      { field: "NomChefService", headerName: "NOM CHEF DU SERVICE", width: 250 },
      { field: "PrenomChefService", headerName: "PRENOM CHEF DU SERVICE", width: 250 },
      { field: "EmailChefService", headerName: "E-MAIL CHEF DU SERVICE", width: 250 },

      { field: "NomDepartementNl", headerName: "DEPARTEMENT(nl)", width: 250 },
      { field: "NomDepartementFr", headerName: "DEPARTEMENTS", width: 250 },
      { field: "NomChefDepartement", headerName: "NOM CHEF DEPARTEMENT", width: 250 },
      { field: "PrenomChefDepartement", headerName: "PRENOM CHEF DEPARTEMENT", width: 250 },
      { field: "EmailChefDepartement", headerName: "E-MAIL CHEF DEPARTEMENT", width: 250 },

      { field: "P+C:UENSION", headerName: "P+C:UENSION", width: 150 },
      { field: "Batiment", headerName: "Batiment", width: 100 },
      { field: "Etage", headerName: "Etage", width: 100 },
      { field: "BatimentNl", headerName: "Batiment(nl)", width: 100 },

      // utile en interne
      
    ],
    [navigate] // refreshData est stable ici (fonction recréée mais OK)
  );

  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      {/* ✅ Modal Ajout (route /personnels/new) */}
      <AjoutFormComponent open={openAdd} onClose={handleCloseAdd} refreshData={refreshData} />

      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight={700}>
          Personnels
        </Typography>

        <Stack direction="row" spacing={1}>
          {/* <Button
            variant="contained"
            size="small"
            startIcon={<ArchiveIcon />}
            onClick={() => navigate("/personnels/archives")}
          >
            Archives
          </Button> */}

          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={() => navigate("/personnels/new")}
          >
            Nouveau
          </Button>
        </Stack>
      </Stack>

      {/*  DataGrid : filtres + recherche intégrés + scroll horizontal */}
      <Box sx={{ width: "100%", height: "calc(100vh - 220px)" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.IDPersonneService}
          loading={loading}
          checkboxSelection
          disableRowSelectionOnClick
          showCellRightBorder
          showColumnRightBorder
          pageSizeOptions={[25, 50, 100]}
          initialState={{
            pagination: { paginationModel: { pageSize: 25, page: 0 } },
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
    </Box>
  );
}

export default PersonnelListPage;
