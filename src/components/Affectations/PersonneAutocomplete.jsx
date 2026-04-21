import React, { useState, useCallback, useEffect, useMemo } from "react";
import {
  Autocomplete,
  TextField,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { personneService } from "../../services/AffectationsService";
import { debounce } from "@mui/material/utils";

function PersonneAutocomplete({
  value, // { idPersonne, nomPersonne, prenomPersonne, fonction }
  onChange, // (personne) => void
  label, // "Chef de département"
  required = false,
  disabled = false,
  error = false,
  helperText,
}) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputVal, setInputVal] = useState("");

  useEffect(() => {
    if (!value) {
      setInputVal("");
    } else {
      setInputVal(
        `${value.nomPersonne ?? ""} ${value.prenomPersonne ?? ""}`.trim(),
      );
    }
  }, [value]);

  // ✅ FIX — quand une valeur est définie (mode édition) mais absente des options,
  // on l'injecte pour éviter le warning MUI "None of the options match"
  const optionsWithValue = useMemo(() => {
    if (!value) return options;
    const alreadyPresent = options.some(
      (o) => o.idPersonne === value.idPersonne,
    );
    return alreadyPresent ? options : [value, ...options];
  }, [options, value]);

  // ✅ debounce 300ms — évite une requête à chaque frappe
  const search = useCallback(
    debounce(async (q) => {
      if (!q || q.length < 2) {
        setOptions([]);
        return;
      }
      setLoading(true);
      try {
        const res = await personneService.search(q);
        // ✅ FIX — console.log supprimé
        setOptions(res?.data ?? []);
      } catch {
        setOptions([]);
      } finally {
        setLoading(false);
      }
    }, 300),
    [],
  );

  return (
    <Autocomplete
      value={value ?? null}
      inputValue={inputVal}
      options={optionsWithValue}
      loading={loading}
      disabled={disabled}
      isOptionEqualToValue={(opt, val) => opt?.idPersonne === val?.idPersonne}
      getOptionLabel={(opt) =>
        opt ? `${opt.nomPersonne ?? ""} ${opt.prenomPersonne ?? ""}`.trim() : ""
      }
      onInputChange={(_, newInput) => {
        setInputVal(newInput);
        search(newInput);
      }}
      onChange={(_, newValue) => {
        onChange?.(newValue);
        setInputVal(
          newValue
            ? `${newValue.nomPersonne ?? ""} ${newValue.prenomPersonne ?? ""}`.trim()
            : "",
        );
      }}
      renderOption={(props, opt) => (
        <Box component="li" {...props} key={opt.idPersonne}>
          <Box>
            <Typography sx={{ fontSize: 13, fontWeight: 500 }}>
              {opt.nomPersonne} {opt.prenomPersonne}
            </Typography>
            <Typography sx={{ fontSize: 11, color: "text.secondary" }}>
              {opt.fonction ?? ""}
            </Typography>
          </Box>
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          size="medium"
          required={required}
          error={error}
          helperText={helperText ?? ""}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress size={14} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}

export default PersonneAutocomplete;
