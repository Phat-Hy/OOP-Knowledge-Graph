# Spec: OOP Interview Prep Knowledge Graph

**Status:** approved

## Goal
Design and develop a web application consisting of a Node.js/Express backend and an interactive frontend to help users prepare for OOP interviews (covering basic/advanced concepts, SOLID principles, and design patterns) using a Knowledge Graph. The application features a custom agent skill (`hs-extract-oop`) that runs during the workflow to search the web, read local files, validate information, structure it, and write it to the backend data store before the build is finalized.

## Requirements

### 1. Architecture & Data Flow
- The application will be organized under the `oop-kg/` directory:
  - **Backend** (`oop-kg/backend/`): An Express server that serves API endpoints and hosts the graph database in `oop-kg/backend/data/graph.json`. It will also serve the frontend static files.
  - **Frontend** (`oop-kg/frontend/`): A premium single-page web interface containing `index.html`, `style.css`, and `app.js` using a force-directed graph library (like D3.js or Cytoscape.js) to visualize nodes and links.
- **APIs**:
  - `GET /api/graph`: Returns the entire knowledge graph (nodes and edges).
  - `POST /api/nodes`: Adds or updates a concept node.
  - `POST /api/links`: Adds a dependency link between two nodes.
  - `DELETE /api/nodes/:id`: Removes a concept node and its associated links.
  - `DELETE /api/links`: Removes a connection between two nodes.
  - `POST /api/import`: Overwrites the graph database with an uploaded JSON payload.

### 2. Interactive Knowledge Graph UI
- **WHEN** the frontend loads, **THEN** it fetches the graph from `GET /api/graph` and renders a force-directed network diagram.
- **WHEN** rendering nodes:
  - **Size** represents **Importance/Priority** (High = Large, Medium = Medium, Low = Small).
  - **Color** represents **Depth/Category**:
    - *Basic Core*: Violet/Purple (e.g., Class, Object, Inheritance, Encapsulation)
    - *Advanced Core*: Blue/Cyan (e.g., Multiple Inheritance, Metaclasses, Mixins)
    - *SOLID Principles*: Emerald/Green
    - *Design Patterns*: Rose/Red
- **WHEN** hovering over a node, **THEN** its dependencies (incoming/outgoing arrows) are highlighted, and a quick-info tooltip appears.
- **WHEN** clicking a node, **THEN** a detailed glassmorphic sidebar panel opens with:
  - Definition, rules, and trade-offs.
  - Common interview Q&A.
  - Interactive multi-language code snippets (Java, C++, Python, TS).
  - Prerequisites (links pointing to it) and next topics (links pointing from it).

### 3. Admin & Interactive Editor
- **WHEN** the user toggles "Admin Mode", **THEN** an inline editing interface is enabled:
  - Double-clicking the graph background allows adding a new node.
  - Dragging from one node to another creates a directed dependency link.
  - A form is provided in the sidebar to edit the selected node's properties (title, category, priority, details, code examples, interview questions).
  - Changes are synced directly to the backend via the APIs and saved in `graph.json`.

### 4. Harness Agent Skill: `hs-extract-oop`
- A custom agent skill located in `.agents/skills/hs-extract-oop/` will be defined.
- **WHEN** executed by the agent, **THEN** it accepts input parameters (e.g., search keywords or local file paths).
- **WHEN** active, **THEN** the skill:
  1. Searches the internet using Google/web search or reads local text/code.
  2. Synthesizes knowledge across multiple reliable programming sites (e.g., MDN, Refactoring.Guru, GeeksforGeeks, Microsoft Learn).
  3. Validates correctness and structures the concepts into node objects and dependency link objects.
  4. Merges/saves this data into `oop-kg/backend/data/graph.json` before building the app, ensuring the knowledge base is automatically pre-populated with high-quality material.

## Out of Scope
- User authentication and access control (the Admin Mode is a local toggle for review purposes).
- Cloud database hosting (all data is persisted in a local JSON file managed by the Express backend).
- **Persistent writes on Serverless**: Vercel serverless deployments run on a read-only filesystem. Node/link modifications made in Admin Mode are stored in the server's in-memory cache but do not persist permanently on disk. Users are warned via toast notifications to download (export) the JSON file to save their work.

## Acceptance Criteria
- [ ] **Directory Structure**: Separate `backend` (Express, Node) and `frontend` (D3.js, custom JS) inside `/oop-kg`.
- [ ] **Data Syncing**: Server runs on port `5000` (or `3000`), serves API endpoints, and edits `graph.json` in response to UI actions.
- [ ] **Vercel Deploy Support**: Root-level `vercel.json` routing client requests to static files and `/api` to Express serverless function `api/index.js` with memory backup fallbacks.
- [ ] **Visual Layout**: Force-directed network diagram with node sizes indicating Priority, node colors indicating Category, and directed arrows indicating dependencies.
- [ ] **Interactive Sidebar**: Clickable nodes pop open detailed reviews with multi-language code snippets and interview preparation cards.
- [ ] **Interactive Admin Panel**: Ability to add, modify, link, and delete nodes directly via the UI, syncing changes to the backend.
- [ ] **Harness Skill**: Working script/skill instructions under `.agents/skills/hs-extract-oop` capable of scraping/extracting knowledge and updating the JSON database file.
- [ ] **Premium Visuals**: Dark ambient background, glowing nodes, glassmorphic panel design, and smooth hover/click transitions.
