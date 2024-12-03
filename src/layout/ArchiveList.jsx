import React, { useState } from "react";
import { Modal, Card, Spin, Button, Row, Col, message, Input } from "antd";
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

      {/* Modal affichant les cartes */}
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
      >
        {loading ? (
          <Spin tip="Chargement..." className="spinner" />
        ) : (
          <>
            {/* Barre de recherche fixe */}
            <div className="fixed-search-bar">
              <Input
                placeholder="Rechercher par Nom ou Prénom"
                value={searchTerm}
                onChange={handleSearch}
                className="search-input"
              />
            </div>

            {/* Liste des cartes avec défilement */}
            <div className="archive-modal-body">
              <Row gutter={[16, 16]}>
                {filteredArchives.length > 0 ? (
                  filteredArchives.map((person) => (
                    <Col xs={24} sm={12} md={8} key={person.IDPersonne}>
                      <Card
                        title={
                          <span className="archive-card-title">
                            {person.PrenomPersonne} {person.NomPersonne}
                          </span>
                        }
                        bordered={false}
                        className="archive-card"
                      >
                        <p>
                          <strong>Email :</strong> {person.Email}
                        </p>
                        <p>
                          <strong>Service :</strong> {person.NomServiceFr || "Non défini"}
                        </p>
                        <p>
                          <strong>Date d'entrée :</strong> {person.DateEntree || "Non spécifiée"}
                        </p>
                        <p>
                          <strong>Date de sortie :</strong> {person.DateSortie || "Non spécifiée"}
                        </p>
                      </Card>
                    </Col>
                  ))
                ) : (
                  <p className="no-results">Aucune personne ne correspond à votre recherche.</p>
                )}
              </Row>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default ArchiveList;
