'use client';

import { useForm } from "@tanstack/react-form";
import AuthCard from "./AuthCard";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/ui/FormInput";
import { signUpFields } from "./config/authFields";
import { signUpSchema, SignUpValues } from "./validation/auth.schema";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export default function SignUpForm() {
    const form = useForm({
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
        validators: {
            onChange: signUpSchema,
        },
        onSubmit: async ({ value }) => {
            const toastId = toast.loading('Creating user!');
            try {
                const { data, error } = await authClient.signUp.email(value);

                if (error) {
                    toast.error(error.message, { id: toastId })
                    return;
                }

                toast.success('User Created Successfully!', { id: toastId })
            } catch (err) {
                toast.error('Something went wrong please try again!', { id: toastId })
            }
        }
    });

    return (
        <AuthCard
            title="Sign Up"
            subtitle="Create your MediStore account"
            ctaText="Sign Up"
            linkText="Already have an account?"
            linkHref="/signin"
        >
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                }}
                className="space-y-5"
            >
                {signUpFields.map((f) => (
                    <form.Field key={f.name} name={f.name as keyof SignUpValues}>
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
    );
}
