"use client";

import { FormEvent, useEffect, useState } from "react";
import { adminService } from "@/services/admin.service";
import type { Brand } from "@/types/brand.type";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function AdminBrandsClient() {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [creating, setCreating] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [logo, setLogo] = useState("");

    const loadBrands = async (cancelled = false) => {
        setLoading(true);
        setError(null);
        try {
            const { ok, data } = await adminService.getBrands();
            if (!ok) {
                if (!cancelled) setError(data?.message || "Failed to load brands.");
                return;
            }

            if (!cancelled) {
                setBrands((data?.data || []) as Brand[]);
            }
        } catch {
            if (!cancelled) setError("Something went wrong while loading brands.");
        } finally {
            if (!cancelled) setLoading(false);
        }
    };

    useEffect(() => {
        let cancelled = false;
        loadBrands(cancelled);
        return () => {
            cancelled = true;
        };
    }, []);

    const onCreate = async (e: FormEvent) => {
        e.preventDefault();

        const normalizedName = name.trim();
        if (!normalizedName) {
            setError("Brand name is required.");
            return;
        }

        setCreating(true);
        setError(null);
        try {
            const { ok, data } = await adminService.createBrand(
                normalizedName,
                description.trim() || undefined,
                logo.trim() || undefined
            );
            if (!ok) {
                setError(data?.message || "Failed to create brand.");
                return;
            }

            setName("");
            setDescription("");
            setLogo("");
            toast.success("Brand created successfully.");
            await loadBrands();
        } catch {
            setError("Something went wrong while creating brand.");
        } finally {
            setCreating(false);
        }
    };

    const onDisable = async (id: string) => {
        setDeletingId(id);
        setError(null);
        try {
            const { ok, data } = await adminService.deleteBrand(id);
            if (!ok) {
                setError(data?.message || "Failed to disable brand.");
                return;
            }

            setBrands((prev) => prev.filter((item) => item.id !== id));
            toast.success("Brand disabled successfully.");
        } catch {
            setError("Something went wrong while disabling brand.");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <main className="mx-auto min-h-[70vh] max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <section className="mb-7 rounded-3xl border border-border/70 bg-card/85 px-6 py-7 sm:px-8">
                <h1 className="text-3xl font-bold text-emerald-700 sm:text-4xl">Admin Brands</h1>
                <p className="mt-2 text-sm text-muted-foreground">Create and maintain medicine brands.</p>
            </section>

            <Card className="mb-6 rounded-2xl border-border/70 bg-card/95">
                <CardContent className="p-6">
                    <form onSubmit={onCreate} className="grid gap-3 md:grid-cols-[1fr_1fr_1fr_auto] md:items-end">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Brand Name
                            </label>
                            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Square Pharma" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Description (Optional)
                            </label>
                            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Logo URL (Optional)
                            </label>
                            <Input value={logo} onChange={(e) => setLogo(e.target.value)} placeholder="https://example.com/logo.png" />
                        </div>
                        <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={creating}>
                            {creating ? "Creating..." : "Create Brand"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {loading && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700">
                    Loading brands...
                </div>
            )}

            {error && (
                <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">
                    {error}
                </div>
            )}

            {!loading && brands.length === 0 && !error && (
                <Card className="rounded-2xl border-border/70 bg-card/95">
                    <CardContent className="p-6 text-center text-muted-foreground">No active brands found.</CardContent>
                </Card>
            )}

            {!loading && brands.length > 0 && (
                <section className="grid gap-4">
                    {brands.map((brand) => (
                        <Card key={brand.id} className="rounded-2xl border-border/70 bg-card/95">
                            <CardContent className="grid gap-3 p-6 md:grid-cols-[1fr_auto] md:items-center">
                                <div>
                                    <p className="text-base font-semibold text-foreground">{brand.name}</p>
                                    <p className="text-sm text-muted-foreground">{brand.description || "No description provided."}</p>
                                </div>
                                <Button
                                    variant="outline"
                                    className="border-red-200 text-red-600 hover:bg-red-50"
                                    disabled={deletingId === brand.id}
                                    onClick={() => onDisable(brand.id)}
                                >
                                    {deletingId === brand.id ? "Disabling..." : "Disable"}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </section>
            )}
        </main>
    );
}
