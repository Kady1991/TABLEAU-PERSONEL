import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  Radio,
  Row,
  Col,
  DatePicker,
  Select,
} from "antd";
import { RiFileEditFill } from "react-icons/ri";
import axios from "axios";
import dayjs from "dayjs";
import '../assets/index.css';

import { LIEN_API_PERSONNE } from "../config";

const { Option } = Select;

const EditMemberForm = ({ IDPersonneService, refreshData }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [personData, setPersonData] = useState(null);
  const [grades, setGrades] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [otherServices, setOtherServices] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [selectedServiceDetails, setSelectedServiceDetails] = useState(null);
  const [selectedGradeDetails, setSelectedGradeDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [isPersonnelSelected, setIsPersonnelSelected] = useState(false); // Manage personnel selection state
  const [typePersonnelList, setTypePersonnelList] = useState([]);



  useEffect(() => {
    console.log("IDPersonneService", IDPersonneService);

    if (isModalVisible) {
      console.log("useEffect déclenché avec IDPersonne et modal visible :", IDPersonneService);
      fetchData();
    }
  }, [IDPersonneService, isModalVisible]);


  const fetchData = async () => {
    console.log("fetchData appelé");

    if (!isModalVisible) {
      console.log("Modal non visible, fetchData annulé");
      return;
    }



    try {
      console.log("Envoi de la requête pour IDPersonneService :", IDPersonneService);
      const personResponse = await axios.get(
        `${LIEN_API_PERSONNE}/api/Personne/${IDPersonneService}`
      );
      console.log("Données de l'API pour IDPersonneService :", personResponse.data);


      if (!personResponse.data) {
        console.error("Aucune donnée n'a été renvoyée par l'API.");
        return;
      }


      personResponse.data.DateEntreeDate = personResponse?.data?.DateEntreeDate
        ? dayjs(personResponse.data.DateEntreeDate, "YYYY-MM-DD")
        : undefined;
      personResponse.data.WWGradeID = personResponse.data.WWGradeID || null; // Met à null si aucun grade


      setIsPersonnelSelected(personResponse.data.SiTypePersonnel); // Set personnel selection state
      setPersonData(personResponse.data);
      form.setFieldsValue(personResponse.data);

    } catch (error) {

      if (error.response) {

        // 🔥 Affiche le contenu de la réponse de l'API pour voir la cause de l'erreur
        console.error("Détails de l'erreur :", error.response.data);

        alert(`Erreur serveur : ${error.response.status} - ${error.response.data.message || 'Pas de message'}`);
      } else if (error.request) {


        alert("Aucune réponse reçue du serveur.");
      } else {

        alert(`Erreur de la requête : ${error.message}`);
      }

      // Affiche toutes les informations sur l'erreur
      console.error("Détails complets de l'erreur :", error);
    }


    try {
      console.log("Envoi de la requête pour les grades");
      const gradesResponse = await axios.get(
        `${LIEN_API_PERSONNE}/api/wwgrades`
      );

      console.log("Données des grades :", gradesResponse.data);
      setGrades(gradesResponse.data);

    } catch (error) {
      console.error("Erreur lors de la récupération des grades:", error);
    }

    try {
      console.log("Envoi de la requête pour les adresses");
      const addressesResponse = await axios.get(
        `${LIEN_API_PERSONNE}/api/Adresses`
      );

      console.log("Données des adresses :", addressesResponse.data);
      setAddresses(addressesResponse.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des adresses:", error);
    }

    try {

      console.log("Envoi de la requête pour les types de personnel");
      const typePersonnelResponse = await axios.get(
        `${LIEN_API_PERSONNE}/api/typepersonnel`
      );

      console.log("Données des types de personnel :", typePersonnelResponse.data);
      setTypePersonnelList(typePersonnelResponse.data);
    } catch (error) {
      console.error("Erreur lors du chargement des types de personnel:", error);
    }

    try {
      console.log("Envoi de la requête pour les services");
      const servicesResponse = await axios.get(
        `${LIEN_API_PERSONNE}/api/affectation/services`
      );
      console.log("Données des services :", servicesResponse.data);
      setOtherServices(servicesResponse.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des services:", error);
    }
  };


  const handleSubmit = async (values) => {
    setLoading(true);
    const formData = {
      IDPersonneService: personData?.IDPersonneService,
      PersonneID: personData?.PersonneID,
      NomPersonne: values.NomPersonne,
      PrenomPersonne: values.PrenomPersonne,
      Email: values.Email,
      TelPro: values.TelPro === undefined ? null : values.TelPro,
      DateEntree: values.DateEntreeDate ? values.DateEntreeDate.toISOString() : null,
      WWGradeID: values.WWGradeID || null,
      AdresseID: values.AdresseID,
      ServiceID: values.ServiceID,
      SiFrancais: values.SiFrancais,
      SiServicePrincipal: values.SiServicePrincipal,
      SiTypePersonnel: values.SiTypePersonnel,
      TypePersonnelID: values.TypePersonnelID || null,
    };

    try {
      const response = await axios.put(
        `${LIEN_API_PERSONNE}/api/personne/edit?id=${personData?.PersonneID}`,
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status !== 200) {
        throw new Error(`Erreur lors de l'envoi des données: ${response.statusText}`);
      }

      alert("Les modifications ont été enregistrées avec succès !");
        // ✅ Rafraîchir le tableau après la modification
    if (refreshData) {
      refreshData();
    }
      setFormSubmitted(true);
      handleCloseModal();
    } catch (error) {
      console.error("Erreur lors de l'envoi des données", error);
      alert(`Une erreur est survenue: ${error.message}`);
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

  const handlePersonnelSelection = (value) => {
    setIsPersonnelSelected(value); // Update personnel selection state
  };

  const handleGradeSelection = (value) => {
    const selectedGrade = grades.find((grade) => grade.WWGradeID === value);
    setSelectedGradeDetails(selectedGrade); // Met à jour l'état avec les détails du grade sélectionné
  };

  const handleServiceSelection = (value) => {
    const selectedService = otherServices.find((service) => service.IDService === value);
    setSelectedServiceDetails(selectedService); // Met à jour l'état avec les détails du service sélectionné
  };

  return (
    <>
      <RiFileEditFill className="Edit-Icon"
        title="Editer"
        onClick={handleOpenModal}
      />

      <Modal
        title="EDITER"
        open={isModalVisible}
        onCancel={handleCloseModal}
        footer={null} // Supprimer le footer pour ne pas afficher les boutons OK et Cancel
        style={{ textAlign: "center", minHeight: "60vh", minWidth: "70vh", }}
        centered

      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '50vh', // Ajuste la hauteur de la modal pour occuper tout l'écran
          }}>

          <Form
            form={form}
            onFinish={handleSubmit}
            values={personData} // Utilisez values ici
            layout="vertical"
            className="left-align-form" // Ajoutez une classe CSS personnalisée
            style={{
              maxWidth: "100%",
              width: "100%",
              padding: "20px",
              backgroundColor: "#f0f2f5",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            }}
            initialValues={{
              siPersonnel: false,
              siFrancais: true,
            }}
          >
            <Row gutter={[16]}>
              <Col span={12}>
                <Form.Item
                  label="Nom"
                  name="NomPersonne"
                  // value={personData?.NomPersonne}
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Prénom"
                  name="PrenomPersonne"
                  // value={personData?.PrenomPersonne}
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  label="Téléphone"
                  name="TelPro"
                // value={personData?.TelPro}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="E-mail"
                  name="Email"
                  // value={personData?.Email}
                  rules={[
                    {
                      required: true,
                      type: "email",
                      message: "Veuillez saisir un e-mail valide",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  style={{ width: "100%" }}
                  name="DateEntreeDate"
                  label="Date"
                  rules={[
                    { required: false, message: "Veuillez choisir une date" },
                  ]}
                >
                  <DatePicker
                    style={{ width: "99%" }}
                  // defaultValue={personData ? dayjs(personData.DateEntreeDate) : null}
                  />
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  style={{ width: "100%" }}
                  name="WWGradeID"
                  label="Grade"
                  rules={[
                    { required: false, message: "Veuillez choisir le grade" },
                  ]}
                >
                  <Select
                    style={{ width: "100%" }}
                    allowClear
                    showSearch
                    optionFilterProp="children"
                    onChange={handleGradeSelection}
                    value={
                      selectedGradeDetails
                        ? selectedGradeDetails.WWGradeID
                        : null
                    } // Utilisez null lorsque aucun grade n'est sélectionné
                  >
                    <Option key="placeholder" value="" disabled>
                      Sélectionner un grade
                    </Option>
                    {grades.map((grade) => (
                      <Option key={grade.IDWWGrade} value={grade.IDWWGrade}>
                        {grade.NomWWGradeFr}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  style={{ width: "100%" }}
                  label="Adresse"
                  name="AdresseID"
                  // value={personData?.AdresseID}
                  rules={[
                    {
                      required: true,
                      message: "Veuillez sélectionner une adresse",
                    },
                  ]}
                >
                  <Select
                    showSearch
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {addresses.map((address) => (
                      <Option key={address.IDAdresse} value={address.IDAdresse}>
                        {address.AdresseComplete}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={12}>
                <Form.Item
                  style={{ width: "100%" }}
                  name="ServiceID"
                  label="Service"
                  // value={personData?.ServiceID}
                  rules={[
                    { required: true, message: "Veuillez choisir le service" },
                  ]}
                >
                  <Select
                    allowClear
                    showSearch
                    optionFilterProp="children"
                    onChange={handleServiceSelection}
                  >
                    {otherServices.map((service) => (
                      <Option key={service.IDService} value={service.IDService}>
                        {service.NomServiceFr}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={12}>

                <Form.Item label="Personnel" name="SiTypePersonnel">
                  <Radio.Group onChange={(e) => handlePersonnelSelection(e.target.value)}>
                    <Radio value={true}>Oui</Radio>
                    <Radio value={false}>Non</Radio>
                  </Radio.Group>
                </Form.Item>
                {isPersonnelSelected && (
                  <Form.Item name="TypePersonnelID" label="Type de personnel" rules={[{ required: true }]}>
                    <Select
                      style={{ width: "100%" }}
                      allowClear
                      showSearch
                      disabled={false} // Rend la liste déroulante non modifiable
                    >
                      {typePersonnelList.map((typePersonnel) => (
                        <Option key={typePersonnel.IDTypePersonnel} value={typePersonnel.IDTypePersonnel}>
                          {typePersonnel.NomTypePersonnelFr}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                )}
              </Col>

              <Col span={12}>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Form.Item
                    name="SiFrancais"
                    label="Français"
                    rules={[
                      { required: true, message: "Veuillez choisir la langue" },
                    ]}
                  >
                    <Radio.Group>
                      <Radio value={true}>FR</Radio>
                      <Radio value={false}>Nl</Radio>
                    </Radio.Group>
                  </Form.Item>
                </div>
              </Col>
            </Row>
            {selectedServiceDetails && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "auto auto",
                  gap: 1,
                }}
              >
                <div style={{ textAlign: "left" }}>
                  <p>
                    <span style={{ fontWeight: "bold" }}>Chef du Service:</span>{" "}
                    {selectedServiceDetails.NomChefService}
                    {"  "}
                    {selectedServiceDetails.PrenomChefService}
                  </p>
                  <p>
                    <span style={{ fontWeight: "bold", fontSize: "0.9rem" }}>
                      Chef du Département:
                    </span>
                    {"  "}
                    {selectedServiceDetails.NomChefDepartement}{" "}
                    {selectedServiceDetails.PrenomChefDepartement}
                  </p>
                </div>
              </div>
            )}
            <Form.Item>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: 30,
                }}
              >
                <Button style={{ margin: 10 }} type="primary" htmlType="submit">
                  Valider
                </Button>
                <Button onClick={handleCloseModal}>Annuler</Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};
// return null;
// };
export default EditMemberForm;
