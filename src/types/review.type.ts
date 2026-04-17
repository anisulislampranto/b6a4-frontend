export interface ReviewUser {
    id: string;
    name: string | null;
    image?: string | null;
}

export interface Review {
    id: string;
    rating: number;
    comment: string | null;
    medicineId: string;
    userId: string;
    createdAt: string;
    user: ReviewUser;
}

export interface CreateReviewPayload {
    medicineId: string;
    rating: number;
    comment?: string;
}
