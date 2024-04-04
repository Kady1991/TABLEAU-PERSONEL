import React from 'react';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';

function CustomButton() {
  return (
    <Button variant="contained" color="primary" startIcon={<AddIcon />}>
      Créer membre
    </Button>
  );
}

export default CustomButton;
