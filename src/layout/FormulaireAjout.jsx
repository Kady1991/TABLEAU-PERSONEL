import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Radio, Select } from 'antd';
import axios from 'axios';
import './FormulaireAjout.css';
import { DatePicker } from 'antd/es';
import { AccountCircle, AlternateEmail, LocationOn, Phone } from '@mui/icons-material'; // Import des icônes MUI

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
  const [telPro, setTelPro] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('https://server-iis.uccle.intra/API_Personne/api/Personne');
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

  const [startDate, setStartDate] = useState(new Date());

  return (
    <div className="formulaire">
      <Form>
        <Form.Item label="Nom">
          <Input
            value={nomPersonne}
            onChange={(e) => setNomPersonne(e.target.value)}
            prefix={<AccountCircle />} // Icône MUI pour le nom

          />
        </Form.Item>
        <Form.Item label="Prénom">
          <Input
            value={prenomPersonne}
            onChange={(e) => setPrenomPersonne(e.target.value)}
            prefix={<AccountCircle />} // Icône MUI pour le prénom

          />
        </Form.Item>
        <Form.Item label="E-mail">
          <Input
          
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            prefix={<AlternateEmail />} // Icône MUI pour l'email

          />
        </Form.Item>

        <Form.Item label="Date d'entrée" >
          <DatePicker
          style={{width:"24rem", height:"2.5rem"}}
            showIcon
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            icon="fa fa-calendar"
            format="DD/MM/YYYY" // Format de date 

          />
        </Form.Item>

        <Form.Item label="Adresse">
          <Input
            value={nomRueFr}
            onChange={(e) => setNomRueFr(e.target.value)}
            prefix={<LocationOn />} // Icône MUI pour l'adresse

          />
        </Form.Item>
        <Form.Item label="Telephone">
          <Input
            value={telPro}
            onChange={(e) => setTelPro(e.target.value)}
            prefix={<Phone />} // Icône MUI pour le téléphone

          />
        </Form.Item>
        <Form.Item label="Langue" style={{ marginLeft: "-8.7rem" }}>
          <Radio.Group

            value={siFrancais}
            onChange={(e) => setSiFrancais(e.target.value)}
          >
            <Radio className='radio' name="langue" value="FR">FR</Radio>
            <Radio className='radio' name="langue" value="NL">NL</Radio>


          </Radio.Group>
        </Form.Item>

        <Form.Item label="Service">
          <Select
           style={{width:"24rem", height:"2.5rem"}}
            value={selectedService}
            onChange={(value) => setSelectedService(value)}
          >
            {services.map((service) => (
              <Option key={service} value={service}>{service}</Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" style={{width:"15rem", height:"2.5rem", display:'flex', justifyContent:'center', alignItems:"center", fontSize:"1rem"}} 
          onClick={handleSubmit}>Valider</Button> 
        </Form.Item>
      </Form>
    </div>
  );
};

export default FormulaireAjout;
