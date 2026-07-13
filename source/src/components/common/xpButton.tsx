import { ReactNode } from "react";

type XpButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
  disabled?: boolean;
};

export default function XpButton({
  children,
  onClick,
  width = 120,
  height = 36,
  style,
  disabled = false,
}: XpButtonProps) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      style={{
        width,
        height,

        cursor: disabled ? "default" : "pointer",

        fontFamily: "Tahoma, Arial, sans-serif",
        fontSize: 14,
        fontWeight: "bold",

        color: "#000",

        borderRadius: 5,

        border: "2px solid #316ac5",

        background: disabled
          ? "#d4d0c8"
          : "linear-gradient(#ffffff,#dbe9ff,#9bbcf5)",

        boxShadow: "inset 0 1px white, 0 2px 4px rgba(0,0,0,.25)",

        transition: "transform .05s",

        ...style,
      }}
      onMouseDown={(e) => {
        e.currentTarget.style.transform = "translate(1px,1px)";
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = "";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "";
      }}
    >
      {children}
    </button>
  );
}