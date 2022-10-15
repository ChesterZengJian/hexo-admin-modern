import {
    Card,
    Breadcrumb,
    Form,
    Button,
    Input,
    Space,
    Select,
    message,
} from 'antd';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import './index.scss';
import { useStore } from '@/stores';
import { useEffect } from 'react';
import { http } from '@/utils';
import MdEditor from '@/components/MdEditor';
const { Option } = Select;
const PostEdit = () => {
    const { categoryStore } = useStore();

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

        message.success(`${id ? '更新成功' : '创建成功'}`);
    };

    // 编辑功能
    // 文案适配  路由参数id 判断条件
    const params = useParams();
    const id = params.id;
    // 数据回填  id调用接口  1.表单回填 2.暂存列表 3.Upload组件fileList
    const [form] = Form.useForm();
    useEffect(() => {
        const loadDetail = async () => {
            const res = await http.get(`/admin/api/posts/${id}`);
            console.log(res.data);
            const data = res.data;
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
                            <Link to="/home">首页</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            {id ? '编辑' : '创建'}文章
                        </Breadcrumb.Item>
                    </Breadcrumb>
                }
            >
                <Form
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 16 }}
                    initialValues={{ type: 1, content: '' }}
                    onFinish={onFinish}
                    form={form}
                >
                    <Form.Item
                        label="标题"
                        name="title"
                        rules={[{ required: true, message: '请输入文章标题' }]}
                    >
                        <Input
                            placeholder="请输入文章标题"
                            style={{ width: 400 }}
                        />
                    </Form.Item>
                    <Form.Item
                        label="类型"
                        name="categories"
                        rules={[{ required: true, message: '请选择文章类型' }]}
                    >
                        <Select
                            placeholder="请选择文章类型"
                            style={{ width: 400 }}
                        >
                            {categoryStore.categoryList.map((item) => (
                                <Option key={item._id} value={item.name}>
                                    {item.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item label="标签" name="tags">
                        <Select
                            placeholder="请选择文章标签"
                            style={{ width: 400 }}
                        >
                            {categoryStore.categoryList.map((item) => (
                                <Option key={item._id} value={item._id}>
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
                        <MdEditor />
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
                        </Space>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
};

export default observer(PostEdit);
