import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Box, Button, Stack, Typography } from "@mui/material";
import { DataGrid, useGridApiRef } from "@mui/x-data-grid";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import AlertRestoreSuccessComponent from "../../components/Alert/AlertRestoreSuccessComponent.jsx";
import PersonnelLoader from "../../components/Loading/PersonnelLoaderComponent.jsx";

import ArchivesBulkBar from "../../components/Archives/ArchivesBulkBarComponent.jsx";
// import ArchivesLoadingBanner from "../../components/Archives/ArchivesLoadingBannerComponent.jsx";
//import PersonnelLoader from "../../components/Loading/PersonnelLoaderComponent.jsx";
import ArchivesStats from "../../components/Archives/ArchivesStatsComponent.jsx";
import ArchivesToolbar from "../../components/Archives/ArchivesToolbarComponent.jsx";
import { GRID_LOCALE_TEXT } from "../../components/Archives/archivesUtils.js";
import useArchivesColumns from "../../components/Archives/ArchivesColumnsComponent.jsx";
import useArchivesFilters from "../../components/Archives/useArchivesFilters.js";
import useArchivesStyles from "../../components/Archives/useArchivesStyles.js";
import usePersonnelArchives from "../../components/Archives/usePersonnelArchives.js";

export default function PersonnelArchivesListPage() {
  const navigate = useNavigate();
  const apiRef = useGridApiRef();
  const s = useArchivesStyles();

  // Données + restauration
  const {
    rows,
    loading,
    loadingDates,
    error,
    refreshData,
    markRowRestored,
    restoreInfo,
    handleRestoreSuccess,
    clearRestoreInfo,
  } = usePersonnelArchives();

  // Recherche + filtres
  const {
    search,
    setSearch,
    filters,
    options,
    filteredRows,
    handleFilter,
    handleReset,
  } = useArchivesFilters(rows);

  // Colonnes de la grille
  const columns = useArchivesColumns({
    navigate,
    refreshData,
    onRestoreSuccess: handleRestoreSuccess,
    onRestoreLocal: markRowRestored,
  });

  // Sélection de lignes
  const [selectedIds, setSelectedIds] = useState([]);

  const handleExportSelection = useCallback(() => {
    apiRef.current?.exportDataAsCsv({
      fileName: "export_archives_selection",
      delimiter: ";",
      utf8WithBom: true,
      allColumns: true,
      getRowsToExport: () => selectedIds,
    });
  }, [apiRef, selectedIds]);

  const handleClearSelection = useCallback(() => {
    apiRef.current?.setRowSelectionModel([]);
    setSelectedIds([]);
  }, [apiRef]);

  const openPerson = useCallback(
    (id) => navigate(`/personnels/${id}`),
    [navigate],
  );

  if (error) return <Alert severity="error">{error}</Alert>;
  if (loading) return <PersonnelLoader />;

  return (
    <Box sx={s.page}>
      {/* En-tête */}
      <Stack direction="row" sx={s.header.wrapper}>
        <Box>
          <Typography variant="h1" sx={s.header.title}>
            Personnels archivés
          </Typography>
          <Typography sx={s.header.subtitle}>
            {
              "Consultez, recherchez et restaurez les membres du personnel ayant quitté l'organisation."
            }
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<KeyboardReturnIcon />}
          onClick={() => navigate("/personnels")}
          sx={s.header.backButton}
        >
          Retour
        </Button>
      </Stack>

      <ArchivesStats
        rows={rows}
        loadingDates={loadingDates}
        onOpenPerson={openPerson}
      />

    {/* {loadingDates && <ArchivesLoadingBanner />} */}

      <AlertRestoreSuccessComponent
        info={restoreInfo}
        onClose={clearRestoreInfo}
      />

      {/* Carte du tableau */}
      <Box sx={s.tableCard}>
        <ArchivesBulkBar
          count={selectedIds.length}
          onExport={handleExportSelection}
          onClear={handleClearSelection}
        />

        <Box sx={s.gridWrapper}>
          <DataGrid
            apiRef={apiRef}
            rows={filteredRows}
            columns={columns}
            getRowId={(row) => row?.IDPersonneService ?? row?.id}
            checkboxSelection
            disableRowSelectionOnClick
            disableColumnReorder
            localeText={GRID_LOCALE_TEXT}
            onRowSelectionModelChange={(model) =>
              setSelectedIds(
                Array.isArray(model) ? model : [...(model?.ids ?? [])],
              )
            }
            slots={{ toolbar: ArchivesToolbar }}
            slotProps={{
              toolbar: {
                search,
                onSearch: setSearch,
                filters,
                options,
                onFilter: handleFilter,
                onReset: handleReset,
              },
            }}
            initialState={{
              pagination: { paginationModel: { pageSize: 25 } },
              sorting: { sortModel: [{ field: "DateSortie", sort: "desc" }] },
              columns: {
                columnVisibilityModel: {
                  NomFonctionFr: false,
                  NomWWGradeFr: false,
                  NomRueFr: false,
                  TelPro: false,
                },
              },
            }}
            pageSizeOptions={[10, 25, 50, 100]}
            sx={s.gridSx}
          />
        </Box>
      </Box>
    </Box>
  );
}