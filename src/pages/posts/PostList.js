import React, { useState, useEffect } from "react";
import { Table, Space, Button } from "antd";
import { Link } from "react-router-dom";
import { postListColumns as columns, consts } from "../../config";
import { getPosts } from "../../services/postService";

export default function PostList() {
    const [posts, setPosts] = useState([]);
    const [postTotal, setPostTotal] = useState(0);

    useEffect(() => {
        getPosts({
            isDiscarded: 0,
            currPage: consts.defaultCurrent,
            pageSize: consts.defaultPageSize,
            sort: "date",
            order: consts.defaultOrder
        }).then(function (posts) {
            console.log(posts)
            setPostList(posts);
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
            isDiscarded: 0,
            currPage: pagination.current,
            pageSize: pagination.pageSize,
            sort: sorter.column ? sorter.field : "date",
            order: sorter.order === "ascend" ? 1 : -1
        }).then(function (posts) {
            setPostList(posts);
        });
    }

    const setPostList = function (posts) {
        setPosts(posts.data)
        setPostTotal(posts.total)
    }

    return (
        <>
            <Space align="center" wrap>
                <Button type="primary">
                    <Link to="/posts/create">Create</Link>
                </Button>
            </Space>
            <Table
                dataSource={posts}
                columns={columns}
                pagination={{
                    position: ["bottomCenter"],
                    total: postTotal,
                    defaultCurrent: consts.defaultCurrent,
                    defaultPageSize: consts.defaultPageSize
                }}
                scroll={{ y: "77vh" }}
                rowKey="_id"
                onChange={onChange}
                rowClassName={(post) => {
                    if (post.isDraft)
                        return "post-draft";
                }}
            />
        </>
    )
}
