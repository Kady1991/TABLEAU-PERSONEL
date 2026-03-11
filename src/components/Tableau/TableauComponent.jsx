import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Stack,
  IconButton,
  Tooltip,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddIcon from "@mui/icons-material/Add";

import FormServiceComponent from "../../components/Forms/FormServiceComponent.jsx";
import EditFormComponent from "../../components/Forms/EditFormComponent.jsx";
import DeleteMembreComponent from "../../components/Forms/DeleteMembreComponent.jsx";
import AjoutFormComponent from "../../components/Forms/AjoutFormComponent.jsx";

import PersonnelService from "../../services/PersonnelService.js";
import PropTypes from "prop-types";

// helper robuste : true / 1 / "1" / "true"
const isArchived = (v) =>
  v === true || v === 1 || v === "1" || String(v).toLowerCase() === "true";

function TableauComponent({
  compact = false,
  height = 400,
  rowsPreview,
  showHeader = true,
  showAddButton = true,
  nonArchivedOnly = true,

  rows: rowsProp,
  loading: loadingProp,
  error: errorProp,
  refreshData: refreshDataProp,
}) {
  const navigate = useNavigate();

  const isControlled = Array.isArray(rowsProp);

  const [rowsState, setRowsState] = useState([]);
  const [loadingState, setLoadingState] = useState(true);
  const [errorState, setErrorState] = useState("");
  const [openAdd, setOpenAdd] = useState(false);

  const rows = isControlled ? rowsProp : rowsState;
  const loading =
    typeof loadingProp === "boolean" ? loadingProp : loadingState;
  const error =
    typeof errorProp === "string" ? errorProp : errorState;

  const fetchDataInternal = useCallback(async () => {
    try {
      setErrorState("");
      setLoadingState(true);

      const res = await PersonnelService.getAll();
      const data = Array.isArray(res?.data) ? res.data : [];

      const filtered = nonArchivedOnly
        ? data.filter((p) => !isArchived(p?.SiArchive))
        : data;

      const finalRows =
        typeof rowsPreview === "number"
          ? filtered.slice(0, rowsPreview)
          : filtered;

      setRowsState(finalRows);
    } catch (e) {
      console.error(e);
      setErrorState("Erreur de chargement");
      setRowsState([]);
    } finally {
      setLoadingState(false);
    }
  }, [nonArchivedOnly, rowsPreview]);

  const refreshData = useCallback(async () => {
    if (typeof refreshDataProp === "function") {
      await refreshDataProp();
      return;
    }
    await fetchDataInternal();
  }, [refreshDataProp, fetchDataInternal]);

  useEffect(() => {
    if (!isControlled) {
      fetchDataInternal();
    }
  }, [isControlled, fetchDataInternal]);

  const handleMemberUpdate = useCallback(
    async (addedMember) => {
      if (!isControlled && addedMember) {
        setRowsState((prev) => {
          const newId = addedMember?.IDPersonneService ?? Date.now();
          const exists = prev.some(
            (r) => String(r?.IDPersonneService) === String(newId)
          );

          if (exists) return prev;

          const next = [{ ...addedMember, IDPersonneService: newId }, ...prev];

          if (typeof rowsPreview === "number") {
            return next.slice(0, rowsPreview);
          }

          return next;
        });
      }

      await refreshData();
      setOpenAdd(false);
    },
    [isControlled, refreshData, rowsPreview]
  );

const columns = useMemo(() => [
  { field: "IDPersonneService", headerName: "ID", width: 70, disableExport: true },
      {
        field: "actions",
        headerName: "Actions",
        width: 220,
        sortable: false,
        filterable: false,
        disableExport: true,
        hideable: false,
        renderCell: (params) => (
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Tooltip title="Voir la fiche">
              <IconButton
                size="small"
                onClick={() => navigate(`/Personnels/${params.row.IDPersonneService}`)}
              >
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <FormServiceComponent
              IDPersonneService={params.row.IDPersonneService}
              refreshData={refreshData}
            />

            <EditFormComponent
              IDPersonneService={params.row.IDPersonneService}
              refreshData={refreshData}
            />

            <DeleteMembreComponent
              IDPersonneService={params.row.IDPersonneService}
              nomPersonne={params.row.NomPersonne}
              prenomPersonne={params.row.PrenomPersonne}
              email={params.row.Email}
              refreshData={refreshData}
            />
          </Stack>
        ),
      },
  { field: "NomPersonne", headerName: "NOM", width: 180, hideable: false },
  { field: "PrenomPersonne", headerName: "PRENOM", width: 180, hideable: false },
  { field: "SiFrancaisString", headerName: "RÔLE", width: 120, hideable: false },
  { field: "Email", headerName: "E-mail", width: 220, hideable: false },
  { field: "DateEntree", headerName: "ENTREE SERVICE", width: 150, hideable: false },
  { field: "NomWWGradeNl", headerName: "GRADE(nl)", width: 200 },
  { field: "NomWWGradeFr", headerName: "GRADE", width: 200 },
  { field: "NomServiceNl", headerName: "AFFECTATION(nl)", width: 250 },
  { field: "NomServiceFr", headerName: "AFFECTATION", width: 250 },
  { field: "NomRueNl", headerName: "LOCALISATION(nl)", width: 200 },
  { field: "NomRueFr", headerName: "LOCALISATION", width: 200 },
  { field: "Numero", headerName: "N°", width: 80 },
  { field: "NomChefService", headerName: "NOM CHEF DU SERVICE", width: 220 },
  { field: "PrenomChefService", headerName: "PRENOM CHEF DU SERVICE", width: 220 },
  { field: "EmailChefService", headerName: "E-MAIL CHEF SERVICE", width: 240 },
  { field: "NomDepartementNl", headerName: "DEPARTEMENT(nl)", width: 220 },
  { field: "NomDepartementFr", headerName: "DEPARTEMENTS", width: 220 },
  { field: "NomChefDepartement", headerName: "NOM CHEF DEPARTEMENT", width: 220 },
  { field: "PrenomChefDepartement", headerName: "PRENOM CHEF DEPARTEMENT", width: 220 },
  { field: "EmailChefDepartement", headerName: "E-MAIL CHEF DEPARTEMENT", width: 240 },
  { field: "P+C:UENSION", headerName: "P+C:UENSION", width: 150 },
  { field: "TelPro", headerName: "TEL", width: 130 },
  { field: "Batiment", headerName: "Batiment", width: 100 },
  { field: "Etage", headerName: "Etage", width: 80 },
  { field: "BatimentNl", headerName: "Batiment(nl)", width: 130 }

], [navigate]);

  return (
    <Box
      sx={{
        height: "90%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <AjoutFormComponent
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onMemberUpdate={handleMemberUpdate}
        refreshData={refreshData}
      />

      {showHeader && (
        <Stack direction="row" justifyContent="space-between" mb={2}>
          <Stack direction="row" spacing={1}>
            {showAddButton && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenAdd(true)}
              >
                Nouveau Membre
              </Button>
            )}
          </Stack>
        </Stack>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          width: "100%",
          bgcolor: "background.paper",
          height: compact ? height : "calc(100vh - 190px)",
          overflow: "hidden",
        }}
      >
       <DataGrid
  rows={rows}
  columns={columns}
  getRowId={(row) =>
    row?.IDPersonneService ??
    row?.id ??
    `${row?.NomPersonne ?? "x"}_${row?.PrenomPersonne ?? "y"}`
  }
  loading={loading}
  checkboxSelection
  disableRowSelectionOnClick
  disableColumnReorder
  hideFooter={compact}
  slots={compact ? {} : { toolbar: GridToolbar }}
  slotProps={
    compact
      ? {}
      : {
          toolbar: {
            showQuickFilter: true,
            csvOptions: {
              fileName: "export_personnel",
              delimiter: ";",
              utf8WithBom: true,
              allColumns: true,
            },
            printOptions: {
              disableToolbarButton: true,
            },
          },
        }
  }
  sx={{ height: "100%", border: "none" }}
  initialState={{
    pagination: {
      paginationModel: { pageSize: compact ? rowsPreview || 5 : 25 },
    },
    sorting: {
      sortModel: [{ field: "IDPersonneService", sort: "desc" }],
    },
  }}
/>
      </Box>
    </Box>
  );
}

TableauComponent.propTypes = {
  compact: PropTypes.bool,
  height: PropTypes.number,
  rowsPreview: PropTypes.number,
  showHeader: PropTypes.bool,
  showAddButton: PropTypes.bool,
  nonArchivedOnly: PropTypes.bool,
  rows: PropTypes.array,
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  refreshData: PropTypes.func,
};

export default TableauComponent;