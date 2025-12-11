# Tacit - Application Overview

## Purpose
Tacit is a customer-facing application that helps users manage AI agents, schedule meetings, and automatically generate documents from meeting conversations using customizable workflows.

## Core Functionality

### 1. **AI Agents Management**
- Users can create and manage AI agents with custom personas
- Each agent has:
  - Name, persona, description
  - System prompt
  - Questions they can ask
  - Communication channels
  - Status (Active/Inactive)
- Agents are organized by projects

### 2. **Meeting Management**
- Users can schedule meetings and assign AI agents to join them
- Features:
  - Calendar view showing all meetings
  - Meeting details: title, description, scheduled time, duration
  - Status tracking: Scheduled, In Progress, Completed, Cancelled
  - Google Calendar integration (connect and import meetings)
  - When assigning agents, users can provide context
  - Only one agent can be assigned per meeting
  - Meetings can have workflows assigned to them
- After meetings complete, conversation data is stored in ElevenLabs

### 3. **Workflow Builder (Visual Studio)**
- Full-page visual workflow builder (similar to n8n/ElevenLabs)
- Drag-and-drop node-based interface using ReactFlow
- Workflow steps include:
  - Extract Topics
  - Summarize
  - Extract Quotes
  - Generate Action Items
  - Create Transcript
  - Format as Markdown
  - Export PDF
  - Export DOCX
  - Custom Prompt
- Features:
  - Start and End nodes automatically included
  - Visual connections between steps
  - Step configuration
  - Workflow can be saved and reused
  - Right sidebar with all available tools/steps

### 4. **Workflow Execution**
- Workflows can be executed on completed meetings
- Processes conversation data from ElevenLabs
- Generates documents based on workflow steps
- Documents are stored and accessible

### 5. **Documents**
- Documents are generated from:
  - Meeting agents (direct processing)
  - Workflow executions (processed through workflows)
- Document types: PDF, DOCX, Markdown, Text
- Features:
  - List view of all documents
  - Search and filter by type/source
  - Download functionality
  - Shows source (meeting or workflow)
  - Metadata: size, creation date

### 6. **Project Organization**
- Users can create multiple projects
- Default "Personal" project
- Agents, meetings, workflows, and documents are scoped to projects
- Project selector in top bar

## Technical Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI Library**: React with TypeScript
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS
- **Workflow Builder**: ReactFlow
- **State Management**: React hooks (useState, useEffect)
- **Routing**: Next.js App Router

### Key Libraries
- ReactFlow for visual workflow builder
- Radix UI for accessible components
- Lucide React for icons
- Tailwind CSS for styling

## User Flow

1. **Setup**
   - User logs in (email-based authentication)
   - Creates or selects a project
   - Creates AI agents with personas

2. **Meeting Management**
   - User schedules meetings (manually or imports from Google Calendar)
   - Assigns an AI agent to the meeting
   - Optionally assigns a workflow to process the meeting
   - Agent joins meeting and captures conversation (stored in ElevenLabs)

3. **Workflow Creation**
   - User goes to Workflow Studio
   - Builds visual workflow by dragging and connecting nodes
   - Configures each step
   - Saves workflow

4. **Document Generation**
   - After meeting completes, user can:
     - Run a workflow on the meeting's conversation data
     - Or documents are automatically generated if workflow was assigned
   - Documents appear in Documents page
   - User can download documents

## Key Features

- **Visual Workflow Builder**: Full-screen drag-and-drop interface
- **Calendar Integration**: Google Calendar import
- **Real-time Status**: Meeting status tracking
- **Document Management**: Centralized document repository
- **Project-based**: Multi-project support
- **Search & Filter**: Across meetings, workflows, and documents

## Data Flow

1. **Meeting → Agent → Conversation Data**
   - Meeting scheduled → Agent assigned → Agent joins → Conversation captured → Stored in ElevenLabs

2. **Conversation Data → Workflow → Document**
   - User selects meeting → Runs workflow → Workflow processes conversation → Document generated → Stored

3. **Meeting → Workflow Assignment → Auto Processing**
   - Meeting scheduled → Workflow assigned → Meeting completes → Workflow auto-executes → Document generated

## Current State

- Frontend is fully implemented with mock data
- Backend integration points are marked with TODO comments
- Ready for backend API integration
- All UI flows are complete and functional

## Architecture Considerations Needed

- Backend API design for:
  - Agent management
  - Meeting scheduling and management
  - Workflow storage and execution
  - Document generation and storage
  - ElevenLabs integration
  - Google Calendar OAuth integration
  - User authentication and project management
- Database schema design
- Workflow execution engine
- Document generation pipeline
- Real-time updates for meeting status
- File storage for documents




