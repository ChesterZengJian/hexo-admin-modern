import {
    Card,
    Breadcrumb,
    Form,
    Button,
    Input,
    Space,
    Select,
    message,
    Divider,
    Row,
    Col,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import './index.scss';
import { useStore } from '@/stores';
import { useEffect, useState, useRef } from 'react';
import { http } from '@/utils';
import MdEditor from '@/components/MdEditor';
const { Option } = Select;

let categoryItemIdx = 0;
const PostEdit = () => {
    const { categoryStore, tagStore } = useStore();
    const [published, setPublished] = useState(false);

    // 路由参数id
    const params = useParams();
    const id = params.id;
    const autosaveId = id || 'a7a78ce1-941c-4337-bb39-d79c15c2709a';
    const autosaveItemKey = `smde_${autosaveId}`;

    // 提交表单
    const navigate = useNavigate();
    const onFinish = async (values) => {
        console.log('finish val: ', values);
        // 数据的二次处理 重点是处理cover字段
        const { title, categories, tags, _content } = values;
        const params = {
            title,
            categories: [categories],
            tags,
            _content,
        };

        if (id) {
            await http.put(`/admin/api/posts/${id}`, params);
        } else {
            await http.post('/admin/api/posts', params);
            navigate('/');
        }

        localStorage.removeItem(autosaveItemKey);
        message.success(`${id ? '更新成功' : '创建成功'}`);
    };

    // 发布文章
    const publishPost = async () => {
        if (published) {
            await http.put(`/admin/api/posts/${id}/unpublish`);
            setPublished(false);
        } else {
            await http.put(`/admin/api/posts/${id}/publish`);
            setPublished(true);
        }
    };

    // 设置文章类型
    const [categoryItems, setCategoryItems] = useState([]);
    const [categoryName, setCategoryName] = useState('');
    const inputRef = useRef(null);
    const onCategoryNameChange = (event) => {
        setCategoryName(event.target.value);
    };
    const addItem = (e) => {
        e.preventDefault();

        if (!categoryName) {
            return;
        }

        setCategoryItems([
            ...categoryItems,
            { _id: categoryItemIdx++, name: categoryName },
        ]);
        setCategoryName('');
        setTimeout(() => {
            inputRef.current?.focus();
        }, 0);
    };

    useEffect(() => {
        setCategoryItems(categoryStore.categoryList);
    }, [categoryStore.categoryList]);

    // 数据回填  id调用接口  1.表单回填 2.暂存列表 3.Upload组件fileList
    const [form] = Form.useForm();
    useEffect(() => {
        const loadDetail = async () => {
            const res = await http.get(`/admin/api/posts/${id}`);
            console.log(res.data);
            const data = res.data;
            setPublished(res.data.published);
            // 表单数据回填
            form.setFieldsValue({ ...data });
        };

        // 必须是编辑状态 才可以发送请求
        if (id) {
            loadDetail();
        }
    }, [id, form]);

    return (
        <div className="publish">
            <Card
                title={
                    <Breadcrumb separator=">">
                        <Breadcrumb.Item>
                            <Link to="/">首页</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            {id ? '编辑' : '创建'}文章
                        </Breadcrumb.Item>
                    </Breadcrumb>
                }
            >
                <Form
                    labelCol={{ span: 2 }}
                    wrapperCol={{ span: 20 }}
                    initialValues={{ type: 1, content: '' }}
                    onFinish={onFinish}
                    form={form}
                >
                    <Form.Item
                        label="标题"
                        name="title"
                        rules={[{ required: true, message: '请输入文章标题' }]}
                    >
                        <Input placeholder="请输入文章标题" />
                    </Form.Item>
                    <Form.Item
                        label="类型"
                        name="categories"
                        rules={[{ required: true, message: '请选择文章类型' }]}
                    >
                        <Select
                            placeholder="请选择文章类型"
                            dropdownRender={(menu) => (
                                <>
                                    {menu}
                                    <Divider
                                        style={{
                                            margin: '8px 0',
                                        }}
                                    />
                                    <Row style={{ margin: '0 8px 4px' }}>
                                        <Col xs={16} sm={14} md={19} lg={21}>
                                            <Input
                                                placeholder="Please enter item"
                                                ref={inputRef}
                                                value={categoryName}
                                                onChange={onCategoryNameChange}
                                            />
                                        </Col>
                                        <Col xs={8} sm={10} md={5} lg={2}>
                                            <Button
                                                type="text"
                                                icon={<PlusOutlined />}
                                                onClick={addItem}
                                            >
                                                Add item
                                            </Button>
                                        </Col>
                                    </Row>
                                </>
                            )}
                        >
                            {categoryItems.map((item) => (
                                <Option key={item._id} value={item.name}>
                                    {item.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item label="标签" name="tags">
                        <Select
                            placeholder="请选择文章标签"
                            mode="tags"
                            allowClear
                        >
                            {tagStore.tagList.map((item) => (
                                <Option key={item._id} value={item.name}>
                                    {item.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    {/* 这里的富文本组件 已经被Form.Item控制 */}
                    {/* 它的输入内容 会在onFinished回调中收集起来 */}
                    <Form.Item
                        label="内容"
                        name="_content"
                        rules={[{ required: true, message: '请输入文章内容' }]}
                    >
                        <MdEditor
                            autosaveId={autosaveId}
                            autosaveItemKey={autosaveItemKey}
                        />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 4 }}>
                        <Space>
                            <Button
                                size="large"
                                type="primary"
                                htmlType="submit"
                            >
                                {id ? '更新' : '创建'}文章
                            </Button>
                            {id ? (
                                <Button
                                    size="large"
                                    type="primary"
                                    onClick={publishPost}
                                >
                                    {published ? '不发布' : '发布'}文章
                                </Button>
                            ) : (
                                ''
                            )}
                        </Space>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default observer(PostEdit);