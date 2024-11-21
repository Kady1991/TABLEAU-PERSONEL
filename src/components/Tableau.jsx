import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import "../index.css";
import Export from "../layout/Export.jsx";
import AddMemberForm from "../layout/AddMemberForm.jsx";
import Delete from "../layout/Delete.jsx";
import FormService from "../layout/FormService.jsx";
import Detail from "../layout/Detail.jsx";
import EditMemberForm from "../layout/EditMemberForm.jsx";
import RestoreAction from "../layout/RestoreAction.jsx";
import { faPersonWalking } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IoPersonAddSharp } from "react-icons/io5";

function Tableau() {
  const [personnes, setPersonnes] = useState([]);
  const [loading, setLoading] = useState(true);

  const linkGetAllPersonnel =
    "https://server-iis.uccle.intra/API_PersonneTest/api/Personne";
  //const linkGetAllPersonnel = "https://localhost:44333/api/Personne";

  const fetchData = () => {
    fetch(linkGetAllPersonnel)
      .then((response) => response.json())
      .then((data) => {
        const personnesData = data.map((personne) => ({
          ...personne,
          id: personne.IDPersonne,
          personneID: personne.PersonneID,
        }));

        setPersonnes(personnesData);
        setLoading(false);
      })
      .catch((error) => {
        console.error(
          "Une erreur est survenue lors de la récupération des données :",
          error
        );
        setLoading(false);
      });
  };


  useEffect(() => {
    // Effect for fetching data after successful deletion or addition
    fetchData();
  }, [personnes]); // This will trigger the effect whenever personnes state changes

  // Définition de la fonction handleDeleteSuccess
  const handleDeleteSuccess = (deletedId) => {
    setPersonnes((prevPersonnes) =>
      prevPersonnes.filter((personne) => personne.id !== deletedId)
    );
  };

  // Définition de la fonction handleDeleteError
  const handleDeleteError = (deletedId) => {
    //  gérer l'erreur lors de la suppression
    console.error(
      `Une erreur s'est produite lors de la suppression de l'élément avec l'ID ${deletedId}.`
    );
  };

  const handleRestoreSuccess = (restoredId) => {
    // Mettez ici le code à exécuter en cas de succès de la restauration
    console.log(
      `La personne avec l'id ${restoredId} a été restaurée avec succès.`
    );
  };

  const handleRestoreError = (restoredId) => {
    // Mettez ici le code à exécuter en cas d'erreur lors de la restauration
    console.error(
      `Une erreur s'est produite lors de la restauration de la personne avec l'ID ${restoredId}.`
    );
  };

  // Define handleClick function
  const handleClick = () => {
    // Add your click handling logic here
  };

  const columns = [
    { field: "IDPersonne", headerName: "ID", width: 50, hideable: true },
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
            gap: "20px",
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
              gap: "20px",
            }}
          >
            <FormService personId={params.row.personneID} />
            <Detail onClick={handleClick} rowData={params.row.personneID} />
            <EditMemberForm IDPersonne={params.row.personneID} />
            <Delete
              IDPersonne={params.row.personneID}
              nomPersonne={params.row.NomPersonne}
              prenomPersonne={params.row.PrenomPersonne}
              email={params.row.Email}
              onSuccess={handleDeleteSuccess}
              onError={handleDeleteError}
            />
          </div>

                   
    

          {/* Div pour actions de restauration */}
          <div  className={params.row.SiArchive ? "RestoreIcon visible" : "RestoreIcon hidden"}>
            <RestoreAction 
              IDPersonne={params.row.personneID}
              onSuccess={handleRestoreSuccess}
              onError={(id) =>
                console.error(
                  `Une erreur est survenue lors de la restauration de l'ID: ${id}`
                )
              }
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

  return (
    <div>
      <div className="main-container">
        <div className="icon-tableau">
          <IoPersonAddSharp className="custom-person-icon" />
        </div>
        <h1 className="title">MEMBRE DU PERSONNEL</h1>

        <div className="header-container">
          <div className="export-container">
            <Export personnes={personnes} columns={columns} className="bouton-export" />
          </div>
          <div className="icon-container">
            <FontAwesomeIcon icon={faPersonWalking} className="person-walking-icon" />
          </div>
          <div className="add-member-container">
            <AddMemberForm />
          </div>
        </div>

        <div className="data-grid-container">
          <DataGrid
            rows={personnes}
            columns={columns}
            pageSize={10}
            loading={loading}
            checkboxSelection
            disableSelectionOnClick
            getRowClassName={(params) => (params.row.SiArchive ? "archive-row" : "")}
          />
        </div>
      </div>
    </div>
  )}
export default Tableau;
