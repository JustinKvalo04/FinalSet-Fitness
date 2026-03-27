"use server";

import { createClient } from "@/utils/supabase/server";

export type WeightLog = {
    id: string;
    user_id: string;
    weight: number;
    logged_date: string;
    created_at: string;
};

export async function getRecentWeights(): Promise<WeightLog[]> {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
        .from("weight_logs")
        .select("*")
        .eq("user_id", user.id)
        .order("logged_date", { ascending: false })
        .limit(30);

    if (error) {
        console.error("Error fetching weight logs:", error);
        return [];
    }

    return data as WeightLog[];
}

export async function logWeight(weight: number, dateStr: string) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) throw new Error("Not authenticated");

    const { error } = await supabase
        .from("weight_logs")
        .upsert({ user_id: user.id, weight, logged_date: dateStr })
        .select()
        .single();

    if (error) {
        console.error("Error logging weight:", error);
        throw new Error(error.message);
    }

    return true;
}
