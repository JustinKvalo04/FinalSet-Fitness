"use client";

import { Activity, LayoutDashboard, Calculator, TrendingDown, Dumbbell, CreditCard, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import clsx from "clsx";
import { createClient } from "@/utils/supabase/client";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    const navItems = [
        { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
        { name: "Macro Calculator", href: "/dashboard/macros", icon: Calculator },
        { name: "Weight Tracker", href: "/dashboard/weight", icon: TrendingDown },
        { name: "Strength Logs", href: "/dashboard/workouts", icon: Dumbbell },
        { name: "Subscription", href: "/dashboard/billing", icon: CreditCard },
    ];

    return (
        <div className="min-h-screen bg-background flex flex-col md:flex-row">
            {/* Sidebar Navigation */}
            <aside className="w-full md:w-64 border-r border-border bg-card/50 backdrop-blur-md flex flex-col md:sticky md:top-0 md:h-screen">
                <div className="p-6">
                    <Link href="/" className="flex items-center gap-2 font-bold text-2xl tracking-tighter">
                        <Activity className="h-6 w-6 text-primary" />
                        <span>Macro<span className="text-primary">Track</span></span>
                    </Link>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto w-full flex md:flex-col gap-2 md:gap-1 overflow-x-auto md:overflow-x-hidden">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={clsx(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-base whitespace-nowrap",
                                    isActive
                                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                                )}
                            >
                                <item.icon className="w-5 h-5" />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 mt-auto hidden md:block">
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground w-full transition-base"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto">
                <div className="max-w-6xl mx-auto p-6 md:p-10">
                    {children}
                </div>
            </main>
        </div>
    );
}
