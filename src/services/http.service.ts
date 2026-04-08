export interface HttpResult<T> {
    ok: boolean;
    status: number;
    data: T;
}

export const requestJSON = async <T>(url: string, init?: RequestInit): Promise<T> => {
    const res = await fetch(url, init);
    return (await res.json()) as T;
};

export const requestJSONWithStatus = async <T>(
    url: string,
    init?: RequestInit
): Promise<HttpResult<T>> => {
    const res = await fetch(url, init);
    const data = (await res.json()) as T;

    return {
        ok: res.ok,
        status: res.status,
        data,
    };
};
