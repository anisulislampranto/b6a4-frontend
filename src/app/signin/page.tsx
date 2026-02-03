import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Image from "next/image";

export default function SignInPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-100 via-white to-emerald-50 px-4">

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.15),transparent_40%)]" />

            <Card className="relative w-full max-w-4xl grid md:grid-cols-2 rounded-3xl overflow-hidden border border-emerald-100 shadow-[0_20px_60px_rgba(16,185,129,0.25)]">

                {/* Left Branding */}
                <div className="hidden md:flex flex-col justify-center px-12 py-16 bg-gradient-to-br from-emerald-600 to-emerald-700 text-white">

                    <div className="bg-white backdrop-blur-xl filter rounded-full flex justify-center">
                        <div className="relative w-50 h-50">
                            <Image src={'/logoBig-removebg-preview.png'} className="absolute object-contain" fill alt="logo" />
                        </div>
                    </div>

                    <h2 className="text-4xl font-semibold leading-tight my-4 text-center">
                        Your health,<br /> our priority
                    </h2>

                    <p className="text-emerald-100 max-w-sm leading-relaxed text-center">
                        Order medicines, get fast delivery, and manage prescriptions from anywhere.
                    </p>
                </div>

                {/* Right Form */}
                <CardContent className="px-10 py-12 flex flex-col justify-center">
                    <div className="mb-8">
                        <h3 className="text-3xl font-semibold text-emerald-700">
                            Sign In
                        </h3>
                        <p className="text-gray-500 mt-1">
                            Access your MediStore account
                        </p>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <Label className="text-gray-700">Email</Label>
                            <Input
                                type="email"
                                placeholder="you@example.com"
                                className="mt-1 focus-visible:ring-emerald-500"
                            />
                        </div>

                        <div>
                            <Label className="text-gray-700">Password</Label>
                            <Input
                                type="password"
                                placeholder="••••••••"
                                className="mt-1 focus-visible:ring-emerald-500"
                            />
                        </div>

                        <Button className="w-full h-11 mt-2 bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/30">
                            Login
                        </Button>

                        <div className="relative my-6">
                            <div className="h-px bg-gray-200" />
                            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-3 text-xs text-gray-400">
                                or
                            </span>
                        </div>

                        <p className="text-sm text-center text-gray-500">
                            Don’t have an account?{" "}
                            <Link href={'/signup'} className="text-emerald-600 font-semibold hover:underline cursor-pointer">
                                Sign Up
                            </Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
