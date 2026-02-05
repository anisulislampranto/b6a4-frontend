'use client';

import AuthCard from "./AuthCard";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/ui/FormInput";
import { useForm } from "@tanstack/react-form";
import { signInSchema, SignInValues } from "./validation/auth.schema";
import { signInFields } from "./config/authFields";

export default function SignInForm() {
    const form = useForm({
        defaultValues: {
            email: "",
            password: "",
        },
        validators: {
            onChange: signInSchema,
        },
        onSubmit: async ({ value }) => {
            console.log("SIGN IN", value);
        },
    });

    return (
        <div>
            <AuthCard
                title="Sign In"
                subtitle="Access your MediStore account"
                ctaText="Login"
                linkText="Don't have an account?"
                linkHref="/signup"
            >
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        form.handleSubmit();
                    }}
                    className="space-y-5"
                >
                    {signInFields.map((f) => (
                        <form.Field key={f.name} name={f.name as keyof SignInValues}>
                            {(field) => <FormInput {...f} field={field} />}
                        </form.Field>
                    ))}


                    <form.Subscribe
                        selector={(state) => [state.canSubmit, state.isSubmitting]}
                    >
                        {([canSubmit, isSubmitting]) => (
                            <Button
                                type="submit"
                                disabled={!canSubmit}
                                className="w-full h-11 bg-emerald-600 hover:bg-emerald-700"
                            >
                                {isSubmitting ? "Creating..." : "Sign Up"}
                            </Button>
                        )}
                    </form.Subscribe>
                </form>
            </AuthCard>
        </div>
    )
}
