import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const VISIBLE_FIELDS = [
    'id',
    'nom',
    'prenom',
    'role',
    'email',
    'entreeService',
    'grade',
    'affectation',
    'localisation',
    'chefServiceNom',
    'chefServicePrenom',
    'chefServiceEmail',
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

  const rows = [
    { id: 1, nom: 'Dupont', prenom: 'Jean', role: 'Manager', email: 'jean.dupont@example.com', entreeService: '01/01/2022', grade: 'Grade A', affectation: 'Service A', localisation: 'Paris', chefServiceNom: 'Chef A', chefServicePrenom: 'Jeanne', chefServiceEmail: 'jeanne.chef@example.com', departement: 'Département A', chefDepartementNom: 'Directeur A', chefDepartementPrenom: 'David', chefDepartementEmail: 'david.directeur@example.com', pension: 'Oui', tel: '0123456789', batiment: 'Tour A', etage: '1', batimentNL: 'Building A' },
    { id: 2, nom: 'Martin', prenom: 'Marie', role: 'Superviseur', email: 'marie.martin@example.com', entreeService: '02/02/2022', grade: 'Grade B', affectation: 'Service B', localisation: 'Lyon', chefServiceNom:'Chef B', chefServicePrenom: 'Michel', chefServiceEmail: 'michel.chef@example.com', departement: 'Département B', chefDepartementNom: 'Directeur B', chefDepartementPrenom: 'Sophie', chefDepartementEmail: 'sophie.directeur@example.com', pension: 'Non', tel: '9876543210', batiment: 'Tour B', etage: '2', batimentNL: 'Building B' },
    { id: 3, nom: 'Durand', prenom: 'Pierre', role: 'Ingénieur', email: 'pierre.durand@example.com', entreeService: '03/03/2022', grade: 'Grade C', affectation: 'Service C', localisation: 'Marseille', chefServiceNom: 'Chef C', chefServicePrenom: 'Isabelle', chefServiceEmail: 'isabelle.chef@example.com', departement: 'Département C', chefDepartementNom: 'Directeur C', chefDepartementPrenom: 'Julie', chefDepartementEmail: 'julie.directeur@example.com', pension: 'Oui', tel: '1234567890', batiment: 'Tour C', etage: '3', batimentNL: 'Building C' },
    { id: 4, nom: 'Lefebvre', prenom: 'Sophie', role: 'Analyste', email: 'sophie.lefebvre@example.com', entreeService: '04/04/2022', grade: 'Grade D', affectation: 'Service D', localisation: 'Toulouse', chefServiceNom: 'Chef D', chefServicePrenom: 'Patrick', chefServiceEmail: 'patrick.chef@example.com', departement: 'Département D', chefDepartementNom: 'Directeur D', chefDepartementPrenom: 'Maxime', chefDepartementEmail: 'maxime.directeur@example.com', pension: 'Non', tel: '5432167890', batiment: 'Tour D', etage: '4', batimentNL: 'Building D' },
    { id: 5, nom: 'Leroy', prenom: 'Thomas', role: 'Chef de projet', email: 'thomas.leroy@example.com', entreeService: '06/06/2022', grade: 'Grade F', affectation: 'Service F', localisation: 'Lille', chefServiceNom: 'Chef F', chefServicePrenom: 'Catherine', chefServiceEmail: 'catherine.chef@example.com', departement: 'Département F', chefDepartementNom: 'Directeur F', chefDepartementPrenom: 'Sophie', chefDepartementEmail: 'sophie.directeur@example.com', pension: 'Non', tel: '8901234567', batiment: 'Tour F', etage: '6', batimentNL: 'Building F' },
    { id: 6, nom: 'Gauthier', prenom: 'Laura', role: 'Consultant', email: 'laura.gauthier@example.com', entreeService: '07/07/2022', grade: 'Grade G', affectation: 'Service G', localisation: 'Strasbourg', chefServiceNom: 'Chef G', chefServicePrenom: 'François', chefServiceEmail: 'francois.chef@example.com', departement: 'Département G', chefDepartementNom: 'Directeur G', chefDepartementPrenom: 'Thomas', chefDepartementEmail: 'thomas.directeur@example.com', pension: 'Oui', tel: '5678901234', batiment: 'Tour G', etage: '7', batimentNL: 'Building G' },
    { id: 7, nom: 'Robert', prenom: 'Lucas', role: 'Développeur', email: 'lucas.robert@example.com', entreeService: '08/08/2022', grade: 'Grade H', affectation: 'Service H', localisation: 'Nantes', chefServiceNom: 'Chef H', chefServicePrenom: 'Émilie', chefServiceEmail: 'emilie.chef@example.com', departement: 'Département H', chefDepartementNom: 'Directeur H', chefDepartementPrenom: 'Antoine', chefDepartementEmail: 'antoine.directeur@example.com', pension: 'Non', tel: '2345678901', batiment: 'Tour H', etage: '8', batimentNL: 'Building H' },
    { id: 8, nom: 'Garcia', prenom: 'Léa', role: 'Engineer', email: 'lea.garcia@example.com', entreeService: '09/09/2022', grade: 'Grade I', affectation: 'Service I', localisation: 'Nice', chefServiceNom: 'Chef I', chefServicePrenom: 'Vincent', chefServiceEmail: 'vincent.chef@example.com', departement: 'Département I', chefDepartementNom: 'Directeur I', chefDepartementPrenom: 'Sylvie', chefDepartementEmail: 'sylvie.directeur@example.com', pension: 'Oui', tel: '4567890123', batiment: 'Tour I', etage: '9', batimentNL: 'Building I' },
    { id: 9, nom: 'Moreau', prenom: 'Émilie', role: 'Designer', email: 'emilie.moreau@example.com', entreeService: '10/10/2022', grade: 'Grade J', affectation: 'Service J', localisation: 'Rennes', chefServiceNom: 'Chef J', chefServicePrenom: 'Gilles', chefServiceEmail: 'gilles.chef@example.com', departement: 'Département J', chefDepartementNom: 'Directeur J', chefDepartementPrenom: 'Marion', chefDepartementEmail: 'marion.directeur@example.com', pension: 'Non', tel: '6789012345', batiment: 'Tour J', etage: '10', batimentNL: 'Building J' }
  ];

  const columns = React.useMemo(
    () => [
      { field: 'id', headerName: 'N°', width: 90 },
      { field: 'nom', headerName: 'NOM', width: 150 },
      { field: 'prenom', headerName: 'PRÉNOM', width: 150 },
      { field: 'role', headerName: 'RÔLE', width: 150 },
      { field: 'email', headerName: 'E-mail', width: 200 },
      { field: 'entreeService', headerName: 'ENTRÉE SERVICE', width: 200 },
      { field: 'grade', headerName: 'GRADE', width: 150 },
      { field: 'affectation', headerName: 'AFFECTATION', width: 200 },
      { field: 'localisation', headerName: 'LOCALISATION', width: 200 },
      { field: 'chefServiceNom', headerName: 'NOM CHEF DU SERVICE', width: 200 },
      { field: 'chefServicePrenom', headerName: 'PRÉNOM CHEF DU SERVICE', width: 200 },
      { field: 'chefServiceEmail', headerName: 'E-MAIL CHEF DU SERVICE', width: 200 },
      { field: 'departement', headerName: 'DÉPARTEMENT', width: 200 },
      { field: 'chefDepartementNom', headerName: 'NOM CHEF DE DÉPARTEMENT', width: 200 },
      { field: 'chefDepartementPrenom', headerName: 'PRÉNOM CHEF DE DÉPARTEMENT', width: 200 },
      { field: 'chefDepartementEmail', headerName: 'E-MAIL CHEF DE DÉPARTEMENT', width: 200 },
      { field: 'pension', headerName: 'P+C: PENSION', width: 150 },
      { field: 'tel', headerName: 'TEL', width: 150 },
      { field: 'batiment', headerName: 'BÂTIMENT', width: 150 },
      { field: 'etage', headerName: 'ÉTAGE', width: 150 },
      { field: 'batimentNL', headerName: 'BÂTIMENT (NL)', width: 200 },
      {
        field: 'actions',
        headerName: 'Actions',
        width: 120,
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

  return (
    <Box className="data-grid-container" >
      
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        checkboxSelection
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
        }}
        components={{
          headerCell: ({ className, ...rest }) => {
            return <div className={className} style={{ fontWeight: 'bold' }} {...rest} />;
          },
        }}
      />
    </Box>
  );
}
