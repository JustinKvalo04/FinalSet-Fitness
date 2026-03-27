import { getUserProfile } from "@/lib/actions/profile";
import MacroClient from "./MacroClient";

export default async function MacroCalculator() {
    const profile = await getUserProfile();

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Macro Calculator</h1>
                <p className="text-muted-foreground mt-2">Adjust your targets or let our algorithm handle it based on your trends.</p>
            </div>

            <MacroClient profile={profile} />
        </div>
    );
}
