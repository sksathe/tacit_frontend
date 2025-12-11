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
import { Building2 } from "lucide-react";

interface AddWorkspaceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (workspace: { name: string; description: string }) => void;
}

export function AddWorkspaceModal({
  open,
  onOpenChange,
  onAdd,
}: AddWorkspaceModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd({ name: name.trim(), description: description.trim() });
      setName("");
      setDescription("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <DialogTitle>Create New Team</DialogTitle>
          </div>
          <DialogDescription>
            Create a new team workspace to organize projects and agents for a department or group.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="workspace-name">Team Name</Label>
              <Input
                id="workspace-name"
                placeholder="e.g., Engineering, Marketing, Sales, CTO Office"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="workspace-description">Description</Label>
              <textarea
                id="workspace-description"
                placeholder="Brief description of the team's purpose..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="flex w-full rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-base shadow-sm transition-all duration-200 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:border-primary/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none"
              />
            </div>
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
              type="submit"
              className="shadow-[0_0_20px_-5px_rgba(16,185,129,0.4)]"
            >
              Create Team
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

