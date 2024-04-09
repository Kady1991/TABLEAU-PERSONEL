import React, { useState, useEffect } from 'react';
import { TextField, Button, RadioGroup, FormControlLabel, Radio, Select, MenuItem } from '@mui/material';
import { DatePicker } from '@mui/lab';
import { AccountCircle, AlternateEmail, LocationOn, Phone } from '@mui/icons-material';
import axios from 'axios';
import './FormulaireAjout.css';

const FormulaireAjout = ({ onSubmit }) => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState('');
  const [nomPersonne, setNomPersonne] = useState('');
  const [prenomPersonne, setPrenomPersonne] = useState('');
  const [email, setEmail] = useState('');
  const [dateEntree, setDateEntree] = useState(null);
  const [siFrancais, setSiFrancais] = useState('');
  const [nomRueFr, setNomRueFr] = useState('');
  const [telPro, setTelPro] = useState('');
  const [numeroNational, setNumeroNational] = useState('');
  const [typePersonnel, setTypePersonnel] = useState(''); // Valeur initiale à définir
  const [grades, setGrades] = useState([]); // Liste des grades récupérés depuis l'API
  const [selectedGrade, setSelectedGrade] = useState(''); // Grade sélectionné dans le menu déroulant
  const [langue, setLangue] = useState('fr'); // Langue par défaut
  const [adresses, setAdresses] = useState([]); // Liste des adresses récupérées depuis l'API
  const [selectedAdresse, setSelectedAdresse] = useState(''); // Adresse sélectionnée dans le menu déroulant

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('https://server-iis.uccle.intra/API_Personne_nat/api/Personne');
        const data = response.data;
        if (Array.isArray(data)) {
          const serviceNames = data.map(item => item.NomServiceFr);
          const uniqueServiceNames = [...new Set(serviceNames)].sort(); // Tri alphabétique des noms de service
          setServices(uniqueServiceNames);
        } else {
          console.error('La réponse de l\'API n\'est pas un tableau:', data);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des services:', error);
      }
    };

    const fetchGrades = async () => {
      try {
        // Remplacer l'URL par celle de l'API des grades
        const response = await axios.get('https://exemple.com/api/grades');
        const data = response.data;
        setGrades(data); // Mettre à jour la liste des grades avec les données de l'API
      } catch (error) {
        console.error('Erreur lors de la récupération des grades:', error);
      }
    };

    const fetchAdresses = async () => {
      try {
        // Remplacer l'URL par celle de l'API des adresses
        const response = await axios.get('https://exemple.com/api/adresses');
        const data = response.data;
        const uniqueAdresses = [...new Set(data)].sort(); // Tri alphabétique des adresses
        setAdresses(uniqueAdresses);
      } catch (error) {
        console.error('Erreur lors de la récupération des adresses:', error);
      }
    };

    fetchServices();
    fetchGrades();
    fetchAdresses();
  }, []);

  const handleSubmit = () => {
    const nouveauMembre = {
      nom: nomPersonne,
      prenom: prenomPersonne,
      email,
      dateEntree,
      adresse: nomRueFr,
      service: selectedService,
      numeroNational,
      typePersonnel,
      grade: selectedGrade,
      langue,
      selectedAdresse, // Utilisation de selectedAdresse à la place de nomRueFr
    };
    onSubmit(nouveauMembre);
  };

  return (
    <div className="formulaire">
      <form>
        <TextField
          label="Nom"
          value={nomPersonne}
          onChange={(e) => setNomPersonne(e.target.value)}
          InputProps={{
            startAdornment: <AccountCircle />,
          }}
        />
        <TextField
          label="Prénom"
          value={prenomPersonne}
          onChange={(e) => setPrenomPersonne(e.target.value)}
          InputProps={{
            startAdornment: <AccountCircle />,
          }}
        />
        <TextField
          label="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          InputProps={{
            startAdornment: <AlternateEmail />,
          }}
        />
        <DatePicker
          label="Date d'entrée"
          value={dateEntree}
          onChange={(date) => setDateEntree(date)}
          renderInput={(params) => <TextField {...params} />}
        />

        <TextField
          label="Telephone"
          value={telPro}
          onChange={(e) => setTelPro(e.target.value)}
          InputProps={{
            startAdornment: <Phone />,
          }}
        />
        <TextField
          label="N° National"
          value={numeroNational}
          onChange={(e) => setNumeroNational(e.target.value)}
        />
      
        <Select
          label="Adresse"
          value={selectedAdresse}
          onChange={(e) => setSelectedAdresse(e.target.value)}
        >
          {adresses.map((adresse) => (
            <MenuItem key={adresse} value={adresse}>{adresse}</MenuItem>
          ))}
        </Select>
        <Select
          label="Service"
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
        >
          {services.map((service) => (
            <MenuItem key={service} value={service}>{service}</MenuItem>
          ))}
        </Select>
        <Select
          label="Adresse"
          value={selectedAdresse}
          onChange={(e) => setSelectedAdresse(e.target.value)}
        >
          {adresses.map((adresse) => (
            <MenuItem key={adresse} value={adresse}>{adresse}</MenuItem>
          ))}
        </Select>
        <div className="radio-group">
          <p>Type de personnel :</p>
          <RadioGroup
            value={typePersonnel}
            onChange={(e) => setTypePersonnel(e.target.value)}
          >
            <FormControlLabel value="Type 1" control={<Radio />} label="Type 1" />
            <FormControlLabel value="Type 2" control={<Radio />} label="Type 2" />
          </RadioGroup>
        </div>
        <div className="radio-group">
          <p>Langue :</p>
          <RadioGroup
            value={langue}
            onChange={(e) => setLangue(e.target.value)}
          >
            <FormControlLabel value="fr" control={<Radio />} label="Français" />
            <FormControlLabel value="nl" control={<Radio />} label="Néerlandais" />
          </RadioGroup>
        </div>
        {/* Bouton Valider */}
        <div className="valider-button">
          <Button variant="contained" onClick={handleSubmit}>Valider</Button>
        </div>
      </form>
    </div>
  );
};

export default FormulaireAjout;
