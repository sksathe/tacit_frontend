import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    description?: string;
    trend?: string;
}

export function StatCard({ title, value, icon: Icon, description, trend }: StatCardProps) {
    return (
        <Card className="bg-card/80 backdrop-blur-sm border-border shadow-md hover:shadow-lg transition-all duration-300 hover:border-primary/30 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    {title}
                </CardTitle>
                <div className="p-2 rounded-lg bg-accent group-hover:bg-primary/10 transition-all duration-200">
                    <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-foreground tracking-tight">{value}</div>
                {(description || trend) && (
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                        {trend && (
                            <span className="text-primary bg-primary/10 px-1.5 py-0.5 rounded-md text-[10px] font-medium border border-primary/20">
                                {trend}
                            </span>
                        )}
                        <span className="opacity-70">{description}</span>
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
