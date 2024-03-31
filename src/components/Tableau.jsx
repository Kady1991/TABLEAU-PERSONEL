import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid'; // Importer DataGrid depuis @mui/x-data-grid
import '../index.css'; // Importer le fichier CSS



function Tableau() {
  const [personnes, setPersonnes] = useState([]);
  const [loading, setLoading] = useState(true);

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
        setLoading(false); // Mettre loading à false une fois les données chargées
      })
      .catch(error => {
        console.error('Une erreur est survenue lors de la récupération des données :', error);
        setLoading(false); // Mettre loading à false en cas d'erreur de chargement
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
    <div style={{ position: 'relative', height: '100vh', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h1 style={{ position: 'absolute', top: '50px',color:'white' }}>MEMBRE DU PERSONEL</h1>
      <div style={{ height: '600px', width: '80%', backgroundColor:'white'}}>
        <DataGrid
          rows={personnes}
          columns={columns}
          pageSize={10}
          loading={loading}
          checkboxSelection
          disableSelectionOnClick
          components={{
            Toolbar: () => (
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <BoutonAdd /> {/* Utilisation du composant Bouton-Add */}
              </div>
            ),
          }}
        />
      </div>
    </div>
  );
};

export default Tableau;