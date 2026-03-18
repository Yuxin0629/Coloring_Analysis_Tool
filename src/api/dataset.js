import apiClient, { uploadClient } from './index';

/**
 * 数据集 API
 */
export const datasetApi = {
  /**
   * 获取数据集列表
   * @param {Object} params - 查询参数
   * @param {number} params.groupId - 分组ID
   * @param {string} params.year - 年份
   * @param {string} params.keyword - 搜索关键词
   * @param {string} params.sortField - 排序字段
   * @param {string} params.sortOrder - 排序方向
   */
  getDatasets: (params = {}) => {
    return apiClient.get('/datasets', { params });
  },

  /**
   * 创建数据集
   * @param {Object} data - 数据集数据
   * @param {string} data.name - 名称
   * @param {string} data.description - 描述
   * @param {string} data.scenario - 场景
   * @param {number[]} data.groupIds - 所属分组ID列表
   */
  createDataset: (data) => {
    return apiClient.post('/datasets', data);
  },

  /**
   * 更新数据集
   * @param {number} id - 数据集ID
   * @param {Object} data - 更新数据
   */
  updateDataset: (id, data) => {
    return apiClient.put(`/datasets/${id}`, data);
  },

  /**
   * 删除数据集
   * @param {number} id - 数据集ID
   */
  deleteDataset: (id) => {
    return apiClient.delete(`/datasets/${id}`);
  },

  /**
   * 批量删除数据集
   * @param {number[]} ids - 数据集ID列表
   */
  batchDeleteDatasets: (ids) => {
    return apiClient.post('/datasets/batch-delete', { ids });
  },

  /**
   * 获取数据集详情
   * @param {number} id - 数据集ID
   */
  getDatasetDetail: (id) => {
    return apiClient.get(`/datasets/${id}`);
  },

  /**
   * 上传图片到数据集
   * @param {number} datasetId - 数据集ID
   * @param {FormData} formData - 包含文件的 FormData
   */
  uploadImages: (datasetId, formData) => {
    return uploadClient.post(`/datasets/${datasetId}/images`, formData);
  },

  /**
   * 获取数据集的图片列表
   * @param {number} datasetId - 数据集ID
   */
  getDatasetImages: (datasetId) => {
    return apiClient.get(`/datasets/${datasetId}/images`);
  },

  /**
   * 删除数据集中的图片
   * @param {number} datasetId - 数据集ID
   * @param {number} imageId - 图片ID
   */
  deleteImage: (datasetId, imageId) => {
    return apiClient.delete(`/datasets/${datasetId}/images/${imageId}`);
  },

  /**
   * 批量删除图片
   * @param {number} datasetId - 数据集ID
   * @param {number[]} imageIds - 图片ID列表
   */
  batchDeleteImages: (datasetId, imageIds) => {
    return apiClient.post(`/datasets/${datasetId}/images/batch-delete`, { imageIds });
  }
};

export default datasetApi;
