# API 层使用文档

## 目录结构

```
src/
├── api/
│   ├── index.js          # axios 基础配置和拦截器
│   ├── auth.js           # 认证相关 API
│   ├── group.js          # 分组管理 API
│   ├── dataset.js        # 数据集 API
│   ├── analysis.js       # 分析项目 API
│   ├── template.js       # 模板管理 API
│   ├── tool.js           # 图像处理工具 API
│   └── report.js         # 报告 API
├── hooks/
│   └── useApi.js         # API 调用自定义 Hook
└── .env.development      # 开发环境配置
└── .env.production       # 生产环境配置
```

## 环境配置

### 开发环境 (.env.development)
```
REACT_APP_API_BASE_URL=http://localhost:8080/api
REACT_APP_UPLOAD_BASE_URL=http://localhost:8080
```

### 生产环境 (.env.production)
```
REACT_APP_API_BASE_URL=https://your-backend-domain.com/api
REACT_APP_UPLOAD_BASE_URL=https://your-backend-domain.com
```

**注意**: 修改生产环境配置后需要重新构建部署。

## 使用方法

### 1. 基础 API 调用

```javascript
import { authApi } from './api/auth';

// 登录
const handleLogin = async (values) => {
  try {
    const result = await authApi.login({
      username: values.username,
      password: values.password
    });
    // 登录成功，result 包含用户信息和 token
    localStorage.setItem('token', result.token);
  } catch (error) {
    // 错误已在拦截器中处理，显示错误消息
  }
};
```

### 2. 使用自定义 Hook（推荐）

```javascript
import { useApi, useListApi, useSubmitApi } from './hooks/useApi';
import { groupApi } from './api/group';

// 简单 API 调用
function GroupListPage() {
  const { data: groups, loading, execute: fetchGroups } = useApi(groupApi.getGroups);
  
  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);
  
  return (
    <Spin spinning={loading}>
      {/* 渲染 groups */}
    </Spin>
  );
}

// 列表数据（带分页）
function DatasetListPage() {
  const { 
    list, 
    loading, 
    pagination, 
    filters,
    fetchList, 
    updatePagination,
    updateFilters 
  } = useListApi(datasetApi.getDatasets, {
    filters: { year: 'all' }
  });
  
  // 搜索
  const handleSearch = (keyword) => {
    updateFilters({ keyword });
    fetchList();
  };
  
  // 分页变化
  const handlePageChange = (page, pageSize) => {
    updatePagination({ current: page, pageSize });
    fetchList();
  };
  
  return (
    <Table 
      dataSource={list}
      loading={loading}
      pagination={{
        ...pagination,
        onChange: handlePageChange
      }}
    />
  );
}

// 表单提交
function CreateGroupModal({ onSuccess }) {
  const { submitting, submit } = useSubmitApi(groupApi.createGroup, {
    successMsg: '分组创建成功',
    onSuccess
  });
  
  const handleSubmit = async (values) => {
    await submit(values);
  };
  
  return (
    <Modal confirmLoading={submitting} onOk={handleSubmit}>
      {/* 表单内容 */}
    </Modal>
  );
}
```

### 3. 文件上传

```javascript
import { datasetApi } from './api/dataset';

const handleUpload = async (fileList, datasetId) => {
  const formData = new FormData();
  fileList.forEach(file => {
    formData.append('files', file.originFileObj);
  });
  
  try {
    const result = await datasetApi.uploadImages(datasetId, formData);
    message.success('上传成功');
    return result;
  } catch (error) {
    message.error('上传失败');
  }
};
```

### 4. 下载文件

```javascript
import { reportApi } from './api/report';

const handleExport = async (projectId) => {
  try {
    const blob = await reportApi.exportGlobalReport(projectId, 'excel');
    
    // 创建下载链接
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `report_${projectId}.xlsx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    message.error('导出失败');
  }
};
```

## 后端配合要求

### 1. CORS 配置
允许前端域名访问：
```
Access-Control-Allow-Origin: https://your-frontend-domain.com
Access-Control-Allow-Headers: Authorization, Content-Type
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
```

### 2. 响应格式约定

**成功响应**:
```json
{
  "code": 200,
  "message": "success",
  "data": { ... }
}
```

**错误响应**:
```json
{
  "code": 40001,
  "message": "错误描述信息",
  "data": null
}
```

### 3. 认证方式
使用 JWT Token，在请求头中携带：
```
Authorization: Bearer {token}
```

### 4. 文件上传
- Content-Type: `multipart/form-data`
- 单文件大小限制: 10MB
- 支持格式: JPG, PNG
- 批量上传最多 50 个文件

## API 模块列表

| 模块 | 文件 | 主要功能 |
|------|------|----------|
| 认证 | `auth.js` | 登录、登出、获取用户信息 |
| 分组 | `group.js` | CRUD、筛选、统计 |
| 数据集 | `dataset.js` | CRUD、图片上传/删除 |
| 分析项目 | `analysis.js` | 创建、进度、配置、重试 |
| 模板 | `template.js` | 上传、管理、删除 |
| 工具 | `tool.js` | 边缘检测、图像矫正 |
| 报告 | `report.js` | 获取报告、导出 |

## 迁移指南：从模拟数据到真实 API

### 替换步骤

1. **安装依赖**
   ```bash
   npm install
   ```

2. **配置环境变量**
   修改 `.env.development` 中的 API 地址

3. **替换页面中的模拟数据**

   **Before**:
   ```javascript
   const [groups, setGroups] = useState(initialGroups);
   ```

   **After**:
   ```javascript
   const { list: groups, loading, fetchList } = useListApi(groupApi.getGroups);
   
   useEffect(() => {
     fetchList();
   }, [fetchList]);
   ```

4. **替换表单提交**

   **Before**:
   ```javascript
   const handleCreate = (values) => {
     const newGroup = { id: Date.now(), ...values };
     setGroups([...groups, newGroup]);
     message.success('创建成功');
   };
   ```

   **After**:
   ```javascript
   const { submitting, submit } = useSubmitApi(groupApi.createGroup, {
     onSuccess: () => {
       fetchList(); // 刷新列表
       setModalVisible(false);
     }
   });
   
   const handleCreate = async (values) => {
     await submit(values);
   };
   ```

5. **测试 API 连通性**
   打开浏览器开发者工具 → Network 面板，检查请求是否成功

## 注意事项

1. **Token 自动刷新**: 当前配置在 401 错误时跳转到登录页，如需自动刷新 token，需修改 `api/index.js` 中的响应拦截器

2. **并发请求控制**: 多个组件同时请求相同数据时，建议使用 React Query 或 SWR 替代自定义 Hook

3. **生产环境**: 确保生产环境 `.env.production` 中的 API 地址正确，且后端已配置 HTTPS 和 CORS
