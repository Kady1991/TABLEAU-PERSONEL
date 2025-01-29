import React from "react";
import axios from "axios";
import { FaPersonArrowDownToLine } from "react-icons/fa6";
import "../assets/index.css";
import { message } from "antd";

import { LIEN_API_PERSONNE } from "../config";

const RestoreAction = ({ PersonneID, email, refreshData }) => {
  const handleClick = async () => {
    try {
      // URL de restauration
      const link = `${LIEN_API_PERSONNE}/api/personne/desarchiver?id=${PersonneID}`;

      await axios.put(link);

      // ✅ Afficher un message de succès
      message.success("La personne a été restaurée avec succès.");

      // ✅ Rafraîchir automatiquement le tableau
      if (refreshData) {
        refreshData();
      }
    } catch (error) {
      console.error("Une erreur s'est produite lors de la restauration :", error);
      message.error("La restauration de la personne a échoué.");
    }
  };

  return (
    <div
      style={{
        background: "transparent",
        padding: "10px",
        borderRadius: "5px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <FaPersonArrowDownToLine className="IconRestore" title="Restaurer" onClick={handleClick} />
    </div>
  );
};

export default RestoreAction;
