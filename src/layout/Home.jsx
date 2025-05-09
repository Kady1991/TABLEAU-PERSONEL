import React, { useState, useEffect } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  PieChartOutlined,
  TableOutlined,
  ExportOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Button } from 'antd';
import AddMemberForm from './AddMemberForm';
import Tableau from '../components/Tableau';
import Statistics from './Statistics';
import ArchiveList from './ArchiveList';
import Export from './Export';
import logo from '../assets/logo_white.png';
import '../assets/home.css';

import { LIEN_API_PERSONNE } from '../config';

const { Header, Sider, Content } = Layout;

const Home = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeComponent, setActiveComponent] = useState('tableau');
  const [personnes, setPersonnes] = useState([]);
  const [loading, setLoading] = useState(true);

  const linkGetAllPersonnel = `${LIEN_API_PERSONNE}/api/Personne`;

  const fetchData = async () => {
    try {
      const response = await fetch(linkGetAllPersonnel);
      const data = await response.json();
      const personnesData = data.map((personne) => ({
        ...personne,
        IDPersonneService: personne.IDPersonneService,
      }));
      setPersonnes(personnesData);
      setLoading(false);
    } catch (error) {
      console.error("Erreur lors de la récupération des données :", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdatePersonnes = () => {
    fetchData();
  };

  const handleOpenStatistics = () => {
    fetchData();
    setActiveComponent('statistics');
  };

  const handleExport = () => {
    const nonArchivedPersonnes = personnes.filter(
      (personne) =>
        personne.SiArchive === false ||
        personne.SiArchive === "false" ||
        personne.SiArchive === 0
    );
    Export({ personnes: nonArchivedPersonnes });
  };

  const menuItems = [
    {
      key: '1',
      icon: <TableOutlined />,
      label: (
        <Button type="link" onClick={() => setActiveComponent('tableau')} style={{ color: '#fff', margin: '-15px' }}>
          TABLEAU
        </Button>
      ),
    },
    {
      key: '2',
      icon: <UserOutlined />,
      label: (
        <Button type="link" onClick={() => setActiveComponent('addMemberForm')} style={{ color: '#fff', margin: '-15px' }}>
          AJOUT MEMBRE
        </Button>
      ),
    },
    {
      key: '3',
      icon: <PieChartOutlined />,
      label: (
        <Button type="link" onClick={handleOpenStatistics} style={{ color: '#fff', margin: '-15px' }}>
          STATISTIQUES
        </Button>
      ),
    },
    {
      key: '4',
      icon: <UploadOutlined />,
      label: (
        <Button type="link" onClick={() => setActiveComponent('archiveList')} style={{ color: '#fff', margin: '-15px' }}>
          ARCHIVES
        </Button>
      ),
    },
    {
      key: '5',
      icon: <ExportOutlined />,
      label: (
        <Button type="link" onClick={handleExport} style={{ color: '#fff', margin: '-15px' }}>
          EXPORTER
        </Button>
      ),
    },
  ];

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo">
          <img src={logo} alt="Logo" style={{ width: '100%', height: 'auto' }} />
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
          <Menu.Item key="1">
            <Button type="link" onClick={() => setActiveComponent('tableau')} style={{ color: '#fff', margin: '-15px' }}>
              <TableOutlined /> TABLEAU
            </Button>
          </Menu.Item>
          <Menu.Item key="2">
            <Button type="link" onClick={() => setActiveComponent('addMemberForm')} style={{ color: '#fff', margin: '-15px' }}>
              <UserOutlined /> AJOUT MEMBRE
            </Button>
          </Menu.Item>
          <Menu.Item key="3">
            <Button type="link" onClick={handleOpenStatistics} style={{ color: '#fff', margin: '-15px' }}>
              <PieChartOutlined /> STATISTIQUES
            </Button>
          </Menu.Item>
          <Menu.Item key="4">
            <Button type="link" onClick={() => setActiveComponent('archiveList')} style={{ color: '#fff', margin: '-15px' }}>
              <UploadOutlined /> ARCHIVES
            </Button>
          </Menu.Item>
          <Menu.Item key="5">
            <Button type="link" onClick={handleExport} style={{ color: '#fff', margin: '-15px' }}>
              <ExportOutlined /> EXPORTER
            </Button>
          </Menu.Item>
        </Menu>
      </Sider>
  
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }}>
          {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: 'trigger',
            style: { color: '#fff' },
            onClick: () => setCollapsed(!collapsed),
          })}
        </Header>
  
        <Content className="site-layout-content">
          <h1 className="header-title">GESTION DU PERSONNEL UCCLE</h1>
  
          {/* Tableau TOUJOURS visible */}
          <div className="main-content">
            <Tableau personnes={personnes} loading={loading} onRefresh={fetchData} />
          </div>
  
          {/* Overlays */}
          {activeComponent === 'addMemberForm' && (
            <div className="overlay">
              <AddMemberForm
                onClose={() => setActiveComponent('tableau')}
                onMemberUpdate={handleUpdatePersonnes}
                personnes={personnes}
              />
            </div>
          )}
  
          {activeComponent === 'statistics' && (
            <div className="overlay">
              <Statistics
                onClose={() => setActiveComponent('tableau')}
                personnes={personnes}
                refreshData={fetchData}
              />
            </div>
          )}
  
          {activeComponent === 'archiveList' && (
            <div className="overlay">
              <ArchiveList
                onMemberUpdate={handleUpdatePersonnes}
                personnes={personnes}
              />
            </div>
          )}
        </Content>
      </Layout>
    </Layout>
  );
  
    
};

export default Home;
