import React, { useState } from 'react';
import axios from 'axios';
import { MdDeleteForever } from "react-icons/md";

const Delete = ({IDPersonne, nomPersonne, prenomPersonne, onSuccess, onError }) => {
  const handleClick = async () => {
    // Demande de confirmation avant d'archiver la personne
    const confirmation = window.confirm(`Voulez-vous vraiment archiver cette personne ?\nID: ${IDPersonne}\nNom: ${nomPersonne}\nPrénom: ${prenomPersonne}`);
    if (!confirmation) return; // Arrête le processus si l'utilisateur annule
  
    try {
      // Mettre à jour la valeur de SiArchive dans l'API
      await axios.put(`https://server-iis.uccle.intra/API_Personne/api/Personne/${IDPersonne}`, {
        SiArchive: true
      });
  
      // Si la mise à jour réussit, appeler la fonction onSuccess
      onSuccess(IDPersonne);
  
      console.log('La valeur de SiArchive a été mise à jour avec succès.');
    } catch (error) {
      // Si une erreur se produit, appeler la fonction onError
      onError(IDPersonne);
      
      // Afficher un message d'erreur dans la console
      console.error('Une erreur s\'est produite lors de la mise à jour de la valeur de SiArchive :', error);
    }
  };

  return (
    <div>
      {/* Utilisation de l'icône de suppression */}
      <MdDeleteForever title='Archiver' onClick={handleClick} style={{ cursor: 'pointer', color:"red", fontSize:"20px", }} />
    </div>
  );
};

export default Delete;
