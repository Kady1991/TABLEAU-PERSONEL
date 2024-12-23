import React from "react";
import axios from "axios";
import { FaPersonArrowDownToLine } from "react-icons/fa6";
import "../assets/index.css";

const RestoreAction = ({ PersonneID, email, onSuccess, onError }) => {
  const handleClick = async () => {
    // console.log("IDPersonneService", IDPersonneService);
    
    try {
      // Mettre à jour la valeur de SiArchive dans l'API
      const link = `https://server-iis.uccle.intra/API_PersonneTest/api/personne/desarchiver?id=${PersonneID}`;
      //const link = `https://localhost:44333/api/personne/desarchiver?id=${IDPersonne}`;

      await axios.put(link);

      // Si la mise à jour réussit, appeler la fonction onSuccess
      onSuccess(PersonneID);

      // Afficher une alerte de succès
      alert("La personne a été restaurée avec succès.");
    } catch (error) {
      console.error("Détails de l'erreur :", error); // ✅ Déjà là
      onError(PersonneID);

      // Afficher un message d'erreur dans la console
      console.error(
        "Une erreur s'est produite lors de la restauration de la personne :",
        error
      );

      // Afficher un message d'erreur
      alert("La restauration de la personne a échoué.");
    }
  };

  return (

    <div
      style={{
        background:"transparent",
        padding: "10px", // Espace autour du bouton
        borderRadius: "5px", // Coins arrondis
        display: "flex", // Centrage horizontal et vertical
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <FaPersonArrowDownToLine className="IconRestore"
        title="Restaurer"
        onClick={handleClick}
      />
    </div>

  );
};

export default RestoreAction;
