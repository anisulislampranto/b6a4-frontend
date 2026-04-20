"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectCartItems, selectCartTotal, clearCart } from "@/redux/features/cart/cartSlice";
import { useForm } from "@tanstack/react-form";
import { checkoutSchema } from "./validation/checkout.schema";
import { orderService } from "@/services/order.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ShoppingBag, CreditCard, ChevronRight } from "lucide-react";
import Link from "next/link";
import SafeImage from "@/components/ui/SafeImage";

export default function CheckoutClient() {
    const items = useAppSelector(selectCartItems);
    const total = useAppSelector(selectCartTotal);
    const dispatch = useAppDispatch();
    const router = useRouter();

    const form = useForm({
        defaultValues: {
            address: "",
        },
        validators: {
            onChange: checkoutSchema,
        },
        onSubmit: async ({ value }) => {
            const toastId = toast.loading("Processing your order...");
            try {
                const payload = {
                    address: value.address,
                    items: items.map((item) => ({
                        medicineId: item.id,
                        quantity: item.quantity,
                    })),
                };

                const { ok, data } = await orderService.createOrder(payload);

                if (ok) {
                    toast.success("Order placed successfully!", { id: toastId });
                    dispatch(clearCart());
                    router.push("/orders");
                } else {
                    toast.error(data?.message || "Failed to place order", { id: toastId });
                }
            } catch (err) {
                toast.error("An unexpected error occurred", { id: toastId });
            }
        },
    });

    if (items.length === 0) {
        return (
            <main className="mx-auto min-h-[70vh] max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center justify-center space-y-6 text-center">
                    <h2 className="text-2xl font-bold">Your cart is empty</h2>
                    <Button asChild className="bg-emerald-600">
                        <Link href="/shop">Start Shopping</Link>
                    </Button>
                </div>
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
                <Link href="/cart" className="hover:text-emerald-600 transition-colors">Cart</Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-foreground font-medium">Checkout</span>
            </div>

            <div className="grid gap-10 lg:grid-cols-12">
                {/* Checkout Form */}
                <div className="lg:col-span-7">
                    <Card className="rounded-3xl border-border/70 bg-card/95 shadow-sm">
                        <CardContent className="p-6 sm:p-8 space-y-8">
                            <div>
                                <h1 className="text-2xl font-bold text-foreground">Shipping Details</h1>
                                <p className="text-sm text-muted-foreground mt-1">Please provide your delivery address.</p>
                            </div>

                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    form.handleSubmit();
                                }}
                                className="space-y-6"
                            >
                                <form.Field name="address">
                                    {(field) => (
                                        <div className="space-y-2">
                                            <Label htmlFor="address" className="text-sm font-semibold">
                                                Full Delivery Address
                                            </Label>
                                            <Textarea
                                                id="address"
                                                placeholder="House No, Street Name, Area, City..."
                                                className="min-h-[120px] rounded-xl border-emerald-100 focus-visible:ring-emerald-500/20"
                                                value={field.state.value}
                                                onBlur={field.handleBlur}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                            />
                                            {field.state.meta.errors ? (
                                                <p className="text-xs font-medium text-red-500">
                                                    {field.state.meta.errors?.[0]?.message}
                                                </p>
                                            ) : null}
                                        </div>
                                    )}
                                </form.Field>

                                <div className="pt-4 border-t border-dashed">
                                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 text-emerald-800">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                                            <CreditCard className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">Cash on Delivery</p>
                                            <p className="text-xs opacity-80">Currently we only support cash on delivery for all orders.</p>
                                        </div>
                                    </div>
                                </div>

                                <form.Subscribe
                                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                                >
                                    {([canSubmit, isSubmitting]) => (
                                        <Button
                                            type="submit"
                                            disabled={!canSubmit || isSubmitting}
                                            className="w-full h-14 rounded-2xl bg-emerald-600 text-lg font-bold shadow-lg hover:bg-emerald-700 shadow-emerald-600/20 transition-all active:scale-[0.98]"
                                        >
                                            {isSubmitting ? (
                                                <span className="flex items-center gap-2">
                                                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                                    Placing Order...
                                                </span>
                                            ) : (
                                                `Place Order - $${total.toFixed(2)}`
                                            )}
                                        </Button>
                                    )}
                                </form.Subscribe>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Order Summary Sidebar */}
                <div className="lg:col-span-5">
                    <Card className="sticky top-10 rounded-3xl border-border/70 bg-card/95 shadow-sm overflow-hidden">
                        <div className="bg-emerald-50/50 p-6 border-b border-emerald-100">
                            <h2 className="text-lg font-bold text-emerald-900 flex items-center gap-2">
                                <ShoppingBag className="h-5 w-5" />
                                Order Items
                            </h2>
                        </div>
                        <CardContent className="p-0">
                            <div className="max-h-[500px] overflow-y-auto divide-y divide-border/40 px-6">
                                {items.map((item) => (
                                    <div key={item.id} className="py-4 flex items-center gap-4">
                                        <div className="h-16 w-16 shrink-0 rounded-xl border border-emerald-100 bg-emerald-50/50 flex items-center justify-center">
                                            {item.image ? (
                                                <SafeImage
                                                    src={item.image}
                                                    alt={item.name}
                                                    width={64}
                                                    height={64}
                                                    className="h-full w-full object-cover rounded-xl"
                                                />
                                            ) : (
                                                <ShoppingBag className="h-6 w-6 text-emerald-200" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-foreground truncate">{item.name}</p>
                                            <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="text-sm font-bold text-emerald-700">${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="p-6 bg-emerald-50/20 border-t space-y-3">
                                <div className="flex justify-between text-sm text-foreground/70">
                                    <span>Subtotal</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-foreground/70">
                                    <span>Delivery Fee</span>
                                    <span className="text-emerald-600 font-medium">FREE</span>
                                </div>
                                <div className="flex justify-between text-lg font-black text-emerald-800 pt-2">
                                    <span>Total Amount</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    );
}
