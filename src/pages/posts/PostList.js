import React, { useState, useEffect } from "react";
import { Table, Space, Button } from "antd";
import { Link } from "react-router-dom";
import { postListColumns as columns } from "../../config";
import { getPosts } from "../../services/postService";

export default function PostList() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        getPosts().then(function (posts) {
            setPosts(posts)
        });
    }, [])

    return (
        <>
            <Space align="center" wrap>
                <Button type="primary">
                    <Link to="/categories">Categories</Link>
                </Button>
            </Space>
            <Table style={{ minHeight: "77vh" }}
                dataSource={posts}
                columns={columns}
                pagination={{
                    position: ["bottomCenter"],
                }}
                scroll={{ y: "77vh" }}
                rowKey="_id"
            />
        </>
    )
}