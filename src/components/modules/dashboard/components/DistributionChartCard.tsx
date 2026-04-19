import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ChartPoint } from "@/types/dashboard.type";

interface DistributionChartCardProps {
  title: string;
  data: ChartPoint[];
  color?: string;
  variant?: "donut" | "pie" | "horizontal-bars";
  colorByLabel?: Record<string, string>;
  valueFormatter?: (value: number) => string;
  emptyText?: string;
}

const DEFAULT_CHART_COLORS = ["#059669", "#2563eb", "#4f46e5", "#d97706", "#dc2626", "#0891b2", "#7c3aed"];

export default function DistributionChartCard({
  title,
  data,
  color = "#059669",
  variant = "donut",
  colorByLabel,
  valueFormatter,
  emptyText = "No data available.",
}: DistributionChartCardProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  const segments = data.reduce<
    {
      label: string;
      value: number;
      ratio: number;
      dashLength: number;
      dashOffset: number;
      color: string;
    }[]
  >((acc, item, index) => {
    const ratio = total > 0 ? item.value / total : 0;
    const dashLength = ratio * 100;
    const cumulativeRatio = acc.reduce((sum, segment) => sum + segment.ratio, 0);
    const dashOffset = -cumulativeRatio * 100;

    const segmentColor =
      colorByLabel?.[item.label] ||
      DEFAULT_CHART_COLORS[index % DEFAULT_CHART_COLORS.length] ||
      color;

    acc.push({
      label: item.label,
      value: item.value,
      ratio,
      dashLength,
      dashOffset,
      color: segmentColor,
    });

    return acc;
  }, []);

  return (
    <Card className="rounded-2xl border-border/70 bg-card/95">
      <CardHeader className="pb-0">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {data.length && total > 0 ? (
          <div className="grid gap-4 md:grid-cols-[180px_1fr] md:items-center">
            {variant === "donut" ? (
              <div className="flex justify-center">
                <svg viewBox="0 0 42 42" className="h-40 w-40" role="img" aria-label={title}>
                  <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#e5e7eb" strokeWidth="5" />
                  {segments.map((segment) => (
                    <circle
                      key={segment.label}
                      cx="21"
                      cy="21"
                      r="15.915"
                      fill="transparent"
                      stroke={segment.color}
                      strokeWidth="5"
                      strokeDasharray={`${segment.dashLength} ${100 - segment.dashLength}`}
                      strokeDashoffset={segment.dashOffset}
                      strokeLinecap="butt"
                      transform="rotate(-90 21 21)"
                    >
                      <title>{`${segment.label}: ${segment.value}`}</title>
                    </circle>
                  ))}
                  <text x="21" y="20" textAnchor="middle" className="fill-foreground text-[3.8px] font-semibold">
                    Total
                  </text>
                  <text x="21" y="24" textAnchor="middle" className="fill-foreground text-[4.2px] font-bold">
                    {valueFormatter ? valueFormatter(total) : total}
                  </text>
                </svg>
              </div>
            ) : variant === "pie" ? (
              <div className="flex justify-center">
                <svg viewBox="0 0 42 42" className="h-40 w-40" role="img" aria-label={title}>
                  {segments.map((segment) => (
                    <circle
                      key={segment.label}
                      cx="21"
                      cy="21"
                      r="15.915"
                      fill="transparent"
                      stroke={segment.color}
                      strokeWidth="31.83"
                      strokeDasharray={`${segment.dashLength} ${100 - segment.dashLength}`}
                      strokeDashoffset={segment.dashOffset}
                      strokeLinecap="butt"
                      transform="rotate(-90 21 21)"
                    >
                      <title>{`${segment.label}: ${segment.value}`}</title>
                    </circle>
                  ))}
                </svg>
              </div>
            ) : (
              <div className="space-y-2">
                {segments.map((segment) => (
                  <div key={`bar-${segment.label}`} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{segment.label}</span>
                      <span>{Math.round(segment.ratio * 100)}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted/60">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${Math.max(segment.ratio * 100, 2)}%`, backgroundColor: segment.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-2">
              {segments.map((segment) => (
                <div key={segment.label} className="flex items-center justify-between rounded-lg border border-border/70 px-3 py-2 text-sm">
                  <div className="flex items-center gap-2 text-foreground">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: segment.color }} />
                    <span className="font-medium">{segment.label}</span>
                  </div>
                  <div className="text-right text-muted-foreground">
                    <span>{valueFormatter ? valueFormatter(segment.value) : segment.value}</span>
                    <span className="ml-2">({Math.round(segment.ratio * 100)}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">{emptyText}</p>
        )}
      </CardContent>
    </Card>
  );
}
