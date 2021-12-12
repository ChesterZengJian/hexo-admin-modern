import { Button, Col, Row, Form, Input, Select, Divider } from "antd"
import { Link } from "react-router-dom"
import { Mdeditor } from "../../components/editor"
import { createPost } from "../../services/postService";
import { PlusOutlined } from '@ant-design/icons';


export default function PostCreate() {
    const [form] = Form.useForm();

    const onFinish = (values) => {
        console.log('Received values of form: ', values);
        createPost({
            title: values.title,
            categories: [values.category],
            tags: values.tags,
            content: values.content
        }).then(function (res) {
            console.log("successfully")
            console.log(res)
        })
    };

    const { Option } = Select;
    const children = [];

    for (let i = 10; i < 36; i++) {
        children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
    }

    const handleChange = (value) => {
        console.log(`selected ${value}`);
    }

    const state = {
        items: ['jack', 'lucy'],
        name: '',
    };

    let index = 0;
    const onNameChange = event => {
        // this.setState({
        //     name: event.target.value,
        // });
    };

    const addItem = () => {
        console.log('addItem');
        // const { items, name } = this.state;
        // this.setState({
        //     items: [...items, name || `New item ${index++}`],
        //     name: '',
        // });
    };

    return (
        <>
            <Form
                name="post_form"
                form={form}
                onFinish={onFinish}>
                <Row gutter={24}>
                    <Col span={1}>
                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Create
                            </Button>
                        </Form.Item>
                    </Col>
                    <Col offset={22} span={1}>
                        <Form.Item>
                            <Button style={{ float: "right" }} type="primary" danger>
                                <Link to="/posts">Cancel</Link>
                            </Button>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={7}>
                        <Form.Item name={"title"} label={"Title"}
                            rules={[
                                {
                                    required: true,
                                    message: "'Title' is required"
                                }
                            ]}
                            initialValue={"Hello"}>
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={7} offset={1}>
                        <Form.Item name={"category"} label={"Category"}
                            rules={[
                                {
                                    required: true,
                                    message: "'Category' is required"
                                }
                            ]}>
                            <Select
                                // placeholder="select the category"
                                dropdownRender={menu => (
                                    <div>
                                        {menu}
                                        <Divider style={{ margin: '4px 0' }} />
                                        <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                                            <Input style={{ flex: 'auto' }} value={state.name} onChange={onNameChange} />
                                            <a
                                                style={{ flex: 'none', padding: '8px', display: 'block', cursor: 'pointer' }}
                                                onClick={addItem}
                                            >
                                                <PlusOutlined />
                                            </a>
                                        </div>
                                    </div>
                                )}
                            >
                                {state.items.map(item => (
                                    <Option key={item}>{item}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={7} offset={1}>
                        <Form.Item name={"tags"} label={"Tag"}>
                            <Select mode="tags" style={{ width: '100%' }}
                                onChange={handleChange}>
                                {children}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Form.Item name={"content"}>
                            <Mdeditor />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </>
    )
}