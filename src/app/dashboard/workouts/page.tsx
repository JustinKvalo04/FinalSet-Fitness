import { Plus } from "lucide-react";
import { getUserProfile } from "@/lib/actions/profile";
import { getRecentWorkouts } from "@/lib/actions/workout";
import WorkoutsClient from "./WorkoutsClient";

export default async function WorkoutsPage() {
    const profile = await getUserProfile();
    const recentWorkouts = await getRecentWorkouts();

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Strength Logs</h1>
                    <p className="text-muted-foreground mt-2">Track your progressive overload. We use this data to adjust your macro targets.</p>
                </div>
                <button className="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-primary/90 transition-base shadow-lg shadow-primary/20">
                    <Plus className="w-4 h-4" /> New Routine
                </button>
            </div>

            <WorkoutsClient profile={profile} initialWorkouts={recentWorkouts} />
        </div>
    );
}
