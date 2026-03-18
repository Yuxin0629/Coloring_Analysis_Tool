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
   * @param {number} id - 模板ID
   */
  getTemplateDetail: (id) => {
    return apiClient.get(`/templates/${id}`);
  },

  /**
   * 上传新模板
   * @param {FormData} formData - 包含模板文件和信息的 FormData
   * @param {string} formData.name - 模板名称
   * @param {string} formData.description - 模板描述
   * @param {File} formData.templateImage - 模板图片文件
   * @param {string} formData.analysisMethods - 分析方法(JSON字符串)
   */
  uploadTemplate: (formData) => {
    return uploadClient.post('/templates', formData);
  },

  /**
   * 更新模板信息
   * @param {number} id - 模板ID
   * @param {Object} data - 更新数据
   */
  updateTemplate: (id, data) => {
    return apiClient.put(`/templates/${id}`, data);
  },

  /**
   * 删除模板
   * @param {number} id - 模板ID
   */
  deleteTemplate: (id) => {
    return apiClient.delete(`/templates/${id}`);
  },

  /**
   * 批量删除模板
   * @param {number[]} ids - 模板ID列表
   */
  batchDeleteTemplates: (ids) => {
    return apiClient.post('/templates/batch-delete', { ids });
  }
};

export default templateApi;
