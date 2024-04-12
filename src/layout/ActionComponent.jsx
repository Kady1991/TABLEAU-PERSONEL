import React, { useState, useEffect } from 'react';
import { IconButton, Tooltip, Box, Dialog, DialogTitle, List, ListItemButton, ListItemText } from '@mui/material';
import { Edit, AddBox, DeleteForever, Info } from '@mui/icons-material';

const ActionComponent = () => {
  const [services, setServices] = useState([]); // État pour stocker la liste des services
  const [isPopupOpen, setIsPopupOpen] = useState(false); // État pour contrôler l'ouverture/fermeture de la pop-up

  useEffect(() => {
    // Récupération de la liste des services depuis votre API
    fetch('https://server-iis.uccle.intra/API_Personne/api/Personne')
      .then(response => {
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des données.');
        }
        return response.json();
      })
      .then(data => {
        // Extraction des noms de service de la réponse de l'API
        const serviceNames = data.map(service => service.NomServiceFr);
        setServices(serviceNames);
      })
      .catch(error => console.error('Erreur lors de la récupération des services :', error));
  }, []); // Utilisation d'un effet avec une dépendance vide pour exécuter le chargement une seule fois au montage du composant

  const handleEditClick = () => {
    // Logique pour l'édition
    console.log('Édition en cours...');
  };

  const handleDeleteClick = () => {
    // Logique pour la suppression
    console.log('Suppression en cours...');
  };

  const handleDetailClick = () => {
    // Logique pour afficher les détails
    console.log('Affichage des détails...');
  };

  const handleAddServiceClick = () => {
    // Ouvrir la pop-up pour afficher la liste des services
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    // Fermer la pop-up
    setIsPopupOpen(false);
  };

  return (
    <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center">
      {/* Bouton "Editer" */}
      <Tooltip title="Editer">
        <IconButton size="medium" onClick={handleEditClick}>
          <Edit fontSize="medium" style={{ color: '#2196f3' }} />
        </IconButton>
      </Tooltip>

      {/* Bouton "Supprimer" */}
      <Tooltip title="Supprimer">
        <IconButton size="medium" onClick={handleDeleteClick}>
          <DeleteForever fontSize="medium" style={{ color: '#f44336' }} />
        </IconButton>
      </Tooltip>
      
      {/* Bouton "Détail" */}
      <Tooltip title="Détail">
        <IconButton size="medium" onClick={handleDetailClick}>
          <Info fontSize="medium" style={{ color: '#ff9800' }} />
        </IconButton>
      </Tooltip>

      {/* Bouton "Ajouter service" */}
      <Tooltip title="Ajouter service">
        <IconButton size="medium" onClick={handleAddServiceClick}>
          <AddBox fontSize="medium" style={{ color: '#4caf50' }} />
        </IconButton>
      </Tooltip>

      {/* Pop-up pour afficher la liste des services */}
      <Dialog open={isPopupOpen} onClose={handleClosePopup}>
        <DialogTitle>Liste des services</DialogTitle>
        <List style={{ maxHeight: '300px', width: '200px' }}> {/* Ajustement de la hauteur et de la largeur */}
          {services.map(service => (
            <ListItemButton key={service} onClick={() => console.log('Service sélectionné :', service)}>
              <ListItemText primary={service} />
            </ListItemButton>
          ))}
        </List>
      </Dialog>
    </Box>
  );
};

export default ActionComponent;
