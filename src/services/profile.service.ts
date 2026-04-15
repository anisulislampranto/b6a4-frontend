import { API_BASE_URL } from "./api-base";
import { requestJSONWithStatus } from "./http.service";
import type { ApiResponse } from "@/types/api.type";
import type { User, UpdateUserPayload } from "@/types/user.type";

const getMyProfile = async () => {
    return requestJSONWithStatus<ApiResponse<User>>(`${API_BASE_URL}/users/me`);
};

const updateMyProfile = async (payload: UpdateUserPayload) => {
    return requestJSONWithStatus<ApiResponse<User>>(`${API_BASE_URL}/users/me`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });
};

export const profileService = {
    getMyProfile,
    updateMyProfile,
};
