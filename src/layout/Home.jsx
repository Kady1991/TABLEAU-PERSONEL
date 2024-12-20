import React, { useState } from 'react';
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

const { Header, Sider, Content } = Layout;

const Home = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeComponent, setActiveComponent] = useState('tableau');
  const [personnes, setPersonnes] = useState([]); // Correction de l'erreur de la variable 'personnes'


  // Fonction d'ouverture/fermeture du composant Formulaire d'ajout ; Ouvrir l'affichage de la liste des archives
  const openForm = () => setActiveComponent('addMemberForm');
  const openTableau = () => setActiveComponent('tableau');
  const openStatistics = () => setActiveComponent('statistics');
  const openArchives = () => setActiveComponent('archiveList');

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
                <Button type="link" onClick={openTableau} style={{ color: '#fff' }}>
                  TABLEAU
                </Button>
              ),
            },
            {
              key: '2',
              icon: <UserOutlined />,
              label: (
                <Button type="link" onClick={openForm} style={{ color: '#fff' }}>
                  AJOUTER MEMBRE
                </Button>
              ),
            },
            {
              key: '3',
              icon: <PieChartOutlined />,
              label: (
                <Button type="link" onClick={openStatistics} style={{ color: '#fff' }}>
                  STATISTIQUES
                </Button>
              ),
            },
            {
              key: '4',
              icon: <UploadOutlined />,
              label: (
                <Button type="link" onClick={openArchives} style={{ color: '#fff' }}>
                  ARCHIVES
                </Button>
              ),
            },
            {
              key: '5',
              icon: <ExportOutlined />,
              label: (
                <Button type="link" onClick={() => setActiveComponent('export')} style={{ color: '#fff' }}>
                  EXPORTER
                </Button>
              ),
            }

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
        <Content 
  className="site-layout-background" 
  style={{ margin: '24px 16px', padding: 24, minHeight: 800, position: 'relative' }}
>
  <h1 style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '16px' }}>
    GESTION DU PERSONNEL UCCLE
  </h1>

  {/* Le tableau reste toujours en arrière-plan */}
  <div style={{ 
    position: 'absolute', 
    top: 0, 
    left: 0, 
    width: '100%', 
    height: '100%', 
    zIndex: 1 
  }}>
    <Tableau />
  </div>

  {/* Les autres composants se superposent au tableau */}
  {activeComponent === 'addMemberForm' && (
    <div 
      style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        zIndex: 2, 
       // backgroundColor: 'rgba(255, 255, 255, 0.9)' // Optionnel : ajoute un fond blanc translucide
      }}
    >
      <AddMemberForm onClose={() => setActiveComponent('tableau')} />
    </div>
  )}

  {activeComponent === 'statistics' && (
    <div 
      style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        zIndex: 2
        // backgroundColor: 'rgba(255, 255, 255, 0.9)' // Optionnel : ajoute un fond blanc translucide
      }}
    >
      <Statistics />
    </div>
  )}

  {activeComponent === 'archiveList' && (
    <div 
      style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        zIndex: 2 
        // backgroundColor: 'rgba(255, 255, 255, 0.9)' // Optionnel : ajoute un fond blanc translucide
      }}
    >
      <ArchiveList />
    </div>
  )}

  {activeComponent === 'export' && (
    <div 
      style={{ 
        position: 'absolute', 
        top: 0, 
        left: 0, 
        width: '100%', 
        height: '100%', 
        zIndex: 2 
        // backgroundColor: 'rgba(255, 255, 255, 0.9)' // Optionnel : ajoute un fond blanc translucide
      }}
    >
      <Export personnes={personnes} />
    </div>
  )}
</Content>


      </Layout>

      <style>{`
        .ant-menu-item:hover {
          background-color: #7498B2 !important;
        }

        .ant-menu-item a:hover {
          color: #ffffff !important;
        }

        .ant-menu-item-selected {
          background-color: #001529 !important;
        }

        .trigger:hover {
          color: #7498B2 !important;
        }
      `}</style>
    </Layout>
  );
};

export default Home;
