import { z } from "zod";

export const checkoutSchema = z.object({
    address: z.string().min(10, "Address must be at least 10 characters long"),
    paymentMethod: z.enum(["COD", "SSL"]),
});

export type CheckoutValues = z.infer<typeof checkoutSchema>;
