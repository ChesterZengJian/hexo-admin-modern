import { Card, Form, Input, Button, message, Result, Typography } from 'antd';
import { useState } from 'react';
import { http } from '@/utils';
import logo from '@/assets/logo.svg';
import './index.scss';

function NewAccount() {
    const { Paragraph } = Typography;
    const [showResult, setShowResult] = useState(false);
    const [account, setAccount] = useState({});

    const onFinish = async (values) => {
        const { username, password, secret } = values;
        try {
            const res = await http.post('/admin/api/accounts', {
                username,
                password,
                secret,
            });
            setAccount(res.data);
            console.log('res:', res.data);
        } catch (error) {
            message.error('生成账号失败');
            return;
        }

        // 生成账号弹窗
        setShowResult(true);
    };

    return (
        <div className="login">
            {!showResult ? (
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
            ) : (
                <Card className="result-container">
                    <Result
                        status="success"
                        title="成功创建账号"
                        subTitle={
                            <Typography>
                                <Paragraph>
                                    复制下面代码到 _config.yml 并重启 HEXO.
                                    <pre className="result-code">
                                        <code>
                                            # hexo-admin authentification <br />
                                            admin: <br />
                                            &nbsp;&nbsp;username:
                                            {account.username} <br />
                                            &nbsp;&nbsp;password_hash:
                                            {account.password}
                                            <br />
                                            &nbsp;&nbsp;secret: {account.secret}
                                        </code>
                                    </pre>
                                </Paragraph>
                            </Typography>
                        }
                        extra={[
                            <Button
                                type="primary"
                                key="console"
                                onClick={() => {
                                    setShowResult(false);
                                }}
                            >
                                重新创建账号
                            </Button>,
                        ]}
                    />
                </Card>
            )}
        </div>
    );
}

export default NewAccount;
