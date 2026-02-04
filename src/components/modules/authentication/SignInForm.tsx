import AuthCard from "./AuthCard";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/ui/FormInput";
import { signInFields } from "./config/authFields";

export default function SignInForm() {
    return (
        <div>
            <AuthCard
                title="Sign In"
                subtitle="Access your MediStore account"
                ctaText="Login"
                linkText="Don't have an account?"
                linkHref="/signup"
            >
                {signInFields.map((field) => (
                    <FormInput key={field.name} {...field} />
                ))}

                <Button className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/30">
                    Login
                </Button>
            </AuthCard>
        </div>
    )
}
