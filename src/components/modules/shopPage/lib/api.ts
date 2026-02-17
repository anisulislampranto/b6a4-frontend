export interface MedicineFilters {
    search?: string;
    category?: string;
    brand?: string;
    minPrice?: string;
    maxPrice?: string;
    page?: string;
    limit?: string;
}

export async function fetchMedicines(filters: MedicineFilters) {
    const params = new URLSearchParams(Object.entries(filters).filter(([_, v]) => v));
    const res = await fetch(`http://localhost:5000/api/medicines?${params.toString()}`, { cache: "no-store" });
    return await res.json();
}
