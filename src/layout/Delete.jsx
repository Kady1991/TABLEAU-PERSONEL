import React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';


const Delete = ({ IDPersonne, NomPersonne, PrenomPersonne, email }) => {
  const handleDelete = async () => {
    console.log({ IDPersonne, NomPersonne, PrenomPersonne, email }); // Afficher l'objet dans la console

    const confirmDelete = window.confirm(`Êtes-vous sûr de supprimer  (ID: ${IDPersonne}) ${NomPersonne} ${PrenomPersonne} ${email}  ?`);

    if (confirmDelete) {
      try {
        // Envoyer une requête PUT pour mettre à jour la ressource en l'archivant
        await axios.put(`https://server-iis.uccle.intra/API_Personne/api/Personne/${email}`, {
          SiArchive: true // Ajoutez le paramètre SiArchive avec la valeur true
        });
        // Gérer la réussite de la mise à jour
        console.log('Ressource archivée avec succès.');
      } catch (error) {
        // Gérer les erreurs éventuelles
        console.error('Une erreur est survenue lors de l\'archivage de la ressource :', error);
      }
    }
  };

  return (
    <Tooltip title="Supprimer" style={{margin:2}}>
      <IconButton onClick={handleDelete}>
        <DeleteIcon  style={{ color: "#ff6600", fontSize: '24px' }}/>
      </IconButton>
    </Tooltip>
  );
};

export default Delete;
