import { Button, Col, Row, Form, Input, Select, Divider, Space, message } from "antd"
import { Link, useNavigate, useParams } from "react-router-dom"
import { Mdeditor } from "../../components/editor"
import { createPost, editPost, getPost } from "../../services/postService";
import { PlusOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from "react";
import { getCategories } from "../../services/categoryService";
import { getTags } from "../../services/tagService";

export default function PostCreate() {
    const [form] = Form.useForm();
    const [post, setPost] = useState({});
    const [tags, setTags] = useState([]);
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [isSaving, SetIsSaving] = useState(false);
    const navigate = useNavigate();
    const { Option } = Select;

    let { id } = useParams();

    const submitButton = useRef(null);

    useEffect(() => {
        getCategories().then((res) => {
            setCategories(res.data);
            console.log("categories:", res)
        });

        getTags().then((res) => {
            setTags(res.data);
        });

        if (id) {
            getPost(id).then((res) => {
                console.log("Post:", res)
                setPost(res);
                form.setFieldsValue({
                    title: res.title,
                    content: res._content,
                    category: (res.categories && res.categories[0]) || "",
                    tags: res.tags
                })
            })
        }
    }, [])

    const onFinish = (values) => {
        SetIsSaving(true);
        console.log('Received values of form: ', values);
        let param = {
            title: values.title,
            categories: [values.category],
            tags: values.tags,
            _content: post._content
        };
        if (post._id) {
            editPost(post._id, param).then((res) => {
                saveSuccessfully();

                // console.log("edit success:", res);
            });
            return;
        }
        createPost(param).then(function (res) {
            setPost(res.data);
            saveSuccessfully();

            // console.log("create successfullty:", res)
            // navigate("/posts", { replace: true });
        })
    };

    const saveSuccessfully = () => {
        SetIsSaving(false);
        message.success("Save successfully")
    }

    const getTagOptions = () => {
        let tagOptions = [];
        for (let i = 0; i < tags.length; i++) {
            tagOptions.push(<Option key={tags[i].name}>{tags[i].name}</Option>);
        }
        return tagOptions;
    }

    const getCategoryOptions = () => {
        let categoryOptions = [];
        for (let i = 0; i < categories.length; i++) {
            categoryOptions.push(<Option key={categories[i].name}>{categories[i].name}</Option>)
        }
        return categoryOptions;
    }

    const tagsSelectorHandleChange = (value) => {
        console.log(`selected ${value}`);
    }

    const onNameChange = event => {
        setNewCategory(event.target.value)
        console.log("event.target.value=", event.target.value)
    };

    const addCategoryOption = () => {
        console.log('addItem:', newCategory);

        categories.push({ name: newCategory })
        setCategories(categories);
        setNewCategory('');
    };

    const submitComponent = () => {
        return (
            <Space>
                <Button ref={submitButton} display={post._id} type="primary" htmlType="submit" loading={isSaving} disabled={isSaving}>
                    Save
                </Button>
            </Space>
        )
    }

    const onContentChange = (val) => {
        post._content = val;
        setPost(post)
    }

    const onSubmit = () => {
        submitButton.current.click();
    }

    return (
        <>
            <Form
                name="post_form"
                form={form}
                onFinish={onFinish}>
                <Row gutter={24}>
                    <Col span={1}>
                        <Form.Item>
                            {submitComponent()}
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
                            initialValue={post.title}
                            value={post.title}
                        >
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
                                placeholder="select the category"
                                dropdownRender={menu => (
                                    <div>
                                        {menu}
                                        <Divider style={{ margin: '4px 0' }} />
                                        <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                                            <Input style={{ flex: 'auto' }} value={newCategory} onChange={onNameChange} />
                                            <Button
                                                type="link"
                                                onClick={addCategoryOption}
                                            >
                                                <PlusOutlined />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            >
                                {getCategoryOptions()}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={7} offset={1}>
                        <Form.Item name={"tags"} label={"Tag"}>
                            <Select mode="tags"
                                placeholder="select the tags"
                                onChange={tagsSelectorHandleChange}>
                                {getTagOptions()}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        <Mdeditor
                            id={post?._id}
                            value={post?._content}
                            onChange={onContentChange}
                            onSave={onSubmit}
                        />
                    </Col>
                </Row>
            </Form>
        </>
    )
}