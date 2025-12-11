import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StatusType = 'Active' | 'Paused' | 'Completed' | 'In Progress' | 'Scheduled' | 'Doc generated' | 'No action' | 'Recording...';

interface StatusBadgeProps {
    status: StatusType | string;
    className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
    let variantStyles = "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"; // Default green-ish
    let dotColor = "bg-emerald-500";

    if (status === 'Paused' || status === 'Scheduled') {
        variantStyles = "bg-slate-500/10 text-slate-400 border-slate-500/20";
        dotColor = "bg-slate-400";
    } else if (status === 'In Progress' || status === 'Recording...') {
        variantStyles = "bg-blue-500/10 text-blue-400 border-blue-500/20";
        dotColor = "bg-blue-400 animate-pulse";
    } else if (status === 'Completed' || status === 'Doc generated' || status === 'Active') {
        variantStyles = "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
        dotColor = "bg-emerald-500";
    }

    return (
        <Badge variant="outline" className={cn("font-mono font-normal pl-2 pr-2.5 py-0.5 gap-1.5 backdrop-blur-sm", variantStyles, className)}>
            <div className={cn("h-1.5 w-1.5 rounded-full", dotColor)} />
            {status}
        </Badge>
    );
}
