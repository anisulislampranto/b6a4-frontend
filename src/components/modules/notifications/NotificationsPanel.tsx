"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Bell, CheckCheck, Dot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Notification } from "@/types/notification.type";
import { notificationService } from "@/services/notification.service";

interface NotificationsPanelProps {
  open: boolean;
  refreshKey?: number;
  onUnreadCountChange?: (count: number) => void;
  onNavigate?: () => void;
}

const formatDateTime = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));

export default function NotificationsPanel({ open, refreshKey, onUnreadCountChange, onNavigate }: NotificationsPanelProps) {
  const [items, setItems] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasItems = items.length > 0;

  const updateUnread = useCallback((count: number) => {
    setUnreadCount(count);
    onUnreadCountChange?.(count);
  }, [onUnreadCountChange]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await notificationService.listMyNotifications(30);
      if (!res.ok) {
        setError("Failed to load notifications.");
        setItems([]);
        updateUnread(0);
        return;
      }

      const payload = res.data.data;
      setItems(payload.notifications || []);
      updateUnread(payload.unreadCount || 0);
    } catch {
      setError("Something went wrong while loading notifications.");
      setItems([]);
      updateUnread(0);
    } finally {
      setLoading(false);
    }
  }, [updateUnread]);

  useEffect(() => {
    if (!open) return;
    load();
  }, [open, load]);

  useEffect(() => {
    if (!open) return;
    if (refreshKey === undefined) return;
    load();
  }, [open, refreshKey, load]);

  const grouped = useMemo(() => {
    const unread = items.filter((n) => !n.readAt);
    const read = items.filter((n) => !!n.readAt);
    return { unread, read };
  }, [items]);

  const markAllRead = async () => {
    const previous = items;
    setItems((prev) => prev.map((n) => ({ ...n, readAt: n.readAt ?? new Date().toISOString() })));
    updateUnread(0);

    try {
      const res = await notificationService.markAllRead();
      if (!res.ok) {
        setItems(previous);
        load();
      }
    } catch {
      setItems(previous);
      load();
    }
  };

  const markOneReadOptimistic = async (id: string) => {
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, readAt: n.readAt ?? new Date().toISOString() } : n))
    );
    updateUnread(Math.max(unreadCount - 1, 0));

    try {
      await notificationService.markRead(id);
    } catch {
      load();
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-4 border-b border-border/70 pb-4">
        <div>
          <p className="text-sm font-semibold text-foreground">Notifications</p>
          <p className="text-xs text-muted-foreground">Updates about orders, inventory, and platform activity.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={load}
            disabled={loading}
            className="rounded-xl"
          >
            Refresh
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={markAllRead}
            disabled={!hasItems || unreadCount === 0 || loading}
            className="rounded-xl"
          >
            <CheckCheck className="size-4" />
            Mark all read
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pt-4">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="h-16 animate-pulse rounded-2xl border border-border/70 bg-muted/40" />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        ) : !hasItems ? (
          <Card className="rounded-2xl border-dashed border-border/80 bg-card/80">
            <CardContent className="space-y-3 p-6 text-center">
              <div className="mx-auto flex size-12 items-center justify-center rounded-2xl border border-border/70 bg-muted/20">
                <Bell className="size-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-semibold text-foreground">You&apos;re all caught up</p>
              <p className="text-sm text-muted-foreground">New notifications will appear here in real time.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-5">
            {grouped.unread.length ? (
              <section className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Unread</p>
                <div className="space-y-2">
                  {grouped.unread.map((n) => (
                    <div
                      key={n.id}
                      className="group rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-foreground">{n.title}</p>
                          <p className="mt-1 text-sm text-muted-foreground">{n.message}</p>
                          <p className="mt-2 text-xs text-muted-foreground">{formatDateTime(n.createdAt)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Dot className="size-6 text-emerald-600" />
                          <Button
                            type="button"
                            variant="outline"
                            size="xs"
                            className="rounded-lg"
                            onClick={() => markOneReadOptimistic(n.id)}
                          >
                            Mark read
                          </Button>
                        </div>
                      </div>
                      {n.href ? (
                        <div className="mt-3">
                          <Button
                            asChild
                            variant="outline"
                            size="sm"
                            className="rounded-xl border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                          >
                            <Link href={n.href} onClick={onNavigate}>
                              Open
                            </Link>
                          </Button>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {grouped.read.length ? (
              <section className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Earlier</p>
                <div className="space-y-2">
                  {grouped.read.map((n) => (
                    <div key={n.id} className="rounded-2xl border border-border/70 bg-card/95 p-4">
                      <p className="truncate text-sm font-semibold text-foreground">{n.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{n.message}</p>
                      <p className="mt-2 text-xs text-muted-foreground">{formatDateTime(n.createdAt)}</p>
                      {n.href ? (
                        <div className="mt-3">
                          <Button asChild variant="outline" size="sm" className="rounded-xl">
                            <Link href={n.href} onClick={onNavigate}>
                              Open
                            </Link>
                          </Button>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
