# 儿童涂色作品分析系统

基于 React 的儿童涂色作品智能分析前端应用，用于幼儿园及早期教育机构对儿童涂色作品进行多维度的发展能力评估。

## 功能模块

### 1. 数据集管理
- **分组管理**: 按班级、年级等维度对涂色作品进行分组管理
- **数据集列表**: 查看各分组下的涂色图片数据集
- **图片预览**: 支持涂色作品的浏览和筛选

### 2. 分析管理
- **分析项目**: 创建和管理分析任务，支持按状态（未开始/进行中/已完成/失败）筛选
- **模板管理**: 上传和管理分析模板，配置分析方法（颜色分布、涂色面积、线条粗细、是否出界等）
- **分析创建向导**:
  - 步骤1: 选择数据集和模板
  - 步骤2: 图像矫正（自动几何校正）
  - 步骤3: 区域定义（自动检测或手动绘制分析区域）
  - 步骤4: 分析配置（为不同区域配置分析方法）

### 3. 报告中心
- **全局汇总报告**: 项目级别的整体分析统计
- **分析摘要报告**: 详细的分析维度报告
- **个人报告**: 单个儿童的涂色能力评估报告
- **单图报告**: 单张涂色作品的详细分析报告

### 4. 工具箱
- **边缘检测**: 涂色作品边缘识别工具
- **图像矫正**: 涂色卡几何校正工具

## 技术栈

- **框架**: React 19.2.4
- **UI组件库**: Ant Design 6.3.1
- **路由**: React Router DOM 6.30.3
- **图表**: Recharts 3.8.0
- **构建工具**: Create React App

## 项目结构

```
src/
├── components/
│   ├── common/           # 公共组件和常量
│   └── layout/           # 布局组件
├── pages/
│   ├── analysis/         # 分析模块
│   │   ├── AnalysisPage.jsx
│   │   └── AnalysisCreatePage.jsx
│   ├── dataset/          # 数据集模块
│   │   ├── GroupListPage.jsx
│   │   └── DatasetListPage.jsx
│   ├── report/           # 报告模块
│   │   ├── GlobalSummaryReportPage.jsx
│   │   ├── AnalysisReportPage.jsx
│   │   ├── PersonalReportPage.jsx
│   │   └── SingleImageReportPage.jsx
│   ├── toolbox/          # 工具箱
│   │   ├── EdgeDetectionPage.jsx
│   │   └── ImageCorrectionPage.jsx
│   ├── LoginPage.jsx     # 登录页面
│   └── ToolboxPage.jsx   # 工具箱首页
├── router/
│   └── index.jsx         # 路由配置
└── index.js              # 应用入口
```

## 分析方法

系统支持以下涂色作品分析方法：

- **颜色分布**: 统计涂色中各种颜色的分布情况
- **涂色面积**: 计算实际涂色面积占比
- **线条粗细**: 检测涂色线条的粗细均匀程度
- **是否出界**: 判断涂色是否超出边界线
- **线条稳定性**: 评估线条的稳定性和连续性
- **色彩丰富度**: 评估使用颜色的种类数量
- **颜色搭配**: 分析颜色搭配的协调性
- **覆盖率**: 评估涂色区域的覆盖完整度
- **注意力集中度**: 评估涂色过程中的注意力表现

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm start
```

应用将在 http://localhost:3000 启动

### 构建生产版本

```bash
npm run build
```

构建文件将输出到 `build` 目录

## 路由说明

| 路径 | 页面 |
|------|------|
| `/login` | 登录页 |
| `/dataset` | 分组列表 |
| `/dataset/group/:groupId` | 数据集列表 |
| `/analysis` | 分析项目列表 |
| `/analysis/create` | 创建分析项目 |
| `/analysis/:projectId/report` | 全局汇总报告 |
| `/analysis/:projectId/report/summary` | 分析摘要报告 |
| `/analysis/:projectId/report/:childId` | 个人报告 |
| `/analysis/:projectId/report/image/:imageId` | 单图报告 |
| `/toolbox` | 工具箱首页 |
| `/toolbox/edge-detection` | 边缘检测工具 |
| `/toolbox/image-correction` | 图像矫正工具 |

## 开发说明

### 模板数据结构

```javascript
{
  id: 1,
  name: '精细动作能力分析模板',
  description: '评估儿童涂色过程中精细动作控制能力',
  uploadTime: '2025-03-10 14:30:00',
  uploadBy: '张老师',
  templateImage: '/src/assets/template.png',
  analysisMethods: [
    { name: '线条粗细', enabled: true, description: '检测涂色线条的粗细均匀程度' },
    { name: '是否出界', enabled: true, description: '判断涂色是否超出边界线' }
  ]
}
```

### 分析状态

- `not_started`: 未开始
- `in_progress`: 进行中（带进度显示）
- `completed`: 已完成
- `failed`: 失败

## 浏览器兼容性

- Chrome (最新版)
- Firefox (最新版)
- Safari (最新版)
- Edge (最新版)
