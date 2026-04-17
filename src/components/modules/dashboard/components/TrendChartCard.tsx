import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ChartPoint } from "@/types/dashboard.type";

interface TrendChartCardProps {
  title: string;
  data: ChartPoint[];
  color?: string;
  variant?: "line" | "area" | "bars";
  emptyText?: string;
}

interface PlotPoint {
  x: number;
  y: number;
  label: string;
  value: number;
}

const buildPlotPoints = (data: ChartPoint[]): PlotPoint[] => {
  if (!data.length) return [];

  const max = Math.max(...data.map((item) => item.value), 1);
  const width = 100;
  const height = 56;
  const step = data.length === 1 ? 0 : width / (data.length - 1);

  return data.map((item, idx) => ({
    x: Number((idx * step).toFixed(2)),
    y: Number((height - (item.value / max) * height).toFixed(2)),
    label: item.label,
    value: item.value,
  }));
};

const pathFromPoints = (points: PlotPoint[]) => {
  if (!points.length) return "";

  if (points.length === 1) {
    const p = points[0];
    return `M ${p.x} ${p.y} L ${p.x + 0.1} ${p.y}`;
  }

  return points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
};

export default function TrendChartCard({
  title,
  data,
  color = "#059669",
  variant = "line",
  emptyText = "No trend data for this range.",
}: TrendChartCardProps) {
  const points = buildPlotPoints(data);
  const trendPath = pathFromPoints(points);

  return (
    <Card className="rounded-2xl border-border/70 bg-card/95">
      <CardHeader className="pb-0">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        {data.length ? (
          <>
            <div className="h-48 rounded-xl border border-border/70 bg-muted/15 p-3">
              <svg viewBox="0 0 100 60" className="h-full w-full" preserveAspectRatio="none" role="img" aria-label={title}>
                <line x1="0" y1="56" x2="100" y2="56" stroke="#d1d5db" strokeWidth="0.6" />
                <line x1="0" y1="28" x2="100" y2="28" stroke="#e5e7eb" strokeWidth="0.4" strokeDasharray="2 2" />
                <line x1="0" y1="8" x2="100" y2="8" stroke="#e5e7eb" strokeWidth="0.4" strokeDasharray="2 2" />

                {variant === "bars"
                  ? points.map((point) => (
                      <rect
                        key={`${point.label}-${point.x}`}
                        x={Math.max(point.x - 2.5, 0)}
                        y={point.y}
                        width="5"
                        height={Math.max(56 - point.y, 0.4)}
                        rx="0.8"
                        fill={color}
                      >
                        <title>{`${point.label}: ${point.value}`}</title>
                      </rect>
                    ))
                  : null}

                {(variant === "line" || variant === "area") && trendPath ? (
                  <>
                    {variant === "area" ? (
                      <path d={`${trendPath} L 100 56 L 0 56 Z`} fill={color} opacity="0.2" />
                    ) : null}
                    <path d={trendPath} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
                  </>
                ) : null}

                {variant !== "bars"
                  ? points.map((point) => (
                      <circle key={`${point.label}-${point.x}`} cx={point.x} cy={point.y} r="1.4" fill={color}>
                        <title>{`${point.label}: ${point.value}`}</title>
                      </circle>
                    ))
                  : null}
              </svg>
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              {data.slice(-6).map((item) => (
                <span key={item.label} className="rounded-md border border-border/60 px-2 py-1">
                  {item.label}: {item.value}
                </span>
              ))}
            </div>
          </>
        ) : (
          <p className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">{emptyText}</p>
        )}
      </CardContent>
    </Card>
  );
}
