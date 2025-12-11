"use client";

import { useState } from "react";
import { Search, Bell, Folder, Plus, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { projects } from "@/data/mockData";
import { AddProjectModal } from "@/components/modals/AddProjectModal";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface TopBarProps {
    title: string;
}

export function TopBar({ title }: TopBarProps) {
    const { user } = useAuth();
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [selectedProjectId, setSelectedProjectId] = useState('project_personal');

    const currentProject = projects.find(p => p.id === selectedProjectId) || projects[0];

    const handleAddProject = (projectData: { name: string; description?: string }) => {
        // TODO: Integrate with backend API
        console.log("Adding project:", projectData);
        alert(`Project "${projectData.name}" would be created.`);
    };

    return (
        <header className="h-16 border-b border-white/10 bg-[#0a0a0f]/95 backdrop-blur-xl sticky top-0 z-20 flex items-center justify-between px-6 lg:px-8 transition-all duration-300">
            <div className="flex items-center gap-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 text-sm font-medium text-white transition-all duration-200">
                            <div className="w-5 h-5 rounded bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center border border-white/10">
                                <Folder className="h-3 w-3 text-blue-400" />
                            </div>
                            <span className="text-white">{currentProject.name}</span>
                            {currentProject.isPersonal && (
                                <span className="text-[10px] text-white/60 bg-white/5 px-1.5 py-0.5 rounded border border-white/10">
                                    Personal
                                </span>
                            )}
                            <ChevronDown className="h-3.5 w-3.5 text-white/60" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-64 bg-[#0a0a0f] border-white/10">
                        <DropdownMenuLabel className="text-white">Projects</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-white/10" />
                        {projects.map((project) => (
                            <DropdownMenuItem
                                key={project.id}
                                onClick={() => setSelectedProjectId(project.id)}
                                className={cn(
                                    "text-white/70 hover:text-white hover:bg-white/5",
                                    project.id === selectedProjectId && "bg-emerald-500/10 text-emerald-400"
                                )}
                            >
                                <Folder className="h-4 w-4 mr-2" />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="truncate">{project.name}</span>
                                        {project.isPersonal && (
                                            <span className="text-[10px] text-white/50">Personal</span>
                                        )}
                                    </div>
                                    {project.description && (
                                        <p className="text-xs text-white/50 truncate mt-0.5">
                                            {project.description}
                                        </p>
                                    )}
                                </div>
                            </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator className="bg-white/10" />
                        <DropdownMenuItem 
                            onClick={() => setIsProjectModalOpen(true)}
                            className="text-white/70 hover:text-white hover:bg-white/5"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Create New Project
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <div className="h-4 w-px bg-white/10" />
                <h2 className="text-sm font-semibold text-white/60 tracking-tight uppercase">{title}</h2>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative w-72 hidden md:block group">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-white/40 group-hover:text-white/60 transition-colors" />
                    <Input
                        type="search"
                        placeholder="Search..."
                        className="pl-9 bg-white/5 border-white/10 focus:bg-white/10 focus:border-emerald-500/50 h-9 text-sm transition-all duration-200 rounded-lg text-white placeholder:text-white/40"
                    />
                    <div className="absolute right-3 top-2.5 flex items-center gap-1 pointer-events-none">
                        <span className="text-[10px] font-mono text-white/40 bg-white/5 px-1.5 py-0.5 rounded-md border border-white/10">⌘K</span>
                    </div>
                </div>

                <div className="h-4 w-[1px] bg-white/10 mx-2" />

                <Button variant="ghost" size="icon" className="text-white/60 hover:text-white hover:bg-white/5 rounded-lg w-8 h-8 transition-all duration-200">
                    <Bell className="w-4 h-4" />
                </Button>

                {/* User Profile */}
                <div className="relative">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center text-sm font-medium text-white border border-white/10 cursor-pointer hover:border-white/20 transition-colors">
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#0a0a0f]" />
                </div>
            </div>

            <AddProjectModal
                open={isProjectModalOpen}
                onOpenChange={setIsProjectModalOpen}
                onAdd={handleAddProject}
            />
        </header>
    );
}
