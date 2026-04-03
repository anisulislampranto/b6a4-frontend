import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";

interface AuthCardProps {
    title: string;
    subtitle: string;
    ctaText: string;
    linkText: string;
    linkHref: string;
    children: ReactNode;
}

export default function AuthCard({
    title,
    subtitle,
    linkText,
    linkHref,
    children,
}: AuthCardProps) {
    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 sm:px-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.16),transparent_45%)]" />
            <div className="pointer-events-none absolute -left-24 top-24 h-56 w-56 rounded-full bg-emerald-200/40 blur-3xl" />
            <div className="pointer-events-none absolute -right-20 bottom-12 h-64 w-64 rounded-full bg-emerald-300/25 blur-3xl" />

            <Card className="relative flex w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-emerald-100/70 bg-card shadow-[0_26px_70px_-50px_rgba(15,23,42,0.9)] md:flex-row">
                <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-emerald-100/60 ring-inset" />

                {/* Left Branding */}
                <div className="relative hidden flex-col justify-center border-r border-emerald-500/30 bg-linear-to-br from-emerald-700 to-emerald-600 px-10 py-14 text-center text-white md:flex md:basis-[46%]">
                    <div className="absolute left-7 top-7 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-50">
                        MediStore
                    </div>
                    <div className="mx-auto flex items-center justify-center rounded-3xl border border-white/30 bg-white p-4 shadow-[0_14px_30px_-20px_rgba(15,23,42,0.9)]">
                        <div className="relative w-40 h-40">
                            <Image
                                src="/logoBig-removebg-preview.png"
                                fill
                                alt="logo"
                                className="object-contain"
                            />
                        </div>
                    </div>

                    <h2 className="my-4 text-4xl font-semibold leading-tight">
                        Your health,<br /> our priority
                    </h2>

                    <p className="mx-auto max-w-sm text-emerald-100/95 leading-relaxed">
                        Order medicines, get fast delivery, and manage prescriptions from anywhere.
                    </p>

                    <div className="mt-8 grid grid-cols-3 gap-2.5 text-left">
                        <div className="rounded-xl border border-white/20 bg-white/10 px-3 py-2.5 backdrop-blur">
                            <p className="text-sm font-semibold">24/7</p>
                            <p className="text-xs text-emerald-100">Support</p>
                        </div>
                        <div className="rounded-xl border border-white/20 bg-white/10 px-3 py-2.5 backdrop-blur">
                            <p className="text-sm font-semibold">Fast</p>
                            <p className="text-xs text-emerald-100">Delivery</p>
                        </div>
                        <div className="rounded-xl border border-white/20 bg-white/10 px-3 py-2.5 backdrop-blur">
                            <p className="text-sm font-semibold">Secure</p>
                            <p className="text-xs text-emerald-100">Checkout</p>
                        </div>
                    </div>
                </div>

                {/* Right Form */}
                <CardContent className="relative flex flex-1 flex-col justify-center bg-white/85 px-7 py-9 sm:px-10 sm:py-10 md:basis-[54%]">
                    <div className="mb-7">
                        <h3 className="text-3xl font-bold text-emerald-700">{title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground sm:text-base">{subtitle}</p>
                    </div>

                    <div className="space-y-5">
                        {children}

                        <div className="relative my-6">
                            <div className="h-px bg-emerald-100" />
                            <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-white px-3 text-xs font-medium text-muted-foreground">
                                or
                            </span>
                        </div>

                        <p className="text-center text-sm text-muted-foreground">
                            {linkText}{" "}
                            <Link
                                href={linkHref}
                                className="font-semibold text-emerald-600 underline-offset-4 hover:underline"
                            >
                                {linkHref.includes("signup") ? "Sign Up" : "Sign In"}
                            </Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
