import {
  Button,
  InputAdornment,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
} from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import PropTypes from "prop-types";
import useArchivesStyles from "./useArchivesStyles.js";

/** Barre d'outils de la grille : recherche, boutons et filtres. */
export default function ArchivesToolbar({
  search,
  onSearch,
  filters,
  options,
  onFilter,
  onReset,
}) {
  const s = useArchivesStyles().toolbar;

  return (
    <GridToolbarContainer sx={s.container}>
      <Stack direction="row" sx={s.topRow}>
        <TextField
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Rechercher par nom, prénom ou e-mail…"
          size="small"
          inputProps={{
            "aria-label": "Rechercher dans les personnels archivés",
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={s.searchIcon} fontSize="small" />
              </InputAdornment>
            ),
            sx: s.searchInput,
          }}
          sx={s.search}
        />
       <Stack direction="row" sx={s.buttons}>
  <GridToolbarColumnsButton sx={s.button} />
  <GridToolbarDensitySelector sx={s.button} />
  <GridToolbarExport
    sx={s.button}
    csvOptions={{
      fileName: "export_archives",
      delimiter: ";",
      utf8WithBom: true,
      allColumns: true,
    }}
    printOptions={{ disableToolbarButton: true }}
  />
</Stack>
      </Stack>

      <Stack direction="row" sx={s.filterRow}>
        <Typography sx={s.filterLabel}>Filtrer :</Typography>

        <Select
          size="small"
          displayEmpty
          value={filters.year}
          onChange={(e) => onFilter("year", e.target.value)}
          inputProps={{ "aria-label": "Année de sortie" }}
          sx={s.select}
        >
          <MenuItem value="">Année : toutes</MenuItem>
          {options.years.map((y) => (
            <MenuItem key={y} value={y}>
              {y}
            </MenuItem>
          ))}
        </Select>

        <Select
          size="small"
          displayEmpty
          value={filters.dept}
          onChange={(e) => onFilter("dept", e.target.value)}
          inputProps={{ "aria-label": "Département" }}
          sx={s.select}
        >
          <MenuItem value="">Département : tous</MenuItem>
          {options.depts.map((d) => (
            <MenuItem key={d} value={d}>
              {d}
            </MenuItem>
          ))}
        </Select>

        <Select
          size="small"
          displayEmpty
          value={filters.service}
          onChange={(e) => onFilter("service", e.target.value)}
          inputProps={{ "aria-label": "Service" }}
          sx={s.select}
        >
          <MenuItem value="">Service : tous</MenuItem>
          {options.services.map((sv) => (
            <MenuItem key={sv} value={sv}>
              {sv}
            </MenuItem>
          ))}
        </Select>

        <Button onClick={onReset} sx={s.resetButton}>
          Réinitialiser
        </Button>
      </Stack>
    </GridToolbarContainer>
  );
}

ArchivesToolbar.propTypes = {
  search: PropTypes.string,
  onSearch: PropTypes.func,
  filters: PropTypes.object,
  options: PropTypes.object,
  onFilter: PropTypes.func,
  onReset: PropTypes.func,
};