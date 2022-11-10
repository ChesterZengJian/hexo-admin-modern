import { Card, Form, Input, Button, message, Space } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '@/stores';
import logo from '@/assets/logo.svg';
import './index.scss';

function Login() {
    const { loginStore } = useStore();
    const navigate = useNavigate();

    async function onFinish(values) {
        // values：放置的是所有表单项中用户输入的内容
        // todo:登录
        const { username, password } = values;
        try {
            await loginStore.login({ username, password });
        } catch (error) {
            message.error('登录失败');
            return;
        }

        // 跳转首页
        navigate('/', { replace: true });
        // 提示用户
        message.success('登录成功');
    }

    return (
        <div className="login">
            <Card className="login-container">
                <img className="login-logo" src={logo} alt="logo" />
                <Form
                    validateTrigger={['onBlur', 'onChange']}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: '请输入用户名',
                            },
                        ]}
                    >
                        <Input size="large" placeholder="请输入用户名" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: '请输入密码',
                            },
                        ]}
                    >
                        <Input
                            type="password"
                            size="large"
                            placeholder="请输入密码"
                        />
                    </Form.Item>
                    <Form.Item>
                        <Space className="login-form-new-account">
                            <Link to="/accounts/new">创建新账号</Link>
                        </Space>
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            block
                        >
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}

export default Login;
