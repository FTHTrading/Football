/* ─── Star Pips ─── */
export default function Stars({
  count,
  size = "base",
}: {
  count: number;
  size?: "sm" | "base" | "lg";
}) {
  const textSize = size === "sm" ? "text-sm" : size === "lg" ? "text-lg" : "text-base";
  const gap = size === "sm" ? "gap-0.5" : "gap-1";
  return (
    <div className={`flex ${gap}`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`${textSize} ${i < count ? "text-uc-gold" : "text-uc-border"}`}
        >
          ★
        </span>
      ))}
    </div>
  );
}
