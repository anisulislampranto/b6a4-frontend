import { API_BASE_URL } from "./api-base";
import { requestJSONWithStatus } from "./http.service";
import type { ApiResponse } from "@/types/api.type";
import type {
  AdminDashboardStats,
  CustomerDashboardStats,
  DashboardRange,
  SellerDashboardStats,
} from "@/types/dashboard.type";

export interface DashboardQuery {
  range?: DashboardRange;
  startDate?: string;
  endDate?: string;
}

const buildDashboardQuery = (query?: DashboardQuery) => {
  const params = new URLSearchParams();
  if (!query) return "";

  if (query.range) params.set("range", query.range);
  if (query.startDate) params.set("startDate", query.startDate);
  if (query.endDate) params.set("endDate", query.endDate);

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
};

const getCustomerDashboard = async (query?: DashboardQuery) => {
  return requestJSONWithStatus<ApiResponse<CustomerDashboardStats>>(
    `${API_BASE_URL}/dashboard/customer${buildDashboardQuery(query)}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );
};

const getSellerDashboard = async (query?: DashboardQuery) => {
  return requestJSONWithStatus<ApiResponse<SellerDashboardStats>>(
    `${API_BASE_URL}/dashboard/seller${buildDashboardQuery(query)}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );
};

const getAdminDashboard = async (query?: DashboardQuery) => {
  return requestJSONWithStatus<ApiResponse<AdminDashboardStats>>(
    `${API_BASE_URL}/dashboard/admin${buildDashboardQuery(query)}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );
};

export const dashboardService = {
  getCustomerDashboard,
  getSellerDashboard,
  getAdminDashboard,
};
