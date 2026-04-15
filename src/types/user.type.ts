export interface User {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "CUSTOMER" | "SELLER";
    image?: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface UpdateUserPayload {
    name?: string;
    image?: string | null;
}
