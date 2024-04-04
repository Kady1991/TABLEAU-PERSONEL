
import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import ButtonExport from '../layout/ButtonExport'; // Importez le composant ButtonExport
import Add from "../layout/Add";


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
    { field: 'NomPersonne', headerName: 'NOM', width: 150 },
    { field: 'PrenomPersonne', headerName: 'PRENOM', width: 150 },
    { field: 'SiFrancais', headerName: 'RÔLE', width: 150  },
    { field: 'Email', headerName: 'E-mail', width: 200 },
    { field: 'DateEntree', headerName: 'ENTREE SERVICE', width: 200 },
    { field: 'NomWWGradeNl', headerName: 'GRADE(nl)', width: 150 },
    { field: 'NomWWGradeFr', headerName: 'GRADE', width: 150 },
    { field: 'NomServiceNl', headerName: 'AFFECTATION (nl)', width: 150 },
    { field: 'NomServiceFr', headerName: 'AFFECTATION', width: 150 },
    { field: 'NomRueNl', headerName: 'LOCALISATION(nl)', width: 150 },
    { field: 'NomRueFr', headerName: 'LOCALISATION', width: 150 },
    { field: 'Numero', headerName: 'N°', width: 100 },
    { field: 'NomChefService', headerName: 'NOM CHEF DU SERVICE', width: 200 },
    { field: 'PrenomChefService', headerName: 'PRENOM CHEF DU SERVICE', width: 200 },
    { field: 'EmailChefService', headerName: 'E-MAIL CHEF DU SERVICE', width: 200 },
    { field: 'NomDepartementNl', headerName: 'DEPARTEMENT(nl)', width: 150 },
    { field: 'NomDepartementFr', headerName: 'DEPARTEMENTS', width: 150 },
    { field: 'NomChefDepartement', headerName: 'NOM CHEF DEPARTEMENT', width: 200 },
    { field: 'PrenomChefDepartement', headerName: 'PRENOM CHEF DEPARTEMENT', width: 200},
    { field: 'EmailChefDepartement', headerName: 'E-MAIL CHEF DEPARTEMENT', width: 200},
    { field: 'P+C:UENSION', headerName: 'P+C:UENSION', width: 150},
    { field: 'TelPro', headerName: 'TEL', width: 150 },
    { field: 'Batiment', headerName: 'Batiment', width: 150 },
    { field: 'Etage', headerName: 'Etage', width: 150 },
    { field: 'BatimentNl', headerName: 'Batiment(nl)', width: 150 },


  ];


  return (
    <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', height: '80vh', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

      <h1 style={{ color: 'white' }}>MEMBRE DU PERSONNEL</h1>

      <div style={{ height: '75px', width: '80%', backgroundColor: 'white', position: 'relative', borderRadius: "0.4rem", display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>
        <ButtonExport personnes={personnes} columns={columns} className="bouton-export" />
      </div>
      <div style={{ margin: '5rem'}}>
        {/* Bouton Add */}
        <Add/>
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