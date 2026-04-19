export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  href?: string | null;
  metadata?: unknown;
  readAt?: string | null;
  createdAt: string;
}

export interface NotificationListPayload {
  notifications: Notification[];
  unreadCount: number;
}
