import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdDeleteForever } from "react-icons/md";
import { DatePicker, Modal, Button, message } from "antd";
import "antd/dist/reset.css"; // Utilisez ce style si vous utilisez Ant Design v5+
import "../index.css";

const Delete = ({
  IDPersonne,
  nomPersonne,
  prenomPersonne,
  email,
  onSuccess,
  onError,
}) => {
  const [isArchived, setIsArchived] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null); // Stocker la date sélectionnée
  const [isModalVisible, setIsModalVisible] = useState(false); // Gérer l'affichage de la modale

  useEffect(() => {
    checkArchivedStatus();
  }, []);

  const checkArchivedStatus = async () => {
    try {
      const response = await axios.get(
        `https://server-iis.uccle.intra/API_PersonneTest/api/personne?email=${email}`
      );
      const { SiArchive } = response.data;
      setIsArchived(SiArchive);
    } catch (error) {
      console.error("Erreur lors de la récupération des informations de la personne :", error);
    }
  };

  const handleDateChange = (date, dateString) => {
    setSelectedDate(dateString); // Mettre à jour la date sélectionnée
  };

  const handleClick = () => {
    if (isArchived) {
      message.warning("Cette personne est déjà archivée.");
      return;
    }
    setIsModalVisible(true); // Afficher la modale
  };

  const handleConfirm = async () => {
    if (!selectedDate) {
      message.error("Veuillez sélectionner une date de sortie avant d'archiver.");
      return;
    }

    const confirmation = window.confirm(
      `Voulez-vous vraiment archiver ?\n\nID: ${IDPersonne}\nNom: ${nomPersonne}\nPrénom: ${prenomPersonne}\nEmail: ${email} le ${selectedDate} :`
    );

    if (!confirmation) return;

    try {
      await axios.put(
        `https://server-iis.uccle.intra/API_PersonneTest/api/personne/delete?email=${email}`,
        {
          value: email,
          dateSortie: selectedDate, // Inclure la date sélectionnée
        }
      );

      onSuccess(email);
      message.success(
        `La personne ${prenomPersonne} ${nomPersonne} a été archivée avec succès pour la date de sortie ${selectedDate}.`
      );
      setIsArchived(true);
      setIsModalVisible(false); // Fermer la modale
    } catch (error) {
      onError(email);
      console.error("Une erreur s'est produite :", error);
      message.error("L'archivage a échoué.");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false); // Fermer la modale
    setSelectedDate(null); // Réinitialiser la date sélectionnée
  };

  return (
    <div>
      <MdDeleteForever
        title="Archiver"
        onClick={handleClick}
        style={{ cursor: "pointer", color: "red", fontSize: "22px", marginTop: "10px" }}
      />
      <Modal
        title="Choisir une date de sortie"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Annuler
          </Button>,
          <Button key="confirm" type="primary" onClick={handleConfirm}>
            Archiver
          </Button>,
        ]}
      >
        <p>Sélectionnez une date de sortie avant d'archiver cette personne :</p>
        <DatePicker
          onChange={handleDateChange}
          format="YYYY-MM-DD"
          style={{ width: "100%" }}
        />
      </Modal>
    </div>
  );
};

export default Delete;
