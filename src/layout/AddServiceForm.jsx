import React, { useState, useEffect } from "react";
import { Form, Input, DatePicker, Select, Button, Row, Col, Radio } from "antd";
import axios from "axios";

const { Option } = Select;

const AddServiceForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [grades, setGrades] = useState([]);
  const [services, setServices] = useState([]);
  const [addressData, setAddressData] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [selectedServiceDetails, setSelectedServiceDetails] = useState(null);

  useEffect(() => {
    setLoadingData(true);
    const fetchData = async () => {
      try {
        const gradesResponse = await axios.get(
          "https://server-iis.uccle.intra/API_Personne/api/wwgrades"
        );
        setGrades(gradesResponse.data);

        const servicesResponse = await axios.get(
          "https://server-iis.uccle.intra/API_Personne/api/affectation/services"
        );
        setServices(servicesResponse.data);

        const addressResponse = await axios.get(
          "https://server-iis.uccle.intra/API_Personne/api/Adresses"
        );
        setAddressData(addressResponse.data);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

  const handleServiceSelection = async (IDService) => {
    try {
      const response = await axios.get(
        `https://server-iis.uccle.intra/API_Personne/api/affectation/${IDService}`
      );
      const serviceDetails = response.data;
      setSelectedServiceDetails(serviceDetails);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des détails du service:",
        error
      );
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const option = {
        day: "numeric",
        month: "2-digit",
        year: "numeric",
      };
      const dateEntree = new Intl.DateTimeFormat("fr-FR", option).format(
        values.dateEntree
      );

      const formData = {
        NomPersonne: values.nom,
        PrenomPersonne: values.prenom,
        Email: values.email,
        TelPro: values.telephone == undefined ? null : values.telephone,
        DateEntree: dateEntree,
        WWGradeID: values.grade,
        AdresseID: values.adresse,
        ServiceID: values.service,
        SiFrancais: values.siFrancais,
        SiServicePrincipal: true,
        SiTypePersonnel: values.siPersonnel,
      };
      console.log(formData);
      const response = await axios.post(
        "https://server-iis.uccle.intra/API_Personne/api/Personne",
        formData
      );

      if (!response.data) {
        throw new Error("Erreur lors de l'envoi des données");
      }
      // Afficher une alerte lorsque l'ajout est réussi
      alert("Ajout réussi !");

      console.log("Nouveau membre ajouté avec succès");
      // Fermer le formulaire après l'ajout réussi
      setFormSubmitted(true);
    } catch (error) {
      
    } finally {
      setLoading(false);
      setLoadingData(false);
    }
  };

  if (formSubmitted) {
    // Si le formulaire a été soumis avec succès, ne rend pas le formulaire
    return null;
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "600px",
        zIndex: "1",
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      {loadingData ? (
        <p>Chargement des données...</p>
      ) : (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{
            maxWidth: "600px",
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
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="siPersonnel"
                label="Personnel"
                rules={[
                  {
                    required: true,
                    message: "Veuillez choisir si le membre est personnel",
                  },
                ]}
              >
                <Radio.Group>
                  <Radio value={true}>Oui</Radio>
                  <Radio value={false}>Non</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="siFrancais"
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
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="nom"
                label="Nom"
                rules={[{ required: true, message: "Veuillez entrer le nom" }]}
              >
                <Input
                  id="nom"
                  style={{ textTransform: "uppercase" }}
                  autoComplete="off"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="prenom"
                label="Prénom"
                rules={[
                  { required: true, message: "Veuillez entrer le prénom" },
                ]}
              >
                <Input
                  id="prenom"
                  style={{ textTransform: "capitalize" }}
                  autoComplete="off"
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length > 0) {
                      e.target.value =
                        value.charAt(0).toUpperCase() + value.slice(1);
                    }
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="telephone"
                label="Téléphone"
                rules={[
                  {
                    required: false,
                    message: "Veuillez entrer le numéro de téléphone",
                  },
                ]}
              >
                <Input di="telephone" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  {
                    required: true,
                    message: "Veuillez entrer l'adresse email",
                  },
                ]}
              >
                <Input id="email" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="dateEntree"
                label="Date"
                rules={[
                  {
                    required: true,
                    message: "Veuillez choisir la date d'entrée",
                  },
                ]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="grade"
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
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="adresse"
                label="Adresse"
                rules={[
                  { required: true, message: "Veuillez choisir l'adresse" },
                ]}
              >
                <Select
                  style={{ width: "100%" }}
                  allowClear
                  showSearch
                  optionFilterProp="children"
                >
                  <Option key="placeholder" value="" disabled>
                    Sélectionner une adresse
                  </Option>
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
                rules={[
                  { required: true, message: "Veuillez choisir le service" },
                ]}
              >
                <Select
                  style={{ width: "100%" }}
                  allowClear
                  showSearch
                  optionFilterProp="children"
                  onChange={handleServiceSelection}
                >
                  <Option key="placeholder" value="" disabled>
                    Sélectionner un service
                  </Option>
                  {services.map((service) => (
                    <Option key={service.IDService} value={service.IDService}>
                      {service.NomServiceFr}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {selectedServiceDetails && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "auto auto", // Deux colonnes
                gap: 1, // Espacement entre les éléments
              }}
            >
              <div style={{ textAlign: "left" }}>
                <p>
                  <span style={{ fontWeight: "bold" }}>Chef du Service:</span>{" "}
                  {selectedServiceDetails.NomChefService}{"  "}
                  {selectedServiceDetails.PrenomChefService}
                </p>

                <p>
                  <span style={{ fontWeight: "bold", fontSize: "0.9rem" }}>Chef du Département:</span>{"  "}
                  {selectedServiceDetails.NomChefDepartement}{" "}
                  {selectedServiceDetails.PrenomChefDepartement}
                </p>
              </div>
            </div>
          )}

          <Form.Item style={{ textAlign: "center", marginTop: "20px" }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ position: "relative", zIndex: "9999" }}
            >
              Valider
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default AddServiceForm;
