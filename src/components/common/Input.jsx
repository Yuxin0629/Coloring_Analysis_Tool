import React from "react";
import { colors, styles } from "./constants";

const Input = ({
  value,
  onChange,
  placeholder,
  size = "md",
  disabled = false,
  type = "text",
  className,
  style: customStyle,
  ...props
}) => {
  const sizeConfig = {
    sm: { padding: "6px 12px", height: 32, fontSize: styles.fontSize.xs },
    md: { padding: "8px 12px", height: 36, fontSize: styles.fontSize.sm },
    lg: { padding: "10px 12px", height: 40, fontSize: styles.fontSize.md },
  };

  const inputStyle = {
    width: "100%",
    border: `1px solid ${disabled ? colors.textTertiary : colors.neutralDark}`,
    borderRadius: styles.borderRadius.sm,
    backgroundColor: disabled ? colors.neutral : colors.white,
    color: colors.textPrimary,
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
    outline: "none",
    transition: styles.transition,
    ...sizeConfig[size],
    ...customStyle,
    ":focus": {
      borderColor: !disabled && colors.primary,
      boxShadow: !disabled && `0 0 0 2px ${colors.primaryLight}`,
    },
    ":placeholder": {
      color: colors.textTertiary,
    },
  };

  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      style={inputStyle}
      className={className}
      {...props}
    />
  );
};

export default Input;