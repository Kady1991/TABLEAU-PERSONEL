import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import '../assets/index.css';
import Delete from "../layout/Delete.jsx";
import FormService from "../layout/FormService.jsx";
import Detail from "../layout/Detail.jsx";
import EditMemberForm from "../layout/EditMemberForm.jsx";
import RestoreAction from "../layout/RestoreAction.jsx";
import { LIEN_API_PERSONNE } from "../config.js";

function Tableau() {
  const [personnes, setPersonnes] = useState([]);
  const [loading, setLoading] = useState(true);

  const linkGetAllPersonnel = `${LIEN_API_PERSONNE}/api/Personne`;

  const fetchData = () => {
    fetch(`${LIEN_API_PERSONNE}/api/Personne`)
      .then((response) => response.json())
      .then((data) => {
        setPersonnes(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des données :", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ Fonction qui recharge les données après une action
  const refreshData = () => {
    setLoading(true);
    fetchData();
  };


  // Filtrer les données non archivées
  const nonArchivedPersonnes = personnes.filter((personne) => personne.SiArchive === false);

  const handleDeleteSuccess = (deletedId) => {
    setPersonnes((prevPersonnes) =>
      prevPersonnes.filter((personne) => personne.IDPersonneService !== deletedId)
    );
  };

  const handleDeleteError = (deletedId) => {
    console.error(`Une erreur s'est produite lors de la suppression de l'élément avec l'ID ${deletedId}.`);
  };

  const handleRestoreSuccess = (restoredId) => {
    console.log(`La personne avec l'id ${restoredId} a été restaurée avec succès.`);
  };

  const handleRestoreError = (restoredId) => {
    console.error(`Une erreur s'est produite lors de la restauration de la personne avec l'ID ${restoredId}.`);
  };

  const columns = [
    { field: "IDPersonneService", headerName: "ID", width: 50, hideable: true },
    // { field: "PersonneID", headerName: "ID", width: 50, hideable: true },
    {
      field: "actions",
      headerName: "Actions",
      width: 350, // Augmentez la largeur pour inclure l'icône de restauration
      sortable: false,
      headerAlign: "center",
      headerClassName: "header-center",
      renderCell: (params) => (
        <div

          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            justifyContent: "center",
            position: "relative"
          }}
        >
          {/* Div pour actions standards */}
          <div
            style={{
              display: params.row.SiArchive === false ? "flex" : "none",
              alignItems: "center",
              justifyContent: "center",
              gap: "15px",
            }}
          >
            <FormService IDPersonneService={params.row.IDPersonneService} />
            <Detail IDPersonneService={params.row.IDPersonneService} />
            <EditMemberForm IDPersonneService={params.row.IDPersonneService} refreshData={refreshData} />
            <Delete
              IDPersonneService={params.row.IDPersonneService}
              nomPersonne={params.row.NomPersonne}
              prenomPersonne={params.row.PrenomPersonne}
              email={params.row.Email}
              refreshData={refreshData}
            />
          </div>


          {/* Actions de restauration */}
          <div className={params.row.SiArchive ? "RestoreIcon visible" : "RestoreIcon hidden"}>
            <Detail IDPersonneService={params.row.IDPersonneService} />
            <RestoreAction
              PersonneID={params.row.PersonneID}
              nomPersonne={params.row.NomPersonne}
              prenomPersonne={params.row.PrenomPersonne}
              email={params.row.Email}
              refreshData={refreshData}
            />
          </div>
        </div>
      ),
    },

    { field: "NomPersonne", headerName: "NOM", width: 200 },
    { field: "PrenomPersonne", headerName: "PRENOM", width: 200 },
    { field: "Email", headerName: "E-mail", width: 250 },
    { field: "TelPro", headerName: "TEL", width: 150 },
    { field: "SiFrancaisString", headerName: "RÔLE", width: 150, hide: true },
    {
      field: "DateEntree",
      headerName: "ENTREE SERVICE",
      width: 200,
      hide: true,
    },
    { field: "NomWWGradeNl", headerName: "GRADE(nl)", width: 200, hide: true },
    { field: "NomWWGradeFr", headerName: "GRADE", width: 200, hide: true },
    {
      field: "NomServiceNl",
      headerName: "AFFECTATION (nl)",
      width: 250,
      hide: true,
    },
    {
      field: "NomServiceFr",
      headerName: "AFFECTATION",
      width: 250,
      hide: true,
    },
    {
      field: "NomRueNl",
      headerName: "LOCALISATION(nl)",
      width: 250,
      hide: true,
    },
    { field: "NomRueFr", headerName: "LOCALISATION", width: 250, hide: true },
    { field: "Numero", headerName: "N°", width: 100, hide: true },
    {
      field: "NomChefService",
      headerName: "NOM CHEF DU SERVICE",
      width: 250,
      hide: true,
    },
    {
      field: "PrenomChefService",
      headerName: "PRENOM CHEF DU SERVICE",
      width: 250,
      hide: true,
    },
    {
      field: "EmailChefService",
      headerName: "E-MAIL CHEF DU SERVICE",
      width: 250,
      hide: true,
    },
    {
      field: "NomDepartementNl",
      headerName: "DEPARTEMENT(nl)",
      width: 250,
      hide: true,
    },
    {
      field: "NomDepartementFr",
      headerName: "DEPARTEMENTS",
      width: 250,
      hide: true,
    },
    {
      field: "NomChefDepartement",
      headerName: "NOM CHEF DEPARTEMENT",
      width: 250,
      hide: true,
    },
    {
      field: "PrenomChefDepartement",
      headerName: "PRENOM CHEF DEPARTEMENT",
      width: 250,
      hide: true,
    },
    {
      field: "EmailChefDepartement",
      headerName: "E-MAIL CHEF DEPARTEMENT",
      width: 250,
      hide: true,
    },
    { field: "P+C:UENSION", headerName: "P+C:UENSION", width: 150, hide: true },
    { field: "Batiment", headerName: "Batiment", width: 100, hide: true },
    { field: "Etage", headerName: "Etage", width: 100, hide: true },
    { field: "BatimentNl", headerName: "Batiment(nl)", width: 100, hide: true },
  ];

  // const handleExport = () => {
  //   // Appeler le composant Export en lui passant les données filtrées
  //   Export(nonArchivedPersonnes);
  // };

  return (
    <div>
      <div className="main-container">

        <div className="data-grid-container">
          <DataGrid
            rows={personnes}
            columns={columns}
            pageSize={15}
            loading={loading}
            checkboxSelection
            disableSelectionOnClick
            getRowClassName={(params) =>
              params.row.SiArchive ? "archive-row" : ""
            }
            getRowId={(row) => row.IDPersonneService} // Utilisation de la prop getRowId
          />
        </div>
      </div>
    </div>
  )
}
export default Tableau;
