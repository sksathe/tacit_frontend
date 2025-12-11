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
import { Workflow, Play, FileText } from "lucide-react";
import { Workflow as WorkflowType, Meeting } from "@/types";
import { meetings } from "@/data/mockData";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface RunWorkflowModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    workflow: WorkflowType | null;
    onRun: (meetingId: string) => void;
}

export function RunWorkflowModal({
    open,
    onOpenChange,
    workflow,
    onRun,
}: RunWorkflowModalProps) {
    const [selectedMeetingId, setSelectedMeetingId] = useState<string>("");

    // Get completed meetings with conversation data
    const completedMeetings = meetings.filter(
        m => m.status === 'Completed' && m.conversationDataId
    );

    const handleRun = () => {
        if (selectedMeetingId && workflow) {
            onRun(selectedMeetingId);
            setSelectedMeetingId("");
            onOpenChange(false);
        }
    };

    if (!workflow) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                            <Play className="h-5 w-5 text-primary" />
                        </div>
                        <DialogTitle>Run Workflow</DialogTitle>
                    </div>
                    <DialogDescription>
                        Select a completed meeting to process its conversation data
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <div className="p-4 rounded-lg bg-white/[0.02] border border-white/10">
                            <div className="flex items-center gap-2 mb-2">
                                <Workflow className="w-4 h-4 text-primary" />
                                <span className="font-medium">{workflow.name}</span>
                            </div>
                            {workflow.description && (
                                <p className="text-sm text-muted-foreground mb-3">
                                    {workflow.description}
                                </p>
                            )}
                            <div className="flex flex-wrap gap-2">
                                {workflow.steps.map((step, idx) => (
                                    <Badge key={step.id} variant="outline" className="text-xs">
                                        {idx + 1}. {step.name}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Select Meeting</label>
                        {completedMeetings.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
                                <FileText className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                <p className="text-sm">No completed meetings with conversation data available.</p>
                            </div>
                        ) : (
                            <Select value={selectedMeetingId} onValueChange={setSelectedMeetingId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose a meeting..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {completedMeetings.map((meeting) => (
                                        <SelectItem key={meeting.id} value={meeting.id}>
                                            <div>
                                                <div className="font-medium">{meeting.title}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {new Date(meeting.scheduledAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    </div>

                    {selectedMeetingId && (
                        <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                            <p className="text-sm text-muted-foreground">
                                This workflow will process the conversation data from the selected meeting and generate a document based on the configured steps.
                            </p>
                        </div>
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
                        onClick={handleRun}
                        className="shadow-[0_0_20px_-5px_rgba(16,185,129,0.4)]"
                        disabled={!selectedMeetingId || completedMeetings.length === 0}
                    >
                        <Play className="w-4 h-4 mr-2" /> Run Workflow
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}




