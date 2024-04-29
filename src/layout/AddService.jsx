import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Input, Select, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Option } = Select;

const AddService = ({ firstName, lastName, email, onServiceAdded }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const [serviceOptions, setServiceOptions] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get('https://server-iis.uccle.intra/API_Personne/api/affectation/services');
      setServiceOptions(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des services :', error);
    }
  };

  const handleServiceSelection = (value, option) => {
    const selectedService = {
      IDService: value,
      SousServiceID: option.key, // Assurez-vous que la clé de l'option correspond à l'ID du sous-service
      NomServiceFr: option.children
    };
    setSelectedServices([...selectedServices, selectedService]);
  };
  

  const showModal = () => {
    setIsOpen(true);
  };

  const handleCancel = () => {
    setIsOpen(false);
    form.resetFields();
  };

//   logique d'ajout de service

  const handleOk = () => {
    form.validateFields().then(values => {
      const { services } = values;
      if (services && services.length > 0) {
        const additionalServices = services.map(serviceId => {
          const selectedService = serviceOptions.find(service => service.IDService === serviceId);
          return {
            IDService: selectedService.IDService,
            SousServiceID: selectedService.SousServiceID, // Assurez-vous de stocker l'ID du sous-service
            NomServiceFr: selectedService.NomServiceFr
          };
        });
        
        const updatedServices = [...selectedServices, ...additionalServices];
        
        setSelectedServices(updatedServices);
  
        message.success('Services ajoutés avec succès !');
        setIsOpen(false);
        form.resetFields();
      } else {
        message.error('Veuillez sélectionner au moins un service');
      }
    });
  };
  

  return (
    <>
      <Button
        type="link"
        onClick={showModal}
        icon={<PlusOutlined />}
        title="Ajouter un service" // Texte affiché au survol
      />
      <Modal
        title="Ajouter un service supplémentaire"
        open={isOpen} // Utilisation de la prop "visible" au lieu de "open"
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Valider"
        cancelText="Annuler"
      >
        <Form form={form} layout="vertical" name="service_form">
          <Form.Item label="Prénom">
            <Input value={firstName} disabled />
          </Form.Item>
          <Form.Item label="Nom">
            <Input value={lastName} disabled />
          </Form.Item>
          <Form.Item label="Email">
            <Input value={email} disabled />
          </Form.Item>
          
          <Form.Item
            name="services"
            label="Services supplémentaires"
            rules={[{ required: true, message: 'Veuillez choisir au moins un service' }]}
          >
            <Select
              style={{ width: '100%' }}
              mode="multiple"
              allowClear
              showSearch
              optionFilterProp="children"
              onChange={handleServiceSelection}
            >
              {serviceOptions.map(service => (
                <Option key={service.IDService} value={service.IDService}>
                  {service.NomServiceFr}
                </Option>
              ))}
            </Select>
          </Form.Item>
          {selectedServices.length > 0 && (
            <div>
              <p>Services sélectionnés :</p>
              {selectedServices.map(service => (
                <p key={service.IDService}>{service.NomServiceFr}</p>
              ))}
            </div>
          )}
        </Form>
      </Modal>
    </>
  );
};

export default AddService;
