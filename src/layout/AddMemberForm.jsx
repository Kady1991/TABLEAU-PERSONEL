import React, { useState, useEffect } from "react";
import { Form, Input, DatePicker, Select, Button, Row, Col, Radio } from "antd";
import axios from "axios";
import { CloseOutlined } from "@ant-design/icons";
import { IoPersonAddSharp } from "react-icons/io5";
import "../assets/index.css";

const { Option } = Select;

const AddMemberForm = ({ onClose, onMemberUpdate }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [grades, setGrades] = useState([]);
  const [services, setServices] = useState([]);
  const [addressData, setAddressData] = useState([]);
  const [personnes, setPersonnes] = useState([]); // Gestion locale
  const [loadingData, setLoadingData] = useState(false);
  const [selectedServiceDetails, setSelectedServiceDetails] = useState(null);
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
        SiArchive: false,
      };

      const response = await axios.post(
        "https://server-iis.uccle.intra/API_PersonneTest/api/Personne",
        formData
      );

      if (response.data === "Success") {
        const newPerson = { ...formData, IDPersonneService: response.data.id };
        const updatedPersonnes = [...personnes, newPerson];
        setPersonnes(updatedPersonnes);
        onMemberUpdate(updatedPersonnes);
        alert("Ajout réussi !");
        onClose();
      } else if (response.data === "Personne Exists")
        {
          alert("Ce email est déjà attribué");
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
  
    const handlePersonnelSelection = (value) => {
      setIsPersonnelSelected(value);
    };
  
    const generateEmail = (prenom, nom) => {
      if (!prenom || !nom) return "";
      const prenoms = prenom.split(/[\s-]+/);
      const noms = nom.split(/[\s-]+/);
      const firstLettersPrenom = prenoms
        .filter((p) => p.trim() !== "")
        .map((p) => p.charAt(0).toLowerCase())
        .join("");
      const nomCleaned = noms.join("").toLowerCase();
      return `${firstLettersPrenom}${nomCleaned}@uccle.brussels`;
    };
  
    const handleNameChange = () => {
      const prenom = form.getFieldValue("prenom");
      const nom = form.getFieldValue("nom");
      const email = generateEmail(prenom, nom);
      form.setFieldsValue({ email });
    };
  
    return (
      <div className="modal fade-in">
        <div className="close-icon-container">
          <CloseOutlined onClick={onClose} className="close_icon" />
        </div>
        <div className="div-title-form-ajout-membre-icon">
          <IoPersonAddSharp className="person-icon" />
          <h1 className="title-ajouter-membre">Ajouter un membre</h1>
        </div>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ siFrancais: true, SiTypePersonnel: false }}
          style={{
            maxWidth: "100%",
            width: "100%",
            padding: "20px",
            backgroundColor: "#f0f2f5",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
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
                rules={[
                  { required: false, message: "Veuillez entrer le numéro de téléphone" },
                ]}
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
                rules={[
                  {
                    required: true,
                    message: "Veuillez choisir si le membre est personnel",
                  },
                ]}
              >
                <Radio.Group onChange={(e) => handlePersonnelSelection(e.target.value)}>
                  <Radio value={true}>Oui</Radio>
                  <Radio value={false}>Non</Radio>
                </Radio.Group>
              </Form.Item>
              {isPersonnelSelected && (
                <Form.Item
                  name="NomTypePersonnelFr"
                  label="Type de personnel"
                  rules={[
                    {
                      required: true,
                      message: "Veuillez choisir le type de personnel",
                    },
                  ]}
                >
                  <Select
                    style={{ width: "100%" }}
                    allowClear
                    showSearch
                    optionFilterProp="children"
                  >
                    {typePersonnelList.map((typePersonnel) => (
                      <Option
                        key={typePersonnel.NomTypePersonnelFr}
                        value={typePersonnel.NomTypePersonnelFr}
                      >
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
          {selectedServiceDetails && (
            <div className="service-details">
              <div>
                <p>
                  <strong>Chef du Service:</strong>{" "}
                  {selectedServiceDetails.NomChefService}{" "}
                  {selectedServiceDetails.PrenomChefService}
                </p>
                <p>
                  <strong>Chef du Département:</strong>{" "}
                  {selectedServiceDetails.NomChefDepartement}{" "}
                  {selectedServiceDetails.PrenomChefDepartement}
                </p>
              </div>
            </div>
          )}
          <Form.Item className="form-buttons">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="button-validate"
            >
              Valider
            </Button>
            <Button onClick={onClose} className="button-cancel">
              Annuler
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  };
  
  export default AddMemberForm;
  