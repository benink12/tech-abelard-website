export function scoreTone(score: number): "good" | "fair" | "poor" {
  if (score >= 80) return "good";
  if (score >= 55) return "fair";
  return "poor";
}

const TONE_COLOR: Record<ReturnType<typeof scoreTone>, string> = {
  good: "#3f9668",
  fair: "#b08d57",
  poor: "#c2483d",
};

export function ScoreRing({
  score,
  size = 168,
  strokeWidth = 12,
  className,
}: {
  score: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.max(0, Math.min(100, score)) / 100);
  const color = TONE_COLOR[scoreTone(score)];

  return (
    <div className={className} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeOpacity={0.1} strokeWidth={strokeWidth} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
    </div>
  );
}
