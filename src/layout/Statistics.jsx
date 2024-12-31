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
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [globalTotals, setGlobalTotals] = useState({ totalEntries: 0, totalExits: 0 });
  const [chartXAxis, setChartXAxis] = useState([]);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('https://server-iis.uccle.intra/API_PersonneTest/api/Personne');
      const persons = response.data;

      const uniqueDepartments = Array.from(
        new Set(persons.map((person) => person.NomDepartementFr))
      );

      setDepartments(uniqueDepartments);
    } catch (error) {
      console.error("Erreur lors de la récupération des départements:", error);
    }
  };

  const fetchData = async (year, department) => {
    setLoading(true);
    const parser = new XMLParser();

    try {
      const personsResponse = await axios.get(
        'https://server-iis.uccle.intra/API_PersonneTest/api/Personne'
      );
      const persons = personsResponse.data;

      const stats = {};
      let totalEntries = 0;
      let totalExits = 0;

      for (const person of persons) {
        const personDepartment = person.NomDepartementFr;
        const service = person.NomServiceFr;

        if (department && personDepartment !== department) {
          continue;
        }

        if (!stats[service]) {
          stats[service] = { entries: 0, exits: 0 };
        }

        if (person.DateEntree) {
          const entryDate = dayjs(person.DateEntree);
          totalEntries++;
          if (entryDate.year() === year) {
            stats[service].entries++;
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
                stats[service].exits++;
              }
            }
          } catch (error) {
            console.error("Erreur lors de la récupération des détails de la personne:", error);
          }
        }
      }

      setYearData(Object.values(stats));
      setChartXAxis(department ? Object.keys(stats) : [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
      ]);
      setGlobalTotals({ totalEntries, totalExits });
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    fetchData(selectedYear, selectedDepartment);
  }, [selectedYear, selectedDepartment]);

  const series = [
    {
      label: 'Entrées',
      data: yearData.map((data) => data.entries),
      color: '#649B88',
    },
    {
      label: 'Sorties',
      data: yearData.map((data) => data.exits),
      color: '#AE4A34',
    },
  ];

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
        <Box sx={{ width: '70%', padding: '20px', flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
                InputLabelProps={{ shrink: true }}
              >
                <option value="">Tous les départements</option>
                {departments.map((dept, index) => (
                  <option key={index} value={dept}>{dept}</option>
                ))}
              </TextField>
            </Box>
            <div style={{ display: 'block', fontSize: '16px', fontWeight: 'bold' }}>
              <div style={{ color: '#649B88', marginBottom: '5px', fontSize: '1.2rem' }}>Personnel total present : {globalTotals.totalEntries}</div>
              <div style={{ color: '#AE4A34', marginBottom: '5px', fontSize: '1.2rem' }}>Sorties total personnel : {globalTotals.totalExits}</div>
            </div>
          </Box>

          <BarChart
            height={350}
            xAxis={[{ scaleType: 'band', data: chartXAxis }]}
            series={series}
          />
        </Box>
      )}

      <div style={{ width: '50%', flex: '1', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px', marginTop:'10'}}>
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
