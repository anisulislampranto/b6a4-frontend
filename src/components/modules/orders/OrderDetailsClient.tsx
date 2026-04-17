"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { orderService } from "@/services/order.service";
import { ORDER_STATUS_VALUES, type Order, type OrderStatus } from "@/types/order.type";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Package, Truck, CheckCircle2, XCircle, CircleDot } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { reviewService } from "@/services/review.service";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import type { Review } from "@/types/review.type";

const timelineSteps: { status: OrderStatus; label: string; description: string }[] = [
    { status: "PENDING", label: "Order Placed", description: "Your order has been placed successfully." },
    { status: "CONFIRMED", label: "Confirmed", description: "Seller confirmed the order." },
    { status: "SHIPPED", label: "Shipped", description: "Your package is on the way." },
    { status: "DELIVERED", label: "Delivered", description: "Order has been delivered." },
];

const statusOrder: OrderStatus[] = [...ORDER_STATUS_VALUES];

const statusIconMap: Record<OrderStatus, typeof Clock> = {
    PENDING: Clock,
    CONFIRMED: Package,
    SHIPPED: Truck,
    DELIVERED: CheckCircle2,
    CANCELLED: XCircle,
};

interface OrderDetailsClientProps {
    orderId: string;
}

export default function OrderDetailsClient({ orderId }: OrderDetailsClientProps) {
    const { data: session } = authClient.useSession();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeReviewMedicineId, setActiveReviewMedicineId] = useState<string | null>(null);
    const [reviewRating, setReviewRating] = useState("5");
    const [reviewComment, setReviewComment] = useState("");
    const [submittingReview, setSubmittingReview] = useState(false);
    const [reviewedMedicineIds, setReviewedMedicineIds] = useState<Record<string, boolean>>({});
    const [myReviewsByMedicineId, setMyReviewsByMedicineId] = useState<Record<string, Review>>({});

    useEffect(() => {
        let cancelled = false;

        const loadOrder = async () => {
            setLoading(true);
            setError(null);
            try {
                const { ok, data } = await orderService.getOrderById(orderId);
                if (!ok || !data?.data) {
                    if (!cancelled) setError(data?.message || "Order not found.");
                    return;
                }

                if (!cancelled) setOrder(data.data);
            } catch {
                if (!cancelled) setError("Something went wrong while loading order details.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        loadOrder();
        return () => {
            cancelled = true;
        };
    }, [orderId]);

    const progressIndex = useMemo(() => {
        if (!order) return -1;
        return statusOrder.indexOf(order.status);
    }, [order]);

    useEffect(() => {
        let cancelled = false;

        const loadMyReviewsForOrderItems = async () => {
            if (!order || !session?.user?.id) return;

            const medicineIds = Array.from(new Set(order.items.map((item) => item.medicineId)));
            if (medicineIds.length === 0) return;

            try {
                const results = await Promise.all(
                    medicineIds.map(async (medicineId) => {
                        const { ok, data } = await reviewService.getMedicineReviews(medicineId);
                        if (!ok) return null;
                        const myReview = (data?.data || []).find((review) => review.userId === session.user.id);
                        if (!myReview) return null;
                        return { medicineId, review: myReview };
                    })
                );

                if (cancelled) return;

                const reviewedMap: Record<string, boolean> = {};
                const reviewDataMap: Record<string, Review> = {};

                results.forEach((result) => {
                    if (!result) return;
                    reviewedMap[result.medicineId] = true;
                    reviewDataMap[result.medicineId] = result.review;
                });

                setReviewedMedicineIds((prev) => ({ ...prev, ...reviewedMap }));
                setMyReviewsByMedicineId((prev) => ({ ...prev, ...reviewDataMap }));
            } catch {
                // silently ignore; backend still validates on submit
            }
        };

        loadMyReviewsForOrderItems();
        return () => {
            cancelled = true;
        };
    }, [order, session?.user?.id]);

    if (loading) {
        return (
            <main className="mx-auto min-h-[70vh] max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700">
                    Loading order details...
                </div>
            </main>
        );
    }

    if (error || !order) {
        return (
            <main className="mx-auto min-h-[70vh] max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
                <Card className="rounded-2xl border-border/70 bg-card/95">
                    <CardContent className="space-y-4 p-6 text-center">
                        <p className="text-red-600">{error || "Order not found."}</p>
                        <Button asChild variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                            <Link href="/orders">Back to Orders</Link>
                        </Button>
                    </CardContent>
                </Card>
            </main>
        );
    }

    const CurrentStatusIcon = statusIconMap[order.status];
    const canSubmitReview = session?.user?.role?.toUpperCase() === "CUSTOMER" && order.status === "DELIVERED";

    const openReviewForm = async (medicineId: string) => {
        setActiveReviewMedicineId(medicineId);
        setReviewRating("5");
        setReviewComment("");

        if (!session?.user?.id) return;
        try {
            const { ok, data } = await reviewService.getMedicineReviews(medicineId);
            if (!ok) return;

            const alreadyReviewed = (data?.data || []).some((review) => review.userId === session.user.id);
            if (alreadyReviewed) {
                setReviewedMedicineIds((prev) => ({ ...prev, [medicineId]: true }));
                setActiveReviewMedicineId(null);
                toast.info("You already reviewed this medicine.");
            }
        } catch {
            // no-op, normal submit will still validate at backend
        }
    };

    const submitReview = async (medicineId: string) => {
        setSubmittingReview(true);
        try {
            const { ok, data } = await reviewService.createReview({
                medicineId,
                rating: Number(reviewRating),
                comment: reviewComment.trim() || undefined,
            });

            if (!ok) {
                toast.error(data?.message || "Failed to submit review.");
                return;
            }

            toast.success("Review submitted successfully!");
            setReviewedMedicineIds((prev) => ({ ...prev, [medicineId]: true }));
            if (data?.data) {
                setMyReviewsByMedicineId((prev) => ({ ...prev, [medicineId]: data.data }));
            }
            setActiveReviewMedicineId(null);
        } catch {
            toast.error("Something went wrong while submitting review.");
        } finally {
            setSubmittingReview(false);
        }
    };

    return (
        <main className="mx-auto min-h-[70vh] max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="mb-5">
                <Button asChild variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                    <Link href="/orders">Back to Orders</Link>
                </Button>
            </div>

            <section className="mb-6 rounded-3xl border border-border/70 bg-card/95 p-6 sm:p-8">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Order ID</p>
                        <h1 className="font-mono text-lg font-bold text-foreground">{order.id}</h1>
                    </div>
                    <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-700">
                        <CurrentStatusIcon className="h-4 w-4" />
                        {order.status}
                    </span>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                    <div className="rounded-xl border border-border/70 bg-card p-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Amount</p>
                        <p className="mt-1 text-2xl font-bold text-emerald-700">${order.totalAmount.toFixed(2)}</p>
                    </div>
                    <div className="rounded-xl border border-border/70 bg-card p-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Placed At</p>
                        <p className="mt-1 text-sm font-medium text-foreground">{new Date(order.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="rounded-xl border border-border/70 bg-card p-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Address</p>
                        <p className="mt-1 text-sm font-medium text-foreground">{order.address}</p>
                    </div>
                </div>
            </section>

            <section className="mb-6 rounded-3xl border border-border/70 bg-card/95 p-6 sm:p-8">
                <h2 className="text-xl font-semibold text-foreground">Status Timeline</h2>

                {order.status === "CANCELLED" ? (
                    <div className="mt-4 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
                        <XCircle className="h-5 w-5" />
                        <p className="text-sm font-medium">This order has been cancelled.</p>
                    </div>
                ) : (
                    <ol className="mt-5 grid gap-4">
                        {timelineSteps.map((step, index) => {
                            const completed = index <= progressIndex;
                            return (
                                <li
                                    key={step.status}
                                    className={`rounded-xl border p-4 ${completed
                                        ? "border-emerald-200 bg-emerald-50"
                                        : "border-border/70 bg-card"
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        {completed ? (
                                            <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-600" />
                                        ) : (
                                            <CircleDot className="mt-0.5 h-5 w-5 text-muted-foreground" />
                                        )}
                                        <div>
                                            <p className={`text-sm font-semibold ${completed ? "text-emerald-700" : "text-foreground"}`}>
                                                {step.label}
                                            </p>
                                            <p className="mt-0.5 text-sm text-muted-foreground">{step.description}</p>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ol>
                )}
            </section>

            <section className="rounded-3xl border border-border/70 bg-card/95 p-6 sm:p-8">
                <h2 className="text-xl font-semibold text-foreground">Order Items</h2>
                <div className="mt-5 space-y-3">
                    {order.items.map((item) => {
                        const medicineId = item.medicineId;
                        const isReviewed = reviewedMedicineIds[medicineId];
                        const isActiveForm = activeReviewMedicineId === medicineId;
                        const myReview = myReviewsByMedicineId[medicineId];

                        return (
                            <div key={item.id} className="rounded-xl border border-border/70 bg-card p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-emerald-100 bg-emerald-50">
                                            {item.medicine?.image ? (
                                                <img src={item.medicine.image} alt={item.medicine.name} className="h-full w-full rounded-lg object-cover" />
                                            ) : (
                                                <Package className="h-5 w-5 text-emerald-400" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-foreground">{item.medicine?.name || "Medicine"}</p>
                                            <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <p className="text-sm font-semibold text-emerald-700">${item.price.toFixed(2)}</p>
                                        {canSubmitReview && (
                                            <Button
                                                variant="outline"
                                                className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                                                disabled={isReviewed}
                                                onClick={() => openReviewForm(medicineId)}
                                            >
                                                {isReviewed ? "Reviewed" : "Write Review"}
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                {isActiveForm && (
                                    <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50/50 p-4">
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div className="space-y-1.5">
                                                <Label>Rating</Label>
                                                <select
                                                    value={reviewRating}
                                                    onChange={(e) => setReviewRating(e.target.value)}
                                                    className="h-11 w-full rounded-xl border border-border bg-card px-3.5 text-sm outline-none transition focus-visible:ring-4 focus-visible:ring-ring/30"
                                                >
                                                    <option value="5">5 - Excellent</option>
                                                    <option value="4">4 - Good</option>
                                                    <option value="3">3 - Average</option>
                                                    <option value="2">2 - Poor</option>
                                                    <option value="1">1 - Very Poor</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="mt-3 space-y-1.5">
                                            <Label>Comment</Label>
                                            <Textarea
                                                value={reviewComment}
                                                onChange={(e) => setReviewComment(e.target.value)}
                                                className="min-h-24"
                                                placeholder="Share your experience with this medicine"
                                            />
                                        </div>

                                        <div className="mt-4 flex items-center gap-2">
                                            <Button
                                                className="bg-emerald-600 hover:bg-emerald-700"
                                                disabled={submittingReview}
                                                onClick={() => submitReview(medicineId)}
                                            >
                                                {submittingReview ? "Submitting..." : "Submit Review"}
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => setActiveReviewMedicineId(null)}
                                            >
                                                Cancel
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {myReview && (
                                    <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Your Review</p>
                                        <p className="mt-2 text-sm font-medium text-emerald-800">Rating: {myReview.rating}/5</p>
                                        <p className="mt-1 text-sm text-emerald-900/80">
                                            {myReview.comment || "No comment provided."}
                                        </p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
                {!canSubmitReview && (
                    <p className="mt-4 text-sm text-muted-foreground">
                        Reviews can be submitted by customers after the order is delivered.
                    </p>
                )}
            </section>
        </main>
    );
}
