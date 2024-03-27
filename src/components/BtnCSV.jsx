import React from 'react';
import { IconButton } from '@mui/material';
import { saveAs } from 'file-saver';
import { CloudDownload } from '@mui/icons-material';

const BtnCSV = ({ data }) => {
  const exportToCSV = () => {
    const csvData = convertToCSV(data);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'membre.csv'); // Nom du fichier "membre.csv"
  };

  const convertToCSV = (data) => {
    const csvRows = [];
    const headers = Object.keys(data[0]);

    csvRows.push(headers.join(','));

    for (const row of data) {
      const values = headers.map(header => {
        const escaped = ('' + row[header]).replace(/"/g, '\\"');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }

    return csvRows.join('\n');
  };

  return (
    <>
      <IconButton 
        onClick={exportToCSV}
        aria-label="export-csv"
        style={{ color: 'white', fontSize: 32 }} // Style pour rendre l'icône blanche et agrandie
      >
        <CloudDownload />
      </IconButton>
    </>
  );
};

export default BtnCSV;
