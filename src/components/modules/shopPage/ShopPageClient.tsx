"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/ui/FormInput";
import { Badge } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getMedicinesAction } from "./lib/actions";

type MedicineItem = {
    id?: string;
    name?: string;
    price?: number | string;
    category?: string;
    brand?: string;
    image?: string;
};

export default function ShopPageClient() {
    const [filters, setFilters] = useState({
        search: "",
        category: "",
        brand: "",
        minPrice: "",
        maxPrice: "",
    });
    const [medicines, setMedicines] = useState<MedicineItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const activeFilters = useMemo(
        () =>
            Object.fromEntries(
                Object.entries(filters).filter(([_, v]) => v && v.toString().trim() !== "")
            ),
        [filters]
    );

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await getMedicinesAction(activeFilters);

                if (!cancelled) {
                    setMedicines(response?.data?.items);
                }
            } catch (err) {
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

    const makeField = (key: keyof typeof filters) => ({
        state: { value: filters[key], meta: { errors: [] as string[] } },
        handleChange: updateFilter(key),
        handleBlur: () => undefined,
    });

    const filterFields: Array<{
        key: keyof typeof filters;
        label: string;
        placeholder: string;
        type?: string;
    }> = [
            { key: "search", label: "Search", placeholder: "Search medicines..." },
            { key: "category", label: "Category", placeholder: "Category" },
            { key: "brand", label: "Brand", placeholder: "Brand" },
            { key: "minPrice", label: "Min Price", placeholder: "Min Price", type: "number" },
            { key: "maxPrice", label: "Max Price", placeholder: "Max Price", type: "number" },
        ];

    const resetFilters = () => {
        setFilters({
            search: "",
            category: "",
            brand: "",
            minPrice: "",
            maxPrice: "",
        });
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-emerald-100 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col gap-4 mb-8">
                    <h1 className="text-3xl font-bold text-emerald-700">Shop Medicines</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 items-end">
                        {filterFields.map((field) => (
                            <FormInput
                                key={field.key}
                                label={field.label}
                                name={field.key}
                                placeholder={field.placeholder}
                                type={field.type}
                                field={makeField(field.key)}
                            />
                        ))}
                        <Button className="bg-emerald-600 hover:bg-emerald-700 w-full" onClick={resetFilters}>
                            Reset Filters
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {loading && <span className="text-sm col-span-full text-emerald-700 text-center">Loading...</span>}
                    {error && <span className="text-sm col-span-full  text-red-600 text-center">{error}</span>}
                    {!loading && medicines.length === 0 && !error && (
                        <div className="col-span-full text-center text-emerald-700 font-medium">
                            No medicines found.
                        </div>
                    )}
                    {medicines?.map((p, index) => (
                        <Card key={p.id ?? index} className="rounded-2xl shadow hover:shadow-lg transition">
                            <CardContent className="p-4 flex flex-col gap-3">
                                <div className="h-32 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 font-bold">
                                    IMG
                                </div>
                                <h3 className="font-semibold">{p.name ?? `Medicine ${index + 1}`}</h3>
                                {p.category && (
                                    <Badge className="w-fit bg-emerald-100 text-emerald-700">{p.category}</Badge>
                                )}
                                {p.brand && (
                                    <span className="text-xs text-emerald-600">Brand: {p.brand}</span>
                                )}
                                {p.price !== undefined && (
                                    <p className="text-lg font-bold text-emerald-700">${p.price}</p>
                                )}
                                <Button className="bg-emerald-600 hover:bg-emerald-700">Add to Cart</Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
