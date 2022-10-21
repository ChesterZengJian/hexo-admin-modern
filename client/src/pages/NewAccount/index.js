import { Card, Form, Input, Button, message } from 'antd';
import logo from '@/assets/logo.svg';
import './index.scss';
import { http } from '@/utils';

function NewAccount() {
    async function onFinish(values) {
        const { username, password, secret } = values;
        try {
            const res = await http.post('/admin/api/accounts', {
                username,
                password,
                secret,
            });
            console.log('res:', res.data);
        } catch (error) {
            message.error('生成账号失败');
            return;
        }

        // 生成账号弹窗
        // const success = () => {
        //     Modal.success({
        //         content: 'some messages...some messages...',
        //     });
        // };
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
                        <Input size="large" placeholder="请输入密码" />
                    </Form.Item>
                    <Form.Item
                        name="secret"
                        rules={[
                            {
                                required: true,
                                message: '请输入加密密钥',
                            },
                        ]}
                    >
                        <Input size="large" placeholder="请输入加密密钥" />
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            size="large"
                            block
                        >
                            生成账号密码
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}

export default NewAccount;
