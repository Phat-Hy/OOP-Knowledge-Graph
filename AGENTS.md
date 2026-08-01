# AGENTS.md — AI Coding Assistant Guidelines

This document provides context, architecture overviews, and strict development conventions for any AI agents working in this repository.

## 🎯 Project Overview
This repository hosts the **OOP Interview Prep Knowledge Graph** application. It provides an interactive force-directed network diagram mapping basic OOP, advanced OOP, SOLID principles, and Design Patterns into a learning roadmap.

---

## 🏛️ System Architecture
* **Frontend**: Vanilla HTML5, CSS3, and JavaScript, leveraging **D3.js** for physics simulations and SVG renderings. Live details are managed via a tabbed sidebar (Overview, interview Q&As, and multi-language syntax guide tabs).
* **Backend**: **Node.js & Express** serving static assets and supporting REST API routes. Changes to the database sync to `oop-kg/backend/data/graph.json` using atomic file writes.
* **Serverless Compatibility**: On serverless environments (like Vercel), writes will fail due to read-only filesystems. The backend falls back to updating a global in-memory database cache and appends a `warning` header string to the JSON response. The frontend intercepts this warning to toast notification alerts to the user, advising them to download the mutated JSON manually.

---

## ⚡ Build, Run, and Test Commands
Agents must use the following scripts mapped at the root `package.json` for validation and executions:
* **Install dependencies**: `npm install`
* **Start local server**: `npm start`
* **Run automated API validation suite**: `npm test`
* **Run custom extractor parser skill check**: `npm run test:extract`

---

## 🔒 Crucial Development Conventions

### 1. Data Integrity & Serialization
* **Link sanitization**: D3.js mutates link arrays directly from string IDs (`source: "class"`) to full node objects (`source: { id: "class", title: "Class", ... }`).
* **Convention**: Any agent modifying, exporting, or writing graph links to the database or making POST requests MUST sanitize them back to clean string IDs. Never serialize full node objects in the `links` arrays within `graph.json`.
* **Dangling link prevention**: The frontend MUST filter out any links referencing non-existent nodes before passing them to the D3 simulation to prevent fatal thread crashes.

### 2. Security (XSS and CORS)
* **XSS Mitigation**: Never assign user-input fields or dynamic data (e.g. accordion headers or toast notifications) directly to `.innerHTML`. Always use `.textContent` or parse strings through `escapeHtml()` before injecting them.
* **CORS Settings**: Limit CORS domains in production; only use wildcards for local verify-backend testing.

### 3. Git Operations
* **Exclusions**: The `.agents/` folder contains local agent instructions and must never be staged or committed to origin branches. Staging is controlled via the `.gitignore` exclusions.
