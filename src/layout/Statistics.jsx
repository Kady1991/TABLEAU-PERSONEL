import React from 'react';
import { Card, Col, Row, Statistic } from 'antd';

const Statistics = ({ data }) => {
  const totalPersonnesActives = data.filter(personne => personne.SiArchive === false).length;
  const totalPersonnesArchivees = data.filter(personne => personne.SiArchive === true).length;

  return (
    <Row gutter={16}>
      <Col span={12}>
        <Card bordered={false}>
          <Statistic
            title="ACTIVES"
            value={totalPersonnesActives}
            valueStyle={{ color: '#3f8600' }}
          />
        </Card>
      </Col>
      <Col span={12}>
        <Card bordered={false}>
          <Statistic
            title="SORTIES"
            value={totalPersonnesArchivees}
            valueStyle={{ color: '#cf1322' }}
          />
        </Card>
      </Col>
    </Row>
  );
};

export default Statistics;
