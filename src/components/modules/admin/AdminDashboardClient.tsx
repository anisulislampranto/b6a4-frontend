"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { adminService } from "@/services/admin.service";
import type { User } from "@/types/user.type";
import type { Order } from "@/types/order.type";
import type { Category } from "@/types/category.type";
import type { Brand } from "@/types/brand.type";

export default function AdminDashboardClient() {
    const [users, setUsers] = useState<User[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const [usersRes, ordersRes, categoriesRes, brandsRes] = await Promise.all([
                    adminService.getAllUsers(),
                    adminService.getAllOrders(),
                    adminService.getCategories(),
                    adminService.getBrands(),
                ]);

                if (cancelled) return;

                if (!usersRes.ok || !ordersRes.ok || !categoriesRes.ok || !brandsRes.ok) {
                    setError("Failed to load admin dashboard data.");
                    return;
                }

                setUsers((usersRes.data.data || []) as User[]);
                setOrders((ordersRes.data.data || []) as Order[]);
                setCategories((categoriesRes.data.data || []) as Category[]);
                setBrands((brandsRes.data.data || []) as Brand[]);
            } catch {
                if (!cancelled) {
                    setError("Something went wrong while loading dashboard data.");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        load();

        return () => {
            cancelled = true;
        };
    }, []);

    const stats = useMemo(() => {
        const sellerCount = users.filter((user) => user.role === "SELLER").length;
        const customerCount = users.filter((user) => user.role === "CUSTOMER").length;
        const pendingOrders = orders.filter((order) => order.status === "PENDING").length;
        return {
            totalUsers: users.length,
            sellerCount,
            customerCount,
            totalOrders: orders.length,
            pendingOrders,
            totalCategories: categories.length,
            totalBrands: brands.length,
        };
    }, [users, orders, categories, brands]);

    return (
        <main className="mx-auto min-h-[70vh] max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <section className="mb-7 rounded-3xl border border-border/70 bg-card/85 px-6 py-7 shadow-[0_24px_40px_-36px_rgba(15,23,42,0.8)] sm:px-8">
                <h1 className="text-3xl font-bold text-emerald-700 sm:text-4xl">Admin Dashboard</h1>
                <p className="mt-2 max-w-3xl text-muted-foreground">
                    View high-level platform insights and manage users, orders, and categories.
                </p>
            </section>

            {loading && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700">
                    Loading admin dashboard...
                </div>
            )}

            {error && (
                <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">
                    {error}
                </div>
            )}

            {!loading && !error && (
                <>
                    <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <Card className="rounded-2xl border-border/70 bg-card/95">
                            <CardContent className="space-y-1 p-6">
                                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Users</p>
                                <p className="text-3xl font-bold text-emerald-700">{stats.totalUsers}</p>
                                <p className="text-sm text-muted-foreground">Customers: {stats.customerCount} | Sellers: {stats.sellerCount}</p>
                            </CardContent>
                        </Card>
                        <Card className="rounded-2xl border-border/70 bg-card/95">
                            <CardContent className="space-y-1 p-6">
                                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Orders</p>
                                <p className="text-3xl font-bold text-emerald-700">{stats.totalOrders}</p>
                                <p className="text-sm text-muted-foreground">Pending: {stats.pendingOrders}</p>
                            </CardContent>
                        </Card>
                        <Card className="rounded-2xl border-border/70 bg-card/95">
                            <CardContent className="space-y-1 p-6">
                                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Categories</p>
                                <p className="text-3xl font-bold text-emerald-700">{stats.totalCategories}</p>
                                <p className="text-sm text-muted-foreground">Active medicine categories</p>
                            </CardContent>
                        </Card>
                        <Card className="rounded-2xl border-border/70 bg-card/95">
                            <CardContent className="space-y-1 p-6">
                                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Brands</p>
                                <p className="text-3xl font-bold text-emerald-700">{stats.totalBrands}</p>
                                <p className="text-sm text-muted-foreground">Active medicine brands</p>
                            </CardContent>
                        </Card>
                    </section>

                    <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        <Card className="rounded-2xl border-border/70 bg-card/95">
                            <CardContent className="space-y-4 p-6">
                                <h2 className="text-xl font-semibold text-foreground">Manage Users</h2>
                                <p className="text-sm text-muted-foreground">Review all platform users and update user roles.</p>
                                <Button asChild variant="outline" className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                                    <Link href="/admin/users">Open Users</Link>
                                </Button>
                            </CardContent>
                        </Card>
                        <Card className="rounded-2xl border-border/70 bg-card/95">
                            <CardContent className="space-y-4 p-6">
                                <h2 className="text-xl font-semibold text-foreground">Manage Orders</h2>
                                <p className="text-sm text-muted-foreground">View all orders and update platform-level order status.</p>
                                <Button asChild variant="outline" className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                                    <Link href="/admin/orders">Open Orders</Link>
                                </Button>
                            </CardContent>
                        </Card>
                        <Card className="rounded-2xl border-border/70 bg-card/95">
                            <CardContent className="space-y-4 p-6">
                                <h2 className="text-xl font-semibold text-foreground">Manage Categories</h2>
                                <p className="text-sm text-muted-foreground">Create new categories and disable existing categories.</p>
                                <Button asChild variant="outline" className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                                    <Link href="/admin/categories">Open Categories</Link>
                                </Button>
                            </CardContent>
                        </Card>
                        <Card className="rounded-2xl border-border/70 bg-card/95">
                            <CardContent className="space-y-4 p-6">
                                <h2 className="text-xl font-semibold text-foreground">Manage Brands</h2>
                                <p className="text-sm text-muted-foreground">Create new brands and disable existing brands.</p>
                                <Button asChild variant="outline" className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                                    <Link href="/admin/brands">Open Brands</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </section>
                </>
            )}
        </main>
    );
}
