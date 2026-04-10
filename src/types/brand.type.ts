export interface Brand {
    id: string;
    name: string;
    description: string | null;
    logo: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}
