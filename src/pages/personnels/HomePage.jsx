import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types"; // ✅ Correction : Import de PropTypes
import {
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import TableauComponent from "../../components/Tableau/TableauComponent.jsx";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import ArchiveIcon from "@mui/icons-material/Archive";
import AssessmentIcon from "@mui/icons-material/Assessment";
import AddIcon from "@mui/icons-material/Add";

import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

import PersonnelService from "../../services/PersonnelService";

// ✅ on réutilise le même tableau


const CACHE_KEY = "home_personnels_actifs_cache_v1";

/**
 * ✅ Correction ESLint : Validation des props pour StatCard
 */
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

            {right ? <Box sx={{ flexShrink: 0 }}>{right}</Box> : null}
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

// ✅ Définition des types attendus pour StatCard
StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  icon: PropTypes.node,
  onClick: PropTypes.func,
  right: PropTypes.node,
};

function HomePage() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({ actifs: 0, archives: 0 });
  const [loadingStats, setLoadingStats] = useState(true);
  const [error, setError] = useState("");

  const loadStats = async ({ force = false } = {}) => {
    try {
      setLoadingStats(true);
      setError("");

      if (!force) {
        const cached = sessionStorage.getItem(CACHE_KEY);
        if (cached) {
          const actifsCached = JSON.parse(cached);
          setStats((p) => ({ ...p, actifs: actifsCached.length }));
          setLoadingStats(false);

          try {
            const res = await PersonnelService.getAll();
            const all = Array.isArray(res.data) ? res.data : [];
            const archives = all.filter((p) => p?.SiArchive === true).length;
            const actifs = all.filter((p) => p?.SiArchive !== true).length;

            setStats({ actifs, archives });
            sessionStorage.setItem(CACHE_KEY, JSON.stringify(all.filter((p) => p?.SiArchive !== true)));
          } catch { /* ignore */ }
          return;
        }
      }

      const res = await PersonnelService.getAll();
      const all = Array.isArray(res.data) ? res.data : [];
      const actifs = all.filter((p) => p?.SiArchive !== true);
      const archives = all.filter((p) => p?.SiArchive === true);

      setStats({ actifs: actifs.length, archives: archives.length });
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(actifs));
    } catch (e) {
      setError(e?.message || "Erreur lors du chargement des personnels");
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <Box>
      <Box
        sx={{
          display: "grid",
          gap: 4,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            lg: "1fr 1fr 1fr ",
          },
          mb: 2,
        }}
      >
        {/* <StatCard
          title="Nouveau"
          subtitle="Ajouter un nouveau membre"
          icon={<AddIcon fontSize="small" />}
          onClick={() => navigate("/Personnels/new")}
        /> */}

        <StatCard
          title="Personnels"
          subtitle="Liste des personnels actifs"
          icon={<PeopleAltIcon fontSize="small" />}
          onClick={() => navigate("/Personnels")}
          right={
            <Typography variant="body2" fontWeight={800}>
              {loadingStats ? "…" : stats.actifs}
            </Typography>
          }
        />

        <StatCard
          title="Archives"
          subtitle="Personnels archivés"
          icon={<ArchiveIcon fontSize="small" />}
          onClick={() => navigate("/Personnels/archives")} // ✅ Majuscule harmonisée
          right={
            <Typography variant="body2" fontWeight={800}>
              {loadingStats ? "…" : stats.archives}
            </Typography>
          }
        />

        <StatCard
          title="Statistiques"
          subtitle="Vue globale"
          icon={<AssessmentIcon fontSize="small" />}
          onClick={() => navigate("/Personnels/statistics")} // ✅ Majuscule harmonisée
          right={
            <Stack spacing={0.2} alignItems="flex-end">
              <Stack direction="row" spacing={1} alignItems="center">
                <ArrowDownwardIcon sx={{ fontSize: 20, color: "success.main" }} />
                <Typography
                  variant="caption"
                  sx={{ fontWeight: 800, color: "success.main" }}
                >
                  {loadingStats ? "…" : stats.actifs}
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1.9} alignItems="center">
                <ArrowUpwardIcon sx={{ fontSize: 20, color: "error.main" }} />
                <Typography
                  variant="caption"
                  sx={{ fontWeight: 800, color: "error.main" }}
                >
                  {loadingStats ? "…" : stats.archives}
                </Typography>
              </Stack>
            </Stack>
          }
        />
      </Box>

      <Card variant="outlined">
        <CardContent sx={{ height: 500 }} >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={1}
          >
            <Typography fontWeight={700}>
              Liste du personnel actif
            </Typography>
            <Button size="small" onClick={() => navigate("/Personnels")}>
              Ouvrir en plein écran
            </Button>
          </Stack>

          <Divider sx={{ mb: 2 }} />

          {error && <Alert severity="error">{error}</Alert>}

         
  <TableauComponent
  compact
  rowsPreview={5}
  showHeader
  showAddButton
/>
        </CardContent>
      </Card>
    </Box>
  );
}

export default HomePage;