import apiClient from './index';

/**
 * 分组管理 API
 */
export const groupApi = {
  /**
   * 获取分组列表
   * @param {Object} params - 查询参数
   * @param {string} params.year - 年份筛选
   * @param {string} params.keyword - 搜索关键词
   */
  getGroups: (params = {}) => {
    return apiClient.get('/groups', { params });
  },

  /**
   * 创建分组
   * @param {Object} data - 分组数据
   * @param {string} data.name - 分组名称
   * @param {string} data.description - 分组描述
   * @param {number} data.year - 年份
   */
  createGroup: (data) => {
    return apiClient.post('/groups', data);
  },

  /**
   * 更新分组
   * @param {number} id - 分组ID
   * @param {Object} data - 更新数据
   */
  updateGroup: (id, data) => {
    return apiClient.put(`/groups/${id}`, data);
  },

  /**
   * 删除分组
   * @param {number} id - 分组ID
   */
  deleteGroup: (id) => {
    return apiClient.delete(`/groups/${id}`);
  },

  /**
   * 获取分组详情
   * @param {number} id - 分组ID
   */
  getGroupDetail: (id) => {
    return apiClient.get(`/groups/${id}`);
  },

  /**
   * 获取分组的统计信息
   * @param {number} id - 分组ID
   */
  getGroupStats: (id) => {
    return apiClient.get(`/groups/${id}/stats`);
  }
};

export default groupApi;
