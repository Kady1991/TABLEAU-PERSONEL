import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Checkbox, Select } from 'antd';
import axios from 'axios';
import './FormulaireAjout.css';
import { DatePicker } from 'antd/es';

const { Option } = Select;

const FormulaireAjout = ({ onSubmit }) => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState('');
  const [nomPersonne, setNomPersonne] = useState('');
  const [prenomPersonne, setPrenomPersonne] = useState('');
  const [email, setEmail] = useState('');
  const [dateEntree, setDateEntree] = useState('');
  const [siFrancais, setSiFrancais] = useState('');
  const [nomRueFr, setNomRueFr] = useState('');
  const [showSecondService, setShowSecondService] = useState(false);
  const [secondServiceSelected, setSecondServiceSelected] = useState('');
  const [telPro, setTelPro] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('https://server-iis.uccle.intra/API_Personne_nat/api/Personne');
        const data = response.data;
        if (Array.isArray(data)) {
          const serviceNames = data.map(item => item.NomServiceFr);
          const uniqueServiceNames = [...new Set(serviceNames)];
          setServices(uniqueServiceNames);
        } else {
          console.error('La réponse de l\'API n\'est pas un tableau:', data);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des services:', error);
      }
    };

    fetchServices();
  }, []);

  const handleSubmit = () => {
    const nouveauMembre = {
      nom: nomPersonne,
      prenom: prenomPersonne,
      email,
      dateEntree,
      adresse: nomRueFr,
      service: selectedService,
      secondService: secondServiceSelected,
    };
    onSubmit(nouveauMembre);
  };

  return (
    <div className="formulaire">
      <Form>
        <Form.Item label="Nom">
          <Input
            value={nomPersonne}
            onChange={(e) => setNomPersonne(e.target.value)}
            placeholder="Nom"
          />
        </Form.Item>
        <Form.Item label="Prénom">
          <Input
            value={prenomPersonne}
            onChange={(e) => setPrenomPersonne(e.target.value)}
            placeholder="Prénom"
          />
        </Form.Item>
        <Form.Item label="E-mail">
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-mail"
          />
        </Form.Item>
        <Form.Item label="Date d'entrée">
          <DatePicker 
            value={dateEntree} 
            onChange={(date, dateString) => setDateEntree(dateString)} 
            placeholder="Date d'entrée" 
            style={{ width: '100%' }}
          />
        </Form.Item>
        <Form.Item label="Adresse">
          <Input
            value={nomRueFr}
            onChange={(e) => setNomRueFr(e.target.value)}
            placeholder="Adresse"
          />
        </Form.Item>
        <Form.Item label="Telephone">
          <Input
            value={telPro}
            onChange={(e) => setTelPro(e.target.value)}
            placeholder="Telephone"
          />
        </Form.Item>
        <Form.Item label="Langue">
          <Checkbox.Group
          style={{ display: 'block',width:'3rem', margin:'1rem',margintop:'1rem' }}
            options={[
              { label: 'Français', value: 'FR' },
              { label: 'Néerlandais', value: 'NL' }
            ]}
            value={siFrancais}
            onChange={(values) => setSiFrancais(values)}
          />
        </Form.Item>
        <Form.Item label="Service">
          <Select
            placeholder="Sélectionner"
            style={{ width: '100%' }}
            value={selectedService}
            onChange={(value) => setSelectedService(value)}
          >
            {services.map((service) => (
              <Option key={service} value={service}>{service}</Option>
            ))}
          </Select>
        </Form.Item>

        {/* Afficher le deuxième menu déroulant si la case à cocher "Autre service" est cochée */}
        <Form.Item style={{ display: showSecondService ? 'block' : 'none' }}>
          <Select
            placeholder="Sélectionner"
            style={{ width: '40%' }}
            value={secondServiceSelected}
            onChange={(value) => setSecondServiceSelected(value)}
          >
            {services.map((service) => (
              <Option key={service} value={service}>{service}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Checkbox
            onChange={(e) => setShowSecondService(e.target.checked)}
          >
            + Un autre service 
          </Checkbox>
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={handleSubmit}>Valider</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default FormulaireAjout;
