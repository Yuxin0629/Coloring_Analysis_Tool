import React from "react";
import { colors, styles } from "./constants";

const Card = ({
  children,
  title,
  padding = "16px",
  bordered = true,
  className,
  style: customStyle,
}) => {
  const cardStyle = {
    backgroundColor: colors.white,
    borderRadius: styles.borderRadius.md,
    boxShadow: styles.shadow.sm,
    padding,
    border: bordered ? `1px solid ${colors.neutralDark}` : "none",
    ...customStyle,
  };

  const titleStyle = {
    fontSize: styles.fontSize.md,
    fontWeight: 600,
    color: colors.textPrimary,
    marginBottom: "12px",
    lineHeight: styles.lineHeight,
  };

  return (
    <div style={cardStyle} className={className}>
      {title && <div style={titleStyle}>{title}</div>}
      {children}
    </div>
  );
};

export default Card;