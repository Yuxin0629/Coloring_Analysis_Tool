import React, { useState } from 'react';
import { 
  Card, Typography, Button, Table, Tag, 
  Row, Col, Statistic, Space, Select, Progress,
  Radio, Divider, message
} from 'antd';
import { 
  ArrowLeftOutlined, DownloadOutlined, FileExcelOutlined, 
  FileTextOutlined, EyeOutlined, BarChartOutlined,
  PieChartOutlined, FilePdfOutlined, BgColorsOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';

const { Title, Text } = Typography;
const { Option } = Select;

// 模拟全局汇总报告数据
const globalSummaryData = {
  projectInfo: {
    name: '幼儿园涂色分析项目',
    createTime: '2025-10-12 00:00:00',
    totalChildren: 25,
    totalImages: 120,
    analyzedImages: 118,
    status: 'completed'
  },
  summaryStatistics: {
    avgCompletionRate: 87.5,
    avgColorUsage: 78.3,
    avgCoverage: 65.7
  },
  imageResults: [
    { 
      id: 1, 
      name: '涂色作品_001.jpg', 
      childName: '小朋友1',
      analysisTime: '2025-10-12 14:30:25',
      colorCount: 8,
      colorUsage: 85.2,
      coverage: 72.1,
      dominantColor: { name: '红色', hex: '#FF4D4F', percentage: 28.5 },
      status: 'completed'
    },
    { 
      id: 2, 
      name: '涂色作品_002.jpg', 
      childName: '小朋友2',
      analysisTime: '2025-10-12 14:32:18',
      colorCount: 6,
      colorUsage: 76.8,
      coverage: 68.5,
      dominantColor: { name: '蓝色', hex: '#1890FF', percentage: 25.3 },
      status: 'completed'
    },
    { 
      id: 3, 
      name: '涂色作品_003.jpg', 
      childName: '小朋友3',
      analysisTime: '2025-10-12 14:35:42',
      colorCount: 9,
      colorUsage: 82.1,
      coverage: 75.3,
      dominantColor: { name: '黄色', hex: '#FAAD14', percentage: 22.8 },
      status: 'completed'
    },
    { 
      id: 4, 
      name: '涂色作品_004.jpg', 
      childName: '小朋友4',
      analysisTime: '2025-10-12 14:38:15',
      colorCount: 5,
      colorUsage: 68.4,
      coverage: 58.2,
      dominantColor: { name: '绿色', hex: '#52C41A', percentage: 30.2 },
      status: 'completed'
    },
    { 
      id: 5, 
      name: '涂色作品_005.jpg', 
      childName: '小朋友5',
      analysisTime: '2025-10-12 14:42:33',
      colorCount: 7,
      colorUsage: 79.5,
      coverage: 70.8,
      dominantColor: { name: '紫色', hex: '#722ED1', percentage: 24.6 },
      status: 'completed'
    }
  ]
};

const GlobalSummaryReportPage = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const [selectedFormat, setSelectedFormat] = useState('excel');
  const [viewMode, setViewMode] = useState('table');

  // 导出功能
  const handleExport = () => {
    if (selectedFormat === 'csv') {
      exportToCSV();
    } else if (selectedFormat === 'excel') {
      exportToExcel();
    } else if (selectedFormat === 'pdf') {
      exportToPDF();
    }
  };

  // 导出为CSV
  const exportToCSV = () => {
    const headers = ['图片ID', '图片名称', '分析对象', '分析时间', '颜色数', '颜色使用率', '覆盖率', '主色调', '状态'];
    const rows = globalSummaryData.imageResults.map(item => [
      item.id,
      item.name,
      item.childName,
      item.analysisTime,
      item.colorCount,
      item.colorUsage,
      item.coverage,
      item.dominantColor?.name || '-',
      item.status
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `全局汇总报告_${projectId}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // 导出为Excel（模拟）
  const exportToExcel = () => {
    // 实际项目中需要使用xlsx库
    const data = {
      projectInfo: globalSummaryData.projectInfo,
      summary: globalSummaryData.summaryStatistics,
      details: globalSummaryData.imageResults
    };
    
    // 模拟导出成功
    message.success('正在生成Excel文件...');
    
    // 使用JSON格式作为演示
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `全局汇总报告_${projectId}.xlsx`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // 导出为PDF（模拟）
  const exportToPDF = () => {
    message.success('正在生成PDF报告...');
    // 实际项目中需要使用pdf生成库
  };

  // 查看单张图片详情
  const viewImageDetail = (imageId) => {
    navigate(`/analysis/${projectId}/report/image/${imageId}`);
  };

  // 返回项目详情
  const goBackToProject = () => {
    navigate(`/analysis/`);
  };

  // 表格列定义
  const columns = [
    {
      title: '图片名称',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <Text>{text}</Text>
          <Button 
            type="link" 
            size="small"
            icon={<EyeOutlined />}
            onClick={() => viewImageDetail(record.id)}
          >
            查看详情
          </Button>
        </Space>
      )
    },
    {
      title: '分析对象',
      dataIndex: 'childName',
      key: 'childName',
    },
    {
      title: '分析时间',
      dataIndex: 'analysisTime',
      key: 'analysisTime',
    },
    {
      title: '主色调',
      dataIndex: 'dominantColor',
      key: 'dominantColor',
      render: (dominantColor) => dominantColor ? (
        <Space>
          <div style={{ 
            width: 20, 
            height: 20, 
            backgroundColor: dominantColor.hex, 
            borderRadius: 4,
            border: '1px solid #d9d9d9'
          }} />
          <Tag color="purple">{dominantColor.name}</Tag>
          <Text style={{ fontSize: 12, color: '#666' }}>{dominantColor.percentage}%</Text>
        </Space>
      ) : <Text type="secondary">-</Text>
    },
    {
      title: '颜色数',
      dataIndex: 'colorCount',
      key: 'colorCount',
      render: (value) => <Tag color="blue">{value} 种</Tag>
    },
    {
      title: '颜色使用率',
      dataIndex: 'colorUsage',
      key: 'colorUsage',
      render: (value) => (
        <Progress 
          percent={value} 
          size="small" 
          strokeColor="#1890ff"
          format={(percent) => `${percent}%`}
        />
      )
    },
    {
      title: '覆盖率',
      dataIndex: 'coverage',
      key: 'coverage',
      render: (value) => (
        <Progress 
          percent={value} 
          size="small" 
          strokeColor="#52c41a"
          format={(percent) => `${percent}%`}
        />
      )
    },
  
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'completed' ? 'success' : 'processing'}>
          {status === 'completed' ? '已完成' : '分析中'}
        </Tag>
      )
    }
  ];

  return (
    <div style={{ width: '100%', height: '100%', padding: '0 24px' }}>
      {/* 顶部标题栏 */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 24 
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={goBackToProject}
          >
            返回项目
          </Button>
          <Title level={4} style={{ margin: 0 }}>全局汇总报告</Title>
        </div>
        
        <Space>
          <Select 
            value={selectedFormat} 
            onChange={setSelectedFormat}
            style={{ width: 130 }}
          >
            <Option value="csv">
              <Space>
                <FileTextOutlined />
                CSV格式
              </Space>
            </Option>
            <Option value="excel">
              <Space>
                <FileExcelOutlined />
                Excel格式
              </Space>
            </Option>
            <Option value="pdf">
              <Space>
                <FilePdfOutlined />
                PDF格式
              </Space>
            </Option>
          </Select>
          <Button 
            type="primary" 
            icon={<DownloadOutlined />}
            onClick={handleExport}
          >
            导出报告
          </Button>
        </Space>
      </div>

      {/* 项目信息 */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={24}>
          <Col span={6}>
            <Statistic 
              title="项目名称" 
              value={globalSummaryData.projectInfo.name}
              valueStyle={{ fontSize: 14 }}
            />
          </Col>
          <Col span={6}>
            <Statistic 
              title="分析对象数" 
              value={globalSummaryData.projectInfo.totalImages} 
              suffix="张"
              valueStyle={{ color: '#1890ff' }}
            />
          </Col>
          <Col span={6}>
            <Statistic 
              title="图片总数" 
              value={globalSummaryData.projectInfo.totalImages} 
              suffix="张"
              valueStyle={{ color: '#52c41a' }}
            />
          </Col>
          <Col span={6}>
            <Statistic 
              title="已分析" 
              value={globalSummaryData.projectInfo.analyzedImages} 
              suffix={`/ ${globalSummaryData.projectInfo.totalImages} 张`}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Col>
        </Row>
      </Card>

      {/* 汇总统计 */}
      <Card title="汇总统计数据" style={{ marginBottom: 24 }}>
        <Row gutter={24}>
          <Col span={6}>
            <Card size="small">
              <Statistic 
                title="平均完成率" 
                value={globalSummaryData.summaryStatistics.avgCompletionRate} 
                suffix="%"
                valueStyle={{ color: '#10B981', fontSize: 18 }}
                prefix={<BarChartOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic 
                title="平均颜色使用率" 
                value={globalSummaryData.summaryStatistics.avgColorUsage} 
                suffix="%"
                valueStyle={{ color: '#1890ff', fontSize: 18 }}
                prefix={<BgColorsOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic 
                title="平均覆盖率" 
                value={globalSummaryData.summaryStatistics.avgCoverage} 
                suffix="%"
                valueStyle={{ color: '#fa8c16', fontSize: 18 }}
                prefix={<PieChartOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <Statistic 
                title="完成分析" 
                value={globalSummaryData.imageResults.filter(r => r.status === 'completed').length} 
                suffix={`/ ${globalSummaryData.imageResults.length} 张`}
                valueStyle={{ color: '#52c41a', fontSize: 18 }}
              />
            </Card>
          </Col>
        </Row>
      </Card>

      {/* 数据表格 */}
      <Card 
        title="详细分析结果"
        extra={
          <Radio.Group value={viewMode} onChange={(e) => setViewMode(e.target.value)}>
            <Radio.Button value="table">表格视图</Radio.Button>
            <Radio.Button value="chart">图表视图</Radio.Button>
          </Radio.Group>
        }
      >
        {viewMode === 'table' ? (
          <Table 
            dataSource={globalSummaryData.imageResults}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            scroll={{ x: 1200 }}
          />
        ) : (
          <div style={{ padding: 24 }}>
            <Row gutter={[24, 24]}>
              {/* 区域覆盖率柱状图 */}
              <Col span={24}>
                <Card title="各区域平均覆盖率对比" size="small">
                  <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', height: 200, padding: '20px 0' }}>
                    {globalSummaryData.imageResults.map((item, index) => (
                      <div key={index} style={{ flex: 1, textAlign: 'center' }}>
                        <div style={{ 
                          height: `${item.coverage * 1.5}px`, 
                          backgroundColor: item.coverage >= 80 ? '#52c41a' : item.coverage >= 60 ? '#faad14' : '#ff4d4f',
                          borderRadius: '4px 4px 0 0',
                          transition: 'height 0.3s ease',
                          minHeight: 20
                        }} />
                        <div style={{ marginTop: 8 }}>
                          <Text style={{ fontSize: 12 }} ellipsis>{item.childName}</Text>
                        </div>
                        <div>
                          <Text strong style={{ fontSize: 11, color: '#666' }}>{item.coverage}%</Text>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </Col>
              
              {/* 主色调分布 */}
              <Col span={12}>
                <Card title="主色调分布" size="small">
                  <div style={{ padding: '20px 0' }}>
                    {[
                      { color: '红色', hex: '#FF4D4F', count: globalSummaryData.imageResults.filter(r => r.dominantColor?.name === '红色').length },
                      { color: '蓝色', hex: '#1890FF', count: globalSummaryData.imageResults.filter(r => r.dominantColor?.name === '蓝色').length },
                      { color: '黄色', hex: '#FAAD14', count: globalSummaryData.imageResults.filter(r => r.dominantColor?.name === '黄色').length },
                      { color: '绿色', hex: '#52C41A', count: globalSummaryData.imageResults.filter(r => r.dominantColor?.name === '绿色').length },
                      { color: '紫色', hex: '#722ED1', count: globalSummaryData.imageResults.filter(r => r.dominantColor?.name === '紫色').length },
                    ].map((item, index) => (
                      <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                        <div style={{ width: 60, display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ 
                            width: 16, 
                            height: 16, 
                            backgroundColor: item.hex, 
                            borderRadius: 4,
                            border: '1px solid #d9d9d9'
                          }} />
                          <Text style={{ fontSize: 12 }}>{item.color}</Text>
                        </div>
                        <div style={{ flex: 1, marginLeft: 12 }}>
                          <div style={{ 
                            height: 20, 
                            backgroundColor: item.hex,
                            borderRadius: 4,
                            width: `${(item.count / globalSummaryData.imageResults.length) * 100}%`,
                            minWidth: item.count > 0 ? 20 : 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            paddingRight: 4
                          }}>
                            {item.count > 0 && (
                              <Text style={{ fontSize: 11, color: '#fff', fontWeight: 'bold' }}>{item.count}</Text>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </Col>
              
              {/* 关键指标对比 */}
              <Col span={12}>
                <Card title="关键指标平均值" size="small">
                  <div style={{ padding: '20px 0' }}>
                    {[
                      { label: '颜色使用率', value: globalSummaryData.summaryStatistics.avgColorUsage, color: '#1890ff' },
                      { label: '覆盖率', value: globalSummaryData.summaryStatistics.avgCoverage, color: '#52c41a' },
                      { label: '完成率', value: globalSummaryData.summaryStatistics.avgCompletionRate, color: '#fa8c16' },
                    ].map((item, index) => (
                      <div key={index} style={{ marginBottom: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <Text style={{ fontSize: 12 }}>{item.label}</Text>
                          <Text strong style={{ fontSize: 12, color: item.color }}>{item.value}%</Text>
                        </div>
                        <Progress 
                          percent={item.value} 
                          strokeColor={item.color}
                          size="small"
                          showInfo={false}
                        />
                      </div>
                    ))}
                  </div>
                </Card>
              </Col>
            </Row>
          </div>
        )}
      </Card>

      <Divider />

      {/* 操作说明 */}
      <Card size="small" type="inner" title="导出功能说明">
        <Row gutter={24}>
          <Col span={8}>
            <Text strong>CSV格式：</Text>
            <Text>纯文本逗号分隔值文件，便于导入其他统计工具进行进一步分析</Text>
          </Col>
          <Col span={8}>
            <Text strong>Excel格式：</Text>
            <Text>Microsoft Excel文件，保留表格格式和数据类型，适合数据整理</Text>
          </Col>
          <Col span={8}>
            <Text strong>PDF格式：</Text>
            <Text>完整的格式化报告文档，便于打印、分享和归档保存</Text>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default GlobalSummaryReportPage;
