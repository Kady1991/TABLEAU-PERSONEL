
import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import ButtonExport from '../layout/ButtonExport'; // Importez le composant ButtonExport


function Tableau() {
  const [personnes, setPersonnes] = useState([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    fetchData();
  }, []);

  

  const fetchData = () => {
    fetch('https://server-iis.uccle.intra/API_Personne_nat/api/Personne')
      .then(response => response.json())
      .then(data => {
        const personnesData = data.map(personne => ({
          ...personne,
          id: personne.IDPersonne // Utilisez une propriété unique comme IDPersonne
        }));

        setPersonnes(personnesData);
        setLoading(false);
      })
      .catch(error => {
        console.error('Une erreur est survenue lors de la récupération des données :', error);
        setLoading(false);
      });
  };



  const columns = [
    { field: 'IDPersonne', headerName: 'ID', width: 100 },
    { field: 'NomPersonne', headerName: 'Nom', width: 150 },
    { field: 'PrenomPersonne', headerName: 'Prénom', width: 150 },
    { field: 'TelPro', headerName: 'Tel', width: 150 },
    { field: 'Email', headerName: 'E-mail', width: 200 },
    { field: 'DateEntree', headerName: 'Entrée Service', width: 200 },
    { field: 'NomWWGradeNl', headerName: 'Grade (NL)', width: 150 },
    { field: 'NomWWGradeFr', headerName: 'Grade', width: 150 },
    { field: 'NomServiceNl', headerName: 'Affectation (NL)', width: 150 },
    { field: 'NomServiceFr', headerName: 'Affectation', width: 150 },
    { field: 'NomRueNl', headerName: 'Localisation (NL)', width: 150 },
    { field: 'NomRueFr', headerName: 'Localisation', width: 150 },
    { field: 'Numero', headerName: 'N°', width: 100 },
    { field: 'NomChefService', headerName: 'Nom Chef du Service', width: 200 },
    { field: 'PrenomChefService', headerName: 'Prénom Chef du Service', width: 200 },
    { field: 'EmailChefService', headerName: 'E-mail Chef du Service', width: 200 },
    { field: 'NomDepartementNl', headerName: 'Départements (NL)', width: 150 },
    { field: 'NomDepartementFr', headerName: 'Départements', width: 150 },
  ];


  return (
    <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', height: '80vh', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

      <h1 style={{ color: 'white' }}>MEMBRE DU PERSONNEL</h1>

        <div style={{ height: '75px', width: '80%', backgroundColor: 'white', position: 'relative', borderRadius: "0.4rem", display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ margin: '1rem'}}>
            <ButtonExport personnes={personnes} columns={columns} className="bouton-export" />
          </div>
        </div>

      <div style={{ height: '600px', width: '80%', backgroundColor: 'white', position: 'relative', marginTop: '2rem', borderRadius: "0.5rem" }}>
        <DataGrid
          rows={personnes}
          columns={columns}
          pageSize={10}
          loading={loading}
          checkboxSelection
          disableSelectionOnClick
        />
      </div>
    </div>

  );
};

export default Tableau;