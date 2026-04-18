"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { orderService } from "@/services/order.service";
import type { Order, OrderStatus } from "@/types/order.type";
import { Card, CardContent } from "@/components/ui/card";
import { Package, Clock, Truck, CheckCircle2, XCircle, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const statusConfig: Record<OrderStatus, { icon: typeof Clock; color: string; bg: string; border: string }> = {
    PENDING: { icon: Clock, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
    CONFIRMED: { icon: Package, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
    SHIPPED: { icon: Truck, color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100" },
    DELIVERED: { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
    CANCELLED: { icon: XCircle, color: "text-red-600", bg: "bg-red-50", border: "border-red-100" },
};

export default function OrdersClient() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const { ok, data } = await orderService.getMyOrders();
                if (ok) {
                    setOrders(data?.data || []);
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
    }, []);

    if (loading) {
        return (
            <main className="mx-auto max-w-7xl px-4 py-20 text-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600/30 border-t-emerald-600" />
                    <p className="text-muted-foreground font-medium">Loading your orders...</p>
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

            <div className="space-y-6">
                {orders.map((order) => {
                    const status = statusConfig[order.status];
                    const StatusIcon = status.icon;

                    return (
                        <Card key={order.id} className="overflow-hidden rounded-3xl border-border/60 bg-card/95 shadow-sm transition-all hover:shadow-md hover:border-emerald-100">
                            <CardContent className="p-0">
                                {/* Order Header */}
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-emerald-50/30 border-b border-border/50">
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Order ID</p>
                                        <p className="font-mono text-sm font-bold text-foreground">{order.id.slice(0, 13).toUpperCase()}...</p>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${status.bg} ${status.color} ${status.border} border`}>
                                            <StatusIcon className="h-4 w-4" />
                                            <span className="text-xs font-black uppercase tracking-wider">{order.status}</span>
                                        </div>
                                        <div className="px-3 py-1.5 rounded-full bg-white border border-border/60 text-xs font-bold text-muted-foreground">
                                            {new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                                        </div>
                                    </div>
                                </div>

                                {/* Order Content */}
                                <div className="p-6">
                                    <div className="grid gap-6 md:grid-cols-12">
                                        <div className="md:col-span-8 space-y-4">
                                            {order.items.map((item) => (
                                                <div key={item.id} className="flex items-center gap-4 group">
                                                    <div className="h-14 w-14 shrink-0 rounded-xl bg-emerald-50/50 border border-emerald-100/50 flex items-center justify-center p-1">
                                                        {item.medicine?.image ? (
                                                            <Image
                                                                src={item.medicine.image}
                                                                alt={item.medicine.name}
                                                                width={56}
                                                                height={56}
                                                                className="h-full w-full object-cover rounded-lg"
                                                            />
                                                        ) : (
                                                            <Package className="h-6 w-6 text-emerald-200" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-bold text-foreground group-hover:text-emerald-700 transition-colors uppercase truncate">
                                                            {item.medicine?.name}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground font-medium">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="md:col-span-4 rounded-2xl bg-slate-50/50 p-5 space-y-4 border border-slate-100">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Amount</p>
                                                <p className="text-2xl font-black text-emerald-800">${order.totalAmount.toFixed(2)}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Shipping Address</p>
                                                <p className="text-[13px] leading-relaxed font-medium text-slate-600 italic">
                                                    &quot;{order.address}&quot;
                                                </p>
                                            </div>
                                            <Button asChild variant="outline" className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                                                <Link href={`/orders/${order.id}`}>View Details</Link>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </main>
    );
}
