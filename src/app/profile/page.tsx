import ProfileClient from "@/components/modules/profile/ProfileClient";
import { hasAuthenticatedUser } from "@/lib/session";
import { userService } from "@/services/user.service";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
    const session = await userService.getSession();

    if (!hasAuthenticatedUser(session.data)) {
        redirect("/signin");
    }

    return <ProfileClient />;
}
