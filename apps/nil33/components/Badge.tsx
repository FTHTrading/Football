interface BadgeProps {
  status: "pass" | "review" | "fail";
  label?: string;
}

const styles = {
  pass: "bg-nil-green/10 text-nil-green border-nil-green/20",
  review: "bg-nil-gold/10 text-nil-gold border-nil-gold/20",
  fail: "bg-nil-red/10 text-nil-red border-nil-red/20",
};

const labels = { pass: "Pass", review: "Review", fail: "Fail" };

export default function Badge({ status, label }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-md border ${styles[status]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === "pass" ? "bg-nil-green" : status === "review" ? "bg-nil-gold" : "bg-nil-red"}`} />
      {label || labels[status]}
    </span>
  );
}
