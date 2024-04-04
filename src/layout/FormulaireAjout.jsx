import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Checkbox, Select } from 'antd';
import axios from 'axios';
import "./FormulaireAjout.css";


const { Option } = Select;

const FormulaireAjout = ({ onSubmit }) => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [dateEntree, setDateEntree] = useState('');
  const [adresse, setAdresse] = useState('');
  const [autreService, setAutreService] = useState(false);
  const [secondServiceNom, setSecondServiceNom] = useState('');
  const [secondServiceAdresse, setSecondServiceAdresse] = useState('');

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
      nom,
      prenom,
      email,
      dateEntree,
      adresse,
      service: selectedService,
    };
    onSubmit(nouveauMembre);
  };

  const handleAutreServiceChange = () => {
    setAutreService(!autreService);
  };

  return (
    <div style={{ height: '10vh', width: '10%', position: 'absolute', top: 0 }}>
      <Form className="formulaire">
        <Form.Item label="Nom">
          <Input
            value={nom}
            onChange={e => setNom(e.target.value)}
            placeholder="Nom"
          />
        </Form.Item>
        <Form.Item label="Prénom">
          <Input
            value={prenom}
            onChange={e => setPrenom(e.target.value)}
            placeholder="Prénom"
          />
        </Form.Item>
        <Form.Item label="E-mail">
          <Input
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="E-mail"
          />
        </Form.Item>
        <Form.Item label="Date d'entrée">
          <Input
            value={dateEntree}
            onChange={e => setDateEntree(e.target.value)}
            placeholder="Date d'entrée"
          />
        </Form.Item>
        <Form.Item label="Adresse">
          <Input
            value={adresse}
            onChange={e => setAdresse(e.target.value)}
            placeholder="Adresse"
          />
        </Form.Item>
        <Form.Item label="Service">
          <Select
            placeholder="Sélectionner un service"
            style={{ width: '100%' }}
            value={selectedService}
            onChange={value => setSelectedService(value)}
          >
            {services.map(service => (
              <Option key={service} value={service}>{service}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Checkbox
            checked={autreService}
            onChange={handleAutreServiceChange}
          >
            A un autre service
          </Checkbox>
        </Form.Item>
        {autreService && (
          <>
            <Form.Item label="Nom du second service">
              <Input
                value={secondServiceNom}
                onChange={e => setSecondServiceNom(e.target.value)}
                placeholder="Nom du second service"
              />
            </Form.Item>
            <Form.Item label="Adresse du second service">
              <Input
                value={secondServiceAdresse}
                onChange={e => setSecondServiceAdresse(e.target.value)}
                placeholder="Adresse du second service"
              />
            </Form.Item>
          </>
        )}
        <Form.Item>
          <Button type="primary" onClick={handleSubmit}>Valider</Button>
        </Form.Item>
      </Form>
    </div>
  );
  
};

export default FormulaireAjout;
