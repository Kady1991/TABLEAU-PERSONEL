    import { Box, Typography } from "@mui/material";
    import PropTypes from "prop-types";
    import useArchivesStyles from "./useArchivesStyles.js";

    /** Carte statistique compacte (chiffre ou lien cliquable). */
    export default function StatCard({ label, value, sub, onClick }) {
    const s = useArchivesStyles().statCard;
    const clickable = typeof onClick === "function";

    return (
        <Box sx={s.root}>
        <Box sx={s.body}>
            <Typography sx={s.label}>{label}</Typography>
            <Typography
            noWrap
            component={clickable ? "button" : "p"}
            type={clickable ? "button" : undefined}
            onClick={onClick}
            sx={s.value(clickable)}
            >
            {value}
            </Typography>
        </Box>
        {sub && <Typography sx={s.sub}>{sub}</Typography>}
        </Box>
    );
    }

    StatCard.propTypes = {
    label: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    sub: PropTypes.string,
    onClick: PropTypes.func,
    };