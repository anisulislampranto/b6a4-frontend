"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { inventoryService } from "@/services/inventory.service";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
    Plus,
    Minus,
    Package2,
    CheckCircle2,
    X
} from "lucide-react";
import { SheetFooter, SheetClose } from "@/components/ui/sheet";
import type { MedicineWithRelations } from "@/types/medicine.type";

export default function SellerInventoryClient() {
    const { data: session, isPending: sessionPending } = authClient.useSession();
    const [items, setItems] = useState<MedicineWithRelations[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const role = session?.user?.role?.toUpperCase();
    const canManage = role === "SELLER" || role === "ADMIN";

    const loadInventory = async (cancelled = false) => {
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

    useEffect(() => {
        let cancelled = false;
        loadInventory(cancelled);
        return () => {
            cancelled = true;
        };
    }, [session?.user?.id, canManage]);

    const handleUpdateStock = async (id: string, newStock: number) => {
        setUpdatingId(id);
        try {
            const { ok, data } = await inventoryService.updateMedicine(id, { stock: newStock });
            if (ok) {
                toast.success("Stock updated successfully!");
                setItems(prev => prev.map(item => item.id === id ? { ...item, stock: newStock } : item));
            } else {
                toast.error(data?.message || "Failed to update stock");
            }
        } catch {
            toast.error("An error occurred while updating stock");
        } finally {
            setUpdatingId(null);
        }
    };

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
                                <div className="flex items-center justify-between">
                                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${item.isActive
                                        ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                                        : "border border-red-200 bg-red-50 text-red-600"
                                        }`}>
                                        {item.isActive ? "Active" : "Inactive"}
                                    </span>

                                    <Sheet>
                                        <SheetTrigger asChild>
                                            <Button variant="outline" size="sm" className="h-8 gap-1.5 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800">
                                                <Package2 className="h-3.5 w-3.5" />
                                                Manage Stock
                                            </Button>
                                        </SheetTrigger>
                                        <SheetContent className="flex flex-col border-l-emerald-100 sm:max-w-md">
                                            <SheetHeader className="space-y-3 pb-6 border-b">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                                                    <Package2 className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <SheetTitle className="text-2xl font-bold text-foreground">Manage Inventory</SheetTitle>
                                                    <SheetDescription className="text-emerald-700/70 font-medium">
                                                        Updating stock for <span className="text-emerald-900 font-bold underline decoration-emerald-300 underline-offset-4">{item.name}</span>
                                                    </SheetDescription>
                                                </div>
                                            </SheetHeader>

                                            <div className="flex-1 overflow-y-auto px-4 space-y-8">
                                                {/* Product Summary Card */}
                                                <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 space-y-3">
                                                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800/60">Product Summary</h4>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <p className="text-xs text-muted-foreground">Category</p>
                                                            <p className="text-sm font-semibold">{item.category?.name}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-muted-foreground">Price</p>
                                                            <p className="text-sm font-semibold text-emerald-700">${item.price}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-muted-foreground">Current Stock</p>
                                                            <p className="text-sm font-semibold">{item.stock} units</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-muted-foreground">Status</p>
                                                            <div className="flex items-center gap-1.5">
                                                                <div className={`h-2 w-2 rounded-full ${item.isActive ? "bg-emerald-500" : "bg-red-500"}`} />
                                                                <p className="text-sm font-semibold">{item.isActive ? "Active" : "Inactive"}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Stock Adjustment Section */}
                                                <div className="space-y-4">
                                                    <Label htmlFor={`stock-${item.id}`} className="text-base font-bold text-foreground">
                                                        Adjust Stock Quantity
                                                    </Label>
                                                    <div className="flex items-center gap-3">
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="h-12 w-12 rounded-xl border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                                                            onClick={(e) => {
                                                                const input = e.currentTarget.parentElement?.querySelector('input');
                                                                if (input) {
                                                                    const newVal = Math.max(0, parseInt(input.value || "0") - 1);
                                                                    input.value = newVal.toString();
                                                                }
                                                            }}
                                                        >
                                                            <Minus className="h-5 w-5" />
                                                        </Button>
                                                        <Input
                                                            id={`stock-${item.id}`}
                                                            type="number"
                                                            defaultValue={item.stock}
                                                            className="h-12 border-emerald-100 text-center text-lg font-bold focus-visible:ring-emerald-500/20"
                                                            min="0"
                                                        />
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="h-12 w-12 rounded-xl border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                                                            onClick={(e) => {
                                                                const input = e.currentTarget.parentElement?.querySelector('input');
                                                                if (input) {
                                                                    const newVal = parseInt(input.value || "0") + 1;
                                                                    input.value = newVal.toString();
                                                                }
                                                            }}
                                                        >
                                                            <Plus className="h-5 w-5" />
                                                        </Button>
                                                    </div>
                                                    <p className="text-[13px] leading-relaxed text-muted-foreground">
                                                        This value will be visible to customers immediately in the storefront. Use the stepper for small adjustments.
                                                    </p>
                                                </div>
                                            </div>

                                            <SheetFooter className="pt-6 border-t sm:flex-col gap-3">
                                                <Button
                                                    className="w-full h-12 gap-2 text-base font-bold bg-emerald-600 hover:bg-emerald-700 shadow-[0_10px_20px_-10px_rgba(5,150,105,0.4)]"
                                                    disabled={updatingId === item.id}
                                                    onClick={(e) => {
                                                        const container = e.currentTarget.closest('[role="dialog"]');
                                                        const input = container?.querySelector('input');
                                                        const stock = parseInt(input?.value || "0");
                                                        handleUpdateStock(item.id, stock);
                                                    }}
                                                >
                                                    {updatingId === item.id ? (
                                                        <>
                                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                                            Updating...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <CheckCircle2 className="h-5 w-5" />
                                                            Confirm Stock Update
                                                        </>
                                                    )}
                                                </Button>
                                                <SheetClose asChild>
                                                    <Button variant="ghost" className="w-full h-12 text-muted-foreground hover:text-foreground">
                                                        Cancel
                                                    </Button>
                                                </SheetClose>
                                            </SheetFooter>
                                        </SheetContent>
                                    </Sheet>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </section>
            )}
        </main>
    );
}
