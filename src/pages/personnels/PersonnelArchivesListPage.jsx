import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Box, Button, Stack, Typography } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import { Tooltip } from "@mui/material";

import dayjs from "dayjs";
import axios from "axios";
import { XMLParser } from "fast-xml-parser";
import PersonnelService from "../../services/PersonnelService.js";
import RestoreActionComponent from "../../components/Forms/RestoreActionComponent.jsx";
import { LIEN_API_PERSONNE } from "../../config";

const CACHE_KEY = "personnels_archives_cache_v2_dates";

function PersonnelArchivesListPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const safeFormatDate = (value) => {
    if (!value) return "";
    const d = dayjs(value);
    return d.isValid() ? d.format("DD/MM/YYYY") : "";
  };

  const fetchPersonDatesXml = async (idPersonneService) => {
    try {
      const response = await axios.get(
        `${LIEN_API_PERSONNE}/api/Personne/${idPersonneService}`,
        { headers: { Accept: "application/xml" } }
      );

      if (typeof response.data !== "string") {
        return { DateEntree: "", DateSortie: "" };
      }

      const parser = new XMLParser();
      const jsonData = parser.parse(response.data);
      const view = jsonData?.WhosWhoModelView ?? null;

      return {
        DateEntree: view?.DateEntree ?? "",
        DateSortie: view?.DateSortie ?? "",
      };
    } catch {
      return { DateEntree: "", DateSortie: "" };
    }
  };

  const load = async ({ force = false } = {}) => {
    try {
      setLoading(true);
      setError("");

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
      const archived = all.filter((p) => p?.SiArchive === true);

      const enriched = await Promise.all(
        archived.map(async (p) => {
          const dates = await fetchPersonDatesXml(p.IDPersonneService);
          return {
            ...p,
            DateEntree: dates.DateEntree || p.DateEntree || "",
            DateSortie: dates.DateSortie || p.DateSortie || "",
          };
        })
      );

      setRows(enriched);
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(enriched));
    } catch (e) {
      setError(e?.message || "Erreur chargement archives");
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
      

      { field: "IDPersonneService", headerName: "ID", width: 90 },
      { field: "NomPersonne", headerName: "NOM", width: 220 },
      { field: "PrenomPersonne", headerName: "PRÉNOM", width: 220 },
      { field: "Email", headerName: "E-mail", width: 280 },

      {
        field: "DateEntree",
        headerName: "DATE D'ENTRÉE",
        width: 170,
        renderCell: (params) => safeFormatDate(params?.value),
      },
      {
        field: "DateSortie",
        headerName: "DATE DE SORTIE",
        width: 170,
        renderCell: (params) => safeFormatDate(params?.value),
      },
      {
        field: "actions",
        headerName: "Actions",
        width: 100,
        sortable: false,
        renderCell: (params) => (
          <Box sx={{ display: "flex", justifyContent: "flex-end", width: "50%" }}>
            <RestoreActionComponent
              PersonneID={params.row.PersonneID}
              nomPersonne={params.row.NomPersonne}
              prenomPersonne={params.row.PrenomPersonne}
              email={params.row.Email}
              refreshData={refreshData}
            />
          </Box>
        ),
      },
    ],
    []
  );

  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" fontWeight={700}>
          Personnels archivés
        </Typography>

       <Tooltip title="Retour à la liste des personnels" arrow>
  <Button
    variant="contained"
    size="small"
    startIcon={<KeyboardReturnIcon />}
    onClick={() => navigate("/personnels")}
  >
    Retour
  </Button>
</Tooltip>
      </Stack>

      <Box sx={{ width: "100%", height: "calc(100vh - 220px)" }}>
        <DataGrid
          rows={rows || []}
          columns={columns}
          getRowId={(row) => row.IDPersonneService}
          loading={loading}
          disableRowSelectionOnClick
          checkboxSelection
          showCellRightBorder
          showColumnRightBorder
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
    </Box>
  );
}

export default PersonnelArchivesListPage;