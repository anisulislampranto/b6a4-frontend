"use client";

import { useEffect, useMemo, useState } from "react";
import { adminService } from "@/services/admin.service";
import type { Order, OrderStatus } from "@/types/order.type";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const statusOptions: OrderStatus[] = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];

type OrderWithOptionalUser = Order & {
    user?: {
        id: string;
        name?: string | null;
        email?: string | null;
    };
};

export default function AdminOrdersClient() {
    const [orders, setOrders] = useState<OrderWithOptionalUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [savingOrderId, setSavingOrderId] = useState<string | null>(null);
    const [statusDraft, setStatusDraft] = useState<Record<string, OrderStatus>>({});

    const pendingCount = useMemo(() => orders.filter((order) => order.status === "PENDING").length, [orders]);

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const { ok, data } = await adminService.getAllOrders();
                if (!ok) {
                    if (!cancelled) setError(data?.message || "Failed to load orders.");
                    return;
                }

                if (!cancelled) {
                    const list = (data?.data || []) as OrderWithOptionalUser[];
                    setOrders(list);
                    setStatusDraft(
                        list.reduce<Record<string, OrderStatus>>((acc, order) => {
                            acc[order.id] = order.status;
                            return acc;
                        }, {})
                    );
                }
            } catch {
                if (!cancelled) setError("Something went wrong while loading orders.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        load();
        return () => {
            cancelled = true;
        };
    }, []);

    const onUpdateStatus = async (order: OrderWithOptionalUser) => {
        const nextStatus = statusDraft[order.id];
        if (!nextStatus || nextStatus === order.status) return;

        setSavingOrderId(order.id);
        setError(null);
        try {
            const { ok, data } = await adminService.updateOrderStatus(order.id, nextStatus);
            if (!ok) {
                setError(data?.message || "Failed to update order status.");
                return;
            }

            setOrders((prev) =>
                prev.map((item) => (item.id === order.id ? { ...item, status: nextStatus } : item))
            );
            toast.success("Order status updated successfully.");
        } catch {
            setError("Something went wrong while updating order status.");
        } finally {
            setSavingOrderId(null);
        }
    };

    return (
        <main className="mx-auto min-h-[70vh] max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <section className="mb-7 rounded-3xl border border-border/70 bg-card/85 px-6 py-7 sm:px-8">
                <h1 className="text-3xl font-bold text-emerald-700 sm:text-4xl">Admin Orders</h1>
                <p className="mt-2 text-sm text-muted-foreground">Monitor every platform order and update status when needed.</p>
                <div className="mt-5 flex flex-wrap gap-3">
                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        Total Orders: {orders.length}
                    </span>
                    <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                        Pending: {pendingCount}
                    </span>
                </div>
            </section>

            {loading && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700">
                    Loading orders...
                </div>
            )}

            {error && (
                <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">
                    {error}
                </div>
            )}

            {!loading && orders.length === 0 && !error && (
                <Card className="rounded-2xl border-border/70 bg-card/95">
                    <CardContent className="p-6 text-center text-muted-foreground">No orders found.</CardContent>
                </Card>
            )}

            {!loading && orders.length > 0 && (
                <section className="grid gap-5">
                    {orders.map((order) => (
                        <Card key={order.id} className="rounded-2xl border-border/70 bg-card/95">
                            <CardContent className="space-y-4 p-6">
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Order ID</p>
                                        <p className="font-mono text-sm font-semibold text-foreground">{order.id}</p>
                                    </div>
                                    <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                        {order.status}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Customer</p>
                                        <p className="text-sm font-medium text-foreground">{order.user?.name || "N/A"}</p>
                                        <p className="text-xs text-muted-foreground">{order.user?.email || ""}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Amount</p>
                                        <p className="text-sm font-semibold text-emerald-700">${order.totalAmount.toFixed(2)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Placed At</p>
                                        <p className="text-sm font-medium text-foreground">
                                            {new Date(order.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="rounded-xl border border-border/70 bg-card p-3">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Items</p>
                                    <div className="mt-2 space-y-2">
                                        {order.items.map((item) => (
                                            <div key={item.id} className="flex items-center justify-between text-sm">
                                                <span className="font-medium text-foreground">{item.medicine?.name || "Medicine"}</span>
                                                <span className="text-muted-foreground">
                                                    Qty {item.quantity} x ${item.price.toFixed(2)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                            Update Status
                                        </label>
                                        <select
                                            value={statusDraft[order.id] || order.status}
                                            onChange={(e) =>
                                                setStatusDraft((prev) => ({
                                                    ...prev,
                                                    [order.id]: e.target.value as OrderStatus,
                                                }))
                                            }
                                            className="h-11 w-full rounded-xl border border-border bg-card px-3.5 text-sm outline-none transition focus-visible:ring-4 focus-visible:ring-ring/30"
                                        >
                                            {statusOptions.map((status) => (
                                                <option key={status} value={status}>
                                                    {status}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <Button
                                        className="bg-emerald-600 hover:bg-emerald-700"
                                        disabled={savingOrderId === order.id || statusDraft[order.id] === order.status}
                                        onClick={() => onUpdateStatus(order)}
                                    >
                                        {savingOrderId === order.id ? "Saving..." : "Save Status"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </section>
            )}
        </main>
    );
}
