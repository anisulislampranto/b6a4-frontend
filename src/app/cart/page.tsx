import CartClient from "@/components/modules/cart/CartClient";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Your Cart - MediStore",
    description: "Review your medicines and prepare for checkout.",
};

export default function CartPage() {
    return <CartClient />;
}
