import { API_BASE_URL } from "./api-base";
import { requestJSONWithStatus } from "./http.service";
import type { ApiListResponse, ApiMutationResponse } from "@/types/api.type";
import type { User } from "@/types/user.type";
import type { Order, OrderStatus } from "@/types/order.type";
import type { Category } from "@/types/category.type";
import type { Brand } from "@/types/brand.type";

type UserRole = User["role"];

const getAllUsers = async () => {
    return requestJSONWithStatus<ApiListResponse<User>>(`${API_BASE_URL}/users`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
    });
};

const updateUser = async (id: string, payload: Partial<User>) => {
    return requestJSONWithStatus<ApiMutationResponse<User>>(`${API_BASE_URL}/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
    });
};

const updateUserRole = async (id: string, role: UserRole) => {
    return updateUser(id, { role });
};

const getAllOrders = async () => {
    return requestJSONWithStatus<ApiListResponse<Order>>(`${API_BASE_URL}/orders/all`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
    });
};

const updateOrderStatus = async (id: string, status: OrderStatus) => {
    return requestJSONWithStatus<ApiMutationResponse<Order>>(`${API_BASE_URL}/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
    });
};

const getCategories = async () => {
    return requestJSONWithStatus<ApiListResponse<Category>>(`${API_BASE_URL}/category`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
    });
};

const createCategory = async (name: string, description?: string) => {
    return requestJSONWithStatus<ApiMutationResponse<Category>>(`${API_BASE_URL}/category`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, description }),
    });
};

const deleteCategory = async (id: string) => {
    return requestJSONWithStatus<ApiMutationResponse>(`${API_BASE_URL}/category/${id}`, {
        method: "DELETE",
        credentials: "include",
    });
};

const getBrands = async () => {
    return requestJSONWithStatus<ApiListResponse<Brand>>(`${API_BASE_URL}/brands`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
    });
};

const createBrand = async (name: string, description?: string, logo?: string) => {
    return requestJSONWithStatus<ApiMutationResponse<Brand>>(`${API_BASE_URL}/brands`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, description, logo }),
    });
};

const deleteBrand = async (id: string) => {
    return requestJSONWithStatus<ApiMutationResponse>(`${API_BASE_URL}/brands/${id}`, {
        method: "DELETE",
        credentials: "include",
    });
};

export const adminService = {
    getAllUsers,
    updateUser,
    updateUserRole,
    getAllOrders,
    updateOrderStatus,
    getCategories,
    createCategory,
    deleteCategory,
    getBrands,
    createBrand,
    deleteBrand,
};
