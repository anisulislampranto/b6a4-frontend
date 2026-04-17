import type { OrderStatus } from "@/types/order.type";

export const DASHBOARD_RANGE_OPTIONS = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
  { value: "custom", label: "Custom" },
] as const;

export const STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING: "#d97706",
  CONFIRMED: "#2563eb",
  SHIPPED: "#4f46e5",
  DELIVERED: "#059669",
  CANCELLED: "#dc2626",
};
