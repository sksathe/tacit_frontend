export interface Project {
    id: string;
    name: string;
    description?: string;
    isPersonal: boolean;
    createdAt: string;
}

export interface Agent {
    id: string;
    name: string;
    persona: string;
    description: string;
    systemPrompt: string;
    questions: string[];
    channels: string[];
    status: 'Active' | 'Inactive';
    projectId: string;
    createdAt: string;
    lastActive?: string;
}

export interface Meeting {
    id: string;
    title: string;
    meetingLink: string;
    description: string;
    agentIds: string[]; // Multiple agents can join a meeting
    workflowId?: string; // Optional workflow assigned to the meeting
    projectId: string;
    scheduledAt: string;
    status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
    duration?: string;
    summary?: string[];
    actionItems?: string[];
    participants?: string[];
    conversationDataId?: string; // Reference to ElevenLabs conversation data
    createdAt: string;
}

export type WorkflowStepType = 
    | 'extract_topics'
    | 'summarize'
    | 'extract_quotes'
    | 'generate_action_items'
    | 'create_transcript'
    | 'format_markdown'
    | 'export_pdf'
    | 'export_docx'
    | 'custom_prompt';

export interface WorkflowStep {
    id: string;
    type: WorkflowStepType;
    name: string;
    description?: string;
    config?: Record<string, any>; // Step-specific configuration
    order: number;
}

export interface Workflow {
    id: string;
    name: string;
    description?: string;
    steps: WorkflowStep[];
    projectId: string;
    createdAt: string;
    updatedAt: string;
}

export interface WorkflowExecution {
    id: string;
    workflowId: string;
    meetingId: string;
    status: 'Running' | 'Completed' | 'Failed';
    output?: string; // Generated document content or file reference
    error?: string;
    startedAt: string;
    completedAt?: string;
}

export interface Document {
    id: string;
    name: string;
    description?: string;
    type: 'pdf' | 'docx' | 'markdown' | 'text';
    source: 'meeting' | 'workflow';
    sourceId: string; // meetingId or workflowExecutionId
    sourceName: string; // meeting title or workflow name
    fileUrl?: string; // URL to the document file
    content?: string; // Document content (for text/markdown)
    size?: string; // File size
    createdAt: string;
    updatedAt?: string;
    projectId: string;
}

