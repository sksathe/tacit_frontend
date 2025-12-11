# Tacit

Tacit is a multi-agent meeting knowledgebase system. This is the frontend dashboard application.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Icons**: lucide-react

## Theme & Design
- **Dark Mode**: Defaulted to a "futuristic terminal" aesthetic.
- **Colors**:
  - Background: `#020617` (Near black)
  - Primary Accent: `#00FF8A` (Neon Green)
  - Secondary: `#22c55e`
  - Surface: `#030712`
- **Fonts**: Inter (UI) and JetBrains Mono (Code/Terminal).

## Pages Implemented

| Route | Description |
|-------|-------------|
| `/` | **Dashboard**: Overview of meetings, agents, and stats. |
| `/agents` | **Agents List**: Manage AI personas. |
| `/agents/[id]` | **Agent Detail**: Configure prompt, behavior, and scheduling. |
| `/meetings` | **Meetings List**: Filterable list of past and upcoming meetings. |
| `/meetings/[id]` | **Meeting Detail**: Transcript preview, summary, action items, and docs. |
| `/knowledge` | **Knowledgebase**: Topic-based browser for captured knowledge. |
| `/templates` | **Templates**: Gallery of agent and document templates. |
| `/settings` | **Settings**: Workspace config and integrations (Zoom/Meet/Teams). |

## How to Run

1.  Install dependencies:
    ```bash
    npm install
    ```
2.  Start the development server:
    ```bash
    npm run dev
    ```
3.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## Mock Data
All data is served from `src/data/mockData.ts`. You can modify this file to test different states.
