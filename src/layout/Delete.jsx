import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdDeleteForever } from "react-icons/md";

const Delete = ({
  IDPersonne,
  nomPersonne,
  prenomPersonne,
  email,
  onSuccess,
  onError,
}) => {
  const [isArchived, setIsArchived] = useState(false);

  useEffect(() => {
    // Vérifier si la personne est déjà archivée lors du chargement du composant
    checkArchivedStatus();
  }, []);

  const checkArchivedStatus = async () => {
    try {
      const response = await axios.get(
        `https://server-iis.uccle.intra/API_PersonneTest/api/personne?email=${email}`
      );
      const { SiArchive } = response.data; // Supposons que SiArchive est un champ dans la réponse qui indique si la personne est archivée ou non
      setIsArchived(SiArchive);
    } catch (error) {
      console.error("Erreur lors de la récupération des informations de la personne :", error);
    }
  };

  const handleClick = async () => {
    // Vérifier si la personne est déjà archivée
    if (isArchived) {
      alert("Cette personne est déjà archivée.");
      return;
    }

    // Demande de confirmation avant d'archiver la personne
    const confirmation = window.confirm(
      `Voulez-vous vraiment archiver cette personne ?\nID: ${IDPersonne} \nNom:  ${nomPersonne} \nPrénom:  ${prenomPersonne} \nEmail:  ${email}`
    );
    if (!confirmation) return; // Arrête le processus si l'utilisateur annule

    try {
      // Mettre à jour la valeur de SiArchive dans l'API
      await axios.put(
        `https://server-iis.uccle.intra/API_PersonneTest/api/personne/delete?email=${email}`,
        {
          value: email,
        }
      );

      // Si la mise à jour réussit, appeler la fonction onSuccess
      onSuccess(email);

      // Afficher une alerte de succès
      alert(`La personne ${IDPersonne} ${prenomPersonne} ${nomPersonne}${email}  a été archivée avec succès.`);
      console.log("La valeur de SiArchive a été mise à jour avec succès.");
      setIsArchived(true); // Mettre à jour l'état local pour indiquer que la personne est maintenant archivée

      // Afficher l'objet archivé dans la console
      console.log({
        IDPersonne,
        nomPersonne,
        prenomPersonne,
        email
      });
    } catch (error) {
      // Si une erreur se produit, appeler la fonction onError
      onError(email);

      // Afficher un message d'erreur dans la console
      console.error(
        "Une erreur s'est produite lors de la mise à jour de la valeur de SiArchive :",
        error
      );
      
      // Afficher un message d'erreur
      alert(`L'archivage de la personne ${IDPersonne} ${prenomPersonne} ${nomPersonne} a échoué.`);
    }
  };

  return (
    <div>
      {/* Utilisation de l'icône de suppression */}
      <MdDeleteForever
        title="Archiver"
        onClick={handleClick}
        style={{ cursor: "pointer", color: "red", fontSize: "22px", marginTop:"10px" }}
      />
    </div>
  );
};

export default Delete;
