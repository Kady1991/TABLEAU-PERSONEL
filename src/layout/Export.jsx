const Export = ({ personnes }) => {
  console.log("Données reçues dans Export :", personnes);

  if (!personnes || personnes.length === 0) {
    alert("Aucune donnée à exporter.");
    return;
  }

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

  const cleanData = (value) => {
    if (value === null || value === undefined) return '""';

    const cleaned = String(value)
      .replace(/(\r\n|\n|\r)/gm, " ")
      .replace(/"/g, '""')
      .trim();

    return `"${cleaned}"`;
  };

  const headers = columns.map((col) => `"${col.headerName}"`).join(";") + "\n";

  const rows = personnes
    .map((item) =>
      columns.map((col) => cleanData(item[col.field])).join(";")
    )
    .join("\n");

  const csvData = headers + rows;

  const blob = new Blob(["\uFEFF" + csvData], {
    type: "text/csv;charset=utf-8;",
  });

  const csvUrl = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = csvUrl;
  link.setAttribute("download", "export_personnel.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(csvUrl);
};

export default Export;