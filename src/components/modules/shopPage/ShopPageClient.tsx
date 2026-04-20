"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import SafeImage from "@/components/ui/SafeImage";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { medicineService } from "@/services/medicine.service";
import { inventoryService } from "@/services/inventory.service";
import type { MedicineWithRelations } from "@/types/medicine.type";
import type { Category } from "@/types/category.type";
import type { Brand } from "@/types/brand.type";
import { useAppDispatch } from "@/redux/hooks";
import { addItem } from "@/redux/features/cart/cartSlice";
import { toast } from "sonner";

export default function ShopPageClient({
    initialMedicines,
    initialCategories,
    initialBrands,
}: {
    initialMedicines: MedicineWithRelations[];
    initialCategories: Category[];
    initialBrands: Brand[];
}) {
    const initialMedicinesRef = useRef(initialMedicines);
    const [medicines, setMedicines] = useState(initialMedicines);
    const [categories, setCategories] = useState(initialCategories);
    const [brands, setBrands] = useState(initialBrands);

    const dispatch = useAppDispatch();
    const [filters, setFilters] = useState({
        search: "",
        category: "",
        brand: "",
        minPrice: "",
        maxPrice: "",
    });
    const [searchInput, setSearchInput] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load categories and brands once on mount
    useEffect(() => {
        const loadOptions = async () => {
            try {
                const [catRes, brandRes] = await Promise.all([
                    inventoryService.getCategories(),
                    inventoryService.getBrands(),
                ]);
                setCategories(catRes?.data || []);
                setBrands(brandRes?.data || []);
            } catch {
                // silently fail — filters will just be empty
            }
        };
        loadOptions();
    }, []);

    const activeFilters = useMemo(
        () =>
            Object.fromEntries(
                Object.entries(filters).filter(([, v]) => v && v.toString().trim() !== "")
            ),
        [filters]
    );

    // Debounce search so we don't fetch on every keystroke.
    useEffect(() => {
        const handle = setTimeout(() => {
            setFilters((prev) => ({ ...prev, search: searchInput }));
        }, 400);

        return () => clearTimeout(handle);
    }, [searchInput]);

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            // On first load (no filters), we already have SSR medicines.
            if (Object.keys(activeFilters).length === 0) {
                setError(null);
                setLoading(false);
                setMedicines(initialMedicinesRef.current);
                return;
            }

            setLoading(true);
            setError(null);
            try {
                const response = await medicineService.getMedicines(activeFilters);

                if (!cancelled) {
                    setMedicines(response?.data?.items);
                }
            } catch {
                if (!cancelled) {
                    setError("Failed to load medicines. Please try again.");
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
    }, [activeFilters]);

    const updateFilter = (key: keyof typeof filters) => (value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const resetFilters = () => {
        setFilters({
            search: "",
            category: "",
            brand: "",
            minPrice: "",
            maxPrice: "",
        });
        setSearchInput("");
        setMedicines(initialMedicinesRef.current);
        setError(null);
    };

    return (
        <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8 rounded-3xl border border-border/70 bg-card/80 p-5 shadow-[0_22px_44px_-38px_rgba(15,23,42,0.75)] sm:p-7">
                    <div className="mb-6 flex flex-col gap-2">
                        <h1 className="text-3xl font-bold text-emerald-700 sm:text-4xl">Shop Medicines</h1>
                    </div>
                    <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                        {/* Search */}
	                        <div className="space-y-1.5">
	                            <Label className="text-sm font-semibold text-foreground/90">Search</Label>
	                            <Input
	                                placeholder="Search medicines..."
	                                value={searchInput}
	                                onChange={(e) => setSearchInput(e.target.value)}
	                            />
	                        </div>

                        {/* Category dropdown */}
                        <div className="space-y-1.5">
                            <Label className="text-sm font-semibold text-foreground/90">Category</Label>
                            <select
                                value={filters.category}
                                onChange={(e) => updateFilter("category")(e.target.value)}
                                className="h-10 w-full rounded-xl border border-border bg-card px-3.5 text-sm outline-none transition focus-visible:ring-4 focus-visible:ring-ring/30"
                            >
                                <option value="">All Categories</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Brand dropdown */}
                        <div className="space-y-1.5">
                            <Label className="text-sm font-semibold text-foreground/90">Brand</Label>
                            <select
                                value={filters.brand}
                                onChange={(e) => updateFilter("brand")(e.target.value)}
                                className="h-10 w-full rounded-xl border border-border bg-card px-3.5 text-sm outline-none transition focus-visible:ring-4 focus-visible:ring-ring/30"
                            >
                                <option value="">All Brands</option>
                                {brands.map((b) => (
                                    <option key={b.id} value={b.id}>
                                        {b.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Min Price */}
                        <div className="space-y-1.5">
                            <Label className="text-sm font-semibold text-foreground/90">Min Price</Label>
                            <Input
                                type="number"
                                min="0"
                                placeholder="Min Price"
                                value={filters.minPrice}
                                onChange={(e) => updateFilter("minPrice")(e.target.value)}
                            />
                        </div>

                        {/* Max Price */}
                        <div className="space-y-1.5">
                            <Label className="text-sm font-semibold text-foreground/90">Max Price</Label>
                            <Input
                                type="number"
                                min="0"
                                placeholder="Max Price"
                                value={filters.maxPrice}
                                onChange={(e) => updateFilter("maxPrice")(e.target.value)}
                            />
                        </div>

                        <Button className="h-10 w-full bg-emerald-600 hover:bg-emerald-700" onClick={resetFilters}>
                            Reset Filters
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {medicines?.map((p) => (
                        <Card key={p.id} className="py-2 group overflow-hidden rounded-2xl border-border/70 bg-card/95 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_30px_-24px_rgba(15,23,42,0.9)]">
                            <CardContent className="flex flex-col gap-4 p-5">
                                <Link
                                    href={`/shop/${p.id}`}
                                    className="relative flex h-36 items-center justify-center rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-100 to-emerald-50 text-sm font-bold tracking-wide text-emerald-600 outline-none transition hover:opacity-95 focus-visible:ring-4 focus-visible:ring-ring/30 overflow-hidden"
                                >
                                    {p.image ? (
                                        <SafeImage
                                            src={p.image}
                                            alt={p.name}
                                            fill
                                            className="rounded-2xl object-cover p-2"
                                        />
                                    ) : (
                                        "IMG"
                                    )}
                                </Link>
                                <Link href={`/shop/${p.id}`} className="text-base font-semibold text-foreground outline-none transition hover:text-emerald-700 focus-visible:ring-4 focus-visible:ring-ring/30">
                                    {p.name}
                                </Link>
                                <span className="w-fit rounded-full border border-emerald-200 bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
                                    {p.category.name}
                                </span>
                                <span className="text-xs font-medium text-muted-foreground">
                                    Brand: <span className="text-foreground">{p.brand.name}</span>
                                </span>
                                <p className="text-xl font-bold text-emerald-700">${p.price}</p>
                                <Button
                                    className="bg-emerald-600 hover:bg-emerald-700"
                                    onClick={() => {
                                        dispatch(addItem(p));
                                        toast.success(`${p.name} added to cart!`);
                                    }}
                                >
                                    Add to Cart
                                </Button>
                                <Button asChild variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                                    <Link href={`/shop/${p.id}`}>View Details</Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                    {loading && (
                        <div className="col-span-full grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                <Card key={i} className="overflow-hidden rounded-2xl border-border/70 bg-card/95">
                                    <CardContent className="flex flex-col gap-4 p-5">
                                        <Skeleton className="h-36 w-full rounded-2xl" />
                                        <Skeleton className="h-6 w-3/4 rounded-lg" />
                                        <Skeleton className="h-4 w-1/4 rounded-full" />
                                        <Skeleton className="h-3 w-1/2 rounded-md" />
                                        <Skeleton className="h-10 w-full rounded-lg" />
                                        <Skeleton className="h-10 w-full rounded-lg" />
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                    {error && <span className="col-span-full rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-600">{error}</span>}
                    {!loading && medicines.length === 0 && !error && (
                        <div className="col-span-full rounded-2xl border border-border/70 bg-card px-4 py-6 text-center font-medium text-emerald-700">
                            No medicines found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
