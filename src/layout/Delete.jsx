import React, { useState, useEffect } from "react";
import axios from "axios";
import { MdDeleteForever } from "react-icons/md";
import { DatePicker, Modal, Button, message } from "antd";
import dayjs from "dayjs";
import "antd/dist/reset.css";
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
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    checkArchivedStatus();
  }, []);

  const checkArchivedStatus = async () => {
    try {
      const response = await axios.get(
        `https://server-iis.uccle.intra/API_PersonneTest/api/personne?email=${email}`
      );
      console.log("Réponse API :", response.data); // Vérifiez la structure de la réponse
      if (!response.data || response.data.SiArchive === undefined) {
        console.warn("Données manquantes ou incorrectes dans la réponse de l'API.");
        return;
      }
      const { SiArchive } = response.data;
      setIsArchived(SiArchive);
      console.log("État archivé :", SiArchive); // Log pour confirmer la valeur
    } catch (error) {
      console.error("Erreur lors de la récupération des informations de la personne :", error);
    }
  };

  const handleDateChange = (date) => {
    const formattedDate = dayjs(date).format("YYYY-MM-DD");
    setSelectedDate(formattedDate);
    console.log("Date sélectionnée :", formattedDate); // Log pour vérifier la date sélectionnée
  };

  const handleClick = () => {
    console.log("Date actuelle sélectionnée (avant ouverture) :", selectedDate);
    if (isArchived) {
      message.warning(`Cette personne est déjà archivée.`);
      return;
    }
    setIsModalVisible(true);
  };

  const handleConfirm = async () => {
    if (!selectedDate) {
      message.error("Veuillez sélectionner une date de sortie avant d'archiver.");
      return;
    }

    console.log("Date envoyée à l'API :", selectedDate); // Log pour vérifier la date envoyée

    const confirmation = window.confirm(
      `Voulez-vous vraiment archiver ? \n\nID: ${IDPersonne}\nNom: ${nomPersonne}\nPrénom: ${prenomPersonne}\nEmail: ${email}\nDate de sortie : ${selectedDate}`
    );

    if (!confirmation) return;

    try {
      const response = await axios.put(
        `https://server-iis.uccle.intra/API_PersonneTest/api/personne/delete?email=${email}`,
        {
          value: email,
          DateSortie: selectedDate, // Envoi de la date sélectionnée
        }
      );

      console.log("Réponse du backend :", response.data); // Log pour vérifier la réponse du backend

      onSuccess(email);
      message.success(
        `La personne ${prenomPersonne} ${nomPersonne} a été archivée avec succès pour la date de sortie ${selectedDate}.`
      );
      setIsArchived(true);
      setIsModalVisible(false);
    } catch (error) {
      onError(email);
      console.error("Une erreur s'est produite :", error);
      message.error("L'archivage a échoué.");
    }
  };

  const handleCancel = () => {
    console.log("Annulation de la modale. Date sélectionnée réinitialisée."); // Log pour vérifier l'annulation
    setIsModalVisible(false);
    setSelectedDate(null);
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
