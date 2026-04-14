import OrdersClient from "@/components/modules/orders/OrdersClient";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "My Orders - MediStore",
    description: "Track your medicine orders and viewing your purchase history.",
};

export default function OrdersPage() {
    return <OrdersClient />;
}
