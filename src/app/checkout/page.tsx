import CheckoutClient from "@/components/modules/checkout/CheckoutClient";
import { hasAuthenticatedUser, hasRequiredRole } from "@/lib/session";
import { userService } from "@/services/user.service";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Checkout - MediStore",
    description: "Complete your purchase and get your medicines delivered.",
};

export default async function CheckoutPage() {
    const session = await userService.getSession();

    if (!hasAuthenticatedUser(session.data)) {
        redirect("/signin");
    }

    if (!hasRequiredRole(session.data, ["CUSTOMER"])) {
        redirect("/dashboard");
    }

    return <CheckoutClient />;
}
