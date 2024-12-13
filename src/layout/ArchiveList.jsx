import React, { useMemo, useEffect, useState } from 'react';
import { useTable } from 'react-table';
import axios from 'axios';
import { Drawer, Button, message, Spin, Input } from 'antd';
import "../index.css";

const ArchiveList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false); // État d'ouverture/fermeture du tiroir
  const [searchTerm, setSearchTerm] = useState(""); // État pour le terme de recherche

  // Fonction pour récupérer les archives de l'API
  const fetchArchives = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://server-iis.uccle.intra/API_PersonneTest/api/Personne`);
      const archivedPersons = response.data.filter((person) => person.SiArchive === true);

      const formattedArchives = archivedPersons.map((person) => ({
        ID: person.IDPersonneService,
        Prenom: person.PrenomPersonne || '',
        Nom: person.NomPersonne || '',
        Email: person.Email,
        DateEntree: person.DateEntree || '', // Date d'entrée vide si la date n'existe pas
        DateSortie: person.DateSortie || '',
      }));

      setData(formattedArchives);
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
      message.error("Impossible de charger les données.");
    } finally {
      setLoading(false);
    }
  };

  const showDrawer = () => {
    setIsDrawerVisible(true);
    fetchArchives();
  };

  const closeDrawer = () => {
    setIsDrawerVisible(false);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter(person => 
      (person.Prenom && person.Prenom.toLowerCase().includes(searchTerm.toLowerCase())) || 
      (person.Nom && person.Nom.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [data, searchTerm]);

  const columns = useMemo(() => [
    { Header: 'ID', accessor: 'ID' },
    { Header: 'Prénom', accessor: 'Prenom' },
    { Header: 'Nom', accessor: 'Nom' },
    { Header: 'Email', accessor: 'Email' },
    { 
      Header: 'Date d\'entrée', 
      accessor: 'DateEntree',
      Cell: ({ value }) => value ? new Date(value).toLocaleDateString() : '' // Affichage vide si la date n'existe pas
    },
    { 
      Header: 'Date de sortie', 
      accessor: 'DateSortie',
      Cell: ({ value }) => value ? new Date(value).toLocaleDateString() : '',
    },
  ], []);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({ columns, data: filteredData });

  return (
    <div className="archive-list-container">
      <Button 
        type="primary" 
        onClick={showDrawer} 
        className="archive-list-button"
      >
        Ouvrir les archives
      </Button>

      <Drawer 
        title="Liste des Personnes Archivées" 
        placement="right" 
        onClose={closeDrawer} 
        open={isDrawerVisible}
        width={1300} 
      >
        <Input 
          placeholder="Rechercher par prénom ou nom" 
          value={searchTerm} 
          onChange={handleSearch} 
          className="archive-list-search-input" 
        />
        {loading ? (
          <div className="archive-list-spinner">
            <Spin size="medium" />
          </div>
        ) : (
          <table {...getTableProps()} className="archive-list-table">
            <thead>
              {headerGroups.map(headerGroup => (
                <tr {...headerGroup.getHeaderGroupProps()} className="archive-list-header-row">
                  {headerGroup.headers.map(column => (
                    <th 
                      {...column.getHeaderProps()} 
                      className="archive-list-header-cell"
                    >
                      {column.render('Header')}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()} className="archive-list-body">
              {rows.map(row => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()} className="archive-list-row">
                    {row.cells.map(cell => (
                      <td {...cell.getCellProps()} className="archive-list-cell">
                        {cell.render('Cell')}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Drawer>
    </div>
  );
};

export default ArchiveList;
