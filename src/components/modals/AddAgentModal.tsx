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
import { Bot, X } from "lucide-react";

interface AddAgentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (agent: {
    name: string;
    persona: string;
    description: string;
    systemPrompt: string;
    questions: string[];
    channels: string[];
  }) => void;
}

const channelOptions = ["Zoom", "Google Meet", "Microsoft Teams", "Slack Huddle"];

export function AddAgentModal({
  open,
  onOpenChange,
  onAdd,
}: AddAgentModalProps) {
  const [name, setName] = useState("");
  const [persona, setPersona] = useState("");
  const [description, setDescription] = useState("");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [questionInput, setQuestionInput] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [channels, setChannels] = useState<string[]>([]);

  const handleAddQuestion = () => {
    if (questionInput.trim() && !questions.includes(questionInput.trim())) {
      setQuestions([...questions, questionInput.trim()]);
      setQuestionInput("");
    }
  };

  const handleRemoveQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleToggleChannel = (channel: string) => {
    if (channels.includes(channel)) {
      setChannels(channels.filter((c) => c !== channel));
    } else {
      setChannels([...channels, channel]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && persona.trim() && channels.length > 0) {
      onAdd({
        name: name.trim(),
        persona: persona.trim(),
        description: description.trim(),
        systemPrompt: systemPrompt.trim() || `You are a ${persona}. ${description}`,
        questions,
        channels,
      });
      // Reset form
      setName("");
      setPersona("");
      setDescription("");
      setSystemPrompt("");
      setQuestions([]);
      setChannels([]);
      setQuestionInput("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <DialogTitle>Create New Persona</DialogTitle>
          </div>
          <DialogDescription>
            Configure an AI persona to join meetings and capture knowledge.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="agent-name">Persona Name</Label>
              <Input
                id="agent-name"
                placeholder="e.g., Product Discovery, Scrum Master"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="agent-persona">Persona</Label>
              <Input
                id="agent-persona"
                placeholder="e.g., Product Manager, Agile Coach, Financial Analyst"
                value={persona}
                onChange={(e) => setPersona(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="agent-description">Description</Label>
              <textarea
                id="agent-description"
                placeholder="What does this agent do?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="flex w-full rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-base shadow-sm transition-all duration-200 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:border-primary/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="agent-prompt">System Prompt</Label>
              <textarea
                id="agent-prompt"
                placeholder="Define the agent's behavior and goals..."
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                rows={4}
                className="flex w-full rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-base shadow-sm transition-all duration-200 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:border-primary/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Optional. If left empty, a default prompt will be generated.
              </p>
            </div>
            <div className="grid gap-2">
              <Label>Meeting Channels</Label>
              <div className="flex flex-wrap gap-2">
                {channelOptions.map((channel) => (
                  <button
                    key={channel}
                    type="button"
                    onClick={() => handleToggleChannel(channel)}
                    className={`px-3 py-1.5 rounded-md text-sm border transition-all ${
                      channels.includes(channel)
                        ? "bg-primary/10 text-primary border-primary/30"
                        : "bg-white/5 text-muted-foreground border-white/10 hover:border-white/20"
                    }`}
                  >
                    {channel}
                  </button>
                ))}
              </div>
              {channels.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  Select at least one channel
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="agent-questions">Default Questions (Optional)</Label>
              <div className="flex gap-2">
                <Input
                  id="agent-questions"
                  placeholder="Add a question this agent should ask..."
                  value={questionInput}
                  onChange={(e) => setQuestionInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddQuestion();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddQuestion}
                  disabled={!questionInput.trim()}
                >
                  Add
                </Button>
              </div>
              {questions.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {questions.map((q, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-md text-sm text-foreground border border-white/10"
                    >
                      <span>{q}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(index)}
                        className="ml-1 hover:text-destructive transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
              disabled={!name.trim() || !persona.trim() || channels.length === 0}
            >
              Create Agent
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

