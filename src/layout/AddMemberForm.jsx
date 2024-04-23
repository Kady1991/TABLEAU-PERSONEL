import React, { useState, useEffect } from 'react';
import { Form, Input, DatePicker, Select, Button, Row, Col, Radio } from 'antd';
import axios from 'axios';
import { ConfigProvider } from 'antd';
import frFR from 'antd/lib/locale/fr_FR'; // Importe la locale française d'Ant Design
import dayjs from 'dayjs'; // Importe dayjs






const { Option } = Select;

const AddMemberForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
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

  // RECUPERATION DES DETAILS DE SERVICES

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
      // Mapper la valeur de siPersonnel
      const siPersonnel = !!values.siPersonnel;
  
      // Mapper la valeur de siFrancais
      const siFrancais = values.langue === "fr";
  
      // Objet avec les valeurs du formulaire
      const formData = {
        NomPersonne: values.nom,
        PrenomPersonne: values.prenom,
        Email: values.email,
        TelPro: values.telephone,
        DateEntree: values.dateEntree,
        NomWWGradeFr: values.grade,
        Adresse: values.adresse,
        Service: values.service,
        SiFrancais: siFrancais,
        SiTypePersonnel: siTypePersonnel ? 'Oui' : 'Non',
      };
  
      // Envoyer la requête POST à l'API avec les données du formulaire
      const response = await axios.post('https://server-iis.uccle.intra/API_Personne/api/Personne', formData);
  
      // Vérifier si la requête a réussi
      if (!response.formData) {
        throw new Error("Erreur lors de l'envoi des données");
      }
  
      console.log("Nouveau membre ajouté avec succès");
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };
  



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
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="siTypePersonnel"
                label="Personnel"
                initialValue={false}
                rules={[{ required: true, message: "Veuillez choisir si le membre est personnel" }]}
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
                initialValue={true} // Modifiez ceci en fonction de votre logique par défaut
                rules={[{ required: true, message: "Veuillez choisir la langue" }]}
              >
                <Radio.Group>
                  <Radio value={true}>Oui</Radio>
                  <Radio value={false}>Non</Radio>
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
                <Input style={{ textTransform: 'uppercase' }} autoComplete="off" />
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
                <Input style={{ textTransform: 'uppercase' }} autoComplete="off" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="telephone"
                label="Téléphone"
                rules={[{ required: false, message: 'Veuillez entrer le numéro de téléphone' }]}
              >
                <Input />
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
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="dateEntree"
                label="Date"
                rules={[{ required: true, message: 'Veuillez choisir la date d\'entrée' }]}
              >
                
                  <DatePicker
                    defaultValue={dayjs()}
                    style={{ width: "100%" }}
                  />
                
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
                  <Option key="newGrade" value="newGrade">
                    Ajouter une nouvelle grade
                  </Option>
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
                  {addressData.map((address) => (
                    <Option key={address.IDAdresse} value={address.IDAdresse}>
                      {address.AdresseComplete}
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
            <div>
              <p>ID du Service: {selectedServiceDetails.IDService}</p>
              <p>Nom du Service: {selectedServiceDetails.NomServiceFr}</p>
              <p>Nom du Chef de Service: {selectedServiceDetails.NomChefService}</p>
              <p>Prénom du Chef de Service: {selectedServiceDetails.PrenomChefService}</p>
              <p>Email du Chef de Service: {selectedServiceDetails.EmailChefService}</p>
              <p>Nom du Departement: {selectedServiceDetails.NomDepartementFr}</p>
              <p>Nom Chef du Departement: {selectedServiceDetails.NomChefDepartement}</p>
              <p>Prenom Chef du Département: {selectedServiceDetails.PrenomChefDepartement}</p>
              <p>Email Chef du Département:{selectedServiceDetails.EmailChefDepartement}</p>

            </div>
          )}

          <Form.Item style={{ textAlign: "center" }}>
            <Button type="primary" htmlType="submit" loading={loading}>
              Valider
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default AddMemberForm;
