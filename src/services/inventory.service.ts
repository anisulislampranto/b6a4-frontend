import { API_BASE_URL } from "./api-base";
import { requestJSON, requestJSONWithStatus } from "./http.service";

export interface OptionItem {
    id: string;
    name: string;
}

export interface CreateMedicinePayload {
    name: string;
    description?: string;
    price: number;
    stock: number;
    image?: string;
    categoryId: string;
    brandId: string;
}

interface ListResponse<T> {
    data: T[];
    message?: string;
}

interface MutateResponse<T> {
    data?: T;
    message?: string;
}

const getCategories = async () => {
    return requestJSON<ListResponse<OptionItem>>(`${API_BASE_URL}/category`, { cache: "no-store" });
};

const getBrands = async () => {
    return requestJSON<ListResponse<OptionItem>>(`${API_BASE_URL}/brands`, { cache: "no-store" });
};

const createCategory = async (name: string) => {
    return requestJSONWithStatus<MutateResponse<OptionItem>>(`${API_BASE_URL}/category`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name }),
    });
};

const createBrand = async (name: string) => {
    return requestJSONWithStatus<MutateResponse<OptionItem>>(`${API_BASE_URL}/brands`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name }),
    });
};

const createMedicine = async (payload: CreateMedicinePayload) => {
    return requestJSONWithStatus<MutateResponse<unknown>>(`${API_BASE_URL}/medicines`, {
        method: "POST",
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
};
