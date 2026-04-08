"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SellerDashboardClient() {
    const { data: session, isPending } = authClient.useSession();
    const role = session?.user?.role?.toUpperCase();
    const canManage = role === "SELLER" || role === "ADMIN";

    if (isPending) {
        return (
            <main className="mx-auto min-h-[70vh] max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700">
                    Loading seller dashboard...
                </div>
            </main>
        );
    }

    if (!session?.user || !canManage) {
        return (
            <main className="mx-auto min-h-[70vh] max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">
                    You do not have permission to access seller dashboard.
                </div>
            </main>
        );
    }

    return (
        <main className="mx-auto min-h-[70vh] max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <section className="mb-7 rounded-3xl border border-border/70 bg-card/85 px-6 py-7 shadow-[0_24px_40px_-36px_rgba(15,23,42,0.8)] sm:px-8">
                <h1 className="text-3xl font-bold text-emerald-700 sm:text-4xl">Seller Dashboard</h1>
                <p className="mt-2 max-w-3xl text-muted-foreground">
                    Manage your listings and keep your inventory up to date.
                </p>
            </section>

            <section className="grid gap-5 md:grid-cols-2">
                <Card className="rounded-2xl border-border/70 bg-card/95">
                    <CardContent className="space-y-4 p-6">
                        <h2 className="text-xl font-semibold text-foreground">Add New Medicine</h2>
                        <p className="text-sm text-muted-foreground">Create a new medicine listing with category and brand details.</p>
                        <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                            <Link href="/seller/medicines">Go to Add Medicine</Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl border-border/70 bg-card/95">
                    <CardContent className="space-y-4 p-6">
                        <h2 className="text-xl font-semibold text-foreground">View Inventory</h2>
                        <p className="text-sm text-muted-foreground">See all your medicines, stock levels, and status at a glance.</p>
                        <Button asChild variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                            <Link href="/seller/inventory">Open Inventory</Link>
                        </Button>
                    </CardContent>
                </Card>
            </section>
        </main>
    );
}
