    import { useMemo } from "react";
    import { Stack } from "@mui/material";
    import dayjs from "dayjs";
    import PropTypes from "prop-types";
    import StatCard from "./StatCardComponent.jsx";
    import useArchivesStyles from "./useArchivesStyles.js";
    import { safeFormat } from "./archivesUtils.js";

    /** Les trois cartes : total, départs de l'année, dernière archive. */
    export default function ArchivesStats({ rows, loadingDates, onOpenPerson }) {
    const s = useArchivesStyles();
    const thisYear = dayjs().year();

    const departsThisYear = useMemo(
        () =>
        rows.filter((r) => {
            const dateRef = r?.DateSortie || r?.DateEntree;
            return dateRef && dayjs(dateRef).year() === thisYear;
        }).length,
        [rows, thisYear],
    );

    const lastArchived = useMemo(
        () =>
        [...rows]
            .filter((r) => r?.DateSortie)
            .sort(
            (a, b) =>
                dayjs(b.DateSortie).valueOf() - dayjs(a.DateSortie).valueOf(),
            )[0] ?? null,
        [rows],
    );

    const lastArchivedName = loadingDates
        ? "…"
        : lastArchived
        ? `${lastArchived.NomPersonne ?? ""} ${lastArchived.PrenomPersonne ?? ""}`.trim()
        : "-";

    return (
        <Stack direction="row" sx={s.statsRow}>
        <StatCard
            label="Total archivés"
            value={rows.length}
            sub="membres archivés"
        />
        <StatCard
            label="Cette année"
            value={departsThisYear}
            sub={`départs en ${thisYear}`}
        />
        <StatCard
            label="Dernière archive"
            value={lastArchivedName}
            sub={
            lastArchived
                ? `sortie le ${safeFormat(
                    lastArchived.DateSortie || lastArchived.DateEntree,
                )}`
                : ""
            }
            onClick={
            lastArchived
                ? () => onOpenPerson(lastArchived.IDPersonneService)
                : undefined
            }
        />
        </Stack>
    );
    }

    ArchivesStats.propTypes = {
    rows: PropTypes.array.isRequired,
    loadingDates: PropTypes.bool,
    onOpenPerson: PropTypes.func.isRequired,
    };