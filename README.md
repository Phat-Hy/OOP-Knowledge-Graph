# OOP Interview Prep Knowledge Graph

An interactive, high-fidelity dark-themed web application designed for reviewing and preparation of basic and advanced Object-Oriented Programming (OOP) concepts, SOLID principles, and Design Patterns.

## 🚀 Live Site
The application is deployed on Vercel:
🔗 **[https://oop-knowledge-graph.vercel.app](https://oop-knowledge-graph.vercel.app)**

## 📁 Repository Structure
* `/oop-kg` — Core codebase directory.
  * `/oop-kg/backend` — Express.js REST API server + JSON database storage.
  * `/oop-kg/frontend` — Interactive D3.js force-directed graph UI (glassmorphism styles, glowing node spheres, canvas grids, details sidebars, Q&A panels, code snippets, study progress tracker, and admin interface).
* `/api` — Vercel serverless function entry wrapper.
* `/.agents` — Agentic harness settings, rules, and custom automation skills.
* `/.harness` — Specifications, plans, progress logs, and verification evidence.

## 🛠️ Local Development & Running
### Prerequisites
* Node.js (version 18 or above recommended)
* npm (package manager)

### Installation
Run the following command at the root of the repository to install backend dependencies:
```bash
npm install
```

### Start Server
To start the backend server locally (running on port `5000` by default):
```bash
npm start
```
Once started, open your browser and navigate to `http://localhost:5000` to interact with the web application.

## 🚦 Testing
To run the automated verification test suite checking API endpoints and graph mutation behaviors:
```bash
npm test
```

## 🤖 Custom Extractor Skill
The project includes a custom agent skill capable of parsing inheritance relationships from code files (Java, Python, C++, TypeScript) and automatically updating the graph database.

To test the extractor skill locally with mock cards:
```bash
npm run test:extract
```

## 📄 License
Licensed under the [MIT License](LICENSE).
