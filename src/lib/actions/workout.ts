"use server";

import { createClient } from "@/utils/supabase/server";

export type WorkoutLog = {
    id: string;
    user_id: string;
    name: string;
    total_volume: number;
    prs_broken: number;
    logged_date: string;
    created_at: string;
};

export async function getRecentWorkouts(): Promise<WorkoutLog[]> {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
        .from("workout_logs")
        .select("*")
        .eq("user_id", user.id)
        .order("logged_date", { ascending: false })
        .limit(10);

    if (error) {
        console.error("Error fetching workouts:", error);
        return [];
    }

    return data as WorkoutLog[];
}

export async function logWorkout(name: string, volume: number, prs: number, dateStr: string) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("Not authenticated");

    const { error } = await supabase
        .from("workout_logs")
        .insert([{ user_id: user.id, name, total_volume: volume, prs_broken: prs, logged_date: dateStr }]);

    if (error) {
        console.error("Error logging workout:", error);
        throw new Error(error.message);
    }

    return true;
}
