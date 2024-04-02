import '../index.css'; // Importer le fichier CSS
import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';



function Tableau() {
  const [personnes, setPersonnes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch('https://server-iis.uccle.intra/API_Personne/api/Personne')
      .then(response => response.text()) // Utiliser .text() pour récupérer le texte brut de la réponse
      .then(data => {
        // Utiliser un parseur XML pour traiter les données XML
        const parser = new DOMParser();
        const xmlData = parser.parseFromString(data, 'text/xml');

        // Extraire les données de l'XML et les formater comme nécessaire
        const personnesData = Array.from(xmlData.querySelectorAll('personne')).map(personne => ({
          id: personne.querySelector('ID').textContent,
          nom: personne.querySelector('NOM').textContent,
          prenom: personne.querySelector('PRENOM').textContent,
          role: personne.querySelector('RÔLE').textContent,
          email: personne.querySelector('E-mail').textContent,
          entreeService: personne.querySelector('ENTREE_SERVICE').textContent,
          grade_nl: personne.querySelector('GRADE(nl)').textContent,
          grade: personne.querySelector('GRADE').textContent,
          affectation_nl: personne.querySelector('AFFECTATION(nl)').textContent,
          affectation: personne.querySelector('AFFECTATION').textContent,
          localisation_nl: personne.querySelector('LOCALISATION(nl)').textContent,
          localisation: personne.querySelector('LOCALISATION').textContent,
          numero: personne.querySelector('N°').textContent,
          nomChefService: personne.querySelector('NOM_CHEF_DU_SERVICE').textContent,
          prenomChefService: personne.querySelector('PRENOM_CHEF_DU_SERVICE').textContent,
          emailChefService: personne.querySelector('E-MAIL_CHEF_SERVICE').textContent,
          departements_nl: personne.querySelector('DEPARTEMENT(nl)').textContent,
          departements: personne.querySelector('DEPARTEMENT').textContent,
          nomChefDepartement: personne.querySelector('NOM_CHEF_DEPARTEMENT').textContent,
          prenomChefDepartement: personne.querySelector('PRENOM_CHEF_DEPARTEMENT').textContent,
          emailChefDepartement: personne.querySelector('E-MAIL_CHEF_DEPARTEMENT').textContent,
          pcuension: personne.querySelector('P+C:UENSION').textContent,
          tel: personne.querySelector('TEL').textContent,
          batiment: personne.querySelector('Batiment').textContent,
          etage: personne.querySelector('Etage').textContent
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
    { field: 'grade_nl', headerName: 'Grade (NL)', width: 150 },
    { field: 'grade', headerName: 'Grade', width: 150 },
    { field: 'affectation_nl', headerName: 'Affectation (NL)', width: 150 },
    { field: 'affectation', headerName: 'Affectation', width: 150 },
    { field: 'localisation_nl', headerName: 'Localisation (NL)', width: 150 },
    { field: 'localisation', headerName: 'Localisation', width: 150 },
    { field: 'numero', headerName: 'N°', width: 100 },
    { field: 'nomChefService', headerName: 'Nom Chef du Service', width: 200 },
    { field: 'prenomChefService', headerName: 'Prénom Chef du Service', width: 200 },
    { field: 'emailChefService', headerName: 'E-mail Chef du Service', width: 200 },
    { field: 'departements_nl', headerName: 'Départements (NL)', width: 150 },
    { field: 'departements', headerName: 'Départements', width: 150 },
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