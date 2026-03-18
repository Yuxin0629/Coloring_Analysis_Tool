import apiClient, { uploadClient } from './index';

/**
 * 图像处理工具 API
 */
export const toolApi = {
  // ==================== 边缘检测 ====================
  
  /**
   * 执行边缘检测
   * @param {Object} data - 检测数据
   * @param {string} data.imageUrl - 图片URL或Base64
   * @param {number} data.sensitivity - 检测灵敏度(0-100)
   */
  detectEdges: (data) => {
    return apiClient.post('/tools/edge-detect', data);
  },

  /**
   * 上传图片并检测边缘
   * @param {FormData} formData - 包含图片文件的 FormData
   */
  uploadAndDetectEdges: (formData) => {
    return uploadClient.post('/tools/edge-detect/upload', formData);
  },

  /**
   * 保存检测到的区域
   * @param {Object} data - 区域数据
   * @param {string} data.imageId - 图片ID
   * @param {Array} data.regions - 区域列表 [{name, polygon, color}]
   */
  saveDetectedRegions: (data) => {
    return apiClient.post('/tools/edge-detect/regions', data);
  },

  // ==================== 图像矫正 ====================

  /**
   * 透视矫正
   * @param {Object} data - 矫正数据
   * @param {string} data.imageUrl - 图片URL
   * @param {Array} data.referencePoints - 参考点坐标 [{x, y}]
   */
  correctPerspective: (data) => {
    return apiClient.post('/tools/correct/perspective', data);
  },

  /**
   * 旋转矫正
   * @param {Object} data - 旋转数据
   * @param {string} data.imageUrl - 图片URL
   * @param {number} data.rotation - 旋转角度
   */
  correctRotation: (data) => {
    return apiClient.post('/tools/correct/rotation', data);
  },

  /**
   * 缩放调整
   * @param {Object} data - 缩放数据
   * @param {string} data.imageUrl - 图片URL
   * @param {number} data.scale - 缩放比例
   */
  correctScale: (data) => {
    return apiClient.post('/tools/correct/scale', data);
  },

  /**
   * 模板自动矫正
   * @param {Object} data - 自动矫正数据
   * @param {string} data.imageUrl - 图片URL
   * @param {number} data.templateId - 模板ID
   * @param {File} data.imageFile - 图片文件（可选，直接上传）
   */
  autoCorrectWithTemplate: (data) => {
    if (data.imageFile) {
      const formData = new FormData();
      formData.append('image', data.imageFile);
      formData.append('templateId', data.templateId);
      return uploadClient.post('/tools/correct/auto', formData);
    }
    return apiClient.post('/tools/correct/auto', {
      imageUrl: data.imageUrl,
      templateId: data.templateId
    });
  },

  /**
   * 上传图片进行矫正
   * @param {FormData} formData - 包含图片和矫正参数的 FormData
   */
  uploadAndCorrect: (formData) => {
    return uploadClient.post('/tools/correct/upload', formData);
  },

  /**
   * 下载矫正后的图片
   * @param {string} correctedImageUrl - 矫正后图片的URL
   */
  downloadCorrectedImage: (correctedImageUrl) => {
    return apiClient.get(`/tools/download?url=${encodeURIComponent(correctedImageUrl)}`, {
      responseType: 'blob'
    });
  }
};

export default toolApi;
