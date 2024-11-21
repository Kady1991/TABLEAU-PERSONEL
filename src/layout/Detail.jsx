import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import axios from "axios";
import { FiEye } from "react-icons/fi";
import dayjs from "dayjs";

const Detail = ({ IDPersonne }) => {
   console.log("IDPersonne reçu :", IDPersonne); // Ajoutez ceci pour vérifier l'ID
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [personData, setPersonData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isModalVisible && IDPersonne) {
      fetchPersonData();
    }
  }, [isModalVisible, IDPersonne]);

  const fetchPersonData = async () => {
    if (!IDPersonne) {
      console.error("IDPersonne est undefined");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `https://server-iis.uccle.intra/API_PersonneTest/api/Personne/${IDPersonne}`
      );

      console.log("Données de la personne reçues :", response.data);

      if (response.data) {
        setPersonData(response.data);
      } else {
        console.error("Aucune donnée trouvée pour cet IDPersonne.");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
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
            {personData.NomPersonne && (
              <p><strong>Nom:</strong> {personData.NomPersonne}</p>
            )}
            {personData.PrenomPersonne && (
              <p><strong>Prénom:</strong> {personData.PrenomPersonne}</p>
            )}
            {personData.Email && (
              <p><strong>Email:</strong> {personData.Email}</p>
            )}
            {personData.TelPro && (
              <p><strong>Téléphone:</strong> {personData.TelPro}</p>
            )}
            {personData.DateEntreeDate && (
              <p>
                <strong>Date d'Entrée:</strong> {dayjs(personData.DateEntreeDate).format("DD/MM/YYYY")}
              </p>
            )}
            {personData.WWGradeID && (
              <p><strong>Grade:</strong> {personData.WWGradeID}</p>
            )}
            {personData.AdresseID && (
              <p><strong>Adresse:</strong> {personData.AdresseID}</p>
            )}
            {personData.ServiceID && (
              <p><strong>Service:</strong> {personData.ServiceID}</p>
            )}
            <p><strong>Langue:</strong> {personData.SiFrancais ? "Français" : "Néerlandais"}</p>
            {personData.SiTypePersonnel && personData.TypePersonnelID && (
              <p><strong>Type de Personnel:</strong> {personData.TypePersonnelID}</p>
            )}
          </div>
        ) : (
          <p>Aucune donnée trouvée pour cet utilisateur.</p>
        )}
      </Modal>
    </>
  );
};

export default Detail;
