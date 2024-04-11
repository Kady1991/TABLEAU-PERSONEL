import React from "react";
import Button from "@mui/material/Button"; // Importez le bouton MUI


import "../index.css"; // Importez le fichier CSS

const Export = ({ personnes, className }) => {
  const generateCsvData = () => {
    const columns = [
      // { field: 'IDPersonne', headerName: 'ID', width: 100 }, PAS BESOIND DE ID DANS L'EXPORT
      { field: "NomPersonne", headerName: "NOM", width: 150 },
      { field: "PrenomPersonne", headerName: "PRENOM", width: 150 },
      { field: "SiFrancais", headerName: "RÔLE", width: 150 },
      { field: "Email", headerName: "E-mail", width: 150 },
      { field: "DateEntree", headerName: "ENTREE SERVICE", width: 150 },
      { field: "NomWWGradeNl", headerName: "GRADE(nl)", width: 150 },
      { field: "NomWWGradeFr", headerName: "GRADE", width: 150 },
      { field: "NomServiceNl", headerName: "AFFECTATION (nl)", width: 150 },
      { field: "NomServiceFr", headerName: "AFFECTATION", width: 150 },
      { field: "NomRueNl", headerName: "LOCALISATION(nl)", width: 150 },
      { field: "NomRueFr", headerName: "LOCALISATION", width: 150 },
      { field: "Numero", headerName: "N°", width: 100 },
      {
        field: "NomChefService",
        headerName: "NOM CHEF DU SERVICE",
        width: 250,
      },
      {
        field: "PrenomChefService",
        headerName: "PRENOM CHEF DU SERVICE",
        width: 250,
      },
      {
        field: "EmailChefService",
        headerName: "E-MAIL CHEF DU SERVICE",
        width: 250,
      },
      { field: "NomDepartementNl", headerName: "DEPARTEMENT(nl)", width: 150 },
      { field: "NomDepartementFr", headerName: "DEPARTEMENTS", width: 150 },
      {
        field: "NomChefDepartement",
        headerName: "NOM CHEF DEPARTEMENT",
        width: 250,
      },
      {
        field: "PrenomChefDepartement",
        headerName: "PRENOM CHEF DEPARTEMENT",
        width: 250,
      },
      {
        field: "EmailChefDepartement",
        headerName: "E-MAIL CHEF DEPARTEMENT",
        width: 250,
      },
      { field: "P+C:UENSION", headerName: "P+C:UENSION", width: 150 },
      { field: "TelPro", headerName: "TEL", width: 150 },
      { field: "Batiment", headerName: "Batiment", width: 150 },
      { field: "Etage", headerName: "Etage", width: 150 },
      { field: "BatimentNl", headerName: "Batiment(nl)", width: 150 },
    ];

    const headers = columns.map((column) => column.headerName).join(",") + "\n";
    const filteredRows = personnes.filter(
      (personne) =>
        personne.SiArchive === false || personne.SiArchive === undefined
    );

    const rows = filteredRows
      .map((item) =>
        columns.map((column) => item[column.field]).join(";")
      )
      .join("\n");

    return headers + rows;
  };

  const handleExportCsv = () => {
    const csvData = generateCsvData();
    const blob = new Blob([csvData], { type: "text/csv" });
    const csvUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = csvUrl;
    link.setAttribute("download", "data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button className={`bouton-export ${className}`} onClick={handleExportCsv}>
      Exporter
    </Button>
  );
};

export default Export;