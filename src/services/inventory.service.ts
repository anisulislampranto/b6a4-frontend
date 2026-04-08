import { API_BASE_URL } from "./api-base";

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

const getCategories = async () => {
    const res = await fetch(`${API_BASE_URL}/category`, { cache: "no-store" });
    return res.json();
};

const getBrands = async () => {
    const res = await fetch(`${API_BASE_URL}/brands`, { cache: "no-store" });
    return res.json();
};

const createCategory = async (name: string) => {
    const res = await fetch(`${API_BASE_URL}/category`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name }),
    });
    return res.json().then((data) => ({ ok: res.ok, data }));
};

const createBrand = async (name: string) => {
    const res = await fetch(`${API_BASE_URL}/brands`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name }),
    });
    return res.json().then((data) => ({ ok: res.ok, data }));
};

const createMedicine = async (payload: CreateMedicinePayload) => {
    const res = await fetch(`${API_BASE_URL}/medicines`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
    });
    return res.json().then((data) => ({ ok: res.ok, data }));
};

export const inventoryService = {
    getCategories,
    getBrands,
    createCategory,
    createBrand,
    createMedicine,
};
