import type { Metadata } from "next";
import OrderDetailsClient from "@/components/modules/orders/OrderDetailsClient";
import { hasAuthenticatedUser, hasRequiredRole } from "@/lib/session";
import { userService } from "@/services/user.service";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Order Details - MediStore",
    description: "View detailed order information and track order progress.",
};

interface OrderDetailsPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function OrderDetailsPage({ params }: OrderDetailsPageProps) {
    const session = await userService.getSession();

    if (!hasAuthenticatedUser(session.data)) {
        redirect("/signin");
    }

    if (!hasRequiredRole(session.data, ["CUSTOMER"])) {
        redirect("/dashboard");
    }

    const { id } = await params;
    return <OrderDetailsClient orderId={id} />;
}
