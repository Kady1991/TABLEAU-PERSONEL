import React, { useState } from 'react';
import axios from 'axios';
import { MdDeleteForever } from "react-icons/md";

const Delete = ({ email }) => { // Ajout de 'email' comme propriété du composant
  const [donnees, setDonnees] = useState([]); // État pour stocker les données de votre API

  const handleClick = async () => {
    try {
      // Mettre à jour la valeur de SiArchive dans l'API
      await axios.put(`https://server-iis.uccle.intra/API_Personne/api/Personne?/${email}`, {
        SiArchive: true
      });

      // Mettre à jour l'état des données locales si nécessaire
      // Par exemple, si vous voulez refléter les changements localement sans recharger les données depuis l'API
      const nouvellesDonnees = [...donnees];
      nouvellesDonnees.map(donnee => {
        donnee.SiArchive = true;
        return donnee;
      });
      setDonnees(nouvellesDonnees);

      console.log('La valeur de SiArchive a été mise à jour avec succès.');
    } catch (error) {
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
