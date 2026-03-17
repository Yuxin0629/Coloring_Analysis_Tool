import React from "react";
import { colors, styles } from "./constants";

const Loading = ({ size = 24, color = colors.primary, text, className }) => {
  const spinnerStyle = {
    width: size,
    height: size,
    border: `3px solid ${colors.neutralDark}`,
    borderTop: `3px solid ${color}`,
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: text ? "0 auto 8px" : "auto",
  };

  const textStyle = {
    fontSize: styles.fontSize.sm,
    color: colors.textSecondary,
    textAlign: "center",
  };

  // 注入动画样式
  if (!document.querySelector("#loading-spin-style")) {
    const style = document.createElement("style");
    style.id = "loading-spin-style";
    style.innerHTML = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
      className={className}
    >
      <div style={spinnerStyle} />
      {text && <div style={textStyle}>{text}</div>}
    </div>
  );
};

export default Loading;