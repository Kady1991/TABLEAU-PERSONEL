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
import '../assets/home.css'; // Import du fichier CSS global pour ce composant

const { Header, Sider, Content } = Layout;

const Home = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeComponent, setActiveComponent] = useState('tableau');
  const [personnes, setPersonnes] = useState([]); // Données centralisées
  const [loading, setLoading] = useState(true); // Gestion du chargement

  const linkGetAllPersonnel = "https://server-iis.uccle.intra/API_PersonneTest/api/Personne";

  // Récupération des données
  useEffect(() => {
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

    fetchData();
  }, []);

  // Fonction pour gérer l'exportation
  const handleExport = () => {
    const nonArchivedPersonnes = personnes.filter(
      (personne) => personne.SiArchive === false || personne.SiArchive === "false" || personne.SiArchive === 0
    );

    // Déclenche l'export en utilisant le composant Export
    Export({ personnes: nonArchivedPersonnes });
  };

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo">
          <img src={logo} alt="Logo" style={{ width: '100%', height: 'auto' }} />
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={[
            {
              key: '1',
              icon: <TableOutlined />,
              label: (
                <Button type="link" onClick={() => setActiveComponent('tableau')} style={{ color: '#fff' }}>
                  TABLEAU
                </Button>
              ),
            },
            {
              key: '2',
              icon: <UserOutlined />,
              label: (
                <Button type="link" onClick={() => setActiveComponent('addMemberForm')} style={{ color: '#fff' }}>
                  AJOUTER MEMBRE
                </Button>
              ),
            },
            {
              key: '3',
              icon: <PieChartOutlined />,
              label: (
                <Button type="link" onClick={() => setActiveComponent('statistics')} style={{ color: '#fff' }}>
                  STATISTIQUES
                </Button>
              ),
            },
            {
              key: '4',
              icon: <UploadOutlined />,
              label: (
                <Button type="link" onClick={() => setActiveComponent('archiveList')} style={{ color: '#fff' }}>
                  ARCHIVES
                </Button>
              ),
            },
            {
              key: '5',
              icon: <ExportOutlined />,
              label: (
                <Button type="link" onClick={handleExport} style={{ color: '#fff' }}>
                  EXPORTER
                </Button>
              ),
            },
          ]}
        />
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
          <Tableau/>
          {/* Affichage des composants */}
          {activeComponent === 'tableau' && <Tableau personnes={personnes} loading={loading} />}
          {activeComponent === 'addMemberForm' && (
            <div className="overlay">
              <AddMemberForm onClose={() => setActiveComponent('tableau')} />
            </div>
          )}
          {activeComponent === 'statistics' && (
            <div className="overlay">
              <Statistics />
            </div>
          )}
          {activeComponent === 'archiveList' && (
            <div className="overlay">
              <ArchiveList />
            </div>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Home;
