import apiClient, { uploadClient } from './index';

/**
 * 模板管理 API
 */
export const templateApi = {
  /**
   * 获取模板列表
   * @param {Object} params - 查询参数
   * @param {string} params.keyword - 搜索关键词
   * @param {number} params.page - 页码
   * @param {number} params.pageSize - 每页数量
   */
  getTemplates: (params = {}) => {
    return apiClient.get('/templates', { params });
  },

  /**
   * 获取模板详情
   * @param {number|string} id - 模板ID
   */
  getTemplateDetail: (id) => {
    return apiClient.get(`/templates/${id}`);
  },

  /**
   * 创建模板
   * @param {Object} data - 模板数据
   * @param {string} data.name - 模板名称
   */
  createTemplate: (data) => {
    return apiClient.post('/templates', data);
  },

  /**
   * 更新模板
   * @param {number|string} id - 模板ID
   * @param {Object} data - 模板数据
   */
  updateTemplate: (id, data) => {
    return apiClient.put(`/templates/${id}`, data);
  },

  /**
   * 删除模板
   * @param {number|string} id - 模板ID
   */
  deleteTemplate: (id) => {
    return apiClient.delete(`/templates/${id}`);
  },

  /**
   * 上传模板图片
   * @param {number|string} id - 模板ID
   * @param {FormData} formData - 包含图片文件的FormData
   */
  uploadTemplateImage: (id, formData) => {
    return uploadClient.post(`/templates/${id}/image`, formData);
  }
};

export default templateApi;
