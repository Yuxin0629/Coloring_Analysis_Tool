import { useState, useCallback } from 'react';
import { message } from 'antd';

/**
 * 通用 API 请求 Hook
 * 自动处理 loading 状态和错误提示
 * 
 * @param {Function} apiFunc - API 函数
 * @param {Object} options - 配置选项
 * @param {boolean} options.showSuccessMsg - 是否显示成功消息
 * @param {string} options.successMsg - 成功消息文本
 * @param {boolean} options.showErrorMsg - 是否显示错误消息（默认 true）
 * @returns {Object} { data, loading, error, execute, reset }
 * 
 * 使用示例：
 * const { data: groups, loading, execute: fetchGroups } = useApi(groupApi.getGroups);
 * 
 * // 在 useEffect 中调用
 * useEffect(() => {
 *   fetchGroups();
 * }, [fetchGroups]);
 * 
 * // 带参数调用
 * const handleSearch = (keyword) => {
 *   fetchGroups({ keyword });
 * };
 */
export function useApi(apiFunc, options = {}) {
  const {
    showSuccessMsg = false,
    successMsg = '操作成功',
    showErrorMsg = true
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiFunc(...args);
      setData(result);
      
      if (showSuccessMsg) {
        message.success(successMsg);
      }
      
      return result;
    } catch (err) {
      setError(err);
      
      if (showErrorMsg && err?.message) {
        // 错误已在 axios 拦截器中处理，这里可以选择是否额外显示
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunc, showSuccessMsg, successMsg, showErrorMsg]);

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset
  };
}

/**
 * 列表数据请求 Hook（支持分页）
 * 
 * @param {Function} apiFunc - API 函数
 * @param {Object} defaultParams - 默认查询参数
 * @returns {Object} 列表数据相关状态和操作
 */
export function useListApi(apiFunc, defaultParams = {}) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    ...defaultParams.pagination
  });
  const [filters, setFilters] = useState(defaultParams.filters || {});

  const fetchList = useCallback(async (params = {}) => {
    setLoading(true);
    
    try {
      const queryParams = {
        page: pagination.current,
        pageSize: pagination.pageSize,
        ...filters,
        ...params
      };
      
      const result = await apiFunc(queryParams);
      
      // 适配两种返回格式：{ list, total } 或 直接数组
      if (result && typeof result === 'object' && 'list' in result) {
        setList(result.list);
        setPagination(prev => ({
          ...prev,
          total: result.total || result.list.length
        }));
      } else if (Array.isArray(result)) {
        setList(result);
        setPagination(prev => ({
          ...prev,
          total: result.length
        }));
      }
      
      return result;
    } catch (err) {
      console.error('Fetch list error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunc, pagination.current, pagination.pageSize, filters]);

  const updatePagination = useCallback((newPagination) => {
    setPagination(prev => ({ ...prev, ...newPagination }));
  }, []);

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    // 重置到第一页
    setPagination(prev => ({ ...prev, current: 1 }));
  }, []);

  return {
    list,
    loading,
    pagination,
    filters,
    fetchList,
    updatePagination,
    updateFilters,
    setList
  };
}

/**
 * 提交操作 Hook（用于表单提交）
 * 
 * @param {Function} apiFunc - API 提交函数
 * @param {Object} options - 配置选项
 * @returns {Object} 提交相关状态和操作
 */
export function useSubmitApi(apiFunc, options = {}) {
  const {
    successMsg = '操作成功',
    onSuccess,
    onError
  } = options;

  const [submitting, setSubmitting] = useState(false);

  const submit = useCallback(async (values) => {
    setSubmitting(true);
    
    try {
      const result = await apiFunc(values);
      message.success(successMsg);
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (err) {
      if (onError) {
        onError(err);
      }
      throw err;
    } finally {
      setSubmitting(false);
    }
  }, [apiFunc, successMsg, onSuccess, onError]);

  return {
    submitting,
    submit
  };
}

export default useApi;
