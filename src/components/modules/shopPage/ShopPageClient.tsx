"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/ui/FormInput";
import { Badge } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { medicineService } from "@/services/medicine.service";

type MedicineItem = {
    id?: string;
    name?: string;
    price?: number | string;
    category?: string;
    brand?: string;
    image?: string | null;
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
                Object.entries(filters).filter(([, v]) => v && v.toString().trim() !== "")
            ),
        [filters]
    );

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
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
        <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8 rounded-3xl border border-border/70 bg-card/80 p-5 shadow-[0_22px_44px_-38px_rgba(15,23,42,0.75)] sm:p-7">
                    <div className="mb-6 flex flex-col gap-2">
                        <h1 className="text-3xl font-bold text-emerald-700 sm:text-4xl">Shop Medicines</h1>
                    </div>
                    <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
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
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={resetFilters}>
                            Reset Filters
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {loading && <span className="col-span-full rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-center text-sm font-medium text-emerald-700">Loading...</span>}
                    {error && <span className="col-span-full rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-600">{error}</span>}
                    {!loading && medicines.length === 0 && !error && (
                        <div className="col-span-full rounded-2xl border border-border/70 bg-card px-4 py-6 text-center font-medium text-emerald-700">
                            No medicines found.
                        </div>
                    )}
                    {medicines?.map((p, index) => (
                        <Card key={p.id ?? index} className="group overflow-hidden rounded-2xl border-border/70 bg-card/95 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_30px_-24px_rgba(15,23,42,0.9)]">
                            <CardContent className="flex flex-col gap-4 p-5">
                                <div className="flex h-36 items-center justify-center rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-100 to-emerald-50 text-sm font-bold tracking-wide text-emerald-600">
                                    IMG
                                </div>
                                <h3 className="text-base font-semibold text-foreground">{p.name ?? `Medicine ${index + 1}`}</h3>
                                {p.category && (
                                    <Badge className="w-fit rounded-full border border-emerald-200 bg-emerald-100 p-1 text-emerald-700">{p.category}</Badge>
                                )}
                                {p.brand && (
                                    <span className="text-xs font-medium text-emerald-700/85">Brand: {p.brand}</span>
                                )}
                                {p.price !== undefined && (
                                    <p className="text-xl font-bold text-emerald-700">${p.price}</p>
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
