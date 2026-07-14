import { ReactNode } from "react";
import XpButton from "./XpButton.tsx";

type XpWindowProps = {
  title: string;
  children: ReactNode;
  width?: number | string;
  style?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
  footer?: ReactNode;
  onClose?: () => void;
};

export default function XpWindow({
  title,
  children,
  width = 300,
  style,
  contentStyle,
  footer,
  onClose,
}: XpWindowProps) {
  return (
    <div
      style={{
        width,

        background: "#ece9d8",

        border: "3px solid #245edb",

        borderRadius: 10,

        overflow: "hidden",

        fontFamily: "Tahoma, Arial",

        boxShadow: "0 5px 20px rgba(0,0,0,.5)",

        ...style,
      }}
    >
      {/* Title bar */}
      <div
        style={{
          height: 35,

          display: "flex",

          alignItems: "center",

          justifyContent: "space-between",

          paddingLeft: 10,

          paddingRight: 6,

          color: "white",

          fontWeight: "bold",

          background: "linear-gradient(#4ca2ff,#0054e3)",

          textShadow: "1px 1px #003399",
        }}
      >
        <span>{title}</span>

        {onClose && (
          <XpButton
            width={22}
            height={22}
            onClick={onClose}
            style={{
              padding: 0,

              minWidth: 22,

              color: "white",

              fontWeight: "bold",

              fontSize: 15,

              lineHeight: "18px",

              borderRadius: 4,

              border: "1px solid white",

              background: "linear-gradient(#ff8080,#c00000)",

              boxShadow: "none",
            }}
          >
            ×
          </XpButton>
        )}
      </div>

      <div
        style={{
          padding: 20,

          ...contentStyle,
        }}
      >
        {children}
      </div>

      {footer}

      <div
        style={{
          height: 25,

          background: "#d6d3ce",

          borderTop: "1px solid #aaa",
        }}
      />
    </div>
  );
}