export interface ApiListResponse<T> {
    data: T[];
    message?: string;
}

export interface ApiPaginatedResponse<T> {
    data: {
        items: T[];
        total: number;
        page: number;
        totalPages: number;
    };
    message?: string;
}

export interface ApiMutationResponse<T = unknown> {
    data?: T;
    message?: string;
}
