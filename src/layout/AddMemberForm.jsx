import React, { useState, useEffect } from 'react';
import { Form, Input, DatePicker, Select, Button, Row, Col, Radio } from 'antd';
import axios from 'axios';

const { Option } = Select;

const AddMemberForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [grades, setGrades] = useState([]);
  const [services, setServices] = useState([]);
  const [addressData, setAddressData] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    setLoadingData(true);
    const fetchData = async () => {
      try {
        const gradesResponse = await axios.get('https://server-iis.uccle.intra/API_Personne/api/Personne');
        setGrades(gradesResponse.data);

        const servicesResponse = await axios.get('https://server-iis.uccle.intra/API_Personne/api/Personne');
        setServices(servicesResponse.data);

        const addressResponse = await axios.get('https://server-iis.uccle.intra/API_Personne/api/Personne');
        setAddressData(addressResponse.data);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      let siFrancais, siPersonnel;

      // Mapper la valeur de langue
      if (values.langue === 'fr') {
        siFrancais = true;
      } else if (values.langue === 'nl') {
        siFrancais = false;
      }

      // Mapper la valeur de siPersonnel
      if (values.siPersonnel === true) {
        siPersonnel = true;
      } else if (values.siPersonnel === false) {
        siPersonnel = false;
      }

      // Créer un objet avec les valeurs du formulaire
      const formData = {
        NomPersonne: values.nom,
        PrenomPersonne: values.prenom,
        Email: values.email,
        TelPro: values.telephone,
        DateEntree: values.dateEntree,
        Grade: values.grade,
        Adresse: values.adresse,
        Service: values.service,
        SiFrancais: siFrancais,
        SiTypePersonnel: siPersonnel ? 'Oui' : 'Non',
      };

      // Envoyer la requête PUT à l'API avec les données du formulaire
      const response = await axios.put('https://server-iis.uccle.intra/API_Personne/api/Personne', formData);

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi des données');
      }

      console.log('Nouveau membre ajouté avec succès');
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: "600px", zIndex: "1", position: "fixed", top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    }}>
      {loadingData ? (
        <p>Chargement des données...</p>
      ) : (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ maxWidth: '600px', width: '100%', padding: '20px', backgroundColor: '#f0f2f5', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="siPersonnel"
                label="Si personnel"
                rules={[{ required: true, message: 'Veuillez choisir si le membre est personnel' }]}
              >
                <Radio.Group>
                  <Radio value={true}>Oui</Radio>
                  <Radio value={false}>Non</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="langue"
                label="Langue"
                rules={[{ required: true, message: 'Veuillez choisir la langue' }]}
              >
                <Radio.Group>
                  <Radio value="fr">Français</Radio>
                  <Radio value="nl">Néerlandais</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="nom"
                label="Nom"
                rules={[{ required: true, message: 'Veuillez entrer le nom' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="prenom"
                label="Prénom"
                rules={[{ required: true, message: 'Veuillez entrer le prénom' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="telephone"
                label="Téléphone"
                rules={[{ required: true, message: 'Veuillez entrer le numéro de téléphone' }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true, message: 'Veuillez entrer l\'adresse email' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="dateEntree"
                label="Date d'entrée"
                rules={[{ required: true, message: 'Veuillez choisir la date d\'entrée' }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="grade"
                label="Grade"
                rules={[{ required: true, message: 'Veuillez choisir le grade' }]}
              >
                <Select style={{ width: '100%' }}>
                  <Option value="">Sélectionner un grade</Option>
                  {[...new Set(grades.map(grade => grade.NomWWGradeFr))]
                    .sort()
                    .map((gradeName, index) => (
                      <Option key={index} value={gradeName}>{gradeName}</Option>
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
                rules={[{ required: true, message: 'Veuillez choisir l\'adresse' }]}
              >
                <Select style={{ width: '100%' }}>
                  <Option value="">Sélectionner une adresse</Option>
                  {[...new Set(addressData.map(address => address.NomRueFr))]
                    .sort()
                    .map((addressName, index) => (
                      <Option key={index} value={addressName}>{addressName}</Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="service"
                label="Service"
                rules={[{ required: true, message: 'Veuillez choisir le service' }]}
              >
                <Select style={{ width: '100%' }}>
                  <Option value="">Sélectionner un service</Option>
                  {[...new Set(services.map(service => service.NomServiceFr))]
                    .sort()
                    .map((serviceName, index) => (
                      <Option key={index} value={serviceName}>{serviceName}</Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ textAlign: 'center' }}>
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
