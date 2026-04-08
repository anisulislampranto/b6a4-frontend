"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface OptionItem {
    id: string;
    name: string;
}

interface FormState {
    name: string;
    description: string;
    price: string;
    stock: string;
    image: string;
    categoryId: string;
    brandId: string;
}

const initialForm: FormState = {
    name: "",
    description: "",
    price: "",
    stock: "",
    image: "",
    categoryId: "",
    brandId: "",
};

export default function AddMedicineClient() {
    const { data: session, isPending: sessionPending } = authClient.useSession();
    const [form, setForm] = useState<FormState>(initialForm);
    const [categories, setCategories] = useState<OptionItem[]>([]);
    const [brands, setBrands] = useState<OptionItem[]>([]);
    const [loadingOptions, setLoadingOptions] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        const loadOptions = async () => {
            setLoadingOptions(true);
            setError(null);
            try {
                const [categoryRes, brandRes] = await Promise.all([
                    fetch("http://localhost:5000/api/category", { cache: "no-store" }),
                    fetch("http://localhost:5000/api/brands", { cache: "no-store" }),
                ]);

                const [categoryJson, brandJson] = await Promise.all([
                    categoryRes.json(),
                    brandRes.json(),
                ]);

                if (cancelled) return;

                const categoryItems = (categoryJson?.data || []) as OptionItem[];
                const brandItems = (brandJson?.data || []) as OptionItem[];
                setCategories(categoryItems);
                setBrands(brandItems);
                setForm((prev) => ({
                    ...prev,
                    categoryId: prev.categoryId || categoryItems[0]?.id || "",
                    brandId: prev.brandId || brandItems[0]?.id || "",
                }));
            } catch {
                if (!cancelled) setError("Failed to load category/brand options.");
            } finally {
                if (!cancelled) setLoadingOptions(false);
            }
        };

        loadOptions();
        return () => {
            cancelled = true;
        };
    }, []);

    const role = session?.user?.role?.toUpperCase();
    const canManage = role === "SELLER" || role === "ADMIN";

    const updateField =
        (key: keyof FormState) =>
            (value: string) =>
                setForm((prev) => ({ ...prev, [key]: value }));

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!form.name || !form.price || !form.stock || !form.categoryId || !form.brandId) {
            setError("Please fill in all required fields.");
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch("http://localhost:5000/api/medicines", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    name: form.name,
                    description: form.description,
                    price: Number(form.price),
                    stock: Number(form.stock),
                    image: form.image,
                    categoryId: form.categoryId,
                    brandId: form.brandId,
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                setError(data?.message || "Failed to add medicine.");
                return;
            }

            setSuccess("Medicine added successfully!");
            setForm((prev) => ({
                ...initialForm,
                categoryId: prev.categoryId,
                brandId: prev.brandId,
            }));
        } catch {
            setError("Something went wrong while adding medicine.");
        } finally {
            setSubmitting(false);
        }
    };

    if (sessionPending) {
        return (
            <main className="mx-auto min-h-[70vh] max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700">
                    Loading...
                </div>
            </main>
        );
    }

    if (!session?.user) {
        return (
            <main className="mx-auto min-h-[70vh] max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">
                    Please sign in first.
                </div>
            </main>
        );
    }

    if (!canManage) {
        return (
            <main className="mx-auto min-h-[70vh] max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">
                    You do not have permission to add medicines.
                </div>
            </main>
        );
    }

    return (
        <main className="mx-auto min-h-[70vh] max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
            <Card className="rounded-3xl border-border/70 bg-card/90">
                <CardContent className="p-6 sm:p-8">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-emerald-700">Add Medicine</h1>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Fill in medicine details and publish it to your inventory.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5 sm:col-span-2">
                            <Label>Name *</Label>
                            <Input value={form.name} onChange={(e) => updateField("name")(e.target.value)} placeholder="Enter medicine name" />
                        </div>

                        <div className="space-y-1.5 sm:col-span-2">
                            <Label>Description</Label>
                            <textarea
                                value={form.description}
                                onChange={(e) => updateField("description")(e.target.value)}
                                className="min-h-28 w-full rounded-xl border border-border bg-card px-3.5 py-2 text-sm outline-none transition focus-visible:ring-4 focus-visible:ring-ring/30"
                                placeholder="Write medicine details"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label>Price *</Label>
                            <Input type="number" min="0" value={form.price} onChange={(e) => updateField("price")(e.target.value)} placeholder="0.00" />
                        </div>

                        <div className="space-y-1.5">
                            <Label>Stock *</Label>
                            <Input type="number" min="0" value={form.stock} onChange={(e) => updateField("stock")(e.target.value)} placeholder="0" />
                        </div>

                        <div className="space-y-1.5">
                            <Label>Category *</Label>
                            <select
                                value={form.categoryId}
                                disabled={loadingOptions}
                                onChange={(e) => updateField("categoryId")(e.target.value)}
                                className="h-11 w-full rounded-xl border border-border bg-card px-3.5 text-sm outline-none transition focus-visible:ring-4 focus-visible:ring-ring/30"
                            >
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <Label>Brand *</Label>
                            <select
                                value={form.brandId}
                                disabled={loadingOptions}
                                onChange={(e) => updateField("brandId")(e.target.value)}
                                className="h-11 w-full rounded-xl border border-border bg-card px-3.5 text-sm outline-none transition focus-visible:ring-4 focus-visible:ring-ring/30"
                            >
                                {brands.map((brand) => (
                                    <option key={brand.id} value={brand.id}>
                                        {brand.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1.5 sm:col-span-2">
                            <Label>Image URL</Label>
                            <Input value={form.image} onChange={(e) => updateField("image")(e.target.value)} placeholder="https://example.com/medicine-image.png" />
                        </div>

                        {error && <p className="sm:col-span-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
                        {success && <p className="sm:col-span-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{success}</p>}

                        <div className="sm:col-span-2">
                            <Button type="submit" className="h-11 w-full bg-emerald-600 hover:bg-emerald-700" disabled={submitting || loadingOptions}>
                                {submitting ? "Adding..." : "Add Medicine"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </main>
    );
}
