import { uploadClient } from './index';

/**
 * 图像处理工具 API
 */
export const toolApi = {
  /**
   * Canny边缘检测
   * @param {FormData} formData - 包含图片文件的FormData
   * @param {Object} config - 检测配置参数
   * @param {number} config.threshold1 - 低阈值
   * @param {number} config.threshold2 - 高阈值
   * @returns {Promise} 边缘检测结果
   */
  cannyEdgeDetection: (formData, config = {}) => {
    const params = new URLSearchParams();
    if (config.threshold1 !== undefined) params.append('threshold1', config.threshold1);
    if (config.threshold2 !== undefined) params.append('threshold2', config.threshold2);
    
    return uploadClient.post(`/images/canny?${params.toString()}`, formData);
  },

  /**
   * 图像校正 - 根据模板自动校正
   * @param {FormData} formData - 包含模板文件(model)和目标图片(image)的FormData
   * @returns {Promise} 校正后的图片
   */
  alignImage: (formData) => {
    return uploadClient.post('/images/correction/align', formData);
  }
};

export default toolApi;
