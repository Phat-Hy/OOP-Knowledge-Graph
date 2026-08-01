# Spec: Gara Startup Project Showcase Pitch Deck

**Status:** approved

## Goal
Design and develop an interactive, presentation-ready web pitch deck for "Gara Startup Project Showcase" conforming to the standards of the EXE (Experiential Entrepreneurship) startup program. The final deliverable must be a single, self-contained, responsive HTML file that can be used for presentations and includes an embedded interactive prototype of the application.

## Requirements
1. **Slide Structure**: The pitch deck must contain exactly 11 slides corresponding to the standard EXE startup evaluation rubrics:
   - **Slide 1: Cover Page** (Trang bìa) - Project name, logo, tagline, and details of the presenter/founders.
   - **Slide 2: Problem Statement** (Vấn đề) - Explains the "black box" in student incubators, interdisciplinary talent shortages, and administrative tracking friction.
   - **Slide 3: Solution** (Giải pháp) - Introduces Gara Showcase as a centralized hub connecting founders, students, and mentors.
   - **Slide 4: Product MVP & Key Features** (Sản phẩm & MVP) - Offers an interactive prototype of the Gara Showcase app.
   - **Slide 5: Market Size** (Quy mô thị trường) - Displays the TAM, SAM, and SOM calculations with a dynamic visual diagram.
   - **Slide 6: Business Model** (Mô hình kinh doanh) - Details how Gara Showcase monetizes (SaaS licenses for universities, recruiter fees, sponsorship ads).
   - **Slide 7: Go-To-Market Strategy** (Chiến lược tiếp cận) - Details the phased rollout from pilot to inter-university expansion and accelerator integrations.
   - **Slide 8: Competitive Landscape** (Cạnh tranh) - Features a comparison matrix contrasting Gara against general job boards (TopCV), project management tools (Trello), and manual reporting (Excel).
   - **Slide 9: Founding Team** (Đội ngũ sáng lập) - Profiles the core team roles (Tech Lead, Product Manager, UI/UX Designer) suited for EXE development.
   - **Slide 10: Financial Plan & Milestones** (Kế hoạch tài chính & Lộ trình) - Lays out the 3-year financial projections (ARR, active users) and project roadmap.
   - **Slide 11: The Ask & Contact** (Kêu gọi & Liên hệ) - The funding request ($50,000 seed grant) and official contact details.

2. **Slide Presentation Engine**:
   - **Transitions**: Smooth page transitions (e.g. horizontal slide, fade, or scale) between slides.
   - **Navigation**: Support for multiple navigation inputs:
     - Keyboard arrow keys (Left/Right) and Spacebar.
     - Visible floating on-screen navigation buttons (Prev/Next).
     - Bottom progress bar showing the active position (e.g., 4/11).
     - Fullscreen toggle button.
   - **Presenter Tools**: A sidebar showing slide-by-slide presenter notes (ghi chú người thuyết trình) that can be toggled on/off.

3. **Interactive MVP Simulator**:
   - Inside Slide 4, the user must be able to click "Trải nghiệm Demo" (Launch Demo) to open an interactive, responsive mockup of the Gara Showcase system.
   - The simulator must support:
     - **Landing Page / Discovery Feed**: A dashboard displaying active startup cards, search filters, and status badges (e.g., "Active", "At-Risk", "Suspended").
     - **Project Profile Page**: Clicking on a startup must display its details, rich-text description, and visual milestone timeline (FR-002, FR-003, FR-004).
     - **Role Posting Board & Application Modal**: Browsing open positions (Engineering, Business, Design, Marketing), viewing role requirements, and triggering a simulated 1-click application (FR-005, FR-006).
     - **SSO Simulation**: Activating a mock SSO login prompt when performing actions requiring authentication.
     - **Incubator Admin Dashboard**: An admin panel displaying metrics (Active Projects, Placements, At-Risk warnings) and actions to resolve flags (FR-007, BR-07, BR-08).

4. **Visual Aesthetics & Polish**:
   - The styling must follow a premium startup aesthetic: deep dark background (`#0b0f19` or similar) with vibrant gradients (e.g. purple to neon blue), clean typography (Inter font), glassmorphism styling, and micro-interactions on hovers/clicks.
   - The layouts must be responsive, working on desktop displays (standard 16:9 presentation layout) and mobile screens.

5. **Self-Contained Implementation**:
   - All HTML, CSS (Vanilla CSS), and Javascript must be contained within a single file (`index.html`) to ensure ease of deployment and usage. No external framework installations are permitted. Internal SVG assets and standard Google Fonts are allowed.

## Out of Scope
- **Backend Database**: Data does not persist across page reloads. All simulated state (such as submitting applications, updating milestones) resides in the browser's memory.
- **Real SSO Integration**: Authentication is entirely simulated client-side.
- **Production File Uploads**: Media uploads will be simulated in the CMS editing view without actual server-side storage.

## Acceptance Criteria
- [ ] Presenting: Slide deck navigation operates via keyboard (Left/Right/Space) and clicking controls.
- [ ] Contents: All 11 slides are present with detailed Vietnamese content based on the project's BRD and PRD.
- [ ] Visuals: TAM/SAM/SOM diagram and Competitive Matrix are drawn dynamically via CSS/SVG.
- [ ] MVP Simulator: Launching the prototype on Slide 4 exposes 4 working views: Project Showcase, Project Detail with Timeline, Role Recruitment Board, and Admin Health Dashboard.
- [ ] Business Logic in Simulator:
  - Submitting applications increments active count; block application when reaching the limit of 3 concurrent applications.
  - Admin dashboard allows dismissing warnings or restoring suspended projects, which updates their badges in the main view.
- [ ] Single File: Entire application compiles into a single, dependency-free `index.html` file that opens directly in any browser.
