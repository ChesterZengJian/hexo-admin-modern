import {
    UserOutlined,
    VideoCameraOutlined,
} from "@ant-design/icons";

const routes = [
    {
        name: "Posts",
        url: "/posts",
        icon: <UserOutlined />,
    },
    {
        name: "Categories",
        url: "/categories",
        icon: <VideoCameraOutlined />,
    }
];

export default routes;