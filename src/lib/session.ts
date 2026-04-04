export const hasAuthenticatedUser = (sessionPayload: unknown): boolean => {
    if (!sessionPayload || typeof sessionPayload !== "object") return false;

    const payload = sessionPayload as { data?: { user?: unknown }; user?: unknown };
    return Boolean(payload.user || payload.data?.user);
};
