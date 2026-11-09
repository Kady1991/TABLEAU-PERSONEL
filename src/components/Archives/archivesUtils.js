    import dayjs from "dayjs";
    import relativeTime from "dayjs/plugin/relativeTime";
    import "dayjs/locale/fr";
    import { XMLParser } from "fast-xml-parser";
    import { frFR } from "@mui/x-data-grid";
    import PersonnelService from "../../services/PersonnelService.js";

    dayjs.extend(relativeTime);
    dayjs.locale("fr");

    export const CACHE_KEY = "personnels_archives_cache_v2_dates";

    export const EMPTY_FILTERS = { year: "", dept: "", service: "" };

    export const GRID_LOCALE_TEXT = {
    ...frFR.components.MuiDataGrid.defaultProps.localeText,
    noRowsLabel: "Aucun personnel archivé",
    noResultsOverlayLabel: "Aucun résultat ne correspond à votre recherche",
    };

    export const isArchived = (v) =>
    v === true || v === 1 || String(v).toLowerCase() === "true";

    export const safeFormat = (val) => {
    if (!val) return "";
    const d = dayjs(val);
    return d.isValid() ? d.format("DD/MM/YYYY") : "";
    };

    // Les services supprimés se terminent par "- old"
    const OLD_SUFFIX = /\s*-\s*old\s*$/i;
    export const cleanServiceName = (name) =>
    String(name ?? "").replace(OLD_SUFFIX, "");

    export const fetchPersonDatesXml = async (id) => {
    try {
        const res = await PersonnelService.getPersonXmlById(id);
        if (typeof res.data !== "string") {
        return { DateEntree: "", DateSortie: "" };
        }
        const parser = new XMLParser();
        const json = parser.parse(res.data);
        const view = json?.WhosWhoModelView ?? null;
        return {
        DateEntree: view?.DateEntree ?? "",
        DateSortie: view?.DateSortie ?? "",
        };
    } catch (error) {
        console.error(
        "ERREUR récupération dates XML :",
        id,
        error?.response?.data || error?.message || error,
        );
        return { DateEntree: "", DateSortie: "" };
    }
    };