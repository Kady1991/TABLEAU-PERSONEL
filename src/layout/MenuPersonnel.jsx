import React from 'react';
import { DownOutlined, SettingOutlined } from '@ant-design/icons';
import { Dropdown, Space } from 'antd';
import Export from './Export';
import ArchiveList from './ArchiveList';
import Statistics from './Statistics';
import AddMemberForm from './AddMemberForm';

const MenuPersonnel = () => {

  const items = [

    {
      key: '1',
      label: (
        <div onClick={(e) => e.stopPropagation()}>
          <AddMemberForm />
        </div>
      )
    },

    {
      key: '2',
      label: <ArchiveList className="archive" />
    },
    {
      key: '3',
      label: <Export personnes={[]} columns={[]} className="button" />
    },
    {
      key: '4',
      label: <Statistics data={[]} />
    },

    {
      type: 'divider',
    },
    // {
    //   key: '5',
    //   label: 'Settings',
    //   icon: <SettingOutlined />, 
    // },
  ];

  return (
    <div>
      <Dropdown
        menu={{ items }}
        trigger={['click']}
        overlayStyle={{ minWidth: 200 }}
      >
        <a onClick={(e) => e.preventDefault()}>
          <Space style={{ color: 'white' }}>
            Menu
            <DownOutlined />
          </Space>
        </a>
      </Dropdown>
    </div>
  );
};

export default MenuPersonnel;
