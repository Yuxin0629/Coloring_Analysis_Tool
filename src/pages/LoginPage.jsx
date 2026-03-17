import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Checkbox, Card, Typography, Space } from 'antd';
import { 
  EyeOutlined, 
  EyeInvisibleOutlined, 
  UserOutlined, 
  LockOutlined,
  SafetyCertificateOutlined,
  LoginOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;

// 默认账号密码（仅用于前端开发测试）
const DEFAULT_CREDENTIALS = {
  username: 'admin',
  password: '123'
};

// 会话管理常量
const SESSION_KEY = 'user_session';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24小时有效期

const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [form] = Form.useForm();
  const [rememberMe, setRememberMe] = useState(false);

  // 检查已有会话
  useEffect(() => {
    const session = localStorage.getItem(SESSION_KEY);
    if (session) {
      try {
        const parsed = JSON.parse(session);
        if (parsed.expiresAt > Date.now()) {
          // 会话有效，自动跳转
          navigate('/dataset');
        } else {
          // 会话过期，清除存储
          localStorage.removeItem(SESSION_KEY);
          message.warning('会话已过期，请重新登录');
        }
      } catch (e) {
        localStorage.removeItem(SESSION_KEY);
      }
    }
  }, [navigate]);

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      // 模拟登录验证
      console.log('登录信息:', values);
      
      // 模拟 API 调用延迟
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 验证账号密码
      if (values.username === DEFAULT_CREDENTIALS.username && 
          values.password === DEFAULT_CREDENTIALS.password) {
        
        // 生成模拟会话令牌
        const session = {
          token: `mock_token_${Date.now()}`,
          userId: '1',
          username: values.username,
          loginTime: new Date().toISOString(),
          expiresAt: Date.now() + SESSION_DURATION,
          rememberMe: rememberMe
        };
        
        // 存储会话
        localStorage.setItem(SESSION_KEY, JSON.stringify(session));
        
        message.success('登录成功，欢迎回来！');
        navigate('/dataset');
      } else {
        message.error('账号或密码错误，请重试');
      }
    } catch (error) {
      message.error('登录失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 自动填充默认账号（方便开发测试）
  const fillDefaultCredentials = () => {
    form.setFieldsValue({
      username: DEFAULT_CREDENTIALS.username,
      password: DEFAULT_CREDENTIALS.password
    });
    message.info('已填充默认账号密码');
  };

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* 背景装饰 */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        left: '-10%',
        width: '40%',
        height: '40%',
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '50%',
        filter: 'blur(60px)'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        right: '-10%',
        width: '50%',
        height: '50%',
        background: 'rgba(255,255,255,0.08)',
        borderRadius: '50%',
        filter: 'blur(80px)'
      }} />

      {/* 登录卡片容器 */}
      <Card 
        style={{
          width: 1000,
          height: 580,
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          border: 'none'
        }}
        bodyStyle={{ padding: 0, height: '100%' }}
      >
        <div style={{ display: 'flex', height: '100%' }}>
          {/* 左侧：品牌展示区域 */}
          <div style={{
            width: '45%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '48px',
            color: '#fff',
            position: 'relative'
          }}>
            {/* Logo区域 */}
            <div style={{
              width: 80,
              height: 80,
              backgroundColor: 'rgba(255,255,255,0.2)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 24,
              backdropFilter: 'blur(10px)'
            }}>
              <SafetyCertificateOutlined style={{ fontSize: 40, color: '#fff' }} />
            </div>

            {/* 标题 */}
            <Title level={3} style={{ 
              color: '#fff', 
              margin: 0,
              marginBottom: 16,
              textAlign: 'center',
              fontWeight: 600
            }}>
              涂色图像分析工具
            </Title>

            <Paragraph style={{ 
              color: 'rgba(255,255,255,0.9)', 
              textAlign: 'center',
              fontSize: 14,
              marginBottom: 32
            }}>
              专业的涂色图像分析工具<br/>
                      </Paragraph>

            {/* 装饰分隔线 */}
            <div style={{
              width: 60,
              height: 3,
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
              borderRadius: 2,
              marginBottom: 32
            }} />

            {/* 特性列表 */}
            <Space direction="vertical" size={16} style={{ width: '100%', padding: '0 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 8,
                  height: 8,
                  backgroundColor: '#fff',
                  borderRadius: '50%'
                }} />
                <Text style={{ color: 'rgba(255,255,255,0.9)' }}>智能图像分析</Text>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 8,
                  height: 8,
                  backgroundColor: '#fff',
                  borderRadius: '50%'
                }} />
                <Text style={{ color: 'rgba(255,255,255,0.9)' }}>可视化数据报告</Text>
              </div>
            </Space>

            {/* 默认账号提示 */}
            <div style={{
              position: 'absolute',
              bottom: 24,
              left: '50%',
              transform: 'translateX(-50%)',
              textAlign: 'center'
            }}>
              <Text style={{ 
                color: 'rgba(255,255,255,0.6)', 
                fontSize: 12,
                cursor: 'pointer'
              }} onClick={fillDefaultCredentials}>
                点击此处填充默认测试账号
              </Text>
            </div>
          </div>

          {/* 右侧：登录表单区域 */}
          <div style={{
            width: '55%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '60px',
            backgroundColor: '#fff'
          }}>
            {/* 登录类型标签 */}
            <div style={{ marginBottom: 40 }}>
              <Title level={4} style={{ margin: 0, marginBottom: 8 }}>
                <LoginOutlined style={{ marginRight: 8, color: '#667eea' }} />
                欢迎登录
              </Title>
              <Text type="secondary">请输入您的账号和密码继续访问</Text>
            </div>

            {/* 登录表单 */}
            <Form
              form={form}
              name="login"
              onFinish={handleLogin}
              autoComplete="off"
              style={{ width: '100%' }}
            >
              {/* 账号输入框 */}
              <Form.Item
                name="username"
                rules={[{ required: true, message: '请输入账号' }]}
              >
                <Input
                  prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
                  placeholder="请输入账号"
                  size="large"
                  style={{
                    borderRadius: 8,
                    height: 48
                  }}
                />
              </Form.Item>

              {/* 密码输入框 */}
              <Form.Item
                name="password"
                rules={[{ required: true, message: '请输入密码' }]}
              >
                <Input
                  prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                  type={passwordVisible ? 'text' : 'password'}
                  placeholder="请输入密码"
                  size="large"
                  suffix={
                    <span 
                      onClick={() => setPasswordVisible(!passwordVisible)}
                      style={{ cursor: 'pointer', color: '#999' }}
                    >
                      {passwordVisible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                    </span>
                  }
                  style={{
                    borderRadius: 8,
                    height: 48
                  }}
                />
              </Form.Item>

              {/* 记住我 & 忘记密码 */}
              <Form.Item>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <Checkbox 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  >
                    记住我
                  </Checkbox>
                  <span
                    style={{
                      fontSize: 13,
                      color: '#667eea',
                      textDecoration: 'none',
                      cursor: 'pointer'
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      message.info('忘记密码功能开发中，请联系管理员');
                    }}
                  >
                    忘记密码？
                  </span>
                </div>
              </Form.Item>

              {/* 登录按钮 */}
              <Form.Item style={{ marginBottom: 16 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={loading}
                  block
                  style={{
                    height: 48,
                    borderRadius: 8,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    fontSize: 16,
                    fontWeight: 500,
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
                  }}
                >
                  登 录
                </Button>
              </Form.Item>

              {/* 默认账号提示 */}
              <div style={{ textAlign: 'center' }}>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  默认测试账号：{DEFAULT_CREDENTIALS.username} / {DEFAULT_CREDENTIALS.password}
                </Text>
              </div>
            </Form>

            {/* 底部版权 */}
            <div style={{
              position: 'absolute',
              bottom: 24,
              right: 60
            }}>
              <Text type="secondary" style={{ fontSize: 12 }}>
                © 2026 涂色图像分析工具
              </Text>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
