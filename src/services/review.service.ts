import { API_BASE_URL } from "./api-base";
import { requestJSONWithStatus } from "./http.service";
import type { ApiListResponse, ApiResponse } from "@/types/api.type";
import type { CreateReviewPayload, Review } from "@/types/review.type";

const getMedicineReviews = async (medicineId: string) => {
    return requestJSONWithStatus<ApiListResponse<Review>>(`${API_BASE_URL}/reviews/medicine/${medicineId}`, {
        credentials: "include",
        cache: "no-store",
    });
};

const createReview = async (payload: CreateReviewPayload) => {
    return requestJSONWithStatus<ApiResponse<Review>>(`${API_BASE_URL}/reviews`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
    });
};

export const reviewService = {
    getMedicineReviews,
    createReview,
};
