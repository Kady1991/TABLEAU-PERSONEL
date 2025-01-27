import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { CloseOutlined } from '@mui/icons-material';
import '../assets/statistics.css';

const Statistics = ({ onClose, personnes }) => {
  const [data, setData] = useState([]);
  const [selectedYear, setSelectedYear] = useState('Global');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [globalTotals, setGlobalTotals] = useState({ totalEntries: 0, totalExits: 0 });
  const [chartXAxis, setChartXAxis] = useState([]);

  useEffect(() => {
    const calculateStats = () => {
      const stats = {};
      let totalEntries = 0;
      let totalExits = 0;

      personnes.forEach((person) => {
        const department = person.NomDepartementFr;
        const service = person.NomServiceFr || 'Non spécifié';
        const entryYear = person.DateEntree ? new Date(person.DateEntree).getFullYear() : null;

        // Filtrer par année si sélectionnée (sauf pour Global)
        if (selectedYear !== 'Global' && entryYear !== parseInt(selectedYear)) return;

        // Filtrer par département si sélectionné
        if (selectedDepartment && department !== selectedDepartment) return;

        const key = selectedDepartment ? service : department;
        if (!stats[key]) stats[key] = { entries: 0, exits: 0 };

        // Comptabiliser les présents (SiArchive: false)
        if (!person.SiArchive) {
          stats[key].entries++;
          totalEntries++;
        }

        // Comptabiliser les sorties (SiArchive: true)
        if (person.SiArchive) {
          stats[key].exits++;
          totalExits++;
        }
      });

      setData(Object.values(stats));
      setChartXAxis(Object.keys(stats));
      setGlobalTotals({ totalEntries, totalExits });
    };

    calculateStats();
  }, [personnes, selectedYear, selectedDepartment]);

  const series = [
    {
      label: 'Présents',
      data: data.map((item) => item.entries),
      color: '#63a2c0',
    },
    {
      label: 'Sorties',
      data: data.map((item) => item.exits),
      color: '#C72C48',
    },
  ];

  const years = Array.from({ length: 2050 - 2024 + 1 }, (_, i) => 2024 + i);

  return (
    <div className="statistics-container" style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%' }}>
      <CloseOutlined
        className="close-icon"
        onClick={onClose}
        style={{
          cursor: 'pointer',
          color: 'rgb(213, 50, 80)',
          fontSize: '2rem',
          position: 'absolute',
          right: '20px',
          top: '20px',
          transition: 'color 0.3s ease',
        }}
        onMouseEnter={(e) => (e.target.style.color = 'darkred')}
        onMouseLeave={(e) => (e.target.style.color = 'red')}
      />

      <Box sx={{ width: '100%', padding: '20px', flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px', justifyContent: 'space-between', width: '100%' }}>
          <TextField
            select
            label="Année"
            value={selectedYear}
            onChange={(event) => setSelectedYear(event.target.value)}
            variant="outlined"
            size="small"
            style={{ marginRight: '20px', width: '150px' }}
            SelectProps={{ native: true }}
            InputLabelProps={{ shrink: true }}
          >
            <option value="Global">Global</option>
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </TextField>
          <TextField
            select
            label="Département"
            value={selectedDepartment}
            onChange={(event) => setSelectedDepartment(event.target.value)}
            variant="outlined"
            size="small"
            style={{ marginLeft: '20px', width: '250px' }}
            SelectProps={{ native: true }}
            InputLabelProps={{ shrink: true }}
          >
            <option value="">Tous les départements</option>
            {[...new Set(personnes.map((p) => p.NomDepartementFr).filter(dept => dept))].map((dept, index) => (
              <option key={index} value={dept}>{dept}</option>
            ))}
          </TextField>

        </Box>

        <BarChart
          height={350}
          width={900} /*  largeur totale barre */
          xAxis={[{ scaleType: 'band', data: chartXAxis }]}
          series={series}
          margin={{ left: 20, right: 20 }} /* Ajuste les marges autour du graphique */
          barWidth={30} /* Ajuste la largeur des barres */
          barGap={10} /* Espacement entre les barres */
          barCategoryGap={20} /* Espacement entre les catégories */
          style={{ maxWidth: '100%', }} /* Assurez la responsivité */
        />

      </Box>

      <div style={{ width: '80%', flex: '1', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
        <PieChart
          series={[{
            data: [
              {
                value: globalTotals.totalEntries,
                label: selectedDepartment
                  ? `Présents (${selectedDepartment}): ${globalTotals.totalEntries}`
                  : `Présents (Tous les départements): ${globalTotals.totalEntries}`,
                color: '#63a2c0',
              },
              {
                value: globalTotals.totalExits,
                label: selectedDepartment
                  ? `Sorties (${selectedDepartment}): ${globalTotals.totalExits}`
                  : `Sorties (Tous les départements): ${globalTotals.totalExits}`,
                color: ' #C72C48',
              },
            ],
            highlightScope: { fade: 'global', highlight: 'item' },
            faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
          }]}
          height={300}
        />
      </div>
    </div>
  );
};

export default Statistics;
