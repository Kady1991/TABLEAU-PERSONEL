    import { useMemo, useState, useCallback } from "react";
    import dayjs from "dayjs";
    import { EMPTY_FILTERS, cleanServiceName } from "./archivesUtils.js";

    /**
     * Recherche + filtres (année, département, service) appliqués aux lignes.
     */
    export default function useArchivesFilters(rows) {
    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState(EMPTY_FILTERS);

    // Options des filtres, déduites des données
    const options = useMemo(() => {
        const years = new Set();
        const depts = new Set();
        const services = new Set();
        rows.forEach((r) => {
        const d = dayjs(r?.DateSortie);
        if (r?.DateSortie && d.isValid()) years.add(String(d.year()));
        if (r?.NomDepartementFr) depts.add(r.NomDepartementFr);
        if (r?.NomServiceFr) services.add(cleanServiceName(r.NomServiceFr));
        });
        return {
        years: [...years].sort((a, b) => Number(b) - Number(a)),
        depts: [...depts].sort((a, b) => a.localeCompare(b, "fr")),
        services: [...services].sort((a, b) => a.localeCompare(b, "fr")),
        };
    }, [rows]);

    // Lignes après recherche + filtres
    const filteredRows = useMemo(() => {
        const q = search.trim().toLowerCase();
        return rows.filter((r) => {
        if (filters.year) {
            const d = dayjs(r?.DateSortie);
            if (
            !r?.DateSortie ||
            !d.isValid() ||
            String(d.year()) !== filters.year
            ) {
            return false;
            }
        }
        if (filters.dept && r?.NomDepartementFr !== filters.dept) return false;
        if (
            filters.service &&
            cleanServiceName(r?.NomServiceFr) !== filters.service
        ) {
            return false;
        }
        if (q) {
            const hay = `${r?.NomPersonne ?? ""} ${r?.PrenomPersonne ?? ""} ${
            r?.Email ?? ""
            }`.toLowerCase();
            if (!hay.includes(q)) return false;
        }
        return true;
        });
    }, [rows, search, filters]);

    const handleFilter = useCallback((key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    }, []);

    const handleReset = useCallback(() => {
        setFilters(EMPTY_FILTERS);
        setSearch("");
    }, []);

    return {
        search,
        setSearch,
        filters,
        options,
        filteredRows,
        handleFilter,
        handleReset,
    };
    }