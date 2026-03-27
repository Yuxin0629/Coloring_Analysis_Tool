import React, { useState } from 'react';
import { Form, Input, Button, message, Card, Typography, Space } from 'antd';
import { 
  EyeOutlined, 
  EyeInvisibleOutlined, 
  UserOutlined, 
  LockOutlined,
  SafetyCertificateOutlined,
  UserAddOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/auth';

const { Title, Text, Paragraph } = Typography;

const RegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [form] = Form.useForm();

  const handleRegister = async (values) => {
    setLoading(true);
    try {
      // 调用注册API
      await authApi.register({
        username: values.username,
        password: values.password
      });
      
      message.success('注册成功，请登录');
      navigate('/login');
    } catch (error) {
      // 错误已在apiClient拦截器中处理
      console.error('注册失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
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

      {/* 注册卡片容器 */}
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
              助力儿童涂色评估与教学
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
          </div>

          {/* 右侧：注册表单区域 */}
          <div style={{
            width: '55%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '60px',
            backgroundColor: '#fff'
          }}>
            {/* 返回登录按钮 */}
            <Button
              type="link"
              icon={<ArrowLeftOutlined />}
              onClick={handleBackToLogin}
              style={{
                position: 'absolute',
                top: 24,
                left: 24,
                padding: 0,
                color: '#667eea'
              }}
            >
              返回登录
            </Button>

            {/* 注册类型标签 */}
            <div style={{ marginBottom: 40 }}>
              <Title level={4} style={{ margin: 0, marginBottom: 8 }}>
                <UserAddOutlined style={{ marginRight: 8, color: '#667eea' }} />
                用户注册
              </Title>
              <Text type="secondary">创建新账号以开始使用</Text>
            </div>

            {/* 注册表单 */}
            <Form
              form={form}
              name="register"
              onFinish={handleRegister}
              autoComplete="off"
              style={{ width: '100%' }}
            >
              {/* 账号输入框 */}
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: '请输入账号' },
                  { min: 3, message: '账号长度至少3位' },
                  { max: 20, message: '账号长度最多20位' }
                ]}
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
                rules={[
                  { required: true, message: '请输入密码' },
                  { min: 6, message: '密码长度至少6位' }
                ]}
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

              {/* 确认密码输入框 */}
              <Form.Item
                name="confirmPassword"
                dependencies={['password']}
                rules={[
                  { required: true, message: '请确认密码' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('两次输入的密码不一致'));
                    },
                  }),
                ]}
              >
                <Input
                  prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                  type={confirmPasswordVisible ? 'text' : 'password'}
                  placeholder="请确认密码"
                  size="large"
                  suffix={
                    <span 
                      onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                      style={{ cursor: 'pointer', color: '#999' }}
                    >
                      {confirmPasswordVisible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                    </span>
                  }
                  style={{
                    borderRadius: 8,
                    height: 48
                  }}
                />
              </Form.Item>

              {/* 注册按钮 */}
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
                  注 册
                </Button>
              </Form.Item>

              {/* 已有账号提示 */}
              <div style={{ textAlign: 'center' }}>
                <Text type="secondary" style={{ fontSize: 13 }}>
                  已有账号？
                  <Button 
                    type="link" 
                    onClick={handleBackToLogin}
                    style={{ padding: '0 4px', fontSize: 13 }}
                  >
                    立即登录
                  </Button>
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

export default RegisterPage;
