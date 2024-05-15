import React from "react";
import axios from "axios";
import { FaPersonArrowDownToLine } from "react-icons/fa6";

const RestoreAction = ({PersonneID, email, onSuccess, onError }) => {
    const handleClick = async () => {
        try {
          // Mettre à jour la valeur de SiArchive dans l'API
          await axios.put(
            `https://server-iis.uccle.intra/API_Personne/api/personne/desarchiver?id=${PersonneID}`
          );
      
          // Si la mise à jour réussit, appeler la fonction onSuccess
          onSuccess(PersonneID);
      
          // Afficher une alerte de succès
          alert("La personne a été restaurée avec succès.");
        } catch (error) {
          // Si une erreur se produit, appeler la fonction onError
          onError(PersonneID);
      
          // Afficher un message d'erreur dans la console
          console.error("Une erreur s'est produite lors de la restauration de la personne :", error);
      
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
        style={{ cursor: "pointer", color: "green", fontSize: "22px", marginTop: "10px", }}
      />
    </div>
  );
};

export default RestoreAction;
