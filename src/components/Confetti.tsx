import { useMemo } from "react";

const NUM_PIECES = 45;
const COLORS = ["#FFC32B", "#FFE07A", "#FF6F9C", "#47DD8A", "#4EC5F1", "#7C3AED", "#FF8C42"];

type Piece = {
  id: number;
  left: string;
  size: number;
  color: string;
  duration: number;
  delay: number;
};

export function Confetti() {
  const pieces = useMemo<Piece[]>(
    () =>
      Array.from({ length: NUM_PIECES }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        size: 6 + Math.random() * 8,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        duration: 2.6 + Math.random() * 1.8,
        delay: Math.random() * 2,
      })),
    [],
  );

  return (
    <div className="t-confetti" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="t-confetti-piece"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
