import React, { useState } from "react";
import { Box, Paper } from "@mui/material";
import AffectationsTree from "./AffectationsTree";
import AffectationsGrid from "./AffectationsGrid";
import AffectationsModal from "./AffectationsModal";
import { useAffectationSelection } from "./hooks/useAffectationSelection";
import { useAffectationModal } from "./hooks/useAffectationModal";

function AffectationsComponent() {
  const [refreshKey, setRefreshKey] = useState(0);

  const { selection, selectedId, breadcrumb, handleSelect, clearSelection } =
    useAffectationSelection();

  const { modal, openForTreeAdd, openForGridAdd, openForEdit, close } =
    useAffectationModal(selection);

  const handleSaved = () => setRefreshKey((k) => k + 1);

  return (
    <Box
      sx={{
        display: "flex",
        height: "calc(100vh - 120px)",
        gap: 0,
        border: "0.5px solid",
        borderColor: "divider",
        overflow: "hidden",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: 220,
          borderRight: "0.5px solid",
          borderColor: "divider",
          borderRadius: 0,
          overflow: "hidden",
        }}
      >
        <AffectationsTree
          selectedId={selectedId}
          onSelect={handleSelect}
          onAdd={openForTreeAdd}
          refreshKey={refreshKey}
        />
      </Paper>

      <Box
        sx={{
          flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <AffectationsGrid
          selection={selection}
          breadcrumb={breadcrumb}
          onClearSelection={clearSelection}
          onEdit={openForEdit}
          onAdd={openForGridAdd}
          refreshKey={refreshKey}
          onRefresh={handleSaved}
          onShowAll={clearSelection}
        />
      </Box>

      <AffectationsModal
        {...modal}
        open={modal.open}
        onClose={close} // ← close du hook (pas handleClose)
        onSaved={handleSaved}
        // type={modal.type}
        // editData={modal.editData}
        // defaultParentId={modal.defaultParentId}
      />
    </Box>
  );
}

export default AffectationsComponent;
