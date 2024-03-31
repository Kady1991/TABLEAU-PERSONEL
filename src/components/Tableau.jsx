import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import '../index.css'; // Importer le fichier CSS

function Tableau() {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch('https://server-iis.uccle.intra/API_Personne/api/Personne')
      .then(response => response.json())
      .then(data => {
        const countriesData = data.map(country => ({
          name: country.name.common,
          capital: country.capital ? country.capital[0] || 'N/A' : 'N/A'
        }));
        setCountries(countriesData);
      })
      .catch(error => {
        console.error('Une erreur est survenue lors de la récupération des données :', error);
      });
  };
  

  return (
    <div className="container"> {/* Ajouter la classe de conteneur */}
      <TableContainer component={Paper} className="table-container"> {/* Ajouter la classe de conteneur de tableau */}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="table-header">Pays</TableCell> {/* Ajouter la classe pour le style du header */}
              <TableCell className="table-header">Capitale</TableCell> {/* Ajouter la classe pour le style du header */}
            </TableRow>
          </TableHead>
          <TableBody>
            {countries.map((country, index) => (
              <TableRow key={index}>
                <TableCell>{country.name}</TableCell>
                <TableCell>{country.capital}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default Tableau;