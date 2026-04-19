import { API_BASE_URL } from "./api-base";
import { requestJSONWithStatus } from "./http.service";
import type { ApiResponse } from "@/types/api.type";
import type { Notification, NotificationListPayload } from "@/types/notification.type";

const listMyNotifications = async (limit = 30) => {
  return requestJSONWithStatus<ApiResponse<NotificationListPayload>>(
    `${API_BASE_URL}/notifications/my?limit=${limit}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );
};

const markRead = async (id: string) => {
  return requestJSONWithStatus<ApiResponse<Pick<Notification, "id" | "readAt"> | null>>(
    `${API_BASE_URL}/notifications/${id}/read`,
    {
      method: "PATCH",
    }
  );
};

const markAllRead = async () => {
  return requestJSONWithStatus<ApiResponse<{ ok: true }>>(`${API_BASE_URL}/notifications/read-all`, {
    method: "PATCH",
  });
};

export const notificationService = {
  listMyNotifications,
  markRead,
  markAllRead,
};
