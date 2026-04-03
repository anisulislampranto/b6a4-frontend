'use client';

import { useForm } from "@tanstack/react-form";
import AuthCard from "./AuthCard";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/ui/FormInput";
import { signUpFields } from "./config/authFields";
import { signUpSchema, SignUpValues } from "./validation/auth.schema";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Roles } from "@/constants/roles";

export default function SignUpForm() {
    const form = useForm({
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            role: Roles.CUSTOMER,
        },
        validators: {
            onChange: signUpSchema,
        },
        onSubmit: async ({ value }) => {
            const toastId = toast.loading('Creating user!');
            try {
                const { error } = await authClient.signUp.email({
                    name: value.name,
                    email: value.email,
                    password: value.password,
                    role: value.role,
                });

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

                <form.Field name="role">
                    {(field) => (
                        <div className="space-y-2">
                            <Label className="text-sm font-semibold text-foreground/90">Role</Label>
                            <div className="grid grid-cols-2 gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className={`h-11 bg-transparent ${field.state.value === Roles.CUSTOMER
                                        ? "border-emerald-600 text-emerald-700 hover:bg-transparent"
                                        : "border-border text-foreground hover:bg-accent/60"
                                        }`}
                                    onClick={() => field.handleChange(Roles.CUSTOMER)}
                                >
                                    Customer
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className={`h-11 bg-transparent ${field.state.value === Roles.SELLER
                                        ? "border-emerald-600 text-emerald-700 hover:bg-transparent"
                                        : "border-border text-foreground hover:bg-accent/60"
                                        }`}
                                    onClick={() => field.handleChange(Roles.SELLER)}
                                >
                                    Seller
                                </Button>
                            </div>
                        </div>
                    )}
                </form.Field>


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
