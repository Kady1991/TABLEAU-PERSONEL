import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Box,
  Button,
  Typography,
  Chip,
  Tooltip,
  IconButton,
  useTheme,
} from "@mui/material";
import {
  DataGrid,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from "@mui/x-data-grid";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Alert, Snackbar } from "@mui/material";
import {
  departementService,
  serviceService,
  sousServiceService,
} from "../../services/AffectationsService";
import {
  getGridType,
  getAddLabel,
  getGridTitle,
} from "./helpers/affectationHelpers";

// ── Chips ─────────────────────────────────────────────────────────────────────
function ServicesChip({ value }) {
  const theme = useTheme();
  return (
    <Chip
      label={`${value ?? 0} svc`}
      size="small"
      sx={{
        fontSize: 10,
        bgcolor: `${theme.palette.primary.main}10`,
        color: theme.palette.primary.main,
      }}
    />
  );
}

function SousServicesChip({ value }) {
  const theme = useTheme();
  return (
    <Chip
      label={`${value ?? 0} SS`}
      size="small"
      sx={{
        fontSize: 10,
        bgcolor: `${theme.palette.secondary.main}15`,
        color: theme.palette.secondary.main,
      }}
    />
  );
}

// ── ActionsCell ───────────────────────────────────────────────────────────────
function ActionsCell({ row, onEdit, onDelete, gridType }) {
  const theme = useTheme();
  return (
    <Box
      sx={{ display: "flex", gap: 0.5, alignItems: "center", height: "100%" }}
    >
      <Tooltip title="Modifier">
        <IconButton
          size="small"
          onClick={() => onEdit(row, gridType)}
          sx={{
            color: theme.palette.secondary.main,
            bgcolor: `${theme.palette.secondary.main}10`,
            borderRadius: 1,
            "&:hover": { bgcolor: `${theme.palette.secondary.main}30` },
          }}
        >
          <EditIcon sx={{ fontSize: 14 }} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Supprimer">
        <IconButton
          size="small"
          onClick={() => onDelete(row)}
          sx={{
            color: theme.palette.error.main,
            bgcolor: `${theme.palette.error.light}20`,
            borderRadius: 1,
            "&:hover": { bgcolor: `${theme.palette.error.light}40` },
          }}
        >
          <DeleteIcon sx={{ fontSize: 14 }} />
        </IconButton>
      </Tooltip>
    </Box>
  );
}

// ── Toolbar ───────────────────────────────────────────────────────────────────
function CustomToolbar({ label, onAdd, csvOptions }) {
  return (
    <GridToolbarContainer
      sx={{
        px: 1.5,
        py: 1,
        borderBottom: "1px solid",
        borderColor: "divider",
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
    >
      <GridToolbarColumnsButton sx={{ fontSize: 12 }} />
      <GridToolbarFilterButton sx={{ fontSize: 12 }} />
      <GridToolbarDensitySelector sx={{ fontSize: 12 }} />
      <GridToolbarExport
        sx={{ fontSize: 12 }}
        csvOptions={{
          delimiter: ";",
          utf8WithBom: true,
          fileName: csvOptions?.fileName ?? "export",
        }}
        printOptions={{ disableToolbarButton: true }}
      />
      <Box sx={{ flex: 1 }} />
      <GridToolbarQuickFilter
        size="small"
        sx={{ "& input": { fontSize: 12 } }}
      />
    </GridToolbarContainer>
  );
}

// ── getColumns ────────────────────────────────────────────────────────────────
const getColumns = (type, onEdit, onDelete) => {
  const actionsCol = {
    field: "actions",
    headerName: "Actions",
    width: 100,
    sortable: false,
    disableExport: true,
    renderCell: ({ row }) => (
      <ActionsCell
        row={row}
        onEdit={onEdit}
        onDelete={onDelete}
        gridType={type}
      />
    ),
  };

  if (type === "dept" || type === "departement")
    return [
      actionsCol,
      { field: "idDepartement", headerName: "ID", width: 60 },
      {
        field: "nomDepartementFr",
        headerName: "Nom FR",
        flex: 1,
        minWidth: 150,
      },
      {
        field: "nomDepartementNl",
        headerName: "Nom NL",
        flex: 1,
        minWidth: 150,
      },
      {
        field: "nomChefDepartement",
        headerName: "Chef",
        flex: 1,
        minWidth: 150,
        valueGetter: (params) =>
          params?.row?.nomChefDepartement
            ? `${params.row.nomChefDepartement} ${params.row.prenomChefDepartement ?? ""}`.trim()
            : "—",
      },
      {
        field: "services",
        headerName: "Nbr services",
        width: 100,
        renderCell: ({ row }) => <ServicesChip value={row?.services?.length} />,
        valueGetter: (params) => params?.row?.services?.length ?? 0,
      },
    ];

  if (type === "svc" || type === "service")
    return [
      actionsCol,
      { field: "idService", headerName: "ID", width: 60 },
      { field: "nomServiceFr", headerName: "Nom FR", flex: 1, minWidth: 150 },
      { field: "nomServiceNl", headerName: "Nom NL", flex: 1, minWidth: 150 },
      {
        field: "nomChefService",
        headerName: "Chef",
        flex: 1,
        minWidth: 130,
        valueGetter: (params) =>
          params?.row?.nomChefService
            ? `${params.row.nomChefService} ${params.row.prenomChefService ?? ""}`.trim()
            : "—",
      },
      {
        field: "sousServices",
        headerName: "Nbr sous-services",
        width: 110,
        renderCell: ({ row }) => (
          <SousServicesChip value={row?.sousServices?.length} />
        ),
        valueGetter: (params) => params?.row?.sousServices?.length ?? 0,
      },
    ];

  // ── sousservice ───────────────────────────────────────────────────────────
  return [
    actionsCol,
    { field: "idSousService", headerName: "ID", width: 60 },
    { field: "nomSousServiceFr", headerName: "Nom FR", flex: 1, minWidth: 150 },
    { field: "nomSousServiceNl", headerName: "Nom NL", flex: 1, minWidth: 150 },
    {
      field: "nomSousChef",
      headerName: "Chef",
      flex: 1,
      minWidth: 130,
      valueGetter: (params) =>
        params?.row?.nomSousChef
          ? `${params.row.nomSousChef} ${params.row.prenomSousChef ?? ""}`.trim()
          : "—",
    },
  ];
};

// ── Composant principal ───────────────────────────────────────────────────────
function AffectationsGrid({
  selection,
  breadcrumb = [],
  onEdit,
  onAdd,
  refreshKey,
  onClearSelection,
  onRefresh,
  onShowAll,
}) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const currentType = selection?.type ?? "departement";
  const gridType = getGridType(currentType);
  const addLabel = getAddLabel(currentType);

  const theme = useTheme();
  const id = selection?.id;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      let res;
      if (currentType === "dept" && id)
        res = await serviceService.getByDepartement(id);
      else if (currentType === "svc" && id)
        res = await sousServiceService.getByService(id);
      else if (currentType === "ss" && id)
        res = await sousServiceService.getByParent(id);
      else res = await departementService.getAll();
      setRows(res?.data ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentType, id, refreshKey]);

  useEffect(() => {
    load();
  }, [load]);

  // ✅ FIX — useCallback direct, sans dépendre d'une fonction intermédiaire non mémoïsée
  const handleDeleteCb = useCallback(
    async (row) => {
      if (!window.confirm("Confirmer la suppression ?")) return;
      try {
        if (gridType === "departement")
          await departementService.remove(row?.idDepartement);
        else if (gridType === "service")
          await serviceService.remove(row?.idService);
        else await sousServiceService.remove(row?.idSousService);
        load();
        onRefresh?.();
      } catch (err) {
        const message =
          err?.response?.data?.message ??
          "Une erreur est survenue lors de la suppression.";
        setDeleteError(message);
      }
    },
    [gridType, load, onRefresh],
  );

  const columns = useMemo(
    () => getColumns(gridType, onEdit, handleDeleteCb),
    [gridType, onEdit, handleDeleteCb],
  );

  const getRowId = (row) =>
    row?.idDepartement ?? row?.idService ?? row?.idSousService;

  return (
    <>
      <Snackbar
        open={!!deleteError}
        autoHideDuration={5000}
        onClose={() => setDeleteError(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity="error"
          onClose={() => setDeleteError(null)}
          sx={{ width: "100%" }}
        >
          {deleteError}
        </Alert>
      </Snackbar>
      <Box
        sx={{
          paddingTop: "12px!important",
          paddingBottom: "16px!important",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <Box
          sx={{
            px: 2,
            py: 1,
            borderBottom: "0.5px solid",
            borderColor: "divider",
            display: "flex",
            flexDirection: "row",
            // ✅ FIX — justifyContent au lieu de flexDirection: "space-between"
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Box>
            <Typography
              sx={{ fontSize: 16, fontWeight: 500, color: "text.primary" }}
            >
              {currentType === "dept"
                ? "Services"
                : currentType === "svc"
                  ? "Sous-services"
                  : currentType === "ss"
                    ? "Sous-services enfants"
                    : "Tous les départements"}
            </Typography>
            {breadcrumb.length > 0 && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  flexWrap: "wrap",
                }}
              >
                {breadcrumb.map((crumb, index) => (
                  <Box
                    key={`${crumb.type}-${crumb.id}`}
                    sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                  >
                    {index > 0 && (
                      <Typography sx={{ fontSize: 11, color: "text.disabled" }}>
                        →
                      </Typography>
                    )}
                    <Chip
                      label={crumb.label}
                      size="small"
                      sx={{
                        fontSize: 14,
                        bgcolor:
                          crumb.type === "dept"
                            ? "#E6F1FB"
                            : crumb.type === "svc"
                              ? "#E1F5EE"
                              : "#EEEDFE",
                        color:
                          crumb.type === "dept"
                            ? theme.palette.primary.main
                            : crumb.type === "svc"
                              ? theme.palette.secondary.main
                              : "#534AB7",
                      }}
                    />
                  </Box>
                ))}
              </Box>
            )}
          </Box>
          {onClearSelection && (
            <Button
              size="small"
              variant="contained"
              onClick={onClearSelection}
              sx={{
                ml: "auto",
                textTransform: "none",
                fontSize: 12,
                backgroundColor: theme.palette.secondary.main,
                "&:hover": {
                  bgcolor: `${theme.palette.secondary.main}10`,
                  color: theme.palette.primary.main,
                },
              }}
            >
              Initialiser
            </Button>
          )}
        </Box>

        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={getRowId}
          loading={loading}
          // autoHeight
          disableRowSelectionOnClick
          pageSizeOptions={[15, 25, 50]}
          initialState={{ pagination: { paginationModel: { pageSize: 15 } } }}
          slots={{ toolbar: CustomToolbar }}
          slotProps={{
            toolbar: {
              label: addLabel,
              onAdd: () => onAdd(gridType),
              csvOptions: {
                fileName: `affectations_${currentType}_${new Date().toISOString().slice(0, 10)}`,
              },
            },
          }}
          sx={{
            border: "none",
            "& .MuiDataGrid-columnHeaders": {
              bgcolor: theme.palette.background.default,
              color: theme.palette.primary.main,
              fontWeight: 700,
            },
            "& .MuiDataGrid-row:hover": {
              bgcolor: `${theme.palette.primary.main}08`,
            },
          }}
        />
      </Box>
    </>
  );
}

export default AffectationsGrid;
