import CartClient from "@/components/modules/cart/CartClient";
import { hasAuthenticatedUser, hasRequiredRole } from "@/lib/session";
import { userService } from "@/services/user.service";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Your Cart - MediStore",
    description: "Review your medicines and prepare for checkout.",
};

export default async function CartPage() {
    const session = await userService.getSession();

    if (!hasAuthenticatedUser(session.data)) {
        redirect("/signin");
    }

    if (!hasRequiredRole(session.data, ["CUSTOMER"])) {
        redirect("/dashboard");
    }

    return <CartClient />;
}
