import './index.scss';
import dateFormat from 'dateformat';
import { Link, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import {
    Table,
    Divider,
    Space,
    Card,
    Breadcrumb,
    Form,
    Button,
    Radio,
    Input,
} from 'antd';
import 'moment/locale/zh-cn';
import { useEffect, useState } from 'react';
import { http } from '@/utils';

const PostList = () => {
    // 文章列表管理 统一管理数据 将来修改给setArticleData传对象
    const [articleData, setArticleData] = useState({
        list: [], // 文章列表
        count: 0, // 文章数量
    });

    // 文章参数管理
    const [params, setParams] = useState({
        isDiscarded: 0,
        isPublished: 0,
        sort: 'date',
        order: 0,
        curPage: 1,
        pageSize: 10,
    });

    // 获取文章列表
    useEffect(() => {
        const loadPostList = async () => {
            const res = await http.get('/admin/api/posts', { params });
            const { data, total } = res.data;
            setArticleData({
                list: data || [],
                count: total || 0,
            });
        };
        loadPostList();
    }, [params]);

    /* 表单筛选功能实现 */
    const onFinish = (values) => {
        const { isPublished, isDiscarded, title } = values;
        // 数据处理
        const _params = {};
        // 格式化status
        _params.isPublished = isPublished;
        _params.isDiscarded = isDiscarded;
        _params.title = title;

        // 修改params数据 引起接口的重新发送 对象的合并是一个整体覆盖 改了对象的整体引用
        setParams({
            ...params,
            ..._params,
        });
    };
    // 翻页实现
    const pageChange = (curPage, pageSize) => {
        setParams({
            ...params,
            curPage: curPage,
            pageSize: pageSize,
        });
    };

    // 删除文章
    const deletePost = async (data) => {
        await http.delete(`/admin/api/posts/${data._id}`);
        // 刷新一下列表
        setParams({
            ...params,
            curPage: 1,
        });
    };

    // 编辑文章
    const navigate = useNavigate();
    const editPost = (data) => {
        navigate(`/posts/${data._id}`);
    };
    const publishPost = (data) => {
        navigate(`/publish?id=${data._id}`);
    };

    const columns = [
        {
            title: '标题',
            dataIndex: 'title',
            width: 220,
        },
        {
            title: '标签',
            dataIndex: 'tags',
        },
        {
            title: '类别',
            dataIndex: 'categories',
        },
        {
            title: '创建时间',
            dataIndex: 'date',
            render: (data) => dateFormat(data, 'yyyy-mm-dd hh:MM:ss '),
        },
        {
            title: '更新时间',
            dataIndex: 'updated',
            render: (data) => dateFormat(data, 'yyyy-mm-dd hh:MM:ss '),
        },
        {
            title: '操作',
            render: (data) => {
                return (
                    <Space size="middle" split={<Divider type="vertical" />}>
                        <Button
                            type="link"
                            title="Edit"
                            onClick={() => editPost(data)}
                        >
                            Edit
                        </Button>
                        <Button
                            type="link"
                            title="Publish"
                            onClick={() => publishPost(data)}
                        >
                            Publish
                        </Button>
                        <Button
                            type="link"
                            danger
                            onClick={() => deletePost(data)}
                        >
                            Delete
                        </Button>
                    </Space>
                );
            },
            fixed: 'right',
        },
    ];

    return (
        <div>
            {/* 筛选区域 */}
            <Card
                title={
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item>
                            <Link to="/home">首页</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>内容管理</Breadcrumb.Item>
                    </Breadcrumb>
                }
                style={{ marginBottom: 20 }}
            >
                <Form
                    onFinish={onFinish}
                    initialValues={{ isPublished: 0, isDiscarded: 0 }}
                >
                    <Form.Item label="搜索" name="title">
                        <Input placeholder="请输入标题" />
                    </Form.Item>
                    <Form.Item label="是否发布" name="isPublished">
                        <Radio.Group>
                            <Radio value={0}>全部</Radio>
                            <Radio value={1}>已发布</Radio>
                            <Radio value={2}>未发布</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item label="是否删除" name="isDiscarded">
                        <Radio.Group>
                            <Radio value={0}>未删除</Radio>
                            <Radio value={1}>已删除</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            style={{ marginLeft: 80 }}
                        >
                            筛选
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
            {/* 文章列表区域 */}
            <Card title={`根据筛选条件共查询到 ${articleData.count} 条结果：`}>
                <Table
                    rowKey="_id"
                    columns={columns}
                    dataSource={articleData.list}
                    pagination={{
                        pageSize: params.pageSize,
                        total: articleData.count,
                        onChange: pageChange,
                        current: params.curPage,
                    }}
                    bordered
                />
            </Card>
        </div>
    );
};

export default observer(PostList);
