"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/services/admin.service";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { User } from "@/types/user.type";
import { toast } from "sonner";

const roleOptions: User["role"][] = ["CUSTOMER", "SELLER", "ADMIN"];

export default function AdminUsersClient() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [savingUserId, setSavingUserId] = useState<string | null>(null);
    const [roleDraft, setRoleDraft] = useState<Record<string, User["role"]>>({});

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const { ok, data } = await adminService.getAllUsers();
                if (!ok) {
                    if (!cancelled) setError(data?.message || "Failed to load users.");
                    return;
                }

                if (!cancelled) {
                    const list = (data?.data || []) as User[];
                    setUsers(list);
                    setRoleDraft(
                        list.reduce<Record<string, User["role"]>>((acc, user) => {
                            acc[user.id] = user.role;
                            return acc;
                        }, {})
                    );
                }
            } catch {
                if (!cancelled) setError("Something went wrong while loading users.");
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        load();
        return () => {
            cancelled = true;
        };
    }, []);

    const onUpdateRole = async (user: User) => {
        const nextRole = roleDraft[user.id];
        if (!nextRole || nextRole === user.role) return;

        setSavingUserId(user.id);
        setError(null);
        try {
            const { ok, data } = await adminService.updateUserRole(user.id, nextRole);
            if (!ok) {
                setError(data?.message || "Failed to update role.");
                return;
            }

            setUsers((prev) =>
                prev.map((item) => (item.id === user.id ? { ...item, role: nextRole } : item))
            );
            toast.success("User role updated successfully.");
        } catch {
            setError("Something went wrong while updating user role.");
        } finally {
            setSavingUserId(null);
        }
    };

    return (
        <main className="mx-auto min-h-[70vh] max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <section className="mb-7 rounded-3xl border border-border/70 bg-card/85 px-6 py-7 sm:px-8">
                <h1 className="text-3xl font-bold text-emerald-700 sm:text-4xl">Admin Users</h1>
                <p className="mt-2 text-sm text-muted-foreground">View all users and manage role assignments.</p>
            </section>

            {loading && (
                <div className="grid gap-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Card key={i} className="rounded-2xl border-border/70 bg-card/95">
                            <CardContent className="grid gap-4 p-6 md:grid-cols-[1.4fr_1fr_auto] md:items-end">
                                <div className="space-y-2">
                                    <Skeleton className="h-6 w-3/4" />
                                    <Skeleton className="h-4 w-1/2" />
                                    <Skeleton className="h-3 w-1/3" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-3 w-12" />
                                    <Skeleton className="h-11 w-full rounded-xl" />
                                </div>
                                <Skeleton className="h-10 w-32 rounded-lg" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {error && (
                <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-red-600">
                    {error}
                </div>
            )}

            {!loading && users.length === 0 && !error && (
                <Card className="rounded-2xl border-border/70 bg-card/95">
                    <CardContent className="p-6 text-center text-muted-foreground">No users found.</CardContent>
                </Card>
            )}

            {!loading && users.length > 0 && (
                <section className="grid gap-4">
                    {users.map((user) => (
                        <Card key={user.id} className="rounded-2xl border-border/70 bg-card/95">
                            <CardContent className="grid gap-4 p-6 md:grid-cols-[1.4fr_1fr_auto] md:items-end">
                                <div className="space-y-1">
                                    <p className="text-base font-semibold text-foreground">{user.name || "Unnamed User"}</p>
                                    <p className="text-sm text-muted-foreground">{user.email}</p>
                                    <p className="text-xs text-muted-foreground">
                                        Joined: {new Date(user.createdAt).toLocaleDateString()}
                                    </p>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Role
                                    </label>
                                    <select
                                        value={roleDraft[user.id] || user.role}
                                        onChange={(e) =>
                                            setRoleDraft((prev) => ({
                                                ...prev,
                                                [user.id]: e.target.value as User["role"],
                                            }))
                                        }
                                        className="h-11 w-full rounded-xl border border-border bg-card px-3.5 text-sm outline-none transition focus-visible:ring-4 focus-visible:ring-ring/30"
                                    >
                                        {roleOptions.map((role) => (
                                            <option key={role} value={role}>
                                                {role}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <Button
                                    className="bg-emerald-600 hover:bg-emerald-700"
                                    onClick={() => onUpdateRole(user)}
                                    disabled={savingUserId === user.id || roleDraft[user.id] === user.role}
                                >
                                    {savingUserId === user.id ? "Saving..." : "Update Role"}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </section>
            )}
        </main>
    );
}
