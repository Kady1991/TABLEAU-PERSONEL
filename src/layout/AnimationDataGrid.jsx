import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { motion } from "framer-motion";

const AnimationDataGrid = ({ personnes, columns, loading }) => {
  return (
    <motion.div
      className="data-grid-container"
      initial={{ opacity: 0, scale: 0.9 }} // Animation de départ
      animate={{ opacity: 1, scale: 1 }} // Animation d'arrivée
      transition={{ duration: 1.5, ease: "easeOut" }} // Durée augmentée à 1.5 secondes
    >
      <DataGrid
        rows={personnes}
        columns={columns}
        pageSize={10}
        loading={loading}
        checkboxSelection
        disableSelectionOnClick
        getRowClassName={(params) => (params.row.SiArchive ? "archive-row" : "")}
      />
    </motion.div>
  );
};

export default AnimationDataGrid;
