import React, { useState } from 'react';
import { Card, Col, Row, Statistic, Button, Drawer } from 'antd';
import { IoIosStats } from "react-icons/io";

const Statistics = ({ data = [] }) => {
  const [open, setOpen] = useState(false);

  const totalPersonnesActives = Array.isArray(data) ? data.filter(personne => personne.SiArchive === false).length : 0;
  const totalPersonnesArchivees = Array.isArray(data) ? data.filter(personne => personne.SiArchive === true).length : 0;

  const handleStatisticsClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  

  return (
    <div>
      <Button
        
        className="button"
        startIcon={<IoIosStats />}
        onClick={handleStatisticsClick} 
        // variant="contained"
      >
        Statistiques
      </Button>
      

      <Drawer
        title="Statistiques"
        placement="top"
        onClose={handleClose}
        open={open}
        width={500}
      >
        {open && (
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
    </div>
  );
};

export default Statistics;
