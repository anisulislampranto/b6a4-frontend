"use client";

import { useEffect, useState } from "react";
import SafeImage from "@/components/ui/SafeImage";
import { orderService } from "@/services/order.service";
import type { Order, OrderStatus } from "@/types/order.type";
import { Card, CardContent } from "@/components/ui/card";
import { Package, Clock, Truck, CheckCircle2, XCircle, ShoppingBag, CreditCard } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import PaymentStatusBadge from "./PaymentStatusBadge";

const statusConfig: Record<OrderStatus, { icon: typeof Clock; color: string; bg: string; border: string }> = {
    PENDING: { icon: Clock, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
    PARTIALLY_CONFIRMED: { icon: Package, color: "text-blue-500", bg: "bg-blue-50", border: "border-blue-100" },
    CONFIRMED: { icon: Package, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
    SHIPPED: { icon: Truck, color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100" },
    DELIVERED: { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
    CANCELLED: { icon: XCircle, color: "text-red-600", bg: "bg-red-50", border: "border-red-100" },
};

export default function OrdersClient() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState<{ totalPages: number; total: number } | null>(null);
    const limit = 5;

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const { ok, data } = await orderService.getMyOrders({ page, limit });
                if (ok) {
                    setOrders(data?.data || []);
                    setMeta(data?.meta || null);
                } else {
                    setError("Failed to fetch your orders.");
                }
            } catch (err) {
                setError("Something went wrong while loading orders.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [page]);

    if (loading) {
        return (
            <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <header className="mb-10">
                    <Skeleton className="h-10 w-48 rounded-lg mb-2" />
                    <Skeleton className="h-4 w-96 rounded-md" />
                </header>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="overflow-hidden py-1 rounded-2xl border-border/50 bg-card/95 shadow-sm">
                            <CardContent className="p-4 sm:p-5">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <Skeleton className="h-12 w-12 rounded-xl" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-32" />
                                            <Skeleton className="h-3 w-20" />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="hidden sm:block text-right space-y-2">
                                            <Skeleton className="h-3 w-16 ml-auto" />
                                            <Skeleton className="h-5 w-24 ml-auto" />
                                        </div>
                                        <Skeleton className="h-10 w-28 rounded-xl" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </main>
        );
    }

    if (orders.length === 0) {
        return (
            <main className="mx-auto min-h-[70vh] max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center justify-center space-y-6 rounded-3xl border border-dashed border-emerald-200 bg-emerald-50/20 p-12 text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                        <ShoppingBag className="h-10 w-10" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-emerald-900">No orders yet</h2>
                        <p className="text-muted-foreground mt-2">Start your journey to better health by browsing our shop.</p>
                    </div>
                    <Button asChild className="bg-emerald-600 hover:bg-emerald-700 h-11 px-8 rounded-xl">
                        <Link href="/shop">Go to Shop</Link>
                    </Button>
                </div>
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <header className="mb-10">
                <h1 className="text-3xl font-black text-emerald-800 tracking-tight">Order History</h1>
                <p className="text-muted-foreground mt-1">Track and manage your recent prescriptions and purchases.</p>
            </header>

            <div className="space-y-4">
                {orders.map((order) => {
                    const status = statusConfig[order.status];
                    const StatusIcon = status.icon;
                    const itemsCount = order.items.reduce((acc, item) => acc + item.quantity, 0);

                    return (
                        <Card key={order.id} className="py-1 overflow-hidden rounded-2xl border-border/50 bg-card/95 shadow-sm transition-all hover:shadow-md hover:border-emerald-200">
                            <CardContent className="p-4 sm:p-5">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    {/* Left: Item Summary */}
                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-100/50 p-2">
                                            {order.items[0]?.medicine?.image ? (
                                                <SafeImage
                                                    src={order.items[0].medicine.image}
                                                    alt={order.items[0].medicine.name || 'img'}
                                                    width={48}
                                                    height={48}
                                                    className="h-full w-full object-cover rounded-lg"
                                                />
                                            ) : (
                                                <Package className="h-6 w-6 text-emerald-300" />
                                            )}
                                            {order.items.length > 1 && (
                                                <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-emerald-600 text-[10px] font-black text-white shadow-sm">
                                                    +{order.items.length - 1}
                                                </span>
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-wider ${status.color}`}>
                                                    <StatusIcon className="h-3 w-3" />
                                                    {order.status}
                                                </span>
                                                <span className="text-[10px] font-bold text-muted-foreground/60">•</span>
                                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                                    {new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                                                </span>
                                                <span className="text-[10px] font-bold text-muted-foreground/60">•</span>
                                                <PaymentStatusBadge
                                                    status={order.paymentStatus}
                                                    className="px-2 py-0.5 text-[9px]"
                                                    iconSize={10}
                                                />
                                            </div>
                                            <h3 className="text-sm font-black text-foreground uppercase truncate tracking-tight">
                                                {order.items.map(i => i.medicine?.name).join(", ")}
                                            </h3>
                                            <p className="text-xs font-medium text-muted-foreground truncate opacity-70">
                                                Order ID: <span className="font-mono">{order.id.slice(0, 10).toUpperCase()}</span>
                                            </p>
                                        </div>
                                    </div>

                                    {/* Right: Actions & Price */}
                                    <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-4 sm:pt-0">
                                        <div className="sm:text-right">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-0.5">Total Amount</p>
                                            <p className="text-xl font-black text-emerald-800 leading-none">${order.totalAmount.toFixed(2)}</p>
                                        </div>
                                        <Button asChild variant="outline" size="sm" className="h-10 rounded-xl border-emerald-100 text-emerald-700 hover:bg-emerald-50 font-bold px-5">
                                            <Link href={`/orders/${order.id}`}>View Details</Link>
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {meta && meta.totalPages > 1 && (
                <div className="mt-10 flex items-center justify-end gap-4 border-t border-border/40 pt-8">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={page === 1}
                        onClick={() => {
                            setPage(prev => Math.max(1, prev - 1));
                            window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="rounded-xl border-emerald-100 text-emerald-700 hover:bg-emerald-50 disabled:opacity-30"
                    >
                        Previous
                    </Button>
                    <div className="flex items-center gap-2">
                        {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((p) => (
                            <button
                                key={p}
                                onClick={() => {
                                    setPage(p);
                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                }}
                                className={`flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold transition-all ${page === p
                                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200"
                                    : "text-muted-foreground hover:bg-emerald-50 hover:text-emerald-700"
                                    }`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={page === meta?.totalPages}
                        onClick={() => {
                            setPage(prev => Math.min(meta?.totalPages || 0, prev + 1));
                            window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="rounded-xl border-emerald-100 text-emerald-700 hover:bg-emerald-50 disabled:opacity-30"
                    >
                        Next
                    </Button>
                </div>
            )}
        </main>
    );
}
