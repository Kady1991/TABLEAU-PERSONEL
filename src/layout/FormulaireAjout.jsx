import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Checkbox, Select } from 'antd';
import axios from 'axios';
import './FormulaireAjout.css';

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

  const handleAutreServiceChange = (e) => {
    setShowSecondService(e.target.checked);
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
          <Input
            value={dateEntree}
            onChange={(e) => setDateEntree(e.target.value)}
            placeholder="Date d'entrée"
          />
        </Form.Item>
        <Form.Item label="Langue">
          <Checkbox.Group
            options={[
              { label: 'Français', value: 'FR' },
              { label: 'Néerlandais', value: 'NL' }
            ]}
            value={siFrancais}
            onChange={(values) => setSiFrancais(values)}
          />
        </Form.Item>
        <Form.Item label="Adresse">
          <Input
            value={nomRueFr}
            onChange={(e) => setNomRueFr(e.target.value)}
            placeholder="Adresse"
          />
        </Form.Item>
        <Form.Item label="Service">
          <Select
            placeholder="Sélectionner un service"
            style={{ width: '100%' }}
            value={selectedService}
            onChange={(value) => setSelectedService(value)}
          >
            {services.map((service) => (
              <Option key={service} value={service}>{service}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Autres services">
          <Checkbox
            checked={showSecondService}
            onChange={handleAutreServiceChange}
          >
            A un autre service
          </Checkbox>
        </Form.Item>
        {showSecondService && (
          <Form.Item >
            <Select
              placeholder="Sélectionner un service pour le second service"
              style={{ width: '100%' }}
              value={secondServiceSelected}
              onChange={(value) => setSecondServiceSelected(value)}
            >
              {services.map((service) => (
                <Option key={service} value={service}>{service}</Option>
              ))}
            </Select>
          </Form.Item>
        )}
        <Form.Item>
          <Button type="primary" onClick={handleSubmit}>Valider</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default FormulaireAjout;
