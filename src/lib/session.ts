export type AppRole = "CUSTOMER" | "SELLER" | "ADMIN";

interface SessionLikeUser {
    role?: string | null;
}

interface SessionLikePayload {
    user?: SessionLikeUser | null;
    data?: {
        user?: SessionLikeUser | null;
    } | null;
}

export const hasAuthenticatedUser = (sessionPayload: unknown): boolean => {
    if (!sessionPayload || typeof sessionPayload !== "object") return false;

    const payload = sessionPayload as { data?: { user?: unknown }; user?: unknown };
    return Boolean(payload.user || payload.data?.user);
};

export const getUserRoleFromSessionPayload = (sessionPayload: unknown): AppRole | null => {
    if (!sessionPayload || typeof sessionPayload !== "object") return null;

    const payload = sessionPayload as SessionLikePayload;
    const rawRole = payload.user?.role ?? payload.data?.user?.role;
    if (!rawRole) return null;

    const normalizedRole = rawRole.toUpperCase();
    if (normalizedRole === "SELLER" || normalizedRole === "ADMIN" || normalizedRole === "CUSTOMER") {
        return normalizedRole;
    }

    return null;
};

export const hasRequiredRole = (sessionPayload: unknown, roles: AppRole[]): boolean => {
    const role = getUserRoleFromSessionPayload(sessionPayload);
    return role ? roles.includes(role) : false;
};
