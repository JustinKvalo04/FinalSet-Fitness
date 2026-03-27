"use server";

import { createClient } from "@/utils/supabase/server";

export type Profile = {
    id: string;
    full_name: string | null;
    target_weight: number | null;
    activity_level: string | null;
    primary_goal: string | null;
    avatar_url: string | null;
    height: number | null;
    sex: string | null;
    dob: string | null;
    selected_program_split: string | null;
    subscription_status: string | null;
};

export async function getUserProfile(): Promise<Profile | null> {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return null;
    }

    const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    if (error) {
        console.error("Error fetching profile:", error);
        return null;
    }

    return profile as Profile;
}
