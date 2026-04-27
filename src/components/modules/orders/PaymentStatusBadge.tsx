import { CreditCard } from "lucide-react";
import type { PaymentStatus } from "@/types/order.type";

const paymentStatusConfig: Record<PaymentStatus, { color: string; bg: string; border: string }> = {
    PENDING: { color: "text-amber-700", bg: "bg-amber-100/50", border: "border-amber-200" },
    PAID: { color: "text-emerald-700", bg: "bg-emerald-100/50", border: "border-emerald-200" },
    FAILED: { color: "text-red-700", bg: "bg-red-100/50", border: "border-red-200" },
};

interface PaymentStatusBadgeProps {
    status: PaymentStatus;
    className?: string;
    iconSize?: number;
}

export default function PaymentStatusBadge({ status, className = "", iconSize = 14 }: PaymentStatusBadgeProps) {
    const config = paymentStatusConfig[status] || paymentStatusConfig.PENDING;

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${config.bg} ${config.color} ${config.border} ${className}`}>
            <CreditCard style={{ width: iconSize, height: iconSize }} />
            Payment: {status}
        </span>
    );
}
