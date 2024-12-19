import React, { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  PieChartOutlined,
  TableOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Button } from 'antd';
import AddMemberForm from './AddMemberForm'; 
import Tableau from '../components/Tableau'
import Statistics from './Statistics'; 
import logo from '../assets/logo_white.png';

const { Header, Sider, Content } = Layout;

const Home = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeComponent, setActiveComponent] = useState('tableau'); 

  const openForm = () => setActiveComponent('addMemberForm');
  const openTableau = () => setActiveComponent('tableau');
  const openStatistics = () => setActiveComponent('statistics');

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
                  Tableau
                </Button>
              ),
            },
            {
              key: '2',
              icon: <UserOutlined />,
              label: (
                <Button type="link" onClick={openForm} style={{ color: '#fff' }}>
                  Ajouter membre
                </Button>
              ),
            },
            {
              key: '3',
              icon: <PieChartOutlined />, 
              label: (
                <Button type="link" onClick={openStatistics} style={{ color: '#fff' }}>
                  Statistiques
                </Button>
              ),
            },
            {
              key: '4',
              icon: <UploadOutlined />,
              label: 'Archives',
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
        <Content
           className="site-layout-background"
           style={{
             margin: '24px 16px',
             padding: 24,
             minHeight: 800,
             position: 'relative',
             zIndex: 1,
           }}
        >
        <h1 style={{ position: 'fixe', zIndex: 3, textAlign: 'center', fontWeight: 'bold' }}>GESTION DU PERSONNEL UCCLE</h1>
          <Tableau/>
          {activeComponent === 'addMemberForm' && (
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 2 }}>
              <AddMemberForm onClose={() => setActiveComponent('tableau')} />
            </div>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default Home;
