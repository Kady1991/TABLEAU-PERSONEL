import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import "../index.css";

const Statistics = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Récupération des données des services et des personnes
        const servicesResponse = await axios.get('https://server-iis.uccle.intra/API_PersonneTest/api/affectation/services');
        const personsResponse = await axios.get('https://server-iis.uccle.intra/API_PersonneTest/api/Personne');

        const services = servicesResponse.data;
        const persons = personsResponse.data;

        // Organisation des données par service
        const serviceData = services.map((service) => {
          // Filtrage des personnes par service
          const presentMembers = persons.filter(
            person => person.ServiceID === service.IDService && person.SiArchive === false
          );
          const archivedMembers = persons.filter(
            person => person.ServiceID === service.IDService && person.SiArchive === true
          );

          console.log("Archived Members for service", service.NomServiceFr, archivedMembers);

          const totalPresentMembers = presentMembers.length;
          const totalArchivedMembers = archivedMembers.length;

          const entriesByMonthYear = {};
          const exitsByMonthYear = {};

          // Calcul des entrées et sorties par mois et par année
          persons.forEach(person => {
            if (person.ServiceID === service.IDService) {
              // Date d'entrée
              const entryDate = new Date(person.DateEntree);
              const entryKey = `${entryDate.getFullYear()}-${entryDate.getMonth() + 1}`;
              entriesByMonthYear[entryKey] = (entriesByMonthYear[entryKey] || 0) + 1;

              // Date de sortie (uniquement si la personne est archivée)
              if (person.SiArchive) {
                const exitDate = new Date(person.DateSortie);
                const exitKey = `${exitDate.getFullYear()}-${exitDate.getMonth() + 1}`;
                exitsByMonthYear[exitKey] = (exitsByMonthYear[exitKey] || 0) + 1;
              }
            }
          });

          return {
            serviceName: service.NomServiceFr,
            totalPresentMembers,
            totalArchivedMembers,
            entriesByMonthYear,
            exitsByMonthYear
          };
        });

        setData(serviceData);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Formater les données du graphique pour les barres de chaque service
  const formatChartData = (entries, exits) => {
    const allKeys = Array.from(new Set([...Object.keys(entries), ...Object.keys(exits)]));
    return allKeys.map(key => ({
      monthYear: key,
      entries: entries[key] || 0,
      exits: exits[key] || 0
    }));
  };

  return (
    <div className="statistics-container" style={{ overflowY: 'auto', maxHeight: '70vh', paddingRight: '10px', backgroundColor: 'gray' }}>
      {loading ? (
        <p>Chargement des données...</p>
      ) : (
        data.map((service, index) => (
          <div key={index} className="service-statistics" style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}>
            <h2>{service.serviceName}</h2>
            <p>Total Présents: {service.totalPresentMembers}</p>
            <p>Total Archivés: {service.totalArchivedMembers}</p>
            <div style={{ height: '5px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={formatChartData(service.entriesByMonthYear, service.exitsByMonthYear)}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="monthYear" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="entries" fill="#8884d8" />
                  <Bar dataKey="exits" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Statistics;
