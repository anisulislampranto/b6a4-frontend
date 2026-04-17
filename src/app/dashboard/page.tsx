import DashboardClient from "@/components/modules/dashboard/DashboardClient";
import { hasAuthenticatedUser } from "@/lib/session";
import { userService } from "@/services/user.service";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    const session = await userService.getSession();

    if (!hasAuthenticatedUser(session.data)) {
        redirect("/signin");
    }

    return <DashboardClient />;
}
