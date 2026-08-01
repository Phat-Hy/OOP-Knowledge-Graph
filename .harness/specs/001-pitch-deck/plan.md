# Plan: Gara Startup Project Showcase Pitch Deck

**Status:** approved

**Baseline:** No existing index.html. Baseline is a clean slate.

## Task 1: Setup HTML skeleton & Slide Presentation framework
- Spec: Slide Presentation Engine (Req 2), Self-Contained Implementation (Req 5)
- Files: `index.html`
- Do:
  - Create the standard HTML skeleton with responsive 16:9 viewport boundaries.
  - Implement CSS variables for colors (dark slate bg, white text, primary violet/cyan gradients) and typography (Inter font).
  - Implement navigation controls in Javascript (ArrowLeft/ArrowRight, Spacebar, Prev/Next UI buttons, and touch swipes).
  - Add presenter notes overlay drawer toggled by hitting 'N' or clicking a toolbar button.
- Verify: Test file creation.

## Task 2: Build Pitch Deck Content Slides (Slides 1-11)
- Spec: Slide Structure (Req 1), Visual Aesthetics (Req 4)
- Files: `index.html`
- Do:
  - Implement layout structures for all 11 slides:
    - Cover page: Title, subtitle, background visual elements.
    - Problem & Solution: Grid layouts with highlights.
    - Market Size: Interactive or clean SVG TAM/SAM/SOM diagram.
    - Product slide: Placeholder containing launcher for Task 3.
    - Business Model: Monitization breakdown cards.
    - Go-To-Market: Phased timeline.
    - Competition: Sleek matrix comparison table.
    - Team: Flex cards for each member.
    - Financials & The Ask: Projected metrics graphs (via SVG/CSS) and funding requirements.
- Verify: Review slide content completeness.

## Task 3: Implement Gara Showcase Interactive MVP Simulator
- Spec: Interactive MVP Simulator (Req 3)
- Files: `index.html`
- Do:
  - Build a mock iframe/container on Slide 4 representing the active mobile/desktop interface.
  - Code simulated SSO login flow.
  - Code standard views:
    - Discovery Feed: Grid of startup projects with search, category filtering, and status badges.
    - Project Details Modal: Markdown description, interactive milestone timeline.
    - Job Board: Filterable roles (Dev, Biz, Design, Marketing) with a simulated application count and 3-application cap check.
    - Admin Panel: Health overview dashboard displaying at-risk/suspended indicators, with actionable "Approve", "Resolve Flag" or "Archive" options.
  - Bridge state: Ensure updates in Admin panel immediately propagate to the Discovery feed and status badges.
- Verify: Test interactive features manually.

## Task 4: UI Polish & Responsive Optimization
- Spec: Visual Aesthetics & Polish (Req 4), Self-Contained Implementation (Req 5)
- Files: `index.html`
- Do:
  - Add glassmorphism styling, hover micro-animations, slide transitions.
  - Test responsive layout on mobile screens, adapting the slide viewport to a vertical scroll layout or scaled view.
- Verify: Open in browser and run validation checks.
