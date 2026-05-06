import { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Stack,
  Tooltip,
  Typography,
  Button,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/fr";
import { XMLParser } from "fast-xml-parser";
import PersonnelService from "../../services/PersonnelService.js";
import RestoreActionComponent from "../../components/Forms/RestoreActionComponent.jsx";
import PropTypes from "prop-types";
dayjs.extend(relativeTime);
dayjs.locale("fr");

const CACHE_KEY = "personnels_archives_cache_v2_dates";
const PRIMARY = "#003B68";
const TEAL = "#02B2AF";
const RED = "#c0392b";
const GRAY = "#5c6b7a";

const isArchived = (v) =>
  v === true || v === 1 || String(v).toLowerCase() === "true";

const safeFormat = (val) => {
  if (!val) return "";
  const d = dayjs(val);
  return d.isValid() ? d.format("DD/MM/YYYY") : "";
};

KpiCard.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  sub: PropTypes.string,
  color: PropTypes.string,
};

// ── Fetch dates XML ───────────────────────────────────────────────────────────
const fetchPersonDatesXml = async (id) => {
  try {
    const res = await PersonnelService.getPersonXmlByIdProd(id);
    if (typeof res.data !== "string") return { DateEntree: "", DateSortie: "" };
    const parser = new XMLParser();
    const json = parser.parse(res.data);
    const view = json?.WhosWhoModelView ?? null;
    return {
      DateEntree: view?.DateEntree ?? "",
      DateSortie: view?.DateSortie ?? "",
    };
  } catch {
    return { DateEntree: "", DateSortie: "" };
  }
};

// ── KPI Card ──────────────────────────────────────────────────────────────────
function KpiCard({ label, value, sub, color }) {
  return (
    <Card variant="outlined" sx={{ borderRadius: "12px", height: "100%" }}>
      <CardContent sx={{ p: "1rem 1.25rem !important" }}>
        <Typography sx={{ fontSize: 12, fontWeight: 600, color: GRAY, mb: 0.5 }}>
          {label}
        </Typography>
        <Typography
          noWrap
          sx={{
            fontSize: typeof value === "string" && value.length > 8 ? 16 : 24,
            fontWeight: 700,
            color: color ?? PRIMARY,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {value}
        </Typography>
        {sub && (
          <Typography sx={{ fontSize: 11, color: GRAY, mt: 0.5 }}>{sub}</Typography>
        )}
      </CardContent>
    </Card>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function PersonnelArchivesListPage() {
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingDates, setLoadingDates] = useState(false);
  const [error, setError] = useState("");

  // ── Chargement ──────────────────────────────────────────────────────────────
  const load = useCallback(async ({ force = false } = {}) => {
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

      // Étape 1 : affiche les archivés immédiatement
      const res = await PersonnelService.getAll();
      const all = Array.isArray(res.data) ? res.data : [];
      const archived = all
        .filter((p) => isArchived(p?.SiArchive))
        .sort((a, b) => Number(b.IDPersonneService) - Number(a.IDPersonneService));

      setRows(archived);
      setLoading(false);

      // Étape 2 : enrichit avec les dates XML
      setLoadingDates(true);
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

      // Re-trie après enrichissement
      const sorted = [...enriched].sort(
        (a, b) => Number(b.IDPersonneService) - Number(a.IDPersonneService)
      );

      setRows(sorted);
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(sorted));
    } catch (e) {
      setError(e?.message || "Erreur chargement archives");
      setLoading(false);
    } finally {
      setLoadingDates(false);
    }
  }, []);

  useEffect(() => {
    sessionStorage.removeItem(CACHE_KEY);
    load({ force: true });
  }, [load]);

  const refreshData = useCallback(async () => {
    sessionStorage.removeItem(CACHE_KEY);
    await load({ force: true });
  }, [load]);

  // ── KPIs ────────────────────────────────────────────────────────────────────
  const thisYear = dayjs().year();

  const departsThisYear = useMemo(
    () =>
      rows.filter((r) => {
        const dateRef = r?.DateSortie || r?.DateEntree;
        return dateRef && dayjs(dateRef).year() === thisYear;
      }).length,
    [rows, thisYear]
  );

  const lastArchived = useMemo(
    () =>
      [...rows].sort(
        (a, b) => Number(b.IDPersonneService) - Number(a.IDPersonneService)
      )[0] ?? null,
    [rows]
  );

  // ── Colonnes DataGrid ───────────────────────────────────────────────────────
  const columns = useMemo(
    () => [
      {
        field: "IDPersonneService",
        headerName: "ID",
        width: 80,
      },
      {
        field: "actions",
        headerName: "Actions",
        width: 120,
        sortable: false,
        filterable: false,
        disableExport: true,
        hideable: false,
        renderCell: (params) => (
          <Stack direction="row" alignItems="center">
            <RestoreActionComponent
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
      { field: "PrenomPersonne", headerName: "PRÉNOM", width: 180, hideable: false },
      { field: "Email", headerName: "E-MAIL", width: 260, hideable: false },
      { field: "NomDepartementFr", headerName: "DÉPARTEMENT", width: 220 },
      { field: "NomServiceFr", headerName: "SERVICE", width: 220 },
      {
        field: "DateEntree",
        headerName: "DATE D'ENTRÉE",
        width: 160,
        renderCell: (params) => safeFormat(params.value) || "-",
      },
      {
        field: "DateSortie",
        headerName: "DATE DE SORTIE",
        width: 160,
        renderCell: (params) => safeFormat(params.value) || "-",
      },
      { field: "NomFonctionFr", headerName: "FONCTION", width: 220 },
      { field: "NomWWGradeFr", headerName: "GRADE", width: 200 },
      { field: "NomRueFr", headerName: "LOCALISATION", width: 200 },
      { field: "TelPro", headerName: "TÉL", width: 130 },
    ],
    [refreshData]
  );

  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box sx={{ fontFamily: "Roboto, Arial, sans-serif" }}>

      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography sx={{ fontSize: 25, fontWeight: 700, color: PRIMARY ,}}>
          Personnels archivés
        </Typography>
        <Tooltip title="Retour à la liste" arrow>
          <Button
            variant="outlined"
            size="small"
            startIcon={<KeyboardReturnIcon />}
            onClick={() => navigate("/personnels")}
            sx={{
              borderRadius: "10px",
              fontWeight: 600,
              textTransform: "none",
              color: PRIMARY,
              borderColor: "rgba(0,59,104,0.25)",
            }}
          >
            Retour
          </Button>
        </Tooltip>
      </Stack>

      {/* KPIs */}
      <Grid container spacing={1.5} mb={3}>
        <Grid item xs={12} sm={4}>
          <KpiCard
            label="Total archivés"
            value={loading ? "…" : rows.length}
            sub="membres archivés"
            color={PRIMARY}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <KpiCard
            label="Cette année"
            value={loading ? "…" : departsThisYear}
            sub={`départs en ${thisYear}`}
            color={RED}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <KpiCard
            label="Dernière archive"
            value={
              loading || loadingDates
                ? "…"
                : lastArchived
                ? `${lastArchived.NomPersonne ?? ""} ${lastArchived.PrenomPersonne ?? ""}`.trim()
                : "-"
            }
            sub={
              lastArchived
                ? safeFormat(lastArchived.DateSortie || lastArchived.DateEntree)
                : ""
            }
            color={TEAL}
          />
        </Grid>
      </Grid>

      {/* Bannière chargement dates */}
      {loadingDates && (
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          mb={1.5}
          px={2}
          py={0.8}
          sx={{
            background: "#e0f7f7",
            borderRadius: "10px",
            border: "1px solid rgba(2,178,175,0.2)",
          }}
        >
          <CircularProgress size={12} sx={{ color: TEAL }} />
          <Typography sx={{ fontSize: 12, color: "#007a78" }}>
            Chargement des dates en cours…
          </Typography>
        </Stack>
      )}

      {/* DataGrid */}
      <Box sx={{
  height: "calc(100vh - 320px)",
  bgcolor: "background.paper",
  borderRadius: "12px",
  border: "1px solid rgba(0,0,0,0.08)",
  overflow: "hidden",
}}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row?.IDPersonneService ?? row?.id}
          loading={loading}
          checkboxSelection
          disableRowSelectionOnClick
          disableColumnReorder
          slots={{ toolbar: GridToolbar }}
          slotProps={{
            toolbar: {
              showQuickFilter: true,
              csvOptions: {
                fileName: "export_archives",
                delimiter: ";",
                utf8WithBom: true,
                allColumns: true,
              },
              printOptions: {
                disableToolbarButton: true,
              },
            },
          }}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 25 },
            },
          }}
          pageSizeOptions={[10, 25, 50, 100]}
          sx={{
            border: "none",
            "& .MuiDataGrid-cell": {
              display: "flex",
              alignItems: "center",
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