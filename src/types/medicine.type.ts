import type { Brand } from "./brand.type";
import type { Category } from "./category.type";

export interface Medicine {
    id: string;
    name: string;
    description: string | null;
    price: number;
    stock: number;
    image: string | null;
    isActive: boolean;
    categoryId: string;
    sellerId: string;
    brandId: string;
    createdAt: string;
    updatedAt: string;
}

export interface MedicineWithRelations extends Medicine {
    category: Category;
    brand: Brand;
}
