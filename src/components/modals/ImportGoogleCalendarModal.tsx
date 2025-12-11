"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Bot, CheckCircle2 } from "lucide-react";
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
import { cn } from "@/lib/utils";

interface GoogleCalendarEvent {
    id: string;
    title: string;
    start: string;
    end: string;
    link?: string;
    description?: string;
}

interface ImportGoogleCalendarModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    events: GoogleCalendarEvent[];
    onImport: (importedMeetings: {
        eventId: string;
        agentIds: string[];
        context: string;
    }[]) => void;
}

export function ImportGoogleCalendarModal({
    open,
    onOpenChange,
    events,
    onImport,
}: ImportGoogleCalendarModalProps) {
    const [selectedEvents, setSelectedEvents] = useState<Set<string>>(new Set());
    const [eventAgents, setEventAgents] = useState<Record<string, string | null>>({});
    const [eventContexts, setEventContexts] = useState<Record<string, string>>({});
    const [isAgentDropdownOpen, setIsAgentDropdownOpen] = useState<Record<string, boolean>>({});

    const activeAgents = agents.filter(a => a.status === 'Active');

    const toggleEventSelection = (eventId: string) => {
        const newSelected = new Set(selectedEvents);
        if (newSelected.has(eventId)) {
            newSelected.delete(eventId);
            // Clear agents and context when deselecting
            const newAgents = { ...eventAgents };
            const newContexts = { ...eventContexts };
            delete newAgents[eventId];
            delete newContexts[eventId];
            setEventAgents(newAgents);
            setEventContexts(newContexts);
        } else {
            newSelected.add(eventId);
        }
        setSelectedEvents(newSelected);
    };

    const handleContextChange = (eventId: string, context: string) => {
        setEventContexts({ ...eventContexts, [eventId]: context });
    };

    const handleImport = () => {
        const importedMeetings = Array.from(selectedEvents).map(eventId => ({
            eventId,
            agentIds: eventAgents[eventId] ? [eventAgents[eventId]!] : [],
            context: eventContexts[eventId] || '',
        }));
        onImport(importedMeetings);
        // Reset state
        setSelectedEvents(new Set());
        setEventAgents({});
        setEventContexts({});
        onOpenChange(false);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit"
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                            <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <DialogTitle>Import from Google Calendar</DialogTitle>
                    </div>
                    <DialogDescription>
                        Select meetings to import and assign an agent with context for each meeting.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {events.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-20" />
                            <p>No upcoming events found in your Google Calendar.</p>
                        </div>
                    ) : (
                        events.map((event) => {
                            const isSelected = selectedEvents.has(event.id);
                            const eventAgentId = eventAgents[event.id] || null;
                            const eventContext = eventContexts[event.id] || '';

                            return (
                                <div
                                    key={event.id}
                                    className={cn(
                                        "border rounded-lg p-4 transition-all",
                                        isSelected
                                            ? "border-primary/50 bg-primary/5"
                                            : "border-white/10 bg-white/[0.02] hover:border-white/20"
                                    )}
                                >
                                    <div className="flex items-start gap-4">
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => toggleEventSelection(event.id)}
                                            className="mt-1 w-4 h-4 rounded border-white/20 bg-white/[0.03] text-primary focus:ring-primary/50"
                                        />
                                        <div className="flex-1 space-y-3">
                                            <div>
                                                <h4 className="font-semibold text-foreground mb-1">
                                                    {event.title}
                                                </h4>
                                                <p className="text-sm text-muted-foreground">
                                                    {formatDate(event.start)} - {formatDate(event.end)}
                                                </p>
                                                {event.description && (
                                                    <p className="text-sm text-muted-foreground mt-2">
                                                        {event.description}
                                                    </p>
                                                )}
                                            </div>

                                            {isSelected && (
                                                <>
                                                    <div className="space-y-2">
                                                        <Label className="text-sm">Select Agent</Label>
                                                        <DropdownMenu
                                                            open={isAgentDropdownOpen[event.id] || false}
                                                            onOpenChange={(open) =>
                                                                setIsAgentDropdownOpen({
                                                                    ...isAgentDropdownOpen,
                                                                    [event.id]: open,
                                                                })
                                                            }
                                                        >
                                                            <DropdownMenuTrigger asChild>
                                                                <button
                                                                    type="button"
                                                                    className="flex items-center justify-between w-full rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm transition-all duration-200 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:border-primary/50"
                                                                >
                                                                    <div className="flex items-center gap-2">
                                                                        <Bot className="h-4 w-4 text-muted-foreground" />
                                                                        <span className={eventAgentId ? "text-foreground" : "text-muted-foreground"}>
                                                                            {eventAgentId
                                                                                ? activeAgents.find(a => a.id === eventAgentId)?.name || "Selected"
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
                                                                    const isSelected = eventAgentId === agent.id;
                                                                    return (
                                                                        <DropdownMenuItem
                                                                            key={agent.id}
                                                                            onClick={() => {
                                                                                setEventAgents({ ...eventAgents, [event.id]: agent.id });
                                                                                setIsAgentDropdownOpen({
                                                                                    ...isAgentDropdownOpen,
                                                                                    [event.id]: false,
                                                                                });
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
                                                        {eventAgentId && (
                                                            <div className="flex flex-wrap gap-2 mt-2">
                                                                <Badge variant="outline" className="text-xs">
                                                                    {activeAgents.find(a => a.id === eventAgentId)?.name}
                                                                </Badge>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label htmlFor={`context-${event.id}`} className="text-sm">
                                                            Meeting Context
                                                        </Label>
                                                        <Textarea
                                                            id={`context-${event.id}`}
                                                            placeholder="Provide context about this meeting. What is the purpose? Who are the participants? What topics will be discussed?"
                                                            value={eventContext}
                                                            onChange={(e) => handleContextChange(event.id, e.target.value)}
                                                            rows={3}
                                                            className="text-sm"
                                                        />
                                                        <p className="text-xs text-muted-foreground">
                                                            This context will help the agents understand the meeting's purpose.
                                                        </p>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={handleImport}
                        className="shadow-[0_0_20px_-5px_rgba(16,185,129,0.4)]"
                        disabled={selectedEvents.size === 0 || Object.values(eventAgents).some(id => !id)}
                    >
                        Import {selectedEvents.size > 0 ? `${selectedEvents.size} ` : ''}Meeting{selectedEvents.size !== 1 ? 's' : ''}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

