import axios from 'axios';
import { message } from 'antd';

// API 基础配置
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';

// 创建 axios 实例
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30秒超时
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 添加认证令牌
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 统一错误处理
apiClient.interceptors.response.use(
  (response) => {
    // 如果后端返回标准格式 { code, message, data }
    if (response.data && typeof response.data.code !== 'undefined') {
      if (response.data.code !== 200 && response.data.code !== 0) {
        message.error(response.data.message || '请求失败');
        return Promise.reject(response.data);
      }
      return response.data.data;
    }
    return response.data;
  },
  (error) => {
    const { response } = error;
    
    if (response) {
      switch (response.status) {
        case 400:
          message.error(response.data?.message || '请求参数错误');
          break;
        case 401:
          message.error('登录已过期，请重新登录');
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 403:
          message.error('没有权限执行此操作');
          break;
        case 404:
          message.error('请求的资源不存在');
          break;
        case 500:
          message.error('服务器内部错误');
          break;
        default:
          message.error(`请求失败: ${response.status}`);
      }
    } else {
      message.error('网络连接失败，请检查网络');
    }
    
    return Promise.reject(error);
  }
);

// 文件上传专用实例（multipart/form-data）
const uploadClient = axios.create({
  baseURL: process.env.REACT_APP_UPLOAD_BASE_URL || API_BASE_URL,
  timeout: 120000, // 上传超时 2分钟
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

uploadClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

uploadClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    message.error('文件上传失败');
    return Promise.reject(error);
  }
);

export { apiClient, uploadClient };
export default apiClient;
