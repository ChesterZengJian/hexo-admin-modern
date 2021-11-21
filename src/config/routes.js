import {
    UserOutlined,
    VideoCameraOutlined,
} from "@ant-design/icons";

const routes = [
    {
        name: "Posts",
        url: "/",
        icon: <UserOutlined />,
    },
    {
        name: "Categories",
        url: "/categories",
        icon: <VideoCameraOutlined />,
    }
];

export default routes;