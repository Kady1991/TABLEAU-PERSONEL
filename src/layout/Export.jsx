import React from 'react';

const Export = ({ personnes }) => {
  console.log("Données reçues dans Export :", personnes);

  if (!personnes || personnes.length === 0) {
    alert("Aucune donnée à exporter.");
    return;
  }
  const generateCsvData = () => {
    // Définition des colonnes directement dans Export
    const columns = [
      { field: "NomPersonne", headerName: "NOM" },
      { field: "PrenomPersonne", headerName: "PRENOM" },
      { field: "SiFrancaisString", headerName: "RÔLE" },
      { field: "Email", headerName: "E-mail" },
      { field: "DateEntree", headerName: "ENTREE SERVICE" },
      { field: "NomWWGradeNl", headerName: "GRADE(nl)" },
      { field: "NomWWGradeFr", headerName: "GRADE" },
      { field: "NomServiceNl", headerName: "AFFECTATION (nl)" },
      { field: "NomServiceFr", headerName: "AFFECTATION" },
      { field: "NomRueNl", headerName: "LOCALISATION(nl)" },
      { field: "NomRueFr", headerName: "LOCALISATION" },
      { field: "Numero", headerName: "N°" },
      { field: "NomChefService", headerName: "NOM CHEF DU SERVICE" },
      { field: "PrenomChefService", headerName: "PRENOM CHEF DU SERVICE" },
      { field: "EmailChefService", headerName: "E-MAIL CHEF DU SERVICE" },
      { field: "NomDepartementNl", headerName: "DEPARTEMENT(nl)" },
      { field: "NomDepartementFr", headerName: "DEPARTEMENTS" },
      { field: "NomChefDepartement", headerName: "NOM CHEF DEPARTEMENT" },
      { field: "PrenomChefDepartement", headerName: "PRENOM CHEF DEPARTEMENT" },
      { field: "EmailChefDepartement", headerName: "E-MAIL CHEF DEPARTEMENT" },
      { field: "P+C:UENSION", headerName: "P+C:UENSION" },
      { field: "TelPro", headerName: "TEL" },
      { field: "Batiment", headerName: "Batiment" },
      { field: "Etage", headerName: "Etage" },
      { field: "BatimentNl", headerName: "Batiment(nl)" },
    ];

    // Filtrer uniquement les colonnes visibles
    const visibleColumns = columns.filter((col) => !col.hide);

    const cleanData = (value) => {
      if (!value) return '""';
      const cleanedValue = String(value)
        .replace(/(\r\n|\n|\r)/gm, " ")
        .replace(/"/g, '""')
        .trim();
      return `"${cleanedValue}"`;
    };

    // Générer les en-têtes à partir des colonnes visibles
    const headers = visibleColumns.map((col) => cleanData(col.headerName)).join(";") + "\n";

    // Générer les lignes à partir des données et des colonnes visibles
    const rows = personnes
      .map((item) =>
        visibleColumns.map((col) => cleanData(item[col.field])).join(";")
      )
      .join("\n");

    return headers + rows;
  };

  const csvData = generateCsvData();
  if (!csvData) return;

  const blob = new Blob([csvData], { type: "text/csv" });
  const csvUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = csvUrl;
  link.setAttribute("download", "export_personnel.csv");
  link.click();
  URL.revokeObjectURL(csvUrl);
};

export default Export;
