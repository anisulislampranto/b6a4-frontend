import CheckoutClient from "@/components/modules/checkout/CheckoutClient";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Checkout - MediStore",
    description: "Complete your purchase and get your medicines delivered.",
};

export default function CheckoutPage() {
    return <CheckoutClient />;
}
