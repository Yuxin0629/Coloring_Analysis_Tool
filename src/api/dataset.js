import apiClient, { uploadClient } from './index';

/**
 * 数据集 API
 */
export const datasetApi = {
  /**
   * 查询数据集列表
   * @param {Object} params - 查询参数
   * @param {string} params.groupId - 分组ID
   * @param {string} params.scene - 场景
   */
  getDatasets: (params = {}) => {
    return apiClient.get('/datasets', { params });
  },

  /**
   * 创建数据集
   * @param {Object} data - 数据集数据
   * @param {string} data.name - 名称
   * @param {string} data.description - 描述
   * @param {string} data.ownerId - 所有者ID
   * @param {string} data.scene - 场景
   * @param {string} data.groupId - 分组ID
   */
  createDataset: (data) => {
    const { name, description, ownerId, scene, groupId } = data;
    return apiClient.post('/datasets', { name, description, ownerId, scene, groupId });
  },

  /**
   * 查询数据集详情
   * @param {string} datasetId - 数据集ID
   */
  getDatasetDetail: (datasetId) => {
    return apiClient.get(`/datasets/${datasetId}`);
  },

  /**
   * 查询数据集图片列表
   * @param {string} datasetId - 数据集ID
   */
  getDatasetImages: (datasetId) => {
    return apiClient.get(`/datasets/${datasetId}/images`);
  },

  /**
   * 上传数据集图片
   * @param {string} datasetId - 数据集ID
   * @param {FormData} formData - 包含图片文件的 FormData
   */
  uploadDatasetImages: (datasetId, formData) => {
    return uploadClient.post(`/datasets/${datasetId}/images`, formData);
  },

  /**
   * 更新数据集
   * @param {string} datasetId - 数据集ID
   * @param {Object} data - 更新数据
   * @param {string} data.name - 名称
   * @param {string} data.description - 描述
   * @param {string} data.scene - 场景
   */
  updateDataset: (datasetId, data) => {
    const { name, description, scene } = data;
    return apiClient.put(`/datasets/${datasetId}`, { name, description, scene });
  },

  /**
   * 删除数据集
   * @param {string} datasetId - 数据集ID
   */
  deleteDataset: (datasetId) => {
    return apiClient.delete(`/datasets/${datasetId}`);
  },

  /**
   * 删除数据集图片
   * @param {string} datasetId - 数据集ID
   * @param {string} imageId - 图片ID
   */
  deleteDatasetImage: (datasetId, imageId) => {
    return apiClient.delete(`/datasets/${datasetId}/images/${imageId}`);
  },

  /**
   * 批量删除数据集图片
   * @param {string} datasetId - 数据集ID
   * @param {string[]} imageIds - 图片ID数组
   */
  batchDeleteImages: (datasetId, imageIds) => {
    return apiClient.post(`/datasets/${datasetId}/images/batch-delete`, { imageIds });
  }
};

export default datasetApi;
