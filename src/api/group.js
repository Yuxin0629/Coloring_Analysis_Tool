import apiClient from './index';

/**
 * 分组管理 API
 */
export const groupApi = {
  /**
   * 查询分组列表
   */
  getGroups: () => {
    return apiClient.get('/dataset-groups');
  },

  /**
   * 创建分组
   * @param {Object} data - 分组数据
   * @param {string} data.name - 分组名称
   * @param {string} data.description - 分组描述
   */
  createGroup: (data) => {
    const { name, description } = data;
    return apiClient.post('/dataset-groups', { name, description });
  },

  /**
   * 查询分组详情
   * @param {number} id - 分组ID
   */
  getGroupDetail: (id) => {
    return apiClient.get(`/dataset-groups/${id}`);
  }
};

export default groupApi;
