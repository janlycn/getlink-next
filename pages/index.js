import React, {
  useCallback,
  useState,
} from 'react';
import { Layout, Popover, Menu, Avatar, Dropdown, Button } from 'antd';
import {
  QrcodeOutlined,
  FileImageOutlined,
  FileOutlined,
  VideoCameraOutlined,
  ContainerOutlined,
  LinkOutlined,
  InfoCircleTwoTone,
} from '@ant-design/icons';

import HTMLHead from '../components/HTMLHead';
import Uploader from '../components/Uploader';
import QRCode from '../components/QRCode';
import ShortUrl from '../components/ShortUrl';
import Placeholder from '../components/Placeholder';

import auth0 from '../utils/auth0';

import 'antd/dist/antd.css';
import './index.css';

const { Header, Sider, Content } = Layout;

const App = ({ user, isAdmin }) => {
  const [type, setType] = useState('image');

  const handleTypeChange = useCallback((e) => {
    setType(e.key);
  }, []);

  return (
    <Layout style={{ height: '100%', flexDirection: 'row' }}>
      <HTMLHead />
      <Sider
        breakpoint="lg"
        collapsedWidth={0}
      >
        <a className="logo" href="https://github.com/int64ago/getlink-next" target="_blank">
          Get Link!
        </a>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[type]}
          onClick={handleTypeChange}
        >
          <Menu.Item key="image">
            <FileImageOutlined />IMAGE
          </Menu.Item>
          <Menu.Item key="video">
            <VideoCameraOutlined />VIDEO
          </Menu.Item>
          <Menu.Item key="file">
            <FileOutlined />FILE
          </Menu.Item>
          <Menu.Item key="placeholder">
            <ContainerOutlined />Placeholder
          </Menu.Item>
          <Menu.Item key="qrcode">
            <QrcodeOutlined />QR Code
          </Menu.Item>
          <Menu.Item key="urlshorten">
            <LinkOutlined />URL Shortener
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout style={{ background: '#fff' }}>
        <Header>
          {user ? (
            <Dropdown overlay={(
              <Menu>
                <Menu.Item>
                  <a href="/api/logout">Logout</a>
                </Menu.Item>
              </Menu>
            )}>
              <Avatar src={user.picture} />
            </Dropdown>
          ) : (
            <div>
              <Button type="link" href="/api/login">Login</Button>
              <Popover placement="left" content="There's no SLA guarantee for non-login user.">
                <InfoCircleTwoTone />
              </Popover>
            </div>
          )}
        </Header>
        <Content
              style={{
                padding: 24,
                height: '100%',
                background: '#fff'
              }}
        >
          {type === 'image' && <Uploader isAdmin={isAdmin} user={user} type="image" />}
          {type === 'video' && <Uploader isAdmin={isAdmin} user={user} type="video" />}
          {type === 'file' && <Uploader isAdmin={isAdmin} user={user} type="file" />}
          {type === 'qrcode' && <QRCode />}
          {type === 'urlshorten' && <ShortUrl />}
          {type === 'placeholder' && <Placeholder />}
        </Content>
      </Layout>
    </Layout>
  );
};

App.getInitialProps = async ({ req, res }) => {
  if (typeof window === 'undefined') {
    const { adminUser } = require('../utils/av');
    const { user } = await auth0.getSession(req) || {};
    const isAdmin = await adminUser(user && user.sub);
    return { user, isAdmin };
  }
};

export default App;
