    import { useTheme } from "@mui/material/styles";

    // Les styles de la page sont dans theme.js → theme.custom.archives
    export default function useArchivesStyles() {
    return useTheme().custom.archives;
    }