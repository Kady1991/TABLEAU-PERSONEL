import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Box, Button, Stack, IconButton, Tooltip } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddIcon from "@mui/icons-material/Add";

import FormServiceComponent from "../../components/Forms/FormServiceComponent.jsx";
import EditFormComponent from "../../components/Forms/EditFormComponent.jsx";
import DeleteMembreComponent from "../../components/Forms/DeleteMembreComponent.jsx";
import AjoutFormComponent from "../../components/Forms/AjoutFormComponent.jsx";

import PersonnelService from "../../services/PersonnelService.js";
import PropTypes from "prop-types";

// ✅ helper robuste : true / 1 / "1" / "true"
const isArchived = (v) => v === true || v === 1 || v === "1" || String(v).toLowerCase() === "true";

export default function TableauComponent({
  compact = false,
  height = 400,
  rowsPreview, // ✅ number | undefined
  showHeader = true,
  showAddButton = true,
  nonArchivedOnly = true,

  // mode contrôlé
  rows: rowsProp,
  loading: loadingProp,
  error: errorProp,
  refreshData: refreshDataProp,
}) {
  const navigate = useNavigate();

  // ✅ si la page fournit rows => mode "contrôlé"
  const isControlled = Array.isArray(rowsProp);

  const [rowsState, setRowsState] = useState([]);
  const [loadingState, setLoadingState] = useState(true);
  const [errorState, setErrorState] = useState("");
  const [openAdd, setOpenAdd] = useState(false);

  const rows = isControlled ? rowsProp : rowsState;
  const loading = typeof loadingProp === "boolean" ? loadingProp : loadingState;
  const error = typeof errorProp === "string" ? errorProp : errorState;

  const fetchDataInternal = useCallback(async () => {
    try {
      setErrorState("");
      setLoadingState(true);

      const res = await PersonnelService.getAll();
      const data = Array.isArray(res?.data) ? res.data : [];

      const filtered = nonArchivedOnly ? data.filter((p) => !isArchived(p?.SiArchive)) : data;

      const finalRows =
        typeof rowsPreview === "number" ? filtered.slice(0, rowsPreview) : filtered;

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

  // ✅ si non contrôlé => fetch interne
  useEffect(() => {
    if (!isControlled) fetchDataInternal();
  }, [isControlled, fetchDataInternal]);

  // ✅ après ajout : refresh + fermer
  const handleMemberUpdate = useCallback(
    async (addedMember) => {
      // 1) Ajout immédiat dans l'affichage (si tableau autonome)
      if (!isControlled && addedMember) {
        setRowsState((prev) => {
          const newId = addedMember?.IDPersonneService ?? Date.now();
          const exists = prev.some((r) => String(r?.IDPersonneService) === String(newId));
          if (exists) return prev;

          const next = [{ ...addedMember, IDPersonneService: newId }, ...prev];

          if (typeof rowsPreview === "number") return next.slice(0, rowsPreview);
          return next;
        });
      }

      // 2) Refetch
      await refreshData();

      // 3) Ferme le dialog
      setOpenAdd(false);
    },
    [isControlled, refreshData, rowsPreview],
  );

  const columns = useMemo(
    () => [
      { field: "IDPersonneService", headerName: "ID", width: 70 },
      {
        field: "actions",
        headerName: "Actions",
        width: 220,
        sortable: false,
        filterable: false,
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
      { field: "NomPersonne", headerName: "NOM", width: 180 },
      { field: "PrenomPersonne", headerName: "PRÉNOM", width: 180 },
      { field: "Email", headerName: "E-MAIL", width: 220 },
      { field: "TelPro", headerName: "TEL", width: 130 },
      { field: "SiFrancaisString", headerName: "LANGUE", width: 100 },
      { field: "DateEntree", headerName: "ENTRÉE", width: 150 },
      { field: "NomWWGradeFr", headerName: "GRADE", width: 200 },
      { field: "NomFonctionFr", headerName: "FONCTION", width: 200 },
      { field: "NomServiceFr", headerName: "AFFECTATION", width: 250 },
      { field: "NomRueFr", headerName: "RUE", width: 200 },
      { field: "Numero", headerName: "N°", width: 80 },
      { field: "NomChefService", headerName: "CHEF SERVICE", width: 200 },
      { field: "NomChefDepartement", headerName: "CHEF DEPT", width: 200 },
      { field: "NomDepartementFr", headerName: "DÉPARTEMENT", width: 250 },
      { field: "Batiment", headerName: "BÂTIMENT", width: 100 },
      { field: "Etage", headerName: "ÉTAGE", width: 80 },
    ],
    [navigate, refreshData],
  );

  return (
    <Box
      sx={{
        height: "90%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* ✅ Formulaire ajout intégré */}
      <AjoutFormComponent
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onMemberUpdate={handleMemberUpdate}
        refreshData={refreshData}
      />

      {showHeader && (
        <Stack direction="row" justifyContent="space-between" mb={2}>
          {showAddButton && (
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenAdd(true)}>
              Nouveau Membre
            </Button>
          )}
        </Stack>
      )}

      {error && <Alert severity="error">{error}</Alert>}

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          width: "100%",
          bgcolor: "background.paper",
          height: compact ? height : "calc(90vh - 120px)",
          overflow: "hidden",
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          // ✅ getRowId robuste si ID absent
          getRowId={(row) => row?.IDPersonneService ?? row?.id ?? `${row?.NomPersonne ?? "x"}_${row?.PrenomPersonne ?? "y"}_${Math.random()}`}
          loading={loading}
          checkboxSelection
          disableRowSelectionOnClick
          hideFooter={compact}
          slots={compact ? {} : { toolbar: GridToolbar }}
          slotProps={compact ? {} : { toolbar: { showQuickFilter: true } }}
          sx={{ height: "100%", border: "none" }}
          initialState={{
            pagination: {
              paginationModel: { pageSize: compact ? (rowsPreview || 5) : 25 },
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
  rowsPreview: PropTypes.number, // ✅ CORRIGÉ (c’était array)
  showHeader: PropTypes.bool,
  showAddButton: PropTypes.bool,
  nonArchivedOnly: PropTypes.bool,

  rows: PropTypes.array,
  loading: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  refreshData: PropTypes.func,
};