import OrdersClient from "@/components/modules/orders/OrdersClient";
import { hasAuthenticatedUser, hasRequiredRole } from "@/lib/session";
import { userService } from "@/services/user.service";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "My Orders - MediStore",
    description: "Track your medicine orders and viewing your purchase history.",
};

export default async function OrdersPage() {
    const session = await userService.getSession();

    if (!hasAuthenticatedUser(session.data)) {
        redirect("/signin");
    }

    if (!hasRequiredRole(session.data, ["CUSTOMER"])) {
        redirect("/dashboard");
    }

    return <OrdersClient />;
}
