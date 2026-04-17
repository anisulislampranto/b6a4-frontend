import { Card, CardContent } from "@/components/ui/card";

interface KPIStatCardProps {
  title: string;
  value: string;
  hint?: string;
}

export default function KPIStatCard({ title, value, hint }: KPIStatCardProps) {
  return (
    <Card className="rounded-2xl border-border/70 bg-card/95">
      <CardContent className="space-y-1 p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold text-foreground sm:text-3xl">{value}</p>
        {hint ? <p className="text-sm text-muted-foreground">{hint}</p> : null}
      </CardContent>
    </Card>
  );
}
