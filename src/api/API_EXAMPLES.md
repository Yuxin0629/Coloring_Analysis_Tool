# API 调用示例代码

本文档提供所有 API 的 JavaScript/TypeScript 调用示例代码，可直接复制使用。

---

## 目录

1. [认证模块](#1-认证模块-auth)
2. [分组模块](#2-分组模块-group)
3. [数据集模块](#3-数据集模块-dataset)
4. [分析项目模块](#4-分析项目模块-analysis)
5. [模板模块](#5-模板模块-template)
6. [工具模块](#6-工具模块-tool)
7. [报告模块](#7-报告模块-report)

---

## 1. 认证模块 (Auth)

### 1.1 用户登录

```javascript
import { authApi } from '../api/auth';

// 方式1: 直接使用 API
const handleLogin = async (values) => {
  try {
    const result = await authApi.login({
      username: values.username,
      password: values.password,
      rememberMe: values.rememberMe
    });
    
    // 保存 token
    localStorage.setItem('token', result.token);
    localStorage.setItem('user', JSON.stringify({
      userId: result.userId,
      username: result.username
    }));
    
    message.success('登录成功');
    navigate('/dataset');
  } catch (error) {
    // 错误已在拦截器中处理
    console.error('登录失败:', error);
  }
};

// 方式2: 使用 useSubmitApi Hook (推荐)
import { useSubmitApi } from '../hooks/useApi';

function LoginForm() {
  const { submitting, submit } = useSubmitApi(authApi.login, {
    successMsg: '登录成功',
    onSuccess: (result) => {
      localStorage.setItem('token', result.token);
      navigate('/dataset');
    }
  });
  
  return (
    <Button loading={submitting} onClick={() => submit(formValues)}>
      登录
    </Button>
  );
}
```

**Form 表单示例**:
```jsx
import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const LoginPage = () => {
  const [form] = Form.useForm();
  const { submitting, submit } = useSubmitApi(authApi.login, {
    onSuccess: (result) => {
      localStorage.setItem('token', result.token);
      window.location.href = '/dataset';
    }
  });

  return (
    <Form form={form} onFinish={submit}>
      <Form.Item 
        name="username" 
        rules={[{ required: true, message: '请输入用户名' }]}
      >
        <Input prefix={<UserOutlined />} placeholder="用户名" />
      </Form.Item>
      
      <Form.Item 
        name="password" 
        rules={[{ required: true, message: '请输入密码' }]}
      >
        <Input.Password prefix={<LockOutlined />} placeholder="密码" />
      </Form.Item>
      
      <Form.Item name="rememberMe" valuePropName="checked">
        <Checkbox>记住我</Checkbox>
      </Form.Item>
      
      <Button type="primary" htmlType="submit" loading={submitting} block>
        登录
      </Button>
    </Form>
  );
};
```

---

### 1.2 用户登出

```javascript
import { authApi } from '../api/auth';

const handleLogout = async () => {
  try {
    await authApi.logout();
    
    // 清除本地存储
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    message.success('已退出登录');
    navigate('/login');
  } catch (error) {
    // 即使 API 失败也清除本地数据
    localStorage.removeItem('token');
    navigate('/login');
  }
};

// 使用 Hook 版本
const LogoutButton = () => {
  const { submitting, submit } = useSubmitApi(authApi.logout, {
    onSuccess: () => {
      localStorage.clear();
      window.location.href = '/login';
    }
  });
  
  return (
    <Button onClick={() => submit()} loading={submitting}>
      退出登录
    </Button>
  );
};
```

---

### 1.3 获取当前用户信息

```javascript
import { authApi } from '../api/auth';
import { useApi } from '../hooks/useApi';

// 在组件加载时获取用户信息
function UserProfile() {
  const { data: userInfo, loading, execute: fetchUser } = useApi(authApi.getCurrentUser);
  
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);
  
  if (loading) return <Spin />;
  
  return (
    <div>
      <p>用户名: {userInfo?.username}</p>
      <p>角色: {userInfo?.role}</p>
    </div>
  );
}

// 直接使用 API
const getUserInfo = async () => {
  try {
    const userInfo = await authApi.getCurrentUser();
    console.log('当前用户:', userInfo);
    return userInfo;
  } catch (error) {
    // 401 错误会触发拦截器跳转到登录页
    return null;
  }
};
```

---

### 1.4 修改密码

```javascript
import { authApi } from '../api/auth';

const ChangePasswordForm = () => {
  const [form] = Form.useForm();
  const { submitting, submit } = useSubmitApi(authApi.changePassword, {
    successMsg: '密码修改成功',
    onSuccess: () => {
      form.resetFields();
    }
  });

  return (
    <Form form={form} onFinish={submit}>
      <Form.Item
        name="oldPassword"
        rules={[{ required: true, message: '请输入旧密码' }]}
      >
        <Input.Password placeholder="旧密码" />
      </Form.Item>
      
      <Form.Item
        name="newPassword"
        rules={[
          { required: true, message: '请输入新密码' },
          { min: 6, message: '密码至少6位' }
        ]}
      >
        <Input.Password placeholder="新密码" />
      </Form.Item>
      
      <Form.Item
        name="confirmPassword"
        dependencies={['newPassword']}
        rules={[
          { required: true, message: '请确认新密码' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('newPassword') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('两次输入的密码不一致'));
            },
          }),
        ]}
      >
        <Input.Password placeholder="确认新密码" />
      </Form.Item>
      
      <Button type="primary" htmlType="submit" loading={submitting}>
        修改密码
      </Button>
    </Form>
  );
};
```

---

## 2. 分组模块 (Group)

### 2.1 获取分组列表

```javascript
import { groupApi } from '../api/group';
import { useListApi } from '../hooks/useApi';

// 使用 Hook (推荐)
function GroupListPage() {
  const { 
    list: groups, 
    loading, 
    pagination,
    filters,
    fetchList, 
    updateFilters,
    updatePagination 
  } = useListApi(groupApi.getGroups, {
    filters: { year: 'all' }
  });
  
  useEffect(() => {
    fetchList();
  }, [fetchList]);
  
  // 搜索
  const handleSearch = (keyword) => {
    updateFilters({ keyword });
    fetchList({ keyword });
  };
  
  // 年份筛选
  const handleYearFilter = (year) => {
    updateFilters({ year });
    fetchList({ year });
  };
  
  return (
    <div>
      <Input.Search 
        placeholder="搜索分组" 
        onSearch={handleSearch}
        loading={loading}
      />
      
      <Select value={filters.year} onChange={handleYearFilter}>
        <Option value="all">全部年份</Option>
        <Option value="2025">2025年</Option>
        <Option value="2024">2024年</Option>
      </Select>
      
      <List
        loading={loading}
        dataSource={groups}
        renderItem={group => (
          <List.Item>
            <Card title={group.name}>
              <p>{group.description}</p>
              <p>数据集数量: {group.datasetCount}</p>
            </Card>
          </List.Item>
        )}
        pagination={{
          ...pagination,
          onChange: (page, pageSize) => {
            updatePagination({ current: page, pageSize });
            fetchList({ page, pageSize });
          }
        }}
      />
    </div>
  );
}

// 直接使用 API
const fetchGroups = async (params = {}) => {
  try {
    const result = await groupApi.getGroups({
      year: params.year,
      keyword: params.keyword
    });
    return result.list || result; // 适配两种返回格式
  } catch (error) {
    return [];
  }
};
```

---

### 2.2 创建分组

```javascript
import { groupApi } from '../api/group';

const CreateGroupModal = ({ visible, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  
  const { submitting, submit } = useSubmitApi(groupApi.createGroup, {
    successMsg: '分组创建成功',
    onSuccess: (result) => {
      form.resetFields();
      onClose();
      onSuccess?.(result);
    }
  });

  return (
    <Modal
      title="创建分组"
      open={visible}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={submitting}
    >
      <Form form={form} onFinish={submit}>
        <Form.Item
          name="name"
          label="分组名称"
          rules={[{ required: true, message: '请输入分组名称' }]}
        >
          <Input placeholder="如：小花幼儿园" />
        </Form.Item>
        
        <Form.Item name="description" label="描述">
          <Input.TextArea rows={3} placeholder="分组描述（可选）" />
        </Form.Item>
        
        <Form.Item name="year" label="年份" initialValue={new Date().getFullYear()}>
          <InputNumber min={2020} max={2100} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

// 直接使用
const createGroup = async (values) => {
  try {
    const result = await groupApi.createGroup({
      name: values.name,
      description: values.description,
      year: values.year || new Date().getFullYear()
    });
    message.success('创建成功');
    return result;
  } catch (error) {
    return null;
  }
};
```

---

### 2.3 编辑分组

```javascript
import { groupApi } from '../api/group';

const EditGroupModal = ({ visible, group, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  
  // 编辑时填充表单
  useEffect(() => {
    if (visible && group) {
      form.setFieldsValue({
        name: group.name,
        description: group.description
      });
    }
  }, [visible, group, form]);
  
  const handleSubmit = async (values) => {
    try {
      await groupApi.updateGroup(group.id, values);
      message.success('更新成功');
      form.resetFields();
      onClose();
      onSuccess?.();
    } catch (error) {
      // 错误已在拦截器中处理
    }
  };

  return (
    <Modal
      title="编辑分组"
      open={visible}
      onCancel={onClose}
      onOk={() => form.submit()}
    >
      <Form form={form} onFinish={handleSubmit}>
        <Form.Item
          name="name"
          label="分组名称"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        
        <Form.Item name="description" label="描述">
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
```

---

### 2.4 删除分组

```javascript
import { groupApi } from '../api/group';
import { Modal } from 'antd';

const handleDeleteGroup = (group) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除分组 "${group.name}" 吗？其中的 ${group.datasetCount} 个数据集也将被删除。`,
    okText: '删除',
    okButtonProps: { danger: true },
    onOk: async () => {
      try {
        await groupApi.deleteGroup(group.id);
        message.success('删除成功');
        // 刷新列表
        fetchList();
      } catch (error) {
        // 错误已处理
      }
    }
  });
};

// 批量删除
const handleBatchDelete = async (selectedIds) => {
  if (selectedIds.length === 0) {
    message.warning('请选择要删除的分组');
    return;
  }
  
  Modal.confirm({
    title: '批量删除确认',
    content: `确定要删除选中的 ${selectedIds.length} 个分组吗？`,
    okButtonProps: { danger: true },
    onOk: async () => {
      // 如果没有批量删除接口，循环调用单条删除
      await Promise.all(selectedIds.map(id => groupApi.deleteGroup(id)));
      message.success('批量删除成功');
      fetchList();
    }
  });
};
```

---

### 2.5 获取分组统计

```javascript
import { groupApi } from '../api/group';

const GroupStatsCard = ({ groupId }) => {
  const { data: stats, loading, execute: fetchStats } = useApi(
    () => groupApi.getGroupStats(groupId)
  );
  
  useEffect(() => {
    if (groupId) {
      fetchStats();
    }
  }, [groupId, fetchStats]);
  
  return (
    <Card loading={loading} title="统计信息">
      <Statistic title="数据集数量" value={stats?.datasetCount || 0} />
      <Statistic title="图片总数" value={stats?.totalImageCount || 0} />
      <Statistic title="分析项目" value={stats?.analysisProjectCount || 0} />
    </Card>
  );
};
```

---

## 3. 数据集模块 (Dataset)

### 3.1 获取数据集列表

```javascript
import { datasetApi } from '../api/dataset';

function DatasetListPage() {
  const { 
    list: datasets, 
    loading, 
    pagination, 
    filters,
    fetchList, 
    updatePagination,
    updateFilters 
  } = useListApi(datasetApi.getDatasets);
  
  const { groupId } = useParams(); // 从 URL 获取分组ID
  
  useEffect(() => {
    fetchList({ groupId });
  }, [groupId, fetchList]);
  
  // 搜索
  const handleSearch = (value) => {
    updateFilters({ keyword: value });
    fetchList({ keyword: value });
  };
  
  // 排序
  const handleSort = (field) => {
    const newOrder = filters.sortField === field && filters.sortOrder === 'asc' ? 'desc' : 'asc';
    updateFilters({ sortField: field, sortOrder: newOrder });
    fetchList({ sortField: field, sortOrder: newOrder });
  };
  
  return (
    <div>
      <Input.Search 
        placeholder="搜索数据集" 
        onSearch={handleSearch}
      />
      
      <Table
        loading={loading}
        dataSource={datasets}
        columns={[
          { title: '名称', dataIndex: 'name' },
          { title: '图片数', dataIndex: 'imageCount' },
          { 
            title: '创建时间', 
            dataIndex: 'createTime',
            sorter: true,
            onHeaderCell: () => ({ onClick: () => handleSort('createTime') })
          }
        ]}
        pagination={{
          ...pagination,
          onChange: (page, pageSize) => {
            updatePagination({ current: page, pageSize });
            fetchList({ page, pageSize });
          }
        }}
      />
    </div>
  );
}
```

---

### 3.2 创建数据集

```javascript
import { datasetApi } from '../api/dataset';

const CreateDatasetModal = ({ visible, groupId, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  
  const handleCreate = async (values) => {
    try {
      // 1. 先创建数据集
      const dataset = await datasetApi.createDataset({
        name: values.name,
        description: values.description,
        scenario: values.scenario,
        groupIds: groupId ? [parseInt(groupId)] : []
      });
      
      // 2. 如果有文件，上传图片
      if (fileList.length > 0) {
        setUploading(true);
        const formData = new FormData();
        fileList.forEach(file => {
          formData.append('files', file.originFileObj);
        });
        await datasetApi.uploadImages(dataset.id, formData);
        setUploading(false);
      }
      
      message.success('创建成功');
      form.resetFields();
      setFileList([]);
      onClose();
      onSuccess?.();
    } catch (error) {
      setUploading(false);
    }
  };

  return (
    <Modal
      title="创建数据集"
      open={visible}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={uploading}
    >
      <Form form={form} onFinish={handleCreate}>
        <Form.Item
          name="name"
          label="名称"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        
        <Form.Item name="description" label="描述">
          <Input.TextArea />
        </Form.Item>
        
        <Form.Item name="scenario" label="场景">
          <Input placeholder="如：课堂活动" />
        </Form.Item>
        
        <Form.Item label="上传图片">
          <Upload
            multiple
            accept=".jpg,.jpeg,.png"
            fileList={fileList}
            beforeUpload={() => false} // 阻止自动上传
            onChange={({ fileList }) => setFileList(fileList)}
          >
            <Button icon={<UploadOutlined />}>选择图片</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};
```

---

### 3.3 图片上传（核心示例）

```javascript
import { datasetApi } from '../api/dataset';
import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

// 基础上传组件
const ImageUploader = ({ datasetId, onSuccess }) => {
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (fileList.length === 0) {
      message.warning('请选择要上传的图片');
      return;
    }

    setUploading(true);
    
    try {
      const formData = new FormData();
      fileList.forEach(file => {
        formData.append('files', file.originFileObj);
      });

      const result = await datasetApi.uploadImages(datasetId, formData);
      
      message.success(`成功上传 ${result.uploadedCount} 张图片`);
      setFileList([]);
      onSuccess?.(result);
    } catch (error) {
      message.error('上传失败');
    } finally {
      setUploading(false);
    }
  };

  // 上传前检查
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error(`${file.name} 不是 JPG/PNG 格式`);
      return false;
    }
    
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error(`${file.name} 超过 10MB 限制`);
      return false;
    }
    
    return false; // 阻止自动上传，手动控制
  };

  return (
    <div>
      <Upload
        multiple
        accept=".jpg,.jpeg,.png"
        fileList={fileList}
        beforeUpload={beforeUpload}
        onChange={({ fileList }) => setFileList(fileList.slice(0, 50))} // 最多50张
        onRemove={(file) => {
          setFileList(fileList.filter(item => item.uid !== file.uid));
        }}
      >
        <Button icon={<UploadOutlined />} disabled={fileList.length >= 50}>
          选择图片 (最多50张)
        </Button>
      </Upload>
      
      <Button
        type="primary"
        onClick={handleUpload}
        loading={uploading}
        disabled={fileList.length === 0}
        style={{ marginTop: 16 }}
      >
        开始上传 ({fileList.length}张)
      </Button>
    </div>
  );
};

// 带进度显示的上传
const UploadWithProgress = ({ datasetId }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = async (fileList) => {
    setUploading(true);
    setProgress(0);
    
    try {
      const formData = new FormData();
      fileList.forEach(file => formData.append('files', file.originFileObj));

      await datasetApi.uploadImages(datasetId, formData);
      message.success('上传完成');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Upload
      multiple
      customRequest={async ({ file, onSuccess, onError }) => {
        try {
          const formData = new FormData();
          formData.append('files', file);
          await datasetApi.uploadImages(datasetId, formData);
          onSuccess();
        } catch (err) {
          onError(err);
        }
      }}
    >
      <Button icon={<UploadOutlined />}>上传图片</Button>
    </Upload>
  );
};
```

---

### 3.4 删除数据集/图片

```javascript
import { datasetApi } from '../api/dataset';

// 删除数据集
const handleDeleteDataset = (dataset) => {
  Modal.confirm({
    title: '删除确认',
    content: `确定要删除数据集 "${dataset.name}" 吗？其中的 ${dataset.imageCount} 张图片也将被删除。`,
    okButtonProps: { danger: true },
    onOk: async () => {
      await datasetApi.deleteDataset(dataset.id);
      message.success('删除成功');
      fetchList();
    }
  });
};

// 批量删除数据集
const handleBatchDeleteDatasets = async (selectedIds) => {
  Modal.confirm({
    title: '批量删除',
    content: `确定删除 ${selectedIds.length} 个数据集？`,
    okButtonProps: { danger: true },
    onOk: async () => {
      await datasetApi.batchDeleteDatasets(selectedIds);
      message.success('批量删除成功');
      fetchList();
    }
  });
};

// 删除单张图片
const handleDeleteImage = async (datasetId, imageId) => {
  await datasetApi.deleteImage(datasetId, imageId);
  message.success('图片已删除');
};

// 批量删除图片
const handleBatchDeleteImages = async (datasetId, selectedImageIds) => {
  await datasetApi.batchDeleteImages(datasetId, selectedImageIds);
  message.success(`成功删除 ${selectedImageIds.length} 张图片`);
};
```

---

### 3.5 获取数据集图片列表

```javascript
import { datasetApi } from '../api/dataset';

const DatasetImages = ({ datasetId }) => {
  const { data: images, loading, execute: fetchImages } = useApi(
    () => datasetApi.getDatasetImages(datasetId)
  );
  
  useEffect(() => {
    fetchImages();
  }, [datasetId, fetchImages]);
  
  return (
    <div>
      <Spin spinning={loading}>
        <Image.PreviewGroup>
          {images?.map(img => (
            <Image
              key={img.id}
              src={img.thumbnailUrl}
              alt={img.name}
            />
          ))}
        </Image.PreviewGroup>
      </Spin>
    </div>
  );
};
```

---

## 4. 分析项目模块 (Analysis)

### 4.1 获取项目列表

```javascript
import { analysisApi } from '../api/analysis';

const AnalysisListPage = () => {
  const { 
    list: projects, 
    loading,
    pagination,
    filters,
    fetchList,
    updateFilters,
    updatePagination
  } = useListApi(analysisApi.getProjects, {
    filters: { status: 'all', sortField: 'createTime', sortOrder: 'desc' }
  });
  
  useEffect(() => {
    fetchList();
  }, [fetchList]);
  
  // 状态筛选
  const handleStatusFilter = (status) => {
    updateFilters({ status });
    fetchList({ status });
  };
  
  return (
    <div>
      <Select value={filters.status} onChange={handleStatusFilter}>
        <Option value="all">全部状态</Option>
        <Option value="not_started">未开始</Option>
        <Option value="in_progress">进行中</Option>
        <Option value="completed">已完成</Option>
        <Option value="failed">失败</Option>
      </Select>
      
      <Table
        loading={loading}
        dataSource={projects}
        columns={[
          { title: '项目名称', dataIndex: 'name' },
          { 
            title: '进度', 
            dataIndex: 'progress',
            render: (progress, record) => (
              record.status === 'in_progress' ? (
                <Progress percent={progress} size="small" />
              ) : (
                <Tag color={getStatusColor(record.status)}>
                  {getStatusText(record.status)}
                </Tag>
              )
            )
          }
        ]}
      />
    </div>
  );
};
```

---

### 4.2 创建分析项目

```javascript
import { analysisApi } from '../api/analysis';

// 步骤1: 创建基础项目
const handleCreateProject = async (step1Data) => {
  const { projectName, description, selectedDatasets, selectedTemplate } = step1Data;
  
  try {
    const project = await analysisApi.createProject({
      name: projectName,
      description,
      datasetIds: selectedDatasets.map(d => d.id),
      templateId: selectedTemplate?.id
    });
    
    // 保存项目ID，进入下一步
    localStorage.setItem('currentProjectId', project.id);
    navigate(`/analysis/create?projectId=${project.id}&step=2`);
    
    return project;
  } catch (error) {
    return null;
  }
};

// 完整的多步骤创建流程
const CreateAnalysisWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [projectId, setProjectId] = useState(null);
  
  // 步骤1: 基础信息
  const handleStep1Submit = async (values) => {
    const project = await analysisApi.createProject(values);
    setProjectId(project.id);
    setCurrentStep(1);
  };
  
  // 步骤2: 图像矫正 (跳过或完成)
  const handleStep2Complete = async (correctionData) => {
    await analysisApi.updateProject(projectId, {
      correctionData
    });
    setCurrentStep(2);
  };
  
  // 步骤3: 区域定义
  const handleStep3Complete = async (regionsData) => {
    await analysisApi.updateProject(projectId, {
      regions: regionsData
    });
    setCurrentStep(3);
  };
  
  // 步骤4: 分析配置
  const handleStep4Submit = async (configData) => {
    await analysisApi.saveAnalysisConfig(projectId, {
      imageAnalysisConfig: configData
    });
    
    // 提交分析任务
    await analysisApi.submitAnalysis(projectId);
    
    message.success('分析项目创建成功，开始分析');
    navigate('/analysis');
  };
  
  // 保存草稿（断点续传）
  const handleSaveDraft = async () => {
    const draftData = {
      id: projectId,
      step: currentStep,
      // ... 所有步骤的数据
    };
    await analysisApi.saveIncompleteProject(draftData);
    message.success('进度已保存');
  };
  
  return (
    <Steps current={currentStep}>
      <Step title="选择数据集" />
      <Step title="图像矫正" />
      <Step title="区域定义" />
      <Step title="分析配置" />
    </Steps>
  );
};
```

---

### 4.3 获取分析进度

```javascript
import { analysisApi } from '../api/analysis';

// 使用轮询获取进度
const useAnalysisProgress = (projectId) => {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('not_started');
  
  useEffect(() => {
    if (!projectId) return;
    
    const fetchProgress = async () => {
      try {
        const data = await analysisApi.getProjectProgress(projectId);
        setProgress(data.progress);
        setStatus(data.status);
        
        // 如果还在分析中，继续轮询
        if (data.status === 'in_progress') {
          setTimeout(fetchProgress, 2000);
        } else if (data.status === 'completed') {
          message.success('分析完成');
        }
      } catch (error) {
        console.error('获取进度失败:', error);
      }
    };
    
    fetchProgress();
  }, [projectId]);
  
  return { progress, status };
};

// 在组件中使用
const ProgressDisplay = ({ projectId }) => {
  const { progress, status } = useAnalysisProgress(projectId);
  
  return (
    <div>
      <Progress percent={progress} status={getProgressStatus(status)} />
      <p>状态: {getStatusText(status)}</p>
    </div>
  );
};

// WebSocket 版本（如果后端支持）
const useAnalysisProgressWS = (projectId) => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:5000/ws/analysis/${projectId}`);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setProgress(data.progress);
      
      if (data.status === 'completed') {
        message.success('分析完成');
        ws.close();
      }
    };
    
    return () => ws.close();
  }, [projectId]);
  
  return progress;
};
```

---

### 4.4 重新分析

```javascript
import { analysisApi } from '../api/analysis';

const handleRestartAnalysis = (project) => {
  Modal.confirm({
    title: '重新分析确认',
    content: `确定要重新分析项目 "${project.name}" 吗？之前的分析结果将被清空。`,
    onOk: async () => {
      try {
        await analysisApi.restartAnalysis(project.id);
        message.success('已开始重新分析');
        
        // 开始轮询进度
        startProgressPolling(project.id);
      } catch (error) {
        message.error('重新分析失败');
      }
    }
  });
};
```

---

### 4.5 断点续传 - 保存和恢复

```javascript
import { analysisApi } from '../api/analysis';

// 自动保存草稿
const useAutoSave = (projectId, data) => {
  useEffect(() => {
    if (!projectId) return;
    
    const interval = setInterval(async () => {
      try {
        await analysisApi.saveIncompleteProject({
          id: projectId,
          ...data,
          lastSaved: new Date().toISOString()
        });
      } catch (error) {
        console.error('自动保存失败:', error);
      }
    }, 30000); // 每30秒自动保存
    
    return () => clearInterval(interval);
  }, [projectId, data]);
};

// 恢复未完成的项目
const RestoreProjectButton = ({ projectId, onRestore }) => {
  const handleRestore = async () => {
    try {
      const data = await analysisApi.restoreIncompleteProject(projectId);
      onRestore(data); // 将恢复的数据传递给父组件
      message.success('已恢复上次进度');
    } catch (error) {
      message.error('恢复失败');
    }
  };
  
  return (
    <Button onClick={handleRestore}>
      继续上次未完成的创建
    </Button>
  );
};
```

---

## 5. 模板模块 (Template)

### 5.1 获取模板列表

```javascript
import { templateApi } from '../api/template';

const TemplateSelector = ({ onSelect }) => {
  const { 
    list: templates, 
    loading, 
    pagination,
    fetchList 
  } = useListApi(templateApi.getTemplates);
  
  useEffect(() => {
    fetchList();
  }, [fetchList]);
  
  return (
    <List
      loading={loading}
      grid={{ gutter: 16, column: 3 }}
      dataSource={templates}
      renderItem={template => (
        <List.Item>
          <Card
            hoverable
            cover={<img alt={template.name} src={template.templateImage} />}
            onClick={() => onSelect(template)}
          >
            <Card.Meta 
              title={template.name}
              description={template.description}
            />
            <Tag>分析方法: {template.analysisMethods?.length || 0}个</Tag>
          </Card>
        </List.Item>
      )}
      pagination={pagination}
    />
  );
};
```

---

### 5.2 上传模板

```javascript
import { templateApi } from '../api/template';

const UploadTemplateModal = ({ visible, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  
  const handleUpload = async (values) => {
    if (fileList.length === 0) {
      message.error('请选择模板图片');
      return;
    }
    
    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('description', values.description);
      formData.append('templateImage', fileList[0].originFileObj);
      
      // 分析方法配置
      const analysisMethods = [
        { name: '线条粗细', enabled: values.lineThickness, description: '检测线条粗细' },
        { name: '颜色分布', enabled: values.colorDistribution, description: '分析颜色使用' }
      ];
      formData.append('analysisMethods', JSON.stringify(analysisMethods));
      
      await templateApi.uploadTemplate(formData);
      
      message.success('模板上传成功');
      form.resetFields();
      setFileList([]);
      onClose();
      onSuccess?.();
    } catch (error) {
      message.error('上传失败');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal
      title="上传模板"
      open={visible}
      onCancel={onClose}
      onOk={() => form.submit()}
      confirmLoading={uploading}
    >
      <Form form={form} onFinish={handleUpload}>
        <Form.Item
          name="name"
          label="模板名称"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        
        <Form.Item name="description" label="描述">
          <Input.TextArea />
        </Form.Item>
        
        <Form.Item label="模板图片" required>
          <Upload
            accept=".jpg,.jpeg,.png"
            fileList={fileList}
            beforeUpload={() => false}
            onChange={({ fileList }) => setFileList(fileList.slice(0, 1))}
            listType="picture"
          >
            {fileList.length === 0 && (
              <Button icon={<UploadOutlined />}>选择图片</Button>
            )}
          </Upload>
        </Form.Item>
        
        <Form.Item name="lineThickness" valuePropName="checked">
          <Checkbox>启用线条粗细分析</Checkbox>
        </Form.Item>
        
        <Form.Item name="colorDistribution" valuePropName="checked">
          <Checkbox>启用颜色分布分析</Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  );
};
```

---

### 5.3 删除模板

```javascript
import { templateApi } from '../api/template';

const handleDeleteTemplate = (template) => {
  Modal.confirm({
    title: '删除模板',
    content: `确定删除模板 "${template.name}" 吗？`,
    onOk: async () => {
      await templateApi.deleteTemplate(template.id);
      message.success('模板已删除');
      fetchList();
    }
  });
};

// 批量删除
const handleBatchDeleteTemplates = async (selectedIds) => {
  await templateApi.batchDeleteTemplates(selectedIds);
  message.success(`已删除 ${selectedIds.length} 个模板`);
};
```

---

## 6. 工具模块 (Tool)

### 6.1 边缘检测

```javascript
import { toolApi } from '../api/tool';

// 使用已上传的图片URL
const performEdgeDetection = async (imageUrl) => {
  try {
    message.loading('正在检测边缘...', 0);
    
    const result = await toolApi.detectEdges({
      imageUrl,
      sensitivity: 70
    });
    
    message.destroy();
    message.success(`检测到 ${result.regions.length} 个区域`);
    
    return result.regions;
  } catch (error) {
    message.destroy();
    message.error('检测失败');
    return [];
  }
};

// 直接上传图片检测
const uploadAndDetect = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('sensitivity', '70');
  
  const result = await toolApi.uploadAndDetectEdges(formData);
  return result.regions;
};

// 在组件中使用
const EdgeDetectionTool = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [regions, setRegions] = useState([]);
  const [detecting, setDetecting] = useState(false);
  
  const handleDetect = async () => {
    if (!imageUrl) {
      message.warning('请先上传图片');
      return;
    }
    
    setDetecting(true);
    const detectedRegions = await performEdgeDetection(imageUrl);
    setRegions(detectedRegions);
    setDetecting(false);
  };
  
  // 保存区域
  const handleSaveRegions = async () => {
    await toolApi.saveDetectedRegions({
      imageId: 'image-123',
      regions
    });
    message.success('区域已保存');
  };
  
  return (
    <div>
      <Upload onChange={({ file }) => setImageUrl(file.url)}>
        <Button>上传图片</Button>
      </Upload>
      
      <Button 
        type="primary" 
        onClick={handleDetect}
        loading={detecting}
        disabled={!imageUrl}
      >
        自动检测边缘
      </Button>
      
      <Button onClick={handleSaveRegions} disabled={regions.length === 0}>
        保存区域
      </Button>
    </div>
  );
};
```

---

### 6.2 图像矫正

```javascript
import { toolApi } from '../api/tool';

// 透视矫正
const correctPerspective = async (imageUrl, points) => {
  const result = await toolApi.correctPerspective({
    imageUrl,
    referencePoints: points
  });
  return result.correctedImageUrl;
};

// 旋转矫正
const correctRotation = async (imageUrl, rotation) => {
  const result = await toolApi.correctRotation({
    imageUrl,
    rotation
  });
  return result.correctedImageUrl;
};

// 模板自动矫正
const autoCorrect = async (imageFile, templateId) => {
  message.loading('正在自动矫正...', 0);
  
  try {
    const result = await toolApi.autoCorrectWithTemplate({
      imageFile,
      templateId
    });
    
    message.destroy();
    message.success(`矫正完成，匹配度: ${(result.matchScore * 100).toFixed(1)}%`);
    
    return result.correctedImageUrl;
  } catch (error) {
    message.destroy();
    message.error('自动矫正失败');
    return null;
  }
};

// 下载矫正后的图片
const downloadCorrected = async (correctedImageUrl) => {
  const blob = await toolApi.downloadCorrectedImage(correctedImageUrl);
  
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'corrected_image.jpg';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
```

---

## 7. 报告模块 (Report)

### 7.1 获取全局汇总报告

```javascript
import { reportApi } from '../api/report';

const GlobalReportPage = ({ projectId }) => {
  const { data: report, loading, execute: fetchReport } = useApi(
    () => reportApi.getGlobalSummary(projectId)
  );
  
  useEffect(() => {
    fetchReport();
  }, [projectId, fetchReport]);
  
  if (loading) return <Spin />;
  
  return (
    <div>
      <h1>{report?.projectInfo?.name}</h1>
      <p>分析图片数: {report?.projectInfo?.totalImages}</p>
      
      <Card title="汇总统计">
        <Statistic title="平均颜色使用率" value={report?.summaryStatistics?.avgColorUsage} suffix="%" />
        <Statistic title="平均覆盖率" value={report?.summaryStatistics?.avgCoverage} suffix="%" />
      </Card>
      
      <Table 
        dataSource={report?.imageResults}
        columns={[
          { title: '图片', dataIndex: 'name' },
          { title: '颜色数', dataIndex: 'colorCount' },
          { title: '颜色使用率', dataIndex: 'colorUsage' },
          { title: '覆盖率', dataIndex: 'coverage' }
        ]}
      />
    </div>
  );
};
```

---

### 7.2 导出报告

```javascript
import { reportApi } from '../api/report';

// 导出全局报告
const exportGlobalReport = async (projectId, format) => {
  message.loading('正在生成报告...', 0);
  
  try {
    const blob = await reportApi.exportGlobalReport(projectId, format);
    message.destroy();
    
    // 下载文件
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `report_${projectId}.${format === 'excel' ? 'xlsx' : format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    message.success('导出成功');
  } catch (error) {
    message.destroy();
    message.error('导出失败');
  }
};

// 导出单张图片报告
const exportSingleImageReport = async (projectId, imageId, format) => {
  const blob = await reportApi.exportSingleImageReport(projectId, imageId, format);
  // 同上，下载文件
};

// 批量导出
const batchExport = async (projectId, imageIds, format) => {
  const blob = await reportApi.batchExportReports(projectId, {
    imageIds,
    format
  });
  // 下载 zip 文件
};

// 使用组件
const ExportButtons = ({ projectId }) => {
  const [format, setFormat] = useState('excel');
  const [exporting, setExporting] = useState(false);
  
  const handleExport = async () => {
    setExporting(true);
    await exportGlobalReport(projectId, format);
    setExporting(false);
  };
  
  return (
    <Space>
      <Select value={format} onChange={setFormat}>
        <Option value="excel">Excel</Option>
        <Option value="csv">CSV</Option>
        <Option value="pdf">PDF</Option>
        <Option value="json">JSON</Option>
      </Select>
      
      <Button onClick={handleExport} loading={exporting}>
        导出报告
      </Button>
    </Space>
  );
};
```

---

### 7.3 获取单张图片报告

```javascript
import { reportApi } from '../api/report';

const SingleImageReport = ({ projectId, imageId }) => {
  const { data: report, loading } = useApi(
    () => reportApi.getSingleImageReport(projectId, imageId)
  );
  
  if (loading) return <Spin />;
  
  return (
    <div>
      <h2>{report?.imageInfo?.name}</h2>
      
      <Image src={report?.imageInfo?.analysisImage} />
      
      <Card title="基础分析">
        <p>颜色数量: {report?.basicAnalysis?.colorCount}</p>
        <p>颜色使用率: {report?.basicAnalysis?.colorUsage}%</p>
        <p>覆盖率: {report?.basicAnalysis?.coverage}%</p>
      </Card>
      
      <Card title="区域分析">
        {report?.regionAnalysis?.regions?.map(region => (
          <div key={region.name}>
            <h4>{region.name}</h4>
            <p>颜色: {region.color}</p>
            <p>占比: {region.areaPercentage}%</p>
            <p>出界率: {region.outOfBoundsRate}%</p>
          </div>
        ))}
      </Card>
    </div>
  );
};
```

---

## 附录：常用工具函数

```javascript
// 下载 Blob 文件
export const downloadBlob = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

// 状态颜色映射
export const getStatusColor = (status) => {
  const map = {
    'not_started': 'default',
    'in_progress': 'processing',
    'completed': 'success',
    'failed': 'error'
  };
  return map[status] || 'default';
};

export const getStatusText = (status) => {
  const map = {
    'not_started': '未开始',
    'in_progress': '进行中',
    'completed': '已完成',
    'failed': '失败'
  };
  return map[status] || status;
};

// 格式化文件大小
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// 防抖搜索
export const useDebounceSearch = (callback, delay = 500) => {
  const timeoutRef = useRef(null);
  
  return (value) => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      callback(value);
    }, delay);
  };
};
```

---

## 总结

所有 API 调用示例都遵循以下模式：

1. **直接使用 API**：`await apiModule.methodName(params)`
2. **使用自定义 Hook**（推荐）：`useApi`, `useListApi`, `useSubmitApi`
3. **错误处理**：统一在 axios 拦截器中处理
4. **加载状态**：使用 Hook 自动管理 loading
5. **消息提示**：成功/失败自动显示消息

更多详细说明请参考 `src/api/README.md`
