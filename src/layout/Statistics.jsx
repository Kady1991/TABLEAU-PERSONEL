import React, { useEffect, useState } from 'react'; 
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { CloseOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';
import { XMLParser } from 'fast-xml-parser';
import '../assets/statistics.css';

const Statistics = ({ onClose }) => {
  const [yearData, setYearData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(2024);
  const [inputYear, setInputYear] = useState(2024); // Année temporaire saisie par l'utilisateur
  const [loading, setLoading] = useState(false);
  const [globalTotals, setGlobalTotals] = useState({ totalEntries: 0, totalExits: 0 });
  const [inputDepartement , setInputDepartement ] = useState(2024); // Année temporaire saisie par l'utilisateur

  const fetchData = async (year) => {
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
    fetchData(selectedYear);
  }, [selectedYear]);

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      setSelectedYear(inputYear);
    }
  };

  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const series = [
    {
      label: 'Entrées mensuel',
      data: yearData.map((month) => month.entries),
      color: 'rgb(200, 211, 155)', // Couleur pour les entrées (vert)
    },
    {
      label: 'Sorties mensuel',
      data: yearData.map((month) => month.exits),
      color: '#AB1519', // Couleur pour les sorties (rouge)
    },
  ];

  const totalEntries = yearData.reduce((acc, month) => acc + month.entries, 0);
  const totalExits = yearData.reduce((acc, month) => acc + month.exits, 0);

  return (
    <div className="statistics-container" style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
      <CloseOutlined className="close-icon" onClick={onClose} />

      {loading ? (
        <p>Chargement des données...</p>
      ) : (
        <Box sx={{ width: '80%', padding: '20px', flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px', justifyContent: 'space-between', width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TextField
                value={inputYear}
                onChange={(event) => setInputYear(Number(event.target.value))}
                onKeyDown={handleKeyPress}
                label="Departement"
                type="test"
                variant="outlined"
                size="small"
                style={{ marginRight: '20px', width: '150px' }}
              />
               <TextField
                value={inputYear}
                onChange={(event) => setInputYear(Number(event.target.value))}
                onKeyDown={handleKeyPress}
                label="Année"
                type="number"
                variant="outlined"
                size="small"
                style={{ marginRight: '20px', width: '150px' }}
              />
            </Box>
            <div style={{ display: 'block', fontSize: '16px', fontWeight: 'bold' }}>
             
              <div style={{ color: '#CFA81E', marginBottom: '10px' }}>Total Global Entrées: {globalTotals.totalEntries}</div>
              <div style={{ color: '#F71027' }}>Total Global Sorties: {globalTotals.totalExits}</div>
            </div>
          </Box>

          <BarChart
            height={350}
            xAxis={[{ scaleType: 'band', data: months }]}
            series={series}
          />
        </Box>
      )}

      <div style={{ width: '60%', flex: '1', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '5px' }}>
        <PieChart
          series={[
            {
              data: [
                { value: totalEntries, label: 'Entrées annuel', color: 'rgb(140, 153, 87)' },
                { value: totalExits, label: 'Sorties annuel', color: '#94352D' },
              ],
              highlightScope: { fade: 'global', highlight: 'item' },
              faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
            },
          ]}
          height={300}
        />
      </div>
    </div>
  );
};

export default Statistics;
