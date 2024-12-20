import React, { useEffect } from "react";

const Export = ({ personnes }) => {
  useEffect(() => {
    const handleExportCsv = () => {
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

        const cleanData = (value) => {
          if (!value) return '""';
          const cleanedValue = String(value)
            .replace(/(\r\n|\n|\r)/gm, " ")
            .replace(/"/g, '""')
            .trim();
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

      const csvData = generateCsvData();
      const blob = new Blob([csvData], { type: "text/csv" });
      const csvUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = csvUrl;
      link.setAttribute("download", "data.csv");
      link.click();
      window.URL.revokeObjectURL(csvUrl);
    };

    // Exécute l'exportation CSV dès que le composant est chargé
    handleExportCsv();
  }, [personnes]);

  return (
    <div className="export-container" style={{ textAlign: 'center', marginTop: '200px', backgroundColor:"red", width:"40%", margin:"auto" }}>
      <h2>Exportation en cours...</h2>
      <p>Veuillez patienter pendant que les données sont exportées.</p>
    </div>
  );
};

export default Export;
