    import { useEffect, useState, useCallback } from "react";
    import PersonnelService from "../../services/PersonnelService.js";
    import {
    CACHE_KEY,
    isArchived,
    fetchPersonDatesXml,
    } from "./archivesUtils.js";

    /**
     * Charge les personnels archivés (puis leurs dates) et gère la restauration.
     */
    export default function usePersonnelArchives() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingDates, setLoadingDates] = useState(false);
    const [error, setError] = useState("");
    const [restoreInfo, setRestoreInfo] = useState(null);

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

        const res = await PersonnelService.getAll();
        const all = Array.isArray(res.data) ? res.data : [];

        const archived = all
            .filter((p) => isArchived(p?.SiArchive))
            .sort(
            (a, b) => Number(b.IDPersonneService) - Number(a.IDPersonneService),
            );

        setRows(archived);
        setLoading(false);

        setLoadingDates(true);
        const enriched = await Promise.all(
            archived.map(async (p) => {
            const dates = await fetchPersonDatesXml(p.IDPersonneService);
            return {
                ...p,
                DateEntree: dates.DateEntree || p.DateEntree || "",
                DateSortie: dates.DateSortie || p.DateSortie || "",
            };
            }),
        );

        const sorted = [...enriched].sort(
            (a, b) => Number(b.IDPersonneService) - Number(a.IDPersonneService),
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

    // Retire la ligne localement après restauration
    const markRowRestored = useCallback((id) => {
        setRows((prev) =>
        prev.filter((row) => String(row?.IDPersonneService) !== String(id)),
        );
    }, []);

    // Gère succès/erreur de restauration
    const handleRestoreSuccess = useCallback((payload) => {
        if (payload?.type === "error") return;
        setRestoreInfo(payload);
    }, []);

    const clearRestoreInfo = useCallback(() => setRestoreInfo(null), []);

    return {
        rows,
        loading,
        loadingDates,
        error,
        refreshData,
        markRowRestored,
        restoreInfo,
        handleRestoreSuccess,
        clearRestoreInfo,
    };
    }