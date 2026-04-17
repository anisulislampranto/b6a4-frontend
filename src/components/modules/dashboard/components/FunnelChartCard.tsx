import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ChartPoint } from "@/types/dashboard.type";

interface FunnelChartCardProps {
  title: string;
  data: ChartPoint[];
  colorByLabel?: Record<string, string>;
  emptyText?: string;
}

export default function FunnelChartCard({
  title,
  data,
  colorByLabel,
  emptyText = "No funnel data available.",
}: FunnelChartCardProps) {
  const max = Math.max(...data.map((item) => item.value), 1);

  return (
    <Card className="rounded-2xl border-border/70 bg-card/95">
      <CardHeader className="pb-0">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-4">
        {data.length ? (
          data.map((item, index) => {
            const width = Math.max((item.value / max) * 100, 12);
            const color = colorByLabel?.[item.label] || "#059669";

            return (
              <div key={item.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">{item.label}</span>
                  <span className="text-muted-foreground">{item.value}</span>
                </div>
                <div className="flex justify-center">
                  <div
                    className="h-9 rounded-md transition-all"
                    style={{ width: `${width}%`, backgroundColor: color, opacity: 1 - index * 0.1 }}
                    title={`${item.label}: ${item.value}`}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <p className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">{emptyText}</p>
        )}
      </CardContent>
    </Card>
  );
}
