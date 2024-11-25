import React, { useState } from "react";
import { Modal } from "antd";
import axios from "axios";
import { FiEye } from "react-icons/fi";
import { XMLParser } from "fast-xml-parser";

const Detail = ({ IDPersonne }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [personData, setPersonData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchPersonData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://server-iis.uccle.intra/API_PersonneTest/api/Personne/${IDPersonne}`,
        {
          headers: { Accept: "application/xml" },
        }
      );

      console.log("Réponse brute de l'API :", response.data);

      if (typeof response.data !== "string") {
        throw new Error("La réponse API n'est pas une chaîne XML.");
      }

      const parser = new XMLParser();
      const jsonData = parser.parse(response.data);

      console.log("Données JSON après parsing :", jsonData);

      if (jsonData && jsonData.WhosWhoModelView) {
        setPersonData(jsonData.WhosWhoModelView);
      } else {
        console.warn("Aucune donnée trouvée pour cet IDPersonne.");
        setPersonData(null);
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des données :",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setIsModalVisible(true);
    fetchPersonData();
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setPersonData(null);
  };

  return (
    <>
      <FiEye
        title="Voir Détails"
        style={{
          fontSize: "18px",
          cursor: "pointer",
          color: "#095e74",
          marginBottom: "10px",
        }}
        onClick={handleOpenModal}
      />
      <Modal
        title="Détails de Personne"
        open={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
        centered
      >
        {loading ? (
          <p>Chargement des données...</p>
        ) : personData ? (
          <div style={{ textAlign: "left" }}>
            <p><strong>Nom: </strong> {personData.NomPersonne}</p>
            <p><strong>Prénom: </strong> {personData.PrenomPersonne}</p>
            <p><strong>Email: </strong> {personData.Email}</p>
            <p><strong>Téléphone: </strong> {personData.TelPro}</p>
            <p><strong>Service: </strong>{personData.NomServiceFr}</p>
            <p><strong>Grade: </strong>{personData.NomWWGradeFr}</p>
            <p><strong>Date d'entrée: </strong>{personData.DateEntree}</p>
            <p><strong>Adresse: </strong>{personData.NomRueFr} {personData.Numero} , <strong>Batiment: </strong>{personData.Batiment} , <strong>Etage: </strong> {personData.Etage} </p>
            <p><strong>Chef de service: </strong>{personData.NomChefService} {personData.PrenomChefService}</p>
            <p><strong>Département: </strong>{personData.NomDepartementFr}</p>
            <p><strong>Chef de département: </strong>{personData.NomChefDepartement} {personData.PrenomChefDepartement}</p>
          </div>
        ) : (
          <p>Aucune donnée trouvée pour cet utilisateur.</p>
        )}
      </Modal>
    </>
  );
};

export default Detail;
