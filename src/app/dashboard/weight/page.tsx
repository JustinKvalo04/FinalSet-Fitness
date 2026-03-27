import { Plus } from "lucide-react";
import { getUserProfile } from "@/lib/actions/profile";
import { getRecentWeights } from "@/lib/actions/weight";
import WeightClient from "./WeightClient";

export default async function WeightTracker() {
    const profile = await getUserProfile();
    const recentWeights = await getRecentWeights();

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Weight Tracker</h1>
                    <p className="text-muted-foreground mt-2">Log your daily weight. We use a 7-day rolling average to smooth out fluctuations.</p>
                </div>
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-primary/90 transition-base shadow-lg shadow-primary/20">
                    <Plus className="w-4 h-4" /> Log Weight
                </button>
            </div>

            <WeightClient profile={profile} initialWeights={recentWeights} />
        </div>
    );
}
