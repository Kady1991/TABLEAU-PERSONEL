import React from "react";
import Button from "@mui/material/Button";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

const Export = ({ personnes, className }) => {
  const generateCsvData = () => {
    const columns = [
      // { field: 'IDPersonne', headerName: 'ID', width: 100 }, PAS BESOIND DE ID DANS L'EXPORT
      { field: "NomPersonne", headerName: "NOM", width: 250 },
      { field: "PrenomPersonne", headerName: "PRENOM", width: 250 },
      { field: "SiFrancaisSting", headerName: "RÔLE", width: 250 },
      { field: "Email", headerName: "E-mail", width: 250 },
      { field: "DateEntree", headerName: "ENTREE SERVICE", width: 250 },
      { field: "NomWWGradeNl", headerName: "GRADE(nl)", width: 250 },
      { field: "NomWWGradeFr", headerName: "GRADE", width: 250 },
      { field: "NomServiceNl", headerName: "AFFECTATION (nl)", width: 250 },
      { field: "NomServiceFr", headerName: "AFFECTATION", width: 250 },
      { field: "NomRueNl", headerName: "LOCALISATION(nl)", width: 250 },
      { field: "NomRueFr", headerName: "LOCALISATION", width: 250 },
      { field: "Numero", headerName: "N°", width: 150 },
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
      { field: "NomDepartementNl", headerName: "DEPARTEMENT(nl)", width: 250 },
      { field: "NomDepartementFr", headerName: "DEPARTEMENTS", width: 250 },
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

    const headers = columns.map((column) => column.headerName).join(";") + "\n";
    const filteredRows = personnes.filter(
      (personne) =>
        personne.SiArchive === false || personne.SiArchive === undefined
    );

    const rows = filteredRows
      .map((item) => columns.map((column) => item[column.field]).join(";"))
      .join("\n");

    // Retourner les données CSV sous forme de texte
    return headers + rows;
  };

  const handleExportCsv = () => {
    const csvData = generateCsvData();

    // Créer un objet Blob à partir des données CSV avec le type "text/csv"
    const blob = new Blob([csvData], { type: "text/csv" });

    // Créer un URL à partir du Blob
    const csvUrl = window.URL.createObjectURL(blob);

    // Créer un élément d'ancrage pour télécharger le fichier CSV
    const link = document.createElement("a");
    link.href = csvUrl;
    link.setAttribute("download", "data.csv");

    // Simuler un clic sur le lien pour télécharger le fichier
    link.click();

    // Libérer l'URL de l'objet Blob
    window.URL.revokeObjectURL(csvUrl);
  };

  return (
    <Button
    variant="contained"
    startIcon={<FileDownloadIcon />}
    onClick={handleExportCsv}
    className={className}
    style={{ backgroundColor: "#095c83" }}
  >
    Exporter
  </Button>
  
  );
};

export default Export;
