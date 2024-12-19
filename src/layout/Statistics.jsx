import React, { useState } from 'react';
import { Card, Col, Row, Statistic, Drawer } from 'antd';

const Statistics = ({ data = [], onClose, isOpen }) => {
  const totalPersonnesActives = Array.isArray(data) ? data.filter(personne => personne.SiArchive === false).length : 0;
  const totalPersonnesArchivees = Array.isArray(data) ? data.filter(personne => personne.SiArchive === true).length : 0;

  return (
    <Drawer
      title="Statistiques"
      placement="right"
      onClose={onClose}
      open={isOpen}
      width={500}
    >
      {isOpen && (
        <Row gutter={18}>
          <Col span={12}>
            <Card bordered={false}>
              <Statistic
                title="Actives"
                value={totalPersonnesActives}
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card bordered={false}>
              <Statistic
                title="Inactives"
                value={totalPersonnesArchivees}
                valueStyle={{ color: '#cf1322' }}
              />
            </Card>
          </Col>
        </Row>
      )}
    </Drawer>
  );
};

export default Statistics;
