import React, { useState, useEffect } from 'react';
import { IconButton, Tooltip, Box, Dialog, DialogTitle, List, ListItemButton, ListItemText, TextField } from '@mui/material';
import { Edit, AddBox, DeleteForever, Info } from '@mui/icons-material';
import { PDFDocument, rgb } from 'pdf-lib'; // Importer PDFDocument et rgb depuis pdf-lib

const ActionComponent = ({ rowData }) => {
  const [services, setServices] = useState([]); // État pour stocker la liste des services
  const [isPopupOpen, setIsPopupOpen] = useState(false); // État pour contrôler l'ouverture/fermeture de la pop-up
  const [searchTerm, setSearchTerm] = useState(''); // État pour le terme de recherche
  const [personDetails, setPersonDetails] = useState(null); // État pour stocker les détails de la personne sélectionnée


  // Récupération de la liste des services depuis votre API
  useEffect(() => {
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
        const uniqueServiceNames = Array.from(new Set(serviceNames.filter(Boolean)));
        const sortedServiceNames = uniqueServiceNames.sort((a, b) => a.localeCompare(b, 'fr'));
        setServices(sortedServiceNames);
      })
      .catch(error => console.error('Erreur lors de la récupération des services :', error));
  }, []);


  




  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };






  // Envoyez une requête à votre API pour mettre à jour les données
  const updateDataInAPI = (itemId, newValue) => {

    // Exemple avec fetch API :
    fetch(`https://server-iis.uccle.intra/API_Personne/api/Personne/${itemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newValue }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Échec de la mise à jour des données dans l\'API');
        }
        // Gérer la réponse de l'API si nécessaire
      })
      .catch(error => {
        console.error('Erreur lors de la mise à jour des données dans l\'API:', error);
        // Gérer les erreurs
      });
  };


  // Mettre à jour les données dans le tableau (optionnel, si besoin)
  const handleEditClick = (itemId, newValue) => {
    updateTable(itemId, newValue);
    // Mettre à jour les données dans l'API
    updateDataInAPI(itemId, newValue);
  };



  const handleDetailClick = (rowData) => {
    setPersonDetails(rowData);
  };

  const handleDeleteClick = (itemId, isArchived) => {
    // Supprimer l'élément du tableau
    // Exemple: Si votre tableau est un array JavaScript, vous pouvez utiliser splice pour le supprimer
    // Remplacez cela par votre propre logique pour supprimer l'élément de votre tableau
    removeElementFromTable(itemId);

    // Si l'élément n'est pas déjà dans l'archive, le déplacer vers l'archive
    if (!isArchived) {
      // Logique pour déplacer l'élément vers l'archive
      // Exemple: Mettre à jour l'attribut SiArchive de l'élément à true dans votre API
      updateSiArchive(itemId, true);
    }
  };




  return (
    <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center">


      <Dialog open={isPopupOpen} onClose={handleClosePopup}>
        <DialogTitle>Liste des services</DialogTitle>
        <TextField
          label="Rechercher un service"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ margin: '10px' }}
        />
        <List style={{ maxHeight: '300px', width: '350px' }}>
          {services
            .filter(service => service.toLowerCase().includes(searchTerm.toLowerCase()))
            .map(service => (
              <ListItemButton key={service} onClick={() => console.log('Service sélectionné :', service)}>
                <ListItemText primary={service} />
              </ListItemButton>
            ))}
        </List>
      </Dialog>


      <Tooltip title="Editer">
        <IconButton size="medium" onClick={handleEditClick}>
          <Edit fontSize="medium" style={{ color: '#2196f3' }} />
        </IconButton>
      </Tooltip>

      <Tooltip title="Ajouter service">
        <IconButton size="medium" onClick={handleOpenPopup}>
          <AddBox fontSize="medium" style={{ color: '#4caf50' }} />
        </IconButton>
      </Tooltip>

      <Tooltip title="Détail">
        <IconButton size="medium" onClick={() => handleDetailClick(rowData)}>
          <Info fontSize="medium" style={{ color: '#ff9800' }} />
        </IconButton>
      </Tooltip>

      <Tooltip title="Supprimer">
        <IconButton size="medium" onClick={handleDeleteClick}>
          <DeleteForever fontSize="medium" style={{ color: '#f44336' }} />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default ActionComponent;
