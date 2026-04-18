import ShopPageClient from "@/components/modules/shopPage/ShopPageClient";


export const revalidate = 60; // ISR (rebuild every 60s)

async function getMedicines() {
    const res = await fetch(`${process.env.API_URL}/medicines`, {
        next: { revalidate: 60 },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch medicines");
    }

    return res.json();
}

async function getFilters() {
    const [categoriesRes, brandsRes] = await Promise.all([
        fetch(`${process.env.API_URL}/categories`, { next: { revalidate: 3600 } }),
        fetch(`${process.env.API_URL}/brands`, { next: { revalidate: 3600 } }),
    ]);

    return {
        categories: await categoriesRes.json(),
        brands: await brandsRes.json(),
    };
}

export default async function ShopPage() {
    const [medicines, filters] = await Promise.all([
        getMedicines(),
        getFilters(),
    ]);

    return (
        <ShopPageClient
            initialMedicines={medicines?.data?.items || []}
            initialCategories={filters.categories?.data || []}
            initialBrands={filters.brands?.data || []}
        />
    );
}