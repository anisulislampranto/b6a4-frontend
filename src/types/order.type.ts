import { MedicineWithRelations } from "./medicine.type";

export const ORDER_STATUS_VALUES = [
    "PENDING",
    "CONFIRMED",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
] as const;

export const PAYMENT_STATUS_VALUES = [
    "PENDING",
    "PAID",
    "FAILED",
] as const;

export type OrderStatus = (typeof ORDER_STATUS_VALUES)[number];
export type PaymentStatus = (typeof PAYMENT_STATUS_VALUES)[number];

export interface OrderItem {
    id: string;
    medicineId: string;
    medicine: Partial<MedicineWithRelations>;
    quantity: number;
    price: number;
}

export interface Order {
    id: string;
    userId: string;
    totalAmount: number;
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    address: string;
    items: OrderItem[];
    createdAt: string;
    updatedAt: string;
    payment_url?: string;
}

export interface CartItem extends MedicineWithRelations {
    quantity: number;
}

export interface CreateOrderPayload {
    address: string;
    paymentMethod: string;
    items: {
        medicineId: string;
        quantity: number;
    }[];
}
