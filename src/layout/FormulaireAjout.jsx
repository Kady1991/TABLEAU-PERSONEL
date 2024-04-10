import React, { useState, useEffect } from 'react';
import { TextField, Button, RadioGroup, FormControlLabel, Radio, Select, MenuItem } from '@mui/material';
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
  const [nomRueFr, setNomRueFr] = useState('');
  const [telPro, setTelPro] = useState('');
  const [numeroNational, setNumeroNational] = useState('');
  const [typePersonnel, setTypePersonnel] = useState('');
  const [langue, setLangue] = useState('fr');
  const [adresses, setAdresses] = useState([]);
  const [selectedAdresse, setSelectedAdresse] = useState('');
  const [grades, setGrades] = useState([]); // Ajout de l'état pour les grades
  const [selectedGrade, setSelectedGrade] = useState(''); // Ajout de l'état pour le grade sélectionné

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://server-iis.uccle.intra/API_Personne/api/Personne');
        const data = response.data;
        if (Array.isArray(data)) {
          const serviceNames = data.map(item => item.NomServiceFr);
          const uniqueServiceNames = [...new Set(serviceNames)].sort();
          setServices(uniqueServiceNames);

          const adresses = data.map(item => item.NomRueFr);
          const uniqueAdresses = [...new Set(adresses)].sort();
          setAdresses(uniqueAdresses);

          const nomWWGradeFr = data.map(item => item.NomWWGradeFr);
          const uniqueNomWWGradeFr = [...new Set(nomWWGradeFr)].sort();
          setGrades(uniqueNomWWGradeFr);
        } else {
          console.error('La réponse de l\'API n\'est pas un tableau:', data);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = () => {
    const nouveauMembre = {
      nom: nomPersonne,
      prenom: prenomPersonne,
      email,
      dateEntree,
      adresse: selectedAdresse,
      service: selectedService,
      numeroNational,
      typePersonnel,
      langue,
      grade: selectedGrade, // Utilisation de selectedGrade pour le grade
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
        <TextField
          label="Téléphone professionnel"
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
          MenuProps={{
            style: {
              maxHeight: 450, // Hauteur maximale du menu déroulant
              width: 100, 
              marginTop: -20, // Déplacement vers le haut
            },
          }}
        >
          {adresses.map((adresse, index) => (
            <MenuItem key={index} value={adresse}>{adresse}</MenuItem>
          ))}
        </Select>

        <Select
          label="Service"
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
          MenuProps={{
            style: {
              maxHeight: 450, // Hauteur maximale du menu déroulant
              width: 100,
              marginTop: -100, // Déplacement vers le haut
              marginRight:-100
            },
          }}
        >
          {services.map((service, index) => (
            <MenuItem key={index} value={service}>{service}</MenuItem>
          ))}
        </Select>
        <Select
          label="Grade"
          value={selectedGrade}
          onChange={(e) => setSelectedGrade(e.target.value)}
          MenuProps={{
            style: {
              maxHeight: 450, // Hauteur maximale du menu déroulant
              width:100,
              marginTop: -20, // Déplacement vers le haut
            },
          }}
        >
          {grades.map((grade, index) => (
            <MenuItem key={index} value={grade}>{grade}</MenuItem>
          ))}
        </Select>
        <div className="radio-group">
          <p>Type de personnel :</p>
          <RadioGroup
            value={typePersonnel}
            onChange={(e) => setTypePersonnel(e.target.value)}
          >
            <FormControlLabel value="Oui" control={<Radio />} label="Oui" />
            <FormControlLabel value="Non" control={<Radio />} label="Non" />
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
        <div className="valider-button">
          <Button variant="contained" onClick={handleSubmit}>Valider</Button>
        </div>
      </form>
    </div>
  );
};

export default FormulaireAjout;
