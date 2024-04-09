import React, { useState } from 'react';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import FormulaireAjout from './FormulaireAjout';


function Add() {
  const [isFormOpen, setIsFormOpen] = useState(false); // État pour suivre l'ouverture/fermeture du formulaire

  const toggleForm = () => {
    setIsFormOpen(!isFormOpen); // Inversez l'état lorsque le bouton est cliqué
  };

  return (
    <div>
      <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={toggleForm}>
        Créer membre
      </Button>
      {isFormOpen && <FormulaireAjout />} {/* Affichez le formulaire si isFormOpen est vrai */}
    </div>
  );
}

export default Add;