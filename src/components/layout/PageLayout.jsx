import React from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { colors, styles as stylesConfig } from "../common/constants";
import Topbar from "./Topbar";

export default function PageLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // 侧边栏菜单列表（使用图标 + 文字，更专业）
  const menuItems = [
    { key: "dataset", label: "数据集管理", icon: "📁", path: "/dataset" },
    { key: "analysis", label: "项目分析", icon: "📊", path: "/analysis" },
    { key: "toolbox", label: "工具箱", icon: "🧰", path: "/toolbox" },
    { key: "help", label: "帮助", icon: "❓", path: "/help" },
    { key: "settings", label: "设置", icon: "⚙️", path: "/settings" },
  ];

  // 获取当前激活的菜单key
  const getActiveKey = () => {
    const currentPath = location.pathname;
    const matchItem = menuItems.find(item => currentPath.includes(item.key));
    return matchItem?.key || "dataset";
  };

  const activeKey = getActiveKey();

  // 清理不需要的样式（已移到 Topbar 组件中）
  const layoutStyles = {
    page: {
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      background: colors.neutral,
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    },
    // 主体布局
    body: { 
      flex: 1, 
      display: "flex", 
      minHeight: 0,
      overflow: "hidden",
    },
    // 现代化侧边栏
    sidebar: {
      width: 220,
      background: colors.white,
      borderRight: `1px solid ${colors.neutralDark}`,
      padding: "20px 16px",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      gap: 4,
    },
    menuItem: {
      height: 44,
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "0 16px",
      borderRadius: stylesConfig.borderRadius.md,
      color: colors.textSecondary,
      fontSize: 14,
      cursor: "pointer",
      userSelect: "none",
      transition: stylesConfig.transition,
      fontWeight: 500,
    },
    menuItemHover: {
      backgroundColor: colors.neutral,
      color: colors.textPrimary,
    },
    menuItemActive: {
      background: colors.primaryLight,
      color: colors.primary,
      fontWeight: 600,
    },
    menuIcon: {
      fontSize: 18,
      width: 24,
      textAlign: "center",
    },
    // 主内容区
    mainContent: { 
      flex: 1, 
      minHeight: 0,
      overflow: "auto",
      background: colors.neutral,
      padding: 24,
    },
  };

  return (
    <div style={layoutStyles.page}>
      {/* 顶部导航栏 - 使用 Topbar 组件 */}
      <Topbar title="涂色图像分析工具" username="管理员" avatarText="A" />

      {/* 主体内容 */}
      <div style={layoutStyles.body}>
        {/* 侧边栏菜单 */}
        <div style={layoutStyles.sidebar}>
          {menuItems.map((item) => {
            const isActive = activeKey === item.key;
            return (
              <div
                key={item.key}
                style={{
                  ...layoutStyles.menuItem,
                  ...(isActive ? layoutStyles.menuItemActive : {}),
                }}
                onClick={() => navigate(item.path)}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = colors.neutral;
                    e.currentTarget.style.color = colors.textPrimary;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = colors.textSecondary;
                  }
                }}
              >
                <span style={layoutStyles.menuIcon}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>

        {/* 页面内容出口 */}
        <div style={layoutStyles.mainContent}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}