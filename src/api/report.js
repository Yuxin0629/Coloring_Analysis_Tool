import apiClient from './index';

/**
 * 报告 API
 */
export const reportApi = {
  // ==================== 全局汇总报告 ====================

  /**
   * 获取全局汇总报告
   * @param {number} projectId - 项目ID
   */
  getGlobalSummary: (projectId) => {
    return apiClient.get(`/reports/${projectId}/summary`);
  },

  /**
   * 获取项目统计信息
   * @param {number} projectId - 项目ID
   */
  getProjectStatistics: (projectId) => {
    return apiClient.get(`/reports/${projectId}/statistics`);
  },

  /**
   * 导出全局汇总报告
   * @param {number} projectId - 项目ID
   * @param {string} format - 导出格式: 'csv' | 'excel' | 'pdf' | 'json'
   */
  exportGlobalReport: (projectId, format = 'excel') => {
    return apiClient.get(`/reports/${projectId}/export`, {
      params: { format, type: 'summary' },
      responseType: 'blob'
    });
  },

  // ==================== 单张图片报告 ====================

  /**
   * 获取单张图片分析报告
   * @param {number} projectId - 项目ID
   * @param {number} imageId - 图片ID
   */
  getSingleImageReport: (projectId, imageId) => {
    return apiClient.get(`/reports/${projectId}/image/${imageId}`);
  },

  /**
   * 获取单张图片的区域分析详情
   * @param {number} projectId - 项目ID
   * @param {number} imageId - 图片ID
   * @param {string} regionName - 区域名称
   */
  getRegionAnalysis: (projectId, imageId, regionName) => {
    return apiClient.get(`/reports/${projectId}/image/${imageId}/region/${regionName}`);
  },

  /**
   * 导出单张图片报告
   * @param {number} projectId - 项目ID
   * @param {number} imageId - 图片ID
   * @param {string} format - 导出格式: 'pdf' | 'json'
   */
  exportSingleImageReport: (projectId, imageId, format = 'pdf') => {
    return apiClient.get(`/reports/${projectId}/image/${imageId}/export`, {
      params: { format },
      responseType: 'blob'
    });
  },

  // ==================== 批量报告操作 ====================

  /**
   * 批量导出报告
   * @param {number} projectId - 项目ID
   * @param {Object} data - 导出参数
   * @param {number[]} data.imageIds - 图片ID列表
   * @param {string} data.format - 导出格式
   */
  batchExportReports: (projectId, data) => {
    return apiClient.post(`/reports/${projectId}/batch-export`, data, {
      responseType: 'blob'
    });
  },

  /**
   * 获取报告生成状态
   * @param {number} projectId - 项目ID
   * @param {string} taskId - 任务ID
   */
  getReportStatus: (projectId, taskId) => {
    return apiClient.get(`/reports/${projectId}/status/${taskId}`);
  }
};

export default reportApi;
