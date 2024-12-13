import React, { useMemo } from 'react';
import { Card } from 'antd';
import { Pie } from '@ant-design/plots';
import dayjs from 'dayjs';
import "../assets/styles/statistics.css";

const Statistics = ({ data }) => {
  const totalPersonnes = data.length;
  const totalArchives = data.filter(personne => personne.SiArchive === true).length;
  const personnesAnnee = data.filter(personne => dayjs(personne.DateEntree).isSame(dayjs(), 'year')).length;
  const personnesMois = data.filter(personne => dayjs(personne.DateEntree).isSame(dayjs(), 'month')).length;

  const pieChartData = [
    {
      type: 'Personnes enregistrées',
      value: totalPersonnes - totalArchives,
    },
    {
      type: 'Personnes archivées',
      value: totalArchives,
    },
  ];

  const pieConfig = {
    appendPadding: 10,
    data: pieChartData,
    angleField: 'value',
    colorField: 'type',
    color: ['#3CB371', '#FF6347'], // Vert pour les enregistrées, rouge pour les archivées
    radius: 1,
    innerRadius: 0.6,
    label: {
      type: 'spider',
      labelHeight: 28,
      content: '{name} ({percentage})',
      style: {
        fontSize: 14,
      },
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
  };

  return (
    <div className="statistics-wrapper">
      <h2 className="statistics-title">Statistiques</h2>
      <div className="statistics-container">
        <div className="statistics-item">
          <div className="small-card">
            <span style={{ fontSize: '1.2rem' }}>Ce mois: </span>
            <strong style={{ fontSize: '1.2rem' }}>{personnesMois}</strong>
          </div>
        </div>
        <div className="statistics-item">
          <div className="small-card">
            <span style={{ fontSize: '1.2rem' }}>Cette année: </span>
            <strong style={{ fontSize: '1.2rem' }}>{personnesAnnee}</strong>
          </div>
        </div>
        <div className="statistics-item">
          <div className="small-card">
            <span style={{ fontSize: '1.2rem' }}>Total: </span>
            <strong style={{ fontSize: '1.2rem' }}>{totalPersonnes}</strong>
          </div>
        </div>
        <div className="statistics-item">
          <div className="small-chart" style={{ width: '200px', height: '200px' }}>
            <Pie {...pieConfig} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
