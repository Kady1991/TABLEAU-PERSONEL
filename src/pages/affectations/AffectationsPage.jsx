//import React from "react";
import { Box, Typography } from "@mui/material";
//import ApartmentIcon from "@mui/icons-material/Apartment.js";
import AffectationsComponent from "../../components/Affectations/AffectationsComponent";

function AffectationsPage() {
  return (
    <Box
      sx={{
        p: 3,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {/* ── En-tête ────────────────────────────────────────────────────────── */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Box
            sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 0.5 }}
          >
            <Typography variant="h1">Affectations</Typography>
            <Typography variant="h2">
              Structure Administration communale Uccle
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* ── Composant principal ───────────────────────────────────────────── */}
      <AffectationsComponent />
    </Box>
  );
}

export default AffectationsPage;
