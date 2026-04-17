import type { OrderStatus } from "./order.type";

export type DashboardRange = "7d" | "30d" | "90d" | "custom";

export interface ChartPoint {
  label: string;
  value: number;
}

export interface SellerTopMedicine {
  label: string;
  unitsSold: number;
  revenue: number;
}

export interface PerformancePoint {
  label: string;
  unitsSold: number;
  revenue: number;
}

export interface CustomerRecentOrder {
  id: string;
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
}

export interface SellerRecentOrder extends CustomerRecentOrder {
  customerName: string;
  customerEmail: string;
}

export interface AdminRecentEvent {
  type: string;
  timestamp: string;
  message: string;
}

export interface CustomerDashboardStats {
  role: "CUSTOMER";
  range: DashboardRange;
  summary: {
    totalOrders: number;
    totalSpent: number;
    activeOrders: number;
    deliveredOrders: number;
    cancelledOrders: number;
    eligibleReviewCount: number;
    reviewedCount: number;
    reviewCompletionRate: number;
  };
  trends: {
    monthlySpend: ChartPoint[];
  };
  distributions: {
    topCategories: ChartPoint[];
    topBrands: ChartPoint[];
  };
  recentOrders: CustomerRecentOrder[];
}

export interface SellerDashboardStats {
  role: "SELLER";
  range: DashboardRange;
  summary: {
    totalMedicines: number;
    activeMedicines: number;
    inactiveMedicines: number;
    lowStockMedicines: number;
    totalUnitsSold: number;
    grossRevenue: number;
    totalOrders: number;
  };
  trends: {
    revenueByDay: ChartPoint[];
  };
  distributions: {
    orderStatus: ChartPoint[];
    topMedicines: SellerTopMedicine[];
    funnel: ChartPoint[];
  };
  recentOrders: SellerRecentOrder[];
}

export interface AdminDashboardStats {
  role: "ADMIN";
  range: DashboardRange;
  summary: {
    gmvDelivered: number;
    totalOrders: number;
    totalUsers: number;
    totalSellers: number;
    activeSellers: number;
    totalMedicines: number;
    activeMedicines: number;
    reviewVolume: number;
    averageRating: number;
  };
  trends: {
    newUsersByDay: ChartPoint[];
  };
  distributions: {
    ordersByStatus: ChartPoint[];
    usersByRole: ChartPoint[];
    categoryPerformance: PerformancePoint[];
    brandPerformance: PerformancePoint[];
  };
  recentEvents: AdminRecentEvent[];
}
