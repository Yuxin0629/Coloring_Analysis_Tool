import React from "react";
import { useNavigate } from "react-router-dom";
import { colors, styles as stylesConfig } from "../components/common/constants";

// 模拟工具数据（关联路由）
const toolItems = [
  {
    id: "tool-1",
    title: "图像矫正",
    icon: "🖼️",
    description: "对涂色图像进行几何矫正与对齐",
    path: "/toolbox/image-correction", // 可选：子路由
  },
  {
    id: "tool-2",
    title: "边缘检测 / 区域选择",
    icon: "✏️",
    description: "自动检测边缘并划定分析区域",
    path: "/toolbox/edge-detection", // 子路由
  },
  {
    id: "tool-3",
    title: "灰度图生成",
    icon: "📊",
    description: "生成灰度图用于纹理与密度分析",
    path: "/toolbox/grayscale", // 可选：子路由
  },
  {
    id: "tool-4",
    title: "色彩信息提取",
    icon: "🎨",
    description: "提取图像色彩分布与饱和度信息",
    path: "/toolbox/color", // 可选：子路由
  },
];

export default function ToolboxPage() {
  const navigate = useNavigate();

  // 点击工具跳转对应路由
  const handleToolClick = (tool) => {
    if (tool.path) {
      navigate(tool.path);
    } else {
      alert(`工具开发中：${tool.title}`);
    }
  };

  const localStyles = {
    main: {
      flex: 1,
      padding: 24,
      boxSizing: "border-box",
      minWidth: 0,
      display: "flex",
      flexDirection: "column",
      background: colors.neutral,
    },
    headerRow: {
      marginBottom: 24,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    pageTitle: {
      fontSize: stylesConfig.fontSize.lg,
      fontWeight: 700,
      color: colors.textPrimary,
    },
    toolGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", // 加宽卡片
      gap: 28,
      padding: "8px 0",
    },
    toolCard: {
      background: colors.white,
      borderRadius: stylesConfig.borderRadius.md,
      border: `1px solid ${colors.neutralDark}`,
      padding: 24,
      textAlign: "center",
      cursor: "pointer",
      transition: stylesConfig.transition,
      boxShadow: stylesConfig.shadow.sm,
      ":hover": {
        boxShadow: stylesConfig.shadow.md,
        borderColor: colors.primary,
        transform: "translateY(-2px)", // 轻微上浮效果
        background: colors.primaryLight,
      },
    },
    toolIcon: {
      width: "100%",
      aspectRatio: "1 / 1",
      borderRadius: stylesConfig.borderRadius.md,
      background: "#fff3e0", // 淡暖米色背景（匹配示例图）
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 56,
      marginBottom: 18,
      marginLeft: "auto",
      marginRight: "auto",
      maxWidth: 120, // 限制图标大小
    },
    toolTitle: {
      fontSize: stylesConfig.fontSize.md,
      fontWeight: 600,
      color: colors.textPrimary,
      marginBottom: 10,
    },
    toolDesc: {
      fontSize: stylesConfig.fontSize.xs,
      color: colors.textSecondary,
      lineHeight: stylesConfig.lineHeight,
    },
    footerNav: {
      display: "flex",
      justifyContent: "flex-end",
      gap: 12,
      marginTop: 32,
      paddingTop: 16,
      borderTop: `1px solid ${colors.neutralDark}`,
    },
  };

  return (
    <div style={localStyles.main}>
    
      <div style={localStyles.toolGrid}>
        {toolItems.map((tool) => (
          <div
            key={tool.id}
            style={localStyles.toolCard}
            onClick={() => handleToolClick(tool)}
          >
            <div style={localStyles.toolIcon}>{tool.icon}</div>
            <div style={localStyles.toolTitle}>{tool.title}</div>
            <div style={localStyles.toolDesc}>{tool.description}</div>
          </div>
        ))}
      </div>

    
    </div>
  );
}