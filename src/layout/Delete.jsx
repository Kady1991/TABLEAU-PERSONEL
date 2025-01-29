import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdDeleteForever } from "react-icons/md";
import { DatePicker, Modal, Button, message } from "antd";
import dayjs from "dayjs";
import "antd/dist/reset.css";
import "../assets/index.css";

import { LIEN_API_PERSONNE } from "../config";

const Delete = ({ IDPersonneService, nomPersonne, prenomPersonne, email, refreshData }) => {
  const [isArchived, setIsArchived] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Vérifier si la personne est déjà archivée
  useEffect(() => {
    checkArchivedStatus();
  }, []);

  const checkArchivedStatus = async () => {
    try {
      const response = await axios.get(`${LIEN_API_PERSONNE}/api/personne?email=${email}`);
      if (response.data && response.data.SiArchive !== undefined) {
        setIsArchived(response.data.SiArchive);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des informations de la personne :", error);
    }
  };

  const handleDateChange = (date) => {
    const formattedDate = dayjs(date).format("YYYY-MM-DD");
    setSelectedDate(formattedDate);
  };

  const handleClick = () => {
    if (isArchived) {
      message.warning("Cette personne est déjà archivée.");
      return;
    }
    setIsModalVisible(true);
  };

  const handleConfirm = async () => {
    if (!selectedDate) {
      message.error("Veuillez sélectionner une date de sortie avant d'archiver.");
      return;
    }

    const confirmation = window.confirm(
      `Voulez-vous vraiment archiver ? \n\nID: ${IDPersonneService}\nNom: ${nomPersonne}\nPrénom: ${prenomPersonne}\nEmail: ${email}\nDate de sortie : ${selectedDate}`
    );

    if (!confirmation) return;

    try {
      const response = await axios.put(
        `${LIEN_API_PERSONNE}/api/personne/delete?email=${email}&dateSortie=${selectedDate}`
      );

      if (response.status === 200) {
        message.success(`La personne ${prenomPersonne} ${nomPersonne} a été archivée avec succès.`);
        setIsArchived(true);
        setIsModalVisible(false);

        // ✅ Rafraîchir automatiquement le tableau après suppression
        if (refreshData) {
          refreshData();
        }
      } else {
        throw new Error("Échec de l'archivage");
      }
    } catch (error) {
      console.error("Une erreur s'est produite :", error);
      message.error("L'archivage a échoué.");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setSelectedDate(null);
  };

  return (
    <div>
      <MdDeleteForever className="delete-Icon" title="Archiver" onClick={handleClick} />
      
      <Modal
        title="Sélectionnez une date de sortie avant d'archiver"
        open={isModalVisible}
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
        <DatePicker onChange={handleDateChange} format="YYYY-MM-DD" style={{ width: "100%" }} />
      </Modal>
    </div>
  );
};

export default Delete;
