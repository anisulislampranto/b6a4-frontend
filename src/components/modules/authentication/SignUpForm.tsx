import { Button } from "@/components/ui/button";
import AuthCard from "./AuthCard";
import FormInput from "@/components/ui/FormInput";
import { signUpFields } from "./config/authFields";

export default function SignUpForm() {
    return (
        <div>
            <AuthCard
                title="Sign Up"
                subtitle="Create your MediStore account"
                ctaText="Sign Up"
                linkText="Already have an account?"
                linkHref="/signin"
            >
                {signUpFields.map((field) => (
                    <FormInput key={field.name} {...field} />
                ))}

                <Button className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/30">
                    Sign Up
                </Button>
            </AuthCard>
        </div>
    )
}
