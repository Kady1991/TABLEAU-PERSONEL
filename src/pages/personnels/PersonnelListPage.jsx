import { Box } from "@mui/material";
import TableauComponent from "../../components/Tableau/TableauComponent.jsx";

function PersonneListPage() {
  return (
    <Box
      sx={{
        height: "calc(100vh - 64px)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <TableauComponent
        compact={false}
        showHeader
        showAddButton
        nonArchivedOnly
      />
    </Box>
  );
}

export default PersonneListPage;