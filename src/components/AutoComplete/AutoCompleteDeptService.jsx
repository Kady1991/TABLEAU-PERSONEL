import { useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import {
  Autocomplete,
  TextField,
  Box,
  Stack,
  Typography,
  IconButton,
  Chip,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

const clean = (s) => (s ? String(s).trim() : "");
const GLOBAL_LABEL = "Global (tous)";

function AutoCompleteDeptService({
  personnes = [],
  value = "",
  onChange,
  onSelect,
  loading = false,
  width = 560,
  label = "Rechercher",
  placeholder = "Département ou service…",
}) {
  const [expandedDepts, setExpandedDepts] = useState([]);

  // pour empêcher la sélection quand on clique la flèche
  const ignoreNextSelectRef = useRef(false);

  // selection interne (comme ton autre autocomplete)
  const [selected, setSelected] = useState(null);

  const { departments, servicesByDept } = useMemo(() => {
    const map = new Map();

    personnes.forEach((p) => {
      const dept = clean(p?.NomDepartementFr) || "Sans département";
      const svc = clean(p?.NomServiceFr) || "Sans service";
      if (!map.has(dept)) map.set(dept, new Set());
      map.get(dept).add(svc);
    });

    const departments = Array.from(map.keys()).sort((a, b) =>
      a.localeCompare(b, "fr"),
    );

    const servicesByDept = {};
    departments.forEach((d) => {
      servicesByDept[d] = Array.from(map.get(d) || []).sort((a, b) =>
        a.localeCompare(b, "fr"),
      );
    });

    return { departments, servicesByDept };
  }, [personnes]);

  // options visibles : global + dept + (services si dept déplié OU recherche)
  const options = useMemo(() => {

  const total = personnes.length;

  const opts = [
    {
      label: GLOBAL_LABEL,
      type: "global",
      count: total,
    },
  ];

    const search = value.trim().toLowerCase();
    const isSearchActive = search.length > 0;

    departments.forEach((dept) => {
      const services = servicesByDept[dept] || [];
      opts.push({
        label: dept,
        type: "dept",
        count: services.length,
      });

      const isExpanded = expandedDepts.includes(dept);

      if (isExpanded || isSearchActive) {
        services.forEach((svc) => {
          if (!isSearchActive || svc.toLowerCase().includes(search)) {
            opts.push({
              label: svc,
              type: "service",
              parentDept: dept,
            });
          }
        });
      }
    });

    return opts;
  }, [departments, servicesByDept, expandedDepts, value]);

  const toggleDept = (dept) => {
    setExpandedDepts((prev) =>
      prev.includes(dept) ? prev.filter((d) => d !== dept) : [...prev, dept],
    );
  };

  return (
    <Box sx={{ width, maxWidth: "100%" }}>
      <Autocomplete
        openOnFocus
        disableListWrap
        loading={loading}
        options={options}
        getOptionLabel={(opt) => opt?.label || ""}
        isOptionEqualToValue={(a, b) =>
          a?.type === b?.type && a?.label === b?.label && a?.parentDept === b?.parentDept
        }
        filterOptions={(x) => x} // on gère nous-mêmes
        value={selected}
        onChange={(_, newVal) => {
          // si clic sur flèche => ne pas sélectionner
          if (ignoreNextSelectRef.current) {
            ignoreNextSelectRef.current = false;
            return;
          }

          if (!newVal) return;

          // transmettre
          onSelect?.(newVal);

          // vider le champ (UX)
          setSelected(null);
          onChange?.("");
        }}
        inputValue={value}
        onInputChange={(_, v, reason) => {
          if (reason === "reset") return;
          onChange?.(v);
        }}
        onOpen={() => {
          setSelected(null);
          onChange?.("");
        }}
        noOptionsText={loading ? "Chargement…" : "Aucun résultat"}
        renderOption={(liProps, option) => {
          // clé stable
          const keyBase =
            option.type === "service"
              ? `svc_${option.parentDept}_${option.label}`
              : `${option.type}_${option.label}`;
          const safeKey = `${keyBase}__${liProps.id}`;

          // GLOBAL
       if (option.type === "global") {
  return (
    <li {...liProps} key={safeKey}>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          py: 0.5,
        }}
      >
        <Typography sx={{ fontWeight: 600, color: "#0f172a" }}>
          {option.label}
        </Typography>

        <Chip
          label={`${option.count || 0}`}
          size="small"
          variant="outlined"
          sx={{ height: 15, fontSize: "0.60rem" }}
        />
      </Box>
    </li>
  );
}
          // DEPARTEMENT
          if (option.type === "dept") {
            const isExpanded = expandedDepts.includes(option.label);

            return (
              <li {...liProps} key={safeKey}>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    py: 0.5,
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="center">
                    <IconButton
                      size="small"
                      onMouseDown={(evt) => {
                        evt.preventDefault();
                        evt.stopPropagation();
                        ignoreNextSelectRef.current = true;
                        toggleDept(option.label);
                      }}
                      sx={{ p: 0.5, color: "#5594b1" }}
                    >
                      {isExpanded ? (
                        <KeyboardArrowDownIcon fontSize="small" />
                      ) : (
                        <KeyboardArrowRightIcon fontSize="small" />
                      )}
                    </IconButton>

                    {/*  le dept reste sélectionnable au clic sur le texte */}
                    <Typography sx={{ fontWeight: 600, color: "#0f172a" }}>
                      {option.label}
                    </Typography>
                  </Stack>

                  <Chip
                    label={`${option.count || 0} services`}
                    size="small"
                    variant="outlined"
                    sx={{ height: 15, fontSize: "0.65rem" }}
                  />
                </Box>
              </li>
            );
          }

          // SERVICE ( UNIQUEMENT LE NOM DU SERVICE, sans répéter le département)
          return (
            <li {...liProps} key={safeKey}>
              <Box
                sx={{
                  width: "100%",
                  pl: 6,
                  py: 0.4,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    width: 6,
                    height: 6,
                    borderRadius: 999,
                    bgcolor: "#5594b1",
                    flexShrink: 0,
                  }}
                />
                <Typography sx={{ fontWeight: 600, color: "#334155" }}>
                  {option.label}
                </Typography>
              </Box>
            </li>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            placeholder={placeholder}
            variant="outlined"
            size="small"
          />
        )}
      />
    </Box>
  );
}

AutoCompleteDeptService.propTypes = {
  personnes: PropTypes.array,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onSelect: PropTypes.func,
  loading: PropTypes.bool,
  width: PropTypes.number,
  label: PropTypes.string,
  placeholder: PropTypes.string,
};

export default AutoCompleteDeptService;