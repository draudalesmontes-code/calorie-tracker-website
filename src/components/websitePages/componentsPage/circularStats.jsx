import CartImage from "../../../assets/cart.svg";

export default function  CircularStat({label, value, max, color }) {
    const pct = Math.max(0, Math.min(100, (value / max) * 100));
    const radius = 32;
    const strokeWidth = 7;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (pct / 100) * circumference;
    const strokeColor = color || "#0d6efd";


    return(
        <div style={{ textAlign: "center" }}>
      <div style={{ position: "relative", width: 90, height: 90, margin: "0 auto" }}>
        <svg
          width="90"
          height="90"
          viewBox="0 0 90 90"
          style={{ transform: "rotate(-90deg)" }}
        >
          {/* background circle */}
          <circle
            cx="45"
            cy="45"
            r={radius}
            fill="none"
            stroke="#eaedef"
            strokeWidth={strokeWidth}
          />
          {/* progress circle */}
          <circle
            cx="45"
            cy="45"
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>

        {/* center text */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            transform: "rotate(0deg)",
            fontSize: 12,
          }}
        >
          <strong>{value.toFixed(2)}</strong>
          <span style={{ fontSize: 11 }}>/ {max}</span>
        </div>
      </div>
      <div style={{ marginTop: 6, fontWeight: 600 }}>{label}</div>
    </div>
    );
}