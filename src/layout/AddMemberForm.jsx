import React, { useState, useEffect } from "react";
import { Form, Input, DatePicker, Select, Button, Row, Col, Radio } from "antd";
import axios from "axios";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import "../index.css";


const { Option } = Select;

const AddMemberForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [grades, setGrades] = useState([]);
  const [services, setServices] = useState([]);
  const [addressData, setAddressData] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [selectedServiceDetails, setSelectedServiceDetails] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPersonnelSelected, setIsPersonnelSelected] = useState(false);
  const [typePersonnelList, setTypePersonnelList] = useState([]);

  useEffect(() => {
    setLoadingData(true);
    const fetchData = async () => {
      try {
        const gradesResponse = await axios.get(
          "https://server-iis.uccle.intra/API_PersonneTest/api/wwgrades"
        );
        setGrades(gradesResponse.data);

        const servicesResponse = await axios.get(
          "https://server-iis.uccle.intra/API_PersonneTest/api/affectation/services"
        );
        setServices(servicesResponse.data);

        const addressResponse = await axios.get(
          "https://server-iis.uccle.intra/API_PersonneTest/api/Adresses"
        );
        setAddressData(addressResponse.data);

        const typePersonnelResponse = await axios.get(
          "https://server-iis.uccle.intra/API_PersonneTest/api/typepersonnel"
        );
        setTypePersonnelList(typePersonnelResponse.data);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const dateEntreeFormatted = values.DateEntreeDate
        ? values.DateEntreeDate.format("YYYY-MM-DD")
        : null;

      const formData = {
        NomPersonne: values.nom,
        PrenomPersonne: values.prenom,
        Email: values.email,
        TelPro: values.telephone || null,
        DateEntree: dateEntreeFormatted,
        WWGradeID: values.grade,
        AdresseID: values.adresse,
        ServiceID: values.service,
        SiFrancais: values.siFrancais,
        SiServicePrincipal: values.SiServicePrincipal,
        SiTypePersonnel: values.SiTypePersonnel,
        TypePersonnelID: values.TypePersonnelID,
      };

      const response = await axios.post(
        "https://server-iis.uccle.intra/API_PersonneTest/api/Personne",
        formData
      );

      if (response.data === "Success") {
        alert("Ajout réussi !");
        closeForm();
      } else if (response.data === "Personne Exists") {
        alert("Ce email est déjà attribué");
        setIsFormOpen(true);
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi des données", error);
      alert("Erreur lors de l'envoi des données. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const handleServiceSelection = async (IDService) => {
    try {
      const response = await axios.get(
        `https://server-iis.uccle.intra/API_PersonneTest/api/affectation/${IDService}`
      );
      setSelectedServiceDetails(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des détails du service:", error);
    }
  };

  const openForm = () => {
    setIsFormOpen(true);
    form.resetFields();
  };

  const closeForm = () => {
    setIsFormOpen(false);
  };

  const handlePersonnelSelection = (value) => {
    setIsPersonnelSelected(value);
  };

  // Fonction pour générer l'e-mail à partir du prénom et du nom
  const generateEmail = (prenom, nom) => {
    const firstLetterPrenom =
      prenom != undefined ? prenom.charAt(0).toLowerCase() : "";
    const nomLowerCase = nom.toLowerCase();
    return `${firstLetterPrenom}${nomLowerCase}@uccle.brussels`;
  };

  // Fonction de modification de la valeur de l'e-mail en fonction du prénom et du nom
  const handleNameChange = (e) => {
    const prenom = form.getFieldValue("prenom");
    const nom = form.getFieldValue("nom"); // Récupérer la valeur du champ nom
    const email = generateEmail(prenom, nom);
    form.setFieldsValue({ email });
  };



  return (
    <div>
      <Button
        style={{
          backgroundColor: "#095c83",
          height: "2.4rem",
          fontStyle: "bold",
        }}
        type="primary"
        onClick={openForm}
        icon={<PlusOutlined />}
      >
        CREER MEMBRE
      </Button>

      {isFormOpen && (
        <div
          className={`modal ${isFormOpen ? "fade-in" : ""}`} // Ajouter la classe fade-in quand le formulaire est ouvert
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: "9999",
            backgroundColor: "#fff",
            padding: "20px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            borderRadius: "8px",
            minHeight: "50vh",
            minWidth: "70vh",
          }}
        >
          <div style={{ textAlign: "right", marginBottom: "20px" }}>
            <CloseOutlined onClick={closeForm} style={{ cursor: "pointer" }} />
          </div>

          <div
            style={{
              marginBottom: "50px",
              textAlign: "center",
              fontSize: "1.2rem",
              fontWeight: "bold",
            }}
          >
            Ajouter un nouveau membre
          </div>

          

          {loadingData ? (
            <p>Chargement des données...</p>
          ) : (
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              style={{
                minHeight: "70vh",
                minWidth: "70vh",
                padding: "30px",
                backgroundColor: "#f0f2f5",
                borderRadius: "8px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              }}
              initialValues={{
                SiTypePersonnel: false,
                siFrancais: true,
              }}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="nom"
                    label="Nom"
                    rules={[{ required: true, message: "Veuillez entrer le nom" }]}
                  >
                    <Input autoComplete="off" onChange={handleNameChange} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="prenom"
                    label="Prénom"
                    rules={[{ required: true, message: "Veuillez entrer le prénom" }]}
                  >
                    <Input autoComplete="off" onChange={handleNameChange} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="telephone"
                    label="Téléphone"
                    rules={[{ required: false, message: "Veuillez entrer le numéro de téléphone" }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[{ required: true, message: "Veuillez entrer l'adresse email" }]}
                  >
                    <Input />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="DateEntreeDate"
                    label="Date d'entrée"
                    rules={[{ required: true, message: "Veuillez choisir la date d'entrée" }]}
                  >
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="grade"
                    label="Grade"
                    rules={[{ required: false, message: "Veuillez choisir le grade" }]}
                  >
                    <Select
                      style={{ width: "100%" }}
                      allowClear
                      showSearch
                      optionFilterProp="children"
                    >
                      {grades.map((grade) => (
                        <Option key={grade.IDWWGrade} value={grade.IDWWGrade}>
                          {grade.NomWWGradeFr}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="adresse"
                    label="Adresse"
                    rules={[{ required: true, message: "Veuillez choisir l'adresse" }]}
                  >
                    <Select
                      style={{ width: "100%" }}
                      allowClear
                      showSearch
                      optionFilterProp="children"
                    >
                      {addressData.map((adresse) => (
                        <Option key={adresse.IDAdresse} value={adresse.IDAdresse}>
                          {adresse.AdresseComplete}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="service"
                    label="Service"
                    rules={[{ required: true, message: "Veuillez choisir le service" }]}
                  >
                    <Select
                      style={{ width: "100%" }}
                      allowClear
                      showSearch
                      optionFilterProp="children"
                      onChange={handleServiceSelection}
                    >
                      {services.map((service) => (
                        <Option key={service.IDService} value={service.IDService}>
                          {service.NomServiceFr}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="SiTypePersonnel"
                    label="Personnel"
                    rules={[{ required: true, message: "Veuillez choisir si le membre est personnel" }]}
                  >
                    <Radio.Group onChange={(e) => handlePersonnelSelection(e.target.value)}>
                      <Radio value={true}>Oui</Radio>
                      <Radio value={false}>Non</Radio>
                    </Radio.Group>
                  </Form.Item>
                  {isPersonnelSelected && (
                    <Form.Item
                      name="TypePersonnelID"
                      label="Type de personnel"
                      rules={[{ required: true, message: "Veuillez choisir le type de personnel" }]}
                    >
                      <Select
                        style={{ width: "100%" }}
                        allowClear
                        showSearch
                        optionFilterProp="children"
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
                  <Form.Item
                    name="siFrancais"
                    label="Langue"
                    rules={[{ required: true, message: "Veuillez choisir la langue" }]}
                  >
                    <Radio.Group>
                      <Radio value={true}>FR</Radio>
                      <Radio value={false}>NL</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item style={{ display: "flex", justifyContent: "space-evenly" }}>
                <Button type="primary" htmlType="submit" loading={loading} style={{ zIndex: "9999" }}>
                  Valider
                </Button>
                <Button onClick={closeForm} style={{ zIndex: "9999", margin: 8 }}>
                  Annuler
                </Button>
              </Form.Item>

              {selectedServiceDetails && (
                <div style={{ display: "grid", gridTemplateColumns: "auto auto", gap: 1 }}>
                  <div style={{ textAlign: "left" }}>
                    <p>
                      <strong>Chef du Service:</strong> {selectedServiceDetails.NomChefService}{" "}
                      {selectedServiceDetails.PrenomChefService}
                    </p>
                    <p>
                      <strong>Chef du Département:</strong> {selectedServiceDetails.NomChefDepartement}{" "}
                      {selectedServiceDetails.PrenomChefDepartement}
                    </p>
                  </div>
                </div>
              )}
            </Form>
          )}
        </div>
      )}
    </div>
  );
};

export default AddMemberForm;
