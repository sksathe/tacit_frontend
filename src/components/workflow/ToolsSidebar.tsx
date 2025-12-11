"use client";

import { WorkflowStepType } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const WORKFLOW_STEP_TYPES: { value: WorkflowStepType; label: string; description: string; color: string; icon: string }[] = [
    { value: 'extract_topics', label: 'Extract Topics', description: 'Extract key topics from conversation', color: 'bg-blue-500', icon: '📋' },
    { value: 'summarize', label: 'Summarize', description: 'Create a summary of the conversation', color: 'bg-green-500', icon: '📝' },
    { value: 'extract_quotes', label: 'Extract Quotes', description: 'Extract important quotes', color: 'bg-purple-500', icon: '💬' },
    { value: 'generate_action_items', label: 'Action Items', description: 'Generate action items from conversation', color: 'bg-orange-500', icon: '✅' },
    { value: 'create_transcript', label: 'Transcript', description: 'Create transcript', color: 'bg-pink-500', icon: '📄' },
    { value: 'format_markdown', label: 'Markdown', description: 'Format as Markdown', color: 'bg-cyan-500', icon: '📝' },
    { value: 'export_pdf', label: 'Export PDF', description: 'Export as PDF', color: 'bg-red-500', icon: '📕' },
    { value: 'export_docx', label: 'Export DOCX', description: 'Export as DOCX', color: 'bg-indigo-500', icon: '📘' },
    { value: 'custom_prompt', label: 'Custom', description: 'Custom prompt', color: 'bg-gray-500', icon: '⚙️' },
];

interface ToolsSidebarProps {
    onAddStep: (stepType: WorkflowStepType) => void;
}

export function ToolsSidebar({ onAddStep }: ToolsSidebarProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredTools = WORKFLOW_STEP_TYPES.filter((tool) =>
        tool.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="w-64 h-full border-l border-white/10 bg-background/95 backdrop-blur-md flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-white/10">
                <h2 className="text-sm font-semibold mb-3">Workflow Tools</h2>
                <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search tools..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-7 h-8 text-xs bg-white/[0.03] border-white/10"
                    />
                </div>
            </div>

            {/* Tools List */}
            <div className="flex-1 overflow-y-auto p-2">
                <div className="space-y-1">
                    {filteredTools.map((tool) => (
                        <button
                            key={tool.value}
                            onClick={() => onAddStep(tool.value)}
                            className="w-full text-left p-3 rounded-lg border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-primary/30 transition-all duration-200 group cursor-pointer"
                        >
                            <div className="flex items-start gap-3">
                                <div className={`w-8 h-8 rounded-md ${tool.color} flex items-center justify-center flex-shrink-0 text-lg group-hover:scale-110 transition-transform`}>
                                    {tool.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                                        {tool.label}
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                                        {tool.description}
                                    </div>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
                
                {filteredTools.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                        <p className="text-sm">No tools found</p>
                        <p className="text-xs mt-1">Try a different search term</p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-white/10">
                <p className="text-xs text-muted-foreground">
                    Click a tool to add it to your workflow
                </p>
            </div>
        </div>
    );
}




