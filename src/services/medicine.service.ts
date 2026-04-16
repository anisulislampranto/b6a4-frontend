import type { MedicineWithRelations } from "@/types/medicine.type";
import type { ApiPaginatedResponse, ApiResponse } from "@/types/api.type";
import { API_BASE_URL } from "./api-base";
import { requestJSON, requestJSONWithStatus } from "./http.service";

export interface MedicineFilters {
    search?: string;
    category?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    page?: string;
    limit?: string;
}

const getMedicines = async (filters: MedicineFilters) => {
    const params = new URLSearchParams(Object.entries(filters).filter(([, v]) => v));
    return requestJSON<ApiPaginatedResponse<MedicineWithRelations>>(
        `${API_BASE_URL}/medicines?${params.toString()}`,
        { cache: "no-store" }
    );
};

const getMedicineById = async (id: string) => {
    return requestJSONWithStatus<ApiResponse<MedicineWithRelations>>(
        `${API_BASE_URL}/medicines/${id}`,
        { cache: "no-store" }
    );
};

export const medicineService = {
    getMedicines,
    getMedicineById,
};
