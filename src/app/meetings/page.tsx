"use client";

import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { meetings, agents } from "@/data/mockData";
import { Plus, Search, Calendar, Bot, Clock, CheckCircle2, PlayCircle, XCircle, CalendarDays, Workflow } from "lucide-react";
import Link from "next/link";
import { ScheduleMeetingModal } from "@/components/modals/ScheduleMeetingModal";
import { ConnectGoogleCalendarModal } from "@/components/modals/ConnectGoogleCalendarModal";
import { ImportGoogleCalendarModal } from "@/components/modals/ImportGoogleCalendarModal";
import { useRouter } from "next/navigation";

export default function MeetingsPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [isGoogleCalendarConnected, setIsGoogleCalendarConnected] = useState(false);

    const filteredMeetings = meetings.filter((meeting) =>
        meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        meeting.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleScheduleMeeting = (meetingData: {
        meetingLink: string;
        agentIds: string[];
        description: string;
    }) => {
        // TODO: Integrate with backend API
        console.log("Scheduling meeting:", meetingData);
        const agentNames = meetingData.agentIds.map(id => {
            const agent = agents.find(a => a.id === id);
            return agent?.name || 'Unknown';
        }).join(', ');
        alert(`Meeting with ${agentNames} would be scheduled.`);
    };

    const handleConnectGoogleCalendar = () => {
        // TODO: Implement Google Calendar OAuth
        setIsGoogleCalendarConnected(true);
        alert("Google Calendar connected! (This is a demo)");
    };

    const handleImportMeetings = (importedMeetings: {
        eventId: string;
        agentIds: string[];
        context: string;
    }[]) => {
        // TODO: Integrate with backend API
        console.log("Importing meetings:", importedMeetings);
        alert(`${importedMeetings.length} meeting(s) imported with agents assigned!`);
    };

    // Mock Google Calendar events for demo
    const mockGoogleCalendarEvents = [
        {
            id: 'google_event_1',
            title: 'Team Standup',
            start: '2025-11-25T10:00:00Z',
            end: '2025-11-25T10:30:00Z',
            link: 'https://meet.google.com/standup-123',
            description: 'Daily team standup meeting',
        },
        {
            id: 'google_event_2',
            title: 'Client Presentation',
            start: '2025-11-25T14:00:00Z',
            end: '2025-11-25T15:00:00Z',
            link: 'https://zoom.us/j/client-presentation',
            description: 'Present Q4 results to client',
        },
        {
            id: 'google_event_3',
            title: 'Product Review',
            start: '2025-12-25T11:00:00Z',
            end: '2025-12-25T12:00:00Z',
            link: 'https://meet.google.com/product-review',
            description: 'Review product roadmap and features',
        },
    ];

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

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Scheduled':
                return <Badge variant="outline" className="text-xs"><Calendar className="w-3 h-3 mr-1" /> Scheduled</Badge>;
            case 'In Progress':
                return <Badge variant="default" className="text-xs"><PlayCircle className="w-3 h-3 mr-1" /> In Progress</Badge>;
            case 'Completed':
                return <Badge variant="secondary" className="text-xs"><CheckCircle2 className="w-3 h-3 mr-1" /> Completed</Badge>;
            case 'Cancelled':
                return <Badge variant="destructive" className="text-xs"><XCircle className="w-3 h-3 mr-1" /> Cancelled</Badge>;
            default:
                return null;
        }
    };

    const getMeetingAgents = (agentIds: string[]) => {
        return agents.filter(a => agentIds.includes(a.id));
    };

    return (
        <MainLayout title="Meetings">
            <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Your Meetings</h1>
                        <p className="text-muted-foreground">
                            Schedule meetings and add AI agents to join them
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {isGoogleCalendarConnected ? (
                            <Button
                                variant="outline"
                                onClick={() => setIsImportModalOpen(true)}
                            >
                                <CalendarDays className="mr-2 h-4 w-4" /> Import from Google Calendar
                            </Button>
                        ) : (
                            <Button
                                variant="outline"
                                onClick={() => setIsConnectModalOpen(true)}
                            >
                                <CalendarDays className="mr-2 h-4 w-4" /> Connect Google Calendar
                            </Button>
                        )}
                        <Button 
                            className="shadow-[0_0_20px_-5px_rgba(16,185,129,0.4)]"
                            onClick={() => setIsModalOpen(true)}
                        >
                            <Plus className="mr-2 h-4 w-4" /> Schedule Meeting
                        </Button>
                    </div>
                </div>

                <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search meetings..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 bg-white/[0.03] border-white/5 focus:bg-white/[0.05] focus:border-primary/30"
                    />
                </div>
            </div>

            <ScheduleMeetingModal
                open={isModalOpen}
                onOpenChange={setIsModalOpen}
                onSchedule={handleScheduleMeeting}
            />

            <ConnectGoogleCalendarModal
                open={isConnectModalOpen}
                onOpenChange={setIsConnectModalOpen}
                onConnect={handleConnectGoogleCalendar}
                isConnected={isGoogleCalendarConnected}
            />

            <ImportGoogleCalendarModal
                open={isImportModalOpen}
                onOpenChange={setIsImportModalOpen}
                events={mockGoogleCalendarEvents}
                onImport={handleImportMeetings}
            />

            {filteredMeetings.length > 0 ? (
                <div className="space-y-4">
                    {filteredMeetings.map((meeting) => {
                        const meetingAgents = getMeetingAgents(meeting.agentIds);
                        return (
                            <Card key={meeting.id} className="bg-[#1a1a1f] border-white/10 rounded-xl overflow-hidden">
                                <CardHeader>
                                    <div className="flex items-start justify-between gap-4 mb-2">
                                        <div className="flex-1">
                                            <CardTitle className="text-xl font-semibold text-white mb-2">
                                                {meeting.title}
                                            </CardTitle>
                                            <CardDescription className="mb-3 text-white/50">
                                                {meeting.description}
                                            </CardDescription>
                                        </div>
                                        {getStatusBadge(meeting.status)}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            <span>{formatDate(meeting.scheduledAt)}</span>
                                        </div>
                                        {meeting.duration && (
                                            <span>Duration: {meeting.duration}</span>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="mb-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Bot className="w-4 h-4 text-emerald-400" />
                                            <span className="text-sm font-medium text-white">Agents in Meeting:</span>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {meetingAgents.map((agent) => (
                                                <Badge key={agent.id} variant="outline" className="text-xs bg-white/5 border-white/10 text-white/70">
                                                    {agent.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                    {meeting.summary && meeting.summary.length > 0 && (
                                        <div className="mb-4 pt-4 border-t border-white/10">
                                            <h4 className="text-sm font-semibold mb-2 text-white">Summary</h4>
                                            <ul className="text-sm text-white/60 space-y-1">
                                                {meeting.summary.map((item, idx) => (
                                                    <li key={idx} className="flex items-start gap-2">
                                                        <span className="text-emerald-400 mt-1">•</span>
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {meeting.actionItems && meeting.actionItems.length > 0 && (
                                        <div className="pt-4 border-t border-white/10">
                                            <h4 className="text-sm font-semibold mb-2 text-white">Action Items</h4>
                                            <ul className="text-sm text-white/60 space-y-1">
                                                {meeting.actionItems.map((item, idx) => (
                                                    <li key={idx} className="flex items-start gap-2">
                                                        <span className="text-emerald-400 mt-1">•</span>
                                                        <span>{item}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {meeting.status === 'Completed' && meeting.conversationDataId && (
                                        <div className="pt-4 border-t border-white/5">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => router.push('/workflows')}
                                                className="w-full"
                                            >
                                                <Workflow className="w-4 h-4 mr-2" />
                                                Create Workflow from Conversation
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-16">
                    <Calendar className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No meetings found</h3>
                    <p className="text-muted-foreground mb-6">
                        {searchQuery
                            ? "Try adjusting your search terms"
                            : "Get started by scheduling your first meeting"}
                    </p>
                    {!searchQuery && (
                        <Button 
                            className="shadow-[0_0_20px_-5px_rgba(16,185,129,0.4)]"
                            onClick={() => setIsModalOpen(true)}
                        >
                            <Plus className="mr-2 h-4 w-4" /> Schedule Your First Meeting
                        </Button>
                    )}
                </div>
            )}
        </MainLayout>
    );
}

