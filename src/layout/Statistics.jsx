import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { CloseOutlined } from '@mui/icons-material';
import axios from 'axios';
import dayjs from 'dayjs';
import { XMLParser } from 'fast-xml-parser';
import '../assets/statistics.css';

const Statistics = ({ onClose }) => {
  const [yearData, setYearData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(2024);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedService, setSelectedService] = useState(''); // Service sélectionné
  const [departments, setDepartments] = useState([]);
  const [services, setServices] = useState([]); // Liste des services
  const [loading, setLoading] = useState(false);
  const [globalTotals, setGlobalTotals] = useState({ totalEntries: 0, totalExits: 0 });

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('https://server-iis.uccle.intra/API_PersonneTest/api/Personne');
      const persons = response.data;

      const uniqueDepartments = Array.from(
        new Set(persons.map((person) => person.NomDepartementFr))
      ).map((department) => ({ NomDepartementFr: department }));

      setDepartments(uniqueDepartments);
    } catch (error) {
      console.error("Erreur lors de la récupération des départements:", error);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await axios.get('https://server-iis.uccle.intra/API_PersonneTest/api/Personne');
      const persons = response.data;

      const uniqueServices = Array.from(
        new Set(persons.map((person) => person.NomServiceFr))
      ).map((service) => ({ NomServiceFr: service }));

      setServices(uniqueServices);
    } catch (error) {
      console.error("Erreur lors de la récupération des services:", error);
    }
  };

  const fetchData = async (year, department, service) => {
    setLoading(true);
    const parser = new XMLParser();

    try {
      const personsResponse = await axios.get(
        'https://server-iis.uccle.intra/API_PersonneTest/api/Personne'
      );
      const persons = personsResponse.data;

      const monthStats = Array(12).fill({ entries: 0, exits: 0 }).map(() => ({ entries: 0, exits: 0 }));
      let totalEntries = 0;
      let totalExits = 0;

      for (const person of persons) {
        if (department && person.NomDepartementFr !== department) {
          continue;
        }

        if (service && person.NomServiceFr !== service) {
          continue;
        }

        if (person.DateEntree) {
          const entryDate = dayjs(person.DateEntree);
          totalEntries++;
          if (entryDate.year() === year) {
            monthStats[entryDate.month()].entries++;
          }
        }

        const isArchived = person.SiArchive === true || person.SiArchive === "true" || person.SiArchive === 1;
        if (isArchived) {
          try {
            const detailResponse = await axios.get(
              `https://server-iis.uccle.intra/API_PersonneTest/api/Personne/${person.IDPersonneService}`,
              { headers: { Accept: "application/xml" } }
            );

            const personDetail = parser.parse(detailResponse.data);
            const exitDate = dayjs(personDetail?.WhosWhoModelView?.DateSortie);

            if (exitDate.isValid()) {
              totalExits++;
              if (exitDate.year() === year) {
                monthStats[exitDate.month()].exits++;
              }
            }
          } catch (error) {
            console.error("Erreur lors de la récupération des détails de la personne:", error);
          }
        }
      }

      setYearData(monthStats);
      setGlobalTotals({ totalEntries, totalExits });
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchServices();
  }, []);

  useEffect(() => {
    fetchData(selectedYear, selectedDepartment, selectedService);
  }, [selectedYear, selectedDepartment, selectedService]);

  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const series = [
    {
      label: 'Entrées',
      data: yearData.map((month) => month.entries),
      color: '#649B88', // Couleur pour les entrées (vert)
    },
    {
      label: 'Sorties',
      data: yearData.map((month) => month.exits),
      color: '#AE4A34', // Couleur pour les sorties (rouge)
    },
  ];

  const totalEntries = yearData.reduce((acc, month) => acc + month.entries, 0);
  const totalExits = yearData.reduce((acc, month) => acc + month.exits, 0);

  return (
    <div className="statistics-container" style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
      <CloseOutlined
        className="close-icon"
        onClick={onClose}
        style={{
          cursor: 'pointer',
          color: 'red',
          fontSize: '2rem',
          position: 'absolute',
          right: '20px', // Positionnez-le à gauche
          top: '20px', // Optionnel, ajustez pour aligner verticalement
          transition: 'color 0.3s ease',
        }}
        onMouseEnter={(e) => (e.target.style.color = 'darkred')} // Changement de couleur au survol
        onMouseLeave={(e) => (e.target.style.color = 'red')} // Retour à la couleur rouge après survol
      />


      {loading ? (
        <p>Chargement des données...</p>
      ) : (
        <Box sx={{ width: '80%', padding: '20px', flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px', justifyContent: 'space-between', width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                label="Année"
                type="number"
                value={selectedYear}
                onChange={(event) => setSelectedYear(Number(event.target.value))}
                variant="outlined"
                size="small"
                style={{ marginRight: '20px', width: '150px' }}
              />
              <TextField
                select
                label="Département"
                value={selectedDepartment}
                onChange={(event) => setSelectedDepartment(event.target.value)}
                variant="outlined"
                size="small"
                style={{ marginLeft: '20px', width: '300px' }}
                SelectProps={{ native: true }}
                InputLabelProps={{ shrink: true }} // Ajout pour que le label reste fixe
              >
                <option value="">Tous les départements</option>
                {departments.map((dept, index) => (
                  <option key={index} value={dept.NomDepartementFr}>{dept.NomDepartementFr}</option>
                ))}
              </TextField>
              <TextField
                select
                label="Service"
                value={selectedService}
                onChange={(event) => setSelectedService(event.target.value)}
                variant="outlined"
                size="small"
                style={{ marginLeft: '20px', width: '300px' }}
                SelectProps={{ native: true }}
                InputLabelProps={{ shrink: true }}
              >
                <option value="">Tous les services</option>
                {services.map((service, index) => (
                  <option key={index} value={service.NomServiceFr}>{service.NomServiceFr}</option>
                ))}
              </TextField>
            </Box>
            <div style={{ display: 'block', fontSize: '16px', fontWeight: 'bold' }}>
              <div className='div-entree-annee'>
                <div style={{ color: '#4caf50', marginBottom: '5px', fontSize: '1.2rem' }}>Entrées personnel (Année): {totalEntries}</div>
                <div style={{ color: '#f44336', marginBottom: '5px', fontSize: '1.2rem'  }}>Sorties personnel (Année): {totalExits}</div>
              </div>

              <div className='div-sortie-total'>
                <div style={{ color: '#4caf50', marginBottom: '5px', fontSize: '1.2rem'  }}>Total Global du personnel: {globalTotals.totalEntries}</div>
                <div style={{ color: '#f44336', fontSize: '1.2rem'  }}>Total des Sorties: {globalTotals.totalExits}</div>
              </div>


            </div>
          </Box>

          <BarChart
            height={350}
            xAxis={[{ scaleType: 'band', data: months }]}
            series={series}
          />
        </Box>
      )}

      <div style={{ width: '100%', flex: '1', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
        <PieChart
          series={[
            {
              data: [
                { value: totalEntries, label: 'Total Entrées', color: '#649B88' },
                { value: totalExits, label: 'Total Sorties', color: '#AE4A34' },
              ],
              highlightScope: { fade: 'global', highlight: 'item' },
              faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
            },
          ]}
          height={200}
        />
      </div>
    </div>
  );
};

export default Statistics;

