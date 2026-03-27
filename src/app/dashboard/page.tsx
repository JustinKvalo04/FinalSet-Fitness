import { getUserProfile } from "@/lib/actions/profile";
import { getRecentWeights } from "@/lib/actions/weight";
import { getRecentWorkouts } from "@/lib/actions/workout";
import DashboardClient from "./DashboardClient";

export default async function DashboardOverview() {
    const profile = await getUserProfile();
    const recentWeights = await getRecentWeights();
    const recentWorkouts = await getRecentWorkouts();

    const firstName = profile?.full_name?.split(" ")[0] || "User";

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Welcome back, {firstName}!</h1>
                <p className="text-muted-foreground mt-2">Here's your fitness overview for today.</p>
            </div>

            <DashboardClient profile={profile} initialWeights={recentWeights} initialWorkouts={recentWorkouts} />
        </div>
    );
}
