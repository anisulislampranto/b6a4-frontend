"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { inventoryService } from "@/services/inventory.service";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { MedicineWithRelations } from "@/types/medicine.type";

export default function SellerInventoryClient() {
    const { data: session, isPending: sessionPending } = authClient.useSession();
    const [items, setItems] = useState<MedicineWithRelations[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const role = session?.user?.role?.toUpperCase();
    const canManage = role === "SELLER" || role === "ADMIN";

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            if (!session?.user || !canManage) {
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);
            try {
                const { ok, data } = await inventoryService.getMyMedicines();
                if (!ok) {
                    if (!cancelled) setError(data?.message || "Failed to load medicines.");
                    return;
                }

                if (!cancelled) {
                    setItems((data?.data || []) as MedicineWithRelations[]);
                }
            } catch {
                if (!cancelled) setError("Something went wrong while loading inventory.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        load();
        return () => {
            cancelled = true;
        };
    }, [session?.user, canManage]);

    if (sessionPending) {
        return (
            <main className="mx-auto min-h-[70vh] max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700">
                    Loading...
                </div>
            </main>
        );
    }

    if (!session?.user) {
        return (
            <main className="mx-auto min-h-[70vh] max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">
                    Please sign in first.
                </div>
            </main>
        );
    }

    if (!canManage) {
        return (
            <main className="mx-auto min-h-[70vh] max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">
                    You do not have permission to view inventory.
                </div>
            </main>
        );
    }

    return (
        <main className="mx-auto min-h-[70vh] max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <section className="mb-7 flex flex-col gap-4 rounded-3xl border border-border/70 bg-card/85 px-6 py-7 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-emerald-700">Inventory</h1>
                    <p className="mt-2 text-sm text-muted-foreground">Manage all your medicine listings in one place.</p>
                </div>
                <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                    <Link href="/seller/medicines">Add Medicine</Link>
                </Button>
            </section>

            {loading && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700">
                    Loading inventory...
                </div>
            )}

            {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">
                    {error}
                </div>
            )}

            {!loading && !error && items.length === 0 && (
                <Card className="rounded-2xl border-border/70 bg-card/95">
                    <CardContent className="space-y-4 p-6 text-center">
                        <p className="text-muted-foreground">No medicines found in your inventory yet.</p>
                        <Button asChild variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                            <Link href="/seller/medicines">Add Your First Medicine</Link>
                        </Button>
                    </CardContent>
                </Card>
            )}

            {!loading && !error && items.length > 0 && (
                <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {items.map((item) => (
                        <Card key={item.id} className="rounded-2xl border-border/70 bg-card/95">
                            <CardContent className="space-y-3 p-6">
                                <h2 className="text-xl font-semibold text-foreground">{item.name}</h2>
                                <p className="text-sm text-muted-foreground">
                                    Category: <span className="font-medium text-foreground">{item.category?.name}</span>
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Brand: <span className="font-medium text-foreground">{item.brand?.name}</span>
                                </p>
                                <div className="flex items-center justify-between">
                                    <p className="text-lg font-bold text-emerald-700">${item.price}</p>
                                    <p className="text-sm font-medium text-muted-foreground">Stock: {item.stock}</p>
                                </div>
                                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${item.isActive
                                    ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                                    : "border border-red-200 bg-red-50 text-red-600"
                                    }`}>
                                    {item.isActive ? "Active" : "Inactive"}
                                </span>
                            </CardContent>
                        </Card>
                    ))}
                </section>
            )}
        </main>
    );
}
