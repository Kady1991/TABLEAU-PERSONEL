import React from "react";
import axios from "axios";
import { FaPersonArrowDownToLine } from "react-icons/fa6";

const RestoreAction = ({ IDPersonne, email, onSuccess, onError }) => {
  const handleClick = async () => {
    try {
      // Mettre à jour la valeur de SiArchive dans l'API
      const link = `https://server-iis.uccle.intra/API_PersonneTest/api/personne/desarchiver?id=${IDPersonne}`;
      //const link = `https://localhost:44333/api/personne/desarchiver?id=${IDPersonne}`;

      await axios.put(link);

      // Si la mise à jour réussit, appeler la fonction onSuccess
      onSuccess(IDPersonne);

      // Afficher une alerte de succès
      alert("La personne a été restaurée avec succès.");
    } catch (error) {
      // Si une erreur se produit, appeler la fonction onError
      onError(IDPersonne);

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
    <div>
      {/* Utilisation de l'icône de restauration */}
      <FaPersonArrowDownToLine
        title="Restaurer"
        onClick={handleClick}
        style={{
          cursor: "pointer",
          color: "green",
          fontSize: "22px",
          marginTop: "10px",
        }}
      />
    </div>
  );
};

export default RestoreAction;
