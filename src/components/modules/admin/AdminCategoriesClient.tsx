"use client";

import { FormEvent, useEffect, useState } from "react";
import { adminService } from "@/services/admin.service";
import type { Category } from "@/types/category.type";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function AdminCategoriesClient() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [creating, setCreating] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const loadCategories = async (cancelled = false) => {
        setLoading(true);
        setError(null);
        try {
            const { ok, data } = await adminService.getCategories();
            if (!ok) {
                if (!cancelled) setError(data?.message || "Failed to load categories.");
                return;
            }

            if (!cancelled) {
                setCategories((data?.data || []) as Category[]);
            }
        } catch {
            if (!cancelled) setError("Something went wrong while loading categories.");
        } finally {
            if (!cancelled) setLoading(false);
        }
    };

    useEffect(() => {
        let cancelled = false;
        loadCategories(cancelled);
        return () => {
            cancelled = true;
        };
    }, []);

    const onCreate = async (e: FormEvent) => {
        e.preventDefault();

        const normalizedName = name.trim();
        if (!normalizedName) {
            setError("Category name is required.");
            return;
        }

        setCreating(true);
        setError(null);
        try {
            const { ok, data } = await adminService.createCategory(normalizedName, description.trim() || undefined);
            if (!ok) {
                setError(data?.message || "Failed to create category.");
                return;
            }

            setName("");
            setDescription("");
            toast.success("Category created successfully.");
            await loadCategories();
        } catch {
            setError("Something went wrong while creating category.");
        } finally {
            setCreating(false);
        }
    };

    const onDisable = async (id: string) => {
        setDeletingId(id);
        setError(null);
        try {
            const { ok, data } = await adminService.deleteCategory(id);
            if (!ok) {
                setError(data?.message || "Failed to disable category.");
                return;
            }

            setCategories((prev) => prev.filter((item) => item.id !== id));
            toast.success("Category disabled successfully.");
        } catch {
            setError("Something went wrong while disabling category.");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <main className="mx-auto min-h-[70vh] max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <section className="mb-7 rounded-3xl border border-border/70 bg-card/85 px-6 py-7 sm:px-8">
                <h1 className="text-3xl font-bold text-emerald-700 sm:text-4xl">Admin Categories</h1>
                <p className="mt-2 text-sm text-muted-foreground">Create and maintain medicine categories.</p>
            </section>

            <Card className="mb-6 rounded-2xl border-border/70 bg-card/95">
                <CardContent className="p-6">
                    <form onSubmit={onCreate} className="grid gap-3 md:grid-cols-[1fr_1fr_auto] md:items-end">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Category Name
                            </label>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Pain Relief"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Description (Optional)
                            </label>
                            <Input
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Short description"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="bg-emerald-600 hover:bg-emerald-700"
                            disabled={creating}
                        >
                            {creating ? "Creating..." : "Create Category"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {loading && (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700">
                    Loading categories...
                </div>
            )}

            {error && (
                <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">
                    {error}
                </div>
            )}

            {!loading && categories.length === 0 && !error && (
                <Card className="rounded-2xl border-border/70 bg-card/95">
                    <CardContent className="p-6 text-center text-muted-foreground">No active categories found.</CardContent>
                </Card>
            )}

            {!loading && categories.length > 0 && (
                <section className="grid gap-4">
                    {categories.map((category) => (
                        <Card key={category.id} className="rounded-2xl border-border/70 bg-card/95">
                            <CardContent className="grid gap-3 p-6 md:grid-cols-[1fr_auto] md:items-center">
                                <div>
                                    <p className="text-base font-semibold text-foreground">{category.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {category.description || "No description provided."}
                                    </p>
                                </div>
                                <Button
                                    variant="outline"
                                    className="border-red-200 text-red-600 hover:bg-red-50"
                                    disabled={deletingId === category.id}
                                    onClick={() => onDisable(category.id)}
                                >
                                    {deletingId === category.id ? "Disabling..." : "Disable"}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </section>
            )}
        </main>
    );
}
