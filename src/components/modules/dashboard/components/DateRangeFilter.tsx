import type { DashboardRange } from "@/types/dashboard.type";
import { DASHBOARD_RANGE_OPTIONS } from "../constants";

interface DateRangeFilterProps {
  range: DashboardRange;
  startDate: string;
  endDate: string;
  onRangeChange: (range: DashboardRange) => void;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

export default function DateRangeFilter({
  range,
  startDate,
  endDate,
  onRangeChange,
  onStartDateChange,
  onEndDateChange,
}: DateRangeFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border/70 bg-card/90 p-3">
      <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground" htmlFor="range-select">
        Range
      </label>
      <select
        id="range-select"
        value={range}
        onChange={(e) => onRangeChange(e.target.value as DashboardRange)}
        className="h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      >
        {DASHBOARD_RANGE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {range === "custom" ? (
        <>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            aria-label="Custom range start date"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="h-9 rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            aria-label="Custom range end date"
          />
        </>
      ) : null}
    </div>
  );
}
