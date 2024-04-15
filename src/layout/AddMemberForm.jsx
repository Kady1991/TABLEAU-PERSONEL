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

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const response = await axios.get('https://server-iis.uccle.intra/API_Personne/api/Personne');
        setGrades(response.data)
      } catch (error) {
        console.error('Erreur lors du chargement des grades:', error);
      }
    };


    const fetchServices = async () => {
      try {
        const response = await axios.get('https://server-iis.uccle.intra/API_Personne/api/Personne');
        setServices(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des services:', error);
      }
    };

    const fetchAddressData = async () => {
      try {
        const response = await axios.get('https://server-iis.uccle.intra/API_Personne/api/Personne');
        setAddressData(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des données d\'adresse:', error);
      }
    };

    fetchGrades();
    fetchServices();
    fetchAddressData();
  }, []);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post('https://server-iis.uccle.intra/API_Personne/api/Personne', values);

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
                {grades.map(grade => (
                  <Option key={grade.id} value={grade.NomWWGradeFr}>{grade.NomWWGradeFr}</Option>
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
                {addressData.map(address => (
                  <Option key={address.id} value={address.NomRueFr}>{address.NomRueFr}</Option>
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
                {services.map(service => (
                  <Option key={service.id} value={service.NomServiceFr}>{service.NomServiceFr}</Option>
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
    </div>
  );
};

export default AddMemberForm;
