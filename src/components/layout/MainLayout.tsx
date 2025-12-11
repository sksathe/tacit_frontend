"use client";

import { AppSidebar } from "./AppSidebar";
import { TopBar } from "./TopBar";
import { useSidebar } from "@/contexts/SidebarContext";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
    children: React.ReactNode;
    title?: string;
}

export function MainLayout({ children, title = "Dashboard" }: MainLayoutProps) {
    const { isCollapsed } = useSidebar();

    return (
        <div className="min-h-screen bg-black text-foreground font-sans flex selection:bg-primary/20 selection:text-primary">
            <AppSidebar />
            <div className={cn(
                "flex-1 flex flex-col min-h-screen relative z-10 transition-all duration-300 bg-black",
                isCollapsed ? "ml-16" : "ml-64"
            )}>
                <TopBar title={title} />
                <main className="flex-1 p-6 lg:p-8 overflow-y-auto bg-black">
                    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
