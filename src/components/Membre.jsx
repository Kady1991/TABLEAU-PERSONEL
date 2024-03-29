jsx
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { parseString } from 'xml2js';

function Membre() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    // En supposant que le fichier XML soit placé dans le dossier public
    fetch('/DATA/Data.xml')
      .then(response => response.text())
      .then(str => parseString(str, (err, result) => {
        if (err) {
          console.error("Erreur lors du parsing XML:", err);
          // Envisagez de définir un état d'erreur ici et d'afficher un message à l'utilisateur
        } else {
          const data = result.root.personne.map(personne => ({
            // Le mapping reste le même
          }));
          setRows(data);
        }
      }));
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>ID Personne</TableCell>
            <TableCell>Nom Personne</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Tel Pro</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.IDPersonne}>
              <TableCell>{row.IDPersonne}</TableCell>
              <TableCell>{row.NomPersonne}</TableCell>
              <TableCell>{row.Email}</TableCell>
              <TableCell>{row.TelPro}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default Membre;