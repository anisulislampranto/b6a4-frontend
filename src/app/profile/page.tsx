"use client";

import { useEffect, useState } from "react";
import { profileService } from "@/services/profile.service";
import type { User } from "@/types/user.type";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { User as UserIcon, Mail, Shield, Calendar, Loader2 } from "lucide-react";
import { useForm } from "@tanstack/react-form";

export default function ProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { ok, data } = await profileService.getMyProfile();
                if (ok && data) {
                    setUser(data.data);
                }
            } catch (error) {
                toast.error("Failed to load profile");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const form = useForm({
        defaultValues: {
            name: user?.name || "",
            image: user?.image || "",
        },
        onSubmit: async ({ value }) => {
            try {
                const { ok, data } = await profileService.updateMyProfile(value);
                if (ok && data) {
                    setUser(data.data);
                    toast.success("Profile updated successfully");
                } else {
                    toast.error("Failed to update profile");
                }
            } catch (error) {
                toast.error("Something went wrong");
            }
        },
    });

    useEffect(() => {
        if (user) {
            form.reset({
                name: user.name,
                image: user.image || "",
            });
        }
    }, [user, form]);

    if (loading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="mx-auto max-w-7xl px-4 py-10 text-center">
                <h2 className="text-2xl font-bold text-red-600">Failed to load profile</h2>
            </div>
        );
    }

    return (
        <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
            <header className="mb-8">
                <h1 className="text-3xl font-black text-emerald-800 tracking-tight">Account Settings</h1>
                <p className="text-muted-foreground mt-1">Manage your personal information and preferences.</p>
            </header>

            <div className="grid gap-8 lg:grid-cols-3">
                {/* Profile Overview Card */}
                <Card className="overflow-hidden rounded-3xl border-border/70 bg-card/95 shadow-sm lg:col-span-1">
                    <CardContent className="p-0">
                        <div className="relative h-24 bg-gradient-to-r from-emerald-600 to-emerald-400" />
                        <div className="relative -mt-12 flex flex-col items-center px-6 pb-6 text-center">
                            <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-emerald-100 text-3xl font-bold text-emerald-700 shadow-sm">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <h2 className="mt-4 text-xl font-bold text-foreground">{user.name}</h2>
                            <span className="mt-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black uppercase tracking-wider text-emerald-700 border border-emerald-100">
                                {user.role}
                            </span>
                        </div>
                        <div className="border-t border-border/50 p-4 space-y-4">
                            <div className="flex items-center gap-3 text-sm">
                                <Mail className="h-4 w-4 text-emerald-600" />
                                <span className="text-muted-foreground truncate">{user.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Calendar className="h-4 w-4 text-emerald-600" />
                                <span className="text-muted-foreground">Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Edit Profile Form */}
                <Card className="rounded-3xl border-border/70 bg-card/95 shadow-sm lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold text-emerald-800">Edit Profile</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                form.handleSubmit();
                            }}
                            className="space-y-6"
                        >
                            <form.Field name="name">
                                {(field) => (
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-sm font-semibold">Full Name</Label>
                                        <div className="relative">
                                            <UserIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="name"
                                                className="pl-10 rounded-xl border-emerald-100 focus-visible:ring-emerald-500/20"
                                                value={field.state.value}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                )}
                            </form.Field>

                            <form.Field name="image">
                                {(field) => (
                                    <div className="space-y-2">
                                        <Label htmlFor="image" className="text-sm font-semibold">Profile Image URL (Optional)</Label>
                                        <Input
                                            id="image"
                                            placeholder="https://example.com/image.jpg"
                                            className="rounded-xl border-emerald-100 focus-visible:ring-emerald-500/20"
                                            value={field.state.value || ""}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                        />
                                    </div>
                                )}
                            </form.Field>

                            <div className="pt-4">
                                <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                                    {([canSubmit, isSubmitting]) => (
                                        <Button
                                            type="submit"
                                            disabled={!canSubmit || isSubmitting}
                                            className="w-full sm:w-auto px-8 h-11 rounded-xl bg-emerald-600 font-bold shadow-lg hover:bg-emerald-700 shadow-emerald-600/20 transition-all active:scale-[0.98]"
                                        >
                                            {isSubmitting ? (
                                                <span className="flex items-center gap-2">
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                    Saving...
                                                </span>
                                            ) : (
                                                "Save Changes"
                                            )}
                                        </Button>
                                    )}
                                </form.Subscribe>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
