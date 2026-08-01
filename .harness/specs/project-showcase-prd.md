# Product Requirements Document

## Business Capabilities
## Business Capabilities

| Goal | User Segment | Business Value | Scope |
| :--- | :--- | :--- | :--- |
| Project Profile Management | Startup Founder | Enables project visibility and milestone tracking, creating a unified directory of active university innovations. | Supports profile creation, editing, publishing, and roadmap timeline generation. Storage limit is strictly capped at a hard limit of 500MB per project. |
| Talent Acquisition | General Student | Connects students with startup opportunities and provides hands-on, cross-disciplinary experience. | Supports job board browsing, filtering, and application submission. Students are restricted to a maximum of 3 concurrent pending applications. |
| Ecosystem Oversight | Incubator Manager | Ensures platform health and policy compliance through automated data tracking and direct interventions. | Supports automated 14-day inactivity flagging, 30-day non-update suspension triggers, and CSV performance reporting. |
| Public Information Access | Guest | Provides transparency of the startup ecosystem to external partners, investors, and prospective students. | Supports read-only viewing of public projects and active job listings. |
| Platform Access & Security | Guest, Founder, Student, Manager | Maintains platform data integrity and prevents unauthorized profile modifications. | Supports RBAC with authentication strictly delegated to the university's central identity manager via OAuth2/OIDC. |
## Functional Requirements
# Functional Requirements

## Functional Requirements

The following requirements define the core behavior of the Gara Startup Project Showcase, mapped by priority to the approved Scope Capabilities.

### 1. P0 Requirements: Core Startup Visibility

#### FR-001: SSO Authentication Integration
*   **Business Capability:** Platform Access & Security
*   **Requirement:** The system shall delegate all user authentication to the university’s central identity manager using OAuth2/OIDC.
*   **Acceptance Criteria:**
    *   **Given** a guest or user, **When** accessing a restricted feature, **Then** the system must redirect to the university SSO provider.
    *   **Given** a valid authentication response, **When** the user is redirected back, **Then** the system must initialize a local session based on the provided identity token.

#### FR-002: Project Profile Management
*   **Business Capability:** Project Profile Management
*   **Requirement:** Admitted startup teams shall be able to create, edit, and publish project profiles.
*   **Acceptance Criteria:**
    *   **Given** a verified founder account, **When** creating a profile, **Then** the user can save project details and media.
    *   **Given** a project, **When** uploading files, **Then** the system must enforce a 500MB total storage cap and reject any asset that causes the total to exceed this limit.

#### FR-003: Rich-Text & Media Gallery
*   **Business Capability:** Project Profile Management
*   **Requirement:** Startup profiles must support rich-text descriptions and media file uploads.
*   **Acceptance Criteria:**
    *   **Given** an active profile edit mode, **When** adding a content block, **Then** the user can toggle between rich-text entry and media upload.

#### FR-004: Asynchronous Milestone Tracker
*   **Business Capability:** Project Profile Management
*   **Requirement:** Founders must be able to document project milestones independently.
*   **Acceptance Criteria:**
    *   **Given** a project dashboard, **When** a founder adds a milestone, **Then** the system must store a timestamped record.

### 2. P1 Requirements: Marketplace & Oversight

#### FR-005: Role Posting Board
*   **Business Capability:** Talent Acquisition
*   **Requirement:** Startups shall be able to list available talent roles.
*   **Acceptance Criteria:**
    *   **Given** a startup profile, **When** the user accesses the role management tab, **Then** they can define role requirements and publish to the public board.

#### FR-006: Simplified Application Flow
*   **Business Capability:** Talent Acquisition
*   **Requirement:** Students shall be able to apply to listed roles with a limit on concurrent applications.
*   **Acceptance Criteria:**
    *   **Given** a student with 3 pending applications, **When** they attempt to submit a new application, **Then** the system must block the action and display an error message.

### 3. P2 Requirements: Ecosystem Maintenance

#### FR-007: Automated Inactivity Flagging
*   **Business Capability:** Ecosystem Oversight
*   **Requirement:** The system shall automatically monitor project activity and trigger status changes.
*   **Acceptance Criteria:**
    *   **Given** a project with no updates for 14 days, **When** the 15th day is reached, **Then** the system sets the status to "Flagged for Inactivity."
    *   **Given** a project flagged for 16 days, **When** the 31st day is reached, **Then** the system sets the status to "Suspended."
## Non-Functional Requirements
# Non-Functional Requirements: Gara Startup Project Showcase

## Non-Functional Requirements

### Performance
* **Load Time:** The platform must load core project profile pages in under 2 seconds on standard 4G mobile connections.
* **Concurrency:** The system shall support at least 50 concurrent active users without degradation in service response times.
* **Storage Limit:** File uploads are strictly capped at 500MB per startup project to manage storage costs and performance.

### Availability
* **Uptime:** The platform shall maintain 99.5% uptime during university operational hours (08:00–18:00, Mon–Fri).
* **Maintenance:** Scheduled maintenance must be communicated 48 hours in advance and scheduled during off-peak hours (00:00–06:00).

### Security
* **Authentication:** Integration with the university's central identity provider (SSO) is mandatory; no local credential storage permitted.
* **Data Privacy:** All user data must be handled in compliance with university privacy policies; PII must be encrypted at rest and in transit.
* **Roles & Permissions:** Role-based access control (RBAC) must restrict profile editing capabilities exclusively to authorized team members and administrators.

### Usability
* **Responsiveness:** The UI must be fully responsive, ensuring optimal navigation on devices ranging from smartphones to desktop browsers.
* **Accessibility:** The interface must meet Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards to ensure all students can interact with the platform.
* **Onboarding:** A user with a standard university account must be able to navigate to the project creation tool within three clicks from the home page.

### Maintenance
* **Scalability:** System architecture must support modular growth, allowing for future integration of additional features (e.g., automated reporting) without requiring a full system redesign.
* **Logging:** All administrative actions (e.g., profile suspension, flag removal) must be logged for audit purposes.

### Compliance
* **Regulatory:** The platform must adhere to institutional intellectual property (IP) policies, ensuring student-owned IP is protected and not inadvertently exposed publicly.
* **Moderation:** Automated rule-based flagging must be implemented to manage content without requiring full-time staff moderation.
