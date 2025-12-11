"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, Calendar, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";
import { agents, meetings, projects, workflows } from "@/data/mockData";
import { MeetingCalendar } from "@/components/ui/meeting-calendar";
import { Meeting } from "@/types";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Clock, Bot as BotIcon, Plus as PlusIcon, Workflow, Link as LinkIcon, Phone } from "lucide-react";
import { AssignAgentsToMeetingModal } from "@/components/modals/AssignAgentsToMeetingModal";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function HomePage() {
    const { user } = useAuth();
    const router = useRouter();
    const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
    const [isAssignAgentsModalOpen, setIsAssignAgentsModalOpen] = useState(false);
    const [meetingLink, setMeetingLink] = useState("");
    const [selectedAgentId, setSelectedAgentId] = useState<string>("");
    const [isJoiningMeeting, setIsJoiningMeeting] = useState(false);

    useEffect(() => {
        if (!user) {
            router.push("/login");
        }
    }, [user, router]);

    if (!user) {
        return null;
    }

    const activeAgents = agents.filter(a => a.status === 'Active').length;
    const upcomingMeetings = meetings.filter(m => m.status === 'Scheduled').length;
    const completedMeetings = meetings.filter(m => m.status === 'Completed').length;

    const handleMeetingClick = (meeting: Meeting) => {
        setSelectedMeeting(meeting);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", { 
            month: "long", 
            day: "numeric", 
            year: "numeric",
            hour: "numeric",
            minute: "2-digit"
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Scheduled':
                return <Badge variant="outline" className="text-xs bg-blue-500/20 text-blue-400 border-blue-500/30"><Calendar className="w-3 h-3 mr-1" /> Scheduled</Badge>;
            case 'In Progress':
                return <Badge variant="default" className="text-xs"><Calendar className="w-3 h-3 mr-1" /> In Progress</Badge>;
            case 'Completed':
                return <Badge variant="secondary" className="text-xs bg-green-500/20 text-green-400 border-green-500/30"><Calendar className="w-3 h-3 mr-1" /> Completed</Badge>;
            case 'Cancelled':
                return <Badge variant="destructive" className="text-xs"><Calendar className="w-3 h-3 mr-1" /> Cancelled</Badge>;
            default:
                return null;
        }
    };

    const getMeetingAgents = (agentIds: string[]) => {
        return agents.filter(a => agentIds.includes(a.id));
    };

    const handleAssignAgents = (agentIds: string[], context?: string) => {
        if (selectedMeeting) {
            // TODO: Integrate with backend API to update meeting
            console.log("Assigning agents to meeting:", {
                meetingId: selectedMeeting.id,
                agentIds,
                context,
            });
            alert(`${agentIds.length} agent(s) assigned to "${selectedMeeting.title}"`);
            // Update local state (in real app, this would come from API)
            setSelectedMeeting({
                ...selectedMeeting,
                agentIds,
                description: context || selectedMeeting.description,
            });
        }
    };

    const handleAssignWorkflow = (workflowId: string) => {
        if (selectedMeeting) {
            // Handle "none" value to clear workflow
            const actualWorkflowId = workflowId === "none" ? undefined : workflowId;
            
            // Update the meeting in mock data
            const meetingIndex = meetings.findIndex(m => m.id === selectedMeeting.id);
            if (meetingIndex !== -1) {
                meetings[meetingIndex].workflowId = actualWorkflowId;
                setSelectedMeeting({ ...selectedMeeting, workflowId: actualWorkflowId });
                console.log("Assigning workflow to meeting:", {
                    meetingId: selectedMeeting.id,
                    workflowId: actualWorkflowId,
                });
            }
            
            if (actualWorkflowId) {
                const workflow = workflows.find(w => w.id === actualWorkflowId);
                alert(`Workflow "${workflow?.name || 'Unknown'}" assigned to "${selectedMeeting.title}"`);
            } else {
                alert(`Workflow removed from "${selectedMeeting.title}"`);
            }
        }
    };

    const getMeetingWorkflow = (workflowId?: string) => {
        if (!workflowId) return null;
        return workflows.find(w => w.id === workflowId);
    };

    const handleJoinMeeting = async () => {
        if (!meetingLink.trim()) {
            alert("Please enter a meeting link");
            return;
        }
        if (!selectedAgentId) {
            alert("Please select an agent");
            return;
        }
        
        setIsJoiningMeeting(true);
        const selectedAgent = agents.find(a => a.id === selectedAgentId);
        
        try {
            const response = await fetch('/api/join-meeting', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    meeting_url: meetingLink.trim(),
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Meeting join response:", data);
            
            alert(`Agent "${selectedAgent?.name || 'ROSS SOC2 Analyst'}" is joining the meeting now!`);
            
            // Reset form
            setMeetingLink("");
            setSelectedAgentId("");
        } catch (error) {
            console.error("Error joining meeting:", error);
            alert(`Failed to join meeting: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsJoiningMeeting(false);
        }
    };

    const currentProject = projects.find(p => p.id === 'project_personal') || projects[0];

    return (
        <MainLayout title={currentProject.name}>
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-4xl font-bold text-white">{currentProject.name}</h1>
                        {currentProject.isPersonal && (
                            <span className="text-sm text-white/60 bg-white/5 px-3 py-1 rounded-lg border border-white/10">
                                Personal Project
                            </span>
                        )}
                    </div>
                    <p className="text-xl text-white/60">
                        {currentProject.description || 'Create AI agents and schedule them to join your meetings'}
                    </p>
                </div>

                {/* Calendar and Stats Side by Side */}
                <div className="grid gap-6 lg:grid-cols-3 mb-8">
                    {/* Stats - Takes 1 column */}
                    <div className="space-y-4">
                        <Card className="bg-[#1a1a1f] border-white/10 rounded-xl overflow-hidden">
                            <CardHeader className="pb-4">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <button className="px-3 py-1.5 rounded-lg text-sm font-medium text-white/60 bg-white/5 border border-white/10">
                                            Timeline
                                        </button>
                                        <button className="px-3 py-1.5 rounded-lg text-sm font-medium text-white bg-[#1a1a1f] border border-white/20">
                                            Active
                                        </button>
                                    </div>
                                    <button className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors">
                                        <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h8" />
                                        </svg>
                                    </button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-0">
                                {/* Completed Meeting */}
                                <div className="flex items-center justify-between py-4 border-b border-white/10 last:border-0">
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-bold text-white truncate">User Interview - Q1 Planning</h3>
                                            <p className="text-xs text-white/50 mt-0.5">Nov 5, 2025</p>
                                        </div>
                                    </div>
                                    <span className="px-2.5 py-1 rounded text-xs font-medium text-white bg-emerald-500 flex-shrink-0">Done</span>
                                </div>
                                
                                {/* Active Meeting */}
                                <div className="flex items-center justify-between py-4 border-b border-white/10 last:border-0">
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-bold text-white truncate">Daily Standup</h3>
                                            <p className="text-xs text-white/50 mt-0.5">Nov 8, 2025</p>
                                        </div>
                                    </div>
                                    <span className="px-2.5 py-1 rounded text-xs font-medium text-white bg-blue-500 flex-shrink-0">Active</span>
                                </div>
                                
                                {/* Pending Meetings */}
                                {meetings.filter(m => m.status === 'Scheduled').slice(0, 2).map((meeting) => (
                                    <div key={meeting.id} className="flex items-center justify-between py-4 border-b border-white/10 last:border-0">
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            <div className="w-2 h-2 rounded-full bg-white/30 flex-shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-sm font-bold text-white truncate">{meeting.title}</h3>
                                                <p className="text-xs text-white/50 mt-0.5">
                                                    {new Date(meeting.scheduledAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="px-2.5 py-1 rounded text-xs font-medium text-white bg-white/5 border border-white/20 flex-shrink-0">Pending</span>
                                    </div>
                                ))}
                            </CardContent>
                            <div className="p-4 pt-0">
                                <Button variant="outline" className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10">
                                    View full timeline
                                </Button>
                            </div>
                        </Card>
                    </div>
                    
                    {/* Join Meeting Form - Takes 2 columns */}
                    <div className="lg:col-span-2">
                        <Card className="bg-[#1a1a1f] border-white/10 rounded-xl overflow-hidden">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Phone className="w-5 h-5 text-emerald-400" />
                                    Join Meeting
                                </CardTitle>
                                <CardDescription className="text-white/50">
                                    Get an agent into your meeting immediately
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="meeting-link" className="text-white">
                                        Meeting Link
                                    </Label>
                                    <div className="relative">
                                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                                        <Input
                                            id="meeting-link"
                                            type="url"
                                            placeholder="https://zoom.us/j/123456789 or https://meet.google.com/abc-defg-hij"
                                            value={meetingLink}
                                            onChange={(e) => setMeetingLink(e.target.value)}
                                            className="pl-9 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:bg-white/10 focus:border-emerald-500/50"
                                        />
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="agent-select" className="text-white">
                                        Select Agent
                                    </Label>
                                    <Select value={selectedAgentId} onValueChange={setSelectedAgentId}>
                                        <SelectTrigger 
                                            id="agent-select"
                                            className="bg-white/5 border-white/10 text-white focus:border-emerald-500/50"
                                        >
                                            <SelectValue placeholder="Choose an agent to join..." />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#1a1a1f] border-white/10">
                                            {agents.filter(a => a.status === 'Active').map((agent) => (
                                                <SelectItem 
                                                    key={agent.id} 
                                                    value={agent.id}
                                                    className="text-white hover:bg-white/10"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <Bot className="w-4 h-4 text-emerald-400" />
                                                        <div className="flex flex-col">
                                                            <span className="font-medium">{agent.name}</span>
                                                            <span className="text-xs text-white/50">{agent.persona}</span>
                                                        </div>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                
                                <Button
                                    onClick={handleJoinMeeting}
                                    disabled={!meetingLink.trim() || !selectedAgentId || isJoiningMeeting}
                                    className="w-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Phone className="w-4 h-4 mr-2" />
                                    {isJoiningMeeting ? "Joining..." : "Join Meeting"}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                    
                    {/* Calendar - Hidden for now */}
                    {/* <div className="lg:col-span-2">
                        <MeetingCalendar 
                            meetings={meetings} 
                            onMeetingClick={handleMeetingClick}
                        />
                    </div> */}
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="bg-[#1a1a1f] border-white/10 rounded-xl overflow-hidden">
                        <CardHeader>
                            <CardTitle className="text-white">Agents</CardTitle>
                            <CardDescription className="text-white/50">
                                Create and manage AI personas to join your meetings
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Link href="/agents">
                                <Button variant="outline" className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10">
                                    View Agents <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                            <Link href="/agents">
                                <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">
                                    <Plus className="mr-2 h-4 w-4" /> Create Agent
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="bg-[#1a1a1f] border-white/10 rounded-xl overflow-hidden">
                        <CardHeader>
                            <CardTitle className="text-white">Meetings</CardTitle>
                            <CardDescription className="text-white/50">
                                Schedule meetings and add agents to join them
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Link href="/meetings">
                                <Button variant="outline" className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10">
                                    View Meetings <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                            <Link href="/meetings">
                                <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">
                                    <Plus className="mr-2 h-4 w-4" /> Schedule Meeting
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>

                {/* Meeting Detail Dialog */}
                <Dialog open={!!selectedMeeting} onOpenChange={() => setSelectedMeeting(null)}>
                    <DialogContent className="sm:max-w-[600px] bg-[#1a1a1f] border-white/10">
                        <DialogHeader>
                            <div className="flex items-center justify-between gap-4">
                                <DialogTitle className="text-2xl text-white">{selectedMeeting?.title}</DialogTitle>
                                {selectedMeeting && getStatusBadge(selectedMeeting.status)}
                            </div>
                            {selectedMeeting && (
                                <DialogDescription className="text-white/60">
                                    {selectedMeeting.description}
                                </DialogDescription>
                            )}
                        </DialogHeader>
                        {selectedMeeting && (
                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Clock className="w-4 h-4 text-white/60" />
                                        <span className="text-sm font-medium text-white">Scheduled Time</span>
                                    </div>
                                    <p className="text-sm text-white/60 ml-6">
                                        {formatDate(selectedMeeting.scheduledAt)}
                                    </p>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <BotIcon className="w-4 h-4 text-white/60" />
                                            <span className="text-sm font-medium text-white">Agent</span>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setIsAssignAgentsModalOpen(true)}
                                            className="bg-white/5 border-white/10 text-white hover:bg-white/10"
                                        >
                                            <PlusIcon className="w-3 h-3 mr-1" />
                                            {selectedMeeting.agentIds.length === 0 ? 'Assign' : 'Edit'}
                                        </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 ml-6">
                                        {selectedMeeting.agentIds.length > 0 ? (
                                            getMeetingAgents(selectedMeeting.agentIds).map((agent) => (
                                                <Badge key={agent.id} variant="outline" className="text-xs bg-white/5 border-white/10 text-white">
                                                    {agent.name}
                                                </Badge>
                                            ))
                                        ) : (
                                            <p className="text-sm text-white/50 italic">
                                                No agent assigned. Click "Assign" to add an agent.
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <Workflow className="w-4 h-4 text-white/60" />
                                            <span className="text-sm font-medium text-white">Workflow</span>
                                        </div>
                                    </div>
                                    <div className="ml-6">
                                        <Select
                                            value={selectedMeeting.workflowId || "none"}
                                            onValueChange={handleAssignWorkflow}
                                        >
                                            <SelectTrigger className="w-full bg-white/5 border-white/10 text-white">
                                                <SelectValue placeholder="Select a workflow..." />
                                            </SelectTrigger>
                                            <SelectContent className="bg-[#1a1a1f] border-white/10">
                                                <SelectItem value="none" className="text-white hover:bg-white/10">None</SelectItem>
                                                {workflows.map((workflow) => (
                                                    <SelectItem key={workflow.id} value={workflow.id} className="text-white hover:bg-white/10">
                                                        <div className="flex flex-col">
                                                            <span className="font-medium">{workflow.name}</span>
                                                            {workflow.description && (
                                                                <span className="text-xs text-white/50">
                                                                    {workflow.description}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {selectedMeeting.workflowId && (
                                            <div className="mt-2">
                                                <Badge variant="outline" className="text-xs bg-white/5 border-white/10 text-white">
                                                    {getMeetingWorkflow(selectedMeeting.workflowId)?.name}
                                                </Badge>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {selectedMeeting.summary && selectedMeeting.summary.length > 0 && (
                                    <div>
                                        <span className="text-sm font-medium text-white">Summary</span>
                                        <ul className="text-sm text-white/60 mt-1 space-y-1">
                                            {selectedMeeting.summary.map((item, idx) => (
                                                <li key={idx} className="flex items-start gap-2">
                                                    <span className="text-emerald-400 mt-1">•</span>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {selectedMeeting.actionItems && selectedMeeting.actionItems.length > 0 && (
                                    <div>
                                        <span className="text-sm font-medium text-white">Action Items</span>
                                        <ul className="text-sm text-white/60 mt-1 space-y-1">
                                            {selectedMeeting.actionItems.map((item, idx) => (
                                                <li key={idx} className="flex items-start gap-2">
                                                    <span className="text-emerald-400 mt-1">•</span>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </DialogContent>
                </Dialog>

                <AssignAgentsToMeetingModal
                    open={isAssignAgentsModalOpen}
                    onOpenChange={setIsAssignAgentsModalOpen}
                    meeting={selectedMeeting}
                    onAssign={handleAssignAgents}
                />
            </div>
        </MainLayout>
    );
}
