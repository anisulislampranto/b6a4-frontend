"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { inventoryService, OptionItem } from "@/services/inventory.service";
import { useRouter } from "next/navigation";

interface FormState {
    name: string;
    description: string;
    price: string;
    stock: string;
    image: string;
    categoryId: string;
    brandId: string;
}

const CREATE_NEW_OPTION = "__create_new__";

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
    const router = useRouter();
    const { data: session, isPending: sessionPending } = authClient.useSession();
    const [form, setForm] = useState<FormState>(initialForm);
    const [categories, setCategories] = useState<OptionItem[]>([]);
    const [brands, setBrands] = useState<OptionItem[]>([]);
    const [loadingOptions, setLoadingOptions] = useState(true);
    const [creatingCategory, setCreatingCategory] = useState(false);
    const [creatingBrand, setCreatingBrand] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [newBrandName, setNewBrandName] = useState("");
    const [categorySelectValue, setCategorySelectValue] = useState("");
    const [brandSelectValue, setBrandSelectValue] = useState("");
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
                    inventoryService.getCategories(),
                    inventoryService.getBrands(),
                ]);

                if (cancelled) return;

                const categoryItems = (categoryRes?.data || []) as OptionItem[];
                const brandItems = (brandRes?.data || []) as OptionItem[];
                setCategories(categoryItems);
                setBrands(brandItems);
                setForm((prev) => ({
                    ...prev,
                    categoryId: prev.categoryId || categoryItems[0]?.id || "",
                    brandId: prev.brandId || brandItems[0]?.id || "",
                }));
                setCategorySelectValue((prev) => prev || categoryItems[0]?.id || CREATE_NEW_OPTION);
                setBrandSelectValue((prev) => prev || brandItems[0]?.id || CREATE_NEW_OPTION);
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

    const handleCategoryChange = (value: string) => {
        setCategorySelectValue(value);
        if (value === CREATE_NEW_OPTION) return;
        updateField("categoryId")(value);
    };

    const handleBrandChange = (value: string) => {
        setBrandSelectValue(value);
        if (value === CREATE_NEW_OPTION) return;
        updateField("brandId")(value);
    };

    const createCategory = async () => {
        const trimmed = newCategoryName.trim();
        if (!trimmed) {
            setError("Please enter a category name.");
            return;
        }

        setCreatingCategory(true);
        setError(null);
        try {
            const { ok, data } = await inventoryService.createCategory(trimmed);
            if (!ok) {
                setError(data?.message || "Failed to create category.");
                return;
            }

            const created = data?.data as OptionItem;
            if (created?.id) {
                setCategories((prev) => [created, ...prev]);
                updateField("categoryId")(created.id);
                setCategorySelectValue(created.id);
                setNewCategoryName("");
                setSuccess("Category created successfully!");
            }
        } catch {
            setError("Something went wrong while creating category.");
        } finally {
            setCreatingCategory(false);
        }
    };

    const createBrand = async () => {
        const trimmed = newBrandName.trim();
        if (!trimmed) {
            setError("Please enter a brand name.");
            return;
        }

        setCreatingBrand(true);
        setError(null);
        try {
            const { ok, data } = await inventoryService.createBrand(trimmed);
            if (!ok) {
                setError(data?.message || "Failed to create brand.");
                return;
            }

            const created = data?.data as OptionItem;
            if (created?.id) {
                setBrands((prev) => [created, ...prev]);
                updateField("brandId")(created.id);
                setBrandSelectValue(created.id);
                setNewBrandName("");
                setSuccess("Brand created successfully!");
            }
        } catch {
            setError("Something went wrong while creating brand.");
        } finally {
            setCreatingBrand(false);
        }
    };

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
            const { ok, data } = await inventoryService.createMedicine({
                name: form.name,
                description: form.description,
                price: Number(form.price),
                stock: Number(form.stock),
                image: form.image,
                categoryId: form.categoryId,
                brandId: form.brandId,
            });
            if (!ok) {
                setError(data?.message || "Failed to add medicine.");
                return;
            }

            setSuccess("Medicine added successfully!");
            setForm((prev) => ({
                ...initialForm,
                categoryId: prev.categoryId,
                brandId: prev.brandId,
            }));
            setTimeout(() => {
                router.push("/seller/inventory");
            }, 500);
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
                                value={categorySelectValue}
                                disabled={loadingOptions}
                                onChange={(e) => handleCategoryChange(e.target.value)}
                                className="h-11 w-full rounded-xl border border-border bg-card px-3.5 text-sm outline-none transition focus-visible:ring-4 focus-visible:ring-ring/30"
                            >
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                                <option value={CREATE_NEW_OPTION}>+ Create new category</option>
                            </select>
                            {categorySelectValue === CREATE_NEW_OPTION && (
                                <div className="mt-2 flex items-center gap-2">
                                    <Input
                                        value={newCategoryName}
                                        onChange={(e) => setNewCategoryName(e.target.value)}
                                        placeholder="New category name"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                                        disabled={creatingCategory}
                                        onClick={createCategory}
                                    >
                                        {creatingCategory ? "Adding..." : "Add"}
                                    </Button>
                                </div>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label>Brand *</Label>
                            <select
                                value={brandSelectValue}
                                disabled={loadingOptions}
                                onChange={(e) => handleBrandChange(e.target.value)}
                                className="h-11 w-full rounded-xl border border-border bg-card px-3.5 text-sm outline-none transition focus-visible:ring-4 focus-visible:ring-ring/30"
                            >
                                {brands.map((brand) => (
                                    <option key={brand.id} value={brand.id}>
                                        {brand.name}
                                    </option>
                                ))}
                                <option value={CREATE_NEW_OPTION}>+ Create new brand</option>
                            </select>
                            {brandSelectValue === CREATE_NEW_OPTION && (
                                <div className="mt-2 flex items-center gap-2">
                                    <Input
                                        value={newBrandName}
                                        onChange={(e) => setNewBrandName(e.target.value)}
                                        placeholder="New brand name"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                                        disabled={creatingBrand}
                                        onClick={createBrand}
                                    >
                                        {creatingBrand ? "Adding..." : "Add"}
                                    </Button>
                                </div>
                            )}
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
