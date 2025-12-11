"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Bot, CheckCircle2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { agents } from "@/data/mockData";
import { ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Meeting } from "@/types";

interface AssignAgentsToMeetingModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    meeting: Meeting | null;
    onAssign: (agentIds: string[], context?: string) => void;
}

export function AssignAgentsToMeetingModal({
    open,
    onOpenChange,
    meeting,
    onAssign,
}: AssignAgentsToMeetingModalProps) {
    const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
    const [context, setContext] = useState("");
    const [isAgentDropdownOpen, setIsAgentDropdownOpen] = useState(false);

    const activeAgents = agents.filter(a => a.status === 'Active');

    useEffect(() => {
        if (meeting) {
            // Initialize with first existing agent if any
            setSelectedAgentId(meeting.agentIds && meeting.agentIds.length > 0 ? meeting.agentIds[0] : null);
            setContext(meeting.description || "");
        }
    }, [meeting]);

    const handleAssign = () => {
        if (selectedAgentId && meeting) {
            onAssign([selectedAgentId], context);
            onOpenChange(false);
        }
    };

    const handleClose = () => {
        if (meeting) {
            setSelectedAgentId(meeting.agentIds && meeting.agentIds.length > 0 ? meeting.agentIds[0] : null);
            setContext(meeting.description || "");
        }
        onOpenChange(false);
    };

    if (!meeting) return null;

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                            <Bot className="h-5 w-5 text-primary" />
                        </div>
                        <DialogTitle>Assign Agent to Meeting</DialogTitle>
                    </div>
                    <DialogDescription>
                        Select an AI agent to join "{meeting.title}" and provide context.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Select Agent</Label>
                        <DropdownMenu open={isAgentDropdownOpen} onOpenChange={setIsAgentDropdownOpen}>
                            <DropdownMenuTrigger asChild>
                                <button
                                    type="button"
                                    className="flex items-center justify-between w-full rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm transition-all duration-200 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:border-primary/50"
                                >
                                    <div className="flex items-center gap-2">
                                        <Bot className="h-4 w-4 text-muted-foreground" />
                                        <span className={selectedAgentId ? "text-foreground" : "text-muted-foreground"}>
                                            {selectedAgentId
                                                ? activeAgents.find(a => a.id === selectedAgentId)?.name || "Selected"
                                                : "Choose an agent..."}
                                        </span>
                                    </div>
                                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-full">
                                <DropdownMenuLabel>Available Agents</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {activeAgents.map((agent) => {
                                    const isSelected = selectedAgentId === agent.id;
                                    return (
                                        <DropdownMenuItem
                                            key={agent.id}
                                            onClick={() => {
                                                setSelectedAgentId(agent.id);
                                                setIsAgentDropdownOpen(false);
                                            }}
                                            className="flex items-start gap-2"
                                        >
                                            {isSelected && (
                                                <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary" />
                                            )}
                                            {!isSelected && (
                                                <div className="w-4 h-4 mt-0.5" />
                                            )}
                                            <Bot className="h-4 w-4 mt-0.5 text-primary" />
                                            <div className="flex flex-col">
                                                <span className="font-medium">{agent.name}</span>
                                                <span className="text-xs text-muted-foreground">{agent.persona}</span>
                                            </div>
                                        </DropdownMenuItem>
                                    );
                                })}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        {selectedAgentId && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                <Badge variant="outline" className="text-xs">
                                    {activeAgents.find(a => a.id === selectedAgentId)?.name}
                                </Badge>
                            </div>
                        )}
                        {!selectedAgentId && (
                            <p className="text-xs text-muted-foreground">
                                Select an agent to assign to this meeting.
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="meeting-context">Meeting Context</Label>
                        <Textarea
                            id="meeting-context"
                            placeholder="Provide context about this meeting. What is the purpose? Who are the participants? What topics will be discussed?"
                            value={context}
                            onChange={(e) => setContext(e.target.value)}
                            rows={4}
                            className="text-sm"
                        />
                        <p className="text-xs text-muted-foreground">
                            This context will help the agents understand the meeting's purpose and prepare accordingly.
                        </p>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={handleAssign}
                        className="shadow-[0_0_20px_-5px_rgba(16,185,129,0.4)]"
                        disabled={!selectedAgentId}
                    >
                        Assign Agent
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

