import type { Metadata } from "next";
import OrderDetailsClient from "@/components/modules/orders/OrderDetailsClient";

export const metadata: Metadata = {
    title: "Order Details - MediStore",
    description: "View detailed order information and track order progress.",
};

interface OrderDetailsPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function OrderDetailsPage({ params }: OrderDetailsPageProps) {
    const { id } = await params;
    return <OrderDetailsClient orderId={id} />;
}
