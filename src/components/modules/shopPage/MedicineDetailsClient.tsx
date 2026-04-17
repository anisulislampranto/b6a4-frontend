"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { medicineService } from "@/services/medicine.service";
import type { MedicineWithRelations } from "@/types/medicine.type";
import type { Review } from "@/types/review.type";
import { useAppDispatch } from "@/redux/hooks";
import { addItem } from "@/redux/features/cart/cartSlice";
import { toast } from "sonner";
import { reviewService } from "@/services/review.service";

interface MedicineDetailsClientProps {
    medicineId: string;
}

export default function MedicineDetailsClient({ medicineId }: MedicineDetailsClientProps) {
    const dispatch = useAppDispatch();
    const [medicine, setMedicine] = useState<MedicineWithRelations | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingReviews, setLoadingReviews] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        const loadMedicine = async () => {
            setLoading(true);
            setError(null);
            try {
                const { ok, data } = await medicineService.getMedicineById(medicineId);
                if (!ok || !data?.data) {
                    if (!cancelled) setError(data?.message || "Medicine not found.");
                    return;
                }

                if (!cancelled) setMedicine(data.data);
            } catch {
                if (!cancelled) setError("Failed to load medicine details.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        loadMedicine();

        return () => {
            cancelled = true;
        };
    }, [medicineId]);

    useEffect(() => {
        let cancelled = false;

        const loadReviews = async () => {
            setLoadingReviews(true);
            try {
                const { ok, data } = await reviewService.getMedicineReviews(medicineId);
                if (!cancelled && ok) {
                    setReviews(data?.data || []);
                }
            } catch {
                if (!cancelled) {
                    setReviews([]);
                }
            } finally {
                if (!cancelled) setLoadingReviews(false);
            }
        };

        loadReviews();
        return () => {
            cancelled = true;
        };
    }, [medicineId]);

    if (loading) {
        return (
            <main className="mx-auto min-h-[70vh] max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700">
                    Loading medicine details...
                </div>
            </main>
        );
    }

    if (error || !medicine) {
        return (
            <main className="mx-auto min-h-[70vh] max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
                <Card className="rounded-2xl border-border/70 bg-card/95">
                    <CardContent className="space-y-4 p-6 text-center">
                        <p className="text-red-600">{error || "Medicine not found."}</p>
                        <Button asChild variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                            <Link href="/shop">Back to Shop</Link>
                        </Button>
                    </CardContent>
                </Card>
            </main>
        );
    }

    return (
        <main className="mx-auto min-h-[70vh] max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="mb-5">
                <Button asChild variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                    <Link href="/shop">Back to Shop</Link>
                </Button>
            </div>

            <Card className="mb-6 overflow-hidden rounded-3xl border-border/70 bg-card/95">
                <CardContent className="grid grid-cols-1 gap-8 p-6 sm:p-8 md:grid-cols-2">
                    <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-100 to-emerald-50 p-4">
                        {medicine.image ? (
                            <img src={medicine.image} alt={medicine.name} className="h-full w-full rounded-xl object-cover" />
                        ) : (
                            <div className="flex h-72 items-center justify-center rounded-xl bg-emerald-50 text-sm font-semibold text-emerald-600">
                                No Image
                            </div>
                        )}
                    </div>

                    <div className="space-y-5">
                        <div>
                            <h1 className="text-3xl font-bold text-emerald-700">{medicine.name}</h1>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Category: <span className="font-semibold text-foreground">{medicine.category.name}</span>
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Brand: <span className="font-semibold text-foreground">{medicine.brand.name}</span>
                            </p>
                        </div>

                        <p className="text-base leading-relaxed text-foreground/90">
                            {medicine.description || "No detailed description available for this medicine yet."}
                        </p>

                        <div className="space-y-1">
                            <p className="text-3xl font-bold text-emerald-700">${medicine.price}</p>
                            <p className="text-sm text-muted-foreground">
                                Stock: <span className="font-semibold text-foreground">{medicine.stock}</span>
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <Button
                                className="bg-emerald-600 hover:bg-emerald-700"
                                onClick={() => {
                                    dispatch(addItem(medicine));
                                    toast.success(`${medicine.name} added to cart!`);
                                }}
                            >
                                Add to Cart
                            </Button>
                            <Button asChild variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                                <Link href="/cart">Go to Cart</Link>
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="mb-6 rounded-3xl border-border/70 bg-card/95">
                <CardContent className="space-y-4 p-6 sm:p-8">
                    <h2 className="text-2xl font-semibold text-foreground">Reviews</h2>

                    {loadingReviews ? (
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                            Loading reviews...
                        </div>
                    ) : reviews.length === 0 ? (
                        <div className="rounded-xl border border-border/70 bg-card px-4 py-3 text-sm text-muted-foreground">
                            No reviews yet for this medicine.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {reviews.map((review) => (
                                <div key={review.id} className="rounded-xl border border-border/70 bg-card p-4">
                                    <div className="mb-2 flex items-center justify-between gap-2">
                                        <p className="text-sm font-semibold text-foreground">{review.user?.name || "Anonymous User"}</p>
                                        <p className="text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <p className="mb-2 text-sm font-medium text-emerald-700">Rating: {review.rating}/5</p>
                                    <p className="text-sm text-muted-foreground">{review.comment || "No comment provided."}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </main>
    );
}
