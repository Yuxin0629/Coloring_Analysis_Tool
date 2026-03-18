import apiClient from './index';

/**
 * 认证相关 API
 */
export const authApi = {
  /**
   * 用户登录
   * @param {Object} credentials - 登录凭证
   * @param {string} credentials.username - 用户名
   * @param {string} credentials.password - 密码
   * @param {boolean} credentials.rememberMe - 是否记住我
   */
  login: (credentials) => {
    return apiClient.post('/auth/login', credentials);
  },

  /**
   * 用户登出
   */
  logout: () => {
    return apiClient.post('/auth/logout');
  },

  /**
   * 获取当前用户信息
   */
  getCurrentUser: () => {
    return apiClient.get('/auth/current');
  },

  /**
   * 刷新令牌
   */
  refreshToken: () => {
    return apiClient.post('/auth/refresh');
  },

  /**
   * 修改密码
   * @param {Object} data - 密码数据
   * @param {string} data.oldPassword - 旧密码
   * @param {string} data.newPassword - 新密码
   */
  changePassword: (data) => {
    return apiClient.post('/auth/change-password', data);
  }
};

export default authApi;
