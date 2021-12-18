import React from "react";
import { Tag, Space, Button } from "antd";
import { Link } from "react-router-dom";
import { formateDate } from "../../services/common/formatService";
import { removePost } from "../../services/postService";

const postListColumns = [
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
        render: (post) => (
            <>
                <Space split="|" wrap>
                    <Link to="/">Edit</Link>
                    <Button type="link" danger onClick={() => {
                        removePost(post._id).then(function (res) {
                            console.log(res);
                        })
                    }}>
                        {/* <Link to={"/posts/" + post._id+"/remove"}>Delete {post._id}</Link> */}
                        Delete
                    </Button>
                </Space>
            </>
        ),
    },
];

export default postListColumns;