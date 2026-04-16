import { redirect } from "next/navigation";
import AdminCategoriesClient from "@/components/modules/admin/AdminCategoriesClient";
import { userService } from "@/services/user.service";
import { hasAuthenticatedUser, hasRequiredRole } from "@/lib/session";

export default async function AdminCategoriesPage() {
    const session = await userService.getSession();

    if (!hasAuthenticatedUser(session.data)) {
        redirect("/signin");
    }

    if (!hasRequiredRole(session.data, ["ADMIN"])) {
        redirect("/dashboard");
    }

    return <AdminCategoriesClient />;
}
