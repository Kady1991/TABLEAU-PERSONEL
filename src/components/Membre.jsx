import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { IconButton, Fab } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';


const VISIBLE_FIELDS = [
    'id',
    'nom',
    'prenom',
    'role',
    'email',
    'entreeService',
    'gradeNL',
    'grade',
    'affectationNL',
    'affectation',
    'localisationNL',
    'localisation',
    'chefServiceNom',
    'chefServicePrenom',
    'chefServiceEmail',
    'departementNL',
    'departement',
    'chefDepartementNom',
    'chefDepartementPrenom',
    'chefDepartementEmail',
    'pension',
    'tel',
    'batiment',
    'etage',
    'batimentNL',
];
export default function Membre() {
  const [rows, setRows] = React.useState([
    { id: 1, nom: 'Dupont', prenom: 'Jean', role: 'Manager', email: 'jean.dupont@example.com', entreeService: '01/01/2022', gradeNL: 'Grade A', grade: 'Grade A', affectationNL: 'Service A', affectation: 'Service A', localisationNL: 'Paris', localisation: 'Paris', chefServiceNom: 'Chef A', chefServicePrenom: 'Jeanne', chefServiceEmail: 'jeanne.chef@example.com', departementNL: 'Département A', departement: 'Département A', chefDepartementNom: 'Directeur A', chefDepartementPrenom: 'David', chefDepartementEmail: 'david.directeur@example.com', pension: 'Oui', tel: '0123456789', batiment: 'Tour A', etage: ' Etage 1', etageNL: 'Verdieping 1', batimentNL: 'Building A' },
    { id: 2, nom: 'Martin', prenom: 'Marie', role: 'Superviseur', email: 'marie.martin@example.com', entreeService: '02/02/2022', gradeNL: 'Grade B', grade: 'Grade B', affectationNL: 'Service B', affectation: 'Service B', localisationNL: 'Lyon', localisation: 'Lyon', chefServiceNom:'Chef B', chefServicePrenom: 'Michel', chefServiceEmail: 'michel.chef@example.com', departementNL: 'Département B', departement: 'Département B', chefDepartementNom: 'Directeur B', chefDepartementPrenom: 'Sophie', chefDepartementEmail: 'sophie.directeur@example.com', pension: 'Non', tel: '9876543210', batiment: 'Tour B', etage: 'Etage2', etageNL: 'Verdieping 2', batimentNL: 'Building B' },
    { id: 3, nom: 'Durand', prenom: 'Pierre', role: 'Ingénieur', email: 'pierre.durand@example.com', entreeService: '03/03/2022', gradeNL: 'Grade C', grade: 'Grade C', affectationNL: 'Service C', affectation: 'Service C', localisationNL: 'Marseille', localisation: 'Marseille', chefServiceNom: 'Chef C', chefServicePrenom: 'Isabelle', chefServiceEmail: 'isabelle.chef@example.com', departementNL: 'Département C', departement: 'Département C', chefDepartementNom: 'Directeur C', chefDepartementPrenom: 'Julie', chefDepartementEmail: 'julie.directeur@example.com', pension: 'Oui', tel: '1234567890', batiment: 'Tour C', etage: 'Etage3', etageNL: 'Verdieping 3', batimentNL: 'Building C' },
    { id: 4, nom: 'Lefebvre', prenom: 'Sophie', role: 'Analyste', email: 'sophie.lefebvre@example.com', entreeService: '04/04/2022', gradeNL: 'Grade D', grade: 'Grade D', affectationNL: 'Service D', affectation: 'Service D', localisationNL: 'Toulouse', localisation: 'Toulouse', chefServiceNom: 'Chef D', chefServicePrenom: 'Patrick', chefServiceEmail: 'patrick.chef@example.com', departementNL: 'Département D', departement: 'Département D', chefDepartementNom: 'Directeur D', chefDepartementPrenom: 'Maxime', chefDepartementEmail: 'maxime.directeur@example.com', pension: 'Non', tel: '5432167890', batiment: 'Tour D', etage: 'Etage 4', etageNL: 'Verdieping 4', batimentNL: 'Building D' },
    { id: 5, nom: 'Leroy', prenom: 'Thomas', role: 'Chef de projet', email: 'thomas.leroy@example.com', entreeService: '06/06/2022', gradeNL: 'Grade F', grade: 'Grade F', affectationNL: 'Service F', affectation: 'Service F', localisationNL: 'Lille', localisation: 'Lille', chefServiceNom: 'Chef F', chefServicePrenom: 'Catherine', chefServiceEmail: 'catherine.chef@example.com', departementNL: 'Département F', departement: 'Département F', chefDepartementNom: 'Directeur F', chefDepartementPrenom: 'Sophie', chefDepartementEmail: 'sophie.directeur@example.com', pension: 'Non', tel: '8901234567', batiment: 'Tour F', etage: 'Etage 6', etageNL: 'Verdieping 6', batimentNL: 'Building F' },
  ]);

  const columns = React.useMemo(
    () => [
      { field: 'id', headerName: 'N°', width: 90 },
      { field: 'nom', headerName: 'NOM', width: 150 },
      { field: 'prenom', headerName: 'PRÉNOM', width: 150 },
      { field: 'role', headerName: 'RÔLE', width: 150 },
      { field: 'email', headerName: 'E-mail', width: 200 },
      { field: 'entreeService', headerName: 'ENTRÉE SERVICE', width: 200 },
      { field: 'gradeNL', headerName: 'GRADE (NL)', width: 150, hide: true },
      { field: 'grade', headerName: 'GRADE', width: 150 },
      { field: 'affectationNL', headerName: 'AFFECTATION (NL)', width: 200, hide: true },
      { field: 'affectation', headerName: 'AFFECTATION', width: 200 },
      { field: 'localisationNL', headerName: 'LOCALISATION (NL)', width: 200, hide: true },
      { field: 'localisation', headerName: 'LOCALISATION', width: 200 },
      { field: 'chefServiceNom', headerName: 'NOM CHEF DU SERVICE', width: 200 },
      { field: 'chefServicePrenom', headerName: 'PRÉNOM CHEF DU SERVICE', width: 200 },
      { field: 'chefServiceEmail', headerName: 'E-MAIL CHEF DU SERVICE', width: 200 },
      { field: 'departementNL', headerName: 'DÉPARTEMENT (NL)', width: 200, hide: true },
      { field: 'departement', headerName: 'DÉPARTEMENT', width: 200 },
      { field: 'chefDepartementNom', headerName: 'NOM CHEF DE DÉPARTEMENT', width: 200 },
      { field: 'chefDepartementPrenom', headerName: 'PRÉNOM CHEF DE DÉPARTEMENT', width: 200 },
      { field: 'chefDepartementEmail', headerName: 'E-MAIL CHEF DE DÉPARTEMENT', width: 200 },
      { field: 'pension', headerName: 'P+C: PENSION', width: 150 },
      { field: 'tel', headerName: 'TEL', width: 150 },
      { field: 'batiment', headerName: 'BÂTIMENT', width: 150 },
      { field: 'batimentNL', headerName: 'BÂTIMENT (NL)', width: 200, hide: true },
      { field: 'etage', headerName: 'ÉTAGE', width: 150 },
      { field: 'etageNL', headerName: 'ÉTAGE (NL)', width: 150, hide: true },
      {
        field: 'actions',
        headerName: 'Actions',
        width: 100,
        renderCell: (params) => (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <IconButton onClick={() => handleEdit(params.row.id)} style={{ color: '#2196f3' }} title="Modifier">
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => handleDelete(params.row.id)} style={{ color: '#f44336' }} title="Supprimer">
              <DeleteIcon />
            </IconButton>
          </div>
        ),
      },
    ],
    []
  );

  const handleDelete = (id) => {
    console.log(`Suppression du membre avec l'ID : ${id}`);
  };

  const handleEdit = (id) => {
    console.log(`Modification du membre avec l'ID : ${id}`);
  };

  const handleAdd = () => {
    console.log(`Ajout d'un nouveau membre`);
    const newId = Math.max(...rows.map((row) => row.id)) + 1;
    const newMember = {
      id: newId,
      nom: 'Kady',
      prenom: 'Prenom',
      role: 'Ingénieur',
      email: 'kady@example.com',
      entreeService: '01/04/2024',
      gradeNL: 'Grade C',
      grade: 'Grade C',
      affectationNL: 'Service IT',
      affectation: 'Service IT',
      localisationNL: 'Localisation',
      localisation: 'Localisation',
      chefServiceNom: 'Chef IT',
      chefServicePrenom: 'Chef IT',
      chefServiceEmail: 'chefit@example.com',
      departementNL: 'Département IT',
      departement: 'Département IT',
      chefDepartementNom: 'Directeur IT',
      chefDepartementPrenom: 'Directeur IT',
      chefDepartementEmail: 'directeurit@example.com',
      pension: 'Non',
      tel: '0123456789',
      batiment: 'Bâtiment',
      batimentNL: 'Bâtiment (NL)',
      etage: 'Étage',
      etageNL: 'Étage (NL)'
    };
    setRows([...rows, newMember]);
  };

  return (
    <Box className="data-grid-container">
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        checkboxSelection
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
        components={{
          Toolbar: GridToolbar,
        }}
        toolbarOptions={{
          showQuickFilter: true,
          densitySelectorIcon: null,
          columnsButtonIcon: null,
          exportButtonIcon: null,
          filterButtonIcon: null,
          importbuttonicon: null,
        }}
        fileName="export.csv"
        charset="UTF-8"
      />
      <Fab color="primary" aria-label="add" onClick={handleAdd} style={{ position: 'fixed', bottom: '16px', right: '16px' }}>
        <AddIcon />
      </Fab>
    </Box>
  );
}