import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Stack,
  IconButton,
  Tooltip,
  Snackbar,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddIcon from "@mui/icons-material/Add";
import FormServiceComponent from "../../components/Forms/FormServiceComponent.jsx";
import EditFormComponent from "../../components/Forms/EditFormComponent.jsx";
import DeleteMembreComponent from "../../components/Forms/DeleteMembreComponent.jsx";
import RestoreActionComponent from "../../components/Forms/RestoreActionComponent.jsx";
import AjoutFormComponent from "../../components/Forms/AjoutFormComponent.jsx";
import PersonnelService from "../../services/PersonnelService.js";
import PropTypes from "prop-types";

const isArchived = (v) =>
  v === true || v === 1 || v === "1" || String(v).toLowerCase() === "true";

function TableauComponent({
  compact = false,
  height = 400,
  rowsPreview,
  showHeader = true,
  showAddButton = true,
}) {
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openAdd, setOpenAdd] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    type: "info",
    text: "",
  });

  const sortRows = useCallback((list) => {
    return [...list].sort((a, b) => {
      const aArchived = isArchived(a?.SiArchive) ? 1 : 0;
      const bArchived = isArchived(b?.SiArchive) ? 1 : 0;

      if (aArchived !== bArchived) {
        return aArchived - bArchived;
      }

      if (aArchived === 0) {
        return Number(b?.IDPersonneService ?? 0) - Number(a?.IDPersonneService ?? 0);
      }

      return Number(a?.IDPersonneService ?? 0) - Number(b?.IDPersonneService ?? 0);
    });
  }, []);

  const showToast = useCallback((payload) => {
    setToast({
      open: true,
      type: payload?.type || "info",
      text: payload?.text || "",
    });
  }, []);

  const closeToast = (_, reason) => {
    if (reason === "clickaway") return;
    setToast((prev) => ({ ...prev, open: false }));
  };

  const fetchData = useCallback(async () => {
    try {
      setError("");
      setLoading(true);

      const [personnelsRes, gradesRes, fonctionsRes] = await Promise.all([
        PersonnelService.getAll(),
        PersonnelService.getGrades(),
        PersonnelService.getFonctions(),
      ]);

      const data = Array.isArray(personnelsRes?.data) ? personnelsRes.data : [];
      const grades = Array.isArray(gradesRes?.data) ? gradesRes.data : [];
      const fonctions = Array.isArray(fonctionsRes?.data)
        ? fonctionsRes.data
        : [];

      const enriched = data.map((p) => {
        const gradeId =
          p.WWGradeID ??
          p.IDWWGrade ??
          p.GradeID ??
          p.WWGrade ??
          p.IdWWGrade ??
          p.IdGrade ??
          null;

        const fonctionId =
          p.FonctionID ??
          p.IDFonction ??
          p.IdFonction ??
          null;

        const gradeTrouve =
          grades.find((g) => Number(g.IDWWGrade) === Number(gradeId)) ||
          grades.find((g) => Number(g.WWGradeID) === Number(gradeId)) ||
          grades.find((g) => Number(g.IdWWGrade) === Number(gradeId)) ||
          null;

        const fonctionTrouvee =
          fonctions.find((f) => Number(f.IDFonction) === Number(fonctionId)) ||
          fonctions.find((f) => Number(f.IdFonction) === Number(fonctionId)) ||
          null;

        return {
          ...p,
          NomWWGradeFr:
            p.NomWWGradeFr ??
            p.NomGradeFr ??
            p.LibelleGradeFr ??
            p.GradeLibelle ??
            gradeTrouve?.NomWWGradeFr ??
            gradeTrouve?.NomGradeFr ??
            gradeTrouve?.LibelleGradeFr ??
            "-",

          NomWWGradeNl:
            p.NomWWGradeNl ??
            p.NomGradeNl ??
            p.LibelleGradeNl ??
            gradeTrouve?.NomWWGradeNl ??
            gradeTrouve?.NomGradeNl ??
            gradeTrouve?.LibelleGradeNl ??
            "-",

          NomFonctionFr:
            p.NomFonctionFr ??
            p.LibelleFonctionFr ??
            fonctionTrouvee?.NomFonctionFr ??
            fonctionTrouvee?.LibelleFonctionFr ??
            "-",

          NomFonctionNl:
            p.NomFonctionNl ??
            p.LibelleFonctionNl ??
            fonctionTrouvee?.NomFonctionNl ??
            fonctionTrouvee?.LibelleFonctionNl ??
            "-",
        };
      });

      const finalRows =
        typeof rowsPreview === "number"
          ? sortRows(enriched).slice(0, rowsPreview)
          : sortRows(enriched);

      setRows(finalRows);
    } catch (e) {
      console.error(e);
      setError("Erreur de chargement");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [rowsPreview, sortRows]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const markRowArchived = useCallback((id) => {
    setRows((prev) =>
      sortRows(
        prev.map((row) =>
          String(row?.IDPersonneService) === String(id)
            ? { ...row, SiArchive: true }
            : row
        )
      )
    );
  }, [sortRows]);

  const markRowRestored = useCallback((id) => {
    setRows((prev) =>
      sortRows(
        prev.map((row) =>
          String(row?.IDPersonneService) === String(id)
            ? { ...row, SiArchive: false }
            : row
        )
      )
    );
  }, [sortRows]);

  const handleMemberUpdate = useCallback(async () => {
    await fetchData();
    setOpenAdd(false);
  }, [fetchData]);

  const columns = useMemo(
    () => [
      {
        field: "IDPersonneService",
        headerName: "ID",
        width: 70,
        disableExport: true,
      },
      {
        field: "actions",
        headerName: "Actions",
        width: 230,
        sortable: false,
        filterable: false,
        disableExport: true,
        hideable: false,
        renderCell: (params) => (
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Tooltip title="Voir la fiche">
              <IconButton
                size="small"
                onMouseDown={(event) => event.stopPropagation()}
                onClick={(event) => {
                  event.stopPropagation();
                  navigate(`/Personnels/${params.row.IDPersonneService}`);
                }}
              >
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <FormServiceComponent
              IDPersonneService={params.row.IDPersonneService}
              refreshData={fetchData}
            />

            <EditFormComponent
              IDPersonneService={params.row.IDPersonneService}
              refreshData={fetchData}
            />

            {isArchived(params.row?.SiArchive) ? (
              <RestoreActionComponent
                IDPersonneService={params.row.IDPersonneService}
                nomPersonne={params.row.NomPersonne}
                prenomPersonne={params.row.PrenomPersonne}
                email={params.row.Email}
                refreshData={fetchData}
                onRestoreSuccess={showToast}
                onRestoreLocal={markRowRestored}
              />
            ) : (
              <DeleteMembreComponent
                IDPersonneService={params.row.IDPersonneService}
                nomPersonne={params.row.NomPersonne}
                prenomPersonne={params.row.PrenomPersonne}
                email={params.row.Email}
                refreshData={fetchData}
                onArchiveSuccess={showToast}
                onArchiveLocal={markRowArchived}
              />
            )}
          </Stack>
        ),
      },
      { field: "NomPersonne", headerName: "NOM", width: 180, hideable: false },
      {
        field: "PrenomPersonne",
        headerName: "PRENOM",
        width: 180,
        hideable: false,
      },
      {
        field: "SiFrancaisString",
        headerName: "RÔLE",
        width: 120,
        hideable: false,
      },
      { field: "Email", headerName: "E-mail", width: 220, hideable: false },
      {
        field: "DateEntree",
        headerName: "ENTREE SERVICE",
        width: 150,
        hideable: false,
      },
      { field: "NomFonctionFr", headerName: "FONCTION", width: 200 },
      { field: "NomFonctionNl", headerName: "FONCTION(nl)", width: 200 },
      { field: "NomWWGradeNl", headerName: "GRADE(nl)", width: 200 },
      { field: "NomWWGradeFr", headerName: "GRADE", width: 200 },
      { field: "NomServiceNl", headerName: "AFFECTATION(nl)", width: 250 },
      { field: "NomServiceFr", headerName: "AFFECTATION", width: 250 },
      { field: "NomRueNl", headerName: "LOCALISATION(nl)", width: 200 },
      { field: "NomRueFr", headerName: "LOCALISATION", width: 200 },
      { field: "Numero", headerName: "N°", width: 80 },
      {
        field: "NomChefService",
        headerName: "NOM CHEF DU SERVICE",
        width: 220,
      },
      {
        field: "PrenomChefService",
        headerName: "PRENOM CHEF DU SERVICE",
        width: 220,
      },
      {
        field: "EmailChefService",
        headerName: "E-MAIL CHEF SERVICE",
        width: 240,
      },
      { field: "NomDepartementNl", headerName: "DEPARTEMENT(nl)", width: 220 },
      { field: "NomDepartementFr", headerName: "DEPARTEMENTS", width: 220 },
      {
        field: "NomChefDepartement",
        headerName: "NOM CHEF DEPARTEMENT",
        width: 220,
      },
      {
        field: "PrenomChefDepartement",
        headerName: "PRENOM CHEF DEPARTEMENT",
        width: 220,
      },
      {
        field: "EmailChefDepartement",
        headerName: "E-MAIL CHEF DEPARTEMENT",
        width: 240,
      },
      { field: "P+C:UENSION", headerName: "P+C:UENSION", width: 150 },
      { field: "TelPro", headerName: "TEL", width: 130 },
      { field: "Batiment", headerName: "Batiment", width: 100 },
      { field: "Etage", headerName: "Etage", width: 80 },
      { field: "BatimentNl", headerName: "Batiment(nl)", width: 130 },
    ],
    [navigate, fetchData, showToast, markRowArchived, markRowRestored]
  );

  return (
    <>
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
          refreshData={fetchData}
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
            getRowClassName={(params) =>
              isArchived(params.row?.SiArchive) ? "row-archived" : ""
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
            sx={{
              height: "100%",
              border: "none",
              "& .MuiDataGrid-cell": {
                display: "flex",
                alignItems: "center",
              },
              "& .row-archived": {
                opacity: 0.6,
              },
            }}
            initialState={{
              pagination: {
                paginationModel: { pageSize: compact ? rowsPreview || 5 : 25 },
              },
            }}
          />
        </Box>
      </Box>

      <Snackbar
        open={toast.open}
        autoHideDuration={3500}
        onClose={closeToast}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={closeToast} severity={toast.type} variant="filled">
          {toast.text}
        </Alert>
      </Snackbar>
    </>
  );
}

TableauComponent.propTypes = {
  compact: PropTypes.bool,
  height: PropTypes.number,
  rowsPreview: PropTypes.number,
  showHeader: PropTypes.bool,
  showAddButton: PropTypes.bool,
};

export default TableauComponent;