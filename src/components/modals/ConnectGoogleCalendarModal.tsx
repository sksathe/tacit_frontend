"use client";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle2 } from "lucide-react";

interface ConnectGoogleCalendarModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConnect: () => void;
    isConnected: boolean;
}

export function ConnectGoogleCalendarModal({
    open,
    onOpenChange,
    onConnect,
    isConnected,
}: ConnectGoogleCalendarModalProps) {
    const handleConnect = () => {
        // TODO: Implement Google Calendar OAuth flow
        console.log("Connecting to Google Calendar...");
        onConnect();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                            <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <DialogTitle>
                            {isConnected ? "Google Calendar Connected" : "Connect Google Calendar"}
                        </DialogTitle>
                    </div>
                    <DialogDescription>
                        {isConnected
                            ? "Your Google Calendar is connected. You can import meetings and assign agents to them."
                            : "Connect your Google Calendar to automatically import meetings and assign AI agents to join them."}
                    </DialogDescription>
                </DialogHeader>

                {isConnected ? (
                    <div className="py-4">
                        <div className="flex items-center gap-3 p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                            <CheckCircle2 className="h-5 w-5 text-green-400" />
                            <div>
                                <p className="text-sm font-medium text-foreground">Connected</p>
                                <p className="text-xs text-muted-foreground">
                                    Your Google Calendar is synced
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="py-4 space-y-4">
                        <div className="space-y-2">
                            <h4 className="text-sm font-semibold">What you can do:</h4>
                            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                                <li>Import meetings from your Google Calendar</li>
                                <li>Assign AI agents to join your meetings</li>
                                <li>Add context to help agents prepare</li>
                                <li>Automatically sync new meetings</li>
                            </ul>
                        </div>
                    </div>
                )}

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        {isConnected ? "Close" : "Cancel"}
                    </Button>
                    {!isConnected && (
                        <Button
                            type="button"
                            onClick={handleConnect}
                            className="shadow-[0_0_20px_-5px_rgba(16,185,129,0.4)]"
                        >
                            Connect Google Calendar
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}




