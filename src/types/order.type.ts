import { MedicineWithRelations } from "./medicine.type";

export type OrderStatus = "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
export type PaymentStatus = "PENDING" | "PAID" | "FAILED";

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
}

export interface CartItem extends MedicineWithRelations {
    quantity: number;
}

export interface CreateOrderPayload {
    address: string;
    items: {
        medicineId: string;
        quantity: number;
    }[];
}
