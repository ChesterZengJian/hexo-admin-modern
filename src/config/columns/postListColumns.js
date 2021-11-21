import React from "react";
import { Tag, Space } from "antd";
import { Link } from "react-router-dom";
import { formateDate } from "../../services/common/formatService";

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
        render: () => (
            <>
                <Space split="|" wrap>
                    <Link to="/">Edit</Link>
                    <Link to="/">Delete</Link>
                </Space>
            </>
        ),
    },
];

export default postListColumns;