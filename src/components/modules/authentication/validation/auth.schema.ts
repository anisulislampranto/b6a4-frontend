import { z } from "zod";

export const signInSchema = z.object({
    email: z.email("Enter a valid email"),
    password: z.string().min(6, "Password must be at least 8 characters"),
});

export const signUpSchema = z
    .object({
        name: z.string().min(2, "Name is too short"),
        email: z.email("Enter a valid email"),
        password: z.string().min(8, "At least 8 characters"),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ["confirmPassword"],
        message: "Passwords do not match",
    });

export type SignInValues = z.infer<typeof signInSchema>;
export type SignUpValues = z.infer<typeof signUpSchema>;