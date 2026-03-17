import React, { useState } from 'react';
import {
  Card, Typography, Tag, Input, Dropdown, Modal, message, Button,
  Upload, Form, Select, Row, Col, Space, Checkbox, Table, Pagination,
  Empty, Image, Grid
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined,
  DownOutlined, EyeOutlined, ArrowLeftOutlined, UploadOutlined,
  InboxOutlined, FolderOpenOutlined, SortAscendingOutlined,
  SortDescendingOutlined, CalendarOutlined, FileImageOutlined,
  PictureOutlined, CheckCircleOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { colors, styles } from '../../components/common/constants';
import templateImage from '../../assets/template.png';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { Dragger } = Upload;
const { useBreakpoint } = Grid;

// ==================== 模拟数据 ====================

// 分组名称映射
const groupNameMap = {
  1: '小花幼儿园',
  2: '小草幼儿园',
  3: '小树幼儿园'
};

// 场景选项
const scenarioOptions = [
  '儿童发展评估',
  '教育研究',
  '精细控制能力评估',
  '色彩认知研究',
  '其他'
];

// 模拟数据集数据 - 与分组多对多关系
const initialDatasets = [
  {
    id: 1,
    name: '桃花大班第一次涂色',
    description: '桃花幼儿园大班小朋友的第一次涂色作品',
    imageCount: 120,
    createTime: '2025-10-12 09:30:00',
    year: 2025,
    creator: '张老师',
    scenario: '儿童发展评估',
    groupIds: [1]
  },
  {
    id: 2,
    name: '桃花大班第二次涂色',
    description: '桃花幼儿园大班小朋友的第二次涂色作品',
    imageCount: 115,
    createTime: '2025-10-15 14:20:00',
    year: 2025,
    creator: '李老师',
    scenario: '精细控制能力评估',
    groupIds: [1]
  },
  {
    id: 3,
    name: '桃花大班创意涂色',
    description: '桃花幼儿园大班小朋友创意涂色作品集',
    imageCount: 98,
    createTime: '2025-10-20 10:00:00',
    year: 2025,
    creator: '王老师',
    scenario: '教育研究',
    groupIds: [1]
  },
  {
    id: 4,
    name: '桃花大班期末评估',
    description: '桃花幼儿园大班期末涂色评估作品',
    imageCount: 132,
    createTime: '2025-11-01 16:45:00',
    year: 2025,
    creator: '张老师',
    scenario: '儿童发展评估',
    groupIds: [1]
  },
  {
    id: 5,
    name: '小草中班日常涂色',
    description: '小草幼儿园中班日常涂色练习',
    imageCount: 86,
    createTime: '2025-09-10 08:30:00',
    year: 2025,
    creator: '赵老师',
    scenario: '日常记录',
    groupIds: [2]
  },
  {
    id: 6,
    name: '小草中班期末评估',
    description: '小草幼儿园中班期末涂色评估',
    imageCount: 92,
    createTime: '2025-12-20 11:00:00',
    year: 2025,
    creator: '赵老师',
    scenario: '儿童发展评估',
    groupIds: [2]
  },
  {
    id: 7,
    name: '小树大班涂色作品集',
    description: '小树幼儿园大班全年涂色作品合集',
    imageCount: 156,
    createTime: '2024-11-05 09:00:00',
    year: 2024,
    creator: '陈老师',
    scenario: '教育研究',
    groupIds: [3]
  },
  {
    id: 8,
    name: '2024秋季学期评估汇总',
    description: '2024年秋季学期全园涂色评估汇总',
    imageCount: 234,
    createTime: '2024-12-25 15:30:00',
    year: 2024,
    creator: '刘老师',
    scenario: '儿童发展评估',
    groupIds: [1, 2, 3]
  },
];

// 模拟图片数据 - 使用 template.png 作为默认图片
const generateMockImages = (datasetId, count) => {
  return Array.from({ length: count }, (_, i) => ({
    id: `${datasetId}-${i + 1}`,
    name: `image_${String(i + 1).padStart(3, '0')}.jpg`,
    url: templateImage,
    thumbnailUrl: templateImage,
    uploadTime: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleString(),
    size: Math.floor(Math.random() * 5 * 1024 * 1024) + 1024 * 1024, // 1-6MB
  }));
};

// ==================== 主组件 ====================

const DatasetListPage = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const screens = useBreakpoint();

  // -------------------- 状态管理 --------------------
  const [datasets, setDatasets] = useState(initialDatasets);
  const [datasetImages, setDatasetImages] = useState({}); // 存储各数据集的图片 {datasetId: images[]}

  // 列表展示状态
  const [activeYear, setActiveYear] = useState('all');
  const [searchValue, setSearchValue] = useState('');
  const [sortField, setSortField] = useState('createTime');
  const [sortOrder, setSortOrder] = useState('desc');

  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  // 选择状态
  const [selectedDatasets, setSelectedDatasets] = useState([]);

  // 弹窗状态
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [currentDataset, setCurrentDataset] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // 详情弹窗内的状态
  const [selectedImages, setSelectedImages] = useState([]); // 选中的图片ID
  const [detailUploadFileList, setDetailUploadFileList] = useState([]); // 详情弹窗上传文件列表
  const [isUploading, setIsUploading] = useState(false);

  // 上传状态
  const [fileList, setFileList] = useState([]);

  const [form] = Form.useForm();

  // 当前登录用户
  const currentUser = '当前用户';

  // 分组名称
  const groupName = groupId ? (groupNameMap[groupId] || '未知分组') : '全部数据集';

  // -------------------- 计算属性 --------------------

  // 筛选当前分组的数据集
  const groupDatasets = groupId
    ? datasets.filter(ds => ds.groupIds.includes(Number(groupId)))
    : datasets;

  // 年份+搜索筛选
  const filteredDatasets = groupDatasets.filter(dataset => {
    const matchYear = activeYear === 'all' || dataset.year === Number(activeYear);
    const matchSearch = searchValue === '' ||
      dataset.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      dataset.description?.toLowerCase().includes(searchValue.toLowerCase()) ||
      dataset.creator?.toLowerCase().includes(searchValue.toLowerCase()) ||
      dataset.scenario?.toLowerCase().includes(searchValue.toLowerCase());
    return matchYear && matchSearch;
  });

  // 排序
  const sortedDatasets = [...filteredDatasets].sort((a, b) => {
    let comparison = 0;
    if (sortField === 'createTime') {
      comparison = new Date(a.createTime) - new Date(b.createTime);
    } else if (sortField === 'name') {
      comparison = a.name.localeCompare(b.name, 'zh-CN');
    } else if (sortField === 'imageCount') {
      comparison = a.imageCount - b.imageCount;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // 分页数据
  const paginatedDatasets = sortedDatasets.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // 总页数
  const totalCount = sortedDatasets.length;

  // -------------------- 事件处理 --------------------

  // 创建数据集
  const handleCreateDataset = (values) => {
    const newDataset = {
      id: Date.now(),
      name: values.name,
      description: values.description,
      scenario: values.scenario,
      imageCount: fileList.length,
      createTime: new Date().toLocaleString(),
      year: new Date().getFullYear(),
      creator: currentUser,
      groupIds: groupId ? [Number(groupId)] : []
    };

    // 保存图片信息
    if (fileList.length > 0) {
      const newImages = fileList.map((file, index) => ({
        id: `${newDataset.id}-${index + 1}`,
        name: file.name,
        url: templateImage,
        thumbnailUrl: templateImage,
        uploadTime: new Date().toLocaleString(),
        size: file.size
      }));
      setDatasetImages({ ...datasetImages, [newDataset.id]: newImages });
    }

    setDatasets([...datasets, newDataset]);
    setIsCreateModalVisible(false);
    form.resetFields();
    setFileList([]);
    message.success(`数据集 "${values.name}" 创建成功，共上传 ${fileList.length} 张图片`);
  };

  // 编辑数据集
  const handleEditDataset = (values) => {
    setDatasets(datasets.map(ds =>
      ds.id === currentDataset.id
        ? { ...ds, name: values.name, description: values.description, scenario: values.scenario }
        : ds
    ));
    setIsEditModalVisible(false);
    setCurrentDataset(null);
    form.resetFields();
    message.success('数据集修改成功');
  };

  // 删除数据集
  const handleDeleteDataset = () => {
    const newDatasets = datasets.filter(ds => ds.id !== currentDataset.id);
    const newDatasetImages = { ...datasetImages };
    delete newDatasetImages[currentDataset.id];
    setDatasets(newDatasets);
    setDatasetImages(newDatasetImages);
    setIsDeleteModalVisible(false);
    setCurrentDataset(null);
    message.success('数据集删除成功');
  };

  // 批量删除
  const handleBatchDelete = () => {
    if (selectedDatasets.length === 0) {
      message.warning('请选择要删除的数据集');
      return;
    }

    Modal.confirm({
      title: '批量删除确认',
      content: `确定要删除选中的 ${selectedDatasets.length} 个数据集吗？删除后将同时删除旗下所有图片，此操作不可恢复。`,
      okText: '删除',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk: () => {
        const newDatasets = datasets.filter(ds => !selectedDatasets.includes(ds.id));
        const newDatasetImages = { ...datasetImages };
        selectedDatasets.forEach(id => delete newDatasetImages[id]);
        setDatasets(newDatasets);
        setDatasetImages(newDatasetImages);
        setSelectedDatasets([]);
        message.success('批量删除成功');
      }
    });
  };

  // 全选/取消全选
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedDatasets(filteredDatasets.map(ds => ds.id));
    } else {
      setSelectedDatasets([]);
    }
  };

  // 打开编辑弹窗
  const openEditModal = (dataset) => {
    setCurrentDataset(dataset);
    form.setFieldsValue({
      name: dataset.name,
      description: dataset.description,
      scenario: dataset.scenario
    });
    setIsEditModalVisible(true);
  };

  // 打开删除弹窗
  const openDeleteModal = (dataset) => {
    setCurrentDataset(dataset);
    setIsDeleteModalVisible(true);
  };

  // 打开详情弹窗
  const openDetailModal = (dataset) => {
    setCurrentDataset(dataset);
    // 如果没有加载过图片，生成模拟图片（显示所有图片）
    if (!datasetImages[dataset.id]) {
      const images = generateMockImages(dataset.id, dataset.imageCount);
      setDatasetImages({ ...datasetImages, [dataset.id]: images });
    }
    setSelectedImages([]);
    setDetailUploadFileList([]);
    setIsDetailModalVisible(true);
  };

  // 关闭详情弹窗
  const closeDetailModal = () => {
    setIsDetailModalVisible(false);
    setCurrentDataset(null);
    setPreviewImage(null);
    setSelectedImages([]);
    setDetailUploadFileList([]);
  };

  // 处理图片选择
  const handleSelectImage = (imageId, checked) => {
    if (checked) {
      setSelectedImages([...selectedImages, imageId]);
    } else {
      setSelectedImages(selectedImages.filter(id => id !== imageId));
    }
  };

  // 全选/取消全选图片
  const handleSelectAllImages = (checked) => {
    const images = datasetImages[currentDataset?.id] || [];
    if (checked) {
      setSelectedImages(images.map(img => img.id));
    } else {
      setSelectedImages([]);
    }
  };

  // 批量删除图片
  const handleBatchDeleteImages = () => {
    if (selectedImages.length === 0) {
      message.warning('请选择要删除的图片');
      return;
    }

    Modal.confirm({
      title: '批量删除图片确认',
      content: `确定要删除选中的 ${selectedImages.length} 张图片吗？此操作不可恢复。`,
      okText: '删除',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk: () => {
        const images = datasetImages[currentDataset.id] || [];
        const newImages = images.filter(img => !selectedImages.includes(img.id));
        setDatasetImages({ ...datasetImages, [currentDataset.id]: newImages });
        setDatasets(datasets.map(ds =>
          ds.id === currentDataset.id ? { ...ds, imageCount: newImages.length } : ds
        ));
        setCurrentDataset({ ...currentDataset, imageCount: newImages.length });
        setSelectedImages([]);
        message.success(`成功删除 ${selectedImages.length} 张图片`);
      }
    });
  };

  // 批量添加图片到数据集
  const handleAddImagesToDataset = () => {
    if (detailUploadFileList.length === 0) {
      message.warning('请先选择要上传的图片');
      return;
    }

    setIsUploading(true);

    // 模拟上传延迟
    setTimeout(() => {
      const currentImages = datasetImages[currentDataset.id] || [];
      const newImages = detailUploadFileList.map((file, index) => ({
        id: `${currentDataset.id}-${Date.now()}-${index}`,
        name: file.name,
        url: templateImage,
        thumbnailUrl: templateImage,
        uploadTime: new Date().toLocaleString(),
        size: file.size
      }));

      const updatedImages = [...currentImages, ...newImages];
      setDatasetImages({ ...datasetImages, [currentDataset.id]: updatedImages });
      setDatasets(datasets.map(ds =>
        ds.id === currentDataset.id ? { ...ds, imageCount: updatedImages.length } : ds
      ));
      setCurrentDataset({ ...currentDataset, imageCount: updatedImages.length });
      setDetailUploadFileList([]);
      setIsUploading(false);
      message.success(`成功添加 ${newImages.length} 张图片`);
    }, 1000);
  };

  // 处理排序
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  // 返回分组列表
  const goBack = () => {
    navigate('/dataset');
  };

  // 创建数据集上传配置
  const uploadProps = {
    name: 'file',
    multiple: true,
    accept: '.jpg,.jpeg,.png,.JPG,.JPEG,.PNG',
    fileList,
    beforeUpload: (file) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error(`${file.name} 不是 JPG/PNG 格式的图片文件!`);
        return false;
      }
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error(`${file.name} 超过 10MB 大小限制!`);
        return false;
      }
      return false; // 阻止自动上传
    },
    onChange: (info) => {
      setFileList(info.fileList.slice(0, 50)); // 最多50张
    },
    onRemove: (file) => {
      setFileList(fileList.filter(item => item.uid !== file.uid));
    }
  };

  // 详情弹窗上传配置
  const detailUploadProps = {
    name: 'file',
    multiple: true,
    accept: '.jpg,.jpeg,.png,.JPG,.JPEG,.PNG',
    fileList: detailUploadFileList,
    showUploadList: false,
    beforeUpload: (file) => {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error(`${file.name} 不是 JPG/PNG 格式的图片文件!`);
        return false;
      }
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error(`${file.name} 超过 10MB 大小限制!`);
        return false;
      }
      return false; // 阻止自动上传
    },
    onChange: (info) => {
      setDetailUploadFileList(info.fileList.slice(0, 50));
    }
  };

  // -------------------- 表格列定义 --------------------

  const columns = [
    {
      title: '数据集名称',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <PictureOutlined style={{ color: colors.primary }} />
          <div>
            <Text strong style={{ color: colors.textPrimary }}>{text}</Text>
            <div>
              <Text type="secondary" style={{ fontSize: 12 }} ellipsis={{ tooltip: record.description }}>
                {record.description}
              </Text>
            </div>
          </div>
        </div>
      ),
      sorter: true,
      onHeaderCell: () => ({
        onClick: () => handleSort('name')
      })
    },
    {
      title: '所属场景',
      dataIndex: 'scenario',
      key: 'scenario',
      width: 140,
      render: (scenario) => <Tag color="blue">{scenario}</Tag>
    },
    {
      title: '图片数量',
      dataIndex: 'imageCount',
      key: 'imageCount',
      width: 100,
      align: 'center',
      render: (count) => (
        <Space>
          <FileImageOutlined style={{ color: colors.textTertiary }} />
          <Text>{count}</Text>
        </Space>
      ),
      sorter: true,
      onHeaderCell: () => ({
        onClick: () => handleSort('imageCount')
      })
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      key: 'creator',
      width: 100,
      render: (creator) => <Tag color="green">{creator}</Tag>
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 160,
      render: (time) => (
        <Space>
          <CalendarOutlined style={{ color: colors.textTertiary }} />
          <Text style={{ fontSize: 13 }}>{time}</Text>
        </Space>
      ),
      sorter: true,
      onHeaderCell: () => ({
        onClick: () => handleSort('createTime')
      })
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => openDetailModal(record)}
          >
            预览
          </Button>
          <Dropdown menu={{
            items: [
              { key: 'edit', icon: <EditOutlined />, label: '编辑', onClick: () => openEditModal(record) },
              { key: 'delete', icon: <DeleteOutlined />, label: '删除', danger: true, onClick: () => openDeleteModal(record) }
            ]
          }}>
            <Button type="text" icon={<DownOutlined />} />
          </Dropdown>
        </Space>
      )
    }
  ];

  // 表格行选择配置
  const rowSelection = {
    selectedRowKeys: selectedDatasets,
    onChange: (selectedKeys) => setSelectedDatasets(selectedKeys),
  };

  // -------------------- 渲染 --------------------

  // 获取当前数据集的图片
  const currentImages = currentDataset ? (datasetImages[currentDataset.id] || []) : [];

  return (
    <div style={{ width: '100%', height: '100%', padding: '0 24px 24px' }}>
      {/* 面包屑导航 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: 24,
        padding: '8px 0'
      }}>
        <ArrowLeftOutlined
          style={{
            marginRight: 8,
            cursor: 'pointer',
            color: colors.textSecondary,
            fontSize: 16
          }}
          onClick={goBack}
        />
        <FolderOpenOutlined style={{ marginRight: 8, color: colors.primary }} />
        <Text style={{ fontSize: 16, color: colors.textPrimary, fontWeight: 500 }}>
          {groupName}
        </Text>
        <Text type="secondary" style={{ marginLeft: 12 }}>
          共 {filteredDatasets.length} 个数据集
        </Text>
      </div>

      {/* 筛选和工具栏 */}
      <div style={{
        marginBottom: 20,
        display: 'flex',
        flexDirection: screens.xs ? 'column' : 'row',
        alignItems: screens.xs ? 'flex-start' : 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* 左侧：年份筛选 */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {['all', 2025, 2024, 2023].map(item => (
            <Tag
              key={item}
              onClick={() => { setActiveYear(item.toString()); setCurrentPage(1); }}
              style={{
                cursor: 'pointer',
                padding: '6px 16px',
                borderRadius: styles.borderRadius.md,
                border: 'none',
                backgroundColor: activeYear === item.toString() ? colors.primaryLight : colors.neutralLight,
                color: activeYear === item.toString() ? colors.primary : colors.textSecondary,
                fontSize: 14,
                fontWeight: activeYear === item.toString() ? 500 : 400,
                transition: styles.transition
              }}
            >
              {item === 'all' ? '全部年份' : `${item}年`}
            </Tag>
          ))}

          {/* 排序按钮 */}
          <Space style={{ marginLeft: 16 }}>
            <Button
              size="small"
              icon={sortOrder === 'asc' ? <SortAscendingOutlined /> : <SortDescendingOutlined />}
              onClick={() => handleSort(sortField)}
              style={{ borderRadius: styles.borderRadius.md }}
            >
              {sortField === 'createTime' ? '创建时间' : sortField === 'name' ? '名称' : '图片数'}
            </Button>
          </Space>

          {selectedDatasets.length > 0 && (
            <Text type="secondary" style={{ marginLeft: 8 }}>
              已选择 {selectedDatasets.length} 项
            </Text>
          )}
        </div>

        {/* 右侧：搜索和操作 */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Input
            placeholder="搜索数据集名称、描述、场景..."
            prefix={<SearchOutlined style={{ color: colors.textTertiary }} />}
            value={searchValue}
            onChange={(e) => { setSearchValue(e.target.value); setCurrentPage(1); }}
            style={{
              width: screens.xs ? '100%' : 280,
              borderRadius: styles.borderRadius.md,
              backgroundColor: colors.neutralLight,
              border: 'none'
            }}
            allowClear
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsCreateModalVisible(true)}
            style={{
              backgroundColor: colors.primary,
              borderRadius: styles.borderRadius.md,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            新建数据集
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={handleBatchDelete}
            disabled={selectedDatasets.length === 0}
            style={{ borderRadius: styles.borderRadius.md }}
          >
            批量删除
          </Button>
        </div>
      </div>

      {/* 数据集表格 */}
      <Card
        style={{
          borderRadius: styles.borderRadius.lg,
          border: 'none',
          boxShadow: styles.shadow.sm
        }}
        bodyStyle={{ padding: 0 }}
      >
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={paginatedDatasets}
          rowKey="id"
          pagination={false}
          size="middle"
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <div>
                    <Text style={{ color: colors.textSecondary }}>暂无数据集</Text>
                    <div style={{ marginTop: 16 }}>
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setIsCreateModalVisible(true)}
                        style={{ backgroundColor: colors.primary }}
                      >
                        创建数据集
                      </Button>
                    </div>
                  </div>
                }
              />
            )
          }}
        />

        {/* 分页 */}
        <div style={{
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: `1px solid ${colors.neutralDark}`
        }}>
          <Text type="secondary">
            共 {totalCount} 个数据集，{paginatedDatasets.reduce((sum, ds) => sum + ds.imageCount, 0)} 张图片
          </Text>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={totalCount}
            onChange={(page, size) => { setCurrentPage(page); setPageSize(size); }}
            onShowSizeChange={(page, size) => { setCurrentPage(page); setPageSize(size); }}
            showSizeChanger
            showQuickJumper
            pageSizeOptions={[12, 24, 48, 96]}
            showTotal={(total) => `共 ${total} 条`}
          />
        </div>
      </Card>

      {/* ==================== 创建数据集弹窗 ==================== */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <PlusOutlined style={{ color: colors.primary }} />
            <span>新建数据集</span>
          </div>
        }
        open={isCreateModalVisible}
        onCancel={() => {
          setIsCreateModalVisible(false);
          form.resetFields();
          setFileList([]);
        }}
        footer={null}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateDataset}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="数据集名称"
                rules={[{ required: true, message: '请输入数据集名称' }]}
              >
                <Input placeholder="请输入数据集名称，如：2025春季涂色作品集" maxLength={50} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="scenario"
                label="所属场景"
              >
                <Select placeholder="请选择所属场景（可选）" allowClear>
                  {scenarioOptions.map(scenario => (
                    <Option key={scenario} value={scenario}>{scenario}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="数据集描述"
            rules={[{ required: true, message: '请输入数据集描述' }]}
          >
            <TextArea
              rows={3}
              placeholder="请简要说明数据集内容、来源或用途"
              maxLength={500}
              showCount
            />
          </Form.Item>

          <Form.Item
            label="上传图片"
            extra={`支持 JPG、PNG 格式，单个文件不超过 10MB，最多上传 50 张。已选择 ${fileList.length} 张图片。`}
          >
            <Dragger {...uploadProps} style={{ borderRadius: styles.borderRadius.md }}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined style={{ color: colors.primary, fontSize: 48 }} />
              </p>
              <p className="ant-upload-text" style={{ color: colors.textPrimary, fontWeight: 500 }}>
                点击或拖拽文件到此区域上传
              </p>
              <p className="ant-upload-hint" style={{ color: colors.textSecondary }}>
                支持单张或批量上传图片文件
              </p>
            </Dragger>
          </Form.Item>

          {/* 已选文件预览 */}
          {fileList.length > 0 && (
            <div style={{
              marginBottom: 24,
              padding: 16,
              backgroundColor: colors.neutralLight,
              borderRadius: styles.borderRadius.md,
              maxHeight: 200,
              overflow: 'auto'
            }}>
              <Text strong style={{ display: 'block', marginBottom: 8 }}>
                已选择的文件 ({fileList.length})
              </Text>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {fileList.map(file => (
                  <Tag
                    key={file.uid}
                    closable
                    onClose={() => uploadProps.onRemove(file)}
                    style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                  >
                    {file.name}
                  </Tag>
                ))}
              </div>
            </div>
          )}

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => {
                setIsCreateModalVisible(false);
                form.resetFields();
                setFileList([]);
              }}>
                取消
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                style={{ backgroundColor: colors.primary }}
                disabled={fileList.length === 0}
              >
                创建数据集 ({fileList.length}张图片)
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* ==================== 编辑数据集弹窗 ==================== */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <EditOutlined style={{ color: colors.primary }} />
            <span>编辑数据集</span>
          </div>
        }
        open={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          setCurrentDataset(null);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleEditDataset}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="数据集名称"
                rules={[{ required: true, message: '请输入数据集名称' }]}
              >
                <Input placeholder="请输入数据集名称" maxLength={50} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="scenario"
                label="所属场景"
              >
                <Select placeholder="请选择所属场景" allowClear>
                  {scenarioOptions.map(scenario => (
                    <Option key={scenario} value={scenario}>{scenario}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="数据集描述"
            rules={[{ required: true, message: '请输入数据集描述' }]}
          >
            <TextArea
              rows={4}
              placeholder="请简要说明数据集内容、来源或用途"
              maxLength={500}
              showCount
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => {
                setIsEditModalVisible(false);
                setCurrentDataset(null);
                form.resetFields();
              }}>
                取消
              </Button>
              <Button type="primary" htmlType="submit" style={{ backgroundColor: colors.primary }}>
                保存修改
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* ==================== 数据集详情弹窗（图片预览+批量管理） ==================== */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <PictureOutlined style={{ color: colors.primary }} />
              <div>
                <Text strong style={{ fontSize: 16 }}>{currentDataset?.name}</Text>
                <div>
                  <Text type="secondary" style={{ fontSize: 13 }}>
                    {currentImages.length} 张图片 · 创建人：{currentDataset?.creator}
                  </Text>
                </div>
              </div>
            </div>
          </div>
        }
        open={isDetailModalVisible}
        onCancel={closeDetailModal}
        footer={null}
        width={1100}
        style={{ top: 24 }}
        bodyStyle={{ maxHeight: 'calc(100vh - 200px)', overflow: 'auto', padding: '16px 24px' }}
      >
        {currentDataset && (
          <>
            {/* 数据集信息 */}
            <div style={{
              padding: 16,
              backgroundColor: colors.neutralLight,
              borderRadius: styles.borderRadius.md,
              marginBottom: 24
            }}>
              <Text>{currentDataset.description}</Text>
              <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <Tag color="blue">{currentDataset.scenario}</Tag>
                <Tag color="green">{currentDataset.creator}</Tag>
                <Tag>{currentDataset.createTime}</Tag>
              </div>
            </div>

            {/* 批量操作工具栏 */}
            <div style={{
              marginBottom: 16,
              padding: 12,
              backgroundColor: colors.primaryLight,
              borderRadius: styles.borderRadius.md,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 12
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Checkbox
                  indeterminate={selectedImages.length > 0 && selectedImages.length < currentImages.length}
                  checked={selectedImages.length === currentImages.length && currentImages.length > 0}
                  onChange={(e) => handleSelectAllImages(e.target.checked)}
                >
                  全选 ({selectedImages.length}/{currentImages.length})
                </Checkbox>
                {selectedImages.length > 0 && (
                  <Text type="secondary">
                    已选择 {selectedImages.length} 张图片
                  </Text>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={handleBatchDeleteImages}
                  disabled={selectedImages.length === 0}
                  size="small"
                >
                  批量删除
                </Button>

                {/* 上传新图片 */}
                <Upload {...detailUploadProps}>
                  <Button
                    type="primary"
                    icon={<UploadOutlined />}
                    size="small"
                    style={{ backgroundColor: colors.primary }}
                  >
                    批量添加图片
                  </Button>
                </Upload>
              </div>
            </div>

            {/* 待上传文件预览 */}
            {detailUploadFileList.length > 0 && (
              <div style={{
                marginBottom: 16,
                padding: 16,
                backgroundColor: colors.secondaryLight,
                borderRadius: styles.borderRadius.md,
                border: `1px dashed ${colors.secondary}`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <Text strong style={{ color: colors.textPrimary }}>
                    <CheckCircleOutlined style={{ color: colors.success, marginRight: 8 }} />
                    待上传文件 ({detailUploadFileList.length} 张)
                  </Text>
                  <Space>
                    <Button
                      size="small"
                      onClick={() => setDetailUploadFileList([])}
                    >
                      清空
                    </Button>
                    <Button
                      type="primary"
                      size="small"
                      loading={isUploading}
                      onClick={handleAddImagesToDataset}
                      style={{ backgroundColor: colors.primary }}
                    >
                      确认添加
                    </Button>
                  </Space>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, maxHeight: 100, overflow: 'auto' }}>
                  {detailUploadFileList.map(file => (
                    <Tag
                      key={file.uid}
                      closable
                      onClose={() => setDetailUploadFileList(detailUploadFileList.filter(f => f.uid !== file.uid))}
                      style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                    >
                      {file.name}
                    </Tag>
                  ))}
                </div>
              </div>
            )}

            {/* 图片缩略图网格 */}
            {currentImages.length > 0 ? (
              <>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                  gap: 16
                }}>
                  {currentImages.map((image, index) => (
                    <div
                      key={image.id}
                      style={{
                        position: 'relative',
                        borderRadius: styles.borderRadius.md,
                        overflow: 'hidden',
                        boxShadow: selectedImages.includes(image.id)
                          ? `0 0 0 3px ${colors.primary}`
                          : styles.shadow.sm,
                        transition: styles.transition,
                        cursor: 'pointer'
                      }}
                    >
                      {/* 选择复选框 */}
                      <div
                        style={{
                          position: 'absolute',
                          top: 8,
                          left: 8,
                          zIndex: 10,
                          backgroundColor: 'rgba(255,255,255,0.9)',
                          borderRadius: 4,
                          padding: 2
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Checkbox
                          checked={selectedImages.includes(image.id)}
                          onChange={(e) => handleSelectImage(image.id, e.target.checked)}
                        />
                      </div>

                      {/* 图片预览 */}
                      <div onClick={() => setPreviewImage(image)}>
                        <Image
                          src={image.thumbnailUrl}
                          alt={image.name}
                          style={{
                            width: '100%',
                            height: 140,
                            objectFit: 'cover',
                            display: 'block'
                          }}
                          preview={false}
                        />
                      </div>

                      {/* 序号和名称 */}
                      <div style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: '6px 8px',
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        color: 'white',
                        fontSize: 11
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span>#{index + 1}</span>
                          <span style={{
                            maxWidth: 80,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>{image.name}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {currentImages.length >= 50 && (
                  <div style={{ textAlign: 'center', marginTop: 16 }}>
                    <Text type="secondary">
                      显示前 {currentImages.length} 张图片
                    </Text>
                  </div>
                )}
              </>
            ) : (
              <Empty description={
                <div>
                  <Text>暂无图片</Text>
                  <div style={{ marginTop: 16 }}>
                    <Upload {...detailUploadProps}>
                      <Button type="primary" icon={<UploadOutlined />} style={{ backgroundColor: colors.primary }}>
                        上传图片
                      </Button>
                    </Upload>
                  </div>
                </div>
              } />
            )}
          </>
        )}
      </Modal>

      {/* ==================== 图片大图预览 ==================== */}
      <Modal
        open={previewImage !== null}
        onCancel={() => setPreviewImage(null)}
        footer={null}
        width="90vw"
        style={{ top: 24 }}
        bodyStyle={{ padding: 24, textAlign: 'center', backgroundColor: '#1f1f1f' }}
      >
        {previewImage && (
          <div>
            <Image
              src={previewImage.url}
              alt={previewImage.name}
              style={{
                maxWidth: '100%',
                maxHeight: 'calc(85vh - 60px)',
                objectFit: 'contain'
              }}
              preview={false}
            />
            <div style={{ marginTop: 16, color: '#fff' }}>
              <Text style={{ color: '#fff', fontSize: 14 }}>{previewImage.name}</Text>
              <div style={{ marginTop: 4 }}>
                <Text type="secondary" style={{ color: '#aaa', fontSize: 12 }}>
                  上传时间: {previewImage.uploadTime} · 大小: {(previewImage.size / 1024 / 1024).toFixed(2)} MB
                </Text>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* ==================== 删除确认弹窗 ==================== */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <DeleteOutlined style={{ color: colors.danger }} />
            <span>确认删除数据集</span>
          </div>
        }
        open={isDeleteModalVisible}
        onOk={handleDeleteDataset}
        onCancel={() => {
          setIsDeleteModalVisible(false);
          setCurrentDataset(null);
        }}
        okText="删除"
        cancelText="取消"
        okButtonProps={{ danger: true }}
      >
        <div style={{ padding: '8px 0' }}>
          <Text>确定要删除数据集 <Text strong>{currentDataset?.name}</Text> 吗？</Text>
          <div style={{
            marginTop: 16,
            padding: 12,
            backgroundColor: colors.neutralLight,
            borderRadius: styles.borderRadius.md
          }}>
            <Text style={{ color: colors.textSecondary, fontSize: 13 }}>
              此操作将同时删除该数据集下的 {currentDataset?.imageCount || 0} 张图片，此操作不可恢复。
            </Text>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DatasetListPage;
