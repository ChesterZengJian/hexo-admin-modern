import "./index.css";

import React, { useState, useEffect } from "react";
import { Layout, Menu } from "antd";
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
} from "@ant-design/icons";
import { Outlet, Link, useLocation } from "react-router-dom";
import { routes } from "../../config";

export default function DefaultLayout() {
    const [collapsed, setCollapsed] = useState(false);
    const [curPage, setCurPage] = useState([routes[0].key]);

    const { Header, Sider, Content } = Layout;

    const location = useLocation();

    useEffect(() => {
        if (location.pathname === "/" && routes[0] && routes[0].url) {
            setCurPage([routes[0].url + ""]);
            return;
        }
        setCurPage([location.pathname + ""]);
    }, [location.pathname]);

    const toggle = () => {
        setCollapsed(!collapsed);
    };

    const navList = getNavList();

    return (
        <Layout className="layout">
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="logo" />
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={curPage}
                    selectedKeys={curPage}
                >
                    {navList}
                </Menu>
            </Sider>
            <Layout className="site-layout">
                <Header className="site-layout-background" style={{ padding: 0 }}>
                    {React.createElement(
                        collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                        {
                            className: "trigger",
                            onClick: toggle,
                        }
                    )}
                </Header>
                <Content
                    className="site-layout-background"
                    style={{
                        margin: "24px 16px",
                        padding: 24,
                        minHeight: 280,
                    }}
                >
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
}

function getNavList() {
    return routes.map((item) => <Menu.Item
        key={item.url}
        icon={item.icon}
    >
        <Link to={item.url || item.key}>{item.name}</Link>
    </Menu.Item>
    );
}
