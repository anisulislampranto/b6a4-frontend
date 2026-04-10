export interface Category {
    id: string;
    name: string;
    description: string | null;
    isActive: boolean;
    parentId: string | null;
    createdAt: string;
    updatedAt: string;
}
