import apiClient from './index';

/**
 * 分析项目 API
 */
export const analysisApi = {
  /**
   * 获取分析项目列表
   * @param {Object} params - 查询参数
   * @param {string} params.status - 状态筛选
   * @param {string} params.year - 年份
   * @param {string} params.keyword - 搜索关键词
   * @param {string} params.sortField - 排序字段
   * @param {string} params.sortOrder - 排序方向
   * @param {number} params.page - 页码
   * @param {number} params.pageSize - 每页数量
   */
  getProjects: (params = {}) => {
    return apiClient.get('/analysis', { params });
  },

  /**
   * 创建分析项目
   * @param {Object} data - 项目数据
   * @param {string} data.name - 项目名称
   * @param {string} data.description - 项目描述
   * @param {number[]} data.datasetIds - 数据集ID列表
   * @param {number} data.templateId - 模板ID
   */
  createProject: (data) => {
    return apiClient.post('/analysis', data);
  },

  /**
   * 获取项目详情
   * @param {number} id - 项目ID
   */
  getProjectDetail: (id) => {
    return apiClient.get(`/analysis/${id}`);
  },

  /**
   * 更新项目
   * @param {number} id - 项目ID
   * @param {Object} data - 更新数据
   */
  updateProject: (id, data) => {
    return apiClient.put(`/analysis/${id}`, data);
  },

  /**
   * 删除项目
   * @param {number} id - 项目ID
   */
  deleteProject: (id) => {
    return apiClient.delete(`/analysis/${id}`);
  },

  /**
   * 批量删除项目
   * @param {number[]} ids - 项目ID列表
   */
  batchDeleteProjects: (ids) => {
    return apiClient.post('/analysis/batch-delete', { ids });
  },

  /**
   * 重新分析项目
   * @param {number} id - 项目ID
   */
  restartAnalysis: (id) => {
    return apiClient.post(`/analysis/${id}/restart`);
  },

  /**
   * 获取项目分析进度
   * @param {number} id - 项目ID
   */
  getProjectProgress: (id) => {
    return apiClient.get(`/analysis/${id}/progress`);
  },

  /**
   * 保存分析配置（步骤4）
   * @param {number} id - 项目ID
   * @param {Object} data - 配置数据
   * @param {Object} data.imageAnalysisConfig - 图片分析配置
   */
  saveAnalysisConfig: (id, data) => {
    return apiClient.post(`/analysis/${id}/config`, data);
  },

  /**
   * 提交分析任务（创建后启动）
   * @param {number} id - 项目ID
   */
  submitAnalysis: (id) => {
    return apiClient.post(`/analysis/${id}/submit`);
  },

  /**
   * 保存未完成的项目（断点续传）
   * @param {Object} data - 项目临时数据
   */
  saveIncompleteProject: (data) => {
    return apiClient.post('/analysis/save-draft', data);
  },

  /**
   * 恢复未完成的项目
   * @param {number} id - 项目ID
   */
  restoreIncompleteProject: (id) => {
    return apiClient.get(`/analysis/restore/${id}`);
  }
};

export default analysisApi;
