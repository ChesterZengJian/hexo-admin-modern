import React, { useState, useEffect } from "react";
import { Table, Space, Button, Tag, Input } from "antd";
import { SyncOutlined } from '@ant-design/icons';
import { Link } from "react-router-dom";
import { consts } from "../../config";
import { getPosts, publishPost, removePost, unpublishPost } from "../../services/postService";
import { formateDate } from "../../services/common/formatService";

export default function PostList() {
    const [queryPostsParam, setQueryPostsParam] = useState({
        isDiscarded: 0,
        title: '',
        currPage: consts.defaultCurrent,
        pageSize: consts.defaultPageSize,
        sort: "date",
        order: consts.defaultOrder
    })
    const [posts, setPosts] = useState([]);
    const [postTotal, setPostTotal] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
    const [searching, setSearching] = useState(false);

    useEffect(() => {
        getPosts(queryPostsParam).then(function (posts) {
            console.log(posts)
            setPostList(posts);
        });
    }, [queryPostsParam])

    const refresh = () => {
        setRefreshing(true);
        getPosts(queryPostsParam).then(function (posts) {
            setPostList(posts);
            setRefreshing(false);
        });
    };

    const onChange = (pagination, filters, sorter) => {
        console.log("pagination:")
        console.log(pagination)
        console.log("sorter:")
        console.log(sorter)
        console.log("filter:")
        console.log(filters)

        queryPostsParam.currPage = pagination.current;
        queryPostsParam.pageSize = pagination.pageSize;
        queryPostsParam.sort = sorter.column ? sorter.field : "date";
        queryPostsParam.order = sorter.order === "ascend" ? 1 : -1;

        getPosts(queryPostsParam).then(function (posts) {
            setQueryPostsParam(queryPostsParam);
            setPostList(posts);
        });

        // getPosts({
        //     isDiscarded: 0,
        //     currPage: pagination.current,
        //     pageSize: pagination.pageSize,
        //     sort: sorter.column ? sorter.field : "date",
        //     order: sorter.order === "ascend" ? 1 : -1
        // }).then(function (posts) {
        //     setPostList(posts);
        // });
    }

    const setPostList = function (posts) {
        setPosts(posts.data)
        setPostTotal(posts.total)
    }

    const columns = [
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
            responsive: ["xs", "md", "lg"],
            sorter: true
        },
        {
            title: "Category",
            dataIndex: "categories",
            key: "categories",
            ellipsis: true
        },
        {
            title: "Tags",
            key: "tags",
            dataIndex: "tags",
            render: (tags) => (
                <>
                    {tags.map((tag) => {
                        let color = tag.length > 5 ? "geekblue" : "green";
                        if (tag === "loser") {
                            color = "volcano";
                        }
                        return (
                            <Tag color={color} key={tag}>
                                {tag.toUpperCase()}
                            </Tag>
                        );
                    })}
                </>
            ),
        },
        {
            title: "Created",
            dataIndex: "date",
            key: "date",
            render: formateDate,
            sorter: true
        },
        {
            title: "Updated",
            dataIndex: "updated",
            key: "updated",
            render: formateDate,
            sorter: true
        },
        {
            title: "Action",
            dataIndex: "",
            key: "act",
            render: (text, post) => (
                <>
                    <Space split="|" wrap>
                        <Button type="link" onClick={() => {
                            console.log("text=", text)
                            if (post.isDraft) {
                                publishPost(post._id).then(function (res) {
                                    refresh();
                                })
                                return;
                            }
                            unpublishPost(post._id).then(function (res) {
                                refresh();
                            });
                        }}>
                            {post.isDraft ? "Publish" : "Draft"}
                        </Button>
                        <Link to={"/posts/" + post._id}>Edit</Link>
                        <Button disabled={!post.isDraft} type="link" danger onClick={() => {
                            removePost(post._id).then(function (res) {
                                console.log(res);
                                refresh();
                            })
                        }}>
                            Delete
                        </Button>
                    </Space>
                </>
            ),
        },
    ];

    const { Search } = Input;
    const onSearch = value => {
        setSearching(true);
        queryPostsParam.title = value;
        getPosts(queryPostsParam).then(function (posts) {
            setPostList(posts);
            setSearching(false);
        });
    };
    return (
        <>
            <Space align="center" wrap>
                <Button type="primary">
                    <Link to="/posts/create">Create</Link>
                </Button>
                <Search placeholder="input search text" allowClear onSearch={onSearch} loading={searching} />
                <Button onClick={() => { refresh(); }}>
                    <SyncOutlined spin={refreshing} />
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
