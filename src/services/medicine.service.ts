import { API_BASE_URL } from "./api-base";
import { requestJSON } from "./http.service";

export interface MedicineFilters {
    search?: string;
    category?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    page?: string;
    limit?: string;
}

interface MedicineListItem {
    id: string;
    name: string;
    price: number;
    image?: string | null;
}

interface MedicineListResponse {
    data: {
        items: MedicineListItem[];
        total: number;
        page: number;
        totalPages: number;
    };
    message?: string;
}

const getMedicines = async (filters: MedicineFilters) => {
    const params = new URLSearchParams(Object.entries(filters).filter(([, v]) => v));
    return requestJSON<MedicineListResponse>(`${API_BASE_URL}/medicines?${params.toString()}`, {
        cache: "no-store",
    });
};

export const medicineService = {
    getMedicines,
};
