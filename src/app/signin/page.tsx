import SignInForm from "@/components/modules/authentication/SignInForm";
import { userService } from "@/services/user.service";
import { redirect } from "next/navigation";
import { hasAuthenticatedUser } from "@/lib/session";

export default async function SignInPage() {
    const session = await userService.getSession();
    if (hasAuthenticatedUser(session.data)) {
        redirect("/dashboard");
    }

    return (
        <SignInForm />
    );
}
