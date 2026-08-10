import { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import type { CategorySlice } from "../../lib/calc";
import { getCategory } from "../../lib/categories";
import { formatINR } from "../../lib/format";
import { useResolvedColors } from "../../hooks/useResolvedColors";
import { animationEnabled } from "../../lib/motion";

interface CategoryBreakdownProps {
  slices: CategorySlice[];
  total: number;
}

const MAX_SLICES = 6;

/** Donut breakdown with an amount list. Over 6 categories are aggregated into Other. */
export function CategoryBreakdown({ slices, total }: CategoryBreakdownProps) {
  const colors = useResolvedColors();
  const empty = slices.length === 0 || total === 0;

const data = useMemo(() => {
    if (slices.length <= MAX_SLICES) return slices;
    const top = slices.slice(0, MAX_SLICES - 1);
    const rest = slices.slice(MAX_SLICES - 1);
    const restTotal = rest.reduce((a, s) => a + s.total, 0);
    const restCount = rest.reduce((a, s) => a + s.count, 0);
    return [...top, { category: "other" as const, colorVar: "--cat-other", total: restTotal, count: restCount }];
  }, [slices]);

  if (empty) {
    return (
      <div className="flex h-44 flex-col items-center justify-center rounded-iosgroup bg-bg-secondary text-subheadline text-label-secondary">
        <div className="text-caption font-medium uppercase tracking-wide opacity-60">No data</div>
        No category expenses yet
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
      <div className="relative mx-auto h-40 w-40 shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="total"
              nameKey="category"
              innerRadius="68%"
              outerRadius="100%"
              paddingAngle={2}
              cornerRadius={4}
              stroke="none"
              isAnimationActive={animationEnabled()}
              animationDuration={750}
              animationEasing="ease-out"
            >
              {data.map((s) => (
                <Cell key={s.category} fill={colors.category[s.category]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-caption text-label-secondary">Total</span>
          <span className="text-subheadline font-bold tabular-nums">{formatINR(total)}</span>
        </div>
      </div>

      <ul className="min-w-0 flex-1 space-y-2">
        {data.map((s) => {
          const meta = getCategory(s.category);
          const pct = total > 0 ? Math.round((s.total / total) * 100) : 0;
          return (
            <li key={s.category} className="flex items-center gap-2.5 px-1 py-0.5">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: `var(${s.colorVar})` }}
                aria-hidden
              />
              <span className="min-w-0 flex-1 truncate text-footnote font-medium text-label-secondary">
                {meta.label}
              </span>
              <span className="text-caption text-label-tertiary">{pct}%</span>
              <span className="w-20 text-right text-footnote font-semibold tabular-nums">
                {formatINR(s.total)}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}