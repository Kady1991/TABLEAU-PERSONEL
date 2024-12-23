import React, { useState } from "react";
import { Modal } from "antd";
import axios from "axios";
import { BiSolidDetail } from "react-icons/bi";
import { XMLParser } from "fast-xml-parser";
import dayjs from "dayjs";
import '../assets/index.css';

const Detail = ({ IDPersonneService }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [personData, setPersonData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchPersonData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://server-iis.uccle.intra/API_PersonneTest/api/Personne/${IDPersonneService}`,
        {
          headers: { Accept: "application/xml" },
        }
      );

      if (typeof response.data !== "string") {
        throw new Error("La réponse API n'est pas une chaîne XML.");
      }

      const parser = new XMLParser();
      const jsonData = parser.parse(response.data);

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
      <BiSolidDetail
        className="Detail-icon"
        title="Voir Détails"
        onClick={handleOpenModal}
      />
      <Modal
    title={<span style={{ fontSize: "2rem", fontWeight: "bold", color: "#2c648f", textAlign: "center" }}>Détails de Personne</span>}
    open={isModalVisible}
    onCancel={handleCloseModal}
    footer={null}
    centered
    style={{
        backgroundColor: "#f0f2f5", // Couleur d'arrière-plan
        borderRadius: "8px", // Coins arrondis
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // Ombre
        padding: "25px", // Espacement intérieur
        maxWidth: "1000px", // Largeur maximale
        minWidth: "500px", // Largeur minimale
    }}
   
    closeIcon={
        <span  style={{
          color: "#999",
          cursor: "pointer",
          transition: "color 0.3s ease-in-out", // Transition fluide
          fontSize: "30px", // Taille de la croix (vous pouvez ajuster cette valeur)
          fontWeight: "bold", // Rendre la croix plus épaisse
      }}
            onMouseEnter={(e) => e.target.style.color = "#ff4d4f"}
            onMouseLeave={(e) => e.target.style.color = "#999"}>
            ×
        </span>
    }
>
        {loading ? (
          <p>Chargement des données...</p>
        ) : personData ? (
          <div style={{ textAlign: "left"}}>
            <p>
              <strong>Nom: </strong> {personData.NomPersonne}
            </p>
            <p>
              <strong>Prénom: </strong> {personData.PrenomPersonne}
            </p>
            <p>
              <strong>Email: </strong> {personData.Email}
            </p>
            <p>
              <strong>Téléphone: </strong> {personData.TelPro}
            </p>
            <p>
              <strong>Service: </strong>
              {personData.NomServiceFr}
            </p>
            <p>
              <strong>Grade: </strong>
              {personData.NomWWGradeFr}
            </p>
            <p>
              <strong>Date d'entrée: </strong>
              {dayjs(personData.DateEntree).format("DD/MM/YYYY")}
            </p>
            {/* Affiche Date de sortie uniquement si SiArchive n'est pas "true" */}
            {personData.SiArchive !== "true" && (
              <p>
                <strong>Date de sortie: </strong>
                {personData.DateSortie
                  ? dayjs(personData.DateSortie).format("DD/MM/YYYY")
                  : "Non spécifiée"}
              </p>
            )}
            <p>
              <strong>Adresse: </strong>
              {personData.NomRueFr} {personData.Numero}, <strong>Bâtiment: </strong>
              {personData.Batiment}, <strong>Étage: </strong> {personData.Etage}
            </p>
            <p>
              <strong>Chef de service: </strong>
              {personData.NomChefService} {personData.PrenomChefService}
            </p>
            <p>
              <strong>Département: </strong>
              {personData.NomDepartementFr}
            </p>
            <p>
              <strong>Chef de département: </strong>
              {personData.NomChefDepartement} {personData.PrenomChefDepartement}
            </p>
          
          </div>
        ) : (
          <p>Aucune donnée trouvée pour cet utilisateur.</p>
        )}
      </Modal>
    </>
  );
};

export default Detail;
