import { DataGrid } from "@mui/x-data-grid";
import React, { useState, useEffect } from "react";
import { Modal, Spin, Button, message, Input } from "antd";
import { FaFileArchive } from "react-icons/fa";
import axios from "axios";
import "../index.css";

const ArchiveList = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [archives, setArchives] = useState([]);
  const [filteredArchives, setFilteredArchives] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fonction pour récupérer les archives de l'API
  const fetchArchives = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://server-iis.uccle.intra/API_PersonneTest/api/Personne`
      );

      const archivedPersons = response.data.filter((person) => person.SiArchive === true);

      const formattedArchives = archivedPersons.map((person) => ({
        ...person,
        id: person.IDPersonneService // Ajout de la propriété id unique pour MUI DataGrid
      }));

      setArchives(formattedArchives);
      setFilteredArchives(formattedArchives);
    } catch (error) {
      console.error("Erreur lors de la récupération :", error);
      message.error("Impossible de charger les données.");
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour afficher la modal
  const showModal = () => {
    setIsModalVisible(true);
    fetchArchives();
  };

  // Fonction pour fermer la modal
  const handleCancel = () => {
    setIsModalVisible(false);
    setArchives([]);
    setFilteredArchives([]);
    setSearchTerm("");
  };

  // Fonction pour gérer la recherche en temps réel
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = archives.filter(
      (person) =>
        person.PrenomPersonne?.toLowerCase().includes(term) ||
        person.NomPersonne?.toLowerCase().includes(term)
    );

    setFilteredArchives(filtered);
  };

  // Définition des colonnes pour le DataGrid
  const columns = [
    { field: "IDPersonneService", headerName: "ID", width: 50, hideable: true },
    { field: "PrenomPersonne", headerName: "Prénom", width: 150 },
    { field: "NomPersonne", headerName: "Nom", width: 150 },
    { field: "Email", headerName: "Email", width: 200 },
    { field: "NomWWGradeNl", headerName: "GRADE(nl)", width: 200 },
    { field: "NomServiceFr", headerName: "Service", width: 200 },
    { field: "DateEntree", headerName: "Date d'entrée", width: 150 },
    { field: "DateSortie", headerName: "Date de sortie", width: 150 },
  ];

  return (
    <div>
      {/* Bouton pour ouvrir la modal */}
      <Button
        className="archive-button"
        icon={<FaFileArchive />}
        onClick={showModal}
      >
        Archive
      </Button>

      {/* Modal affichant la table */}
      <Modal
        title={
          <span style={{ fontSize: "2rem", fontWeight: "bold", color: "#2c648f" }}>
            Liste des Personnes Archivées
          </span>
        }
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button
            key="close"
            onClick={handleCancel}
            style={{
              backgroundColor: "#ff4d4f",
              borderColor: "#ff4d4f",
              color: "#fff",
              fontWeight: "bold",
              borderRadius: "8px",
            }}
          >
            Fermer
          </Button>,
        ]}
        className="archive-modal"
        width={1000} // Largeur ajustée de la modal
        


      >
        {loading ? (
          <div className="spinner">
          
          </div>
        ) : (
          <>
            {/* Barre de recherche */}
            <div className="fixed-search-bar" style={{ marginBottom: "1rem" }}>
              <Input
                placeholder="Rechercher par Nom ou Prénom"
                value={searchTerm}
                onChange={handleSearch}
                className="search-input"
              />
            </div>

            {/* Tableau DataGrid */}
            <div
              className="data-grid-container"
              style={{ height: 400, width: "100%", overflow: "auto" }}
            >
              <DataGrid
                rows={filteredArchives}
                columns={columns}
                height={80}
                pageSize={10}
                rowsPerPageOptions={[10, 20, 50]}
                disableSelectionOnClick
                getRowId={(row) => row.IDPersonneService}
              />

            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default ArchiveList;
