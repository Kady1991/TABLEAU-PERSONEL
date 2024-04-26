import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import AddMemberForm from "../layout/AddMemberForm"; // Importez votre composant Add ici
import Export from "../layout/Export"; // Importez votre composant ButtonExport ici
import ActionComponent from "../layout/ActionComponent";
import { Fab } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import "../index.css"; // Importez le fichier CSS
import styled from 'styled-components';

function Tableau() {
  const [personnes, setPersonnes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false); // État pour contrôler la visibilité du formulaire


  useEffect(() => {
    fetchData();
  }, []);


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch('https://server-iis.uccle.intra/API_Personne/api/Personne')
      .then((response) => response.json())
      .then((data) => {
        const personnesData = data.map((personne) => ({
          ...personne,
          id: personne.IDPersonne,
        }));

        setPersonnes(personnesData);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Une erreur est survenue lors de la récupération des données :', error);
        setLoading(false);
      });
  };



  const columns = [
   
    { field: "IDPersonne", headerName: "ID", width: 150, hideable: true },
    {
      field: 'actions',
      headerName: 'Actions' ,
      width: 250, 

      sortable: false,
      renderCell: (params) => (
        <ActionComponent rowData={params.row} 
          onEdit={() => handleEdit(params.row.id)}
          onAddService={() => handleAddService(params.row.id)}
          onInfo={() => handleInfo(params.row.id)}
          onDelete={() => handleDelete(params.row.id)}
        />
      ),
      
      
    },
    { field: "NomPersonne", headerName: "NOM", width: 200, },
    { field: "PrenomPersonne", headerName: "PRENOM", width: 150 },
    { field: "Email", headerName: "E-mail", width: 250 },
    { field: "TelPro", headerName: "TEL", width: 150 },
    { field: "SiFrancais", headerName: "RÔLE", width: 100, hide: true },
    { field: "DateEntree", headerName: "ENTREE SERVICE", width: 200, hide: true },
    { field: "NomWWGradeNl", headerName: "GRADE(nl)", width: 200, hide: true },
    { field: "NomWWGradeFr", headerName: "GRADE", width: 200, hide: true },
    { field: "NomServiceNl", headerName: "AFFECTATION (nl)", width: 250, hide: true },
    { field: "NomServiceFr", headerName: "AFFECTATION", width: 250, hide: true },
    { field: "NomRueNl", headerName: "LOCALISATION(nl)", width: 250, hide: true },
    { field: "NomRueFr", headerName: "LOCALISATION", width: 250, hide: true },
    { field: "Numero", headerName: "N°", width: 100, hide: true },
    { field: "NomChefService", headerName: "NOM CHEF DU SERVICE", width: 250, hide: true },
    { field: "PrenomChefService", headerName: "PRENOM CHEF DU SERVICE", width: 250, hide: true },
    { field: "EmailChefService", headerName: "E-MAIL CHEF DU SERVICE", width: 250, hide: true },
    { field: "NomDepartementNl", headerName: "DEPARTEMENT(nl)", width: 250, hide: true },
    { field: "NomDepartementFr", headerName: "DEPARTEMENTS", width: 250, hide: true },
    { field: "NomChefDepartement", headerName: "NOM CHEF DEPARTEMENT", width: 250, hide: true },
    { field: "PrenomChefDepartement", headerName: "PRENOM CHEF DEPARTEMENT", width: 250, hide: true },
    { field: "EmailChefDepartement", headerName: "E-MAIL CHEF DEPARTEMENT", width: 250, hide: true },
    { field: "P+C:UENSION", headerName: "P+C:UENSION", width: 150, hide: true },
    { field: "Batiment", headerName: "Batiment", width: 100, hide: true },
    { field: "Etage", headerName: "Etage", width: 100, hide: true },
    { field: "BatimentNl", headerName: "Batiment(nl)", width: 100, hide: true },
  
  ];


  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        height: "500px", // Ajout de "px"
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h1 style={{ color: "white" }}>MEMBRE DU PERSONNEL</h1>
  
      <div
        style={{
          height: "75px",
          width: "80%",
          backgroundColor: "white",
          position: "relative",
          borderRadius: "0.4rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: "2rem", // Ajout de marginTop
        }}
      >
        <div style={{ margin: "2rem" }}>
          <Export
            personnes={personnes}
            columns={columns}
            className="bouton-export"
          />
        </div>
  
        {/* Bouton flottant pour afficher le formulaire */}
        <div style={{ marginRight: "2rem" }}>
          <Fab color="primary" aria-label="add" onClick={() => setShowForm(true)}>
            <AddIcon />
          </Fab>
        </div>
      </div>
  
      {/* Affichage conditionnel du formulaire */}
      {showForm && (
        <div style={{ }}>
          <AddMemberForm />
        </div>
      )}
  
      <div
        style={{
          height: "calc(100% - 75px - 2rem)", // Calcul de la hauteur restante
          width: "80%",
          backgroundColor: "white",
          position: "relative",
          marginTop: "2rem",
          borderRadius: "0.5rem",
          zIndex: "0",
        }}
      >
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