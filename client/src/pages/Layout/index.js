import { Layout, Menu, Popconfirm } from 'antd';
import {
    HomeOutlined,
    DiffOutlined,
    LogoutOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/stores';
import './index.scss';
import { useEffect } from 'react';

const { Header, Sider } = Layout;

const DefaultLayout = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { categoryStore, tagStore, loginStore } = useStore();

    useEffect(() => {
        categoryStore.loadCategoryList();
        tagStore.loadTagList();
    }, [categoryStore, tagStore]);

    const onConfirm = () => {
        loginStore.loginOut();
        navigate('/login');
    };

    const getMenuItem = (label, key, icon, children, type) => {
        return {
            key,
            icon,
            children,
            label,
            type,
        };
    };

    const menuItems = [
        getMenuItem(<Link to="/">Posts</Link>, '/', <HomeOutlined />),
        getMenuItem(<Link to="/tags">Tags</Link>, '/tags', <DiffOutlined />),
    ];

    return (
        <Layout>
            <Header className="header">
                <div className="logo"></div>
                <div className="user-info">
                    <span className="user-icon">
                        <UserOutlined />
                    </span>
                    <span className="user-name">admin</span>
                    <span className="user-logout">
                        <Popconfirm
                            title="您确定登出吗？"
                            okText="是的"
                            cancelText="取消"
                            onConfirm={onConfirm}
                        >
                            <LogoutOutlined />
                        </Popconfirm>
                    </span>
                </div>
            </Header>
            <Layout>
                <Sider
                    width={200}
                    className="site-layout-background"
                    collapsible
                    breakpoint='xl'
                >
                    <Menu
                        mode="inline"
                        theme="dark"
                        defaultSelectedKeys={pathname}
                        selectedKeys={pathname}
                        style={{ height: '100%', borderRight: 0 }}
                        items={menuItems}
                    />
                </Sider>
                <Layout className="layout-content" style={{ padding: 20 }}>
                    <Outlet />
                </Layout>
            </Layout>
        </Layout>
    );
};

export default observer(DefaultLayout);
