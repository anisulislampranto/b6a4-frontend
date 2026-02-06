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
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-emerald-100 via-white to-emerald-50 px-4 relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.15),transparent_40%)]" />

            <Card className="relative w-full max-w-4xl flex flex-col md:flex-row rounded-3xl overflow-hidden border border-emerald-100 shadow-[0_20px_60px_rgba(16,185,129,0.25)]">

                {/* Left Branding */}
                <div className="hidden md:flex flex-col justify-center px-12 py-16 bg-linear-to-br from-emerald-600 to-emerald-700 text-white text-center">
                    <div className="bg-white backdrop-blur-xl rounded-full flex justify-center items-center mx-auto p-6">
                        <div className="relative w-40 h-40">
                            <Image
                                src="/logoBig-removebg-preview.png"
                                fill
                                alt="logo"
                                className="object-contain"
                            />
                        </div>
                    </div>

                    <h2 className="text-4xl font-semibold leading-tight my-4">
                        Your health,<br /> our priority
                    </h2>

                    <p className="text-emerald-100 max-w-sm mx-auto leading-relaxed">
                        Order medicines, get fast delivery, and manage prescriptions from anywhere.
                    </p>
                </div>

                {/* Right Form */}
                <CardContent className="px-10 py-12 flex flex-col justify-center flex-1">
                    <div className="mb-8">
                        <h3 className="text-3xl font-semibold text-emerald-700">{title}</h3>
                        <p className="text-gray-500 mt-1">{subtitle}</p>
                    </div>

                    <div className="space-y-5">
                        {children}

                        <div className="relative my-6">
                            <div className="h-px bg-gray-200" />
                            <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-white px-3 text-xs text-gray-400">
                                or
                            </span>
                        </div>

                        <p className="text-sm text-center text-gray-500">
                            {linkText}{" "}
                            <Link
                                href={linkHref}
                                className="text-emerald-600 font-semibold hover:underline"
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
