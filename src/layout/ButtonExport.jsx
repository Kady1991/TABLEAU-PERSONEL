import React from 'react';
import Button from '@mui/material/Button'; // Importez le bouton MUI

import '../index.css'; // Importez le fichier CSS

const ButtonExport = ({ personnes, columns, className }) => {
  const generateCsvData = () => {
    const headers = columns.map(column => column.headerName.toUpperCase()).join(',') + '\n';
    const rows = personnes.map(item =>
      columns.map(column => `"${item[column.field]}"`).join(',')
    ).join('\n');
    return headers + rows;
  };

  const handleExportCsv = () => {
    const csvData = generateCsvData();
    const blob = new Blob([csvData], { type: 'text/csv' });
    const csvUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = csvUrl;
    link.setAttribute('download', 'data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button className={`bouton-export ${className}`} onClick={handleExportCsv}>
      Exporter
    </Button>
  );
}

export default ButtonExport;
