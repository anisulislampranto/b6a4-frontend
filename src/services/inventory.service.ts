import type { MedicineWithRelations } from "@/types/medicine.type";
import type { Category } from "@/types/category.type";
import type { Brand } from "@/types/brand.type";
import type { ApiListResponse, ApiMutationResponse } from "@/types/api.type";
import { API_BASE_URL } from "./api-base";
import { requestJSON, requestJSONWithStatus } from "./http.service";

export interface CreateMedicinePayload {
    name: string;
    description?: string;
    price: number;
    stock: number;
    image?: string;
    categoryId: string;
    brandId: string;
}

export type OptionItem = Pick<Category | Brand, "id" | "name">;

const getCategories = async () => {
    return requestJSON<ApiListResponse<Category>>(`${API_BASE_URL}/category`, { cache: "no-store" });
};

const getBrands = async () => {
    return requestJSON<ApiListResponse<Brand>>(`${API_BASE_URL}/brands`, { cache: "no-store" });
};

const createCategory = async (name: string) => {
    return requestJSONWithStatus<ApiMutationResponse<Category>>(`${API_BASE_URL}/category`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name }),
    });
};

const createBrand = async (name: string) => {
    return requestJSONWithStatus<ApiMutationResponse<Brand>>(`${API_BASE_URL}/brands`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name }),
    });
};

const createMedicine = async (payload: CreateMedicinePayload) => {
    return requestJSONWithStatus<ApiMutationResponse>(`${API_BASE_URL}/medicines`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
    });
};

const getMyMedicines = async () => {
    return requestJSONWithStatus<ApiListResponse<MedicineWithRelations>>(`${API_BASE_URL}/medicines/my`, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
    });
};

const updateMedicine = async (id: string, payload: Partial<CreateMedicinePayload>) => {
    return requestJSONWithStatus<ApiMutationResponse>(`${API_BASE_URL}/medicines/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
    });
};

export const inventoryService = {
    getCategories,
    getBrands,
    createCategory,
    createBrand,
    createMedicine,
    getMyMedicines,
    updateMedicine,
};
