import React, { useState, useEffect } from "react";
import { Form, Input, DatePicker, Select, Button, Row, Col, Radio } from "antd";
import axios from "axios";
import { CloseOutlined} from "@ant-design/icons";
import { IoPersonAddOutline } from "react-icons/io5";
import "../index.css";
import { IoPersonAddSharp } from "react-icons/io5";

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
        SiTypePersonnel: values.SiTypePersonnel 
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
    form.resetFields(); // Réinitialise tous les champs du formulaire
    setIsPersonnelSelected(false); // Réinitialise les champs conditionnels
    setSelectedServiceDetails(null); // Réinitialise les détails sélectionnés
    setIsFormOpen(false);
  };
  

  const handlePersonnelSelection = (value) => {
    setIsPersonnelSelected(value);
  };

  // Fonction pour générer l'e-mail à partir du prénom et du nom
  const generateEmail = (prenom, nom) => {
    if (!prenom || !nom) return ""; // Vérifie si prénom ou nom est manquant

    // Nettoie les espaces et les tirets du prénom et nom
    const prenoms = prenom.split(/[\s-]+/); // Séparer le prénom composé
    const noms = nom.split(/[\s-]+/); // Séparer le nom composé

    // Prend la première lettre de chaque partie du prénom composé
    const firstLettersPrenom = prenoms
      .filter((p) => p.trim() !== "") // Ignore les parties vides
      .map((p) => p.charAt(0).toLowerCase())
      .join("");

    // Fusionne les parties du nom en une chaîne sans espaces ni tirets
    const nomCleaned = noms.join("").toLowerCase();

    // Retourne l'e-mail formaté
    return `${firstLettersPrenom}${nomCleaned}@uccle.brussels`;
  };

  // Fonction de modification de la valeur de l'e-mail en fonction du prénom et du nom
  const handleNameChange = (e) => {
    const prenom = form.getFieldValue("prenom"); // Récupérer le prénom
    const nom = form.getFieldValue("nom"); // Récupérer le nom
    const email = generateEmail(prenom, nom); // Générer l'e-mail
    form.setFieldsValue({ email }); // Mettre à jour le champ e-mail
  };



  return (
    // STYLE INCORPORER BOUTON: AJOUTER MEMBRE
    <div>
      <Button className="button" type="secondary" onClick={openForm} icon={<IoPersonAddOutline />}>
        Nouveau membre
      </Button>

      {/*  MODAL FORMULAIRE AJOUTER MEMBRE */}
      {isFormOpen && (
        <div className={`modal ${isFormOpen ? "fade-in" : ""}`}>

          <div className="close-icon-container">
            <CloseOutlined onClick={closeForm} className="close-icon" />
          </div>

          <div className="new-member-container">
            <div className="icon-tableau">
              <IoPersonAddSharp className="person-icon" />
            </div>
            Nouveau membre
          </div>

          {loadingData ? (
            <p>Chargement des données...</p>
          ) : (
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              className="form-container"
              initialValues={{
                SiTypePersonnel: false,
                siFrancais: true,
              }}
            >

              {/* formulaire */}
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
                      name="NomTypePersonnelFr"
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
                          <Option key={typePersonnel.NomTypePersonnelFr} value={typePersonnel.NomTypePersonnelFr}>
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

              {/* Boutons de soumission */}
              <Form.Item className="form-buttons">
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="button-validate"
                >
                  Valider
                </Button>
                <Button onClick={closeForm} className="button-cancel">
                  Annuler
                </Button>
              </Form.Item>

             
            </Form>
          )}

        </div>
      )}
    </div>
  );
};

export default AddMemberForm;
