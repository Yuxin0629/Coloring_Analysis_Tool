import React, { useState, useEffect } from 'react';
import {
  Card, Typography, Tag, Input, Modal, message, Button, Table, Badge,
  Dropdown, Space, Tooltip, Empty, Progress, Form, Upload, Select
} from 'antd';
import {
  PlusOutlined, DeleteOutlined, SearchOutlined,
  EyeOutlined, FileTextOutlined, EditOutlined, MoreOutlined,
  ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined,
  LoadingOutlined, BarChartOutlined, FilterOutlined,
  FileOutlined, UploadOutlined, InfoCircleOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { colors, styles } from '../../components/common/constants';

const { Title, Text } = Typography;

// 分析状态枚举
const ANALYSIS_STATUS = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  FAILED: 'failed'
};

// 状态配置
const STATUS_CONFIG = {
  [ANALYSIS_STATUS.NOT_STARTED]: {
    label: '未开始',
    color: 'default',
    icon: <ClockCircleOutlined />,
    badgeStatus: 'default'
  },
  [ANALYSIS_STATUS.IN_PROGRESS]: {
    label: '进行中',
    color: 'processing',
    icon: <LoadingOutlined />,
    badgeStatus: 'processing'
  },
  [ANALYSIS_STATUS.COMPLETED]: {
    label: '已完成',
    color: 'success',
    icon: <CheckCircleOutlined />,
    badgeStatus: 'success'
  },
  [ANALYSIS_STATUS.FAILED]: {
    label: '失败',
    color: 'error',
    icon: <CloseCircleOutlined />,
    badgeStatus: 'error'
  }
};

// 模拟分析项目数据
const initialAnalysisProjects = [
  {
    id: 1,
    name: '2025春季全园发展评估',
    targetCount: 245,
    createTime: '2025-03-15 09:30:00',
    updateTime: '2025-03-15 14:20:00',
    year: 2025,
    status: ANALYSIS_STATUS.COMPLETED,
    progress: 100,
    datasetName: '春季学期涂色数据集',
    datasetCount: 3,
    creator: '张老师',
    description: '针对全园245名儿童的涂色作品进行发展能力评估分析'
  },
  {
    id: 2,
    name: '大班精细动作能力分析',
    targetCount: 128,
    createTime: '2025-03-10 10:15:00',
    updateTime: '2025-03-15 11:30:00',
    year: 2025,
    status: ANALYSIS_STATUS.IN_PROGRESS,
    progress: 65,
    datasetName: '大班涂色作品集',
    datasetCount: 2,
    creator: '李老师',
    description: '分析大班儿童精细动作控制能力发展水平'
  },
  {
    id: 3,
    name: '中班色彩认知研究',
    targetCount: 86,
    createTime: '2025-03-08 14:00:00',
    updateTime: '2025-03-08 14:00:00',
    year: 2025,
    status: ANALYSIS_STATUS.NOT_STARTED,
    progress: 0,
    datasetName: '中班创意涂色数据集',
    datasetCount: 1,
    creator: '王老师',
    description: '研究中班儿童色彩认知与运用能力'
  },
  {
    id: 4,
    name: '2024秋季评估汇总',
    targetCount: 312,
    createTime: '2024-12-20 08:30:00',
    updateTime: '2024-12-25 16:45:00',
    year: 2024,
    status: ANALYSIS_STATUS.COMPLETED,
    progress: 100,
    datasetName: '2024秋季全园数据集',
    datasetCount: 5,
    creator: '刘老师',
    description: '2024年秋季学期全园涂色评估汇总分析'
  },
  {
    id: 5,
    name: '小班注意力分析项目',
    targetCount: 92,
    createTime: '2025-02-28 09:00:00',
    updateTime: '2025-03-01 10:20:00',
    year: 2025,
    status: ANALYSIS_STATUS.FAILED,
    progress: 30,
    datasetName: '小班日常涂色数据',
    datasetCount: 1,
    creator: '赵老师',
    description: '分析小班儿童涂色过程中的注意力集中情况'
  },
  {
    id: 6,
    name: '跨年对比分析-2023vs2024',
    targetCount: 456,
    createTime: '2025-01-15 13:30:00',
    updateTime: '2025-01-20 15:00:00',
    year: 2025,
    status: ANALYSIS_STATUS.COMPLETED,
    progress: 100,
    datasetName: '跨年综合数据集',
    datasetCount: 4,
    creator: '陈老师',
    description: '对比分析2023与2024年度儿童发展变化趋势'
  }
];

// 模拟分析模板数据
const initialTemplates = [
  {
    id: 1,
    name: '精细动作能力分析模板',
    description: '评估儿童涂色过程中精细动作控制能力，包括握笔姿势、线条稳定性、手眼协调等维度',
    uploadTime: '2025-03-10 14:30:00',
    uploadBy: '张老师',
    templateImage: '/src/assets/template.png',
    analysisMethods: [
      { name: '线条粗细', enabled: true, description: '检测涂色线条的粗细均匀程度' },
      { name: '是否出界', enabled: true, description: '判断涂色是否超出边界线' },
      { name: '线条稳定性', enabled: true, description: '评估线条的稳定性和连续性' }
    ]
  },
  {
    id: 2,
    name: '色彩认知能力模板',
    description: '分析儿童对色彩的认知、运用和搭配能力，适用于3-6岁儿童发展阶段评估',
    uploadTime: '2025-03-08 09:15:00',
    uploadBy: '李老师',
    templateImage: '/assets/templates/template2.png',
    analysisMethods: [
      { name: '颜色分布', enabled: true, description: '统计涂色中各种颜色的分布情况' },
      { name: '色彩丰富度', enabled: true, description: '评估使用颜色的种类数量' },
      { name: '颜色搭配', enabled: true, description: '分析颜色搭配的协调性' }
    ]
  },
  {
    id: 3,
    name: '涂色完成度分析模板',
    description: '评估涂色作品的完成程度和质量，包括涂色面积和覆盖率',
    uploadTime: '2025-02-28 16:45:00',
    uploadBy: '王老师',
    templateImage: '/assets/templates/template3.png',
    analysisMethods: [
      { name: '涂色面积', enabled: true, description: '计算实际涂色面积占比' },
      { name: '覆盖率', enabled: true, description: '评估涂色区域的覆盖完整度' },
      { name: '是否出界', enabled: true, description: '判断涂色是否超出边界' }
    ]
  },
  {
    id: 4,
    name: '综合发展评估模板',
    description: '综合评价儿童在涂色活动中的多方面发展能力，包括精细动作、色彩认知、注意力等',
    uploadTime: '2025-02-15 11:20:00',
    uploadBy: '赵老师',
    templateImage: '/assets/templates/template4.png',
    analysisMethods: [
      { name: '颜色分布', enabled: true, description: '统计涂色中各种颜色的分布情况' },
      { name: '涂色面积', enabled: true, description: '计算实际涂色面积占比' },
      { name: '线条粗细', enabled: true, description: '检测涂色线条的粗细均匀程度' },
      { name: '是否出界', enabled: true, description: '判断涂色是否超出边界线' },
      { name: '注意力集中度', enabled: true, description: '评估涂色过程中的注意力表现' }
    ]
  }
];

const AnalysisPage = () => {
  const navigate = useNavigate();
  
  // 从 localStorage 加载未完成的创建项目并合并到初始数据
  const loadIncompleteProjects = () => {
    try {
      const savedProjects = JSON.parse(localStorage.getItem('incompleteAnalysisProjects') || '[]');
      const incompleteProjects = savedProjects.map(p => ({
        id: p.id,
        name: p.name || '未命名项目',
        targetCount: p.selectedDatasets?.reduce((sum, ds) => sum + (ds.imageCount || 0), 0) || 0,
        createTime: p.lastSaved || new Date().toLocaleString(),
        updateTime: p.lastSaved || new Date().toLocaleString(),
        year: new Date().getFullYear(),
        status: ANALYSIS_STATUS.NOT_STARTED,
        progress: 0,
        datasetName: p.selectedDatasets?.[0]?.name || '未选择数据集',
        datasetCount: p.selectedDatasets?.length || 0,
        creator: '当前用户',
        description: p.description || '创建途中退出的项目',
        isIncomplete: true // 标记为未完成项目
      }));
      return incompleteProjects;
    } catch (e) {
      console.error('加载未完成项目失败:', e);
      return [];
    }
  };
  
  const [projects, setProjects] = useState(() => {
    const incompleteProjects = loadIncompleteProjects();
    // 合并初始项目和未完成项目，避免ID重复
    const merged = [...initialAnalysisProjects];
    incompleteProjects.forEach(ip => {
      if (!merged.find(p => p.id === ip.id)) {
        merged.push(ip);
      }
    });
    return merged;
  });
  
  const [filteredProjects, setFilteredProjects] = useState(projects);
  const [loading] = useState(false);

  // 筛选状态
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [sortField, setSortField] = useState('createTime');
  const [sortOrder, setSortOrder] = useState('desc');

  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 选中的项目
  const [selectedProjects, setSelectedProjects] = useState([]);

  // 删除弹窗
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [currentDeleteProject, setCurrentDeleteProject] = useState(null);

  // 项目详情弹窗
  const [projectDetailModalVisible, setProjectDetailModalVisible] = useState(false);
  const [currentDetailProject, setCurrentDetailProject] = useState(null);
  
  // 模板管理状态
  const [templates, setTemplates] = useState(initialTemplates);
  const [filteredTemplates, setFilteredTemplates] = useState(templates);
  const [templateSearchValue, setTemplateSearchValue] = useState('');
  const [templateManageModalVisible, setTemplateManageModalVisible] = useState(false);
  
  // 模板分页
  const [templateCurrentPage, setTemplateCurrentPage] = useState(1);
  const [templatePageSize, setTemplatePageSize] = useState(10);
  
  // 模板弹窗状态
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [templateDetailModalVisible, setTemplateDetailModalVisible] = useState(false);
  const [deleteTemplateModalVisible, setDeleteTemplateModalVisible] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState(null);
  
  // 上传表单
  const [uploadForm] = Form.useForm();
  const [uploading, setUploading] = useState(false);

  // 模拟状态实时更新
  useEffect(() => {
    const interval = setInterval(() => {
      setProjects(prev => prev.map(project => {
        if (project.status === ANALYSIS_STATUS.IN_PROGRESS && project.progress < 100) {
          const newProgress = Math.min(project.progress + Math.floor(Math.random() * 5), 99);
          return {
            ...project,
            progress: newProgress,
            updateTime: new Date().toLocaleString()
          };
        }
        return project;
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // 筛选和排序逻辑
  useEffect(() => {
    let result = [...projects];

    // 状态筛选
    if (statusFilter !== 'all') {
      result = result.filter(p => p.status === statusFilter);
    }

    // 年份筛选
    if (yearFilter !== 'all') {
      result = result.filter(p => p.year === Number(yearFilter));
    }

    // 搜索筛选
    if (searchValue) {
      const keyword = searchValue.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(keyword) ||
        p.datasetName.toLowerCase().includes(keyword) ||
        p.creator.toLowerCase().includes(keyword) ||
        p.description.toLowerCase().includes(keyword)
      );
    }

    // 排序
    result.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'createTime') {
        comparison = new Date(a.createTime) - new Date(b.createTime);
      } else if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name, 'zh-CN');
      } else if (sortField === 'status') {
        const statusOrder = ['not_started', 'in_progress', 'failed', 'completed'];
        comparison = statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
      } else if (sortField === 'targetCount') {
        comparison = a.targetCount - b.targetCount;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredProjects(result);
    setCurrentPage(1);
  }, [projects, statusFilter, yearFilter, searchValue, sortField, sortOrder]);
  
  // 模板筛选逻辑
  useEffect(() => {
    let result = [...templates];
    
    // 搜索筛选
    if (templateSearchValue) {
      const keyword = templateSearchValue.toLowerCase();
      result = result.filter(t =>
        t.name.toLowerCase().includes(keyword) ||
        t.description.toLowerCase().includes(keyword) ||
        t.uploadBy.toLowerCase().includes(keyword)
      );
    }
    
    setFilteredTemplates(result);
    setTemplateCurrentPage(1);
  }, [templates, templateSearchValue]);

  // 处理排序
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // 创建新项目
  const handleCreate = () => {
    navigate('/analysis/create');
  };

  // 查看详情 - 弹窗展示项目图片分析进度
  const handleViewDetail = (project) => {
    setCurrentDetailProject(project);
    setProjectDetailModalVisible(true);
  };

  // 查看报告
  const handleViewReport = (projectId) => {
    navigate(`/analysis/${projectId}/report`);
  };

  // 重新分析 - 不跳转页面，直接在当前页面重新开始分析
  const handleRestartAnalysis = (project) => {
    Modal.confirm({
      title: '重新分析确认',
      content: `确定要重新分析项目 "${project.name}" 吗？这将清空之前的分析结果并重新开始。`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        setProjects(prev => prev.map(p => {
          if (p.id === project.id) {
            return {
              ...p,
              status: ANALYSIS_STATUS.IN_PROGRESS,
              progress: 0,
              updateTime: new Date().toLocaleString()
            };
          }
          return p;
        }));
        message.success(`项目 "${project.name}" 已开始重新分析`);
        
        // 模拟分析进度
        const interval = setInterval(() => {
          setProjects(prev => {
            const targetProject = prev.find(p => p.id === project.id);
            if (!targetProject || targetProject.status !== ANALYSIS_STATUS.IN_PROGRESS) {
              clearInterval(interval);
              return prev;
            }
            
            const newProgress = Math.min(targetProject.progress + Math.floor(Math.random() * 10) + 5, 99);
            if (newProgress >= 99) {
              clearInterval(interval);
              // 分析完成
              setTimeout(() => {
                setProjects(p => p.map(proj => 
                  proj.id === project.id 
                    ? { ...proj, status: ANALYSIS_STATUS.COMPLETED, progress: 100, updateTime: new Date().toLocaleString() }
                    : proj
                ));
                message.success(`项目 "${project.name}" 分析完成`);
              }, 1000);
            }
            
            return prev.map(p => 
              p.id === project.id 
                ? { ...p, progress: newProgress, updateTime: new Date().toLocaleString() }
                : p
            );
          });
        }, 2000);
      }
    });
  };

  // 继续编辑 - 对于未开始的项目，跳转到创建页面继续编辑
  const handleEdit = (project) => {
    if (project.status === ANALYSIS_STATUS.NOT_STARTED && project.isIncomplete) {
      // 跳转到创建页面，通过state传递项目ID以恢复进度
      navigate('/analysis/create', { state: { projectId: project.id } });
    } else {
      // 对于已有项目，跳转到详情页
      navigate(`/analysis/${project.id}`);
    }
  };

  // 删除项目
  const handleDelete = (project) => {
    setCurrentDeleteProject(project);
    setDeleteModalVisible(true);
  };

  // 确认删除
  const confirmDelete = () => {
    if (currentDeleteProject) {
      // 如果是未完成项目，也从localStorage中删除
      if (currentDeleteProject.isIncomplete) {
        const savedProjects = JSON.parse(localStorage.getItem('incompleteAnalysisProjects') || '[]');
        const filtered = savedProjects.filter(p => p.id !== currentDeleteProject.id);
        localStorage.setItem('incompleteAnalysisProjects', JSON.stringify(filtered));
      }
      setProjects(projects.filter(p => p.id !== currentDeleteProject.id));
      message.success(`项目 "${currentDeleteProject.name}" 已删除`);
    }
    setDeleteModalVisible(false);
    setCurrentDeleteProject(null);
  };

  // 批量删除
  const handleBatchDelete = () => {
    if (selectedProjects.length === 0) {
      message.warning('请至少选择一个项目');
      return;
    }
    Modal.confirm({
      title: '批量删除确认',
      content: `确定要删除选中的 ${selectedProjects.length} 个分析项目吗？此操作不可恢复。`,
      okText: '删除',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk: () => {
        // 批量删除时也从localStorage中移除未完成项目
        const incompleteIds = selectedProjects.filter(id => {
          const p = projects.find(proj => proj.id === id);
          return p?.isIncomplete;
        });
        if (incompleteIds.length > 0) {
          const savedProjects = JSON.parse(localStorage.getItem('incompleteAnalysisProjects') || '[]');
          const filtered = savedProjects.filter(p => !incompleteIds.includes(p.id));
          localStorage.setItem('incompleteAnalysisProjects', JSON.stringify(filtered));
        }
        setProjects(projects.filter(p => !selectedProjects.includes(p.id)));
        setSelectedProjects([]);
        message.success('批量删除成功');
      }
    });
  };
  
  // ==================== 模板管理功能 ====================
  
  // 查看模板详情
  const handleViewTemplateDetail = (template) => {
    setCurrentTemplate(template);
    setTemplateDetailModalVisible(true);
  };
  
  // 删除模板
  const handleDeleteTemplate = (template) => {
    setCurrentTemplate(template);
    setDeleteTemplateModalVisible(true);
  };
  
  // 确认删除模板
  const confirmDeleteTemplate = () => {
    if (currentTemplate) {
      setTemplates(templates.filter(t => t.id !== currentTemplate.id));
      message.success(`模板 "${currentTemplate.name}" 已删除`);
    }
    setDeleteTemplateModalVisible(false);
    setCurrentTemplate(null);
  };
  
  // 上传模板
  const handleUploadTemplate = async (values) => {
    setUploading(true);
    
    // 模拟上传延迟
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // 获取选中的分析方法
    const selectedMethods = values.analysisMethods || [];
    const allMethods = [
      { name: '颜色分布', description: '统计涂色中各种颜色的分布情况' },
      { name: '涂色面积', description: '计算实际涂色面积占比' },
      { name: '线条粗细', description: '检测涂色线条的粗细均匀程度' },
      { name: '是否出界', description: '判断涂色是否超出边界线' },
      { name: '线条稳定性', description: '评估线条的稳定性和连续性' },
      { name: '色彩丰富度', description: '评估使用颜色的种类数量' },
      { name: '颜色搭配', description: '分析颜色搭配的协调性' },
      { name: '覆盖率', description: '评估涂色区域的覆盖完整度' },
      { name: '注意力集中度', description: '评估涂色过程中的注意力表现' }
    ];
    
    const analysisMethods = allMethods.map(method => ({
      ...method,
      enabled: selectedMethods.includes(method.name)
    }));
    
    const newTemplate = {
      id: Date.now(),
      name: values.name,
      description: values.description || '暂无描述',
      templateImage: values.templateImage?.fileList?.[0] ? URL.createObjectURL(values.templateImage.fileList[0].originFileObj) : null,
      uploadTime: new Date().toLocaleString(),
      uploadBy: '当前用户',
      analysisMethods: analysisMethods
    };
    
    setTemplates([newTemplate, ...templates]);
    setUploading(false);
    setUploadModalVisible(false);
    uploadForm.resetFields();
    message.success('模板上传成功');
  };

  // 渲染状态标签
  const renderStatus = (status, progress) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG[ANALYSIS_STATUS.NOT_STARTED];
    return (
      <Space direction="vertical" size={0}>
        <Tag icon={config.icon} color={config.color}>
          {config.label}
        </Tag>
        {status === ANALYSIS_STATUS.IN_PROGRESS && (
          <Progress percent={progress} size="small" status="active" style={{ width: 80, marginTop: 4 }} />
        )}
      </Space>
    );
  };

  // 表格列定义
  const columns = [
    {
      title: '项目名称',
      dataIndex: 'name',
      key: 'name',
      width: 220,
      sorter: true,
      onHeaderCell: () => ({
        onClick: () => handleSort('name')
      }),
      render: (text, record) => (
        <div>
          <Text strong style={{ color: colors.textPrimary }}>{text}</Text>
          <div>
            <Text type="secondary" style={{ fontSize: 12 }} ellipsis={{ tooltip: record.description }}>
              {record.description}
            </Text>
          </div>
        </div>
      )
    },
    {
      title: '分析状态',
      dataIndex: 'status',
      key: 'status',
      width: 140,
      sorter: true,
      onHeaderCell: () => ({
        onClick: () => handleSort('status')
      }),
      render: (status, record) => renderStatus(status, record.progress)
    },
    {
      title: '关联数据集',
      dataIndex: 'datasetName',
      key: 'datasetName',
      width: 180,
      render: (text, record) => (
        <Space direction="vertical" size={0}>
          <Text style={{ color: colors.textPrimary }}>{text}</Text>
          <Text type="secondary" style={{ fontSize: 12 }}>{record.datasetCount} 个数据集</Text>
        </Space>
      )
    },
    {
      title: '分析对象',
      dataIndex: 'targetCount',
      key: 'targetCount',
      width: 100,
      align: 'center',
      sorter: true,
      onHeaderCell: () => ({
        onClick: () => handleSort('targetCount')
      }),
      render: (count) => (
        <Badge count={count} style={{ backgroundColor: colors.primary }} />
      )
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      key: 'creator',
      width: 100,
      render: (creator) => <Tag color="blue">{creator}</Tag>
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 160,
      sorter: true,
      onHeaderCell: () => ({
        onClick: () => handleSort('createTime')
      }),
      render: (time) => (
        <Space>
          <ClockCircleOutlined style={{ color: colors.textTertiary }} />
          <Text style={{ fontSize: 13 }}>{time}</Text>
        </Space>
      )
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 160,
      render: (time) => (
        <Text type="secondary" style={{ fontSize: 13 }}>{time}</Text>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record) => {
        const menuItems = [
          {
            key: 'view',
            icon: <EyeOutlined />,
            label: '查看详情',
            onClick: () => handleViewDetail(record)
          },
          {
            key: 'report',
            icon: <FileTextOutlined />,
            label: '查看报告',
            disabled: record.status !== ANALYSIS_STATUS.COMPLETED,
            onClick: () => handleViewReport(record.id)
          },
          {
            key: 'edit',
            icon: <EditOutlined />,
            label: record.status === ANALYSIS_STATUS.NOT_STARTED && record.isIncomplete ? '继续编辑' : '重新分析',
            onClick: () => {
              if (record.status === ANALYSIS_STATUS.NOT_STARTED && record.isIncomplete) {
                handleEdit(record);
              } else {
                handleRestartAnalysis(record);
              }
            }
          },
          { type: 'divider' },
          {
            key: 'delete',
            icon: <DeleteOutlined />,
            label: '删除',
            danger: true,
            onClick: () => handleDelete(record)
          }
        ];

        return (
          <Dropdown menu={{ items: menuItems }} placement="bottomRight">
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        );
      }
    }
  ];
  
  // 模板表格列定义
  const templateColumns = [
    {
      title: '模板名称',
      dataIndex: 'name',
      key: 'name',
      width: 280,
      render: (text, record) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <FileOutlined style={{ color: colors.primary }} />
            <Text strong style={{ color: colors.textPrimary }}>{text}</Text>
          </div>
          <Text type="secondary" style={{ fontSize: 12 }} ellipsis={{ tooltip: record.description }}>
            {record.description}
          </Text>
        </div>
      )
    },
    {
      title: '模板照片',
      dataIndex: 'templateImage',
      key: 'templateImage',
      width: 100,
      render: (image) => (
        <div style={{ 
          width: 60, 
          height: 60, 
          background: colors.neutralLight,
          borderRadius: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}>
          {image ? (
            <img 
              src={image} 
              alt="模板"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <FileOutlined style={{ fontSize: 24, color: colors.textTertiary }} />
          )}
        </div>
      )
    },
    {
      title: '分析方法',
      dataIndex: 'analysisMethods',
      key: 'analysisMethods',
      width: 200,
      render: (methods) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {methods?.filter(m => m.enabled).slice(0, 3).map((method, index) => (
            <Tag key={index} size="small" color="blue">{method.name}</Tag>
          ))}
          {methods?.filter(m => m.enabled).length > 3 && (
            <Tag size="small">+{methods.filter(m => m.enabled).length - 3}</Tag>
          )}
        </div>
      )
    },
    {
      title: '上传时间',
      dataIndex: 'uploadTime',
      key: 'uploadTime',
      width: 160,
      render: (time) => (
        <Space>
          <ClockCircleOutlined style={{ color: colors.textTertiary }} />
          <Text style={{ fontSize: 13 }}>{time}</Text>
        </Space>
      )
    },
    {
      title: '上传者',
      dataIndex: 'uploadBy',
      key: 'uploadBy',
      width: 100,
      render: (uploadBy) => <Tag color="green">{uploadBy}</Tag>
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record) => {
        const menuItems = [
          {
            key: 'view',
            icon: <InfoCircleOutlined />,
            label: '查看详情',
            onClick: () => handleViewTemplateDetail(record)
          },
          { type: 'divider' },
          {
            key: 'delete',
            icon: <DeleteOutlined />,
            label: '删除',
            danger: true,
            onClick: () => handleDeleteTemplate(record)
          }
        ];

        return (
          <Dropdown menu={{ items: menuItems }} placement="bottomRight">
            <Button type="text" icon={<MoreOutlined />} />
          </Dropdown>
        );
      }
    }
  ];

  // 表格行选择配置
  const rowSelection = {
    selectedRowKeys: selectedProjects,
    onChange: (selectedKeys) => setSelectedProjects(selectedKeys),
  };

  // 分页数据
  const paginatedData = filteredProjects.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  
  // 模板分页数据
  const templatePaginatedData = filteredTemplates.slice(
    (templateCurrentPage - 1) * templatePageSize,
    templateCurrentPage * templatePageSize
  );

  return (
    <div style={{ width: '100%', height: '100%', padding: '0 24px 24px' }}>
      {/* 页面标题 */}
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
        <BarChartOutlined style={{ fontSize: 24, color: colors.primary }} />
        <Title level={4} style={{ margin: 0, color: colors.textPrimary }}>
          历史分析项目
        </Title>
        <Text type="secondary">共 {filteredProjects.length} 个项目</Text>
      </div>

      {/* 筛选工具栏 */}
      <Card
        style={{ marginBottom: 20, borderRadius: styles.borderRadius.md }}
        bodyStyle={{ padding: '16px 24px' }}
      >
        <Space size={16} wrap style={{ width: '100%', justifyContent: 'space-between' }}>
          {/* 左侧筛选器 */}
          <Space size={12} wrap>
            {/* 年份筛选 */}
            <Space>
              <FilterOutlined style={{ color: colors.textSecondary }} />
              <Text type="secondary">年份:</Text>
              {['all', 2025, 2024, 2023].map(year => (
                <Tag
                  key={year}
                  onClick={() => setYearFilter(year.toString())}
                  style={{
                    cursor: 'pointer',
                    padding: '4px 12px',
                    borderRadius: styles.borderRadius.md,
                    border: 'none',
                    backgroundColor: yearFilter === year.toString() ? colors.primaryLight : colors.neutralLight,
                    color: yearFilter === year.toString() ? colors.primary : colors.textSecondary,
                    fontSize: 13
                  }}
                >
                  {year === 'all' ? '全部' : `${year}年`}
                </Tag>
              ))}
            </Space>

            {/* 状态筛选 */}
            <Space style={{ marginLeft: 16 }}>
              <Text type="secondary">状态:</Text>
              {[
                { key: 'all', label: '全部' },
                { key: ANALYSIS_STATUS.NOT_STARTED, label: '未开始' },
                { key: ANALYSIS_STATUS.IN_PROGRESS, label: '进行中' },
                { key: ANALYSIS_STATUS.COMPLETED, label: '已完成' },
                { key: ANALYSIS_STATUS.FAILED, label: '失败' }
              ].map(({ key, label }) => (
                <Tag
                  key={key}
                  onClick={() => setStatusFilter(key)}
                  style={{
                    cursor: 'pointer',
                    padding: '4px 12px',
                    borderRadius: styles.borderRadius.md,
                    border: 'none',
                    backgroundColor: statusFilter === key ? colors.primaryLight : colors.neutralLight,
                    color: statusFilter === key ? colors.primary : colors.textSecondary,
                    fontSize: 13
                  }}
                >
                  {label}
                </Tag>
              ))}
            </Space>
          </Space>

          {/* 右侧搜索和操作 */}
          <Space size={12}>
            <Input
              placeholder="搜索项目名称、数据集、创建人..."
              prefix={<SearchOutlined style={{ color: colors.textTertiary }} />}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              style={{ width: 280, borderRadius: styles.borderRadius.md }}
              allowClear
            />
            <Button
              icon={<SettingOutlined />}
              onClick={() => setTemplateManageModalVisible(true)}
              style={{ borderRadius: styles.borderRadius.md }}
            >
              分析模板管理
            </Button>
            {selectedProjects.length > 0 && (
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={handleBatchDelete}
              >
                批量删除 ({selectedProjects.length})
              </Button>
            )}
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreate}
              style={{ backgroundColor: colors.primary, borderRadius: styles.borderRadius.md }}
            >
              新建分析
            </Button>
          </Space>
        </Space>
      </Card>

      {/* 统计概览 */}
      <Card
        style={{ marginBottom: 20, borderRadius: styles.borderRadius.md }}
        bodyStyle={{ padding: '16px 24px' }}
      >
        <Space size={48}>
          <div>
            <Text type="secondary" style={{ fontSize: 13 }}>总项目数</Text>
            <div style={{ fontSize: 24, fontWeight: 600, color: colors.textPrimary }}>
              {projects.length}
            </div>
          </div>
          <div>
            <Text type="secondary" style={{ fontSize: 13 }}>进行中</Text>
            <div style={{ fontSize: 24, fontWeight: 600, color: colors.primary }}>
              {projects.filter(p => p.status === ANALYSIS_STATUS.IN_PROGRESS).length}
            </div>
          </div>
          <div>
            <Text type="secondary" style={{ fontSize: 13 }}>已完成</Text>
            <div style={{ fontSize: 24, fontWeight: 600, color: colors.success }}>
              {projects.filter(p => p.status === ANALYSIS_STATUS.COMPLETED).length}
            </div>
          </div>
          <div>
            <Text type="secondary" style={{ fontSize: 13 }}>失败</Text>
            <div style={{ fontSize: 24, fontWeight: 600, color: colors.danger }}>
              {projects.filter(p => p.status === ANALYSIS_STATUS.FAILED).length}
            </div>
          </div>
        </Space>
      </Card>

      {/* 项目列表 */}
      <Card
        style={{ borderRadius: styles.borderRadius.lg }}
        bodyStyle={{ padding: 0 }}
      >
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={paginatedData}
          rowKey="id"
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: filteredProjects.length,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 个项目`,
            pageSizeOptions: [10, 20, 50],
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            }
          }}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <div>
                    <Text style={{ color: colors.textSecondary }}>暂无分析项目</Text>
                    <div style={{ marginTop: 16 }}>
                      <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
                        创建新项目
                      </Button>
                    </div>
                  </div>
                }
              />
            )
          }}
        />
      </Card>

      {/* 删除确认弹窗 */}
      <Modal
        title="确认删除"
        open={deleteModalVisible}
        onOk={confirmDelete}
        onCancel={() => {
          setDeleteModalVisible(false);
          setCurrentDeleteProject(null);
        }}
        okText="删除"
        cancelText="取消"
        okButtonProps={{ danger: true }}
      >
        <p>确定要删除分析项目 <Text strong>{currentDeleteProject?.name}</Text> 吗？</p>
        <p style={{ color: colors.textSecondary, fontSize: 13 }}>
          此操作将同时删除该项目的所有分析结果和报告，不可恢复。
        </p>
      </Modal>

      {/* 项目详情弹窗 */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span>项目详情</span>
            {currentDetailProject && (
              <Tag color={STATUS_CONFIG[currentDetailProject.status]?.color}>
                {STATUS_CONFIG[currentDetailProject.status]?.label}
              </Tag>
            )}
          </div>
        }
        open={projectDetailModalVisible}
        onCancel={() => {
          setProjectDetailModalVisible(false);
          setCurrentDetailProject(null);
        }}
        footer={[
          <Button key="close" onClick={() => setProjectDetailModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={800}
        bodyStyle={{ maxHeight: '60vh', overflow: 'auto', padding: '24px' }}
      >
        {currentDetailProject && (
          <div>
            {/* 项目基本信息 */}
            <Card size="small" style={{ marginBottom: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px 24px' }}>
                <div>
                  <Text type="secondary" style={{ fontSize: 13 }}>项目名称：</Text>
                  <Text strong>{currentDetailProject.name}</Text>
                </div>
                <div>
                  <Text type="secondary" style={{ fontSize: 13 }}>数据集：</Text>
                  <Text>{currentDetailProject.datasetName} ({currentDetailProject.datasetCount}个)</Text>
                </div>
                <div>
                  <Text type="secondary" style={{ fontSize: 13 }}>分析对象数：</Text>
                  <Text strong style={{ color: colors.primary }}>{currentDetailProject.targetCount} 张</Text>
                </div>
                <div>
                  <Text type="secondary" style={{ fontSize: 13 }}>总进度：</Text>
                  <Text strong style={{ color: currentDetailProject.progress === 100 ? colors.success : colors.primary }}>
                    {currentDetailProject.progress}%
                  </Text>
                </div>
              </div>
            </Card>

            {/* 图片分析进度列表 */}
            <Text strong style={{ fontSize: 15, marginBottom: 12, display: 'block' }}>
              图片分析进展 ({currentDetailProject.targetCount}张)
            </Text>
            
            {/* 根据项目状态生成对应的图片进度数据 */}
            {(() => {
              // 根据项目状态确定每张图片的状态
              const generateImageProgress = () => {
                const count = currentDetailProject.targetCount;
                const images = [];
                
                for (let i = 0; i < count; i++) {
                  let status, progress;
                  
                  if (currentDetailProject.status === ANALYSIS_STATUS.COMPLETED) {
                    // 已完成：所有图片都100%完成
                    status = 'completed';
                    progress = 100;
                  } else if (currentDetailProject.status === ANALYSIS_STATUS.NOT_STARTED) {
                    // 未开始：所有图片都是0%
                    status = 'not_started';
                    progress = 0;
                  } else if (currentDetailProject.status === ANALYSIS_STATUS.FAILED) {
                    // 失败：部分完成，部分失败
                    status = i < count * 0.3 ? 'completed' : 'failed';
                    progress = i < count * 0.3 ? 100 : 30;
                  } else {
                    // 进行中：根据总进度分配
                    const completedCount = Math.floor(count * (currentDetailProject.progress / 100));
                    if (i < completedCount) {
                      status = 'completed';
                      progress = 100;
                    } else if (i === completedCount && currentDetailProject.progress < 100) {
                      status = 'processing';
                      progress = Math.round((currentDetailProject.progress % (100 / count)) * count);
                    } else {
                      status = 'pending';
                      progress = 0;
                    }
                  }
                  
                  images.push({
                    id: i + 1,
                    name: `涂色作品_${String(i + 1).padStart(3, '0')}.jpg`,
                    status,
                    progress
                  });
                }
                return images;
              };

              const imageList = generateImageProgress();
              
              return (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {imageList.slice(0, 10).map((img) => (
                    <div
                      key={img.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '12px 16px',
                        background: colors.neutralLight,
                        borderRadius: 8,
                        border: '1px solid ' + colors.neutralDark
                      }}
                    >
                      <div style={{ 
                        width: 32, 
                        height: 32, 
                        borderRadius: 6, 
                        background: colors.neutral,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 12,
                        color: colors.textSecondary,
                        fontWeight: 600
                      }}>
                        {img.id}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <Text style={{ fontSize: 13 }} ellipsis>{img.name}</Text>
                      </div>
                      <div style={{ width: 120 }}>
                        <Progress 
                          percent={img.progress} 
                          size="small"
                          strokeColor={
                            img.status === 'completed' ? colors.success :
                            img.status === 'failed' ? colors.danger :
                            img.status === 'processing' ? colors.primary :
                            colors.textTertiary
                          }
                          showInfo={false}
                        />
                      </div>
                      <div style={{ width: 80, textAlign: 'right' }}>
                        {img.status === 'completed' && (
                          <Tag color="success" style={{ fontSize: 12 }}>已完成</Tag>
                        )}
                        {img.status === 'processing' && (
                          <Tag color="processing" style={{ fontSize: 12 }}>分析中</Tag>
                        )}
                        {img.status === 'failed' && (
                          <Tag color="error" style={{ fontSize: 12 }}>失败</Tag>
                        )}
                        {img.status === 'not_started' && (
                          <Tag style={{ fontSize: 12 }}>未开始</Tag>
                        )}
                        {img.status === 'pending' && (
                          <Tag style={{ fontSize: 12, color: colors.textTertiary }}>等待中</Tag>
                        )}
                      </div>
                    </div>
                  ))}
                  {imageList.length > 10 && (
                    <Text type="secondary" style={{ textAlign: 'center', padding: '8px 0' }}>
                      还有 {imageList.length - 10} 张图片...
                    </Text>
                  )}
                </div>
              );
            })()}
          </div>
        )}
      </Modal>
      
      {/* 模板管理弹窗 */}
      <Modal
        title="分析模板管理"
        open={templateManageModalVisible}
        onCancel={() => setTemplateManageModalVisible(false)}
        footer={null}
        width={1100}
        bodyStyle={{ padding: '20px 0' }}
      >
        {/* 模板筛选工具栏 */}
        <Card
          style={{ marginBottom: 16, borderRadius: styles.borderRadius.md, margin: '0 24px 16px' }}
          bodyStyle={{ padding: '12px 16px' }}
        >
          <Space size={16} wrap style={{ width: '100%', justifyContent: 'space-between' }}>
            {/* 右侧搜索和操作 */}
            <Space size={12}>
              <Input
                placeholder="搜索模板名称、描述、上传者..."
                prefix={<SearchOutlined style={{ color: colors.textTertiary }} />}
                value={templateSearchValue}
                onChange={(e) => setTemplateSearchValue(e.target.value)}
                style={{ width: 280, borderRadius: styles.borderRadius.md }}
                allowClear
              />
              <Button
                type="primary"
                icon={<UploadOutlined />}
                onClick={() => setUploadModalVisible(true)}
                style={{ backgroundColor: colors.primary, borderRadius: styles.borderRadius.md }}
              >
                上传模板
              </Button>
            </Space>
          </Space>
        </Card>

        {/* 模板统计概览 */}
        <Card
          style={{ marginBottom: 16, borderRadius: styles.borderRadius.md, margin: '0 24px 16px' }}
          bodyStyle={{ padding: '12px 16px' }}
        >
          <Space size={32}>
            <div>
              <Text type="secondary" style={{ fontSize: 13 }}>总模板数</Text>
              <div style={{ fontSize: 20, fontWeight: 600, color: colors.textPrimary }}>
                {templates.length}
              </div>
            </div>
            <div>
              <Text type="secondary" style={{ fontSize: 13 }}>分析方法数</Text>
              <div style={{ fontSize: 20, fontWeight: 600, color: colors.primary }}>
                {templates.reduce((sum, t) => sum + (t.analysisMethods?.filter(m => m.enabled).length || 0), 0)}
              </div>
            </div>
          </Space>
        </Card>

        {/* 模板列表 */}
        <div style={{ padding: '0 24px' }}>
          <Table
            columns={templateColumns}
            dataSource={templatePaginatedData}
            rowKey="id"
            pagination={{
              current: templateCurrentPage,
              pageSize: templatePageSize,
              total: filteredTemplates.length,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 个模板`,
              pageSizeOptions: [10, 20, 50],
              onChange: (page, size) => {
                setTemplateCurrentPage(page);
                setTemplatePageSize(size);
              }
            }}
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <div>
                      <Text style={{ color: colors.textSecondary }}>暂无分析模板</Text>
                      <div style={{ marginTop: 16 }}>
                        <Button type="primary" icon={<UploadOutlined />} onClick={() => setUploadModalVisible(true)}>
                          上传新模板
                        </Button>
                      </div>
                    </div>
                  }
                />
              )
            }}
          />
        </div>
      </Modal>
      
      {/* 模板上传弹窗 */}
      <Modal
        title="上传分析模板"
        open={uploadModalVisible}
        onCancel={() => {
          setUploadModalVisible(false);
          uploadForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={uploadForm}
          layout="vertical"
          onFinish={handleUploadTemplate}
          style={{ padding: '16px 0' }}
        >
          <Form.Item
            name="name"
            label="模板名称"
            rules={[{ required: true, message: '请输入模板名称' }]}
          >
            <Input placeholder="例如：精细动作能力分析模板" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="模板描述"
            rules={[{ required: true, message: '请输入模板描述' }]}
          >
            <Input.TextArea 
              placeholder="描述该模板的功能和适用场景..."
              rows={3}
            />
          </Form.Item>
          
          <Form.Item
            name="templateImage"
            label="模板照片"
            rules={[{ required: true, message: '请上传模板照片' }]}
            valuePropName="fileList"
            getValueFromEvent={(e) => e?.fileList}
          >
            <Upload.Dragger
              accept=".jpg,.jpeg,.png,.webp"
              maxCount={1}
              beforeUpload={() => false}
              listType="picture"
            >
              <p className="ant-upload-drag-icon">
                <UploadOutlined />
              </p>
              <p className="ant-upload-text">点击或拖拽模板照片到此处上传</p>
              <p className="ant-upload-hint">
                支持 .jpg, .jpeg, .png, .webp 格式的图片文件
              </p>
            </Upload.Dragger>
          </Form.Item>
          
          <Form.Item
            name="analysisMethods"
            label="选择分析方法"
            rules={[{ required: true, message: '请至少选择一种分析方法' }]}
          >
            <Select
              mode="multiple"
              placeholder="请选择要启用的分析方法"
              style={{ width: '100%' }}
              options={[
                { label: '颜色分布', value: '颜色分布', description: '统计涂色中各种颜色的分布情况' },
                { label: '涂色面积', value: '涂色面积', description: '计算实际涂色面积占比' },
                { label: '线条粗细', value: '线条粗细', description: '检测涂色线条的粗细均匀程度' },
                { label: '是否出界', value: '是否出界', description: '判断涂色是否超出边界线' },
                { label: '线条稳定性', value: '线条稳定性', description: '评估线条的稳定性和连续性' },
                { label: '色彩丰富度', value: '色彩丰富度', description: '评估使用颜色的种类数量' },
                { label: '颜色搭配', value: '颜色搭配', description: '分析颜色搭配的协调性' },
                { label: '覆盖率', value: '覆盖率', description: '评估涂色区域的覆盖完整度' },
                { label: '注意力集中度', value: '注意力集中度', description: '评估涂色过程中的注意力表现' }
              ]}
            />
          </Form.Item>
          
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setUploadModalVisible(false)}>
                取消
              </Button>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={uploading}
                style={{ backgroundColor: colors.primary }}
              >
                上传
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
      
      {/* 模板详情弹窗 */}
      <Modal
        title="模板详情"
        open={templateDetailModalVisible}
        onCancel={() => {
          setTemplateDetailModalVisible(false);
          setCurrentTemplate(null);
        }}
        footer={[
          <Button key="close" onClick={() => setTemplateDetailModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={800}
      >
        {currentTemplate && (
          <div style={{ padding: '16px 0' }}>
            {/* 模板照片预览 */}
            <Card size="small" style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', gap: 20 }}>
                <div style={{ flex: '0 0 200px' }}>
                  <Text type="secondary" style={{ fontSize: 13, display: 'block', marginBottom: 8 }}>
                    模板照片：
                  </Text>
                  <div style={{ 
                    width: 200, 
                    height: 200, 
                    background: colors.neutralLight,
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                  }}>
                    {currentTemplate.templateImage ? (
                      <img 
                        src={currentTemplate.templateImage} 
                        alt="模板照片"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <FileOutlined style={{ fontSize: 48, color: colors.textTertiary }} />
                    )}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ marginBottom: 16 }}>
                    <Text type="secondary" style={{ fontSize: 13 }}>模板名称：</Text>
                    <div>
                      <FileOutlined style={{ color: colors.primary, marginRight: 8 }} />
                      <Text strong>{currentTemplate.name}</Text>
                    </div>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <Text type="secondary" style={{ fontSize: 13 }}>上传时间：</Text>
                    <div><Text>{currentTemplate.uploadTime}</Text></div>
                  </div>
                  <div>
                    <Text type="secondary" style={{ fontSize: 13 }}>上传者：</Text>
                    <div><Tag color="green">{currentTemplate.uploadBy}</Tag></div>
                  </div>
                </div>
              </div>
            </Card>
            
            {/* 可用分析方法 */}
            <div style={{ marginBottom: 16 }}>
              <Text type="secondary" style={{ fontSize: 13, display: 'block', marginBottom: 12 }}>
                可用分析方法：
              </Text>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                {currentTemplate.analysisMethods?.map((method, index) => (
                  <Tag 
                    key={index}
                    color={method.enabled ? 'blue' : 'default'}
                    style={{ 
                      padding: '8px 12px', 
                      fontSize: 14,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6
                    }}
                  >
                    <CheckCircleOutlined style={{ color: method.enabled ? colors.success : colors.textTertiary }} />
                    <span>{method.name}</span>
                    {method.description && (
                      <Tooltip title={method.description}>
                        <InfoCircleOutlined style={{ color: colors.textTertiary, fontSize: 12 }} />
                      </Tooltip>
                    )}
                  </Tag>
                )) || (
                  <Text type="secondary">暂无分析方法配置</Text>
                )}
              </div>
            </div>
            
            <div>
              <Text type="secondary" style={{ fontSize: 13, display: 'block', marginBottom: 8 }}>
                模板描述：
              </Text>
              <Card size="small" style={{ background: colors.neutralLight }}>
                <Text>{currentTemplate.description}</Text>
              </Card>
            </div>
          </div>
        )}
      </Modal>
      
      {/* 模板删除确认弹窗 */}
      <Modal
        title="确认删除模板"
        open={deleteTemplateModalVisible}
        onOk={confirmDeleteTemplate}
        onCancel={() => {
          setDeleteTemplateModalVisible(false);
          setCurrentTemplate(null);
        }}
        okText="删除"
        cancelText="取消"
        okButtonProps={{ danger: true }}
      >
        <p>确定要删除分析模板 <Text strong>{currentTemplate?.name}</Text> 吗？</p>
        <p style={{ color: colors.textSecondary, fontSize: 13 }}>
          此操作将永久删除该模板文件，不可恢复。已使用该模板生成的分析报告不受影响。
        </p>
      </Modal>
    </div>
  );
};

export default AnalysisPage;
