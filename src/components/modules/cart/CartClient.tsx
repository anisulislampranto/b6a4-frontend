"use client";

import Link from "next/link";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { removeItem, updateQuantity, selectCartItems, selectCartTotal } from "@/redux/features/cart/cartSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";

export default function CartClient() {
    const items = useAppSelector(selectCartItems);
    const total = useAppSelector(selectCartTotal);
    const dispatch = useAppDispatch();

    if (items.length === 0) {
        return (
            <main className="mx-auto min-h-[70vh] max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center justify-center space-y-6 rounded-3xl border border-dashed border-emerald-200 bg-emerald-50/30 p-12 text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                        <ShoppingBag className="h-10 w-10" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-bold text-emerald-900">Your cart is empty</h2>
                        <p className="text-muted-foreground">It looks like you haven&apos;t added any medicines yet.</p>
                    </div>
                    <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                        <Link href="/shop">Browse Medicines</Link>
                    </Button>
                </div>
            </main>
        );
    }

    return (
        <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <h1 className="mb-8 text-3xl font-bold text-emerald-700">Shopping Cart</h1>

            <div className="grid gap-8 lg:grid-cols-12">
                {/* Cart Items */}
                <div className="space-y-4 lg:col-span-8">
                    {items.map((item) => (
                        <Card key={item.id} className="overflow-hidden rounded-2xl border-border/70 bg-card/95 shadow-sm">
                            <CardContent className="p-4 sm:p-6">
                                <div className="flex gap-4 sm:gap-6">
                                    <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 sm:h-32 sm:w-32">
                                        {item.image ? (
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                width={128}
                                                height={128}
                                                className="h-full w-full rounded-xl object-cover"
                                            />
                                        ) : (
                                            <ShoppingBag className="h-8 w-8 text-emerald-200" />
                                        )}
                                    </div>
                                    <div className="flex flex-1 flex-col justify-between py-1">
                                        <div className="flex justify-between">
                                            <div>
                                                <h3 className="text-lg font-bold text-foreground">{item.name}</h3>
                                                <p className="text-sm font-medium text-emerald-600">{item.category?.name}</p>
                                            </div>
                                            <p className="text-lg font-bold text-emerald-700">${item.price}</p>
                                        </div>

                                        <div className="mt-4 flex items-center justify-between">
                                            <div className="flex items-center gap-2 rounded-xl border border-border bg-background p-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-lg hover:bg-emerald-50 hover:text-emerald-600"
                                                    onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </Button>
                                                <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-lg hover:bg-emerald-50 hover:text-emerald-600"
                                                    onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-red-500 hover:bg-red-50 hover:text-red-700"
                                                onClick={() => dispatch(removeItem(item.id))}
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Summary */}
                <div className="lg:col-span-4">
                    <Card className="rounded-3xl border-emerald-100 bg-card/95 shadow-lg">
                        <CardContent className="space-y-6 p-6 sm:p-8">
                            <h2 className="text-xl font-bold text-foreground">Order Summary</h2>
                            <div className="space-y-4">
                                <div className="flex justify-between text-sm text-foreground/70">
                                    <span>Subtotal</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-foreground/70">
                                    <span>Shipping</span>
                                    <span className="font-medium text-emerald-600">Calculated later</span>
                                </div>
                                <div className="border-t pt-4">
                                    <div className="flex justify-between text-xl font-bold text-emerald-800">
                                        <span>Total</span>
                                        <span>${total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                            <Button asChild className="w-full h-12 rounded-xl bg-emerald-600 py-6 text-base font-bold shadow-lg hover:bg-emerald-700 shadow-emerald-600/20">
                                <Link href="/checkout">Proceed to Checkout</Link>
                            </Button>
                            <p className="text-center text-xs text-muted-foreground">
                                Free delivery for orders above $50. No hidden charges.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    );
}
