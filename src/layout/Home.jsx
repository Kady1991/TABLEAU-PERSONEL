import React, { useState, useEffect } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined, UploadOutlined, UserOutlined, PieChartOutlined, TableOutlined, ExportOutlined, } from '@ant-design/icons';
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
  const [personnes, setPersonnes] = useState([]); // Données centralisées
  const [loading, setLoading] = useState(true); // Gestion du chargement

  const linkGetAllPersonnel = `${LIEN_API_PERSONNE}/api/Personne`;

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

  // Mise à jour dynamique des données
  const handleUpdatePersonnes = (updatedPersonnes) => {
    setPersonnes(updatedPersonnes);
  };

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
              label: (
                <Button type="link" onClick={() => setActiveComponent('tableau')} style={{ color: '#fff', margin: '-15px' }}>
                  <TableOutlined /> TABLEAU
                </Button>
              ),
            },
            {
              key: '2',
              label: (
                <Button type="link" onClick={() => setActiveComponent('addMemberForm')} style={{ color: '#fff', margin: '-15px' }}>
                  <UserOutlined />  AJOUT MEMBRE
                </Button>
              ),
            },
            {
              key: '3',
              label: (
                <Button type="link" onClick={() => setActiveComponent('statistics')} style={{ color: '#fff', margin: '-15px' }} >
                  <PieChartOutlined /> STATISTIQUES
                </Button>
              ),
            },
            {
              key: '4',
              label: (
                <Button type="link" onClick={() => setActiveComponent('archiveList')} style={{ color: '#fff', margin: '-15px' }}>
                  <UploadOutlined /> ARCHIVES
                </Button>
              ),
            },
            {
              key: '5',
              label: (
                <Button type="link" onClick={handleExport} style={{ color: '#fff', margin: '-15px' }}>
                  <ExportOutlined /> EXPORTER
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
          <Tableau />
          {/* Affichage du titre */}
          <h1 className="header-title">GESTION DU PERSONNEL UCCLE</h1>
          {/* Affichage des composants */}
          {activeComponent === 'tableau' && <Tableau personnes={personnes} loading={loading} />}
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
              />
            </div>
          )}

          {activeComponent === 'archiveList' && (
            <div className="overlay">
              <ArchiveList onMemberUpdate={handleUpdatePersonnes} personnes={personnes} />
            </div>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Home;
