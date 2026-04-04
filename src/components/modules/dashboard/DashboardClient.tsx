"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

type DashboardRole = "CUSTOMER" | "SELLER" | "ADMIN";

const roleContent: Record<
    DashboardRole,
    {
        title: string;
        subtitle: string;
        panels: { title: string; description: string; href: string }[];
    }
> = {
    CUSTOMER: {
        title: "Customer Dashboard",
        subtitle: "Track purchases, manage your cart, and keep your profile updated.",
        panels: [
            { title: "My Orders", description: "View order history and track current order status.", href: "/orders" },
            { title: "Cart", description: "Review selected medicines before checkout.", href: "/cart" },
            { title: "Profile", description: "Update personal details and account information.", href: "/profile" },
        ],
    },
    SELLER: {
        title: "Seller Dashboard",
        subtitle: "Manage medicine inventory, incoming orders, and stock updates.",
        panels: [
            { title: "Inventory", description: "Add, edit, and remove your medicine listings.", href: "/seller/medicines" },
            { title: "Seller Orders", description: "View new orders and update order statuses.", href: "/seller/orders" },
            { title: "Seller Overview", description: "See daily activity and stock visibility.", href: "/seller/dashboard" },
        ],
    },
    ADMIN: {
        title: "Admin Dashboard",
        subtitle: "Monitor users, orders, and platform-wide medicine operations.",
        panels: [
            { title: "Users", description: "Manage customer and seller accounts.", href: "/admin/users" },
            { title: "Orders", description: "Track and review all platform orders.", href: "/admin/orders" },
            { title: "Categories", description: "Create and maintain medicine categories.", href: "/admin/categories" },
        ],
    },
};

const getRole = (role?: string): DashboardRole => {
    const normalizedRole = role?.toUpperCase();
    if (normalizedRole === "SELLER" || normalizedRole === "ADMIN") {
        return normalizedRole;
    }
    return "CUSTOMER";
};

export default function DashboardClient() {
    const { data: session, isPending } = authClient.useSession();

    if (isPending) {
        return (
            <main className="mx-auto min-h-[70vh] max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-6 py-5 text-emerald-700">
                    Loading your dashboard...
                </div>
            </main>
        );
    }

    if (!session?.user) {
        return (
            <main className="mx-auto min-h-[70vh] max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
                <Card className="rounded-3xl border-border/70 bg-card/90">
                    <CardContent className="space-y-6 p-8 text-center">
                        <h1 className="text-3xl font-bold text-emerald-700">Dashboard</h1>
                        <p className="text-muted-foreground">Please sign in to access your dashboard.</p>
                        <div className="flex flex-col justify-center gap-3 sm:flex-row">
                            <Button asChild variant="outline">
                                <Link href="/signin">Sign In</Link>
                            </Button>
                            <Button asChild>
                                <Link href="/signup">Sign Up</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </main>
        );
    }

    const role = getRole(session.user.role ?? undefined);
    const content = roleContent[role];

    return (
        <main className="mx-auto min-h-[70vh] max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <section className="mb-7 rounded-3xl border border-border/70 bg-card/85 px-6 py-7 shadow-[0_24px_40px_-36px_rgba(15,23,42,0.8)] sm:px-8">
                <div className="mb-3 inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-700">
                    {role}
                </div>
                <h1 className="text-3xl font-bold text-emerald-700 sm:text-4xl">{content.title}</h1>
                <p className="mt-2 max-w-3xl text-muted-foreground">{content.subtitle}</p>
            </section>

            <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {content.panels.map((panel) => (
                    <Card key={panel.title} className="rounded-2xl border-border/70 bg-card/95">
                        <CardContent className="space-y-4 p-6">
                            <h2 className="text-xl font-semibold text-foreground">{panel.title}</h2>
                            <p className="text-sm text-muted-foreground">{panel.description}</p>
                            <Button asChild variant="outline" className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50">
                                <Link href={panel.href}>Open</Link>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </section>
        </main>
    );
}
