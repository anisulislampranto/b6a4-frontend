import { redirect } from "next/navigation";
import AdminUsersClient from "@/components/modules/admin/AdminUsersClient";
import { userService } from "@/services/user.service";
import { hasAuthenticatedUser, hasRequiredRole } from "@/lib/session";

export default async function AdminUsersPage() {
    const session = await userService.getSession();

    if (!hasAuthenticatedUser(session.data)) {
        redirect("/signin");
    }

    if (!hasRequiredRole(session.data, ["ADMIN"])) {
        redirect("/dashboard");
    }

    return <AdminUsersClient />;
}
