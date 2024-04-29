import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const Delete = ({ IDPersonne }) => {
  const handleDelete = async () => {
    try {
      // Envoyer une requête PUT pour mettre à jour la ressource en l'archivant
      await axios.put(`https://server-iis.uccle.intra/API_Personne/api/Personne/${IDPersonne}`, {
        SiArchive: true // Ajoutez le paramètre SiArchive avec la valeur true
      });
      // Gérer la réussite de la mise à jour
      console.log('Ressource archivée avec succès.');
    } catch (error) {
      // Gérer les erreurs éventuelles
      console.error('Une erreur est survenue lors de l\'archivage de la ressource :', error);
    }
  };

  return (
    <Tooltip title="Supprimer">
      <IconButton onClick={handleDelete} style={{ color: "red" }}>
        <DeleteIcon />
      </IconButton>
    </Tooltip>
  );
};

export default Delete;
