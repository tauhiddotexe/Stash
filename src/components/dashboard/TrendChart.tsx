import { useMemo } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { TrendBucket, TrendPoint } from "../../lib/calc";
import { formatFullDate, parseDateKey } from "../../lib/dates";
import { formatINR } from "../../lib/format";
import { useResolvedColors } from "../../hooks/useResolvedColors";
import { animationEnabled } from "../../lib/motion";

interface TrendChartProps {
  points: TrendPoint[];
  bucket: TrendBucket;
  empty: boolean;
}

function tooltipTitle(p: TrendPoint, bucket: TrendBucket): string {
  if (bucket === "day") return formatFullDate(p.key);
  if (bucket === "week") {
    const d = parseDateKey(p.key);
    return `Week of ${d.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`;
  }
  return parseDateKey(p.key).toLocaleDateString("en-IN", { month: "long", year: "numeric" });
}

export function TrendChart({ points, bucket, empty }: TrendChartProps) {
  const colors = useResolvedColors();

  const gradientId = useMemo(() => `trend-${colors.accent.replace("#", "")}`, [colors.accent]);

  if (empty) {
    return (
      <div className="flex h-44 items-center justify-center rounded-iosgroup bg-bg-secondary text-subheadline text-label-secondary">
        No spending in this period
      </div>
    );
  }

  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={points} margin={{ top: 8, right: 4, left: 4, bottom: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={colors.accent} stopOpacity={0.32} />
              <stop offset="100%" stopColor={colors.accent} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
            minTickGap={28}
            tick={{ fontSize: 11, fill: "var(--label-tertiary)", fontWeight: 500 }}
            tickMargin={8}
          />
          <YAxis
            hide
            domain={[0, (dataMax: number) => Math.max(dataMax * 1.15, 100)]}
            scale="linear"
          />
          <Tooltip
            cursor={{ stroke: "var(--separator)", strokeWidth: 1, strokeDasharray: "4 4" }}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const p = payload[0].payload as TrendPoint;
              return (
                <div className="rounded-iosgroup bg-label px-3 py-2 text-bg-primary shadow-elevated">
                  <div className="text-caption font-medium opacity-60">{tooltipTitle(p, bucket)}</div>
                  <div className="text-headline font-bold tabular-nums">{formatINR(p.total)}</div>
                </div>
              );
            }}
          />
          <Area
            type="monotone"
            dataKey="total"
            stroke={colors.accent}
            strokeWidth={2.5}
            fill={`url(#${gradientId})`}
            dot={false}
            activeDot={{ r: 4, fill: colors.accent, strokeWidth: 2, stroke: "var(--bg-primary)" }}
            isAnimationActive={animationEnabled()}
            animationDuration={700}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}