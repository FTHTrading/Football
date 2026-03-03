import { prisma } from "@/lib/prisma";
import { formatCents, formatDate, parsePageParam } from "@/lib/utils";
import Link from "next/link";

const PAGE_SIZE = 20;

function gradeBadge(grade: string) {
  const g = grade.replace("+", "").replace("-", "");
  if (g === "A") return "badge-green";
  if (g === "B") return "badge-cyan";
  if (g === "C") return "badge-yellow";
  return "badge-red";
}

function statusBadge(status: string) {
  switch (status) {
    case "APPROVED":
      return "badge-green";
    case "SUBMITTED":
      return "badge-cyan";
    case "DRAFT":
      return "badge-muted";
    case "REJECTED":
      return "badge-red";
    case "ARCHIVED":
      return "badge-muted";
    default:
      return "badge-muted";
  }
}

async function getStats() {
  const [total, avgScore, gradeGroups, statusGroups] = await Promise.all([
    prisma.underwritingMemo.count(),
    prisma.underwritingMemo.aggregate({ _avg: { compositeScore: true } }),
    prisma.underwritingMemo.groupBy({ by: ["grade"], _count: true, orderBy: { _count: { grade: "desc" } }, take: 5 }),
    prisma.underwritingMemo.groupBy({ by: ["status"], _count: true }),
  ]);

  const approved = statusGroups.find((s) => s.status === "APPROVED")?._count ?? 0;
  const avgVal = avgScore._avg.compositeScore ?? 0;

  return { total, avgScore: avgVal, approved, gradeGroups, statusGroups };
}

async function getMemos(page: number, filters: { grade?: string; status?: string; athleteId?: string }) {
  const where: Record<string, unknown> = {};
  if (filters.grade) where.grade = filters.grade;
  if (filters.status) where.status = filters.status;
  if (filters.athleteId) where.athleteId = filters.athleteId;

  const [memos, count] = await Promise.all([
    prisma.underwritingMemo.findMany({
      where,
      include: {
        athlete: { select: { displayName: true, sport: true, school: true } },
        spv: { select: { legalName: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.underwritingMemo.count({ where }),
  ]);

  return { memos, count, totalPages: Math.ceil(count / PAGE_SIZE) };
}

export default async function UnderwritingPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const page = parsePageParam(typeof params.page === "string" ? params.page : null);
  const grade = typeof params.grade === "string" ? params.grade : undefined;
  const status = typeof params.status === "string" ? params.status : undefined;
  const athleteId = typeof params.athleteId === "string" ? params.athleteId : undefined;

  const [stats, { memos, count, totalPages }] = await Promise.all([
    getStats(),
    getMemos(page, { grade, status, athleteId }),
  ]);

  const statCards = [
    { label: "Total Memos", value: stats.total, color: "text-rails-cyan" },
    { label: "Avg Score", value: stats.avgScore.toFixed(1), color: "text-rails-green" },
    { label: "Approved", value: stats.approved, color: "text-rails-gold" },
    {
      label: "Top Grade",
      value: stats.gradeGroups[0]?.grade ?? "—",
      color: "text-rails-green",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-rails-text">Underwriting</h1>
          <p className="mt-1 text-sm text-rails-text-dim">
            33-signal engine memos — score, grade, covenant, and valuation analysis
          </p>
        </div>
        <Link href="/nil33/underwriting/new" className="btn-primary text-sm">
          + New Underwriting
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {statCards.map((s) => (
          <div key={s.label} className="stat-card">
            <span className={`font-mono text-2xl font-bold ${s.color}`}>{s.value}</span>
            <span className="text-xs text-rails-text-dim">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card">
        <form className="flex flex-wrap items-end gap-3" method="GET">
          <div>
            <label className="mb-1 block text-[10px] uppercase tracking-wider text-rails-text-dim">Grade</label>
            <select name="grade" defaultValue={grade ?? ""} className="input text-xs w-24">
              <option value="">All</option>
              {["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D", "F"].map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-[10px] uppercase tracking-wider text-rails-text-dim">Status</label>
            <select name="status" defaultValue={status ?? ""} className="input text-xs w-28">
              <option value="">All</option>
              {["DRAFT", "SUBMITTED", "APPROVED", "REJECTED", "ARCHIVED"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn-outline text-xs">Apply</button>
          {(grade || status || athleteId) && (
            <Link href="/nil33/underwriting" className="text-xs text-rails-muted hover:text-rails-text">
              Clear filters
            </Link>
          )}
        </form>
      </div>

      {/* Results table */}
      <div className="card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-rails-text">
            {count} Memo{count !== 1 ? "s" : ""}
          </h2>
          <span className="text-xs text-rails-text-dim">
            Page {page} of {totalPages || 1}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-surface-border text-left text-rails-text-dim">
                <th className="pb-2 pr-4 font-medium">Athlete</th>
                <th className="pb-2 pr-4 font-medium">Sport</th>
                <th className="pb-2 pr-4 font-medium">School</th>
                <th className="pb-2 pr-4 font-medium text-right">Score</th>
                <th className="pb-2 pr-4 font-medium">Grade</th>
                <th className="pb-2 pr-4 font-medium text-right">Valuation (Mid)</th>
                <th className="pb-2 pr-4 font-medium text-right">Flags</th>
                <th className="pb-2 pr-4 font-medium">Status</th>
                <th className="pb-2 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {memos.map((memo) => (
                <tr key={memo.id} className="border-b border-surface-border/50 table-row-hover">
                  <td className="py-2 pr-4">
                    <Link
                      href={`/nil33/underwriting/${memo.id}`}
                      className="font-medium text-rails-green hover:underline"
                    >
                      {memo.athlete.displayName}
                    </Link>
                  </td>
                  <td className="py-2 pr-4 text-rails-text-dim">{memo.athlete.sport}</td>
                  <td className="py-2 pr-4 text-rails-text-dim">{memo.athlete.school}</td>
                  <td className="py-2 pr-4 text-right font-mono text-rails-cyan">
                    {memo.compositeScore.toFixed(1)}
                  </td>
                  <td className="py-2 pr-4">
                    <span className={gradeBadge(memo.grade)}>{memo.grade}</span>
                  </td>
                  <td className="py-2 pr-4 text-right font-mono text-rails-gold">
                    {formatCents(memo.valuationMidCents)}
                  </td>
                  <td className="py-2 pr-4 text-right">
                    {memo.criticalFlagCount > 0 ? (
                      <span className="badge-red">{memo.criticalFlagCount} crit</span>
                    ) : memo.flagCount > 0 ? (
                      <span className="badge-yellow">{memo.flagCount}</span>
                    ) : (
                      <span className="text-rails-text-dim">—</span>
                    )}
                  </td>
                  <td className="py-2 pr-4">
                    <span className={statusBadge(memo.status)}>{memo.status}</span>
                  </td>
                  <td className="py-2 text-rails-text-dim">{formatDate(memo.createdAt)}</td>
                </tr>
              ))}
              {memos.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-rails-text-dim">
                    No underwriting memos found.{" "}
                    <Link href="/nil33/underwriting/new" className="text-rails-green hover:underline">
                      Create one →
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-4 flex items-center justify-center gap-2">
            {page > 1 && (
              <Link
                href={`/nil33/underwriting?page=${page - 1}${grade ? `&grade=${grade}` : ""}${status ? `&status=${status}` : ""}`}
                className="btn-outline text-xs"
              >
                ← Prev
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={`/nil33/underwriting?page=${page + 1}${grade ? `&grade=${grade}` : ""}${status ? `&status=${status}` : ""}`}
                className="btn-outline text-xs"
              >
                Next →
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
