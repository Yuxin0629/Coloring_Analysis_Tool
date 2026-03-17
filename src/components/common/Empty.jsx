import React from "react";
import { colors, styles } from "./constants";

const Empty = ({ text = "暂无数据", image, className }) => {
  const emptyStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "32px",
    color: colors.textSecondary,
  };

  const textStyle = {
    fontSize: styles.fontSize.sm,
    marginTop: "16px",
    lineHeight: styles.lineHeight,
  };

  const imageStyle = {
    width: "80px",
    height: "80px",
    opacity: 0.5,
  };

  return (
    <div style={emptyStyle} className={className}>
      {image ? (
        <img src={image} alt="empty" style={imageStyle} />
      ) : (
        <div style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          backgroundColor: colors.neutral,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 24,
        }}>
          ∅
        </div>
      )}
      <div style={textStyle}>{text}</div>
    </div>
  );
};

export default Empty;