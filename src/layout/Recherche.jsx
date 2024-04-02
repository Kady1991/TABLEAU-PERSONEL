import React, { useState } from 'react';
import TextField from '@mui/material/TextField'; // Importez le composant TextField MUI

const Recherche = ({ handleSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleChange = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    handleSearch(term); // Appel de la fonction handleSearch pour exécuter la logique de recherche
  };

  return (
    <TextField
      label="Recherche"
      variant="outlined"
      value={searchTerm}
      onChange={handleChange} // Utilisation de handleChange pour gérer le changement de valeur
    />
  );
}

export default Recherche;
