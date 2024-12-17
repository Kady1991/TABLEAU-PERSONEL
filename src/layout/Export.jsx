import React from "react";
import Button from "@mui/material/Button";
import { CiExport } from "react-icons/ci";

const Export = ({ personnes, className }) => {
  const generateCsvData = () => {
    const columns = [
      { field: "NomPersonne", headerName: "NOM", width: 250 },
      { field: "PrenomPersonne", headerName: "PRENOM", width: 250 },
      { field: "SiFrancaisString", headerName: "RÔLE", width: 250 },
      { field: "Email", headerName: "E-mail", width: 250 },
      { field: "DateEntree", headerName: "ENTREE SERVICE", width: 250 },
      { field: "NomWWGradeNl", headerName: "GRADE(nl)", width: 250 },
      { field: "NomWWGradeFr", headerName: "GRADE", width: 250 },
      { field: "NomServiceNl", headerName: "AFFECTATION (nl)", width: 250 },
      { field: "NomServiceFr", headerName: "AFFECTATION", width: 250 },
      { field: "NomRueNl", headerName: "LOCALISATION(nl)", width: 250 },
      { field: "NomRueFr", headerName: "LOCALISATION", width: 250 },
      { field: "Numero", headerName: "N°", width: 150 },
      { field: "NomChefService", headerName: "NOM CHEF DU SERVICE", width: 250 },
      { field: "PrenomChefService", headerName: "PRENOM CHEF DU SERVICE", width: 250 },
      { field: "EmailChefService", headerName: "E-MAIL CHEF DU SERVICE", width: 250 },
      { field: "NomDepartementNl", headerName: "DEPARTEMENT(nl)", width: 250 },
      { field: "NomDepartementFr", headerName: "DEPARTEMENTS", width: 250 },
      { field: "NomChefDepartement", headerName: "NOM CHEF DEPARTEMENT", width: 250 },
      { field: "PrenomChefDepartement", headerName: "PRENOM CHEF DEPARTEMENT", width: 250 },
      { field: "EmailChefDepartement", headerName: "E-MAIL CHEF DEPARTEMENT", width: 250 },
      { field: "P+C:UENSION", headerName: "P+C:UENSION", width: 150 },
      { field: "TelPro", headerName: "TEL", width: 150 },
      { field: "Batiment", headerName: "Batiment", width: 150 },
      { field: "Etage", headerName: "Etage", width: 150 },
      { field: "BatimentNl", headerName: "Batiment(nl)", width: 150 },
    ];

    // Nettoyage des données et ajout de guillemets autour de chaque champ
    const cleanData = (value) => {
      if (!value) return '""';
      const cleanedValue = String(value)
        .replace(/(\r\n|\n|\r)/gm, " ") // Supprime les retours à la ligne
        .replace(/"/g, '""') // Échappe les guillemets pour le CSV
        .trim(); // Supprime les espaces en début/fin
      return `"${cleanedValue}"`;
    };

    const headers = columns.map((column) => cleanData(column.headerName)).join(";") + "\n";

    const filteredRows = personnes.filter((personne) => personne.SiArchive !== true);

    const rows = filteredRows
      .map((item) =>
        columns.map((column) => cleanData(item[column.field])).join(";")
      )
      .join("\n");

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

    link.click();

    window.URL.revokeObjectURL(csvUrl);
  };

  return (
    <Button 
      className="button"
      variant="contained"
      startIcon={<CiExport />}
      onClick={handleExportCsv}
      
    >
      Exporter
    </Button>
  );
};

export default Export;
