import React from "react";
import { colors, styles } from "./constants";

const Button = ({
  children,
  type = "primary", // primary/secondary/text/ghost
  size = "md", // sm/md/lg
  disabled = false,
  onClick,
  className,
  style: customStyle,
  ...props
}) => {
  // 尺寸配置
  const sizeConfig = {
    sm: { padding: "6px 12px", height: 32, fontSize: styles.fontSize.xs },
    md: { padding: "8px 16px", height: 36, fontSize: styles.fontSize.sm },
    lg: { padding: "10px 20px", height: 40, fontSize: styles.fontSize.md },
  };

  // 类型样式
  const baseStyle = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    border: "none",
    borderRadius: styles.borderRadius.sm,
    cursor: disabled ? "not-allowed" : "pointer",
    transition: styles.transition,
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
    fontWeight: 500,
    ...sizeConfig[size],
    ...customStyle,
  };

  const typeStyles = {
    primary: {
      backgroundColor: disabled ? colors.textTertiary : colors.primary,
      color: colors.white,
      boxShadow: styles.shadow.sm,
      ":hover": {
        backgroundColor: !disabled && colors.primaryHover,
        boxShadow: !disabled && styles.shadow.md,
      },
      ":active": {
        boxShadow: styles.shadow.none,
        transform: !disabled && "translateY(1px)",
      },
    },
    secondary: {
      backgroundColor: disabled ? colors.textTertiary : colors.secondary,
      color: colors.white,
      boxShadow: styles.shadow.sm,
      ":hover": {
        backgroundColor: !disabled && colors.secondaryHover,
        boxShadow: !disabled && styles.shadow.md,
      },
      ":active": {
        boxShadow: styles.shadow.none,
        transform: !disabled && "translateY(1px)",
      },
    },
    text: {
      backgroundColor: colors.transparent,
      color: disabled ? colors.textTertiary : colors.primary,
      boxShadow: styles.shadow.none,
      ":hover": {
        backgroundColor: !disabled && colors.primaryLight,
      },
      ":active": {
        backgroundColor: !disabled && colors.neutralDark,
      },
    },
    ghost: {
      backgroundColor: colors.transparent,
      color: disabled ? colors.textTertiary : colors.primary,
      border: `1px solid ${disabled ? colors.textTertiary : colors.neutralDark}`,
      boxShadow: styles.shadow.none,
      ":hover": {
        backgroundColor: !disabled && colors.primaryLight,
        borderColor: !disabled && colors.primary,
      },
    },
  };

  // 合并样式
  const buttonStyle = {
    ...baseStyle,
    ...typeStyles[type],
    opacity: disabled ? 0.6 : 1,
    pointerEvents: disabled ? "none" : "auto",
  };

  return (
    <button style={buttonStyle} onClick={onClick} className={className} {...props}>
      {children}
    </button>
  );
};

export default Button;