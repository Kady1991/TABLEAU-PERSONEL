    import { useMemo } from "react";
    import { Button, Stack } from "@mui/material";
    import VisibilityIcon from "@mui/icons-material/Visibility";
    import RestoreActionComponent from "../Forms/RestoreActionComponent.jsx";
    import { safeFormat } from "./archivesUtils.js";
    import useArchivesStyles from "./useArchivesStyles.js";

    /**
     * Colonnes de la DataGrid des personnels archivés.
     */
    export default function useArchivesColumns({
    navigate,
    refreshData,
    onRestoreSuccess,
    onRestoreLocal,
    }) {
    const s = useArchivesStyles();

    return useMemo(
        () => [
        {
            field: "actions",
            headerName: "ACTIONS",
            width: 150,
            sortable: false,
            filterable: false,
            disableExport: true,
            hideable: false,
            renderCell: (params) => (
            <Stack direction="row" alignItems="center" spacing={1}>
                <Button
                size="small"
                variant="outlined"
                startIcon={<VisibilityIcon fontSize="small" />}
                aria-label={`Voir la fiche de ${params.row.PrenomPersonne ?? ""} ${
                    params.row.NomPersonne ?? ""
                }`.trim()}
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/personnels/${params.row.IDPersonneService}`);
                }}
                sx={s.viewButton}
                >
                Voir
                </Button>

                <RestoreActionComponent
                IDPersonneService={params.row.IDPersonneService}
                nomPersonne={params.row.NomPersonne}
                prenomPersonne={params.row.PrenomPersonne}
                email={params.row.Email}
                refreshData={refreshData}
                onRestoreSuccess={onRestoreSuccess}
                onRestoreLocal={onRestoreLocal}
                />
            </Stack>
            ),
        },
        { field: "NomPersonne", headerName: "NOM", width: 170, hideable: false },
        {
            field: "PrenomPersonne",
            headerName: "PRÉNOM",
            width: 160,
            hideable: false,
        },
        { field: "Email", headerName: "E-MAIL", width: 250, hideable: false },
        { field: "NomDepartementFr", headerName: "DÉPARTEMENT", width: 230 },
        { field: "NomServiceFr", headerName: "SERVICE", width: 270 },
        {
            field: "DateEntree",
            headerName: "ENTRÉE",
            width: 130,
            renderCell: (params) => safeFormat(params.value) || "-",
        },
        {
            field: "DateSortie",
            headerName: "DATE DE SORTIE",
            width: 150,
            renderCell: (params) => (
            <strong>{safeFormat(params.value) || "-"}</strong>
            ),
        },
        { field: "NomFonctionFr", headerName: "FONCTION", width: 220 },
        { field: "NomWWGradeFr", headerName: "GRADE", width: 200 },
        { field: "NomRueFr", headerName: "LOCALISATION", width: 200 },
        { field: "TelPro", headerName: "TÉL", width: 130 },
        ],
        [navigate, refreshData, onRestoreSuccess, onRestoreLocal, s],
    );
    }