<!--
Sync Impact Report:
- Version change: [N/A] → 1.0.0
- Modified principles:
  - Added: Clean Code
  - Added: Simple/Minimal UX
  - Added: Responsive Design
  - Added: Minimal Dependencies
  - Added: Absolutely No Testing (Supersedes Any Other Guidance)
- Added sections: Technology Stack
- Removed sections: N/A
- Templates requiring updates:
  - ✅ updated: .specify/templates/plan-template.md (Removed testing references)
  - ✅ updated: .specify/templates/spec-template.md (Removed independent test references)
  - ✅ updated: .specify/templates/tasks-template.md (Removed test tasks and test checkpoints)
- Follow-up TODOs: None
-->

# collab Constitution

## Core Principles

### I. Clean Code
Code MUST be clean, simple, readable, and maintainable.

### II. Simple/Minimal UX
The user interface MUST be simple, minimal, and intuitive without unnecessary complexity.

### III. Responsive Design
The application MUST be fully responsive and work seamlessly across all devices and screen sizes.

### IV. Minimal Dependencies
The project MUST use as few external dependencies as possible. Evaluate alternatives and standard libraries before adding new packages.

### V. Absolutely No Testing (Supersedes Any Other Guidance)
There MUST be absolutely no testing in this project. No unit tests, no integration tests, no e2e tests. This rule supersedes any other guidance or best practices.

## Technology Stack

The project MUST use the following technologies:
- **Framework/Library**: Next.js and React
- **Styling**: Tailwind CSS
- **Language**: TypeScript. When writing TypeScript code, you MUST use the latest arrow-based functions (introduced in ES6+).

## Governance

- All pull requests and code reviews must verify compliance with the core principles.
- The "Absolutely No Testing" principle is strict and cannot be bypassed.
- Amendments to this constitution require documentation, approval, and a version bump.

**Version**: 1.0.0 | **Ratified**: 2026-07-10 | **Last Amended**: 2026-07-10
