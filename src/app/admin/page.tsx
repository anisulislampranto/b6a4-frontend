import { redirect } from "next/navigation";
import AdminDashboardClient from "@/components/modules/admin/AdminDashboardClient";
import { userService } from "@/services/user.service";
import { hasAuthenticatedUser, hasRequiredRole } from "@/lib/session";

export default async function AdminDashboardPage() {
    const session = await userService.getSession();

    if (!hasAuthenticatedUser(session.data)) {
        redirect("/signin");
    }

    if (!hasRequiredRole(session.data, ["ADMIN"])) {
        redirect("/dashboard");
    }

    return <AdminDashboardClient />;
}
