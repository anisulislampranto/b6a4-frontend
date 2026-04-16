import SellerOrdersClient from "@/components/modules/seller/SellerOrdersClient";
import { userService } from "@/services/user.service";
import { hasAuthenticatedUser, hasRequiredRole } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function SellerOrdersPage() {
    const session = await userService.getSession();

    if (!hasAuthenticatedUser(session.data)) {
        redirect("/signin");
    }

    if (!hasRequiredRole(session.data, ["SELLER", "ADMIN"])) {
        redirect("/dashboard");
    }

    return <SellerOrdersClient />;
}
