export default function Disclaimer() {
  return (
    <div
      style={{
        background: "var(--bg-elevated)",
        borderLeft: "2px solid var(--warning)",
        padding: "8px 16px",
        fontFamily: "Inter, sans-serif",
        fontSize: "0.7rem",
        color: "var(--text-muted)",
        textAlign: "center",
        lineHeight: 1.6,
      }}
    >
      X-Ray is a diagnostic tool — not financial advice. We never access your MT5
      password or broker credentials. Your trade data is analyzed and secured. You
      control your data.
    </div>
  );
}
