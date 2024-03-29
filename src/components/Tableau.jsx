import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField } from '@mui/material';

const Tableau = () => {
  const [membres, setMembres] = useState([]);
  const [recherche, setRecherche] = useState('');

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setRecherche(value);
    // Vous pouvez mettre ici votre logique pour récupérer les données depuis une API
    // Par exemple, si vous utilisez axios pour faire une requête GET
    axios.get('https://server-iis.uccle.intra/API_Personne/api/Personne')
      .then(response => {
        // Mettez à jour l'état des membres avec les données de l'API
        setMembres(response.data);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des données depuis l\'API :', error);
      });
  };

  return (
    <div>
      <TextField
        id="search"
        label="Rechercher"
        variant="outlined"
        fullWidth
        margin="normal"
        onChange={handleSearch}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nom</TableCell>
              <TableCell>Prénom</TableCell>
              <TableCell>Rôle</TableCell>
              <TableCell>E-mail</TableCell>
              <TableCell>Entrée Service</TableCell>
              <TableCell>Grade</TableCell>
              <TableCell>Affectation</TableCell>
              <TableCell>Localisation</TableCell>
              <TableCell>N°</TableCell>
              <TableCell>Nom Chef du Service</TableCell>
              <TableCell>Prénom Chef du Service</TableCell>
              <TableCell>E-mail Chef Service</TableCell>
              <TableCell>Départements</TableCell>
              <TableCell>Nom Chef Département</TableCell>
              <TableCell>Prénom Chef Département</TableCell>
              <TableCell>E-mail Chef Département</TableCell>
              <TableCell>P+C:UENSION</TableCell>
              <TableCell>TEL</TableCell>
              <TableCell>Bâtiment</TableCell>
              <TableCell>Étage</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {membres.map((membre) => (
              <TableRow key={membre.id}>
                <TableCell>{membre.id}</TableCell>
                <TableCell>{membre.nom}</TableCell>
                <TableCell>{membre.prenom}</TableCell>
                <TableCell>{membre.role}</TableCell>
                <TableCell>{membre.email}</TableCell>
                <TableCell>{membre.entreeService}</TableCell>
                <TableCell>{membre.grade}</TableCell>
                <TableCell>{membre.affectation}</TableCell>
                <TableCell>{membre.localisation}</TableCell>
                <TableCell>{membre.numero}</TableCell>
                <TableCell>{membre.nomChefService}</TableCell>
                <TableCell>{membre.prenomChefService}</TableCell>
                <TableCell>{membre.emailChefService}</TableCell>
                <TableCell>{membre.departements}</TableCell>
                <TableCell>{membre.nomChefDepartement}</TableCell>
                <TableCell>{membre.prenomChefDepartement}</TableCell>
                <TableCell>{membre.emailChefDepartement}</TableCell>
                <TableCell>{membre.pcuension}</TableCell>
                <TableCell>{membre.tel}</TableCell>
                <TableCell>{membre.batiment}</TableCell>
                <TableCell>{membre.etage}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Tableau;
