import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import '../assets/index.css';
// import Export from "../layout/Export.jsx";
// import ArchiveList from "../layout/ArchiveList.jsx";
// import AddMemberForm from "../layout/AddMemberForm.jsx";
import Delete from "../layout/Delete.jsx";
import FormService from "../layout/FormService.jsx";
import Detail from "../layout/Detail.jsx";
import EditMemberForm from "../layout/EditMemberForm.jsx";
import RestoreAction from "../layout/RestoreAction.jsx";
// import { IoPersonAddSharp } from "react-icons/io5";
// import Statistics from '../layout/Statistics';
// import logoWhite from '../assets/logo_white.png';
// import MenuPersonnel from "../layout/MenuPersonnel";





function Tableau() {
  const [personnes, setPersonnes] = useState([]);
  const [loading, setLoading] = useState(true);

  const linkGetAllPersonnel = "https://server-iis.uccle.intra/API_PersonneTest/api/Personne";

  const fetchData = () => {
    fetch(linkGetAllPersonnel)
      .then((response) => response.json())
      .then((data) => {
        console.log("data", data);
        const personnesData = data.map((personne) => ({
          ...personne,
          // id: personne.IDPersonneService,
          IDPersonneService: personne.IDPersonneService,// L'ID réel retourné par l'API
          affichageIDPersonneService: personne.PersonneID || personne.IDPersonneService
        }));
        setPersonnes(personnesData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Une erreur est survenue lors de la récupération des données :", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);



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
            <EditMemberForm IDPersonneService={params.row.IDPersonneService} />
            <Delete
              IDPersonneService={params.row.IDPersonneService}
              nomPersonne={params.row.NomPersonne}
              prenomPersonne={params.row.PrenomPersonne}
              email={params.row.Email}
              onSuccess={handleDeleteSuccess}
              onError={handleDeleteError}
            />

          </div>


          {/* Div pour actions de restauration */}
          <div className={params.row.SiArchive ? "RestoreIcon visible" : "RestoreIcon hidden"}>
            <Detail IDPersonneService={params.row.IDPersonneService}
              nomPersonne={params.row.NomPersonne}
              prenomPersonne={params.row.PrenomPersonne}
              email={params.row.Email}
              onSuccess={handleDeleteSuccess}
              onError={handleDeleteError}
            />
            <RestoreAction
              PersonneID={params.row.PersonneID}
              nomPersonne={params.row.NomPersonne}
              prenomPersonne={params.row.PrenomPersonne}
              email={params.row.Email}
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

  // const handleExport = () => {
  //   // Appeler le composant Export en lui passant les données filtrées
  //   Export(nonArchivedPersonnes);
  // };

  return (
    <div>
      <div className="main-container">
        {/* <div className="icon-tableau">
        <IoPersonAddSharp className="person-icon-tableau" />

        </div> */}
        {/* <div>
        </div> */}
        {/* <div >
          <h1 className="title-tableau">MEMBRES DU PERSONNEL</h1>
        </div> */}


        {/* <div className="header-container"> */}
        {/* <div className="titre-et-statistics"> */}
        {/* <img src={logoWhite} alt="Logo" className="LOGO" style={{ width: '100px' }} /> */}
        {/* <h1 className="title-tableau">MEMBRES DU PERSONNEL</h1> */}
        {/* <MenuPersonnel /> */}
        {/* </div> */}
         {/* <div className="menu-container">
         <button onClick={handleExport} className="export-button">
            Exporter les données
          </button>
          </div>  */}
        {/* <div className="archive-container">
            <ArchiveList className="archive" />
          </div> */}
        {/* <Statistics data={personnes} />
          <div className="add-member-container">
            <AddMemberForm />
          </div> */}
        {/* </div> */}

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
