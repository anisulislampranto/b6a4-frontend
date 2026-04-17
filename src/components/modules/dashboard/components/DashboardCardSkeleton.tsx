import { Card, CardContent } from "@/components/ui/card";

export default function DashboardCardSkeleton() {
  return (
    <Card className="rounded-2xl border-border/70 bg-card/95">
      <CardContent className="space-y-3 p-6">
        <div className="h-3 w-1/3 animate-pulse rounded bg-muted" />
        <div className="h-8 w-2/3 animate-pulse rounded bg-muted" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
      </CardContent>
    </Card>
  );
}
