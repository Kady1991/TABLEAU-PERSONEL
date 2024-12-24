import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { BarChart } from '@mui/x-charts/BarChart';
import { CloseOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';
import '../assets/statistics.css';

const Statistics = ({ onClose }) => {
  const [yearData, setYearData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(2024);
  const [loading, setLoading] = useState(false);
  const [skipAnimation, setSkipAnimation] = useState(false);

  const fetchData = async (year) => {
    setLoading(true);

    try {
      let persons = [];
      try {
        const personsResponse = await axios.get(
          'https://server-iis.uccle.intra/API_PersonneTest/api/Personne'
        );
        persons = personsResponse.data;
      } catch (error) {
        console.error("Erreur lors de la récupération des personnes:", error);
      }

      const monthStats = Array(12).fill({ entries: 0, exits: 0 }).map(() => ({ entries: 0, exits: 0 }));

      persons.forEach((person) => {
        if (person.DateEntree) {
          const entryDate = dayjs(person.DateEntree);
          if (entryDate.year() === year) {
            monthStats[entryDate.month()].entries++;
          }
        }

        if (person.SiArchive && person.DateSortie) {
          const exitDate = dayjs(person.DateSortie);
          if (exitDate.year() === year) {
            monthStats[exitDate.month()].exits++;
          }
        }
      });

      setYearData(monthStats);
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(selectedYear);
  }, [selectedYear]);

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const series = [
    {
      label: 'Entrées',
      data: yearData.map((month) => month.entries),
    },
    {
      label: 'Sorties',
      data: yearData.map((month) => month.exits),
    },
  ];

  return (
    <div className="statistics-container" style={{ display: 'flex', width: '100%', height: '100%' }}>
      <div style={{ width: '45%', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <CloseOutlined className="close-icon" onClick={onClose} />

        {loading ? (
          <p>Chargement des données...</p>
        ) : (
          <Box sx={{ width: '100%' }}>
            {/* <Typography id="select-year" gutterBottom>
              
            </Typography> */}
            <TextField
              value={selectedYear}
              onChange={(event) => setSelectedYear(Number(event.target.value))}
              label="Année"
              type="number"
              variant="outlined"
              size="medium"
              style={{ marginBottom: '10px', width: '150px' }}
            />

            <BarChart
              height={350}
              xAxis={[{ scaleType: 'band', data: months }]}
              series={series}
              skipAnimation={skipAnimation}
            />
            {/* <FormControlLabel
              checked={skipAnimation}
              control={
                <Checkbox onChange={(event) => setSkipAnimation(event.target.checked)} />
              }
              label="Animation désactivée"
              labelPlacement="end"
            /> */}
          </Box>
        )}
      </div>
      <div style={{ width: '55%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {/* Ajoutez ici d'autres composants ou contenu */}
        {/* <Typography variant="h6">Autres statistiques à venir</Typography> */}
      </div>
    </div>
  );
};

export default Statistics;
