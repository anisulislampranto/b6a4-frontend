"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Truck, ShieldCheck, MessageCircle, CreditCard } from 'lucide-react';
import { useState } from "react";
import PrescriptionModal from "./components/PrescriptionModal";

export default function Homepage() {
    const [isPrescriptionModalOpen, setPrescriptionModalOpen] = useState(false);

    return (
        <main className="min-h-screen px-4 pb-10 pt-8 sm:px-6 lg:px-8">
            <section className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl border border-border/70 bg-card/85 px-6 py-14 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.5)] sm:px-10 lg:py-16">
                <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-emerald-200/45 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-16 -right-10 h-52 w-52 rounded-full bg-emerald-300/30 blur-3xl" />

                <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
                    <div className="text-center lg:text-left">
                        <p className="mb-4 inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                            MediStore
                        </p>
                        <h1 className="mb-5 text-4xl font-bold text-emerald-700 sm:text-5xl lg:text-6xl">Your Trusted Online Pharmacy</h1>
                        <p className="mx-auto mb-10 max-w-2xl text-base text-muted-foreground sm:text-lg lg:mx-0">
                            Order genuine medicines, upload prescriptions, and get fast delivery to your door.
                        </p>
                        <div className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-4 lg:justify-start">
                            <Button className="bg-emerald-600 hover:bg-emerald-700">Get Started</Button>
                            <Button
                                variant="outline"
                                className="border-emerald-600 text-emerald-700 hover:bg-emerald-50"
                                onClick={() => setPrescriptionModalOpen(true)}
                            >
                                Upload Prescription
                            </Button>
                        </div>
                        <div className="mt-8 grid grid-cols-3 gap-3 text-left">
                            <div className="rounded-2xl border border-border/70 bg-white/80 px-3 py-3 shadow-sm">
                                <p className="text-xl font-bold text-emerald-700">24/7</p>
                                <p className="text-xs text-muted-foreground">Support</p>
                            </div>
                            <div className="rounded-2xl border border-border/70 bg-white/80 px-3 py-3 shadow-sm">
                                <p className="text-xl font-bold text-emerald-700">Fast</p>
                                <p className="text-xs text-muted-foreground">Delivery</p>
                            </div>
                            <div className="rounded-2xl border border-border/70 bg-white/80 px-3 py-3 shadow-sm">
                                <p className="text-xl font-bold text-emerald-700">Trusted</p>
                                <p className="text-xs text-muted-foreground">Quality</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative mx-auto w-full max-w-md">
                        <div className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-600 to-emerald-700 p-6 text-white shadow-[0_30px_50px_-30px_rgba(5,150,105,0.9)]">
                            <p className="text-sm font-medium text-emerald-100">MediStore</p>
                            <h3 className="mt-1 text-2xl font-semibold">Your health, our priority</h3>
                            <p className="mt-3 text-sm text-emerald-100">Reliable medicine shopping with a smooth and secure experience.</p>
                            <div className="mt-5 grid grid-cols-2 gap-3">
                                <div className="rounded-2xl bg-white/15 px-3 py-3 backdrop-blur">
                                    <p className="text-xs text-emerald-100">Verified</p>
                                    <p className="text-sm font-semibold">Medicines</p>
                                </div>
                                <div className="rounded-2xl bg-white/15 px-3 py-3 backdrop-blur">
                                    <p className="text-xs text-emerald-100">Safe</p>
                                    <p className="text-sm font-semibold">Packaging</p>
                                </div>
                            </div>
                        </div>

                        <div className="absolute -left-5 -top-5 rounded-2xl border border-border/60 bg-white px-3 py-2 shadow-lg">
                            <p className="text-xs font-semibold text-emerald-700">Trusted Care</p>
                        </div>
                        <div className="absolute -bottom-5 -right-5 rounded-2xl border border-border/60 bg-white px-3 py-2 shadow-lg">
                            <p className="text-xs font-semibold text-emerald-700">Quick Service</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto mt-14 max-w-7xl rounded-3xl border border-border/70 bg-card/80 px-6 py-14 sm:px-10">
                <h2 className="mb-10 text-center text-3xl font-semibold text-emerald-700 sm:text-4xl">How MediStore Works</h2>
                <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
                    {['Search or Upload', 'Verify & Pack', 'Fast Delivery'].map((t, i) => (
                        <Card key={i} className="rounded-2xl border-border/70 bg-white/80 shadow-[0_16px_28px_-24px_rgba(15,23,42,0.8)]">
                            <CardContent className="p-7 text-center">
                                <h3 className="mb-2 text-lg font-semibold text-foreground">{t}</h3>
                                <p className="text-sm text-muted-foreground">Simple, secure and quick process.</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>

            <section className="mx-auto mt-14 max-w-7xl px-2 py-2">
                <h2 className="mb-10 text-center text-3xl font-semibold text-emerald-700 sm:text-4xl">Why Choose MediStore</h2>
                <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-4">
                    {[ShieldCheck, Truck, CreditCard, MessageCircle].map((Icon, i) => (
                        <Card key={i} className="rounded-2xl border-border/70 bg-card/90">
                            <CardContent className="p-7 text-center">
                                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
                                    <Icon className="text-emerald-600" />
                                </div>
                                <p className="text-sm font-medium text-muted-foreground">Trusted Feature</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>


            <section className="mx-auto mt-14 max-w-7xl rounded-3xl bg-emerald-700 px-6 py-18 text-center text-white shadow-[0_24px_50px_-30px_rgba(16,185,129,0.85)] sm:px-10">
                <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Your health shouldn’t wait</h2>
                <p className="mb-8 text-emerald-100">Join MediStore today and get medicines delivered fast.</p>
                <Button className="bg-white text-emerald-700 hover:bg-emerald-100">Sign Up Free</Button>
            </section>

            <PrescriptionModal
                isOpen={isPrescriptionModalOpen}
                onClose={() => setPrescriptionModalOpen(false)}
            />
        </main>
    );
}
