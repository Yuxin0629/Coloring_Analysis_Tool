// 现代和谐配色方案 - 蓝色主题，专业清爽
export const colors = {
  // 主色调 - 明亮蓝色
  primary: "#4A90E2",           // 主蓝色
  primaryLight: "#E8F4FD",      // 浅蓝背景
  primaryHover: "#3A7BD5",      // 悬停深蓝
  primaryDark: "#2E5AAC",       // 深色强调

  // 辅助色
  secondary: "#50C878",         // 翠绿（成功）
  secondaryLight: "#E8F8F0",    // 浅绿背景
  
  // 中性色 - 温暖灰色系
  neutral: "#F5F7FA",           // 页面背景
  neutralLight: "#FAFBFC",      // 卡片背景
  neutralDark: "#E1E4E8",       // 边框
  
  // 文字色
  textPrimary: "#1F2937",       // 主文字 - 深灰黑
  textSecondary: "#6B7280",     // 次要文字 - 中灰
  textTertiary: "#9CA3AF",      // 提示文字 - 浅灰
  textWhite: "#FFFFFF",         // 白字
  
  // 功能色
  success: "#10B981",           // 成功绿
  warning: "#F59E0B",           // 警告橙
  danger: "#EF4444",            // 错误红
  info: "#3B82F6",              // 信息蓝
  
  // 基础色
  white: "#FFFFFF",
  transparent: "transparent",
};

// 现代化样式系统
export const styles = {
  borderRadius: {
    sm: 6,
    md: 10,
    lg: 16,
    xl: 24,
  },
  shadow: {
    sm: "0 1px 2px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.06)",
    md: "0 4px 6px rgba(0,0,0,0.04), 0 2px 8px rgba(0,0,0,0.06)",
    lg: "0 8px 16px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.08)",
    none: "none",
  },
  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  lineHeight: 1.6,
};