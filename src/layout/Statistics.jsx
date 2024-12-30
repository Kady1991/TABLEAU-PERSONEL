import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
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
  const [selectedFilter, setSelectedFilter] = useState('');
  const [departments, setDepartments] = useState([]);
  const [servicesByDepartment, setServicesByDepartment] = useState({});
  const [loading, setLoading] = useState(false);
  const [globalTotals, setGlobalTotals] = useState({ totalEntries: 0, totalExits: 0 });

  const fetchDepartmentsAndServices = async () => {
    try {
      const response = await axios.get('https://server-iis.uccle.intra/API_PersonneTest/api/Personne');
      const persons = response.data;

      const departmentsMap = {};
      persons.forEach((person) => {
        const department = person.NomDepartementFr;
        const service = person.NomServiceFr;

        if (!departmentsMap[department]) {
          departmentsMap[department] = new Set();
        }

        departmentsMap[department].add(service);
      });

      const structuredDepartments = Object.keys(departmentsMap).map((dept) => ({
        department: dept,
        services: Array.from(departmentsMap[dept]),
      }));

      setDepartments(structuredDepartments);
      setServicesByDepartment(departmentsMap);
    } catch (error) {
      console.error("Erreur lors de la récupération des départements et services:", error);
    }
  };

  const fetchData = async (year, filter) => {
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
        const department = person.NomDepartementFr;
        const service = person.NomServiceFr;

        if (filter && filter !== department && filter !== service) {
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
    fetchDepartmentsAndServices();
  }, []);

  useEffect(() => {
    fetchData(selectedYear, selectedFilter);
  }, [selectedYear, selectedFilter]);

  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const series = [
    {
      label: 'Entrées',
      data: yearData.map((month) => month.entries),
      color: '#649B88',
    },
    {
      label: 'Sorties',
      data: yearData.map((month) => month.exits),
      color: '#AE4A34',
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
          left: '20px',
          top: '20px',
          transition: 'color 0.3s ease',
        }}
        onMouseEnter={(e) => (e.target.style.color = 'darkred')}
        onMouseLeave={(e) => (e.target.style.color = 'red')}
      />

      {loading ? (
        <p>Chargement des données...</p>
      ) : (
        <Box sx={{ width: '100%', padding: '20px', flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
                label="Département / Service"
                value={selectedFilter}
                onChange={(event) => setSelectedFilter(event.target.value)}
                variant="outlined"
                size="small"
                style={{ marginLeft: '20px', width: '300px' }}
                SelectProps={{ native: true }}
                InputLabelProps={{ shrink: true }}
              >
                <option value="">Tous les départements</option>
                {departments.map((dept, index) => (
                  <optgroup key={index} label={dept.department}>
                    {dept.services.map((service, idx) => (
                      <option key={idx} value={service}>{service}</option>
                    ))}
                  </optgroup>
                ))}
              </TextField>
            </Box>
            <div style={{ display: 'block', fontSize: '16px', fontWeight: 'bold' }}>
              <div className='div-entree-annee'>
                <div style={{ color: '#649B88', marginBottom: '5px', fontSize: '1.2rem' }}>Entrées personnel (Année): {totalEntries}</div>
                <div style={{ color: '#AE4A34', marginBottom: '5px', fontSize: '1.2rem'  }}>Sorties personnel (Année): {totalExits}</div>
              </div>

              <div className='div-sortie-total'>
                <div style={{ color: '#649B88', marginBottom: '5px', fontSize: '1.2rem'  }}>Total Global du personnel: {globalTotals.totalEntries}</div>
                <div style={{ color: '#AE4A34', fontSize: '1.2rem'  }}>Total des Sorties: {globalTotals.totalExits}</div>
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
                { value: globalTotals.totalEntries, label: 'Total Entrées', color: '#649B88' },
                { value: globalTotals.totalExits, label: 'Total Sorties', color: '#AE4A34' },
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
