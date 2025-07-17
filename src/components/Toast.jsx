import React, { useEffect, useRef, useState } from "react";

const typeStyles = {
  success: {
    background: "linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)",
    color: "#fff",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="12" fill="#43e97b"/><path d="M7 13l3 3 7-7" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    )
  },
  error: {
    background: "linear-gradient(90deg, #f85032 0%, #e73827 100%)",
    color: "#fff",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="12" fill="#f85032"/><path d="M15 9l-6 6M9 9l6 6" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/></svg>
    )
  },
  warning: {
    background: "linear-gradient(90deg, #f7971e 0%, #ffd200 100%)",
    color: "#fff",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="12" fill="#f7971e"/><path d="M12 7v5m0 4h.01" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/></svg>
    )
  },
  info: {
    background: "linear-gradient(90deg, #2196f3 0%, #6dd5fa 100%)",
    color: "#fff",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="12" fill="#2196f3"/><path d="M12 8h.01M12 12v4" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/></svg>
    )
  }
};

export default function Toast({ message, type = "info", onClose, duration = 2000 }) {
  const [show, setShow] = useState(false);
  const timerRef = useRef();
  const progressRef = useRef();

  useEffect(() => {
    setShow(true);
    if (message) {
      timerRef.current = setTimeout(() => {
        setShow(false);
        setTimeout(() => onClose && onClose(), 350);
      }, duration);
    }
    return () => clearTimeout(timerRef.current);
  }, [message, duration, onClose]);

  const style = typeStyles[type] || typeStyles.info;

  return (
    <div
      className={`toast-fancy${show ? " toast-fancy-show" : ""}`}
      style={{
        position: "fixed",
        top: 80,
        right: 32,
        zIndex: 9999,
        background: style.background,
        color: style.color,
        padding: "18px 36px 18px 22px",
        borderRadius: 16,
        fontWeight: 600,
        fontSize: 18,
        boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
        display: "flex",
        alignItems: "center",
        gap: 18,
        minWidth: 260,
        maxWidth: 420,
        transition: "opacity 0.35s, transform 0.35s",
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(-30px)",
        pointerEvents: show ? "auto" : "none"
      }}
    >
      <span style={{ fontSize: 22, flexShrink: 0 }}>{style.icon}</span>
      <span style={{ flex: 1 }}>{message}</span>
      {onClose && (
        <button
          onClick={() => { setShow(false); setTimeout(() => onClose(), 350); }}
          style={{
            background: "transparent",
            border: "none",
            color: style.color,
            fontSize: 26,
            cursor: "pointer",
            marginLeft: 12,
            lineHeight: 1
          }}
          aria-label="Đóng"
        >
          ×
        </button>
      )}
      {/* Progress bar */}
      <span
        ref={progressRef}
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          height: 4,
          width: show ? "100%" : 0,
          background: "rgba(255,255,255,0.5)",
          borderRadius: "0 0 16px 16px",
          transition: `width ${duration}ms linear`,
          zIndex: 1
        }}
      />
    </div>
  );
}

// Toast CSS (có thể thêm vào file global hoặc Header.css)
// .toast-fancy { opacity: 0; transform: translateY(-30px); transition: opacity 0.35s, transform 0.35s; }
// .toast-fancy-show { opacity: 1; transform: translateY(0); } 