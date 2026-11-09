    import { Button, Stack, Typography } from "@mui/material";
    import PropTypes from "prop-types";
    import useArchivesStyles from "./useArchivesStyles.js";

    /** Barre d'actions groupées, affichée quand des lignes sont cochées. */
    export default function ArchivesBulkBar({ count, onExport, onClear }) {
    const s = useArchivesStyles().bulkBar;

    if (count === 0) return null;

    return (
        <Stack direction="row" sx={s.wrapper}>
        <Typography sx={s.label}>
            {count} {count > 1 ? "membres sélectionnés" : "membre sélectionné"}
        </Typography>
        <Stack direction="row" sx={s.buttons}>
            <Button variant="outlined" onClick={onExport} sx={s.exportButton}>
            Exporter la sélection
            </Button>
            <Button onClick={onClear} sx={s.clearButton}>
            Tout désélectionner
            </Button>
        </Stack>
        </Stack>
    );
    }

    ArchivesBulkBar.propTypes = {
    count: PropTypes.number.isRequired,
    onExport: PropTypes.func.isRequired,
    onClear: PropTypes.func.isRequired,
    };