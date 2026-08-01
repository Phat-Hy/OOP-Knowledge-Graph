# Plan: OOP Interview Prep Knowledge Graph

**Status:** approved

**Baseline:** No existing `oop-kg` directory or files. The baseline is a clean slate.

## Task 1: Initialize Backend Structure and REST API
- Spec: Architecture & Data Flow (Req 1)
- Files:
  - `oop-kg/backend/package.json`
  - `oop-kg/backend/server.js`
  - `oop-kg/backend/data/graph.json`
- Do:
  - Create the `oop-kg/backend` directory structure.
  - Define `package.json` with dependencies: `express`, `cors`.
  - Create `server.js` to implement API endpoints:
    - `GET /api/graph`: Returns the current graph state.
    - `POST /api/nodes`: Adds or updates a node.
    - `POST /api/links`: Adds a dependency link between two nodes.
    - `DELETE /api/nodes/:id`: Removes a node and all incoming/outgoing links.
    - `DELETE /api/links`: Removes a connection between two nodes.
    - `POST /api/import`: Replaces the graph with imported JSON.
  - Create initial default graph file `data/graph.json` containing mock OOP concepts (Class, Object, Encapsulation, Inheritance, Polymorphism, Abstraction) and standard dependencies.
  - Configure `server.js` to serve static files from `oop-kg/frontend/`.
- Verify: Create a test script `oop-kg/backend/verify-backend.js` that starts the server, fires test HTTP requests to each endpoint, validates responses, and terminates the server. Run via: `node oop-kg/backend/verify-backend.js`

## Task 2: Create Interactive Knowledge Graph Frontend
- Spec: Interactive Knowledge Graph UI (Req 2)
- Files:
  - `oop-kg/frontend/index.html`
  - `oop-kg/frontend/style.css`
  - `oop-kg/frontend/app.js`
- Do:
  - Create a premium dark-themed web layout with glassmorphic cards.
  - Integrate D3.js (via CDN link) in `index.html` to render the force-directed graph.
  - In `app.js`, fetch the graph from `GET /api/graph` and draw the network of nodes and directed links.
  - Implement visual mappings:
    - Node Size: High priority (Large, 24px radius), Medium (Medium, 16px), Low (Small, 10px).
    - Node Color: Purple (Basic Core), Cyan (Advanced Core), Green (SOLID), Red/Rose (Design Patterns).
    - Edge Direction: Display arrowheads on links showing dependency direction.
  - Implement hover highlights for paths/tooltips and click actions to open the sidebar.
  - Populate the glassmorphic sidebar dynamically with concept details, code snippets (Java, C++, Python, TS), and interview Q&A cards.
- Verify: Run the server and check frontend rendering in the browser.

## Task 3: Develop Admin & Interactive Editor
- Spec: Admin & Interactive Editor (Req 3)
- Files:
  - `oop-kg/frontend/index.html`
  - `oop-kg/frontend/app.js`
  - `oop-kg/frontend/style.css`
- Do:
  - Add an Admin Mode toggle button on the navbar.
  - When Admin Mode is active:
    - Show an "Add Node" form and drag controls to create directed links between nodes.
    - Add edit fields and a delete button to the sidebar for the selected node.
    - Send API requests to backend on edits (node save, link creation, delete).
    - Add "Import JSON" (file selector) and "Export JSON" (triggers browser download of `graph.json`).
- Verify: Edit nodes, create links, and delete items from the UI and verify that the file `oop-kg/backend/data/graph.json` updates in real-time.

## Task 4: Implement Harness Agent Skill `hs-extract-oop`
- Spec: Harness Agent Skill: `hs-extract-oop` (Req 4)
- Files:
  - `.agents/skills/hs-extract-oop/SKILL.md`
  - `.agents/skills/hs-extract-oop/extract.js`
- Do:
  - Create `.agents/skills/hs-extract-oop/SKILL.md` describing how the skill is invoked and its inputs/outputs.
  - Implement `extract.js` to parse code repositories, scan text documents, or perform search queries.
  - Implement a web-search integration within the script or using our built-in capabilities to crawl OOP details, analyze concepts, automatically determine their priority/difficulty level, establish prerequisite links, validate correctness, and merge results back into `oop-kg/backend/data/graph.json`.
- Verify: Run `node .agents/skills/hs-extract-oop/extract.js --test` and confirm that it outputs structured data, validates it, and writes it successfully to the database.

## Task 5: Configure Vercel Deployment Support
- Spec: Vercel Deploy Support (Req 3)
- Files:
  - `vercel.json`
  - `package.json`
  - `api/index.js`
  - `oop-kg/backend/server.js`
  - `oop-kg/frontend/app.js`
- Do:
  - Create root `vercel.json` to route `/api` requests to `api/index.js` and all other requests to static assets in `oop-kg/frontend/`.
  - Create root `package.json` specifying dependencies (`express` and `cors`) so that Vercel serverless environment builds correctly.
  - Create serverless entry point `api/index.js` that imports and exports the Express app instance.
  - Update `oop-kg/backend/server.js` to conditionally listen on port ONLY when executed directly, and implement memory cache fallback for write errors.
  - Update `oop-kg/frontend/app.js` to parse warning messages and show notifications to users when writes are cached temporarily on serverless.
- Verify: Run the backend test verification script to ensure local execution remains unbroken, and check that static assets are routed correctly.
