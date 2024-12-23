import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs'; // Import de dayjs
import { BarChart } from '@mui/x-charts';
import { CloseCircleOutlined } from '@ant-design/icons'; // Icône de fermeture
import '../assets/statistics.css'; // Import des styles

const Statistics = ({ onClose }) => {
  const [entriesByMonth, setEntriesByMonth] = useState(Array(12).fill(0));
  const [exitsByMonth, setExitsByMonth] = useState(Array(12).fill(0));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const personsResponse = await axios.get(
          'https://server-iis.uccle.intra/API_PersonneTest/api/Personne'
        );

        const persons = personsResponse.data;

        const entries = Array(12).fill(0);
        const exits = Array(12).fill(0);

        persons.forEach((person) => {
          if (person.DateEntree) {
            const entryDate = dayjs(person.DateEntree);
            if (entryDate.isValid() && entryDate.year() === 2024) {
              entries[entryDate.month()]++;
            }
          }

          if (person.SiArchive && person.DateSortie) {
            const exitDate = dayjs(person.DateSortie);
            if (exitDate.isValid() && exitDate.year() === 2024) {
              exits[exitDate.month()]++;
            }
          }
        });

        setEntriesByMonth(entries);
        setExitsByMonth(exits);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="statistics-container">
      <h1 className='titre-div-statistique'> Statistiques</h1>
      {/* Icône de fermeture */}
      <CloseCircleOutlined
        className="close-icon"
        onClick={onClose} // Appel de la fonction de fermeture
      />

      {loading ? (
        <p>Chargement des données...</p>
      ) : (
        <div className="bar-statistics">
          <h3 className="statistics-title">
            Statistiques des entrées et sorties pour 2024
          </h3>
          <BarChart
            xAxis={[
              {
                scaleType: 'band',
                data: [
                  'Janvier',
                  'Février',
                  'Mars',
                  'Avril',
                  'Mai',
                  'Juin',
                  'Juillet',
                  'Août',
                  'Septembre',
                  'Octobre',
                  'Novembre',
                  'Décembre',
                ],
              },
            ]}
            series={[
              { data: entriesByMonth, label: 'Entrées', color: '#22780F' },
              { data: exitsByMonth, label: 'Sorties', color: '#FF0000' },
            ]}
            width={700}
            height={300}
          />
        </div>
      )}
    </div>
  );
};

export default Statistics;
