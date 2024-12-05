import { DataGrid } from "@mui/x-data-grid";
import React, { useState } from "react";
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

  const fetchArchives = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://server-iis.uccle.intra/API_PersonneTest/api/Personne"
      );

      const archivedPersons = response.data.filter((person) => person.SiArchive === true);

      setArchives(archivedPersons);
      setFilteredArchives(archivedPersons);
    } catch (error) {
      console.error("Erreur lors de la récupération :", error);
      message.error("Impossible de charger les données.");
    } finally {
      setLoading(false);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
    fetchArchives();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setArchives([]);
    setFilteredArchives([]);
    setSearchTerm("");
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = archives.filter(
      (person) =>
        person.PrenomPersonne.toLowerCase().includes(term) ||
        person.NomPersonne.toLowerCase().includes(term)
    );

    setFilteredArchives(filtered);
  };

  const columns = [
    { field: "PrenomPersonne", headerName: "Prénom", width: 150 },
    { field: "NomPersonne", headerName: "Nom", width: 150 },
    { field: "Email", headerName: "Email", width: 200 },
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
        width={800}
      >
        {loading ? (
          <Spin tip="Chargement..." className="spinner" />
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
            <div style={{ height: 400, width: "100%" }}>
              <DataGrid
                rows={filteredArchives}
                columns={columns}
                getRowId={(row) => row.IDPersonne}
                pageSize={10}
                rowsPerPageOptions={[10, 20, 50]}
                disableSelectionOnClick
              />
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default ArchiveList;
