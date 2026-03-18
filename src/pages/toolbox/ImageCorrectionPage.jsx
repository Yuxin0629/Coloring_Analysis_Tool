import React, { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeftOutlined, ZoomInOutlined, ZoomOutOutlined,
  UploadOutlined, DownloadOutlined, UndoOutlined,
  FileImageOutlined, PlusOutlined, CheckCircleOutlined
} from "@ant-design/icons";
import { Button, Card, Space, Radio, Typography, message, Upload, Slider, Row, Col, Tag, Modal, List } from "antd";

const { Title, Text } = Typography;

// 矫正模式
const CORRECTION_MODES = {
  PERSPECTIVE: "perspective", // 透视矫正
  ROTATE: "rotate",           // 旋转矫正
  SCALE: "scale",             // 缩放矫正
  FREE: "free"                // 自由变换
};

// 默认参考点配置
const DEFAULT_REFERENCE_POINTS = {
  [CORRECTION_MODES.PERSPECTIVE]: [
    { x: 0.1, y: 0.1, id: "tl", label: "左上" },
    { x: 0.9, y: 0.1, id: "tr", label: "右上" },
    { x: 0.9, y: 0.9, id: "br", label: "右下" },
    { x: 0.1, y: 0.9, id: "bl", label: "左下" }
  ],
  [CORRECTION_MODES.ROTATE]: [
    { x: 0.5, y: 0.1, id: "center", label: "旋转中心" }
  ],
  [CORRECTION_MODES.SCALE]: [
    { x: 0.5, y: 0.5, id: "center", label: "缩放中心" }
  ],
  [CORRECTION_MODES.FREE]: [
    { x: 0.1, y: 0.1, id: "p1", label: "点1" },
    { x: 0.5, y: 0.2, id: "p2", label: "点2" },
    { x: 0.8, y: 0.5, id: "p3", label: "点3" },
    { x: 0.4, y: 0.8, id: "p4", label: "点4" }
  ]
};

export default function ImageCorrectionPage() {
  const navigate = useNavigate();
  
  // 状态和引用
  const [scale, setScale] = useState(1.0);
  const [hasUploadedImage, setHasUploadedImage] = useState(false);
  const [correctionMode, setCorrectionMode] = useState(CORRECTION_MODES.PERSPECTIVE);
  const [referencePoints, setReferencePoints] = useState(DEFAULT_REFERENCE_POINTS[CORRECTION_MODES.PERSPECTIVE]);
  const [isCorrected, setIsCorrected] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPointId, setDragPointId] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  
  // 模板自动矫正相关状态
  const [templateModalVisible, setTemplateModalVisible] = useState(false);
  const [existingTemplates] = useState([
    { id: "template-1", name: "模板1", thumbnail: "📄", size: "210x297mm" },
    { id: "template-2", name: "模板2", thumbnail: "🎨", size: "150x150mm" },
    { id: "template-3", name: "模板3", thumbnail: "⬜", size: "200x200mm" },
  ]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [newTemplateFile, setNewTemplateFile] = useState(null);
  const [isAutoCorrecting, setIsAutoCorrecting] = useState(false);
  
  const sourceCanvasRef = useRef(null);
  const resultCanvasRef = useRef(null);
  const imgRef = useRef(null);
  const [imgSize, setImgSize] = useState(null);
  const containerRef = useRef(null);

  // 处理图片上传
  const handleImageUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        imgRef.current = img;
        setImgSize({ w: img.naturalWidth, h: img.naturalHeight });
        setHasUploadedImage(true);
        setIsCorrected(false);
        message.success("图片上传成功");
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
    return false;
  };

  // 渲染源图像画布（带参考点）
  const renderSourceCanvas = useCallback(() => {
    const canvas = sourceCanvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img || !imgSize) return;

    const dpr = window.devicePixelRatio || 1;
    const cssW = imgSize.w * scale;
    const cssH = imgSize.h * scale;

    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    canvas.style.width = `${cssW}px`;
    canvas.style.height = `${cssH}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssW, cssH);

    // 绘制原始图像
    ctx.drawImage(img, 0, 0, cssW, cssH);

    // 绘制网格辅助线
    drawGrid(ctx, cssW, cssH);

    // 绘制参考点
    referencePoints.forEach(point => {
      const x = point.x * cssW;
      const y = point.y * cssH;
      drawReferencePoint(ctx, x, y, point.id === dragPointId, point.label);
    });

    // 绘制连线（透视模式）
    if (correctionMode === CORRECTION_MODES.PERSPECTIVE && referencePoints.length === 4) {
      drawPerspectiveLines(ctx, referencePoints, cssW, cssH);
    }
  }, [imgSize, scale, referencePoints, dragPointId, correctionMode]);

  // 绘制参考点
  const drawReferencePoint = (ctx, x, y, isActive, label) => {
    ctx.save();
    
    // 外圈
    ctx.beginPath();
    ctx.arc(x, y, isActive ? 12 : 8, 0, Math.PI * 2);
    ctx.fillStyle = isActive ? "#52c41a" : "#1890ff";
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // 内圈
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    
    // 标签
    if (label) {
      ctx.fillStyle = "#1890ff";
      ctx.font = "bold 12px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(label, x, y - 15);
    }
    
    ctx.restore();
  };

  // 绘制网格
  const drawGrid = (ctx, w, h) => {
    ctx.save();
    ctx.strokeStyle = "rgba(0,0,0,0.05)";
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    
    const gridSize = Math.min(w, h) / 10;
    
    for (let x = 0; x <= w; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    
    for (let y = 0; y <= h; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    
    ctx.restore();
  };

  // 绘制透视连线
  const drawPerspectiveLines = (ctx, points, w, h) => {
    ctx.save();
    ctx.strokeStyle = "rgba(24,144,255,0.5)";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    
    const tl = points.find(p => p.id === "tl");
    const tr = points.find(p => p.id === "tr");
    const br = points.find(p => p.id === "br");
    const bl = points.find(p => p.id === "bl");
    
    if (tl && tr && br && bl) {
      ctx.beginPath();
      ctx.moveTo(tl.x * w, tl.y * h);
      ctx.lineTo(tr.x * w, tr.y * h);
      ctx.lineTo(br.x * w, br.y * h);
      ctx.lineTo(bl.x * w, bl.y * h);
      ctx.closePath();
      ctx.stroke();
      
      // 填充半透明区域
      ctx.fillStyle = "rgba(24,144,255,0.1)";
      ctx.fill();
    }
    
    ctx.restore();
  };

  // 渲染矫正后的图像
  const renderCorrectedImage = useCallback(() => {
    const canvas = resultCanvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img || !imgSize) return;

    const dpr = window.devicePixelRatio || 1;
    const cssW = imgSize.w * scale;
    const cssH = imgSize.h * scale;

    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    canvas.style.width = `${cssW}px`;
    canvas.style.height = `${cssH}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssW, cssH);

    ctx.save();
    
    // 应用变换
    const centerX = cssW / 2;
    const centerY = cssH / 2;
    
    ctx.translate(centerX, centerY);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);
    ctx.translate(-centerX, -centerY);
    
    // 如果是透视矫正，应用透视变换
    if (correctionMode === CORRECTION_MODES.PERSPECTIVE && isCorrected) {
      applyPerspectiveTransform(ctx, img, referencePoints, cssW, cssH);
    } else {
      ctx.drawImage(img, 0, 0, cssW, cssH);
    }
    
    ctx.restore();
  }, [imgSize, scale, rotation, zoom, correctionMode, referencePoints, isCorrected]);

  // 应用透视变换（简化版）
  const applyPerspectiveTransform = (ctx, img, points, w, h) => {
    // 简化的透视变换实现
    // 实际应用中可能需要更复杂的矩阵计算
    const tl = points.find(p => p.id === "tl");
    const tr = points.find(p => p.id === "tr");
    const br = points.find(p => p.id === "br");
    const bl = points.find(p => p.id === "bl");
    
    if (!tl || !tr || !br || !bl) {
      ctx.drawImage(img, 0, 0, w, h);
      return;
    }

    // 绘制变换后的图像（这里使用简单的裁剪+缩放作为演示）
    const srcX = Math.min(tl.x, tr.x, bl.x, br.x) * img.naturalWidth;
    const srcY = Math.min(tl.y, tr.y, bl.y, br.y) * img.naturalHeight;
    const srcW = Math.max(tl.x, tr.x, bl.x, br.x) * img.naturalWidth - srcX;
    const srcH = Math.max(tl.y, tr.y, bl.y, br.y) * img.naturalHeight - srcY;
    
    ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, w, h);
  };

  useEffect(() => {
    renderSourceCanvas();
  }, [renderSourceCanvas]);

  useEffect(() => {
    if (isCorrected) {
      renderCorrectedImage();
    }
  }, [isCorrected, renderCorrectedImage]);

  // 切换矫正模式
  const handleModeChange = (mode) => {
    setCorrectionMode(mode);
    setReferencePoints(DEFAULT_REFERENCE_POINTS[mode]);
    setIsCorrected(false);
    setRotation(0);
    setZoom(1);
  };

  // 鼠标事件处理
  const handleMouseDown = (e) => {
    if (!hasUploadedImage) return;
    
    const rect = sourceCanvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;
    const normX = x / imgSize.w;
    const normY = y / imgSize.h;
    
    // 查找最近的参考点
    let nearestPoint = null;
    let minDistance = Infinity;
    
    referencePoints.forEach(point => {
      const dx = point.x - normX;
      const dy = point.y - normY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 0.05 && distance < minDistance) {
        minDistance = distance;
        nearestPoint = point;
      }
    });
    
    if (nearestPoint) {
      setIsDragging(true);
      setDragPointId(nearestPoint.id);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !dragPointId) return;
    
    const rect = sourceCanvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;
    const normX = Math.max(0, Math.min(1, x / imgSize.w));
    const normY = Math.max(0, Math.min(1, y / imgSize.h));
    
    setReferencePoints(prev => prev.map(p => 
      p.id === dragPointId ? { ...p, x: normX, y: normY } : p
    ));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragPointId(null);
  };

  // 应用矫正
  const applyCorrection = () => {
    if (!hasUploadedImage) {
      message.warning("请先上传图片");
      return;
    }
    setIsCorrected(true);
    message.success("矫正已应用");
  };

  // 重置所有调整
  const resetCorrection = () => {
    setReferencePoints(DEFAULT_REFERENCE_POINTS[correctionMode]);
    setRotation(0);
    setZoom(1);
    setIsCorrected(false);
    message.success("已重置");
  };

  // 下载矫正后的图像
  const downloadCorrectedImage = () => {
    const canvas = resultCanvasRef.current;
    if (!canvas || !isCorrected) {
      message.warning("请先应用矫正");
      return;
    }
    
    const link = document.createElement("a");
    link.download = `corrected-image-${Date.now()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    message.success("图像已下载");
  };

  // 打开模板选择弹窗
  const openTemplateModal = () => {
    if (!hasUploadedImage) {
      message.warning("请先上传图片");
      return;
    }
    setTemplateModalVisible(true);
    setSelectedTemplate(null);
    setNewTemplateFile(null);
  };

  // 关闭模板选择弹窗
  const closeTemplateModal = () => {
    setTemplateModalVisible(false);
    setSelectedTemplate(null);
    setNewTemplateFile(null);
  };

  // 选择现有模板
  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
  };

  // 上传新模板
  const handleUploadNewTemplate = (file) => {
    setNewTemplateFile(file);
    setSelectedTemplate({ id: "new", name: file.name, isNew: true });
    message.success("新模板已选择: " + file.name);
    return false;
  };

  // 根据模板自动矫正
  const handleAutoCorrectWithTemplate = async () => {
    if (!selectedTemplate) {
      message.warning("请选择或上传一个模板");
      return;
    }

    setIsAutoCorrecting(true);
    setTemplateModalVisible(false);

    // 模拟后端API调用
    setTimeout(() => {
      // 模拟后端返回矫正后的图像
      // 实际应用中这里应该是:
      // 1. 创建 FormData
      // 2. 添加原始图片和模板
      // 3. 发送到后端 API
      // 4. 接收返回的矫正后图片
      
      const canvas = resultCanvasRef.current;
      const img = imgRef.current;
      if (canvas && img && imgSize) {
        const dpr = window.devicePixelRatio || 1;
        const cssW = imgSize.w * scale;
        const cssH = imgSize.h * scale;

        canvas.width = Math.round(cssW * dpr);
        canvas.height = Math.round(cssH * dpr);
        canvas.style.width = `${cssW}px`;
        canvas.style.height = `${cssH}px`;

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
          ctx.clearRect(0, 0, cssW, cssH);

          // 模拟矫正效果：根据模板类型应用不同的变换
          ctx.save();
          
          if (selectedTemplate.id === "template-1") {
            // A4纸模板 - 应用透视矫正
            ctx.translate(cssW / 2, cssH / 2);
            ctx.scale(1.1, 1.1);
            ctx.translate(-cssW / 2, -cssH / 2);
          } else if (selectedTemplate.id === "template-2") {
            // 涂色卡模板 - 居中裁剪
            const size = Math.min(cssW, cssH);
            const offsetX = (cssW - size) / 2;
            const offsetY = (cssH - size) / 2;
            ctx.drawImage(img, offsetX, offsetY, size, size, 0, 0, cssW, cssH);
          } else if (selectedTemplate.id === "template-3") {
            // 方格纸模板 - 旋转校正
            ctx.translate(cssW / 2, cssH / 2);
            ctx.rotate(-2 * Math.PI / 180); // 假设旋转-2度
            ctx.translate(-cssW / 2, -cssH / 2);
          }
          
          ctx.drawImage(img, 0, 0, cssW, cssH);
          ctx.restore();

          // 添加模板标记
          ctx.save();
          ctx.fillStyle = "rgba(82, 196, 26, 0.8)";
          ctx.font = "bold 14px system-ui";
          ctx.fillText(`已应用: ${selectedTemplate.name}`, 10, 25);
          ctx.restore();
        }
      }

      setIsCorrected(true);
      setIsAutoCorrecting(false);
      message.success(`自动矫正完成！使用模板: ${selectedTemplate.name}`);
    }, 2000);
  };

  return (
    <div style={styles.page}>
      {/* 顶部导航栏 */}
      <div style={styles.topbar}>
        <Space size="middle">
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate("/toolbox")}
          >
            返回工具箱
          </Button>
          <Title level={4} style={{ margin: 0, color: "#fff" }}>图像矫正工具</Title>
        </Space>
        <Space>
          <Button 
            type="primary" 
            icon={<DownloadOutlined />}
            onClick={downloadCorrectedImage}
            disabled={!isCorrected}
          >
            下载矫正结果
          </Button>
        </Space>
      </div>

      <div style={styles.body}>
        {/* 左侧控制面板 */}
        <div style={styles.sidebar}>
          <Card title="图像上传" size="small" style={{ marginBottom: 16 }}>
            <Upload.Dragger
              accept="image/*"
              beforeUpload={handleImageUpload}
              showUploadList={false}
            >
              <p className="ant-upload-drag-icon">
                <UploadOutlined />
              </p>
              <p className="ant-upload-text">点击或拖拽上传图片</p>
              <p className="ant-upload-hint">支持 JPG、PNG 格式</p>
            </Upload.Dragger>
          </Card>

          <Card title="矫正模式" size="small" style={{ marginBottom: 16 }}>
            <Radio.Group 
              value={correctionMode}
              onChange={(e) => handleModeChange(e.target.value)}
              style={{ width: "100%" }}
            >
              <Space direction="vertical" style={{ width: "100%" }}>
                <Radio.Button value={CORRECTION_MODES.PERSPECTIVE} style={{ width: "100%", textAlign: "center" }}>
                  透视矫正
                </Radio.Button>
                <Radio.Button value={CORRECTION_MODES.ROTATE} style={{ width: "100%", textAlign: "center" }}>
                  旋转矫正
                </Radio.Button>
                <Radio.Button value={CORRECTION_MODES.SCALE} style={{ width: "100%", textAlign: "center" }}>
                  缩放矫正
                </Radio.Button>
                <Radio.Button value={CORRECTION_MODES.FREE} style={{ width: "100%", textAlign: "center" }}>
                  自由变换
                </Radio.Button>
              </Space>
            </Radio.Group>
          </Card>

          {correctionMode === CORRECTION_MODES.ROTATE && (
            <Card title="旋转角度" size="small" style={{ marginBottom: 16 }}>
              <Slider
                min={-180}
                max={180}
                value={rotation}
                onChange={setRotation}
                marks={{ 0: "0°", 90: "90°", [-90]: "-90°", 180: "180°", [-180]: "-180°" }}
              />
              <div style={{ textAlign: "center", marginTop: 8 }}>
                <Tag color="blue">{rotation}°</Tag>
              </div>
            </Card>
          )}

          {correctionMode === CORRECTION_MODES.SCALE && (
            <Card title="缩放比例" size="small" style={{ marginBottom: 16 }}>
              <Slider
                min={0.1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={setZoom}
                marks={{ 1: "1x", 2: "2x", 0.5: "0.5x" }}
              />
              <div style={{ textAlign: "center", marginTop: 8 }}>
                <Tag color="blue">{zoom.toFixed(1)}x</Tag>
              </div>
            </Card>
          )}

          <Card title="智能矫正" size="small" style={{ marginBottom: 16 }}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Button 
                type="primary"
                icon={<FileImageOutlined />}
                onClick={openTemplateModal}
                disabled={!hasUploadedImage || isAutoCorrecting}
                loading={isAutoCorrecting}
                block
              >
                根据模板自动矫正
              </Button>
              <Text type="secondary" style={{ fontSize: 12 }}>
                选择或上传模板，自动匹配并矫正图像
              </Text>
            </Space>
          </Card>

          <Card title="操作" size="small" style={{ marginBottom: 16 }}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Button 
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={applyCorrection}
                disabled={!hasUploadedImage}
                block
              >
                应用矫正
              </Button>
              <Button 
                icon={<UndoOutlined />}
                onClick={resetCorrection}
                disabled={!hasUploadedImage}
                block
              >
                重置
              </Button>
            </Space>
          </Card>

          <Card title="提示" size="small">
            <Text type="secondary" style={{ fontSize: 12 }}>
              <ul style={{ paddingLeft: 16, margin: 0 }}>
                <li>拖拽蓝色参考点调整位置</li>
                <li>绿色表示选中状态</li>
                <li>点击'应用矫正'预览效果</li>
              </ul>
            </Text>
          </Card>
        </div>

        {/* 主内容区 */}
        <div style={styles.main} ref={containerRef}>
          <Row gutter={16} style={{ flex: 1, minHeight: 0 }}>
            {/* 源图像 */}
            <Col span={isCorrected ? 12 : 24} style={{ height: "100%" }}>
              <Card 
                title={
                  <Space>
                    <span>原始图像</span>
                    <Tag color="blue">可编辑</Tag>
                  </Space>
                }
                extra={
                  <Space>
                    <Button 
                      icon={<ZoomOutOutlined />}
                      onClick={() => setScale(s => Math.max(0.25, +(s - 0.1).toFixed(2)))}
                      disabled={!hasUploadedImage}
                      size="small"
                    />
                    <Text>缩放: {scale.toFixed(2)}x</Text>
                    <Button 
                      icon={<ZoomInOutlined />}
                      onClick={() => setScale(s => Math.min(4, +(s + 0.1).toFixed(2)))}
                      disabled={!hasUploadedImage}
                      size="small"
                    />
                  </Space>
                }
                style={{ height: "100%" }}
                bodyStyle={{ height: "calc(100% - 57px)", overflow: "auto", display: "flex", justifyContent: "center", alignItems: "center" }}
              >
                {!hasUploadedImage ? (
                  <div style={styles.emptyState}>
                    <UploadOutlined style={{ fontSize: 48, color: "#ccc" }} />
                    <Text type="secondary" style={{ marginTop: 16 }}>
                      请先上传图片
                    </Text>
                  </div>
                ) : (
                  <canvas
                    ref={sourceCanvasRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    style={{ 
                      cursor: isDragging ? "grabbing" : "grab",
                      borderRadius: 8,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                    }}
                  />
                )}
              </Card>
            </Col>

            {/* 矫正后的图像 */}
            {isCorrected && (
              <Col span={12} style={{ height: "100%" }}>
                <Card 
                  title={
                    <Space>
                      <span>矫正效果</span>
                      <Tag color="green">预览</Tag>
                    </Space>
                  }
                  style={{ height: "100%" }}
                  bodyStyle={{ height: "calc(100% - 57px)", overflow: "auto", display: "flex", justifyContent: "center", alignItems: "center" }}
                >
                  <canvas
                    ref={resultCanvasRef}
                    style={{ 
                      borderRadius: 8,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                    }}
                  />
                </Card>
              </Col>
            )}
          </Row>

          {/* 参考点信息面板 */}
          <Card size="small" style={{ marginTop: 16 }}>
            <Row gutter={24}>
              <Col span={8}>
                <Text type="secondary">
                  <b>图像尺寸:</b> {imgSize ? `${imgSize.w}×${imgSize.h}` : "未上传"}
                </Text>
              </Col>
              <Col span={8}>
                <Text type="secondary">
                  <b>矫正模式:</b> {{
                    [CORRECTION_MODES.PERSPECTIVE]: "透视矫正",
                    [CORRECTION_MODES.ROTATE]: "旋转矫正",
                    [CORRECTION_MODES.SCALE]: "缩放矫正",
                    [CORRECTION_MODES.FREE]: "自由变换"
                  }[correctionMode]}
                </Text>
              </Col>
              <Col span={8}>
                <Text type="secondary">
                  <b>参考点数量:</b> {referencePoints.length}
                </Text>
              </Col>
            </Row>
          </Card>
        </div>
      </div>

      {/* 模板选择弹窗 */}
      <Modal
        title="选择或上传模板"
        open={templateModalVisible}
        onOk={handleAutoCorrectWithTemplate}
        onCancel={closeTemplateModal}
        okText="开始自动矫正"
        cancelText="取消"
        width={600}
        okButtonProps={{ disabled: !selectedTemplate, loading: isAutoCorrecting }}
      >
        <Space direction="vertical" style={{ width: "100%" }} size="large">
          {/* 现有模板列表 */}
          <div>
            <Text strong style={{ display: "block", marginBottom: 12 }}>
              现有模板（点击选择）
            </Text>
            <List
              grid={{ gutter: 16, column: 3 }}
              dataSource={existingTemplates}
              renderItem={(template) => (
                <List.Item>
                  <Card
                    size="small"
                    hoverable
                    onClick={() => handleSelectTemplate(template)}
                    style={{
                      border: selectedTemplate?.id === template.id ? "2px solid #1890ff" : "1px solid #d9d9d9",
                      background: selectedTemplate?.id === template.id ? "#e6f7ff" : "#fff",
                      cursor: "pointer"
                    }}
                  >
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: 32, marginBottom: 8 }}>{template.thumbnail}</div>
                      <Text strong style={{ fontSize: 12, display: "block" }}>{template.name}</Text>
                      <Text type="secondary" style={{ fontSize: 10 }}>{template.size}</Text>
                    </div>
                  </Card>
                </List.Item>
              )}
            />
          </div>

          {/* 上传新模板 */}
          <div>
            <Text strong style={{ display: "block", marginBottom: 12 }}>
              或上传新模板
            </Text>
            <Upload.Dragger
              accept="image/*"
              beforeUpload={handleUploadNewTemplate}
              showUploadList={false}
              disabled={!!newTemplateFile}
            >
              <p className="ant-upload-drag-icon">
                {newTemplateFile ? <FileImageOutlined /> : <PlusOutlined />}
              </p>
              <p className="ant-upload-text">
                {newTemplateFile ? `已选择: ${newTemplateFile.name}` : "点击或拖拽上传新模板"}
              </p>
              <p className="ant-upload-hint">
                支持 JPG、PNG 格式，将作为参考模板
              </p>
            </Upload.Dragger>
          </div>

          {/* 已选模板信息 */}
          {selectedTemplate && (
            <div style={{ 
              padding: "12px 16px", 
              background: "#f6ffed", 
              border: "1px solid #b7eb8f",
              borderRadius: 6 
            }}>
              <Space>
                <CheckCircleOutlined style={{ color: "#52c41a" }} />
                <Text>
                  已选择模板: <strong>{selectedTemplate.name}</strong>
                  {selectedTemplate.isNew && <Tag color="orange" style={{ marginLeft: 8 }}>新模板</Tag>}
                </Text>
              </Space>
            </div>
          )}
        </Space>
      </Modal>
    </div>
  );
}

const styles = {
  page: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "#f5f7fb",
  },
  topbar: {
    height: 64,
    background: "linear-gradient(90deg, #1890ff 0%, #36cfcf 100%)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 24px",
    boxSizing: "border-box",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  body: { 
    flex: 1, 
    display: "flex", 
    minHeight: 0,
    padding: 16,
    gap: 16,
  },
  sidebar: {
    width: 280,
    overflow: "auto",
  },
  main: { 
    flex: 1, 
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    overflow: "auto",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 300,
  },
};
