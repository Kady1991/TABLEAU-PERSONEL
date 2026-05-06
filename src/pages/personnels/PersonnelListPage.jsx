import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import TableauComponent from "../../components/Tableau/TableauComponent.jsx";

function PersonneListPage() {
  const theme = useTheme();
  const PRIMARY = theme.palette.primary.main;

  return (
    <Box sx={{ height: "calc(94vh - 64px)", display: "flex", flexDirection: "column" }}>
      <Typography variant="h1" fontSize={25} fontWeight={500} color={PRIMARY} mb={2}>
        Liste du personnel
      </Typography>
      <TableauComponent compact={false} showHeader showAddButton nonArchivedOnly />
    </Box>
  );
}

export default PersonneListPage;