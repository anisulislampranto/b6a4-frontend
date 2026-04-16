import { API_BASE_URL } from "./api-base";
import { requestJSONWithStatus } from "./http.service";
import type { Order, CreateOrderPayload } from "@/types/order.type";
import type { ApiResponse } from "@/types/api.type";

const createOrder = async (payload: CreateOrderPayload) => {
    return requestJSONWithStatus<ApiResponse<Order>>(`${API_BASE_URL}/orders`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
    });
};

const getMyOrders = async () => {
    return requestJSONWithStatus<ApiResponse<Order[]>>(`${API_BASE_URL}/orders/my`, {
        credentials: "include",
    });
};

const getOrderById = async (orderId: string) => {
    return requestJSONWithStatus<ApiResponse<Order>>(`${API_BASE_URL}/orders/${orderId}`, {
        credentials: "include",
    });
};

const getSellerOrders = async () => {
    return requestJSONWithStatus<ApiResponse<Order[]>>(`${API_BASE_URL}/orders/seller`, {
        credentials: "include",
    });
};

const updateSellerOrderStatus = async (orderId: string, status: Order["status"]) => {
    return requestJSONWithStatus<ApiResponse<Order>>(`${API_BASE_URL}/orders/seller/${orderId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ status }),
    });
};

export const orderService = {
    createOrder,
    getMyOrders,
    getOrderById,
    getSellerOrders,
    updateSellerOrderStatus,
};
