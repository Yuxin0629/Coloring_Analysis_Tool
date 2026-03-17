import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { 
  Card, Typography, Button, Table, Tag, 
  Row, Col, Space, Select, Progress, message, Divider, Badge
} from 'antd';
import { 
  ArrowLeftOutlined, DownloadOutlined, PictureOutlined,
  FileTextOutlined, EyeOutlined, BarChartOutlined,
  BgColorsOutlined, BorderOutlined, AimOutlined,
  PieChartOutlined, AreaChartOutlined, CheckCircleOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { colors } from '../../components/common/constants';
import { pointInPolygon } from '../../utils/hitTest';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const { Title, Text } = Typography;
const { Option } = Select;

// ==================== 工具函数 (参照 AnalysisCreatePage) ====================

function drawPolygon(ctx, polygon, imgW, imgH, scale, strokeStyle, fillStyle, lineWidth) {
  if (!polygon || polygon.length < 2) return;
  ctx.save();
  ctx.beginPath();
  for (let i = 0; i < polygon.length; i++) {
    const p = polygon[i];
    const x = p.x * imgW * scale;
    const y = p.y * imgH * scale;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fillStyle = fillStyle;
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = lineWidth;
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function getPolygonCenter(polygon) {
  if (!polygon || polygon.length === 0) return { x: 0, y: 0 };
  const sum = polygon.reduce((acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }), { x: 0, y: 0 });
  return { x: sum.x / polygon.length, y: sum.y / polygon.length };
}

// 分析区域定义（多边形坐标，参照 AnalysisCreatePage 格式）
// 使用归一化坐标 (0-1)
const analysisRegions = [
  {
    regionId: 'region1',
    name: '区域1',
    label: '1',
    color: '#FF4D4F',
    polygon: [
      { x: 90 / 600, y: 80 / 400 },
      { x: 160 / 600, y: 60 / 400 },
      { x: 230 / 600, y: 100 / 400 },
      { x: 210 / 600, y: 160 / 400 },
      { x: 140 / 600, y: 170 / 400 },
      { x: 80 / 600, y: 130 / 400 },
    ]
  },
  {
    regionId: 'region2',
    name: '区域2',
    label: '2',
    color: '#1890FF',
    polygon: [
      { x: 140 / 600, y: 180 / 400 },
      { x: 210 / 600, y: 170 / 400 },
      { x: 280 / 600, y: 190 / 400 },
      { x: 270 / 600, y: 320 / 400 },
      { x: 150 / 600, y: 330 / 400 },
      { x: 100 / 600, y: 250 / 400 },
    ]
  },
  {
    regionId: 'region3',
    name: '区域3',
    label: '3',
    color: '#52C41A',
    polygon: [
      { x: 40 / 600, y: 200 / 400 },
      { x: 100 / 600, y: 220 / 400 },
      { x: 90 / 600, y: 300 / 400 },
      { x: 30 / 600, y: 280 / 400 },
    ]
  },
  {
    regionId: 'region4',
    name: '区域4',
    label: '4',
    color: '#FAAD14',
    polygon: [
      { x: 320 / 600, y: 210 / 400 },
      { x: 380 / 600, y: 200 / 400 },
      { x: 400 / 600, y: 280 / 400 },
      { x: 340 / 600, y: 300 / 400 },
    ]
  },
];

// 区域方法配置（来自新建分析项目时的选择）
const regionMethods = {
  '区域1': ['color_distribution', 'area_calculation'],
  '区域2': ['color_distribution', 'area_calculation', 'boundary_check'],
  '区域3': ['area_calculation'],
  '区域4': ['area_calculation', 'boundary_check'],
};

// 分析方法配置
const methodLabels = {
  color_distribution: { label: '颜色分布', icon: <BgColorsOutlined />, color: '#1890ff' },
  area_calculation: { label: '涂色面积', icon: <BorderOutlined />, color: '#52c41a' },
  boundary_check: { label: '出界分析', icon: <AimOutlined />, color: '#fa8c16' }
};

// 模拟单张图片分析数据
const singleImageReportData = {
  imageId: 1,
  imageName: '涂色作品_001.jpg',
  childName: '小朋友1',
  analysisTime: '2025-10-12 14:30:25',
  originalImage: require('../../assets/template.png'),
  
  // 区域分析结果
  regionAnalysis: {
    regions: [
      { 
        name: '区域1', 
        status: 'completed',
        methods: {
          color_distribution: { 
            colors: [
              { name: '红色', value: 45, hex: '#FF4D4F' },
              { name: '橙色', value: 30, hex: '#FAAD14' },
              { name: '黄色', value: 25, hex: '#FADB14' }
            ],
            area: 12500
          },
          area_calculation: { coverage: 85, area: 12500, totalArea: 14700 }
        }
      },
      { 
        name: '区域2', 
        status: 'completed',
        methods: {
          color_distribution: { 
            colors: [
              { name: '蓝色', value: 60, hex: '#1890FF' },
              { name: '绿色', value: 40, hex: '#52C41A' }
            ],
            area: 5800
          },
          area_calculation: { coverage: 92, area: 5800, totalArea: 6300 },
          boundary_check: { outOfBounds: 2, totalLines: 15, accuracy: 87 }
        }
      },
      { 
        name: '区域3', 
        status: 'completed',
        methods: {
          area_calculation: { coverage: 78, area: 4500, totalArea: 5800 }
        }
      },
      { 
        name: '区域4', 
        status: 'completed',
        methods: {
          area_calculation: { coverage: 82, area: 5200, totalArea: 6400 },
          boundary_check: { outOfBounds: 1, totalLines: 12, accuracy: 92 }
        }
      },
    ]
  },
  
  // 整体颜色分布数据（用于饼图）
  overallColorDistribution: [
    { name: '红色', value: 28, hex: '#FF4D4F' },
    { name: '蓝色', value: 22, hex: '#1890FF' },
    { name: '绿色', value: 18, hex: '#52C41A' },
    { name: '黄色', value: 15, hex: '#FAAD14' },
    { name: '其他', value: 17, hex: '#999999' }
  ]
};

const SingleImageReportPage = () => {
  const navigate = useNavigate();
  const { projectId, imageId } = useParams();
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [exportFormat, setExportFormat] = useState('pdf');
  const [imageLoaded, setImageLoaded] = useState(false);
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const imgSizeRef = useRef({ w: 600, h: 400 });
  const [scale, setScale] = useState(1);

  // 计算CSS尺寸（参考 EdgeDetectionPage）
  const cssSize = useMemo(() => {
    if (!imgSizeRef.current) return { w: 0, h: 0 };
    const maxDisplayWidth = 400;
    const displayScale = Math.min(1, maxDisplayWidth / imgSizeRef.current.w);
    setScale(displayScale);
    return { 
      w: imgSizeRef.current.w * displayScale, 
      h: imgSizeRef.current.h * displayScale 
    };
  }, [imageLoaded]);

  // 加载真实图片
  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imgRef.current = img;
      imgSizeRef.current = { w: img.naturalWidth, h: img.naturalHeight };
      setImageLoaded(true);
    };
    img.onerror = () => {
      message.error('图片加载失败');
    };
    img.src = singleImageReportData.originalImage;
  }, []);

  // 绘制带区域的标注图像 - 参照 EdgeDetectionPage
  useEffect(() => {
    if (!imageLoaded || !imgRef.current) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imgW = imgSizeRef.current.w;
    const imgH = imgSizeRef.current.h;
    const dpr = window.devicePixelRatio || 1;

    // 设置canvas尺寸（参考 EdgeDetectionPage）
    canvas.width = Math.round(cssSize.w * dpr);
    canvas.height = Math.round(cssSize.h * dpr);
    canvas.style.width = `${cssSize.w}px`;
    canvas.style.height = `${cssSize.h}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssSize.w, cssSize.h);

    // 绘制原图
    ctx.drawImage(imgRef.current, 0, 0, cssSize.w, cssSize.h);

    // 绘制各区域（半透明覆盖在原图上）
    analysisRegions.forEach((region) => {
      const isSelected = selectedRegion?.regionId === region.regionId;
      
      const style = isSelected
        ? { stroke: 'rgba(0,255,255,0.95)', fill: 'rgba(0,255,255,0.22)', lw: 3 }
        : { stroke: region.color || 'rgba(24,144,255,0.8)', fill: `${region.color}20` || 'rgba(24,144,255,0.1)', lw: 2 };

      drawPolygon(ctx, region.polygon, imgW, imgH, scale, style.stroke, style.fill, style.lw);

      // 绘制区域编号（使用数字）
      const center = getPolygonCenter(region.polygon);
      const x = center.x * imgW * scale;
      const y = center.y * imgH * scale;

      // 绘制圆形背景
      ctx.beginPath();
      ctx.arc(x, y, 14, 0, Math.PI * 2);
      ctx.fillStyle = isSelected ? 'rgba(0,255,255,0.95)' : region.color;
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // 绘制数字
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 14px system-ui';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(region.label, x, y);
    });
  }, [imageLoaded, selectedRegion, cssSize, scale]);

  // 处理画布点击 - 使用 pointInPolygon 进行命中检测（参考 EdgeDetectionPage）
  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const canvasX = e.clientX - rect.left;
    const canvasY = e.clientY - rect.top;
    
    // 转换为归一化坐标（参考 EdgeDetectionPage 的 canvasToNorm）
    const imgX = canvasX / scale;
    const imgY = canvasY / scale;
    const normX = Math.max(0, Math.min(1, imgX / imgSizeRef.current.w));
    const normY = Math.max(0, Math.min(1, imgY / imgSizeRef.current.h));
    
    // 碰撞检测 - 从后向前检测（后绘制的区域优先级高）
    const clickedRegion = [...analysisRegions].reverse().find(region => {
      return pointInPolygon({ x: normX, y: normY }, region.polygon);
    });
    
    if (clickedRegion) {
      setSelectedRegion(clickedRegion);
    }
  };

  // 导出报告
  const handleExport = () => {
    const reportData = {
      ...singleImageReportData,
      exportTime: new Date().toLocaleString(),
      projectId,
      imageId
    };
    
    if (exportFormat === 'pdf') {
      message.success('正在生成PDF报告...');
    } else if (exportFormat === 'json') {
      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `image_report_${imageId}.json`;
      link.click();
      URL.revokeObjectURL(url);
      message.success('JSON报告导出成功');
    }
  };

  // 返回汇总报告
  const goBackToSummary = () => {
    navigate(`/analysis/${projectId}/report`);
  };

  // 重新分析 - 跳转到分析创建页面
  const handleReanalyze = () => {
    navigate('/analysis/create', { 
      state: { 
        projectId, 
        imageId,
        mode: 'reanalyze'
      } 
    });
  };

  // 获取选中区域的分析数据
  const selectedRegionData = selectedRegion 
    ? singleImageReportData.regionAnalysis.regions.find(r => r.name === selectedRegion.name)
    : null;

  // 准备面积对比数据
  const areaComparisonData = singleImageReportData.regionAnalysis.regions
    .filter(r => r.methods.area_calculation)
    .map(r => ({
      name: r.name,
      coverage: r.methods.area_calculation.coverage,
      area: r.methods.area_calculation.area
    }));

  return (
    <div style={{ width: '100%', height: '100%', padding: '0 24px', overflow: 'auto' }}>
      {/* 顶部标题栏 */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 24,
        position: 'sticky',
        top: 0,
        background: '#f5f5f5',
        padding: '16px 0',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={goBackToSummary}
          >
            返回汇总报告
          </Button>
          <Button
            onClick={() => navigate(`/analysis/${projectId}/global-report`)}
          >
            查看汇总报告
          </Button>
          <Title level={4} style={{ margin: 0 }}>单张图片分析报告</Title>
        </div>
        
        <Space>
          <Select 
            value={exportFormat} 
            onChange={setExportFormat}
            style={{ width: 120 }}
          >
            <Option value="pdf">PDF格式</Option>
            <Option value="json">JSON格式</Option>
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

      {/* 图片信息概览 */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={24}>
          <Col span={8}>
            <Text type="secondary">图片名称</Text>
            <div><Text strong>{singleImageReportData.imageName}</Text></div>
          </Col>
          <Col span={8}>
            <Text type="secondary">分析对象</Text>
            <div><Text strong>{singleImageReportData.childName}</Text></div>
          </Col>
          <Col span={8}>
            <Text type="secondary">分析时间</Text>
            <div><Text strong>{singleImageReportData.analysisTime}</Text></div>
          </Col>
        </Row>
      </Card>

      {/* 主内容区域 - 两栏布局 */}
      <Row gutter={24}>
        {/* 左侧 - 区域标注图像和分析配置 */}
        <Col span={14}>
          <Card 
            title={
              <Space>
                <BorderOutlined />
                <span>区域标注图像</span>
              </Space>
            } 
            style={{ marginBottom: 24 }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', padding: 16 }}>
              <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: 450,
                  cursor: 'pointer',
                  border: '2px solid #d9d9d9',
                  borderRadius: 4
                }}
              />
            </div>
            <div style={{ textAlign: 'center' }}>
              <Text type="secondary" style={{ fontSize: 12 }}>点击区域查看分析结果</Text>
            </div>
          </Card>

          {/* 分析配置展示 - 放在区域标注图像下方，竖向排布可滑动 */}
          <Card 
            title={
              <Space>
                <CheckCircleOutlined />
                <span>分析配置</span>
              </Space>
            }
            style={{ marginBottom: 24 }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 300, overflow: 'auto', paddingRight: 8 }}>
              {analysisRegions.map(region => {
                const methods = regionMethods[region.name] || [];
                const regionData = singleImageReportData.regionAnalysis.regions.find(r => r.name === region.name);
                return (
                  <Card 
                    key={region.regionId}
                    size="small" 
                    title={
                      <Space>
                        <div style={{ 
                          width: 12, 
                          height: 12, 
                          backgroundColor: region.color, 
                          borderRadius: '50%' 
                        }} />
                        <Text strong>{region.name}</Text>
                      </Space>
                    }
                    style={{ 
                      borderLeft: `3px solid ${region.color}`,
                      opacity: selectedRegion?.regionId === region.regionId ? 1 : 0.8
                    }}
                  >
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                      {methods.map(methodKey => {
                        const methodConfig = methodLabels[methodKey];
                        const hasResult = regionData?.methods?.[methodKey];
                        return (
                          <div key={methodKey} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Space size="small">
                              <span style={{ color: methodConfig.color }}>{methodConfig.icon}</span>
                              <Text style={{ fontSize: 12 }}>{methodConfig.label}</Text>
                            </Space>
                            <Badge 
                              status={hasResult ? 'success' : 'default'} 
                              text={hasResult ? '已完成' : '未配置'}
                            />
                          </div>
                        );
                      })}
                    </Space>
                  </Card>
                );
              })}
            </div>
          </Card>
        </Col>

        {/* 右侧 - 选中区域分析结果 */}
        <Col span={10}>
          <Card 
            title={
              <Space>
                <BarChartOutlined />
                <span>
                  {selectedRegion 
                    ? `${selectedRegion.name} - 分析结果`
                    : '区域分析详情（请点击左侧图像中的区域）'
                  }
                </span>
              </Space>
            }
            style={{ marginBottom: 24 }}
          >
            {!selectedRegion ? (
              <div style={{ textAlign: 'center', padding: 40 }}>
                <BorderOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />
                <Text type="secondary" style={{ display: 'block', marginTop: 16 }}>
                  请点击左侧标注图像中的区域
                </Text>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  查看该区域的颜色分布、涂色面积、出界情况等分析结果
                </Text>
              </div>
            ) : selectedRegionData ? (
              <Space direction="vertical" style={{ width: '100%' }} size="large">
                {/* 区域状态 */}
                <div style={{ textAlign: 'center' }}>
                  <Badge 
                    status={selectedRegionData.status === 'completed' ? 'success' : 'warning'}
                    text={selectedRegionData.status === 'completed' ? '分析完成' : '部分完成'}
                  />
                </div>

                {/* 区域颜色分布饼图 - 仅当该区域选择了颜色分布方法时显示 */}
                {regionMethods[selectedRegion.name]?.includes('color_distribution') && selectedRegionData.methods?.color_distribution?.colors && (
                  <Card size="small" title={<Space><PieChartOutlined /><span>颜色分布</span></Space>}>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={selectedRegionData.methods.color_distribution.colors}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}%`}
                          outerRadius={70}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {selectedRegionData.methods.color_distribution.colors.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.hex} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </Card>
                )}

                {/* 区域面积对比柱状图 - 仅当该区域选择了面积计算方法时显示 */}
                {regionMethods[selectedRegion.name]?.includes('area_calculation') && selectedRegionData.methods?.area_calculation && (
                  <Card size="small" title={<Space><AreaChartOutlined /><span>面积覆盖情况</span></Space>}>
                    <ResponsiveContainer width="100%" height={120}>
                      <BarChart data={[{ name: '已涂色', value: selectedRegionData.methods.area_calculation.coverage }]} layout="vertical">
                        <XAxis type="number" domain={[0, 100]} unit="%" hide />
                        <YAxis dataKey="name" type="category" width={60} />
                        <Tooltip formatter={(value) => [`${value}%`, '覆盖率']} />
                        <Bar dataKey="value" fill="#52C41A" radius={[0, 4, 4, 0]} barSize={30} />
                      </BarChart>
                    </ResponsiveContainer>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 12 }}>
                      <Text type="secondary">覆盖率: <Text strong>{selectedRegionData.methods.area_calculation.coverage}%</Text></Text>
                      <Text type="secondary">面积: {selectedRegionData.methods.area_calculation.area?.toLocaleString()} / {selectedRegionData.methods.area_calculation.totalArea?.toLocaleString()} px²</Text>
                    </div>
                  </Card>
                )}

                {/* 区域出界分析柱状图 - 仅当该区域选择了出界分析方法时显示 */}
                {regionMethods[selectedRegion.name]?.includes('boundary_check') && selectedRegionData.methods?.boundary_check && (
                  <Card size="small" title={<Space><AimOutlined /><span>出界准确率</span></Space>}>
                    <ResponsiveContainer width="100%" height={120}>
                      <BarChart data={[{ name: '准确率', value: selectedRegionData.methods.boundary_check.accuracy }]} layout="vertical">
                        <XAxis type="number" domain={[0, 100]} unit="%" hide />
                        <YAxis dataKey="name" type="category" width={60} />
                        <Tooltip formatter={(value) => [`${value}%`, '准确率']} />
                        <Bar 
                          dataKey="value" 
                          fill={(selectedRegionData.methods.boundary_check.accuracy > 90 ? '#52c41a' : selectedRegionData.methods.boundary_check.accuracy > 70 ? '#faad14' : '#ff4d4f')}
                          radius={[0, 4, 4, 0]} 
                          barSize={30} 
                        />
                      </BarChart>
                    </ResponsiveContainer>
                    <div style={{ textAlign: 'center', marginTop: 8 }}>
                      <Text strong style={{ 
                        color: selectedRegionData.methods.boundary_check.accuracy > 90 ? '#c44d1a' : selectedRegionData.methods.boundary_check.accuracy > 70 ? '#faad14' : '#ff4d4f'
                      }}>
                        准确率: {selectedRegionData.methods.boundary_check.accuracy}%
                      </Text>
                    </div>
                  </Card>
                )}
              </Space>
            ) : (
              <div style={{ textAlign: 'center', padding: 40 }}>
                <Text type="secondary">该区域暂无分析数据</Text>
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SingleImageReportPage;
