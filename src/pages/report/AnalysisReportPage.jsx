import React, { useState } from 'react';
import { 
  Card, Typography, Button, Table, Progress, Tag, 
  Row, Col, Statistic, Divider, Space, Select, DatePicker
} from 'antd';
import { 
  ArrowLeftOutlined, DownloadOutlined, EyeOutlined,
  BarChartOutlined, LineChartOutlined, PieChartOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { colors } from '../../components/common/constants';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

// 模拟报告数据
const reportData = {
  projectInfo: {
    name: '幼儿园涂色分析项目',
    createTime: '2025-10-12 00:00:00',
    totalChildren: 25,
    totalImages: 120,
    status: 'completed'
  },
  overview: {
    completionRate: 92.5,
    avgColorUsage: 78.3,
    avgCoverage: 65.7,
    totalAnalysisTime: '2h 15m'
  },
  childrenProgress: [
    { 
      id: 1, 
      name: '小朋友1', 
      images: 5, 
      completed: 5, 
      progress: 100, 
      colorUsage: 85.2,
      coverage: 72.1,
      status: 'completed'
    },
    { 
      id: 2, 
      name: '小朋友2', 
      images: 5, 
      completed: 4, 
      progress: 80, 
      colorUsage: 76.8,
      coverage: 68.5,
      status: 'processing'
    },
    { 
      id: 3, 
      name: '小朋友3', 
      images: 5, 
      completed: 5, 
      progress: 100, 
      colorUsage: 92.1,
      coverage: 81.3,
      status: 'completed'
    },
    { 
      id: 4, 
      name: '小朋友4', 
      images: 5, 
      completed: 3, 
      progress: 60, 
      colorUsage: 69.4,
      coverage: 58.7,
      status: 'processing'
    },
    { 
      id: 5, 
      name: '小朋友5', 
      images: 5, 
      completed: 5, 
      progress: 100, 
      colorUsage: 88.9,
      coverage: 75.6,
      status: 'completed'
    }
  ],
  colorDistribution: [
    { color: '红色', usage: 28.5, count: 34 },
    { color: '蓝色', usage: 22.3, count: 27 },
    { color: '黄色', usage: 18.7, count: 22 },
    { color: '绿色', usage: 15.2, count: 18 },
    { color: '紫色', usage: 8.9, count: 11 },
    { color: '橙色', usage: 6.4, count: 8 }
  ],
  regionAnalysis: [
    { region: '头部区域', avgCoverage: 78.5, bestChild: '小朋友3', worstChild: '小朋友4' },
    { region: '身体区域', avgCoverage: 72.1, bestChild: '小朋友5', worstChild: '小朋友2' },
    { region: '四肢区域', avgCoverage: 65.3, bestChild: '小朋友1', worstChild: '小朋友4' },
    { region: '背景区域', avgCoverage: 82.7, bestChild: '小朋友3', worstChild: '小朋友2' }
  ]
};

const AnalysisReportPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [selectedChart, setSelectedChart] = useState('overview');

  // 返回项目分析列表
  const goBack = () => {
    navigate('/analysis');
  };

  // 导出报告
  const handleExport = () => {
    // 模拟导出功能
    console.log('导出报告');
  };

  // 查看详细报告
  const handleViewDetail = (childId) => {
    navigate(`/analysis/${projectId}/report/${childId}`);
  };

  // 表格列定义
  const columns = [
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
      width: 100,
    },
    {
      title: '图片数量',
      dataIndex: 'images',
      key: 'images',
      width: 100,
      align: 'center',
    },
    {
      title: '完成进度',
      dataIndex: 'progress',
      key: 'progress',
      width: 150,
      render: (progress) => (
        <Progress 
          percent={progress} 
          size="small" 
          strokeColor={progress === 100 ? '#10B981' : '#1890ff'}
        />
      ),
    },
    {
      title: '颜色使用率',
      dataIndex: 'colorUsage',
      key: 'colorUsage',
      width: 120,
      align: 'center',
      render: (value) => `${value}%`,
    },
    {
      title: '涂色覆盖率',
      dataIndex: 'coverage',
      key: 'coverage',
      width: 120,
      align: 'center',
      render: (value) => `${value}%`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      align: 'center',
      render: (status) => (
        <Tag color={status === 'completed' ? 'green' : 'blue'}>
          {status === 'completed' ? '已完成' : '进行中'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      align: 'center',
      render: (_, record) => (
        <Button 
          type="link" 
          size="small"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetail(record.id)}
        >
          详情
        </Button>
      ),
    },
  ];

  return (
    <div style={{ width: '100%', height: '100%', padding: '0 24px' }}>
      {/* 顶部栏 */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: 24,
        padding: '8px 0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <ArrowLeftOutlined 
            style={{ 
              cursor: 'pointer', 
              color: '#666',
              fontSize: 18 
            }} 
            onClick={goBack}
          />
          <Title level={4} style={{ margin: 0, fontSize: 18, fontWeight: 500 }}>
            项目分析报告
          </Title>
        </div>

        <Space>
          <RangePicker size="small" />
          <Select size="small" defaultValue="all" style={{ width: 120 }}>
            <Option value="all">全部状态</Option>
            <Option value="completed">已完成</Option>
            <Option value="processing">进行中</Option>
          </Select>
          <Button 
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleExport}
            style={{ backgroundColor: colors.primary }}
          >
            导出报告
          </Button>
        </Space>
      </div>

      {/* 项目基本信息 */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={24}>
          <Col span={6}>
            <Statistic 
              title="项目名称" 
              value={reportData.projectInfo.name} 
              valueStyle={{ fontSize: 16, color: colors.primary }}
            />
          </Col>
          <Col span={6}>
            <Statistic 
              title="参与人数" 
              value={reportData.projectInfo.totalChildren} 
              suffix="人"
              valueStyle={{ fontSize: 16, color: '#1890ff' }}
            />
          </Col>
          <Col span={6}>
            <Statistic 
              title="图片总数" 
              value={reportData.projectInfo.totalImages} 
              suffix="张"
              valueStyle={{ fontSize: 16, color: '#52c41a' }}
            />
          </Col>
          <Col span={6}>
            <Statistic 
              title="分析用时" 
              value={reportData.overview.totalAnalysisTime} 
              valueStyle={{ fontSize: 16, color: '#fa8c16' }}
            />
          </Col>
        </Row>
      </Card>

      {/* 概览统计 */}
      <Card title="项目概览" style={{ marginBottom: 24 }}>
        <Row gutter={24}>
          <Col span={6}>
            <Card size="small">
              <Statistic 
                title="完成率" 
                value={reportData.overview.completionRate} 
                suffix="%"
                valueStyle={{ color: '#10B981' }}
                prefix={<BarChartOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic 
                title="平均颜色使用率" 
                value={reportData.overview.avgColorUsage} 
                suffix="%"
                valueStyle={{ color: '#1890ff' }}
                prefix={<LineChartOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic 
                title="平均涂色覆盖率" 
                value={reportData.overview.avgCoverage} 
                suffix="%"
                valueStyle={{ color: '#fa8c16' }}
                prefix={<PieChartOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic 
                title="完成人数" 
                value={reportData.childrenProgress.filter(c => c.status === 'completed').length} 
                suffix={`/ ${reportData.projectInfo.totalChildren}`}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        </Row>
      </Card>

      {/* 图表切换按钮 */}
      <Card style={{ marginBottom: 24 }}>
        <Space style={{ marginBottom: 16 }}>
          <Button 
            type={selectedChart === 'overview' ? 'primary' : 'default'}
            onClick={() => setSelectedChart('overview')}
          >
            项目概览
          </Button>
          <Button 
            type={selectedChart === 'color' ? 'primary' : 'default'}
            onClick={() => setSelectedChart('color')}
          >
            颜色分布
          </Button>
          <Button 
            type={selectedChart === 'region' ? 'primary' : 'default'}
            onClick={() => setSelectedChart('region')}
          >
            区域分析
          </Button>
        </Space>

        {/* 图表内容区域 */}
        <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {selectedChart === 'overview' && (
            <div style={{ textAlign: 'center' }}>
              <Text type="secondary">项目进度图表展示区域</Text>
            </div>
          )}
          {selectedChart === 'color' && (
            <div style={{ width: '100%' }}>
              <Title level={5}>颜色使用分布</Title>
              <Row gutter={16}>
                {reportData.colorDistribution.map((item, index) => (
                  <Col span={4} key={index}>
                    <Card size="small" style={{ textAlign: 'center' }}>
                      <div style={{ 
                        width: 40, 
                        height: 40, 
                        backgroundColor: 
                          item.color === '红色' ? '#ff4d4f' :
                          item.color === '蓝色' ? '#1890ff' :
                          item.color === '黄色' ? '#faad14' :
                          item.color === '绿色' ? '#52c41a' :
                          item.color === '紫色' ? '#722ed1' : '#fa8c16',
                        borderRadius: '50%',
                        margin: '0 auto 8px'
                      }} />
                      <Text style={{ fontSize: 12, display: 'block' }}>{item.color}</Text>
                      <Text strong>{item.usage}%</Text>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          )}
          {selectedChart === 'region' && (
            <div style={{ width: '100%' }}>
              <Title level={5}>区域覆盖分析</Title>
              <Table
                dataSource={reportData.regionAnalysis}
                pagination={false}
                size="small"
                columns={[
                  { title: '区域', dataIndex: 'region', key: 'region' },
                  { 
                    title: '平均覆盖率', 
                    dataIndex: 'avgCoverage', 
                    key: 'avgCoverage',
                    render: (value) => `${value}%`
                  },
                  { title: '表现最好', dataIndex: 'bestChild', key: 'bestChild' },
                  { title: '需要改进', dataIndex: 'worstChild', key: 'worstChild' }
                ]}
              />
            </div>
          )}
        </div>
      </Card>

      {/* 详细数据表格 */}
      <Card title="小朋友分析详情">
        <Table 
          columns={columns} 
          dataSource={reportData.childrenProgress}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `共 ${total} 条记录`
          }}
          style={{
            backgroundColor: colors.white,
            borderRadius: 8,
          }}
        />
      </Card>
    </div>
  );
};

export default AnalysisReportPage;
