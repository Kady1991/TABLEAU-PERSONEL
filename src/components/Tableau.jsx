import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid'; // Importer DataGrid depuis @mui/x-data-grid
import '../index.css'; // Importer le fichier CSS

function Tableau() {
  const [personnes, setPersonnes] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch('https://server-iis.uccle.intra/API_Personne/api/Personne')
      .then(response => response.json())
      .then(data => {
        const personnesData = data.map(personne => ({
          id: personne.ID,
          nom: personne.NOM,
          prenom: personne.PRENOM,
          role: personne.ROLE,
          email: personne['E-mail'],
          entreeService: personne['ENTREE SERVICE'],
          grade: personne.GRADE,
          affectation: personne.AFFECTATION,
          localisation: personne.LOCALISATION,
          numero: personne['N°'],
          nomChefService: personne['NOM CHEF DU SERVICE'],
          prenomChefService: personne['PRENOM CHEF DU SERVICE'],
          emailChefService: personne['E-MAIL CHEF SERVICE'],
          departements: personne.DEPARTEMENTS,
          nomChefDepartement: personne['NOM CHEF DEPARTEMENT'],
          prenomChefDepartement: personne['PRENOM CHEF DEPARTEMENT'],
          emailChefDepartement: personne['E-MAIL CHEF DEPARTEMENT'],
          pcuension: personne['P+C:UENSION'],
          tel: personne.TEL,
          batiment: personne.Batiment,
          etage: personne.Etage
        }));
        setPersonnes(personnesData);
      })
      .catch(error => {
        console.error('Une erreur est survenue lors de la récupération des données :', error);
      });
  };
  
  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'nom', headerName: 'Nom', width: 150 },
    { field: 'prenom', headerName: 'Prénom', width: 150 },
    { field: 'role', headerName: 'Rôle', width: 150 },
    { field: 'email', headerName: 'E-mail', width: 200 },
    { field: 'entreeService', headerName: 'Entrée Service', width: 200 },
    { field: 'grade', headerName: 'Grade', width: 150 },
    { field: 'affectation', headerName: 'Affectation', width: 150 },
    { field: 'localisation', headerName: 'Localisation', width: 150 },
    { field: 'numero', headerName: 'N°', width: 100 },
    { field: 'nomChefService', headerName: 'Nom Chef du Service', width: 200 },
    { field: 'prenomChefService', headerName: 'Prénom Chef du Service', width: 200 },
    { field: 'emailChefService', headerName: 'E-mail Chef du Service', width: 200 },
    { field: 'departements', headerName: 'Départements', width: 150 },
    { field: 'nomChefDepartement', headerName: 'Nom Chef de Département', width: 200 },
    { field: 'prenomChefDepartement', headerName: 'Prénom Chef de Département', width: 200 },
    { field: 'emailChefDepartement', headerName: 'E-mail Chef de Département', width: 200 },
    { field: 'pcuension', headerName: 'P+C:UENSION', width: 150 },
    { field: 'tel', headerName: 'Tel', width: 150 },
    { field: 'batiment', headerName: 'Bâtiment', width: 150 },
    { field: 'etage', headerName: 'Étage', width: 100 }
  ];

  return (
    <div className="container"> {/* Ajouter la classe de conteneur */}
      <div style={{ height: 600, width: '100%' }}> {/* Définir la hauteur et la largeur du DataGrid */}
        <DataGrid
          rows={personnes}
          columns={columns}
          pageSize={10} // Nombre d'éléments par page
          checkboxSelection // Ajouter une case à cocher pour la sélection
          disableSelectionOnClick // Désactiver la sélection au clic sur une ligne
        />
      </div>
    </div>
  );
}

export default Tableau;
