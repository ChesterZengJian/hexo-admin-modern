import React, { useState, useEffect } from "react";
import { Table, Space, Button } from "antd";
import { Link } from "react-router-dom";
import { postListColumns as columns, constants } from "../../config";
import { getPosts } from "../../services/postService";

export default function PostList() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        getPosts({
            currPage: constants.defaultCurrent - 1,
            pageSize: constants.defaultPageSize,
            sort: "date",
            order: constants.defaultPr
        }).then(function (posts) {
            setPosts(posts)
        });
    }, [])

    const onChange = (pagination, filters, sorter) => {
        console.log("pagination:")
        console.log(pagination)
        console.log("sorter:")
        console.log(sorter)
        console.log("filter:")
        console.log(filters)

        getPosts({
            currPage: pagination.current,
            pageSize: pagination.pageSize,
            sort: "date",
            order: sorter.order === "ascend" ? 0 : -1
        }).then(function (posts) {
            setPosts(posts)
        });
    }

    return (
        <>
            <Space align="center" wrap>
                <Button type="primary">
                    <Link to="/categories">Categories</Link>
                </Button>
            </Space>
            <Table
                dataSource={posts}
                columns={columns}
                pagination={{
                    position: ["bottomCenter"],
                    defaultCurrent: constants.defaultCurrent,
                    defaultPageSize: constants.defaultPageSize
                }}
                scroll={{ y: "77vh" }}
                rowKey="_id"
                onChange={onChange}
            />
        </>
    )
}
