# Bzzy Public Landing Page

Bzzy is a two-sided marketplace app for web, iOS, and Android designed to make finding and booking local landscaping help as simple as making a restaurant reservation.

For homeowners, it provides a free way to search by service and location, explore contractor profiles, request booking times, and keep project communication in one place.

For landscaping contractors, Bzzy provides tools for managing availability, jobs, leads, and client conversations. Contractors can also connect services such as Google Calendar and Jobber, with optional profile boosts and premium features designed to improve local visibility.

Bzzy coordinates discovery, scheduling, and communication. Payments for the underlying work remain directly between the client and contractor.

## Product Experience

Bzzy was developed around two connected but distinct workspaces:

- **Client experience:** local contractor discovery, map and service filtering, profiles, booking requests, upcoming jobs, and direct messages.
- **Contractor experience:** lead management, scheduling, availability, client messages, business profile management, and integration workflows.

The same account can support both experiences without mixing their navigation or data context. The interface is designed responsively across desktop browsers, compact phones, modern iPhones with display cutouts, and mobile keyboard states.

## Development Approach

The application has been built as a shared cross-platform product rather than separate web and mobile implementations. React Native and Expo provide the common application layer, while platform-specific files are used where browser and native behavior genuinely differ.

Important engineering principles include:

- Safe-area-aware layouts for notches, status bars, home indicators, and mobile browser chrome.
- Keyboard-resilient forms and message composers with reachable controls at compact heights.
- Explicit client and contractor workspace state so navigation cannot silently change account context.
- Responsive navigation patterns tailored to desktop sidebars and mobile bottom tabs.
- Supabase row-level security and forward-only migrations as release requirements.
- Feature-gated provider integrations so external services can be introduced safely.
- Automated visual, workflow, API, and database regression coverage.

## Monorepo Structure

```text
Bees-app/
|-- Bees-frontend/   React Native and Expo application
|-- bees-backend/    FastAPI services and provider integrations
|-- design/          Design system references and reusable visual assets
|-- supabase/        Database migrations, schema history, tests, and templates
|-- docs/            Internal operational and engineering references
`-- .github/         Continuous integration and scheduled workflows
```

The frontend and backend live in the same repository but remain independently deployable. Database migrations are maintained as source code, while reusable design assets are kept separate from runtime application assets.

## Tech Stack

| Area | Technologies |
| --- | --- |
| Client application | React Native, Expo, Expo Router, TypeScript, React Native Web |
| Mapping and UI | MapLibre, React Native SVG, Skia, responsive platform-specific components |
| Backend | Python, FastAPI, Pydantic, Uvicorn |
| Data platform | Supabase Postgres, Auth, Storage, Realtime, and Row Level Security |
| Integrations | Google Calendar, Jobber, Stripe, Expo Notifications |
| Observability | Sentry and privacy-aware analytics |
| Testing | Playwright, pytest, pgTAP, TypeScript, and ESLint |
| Delivery | GitHub Actions, Expo tooling, and Render |

## Engineering Requirements

The development toolchain currently targets:

- Node.js 22 and npm for the Expo application and browser test suite.
- Python 3.13 for backend services and tests.
- Expo-compatible iOS, Android, or browser environments for client validation.
- Supabase CLI and a local container runtime for migration and database-policy testing.
- Platform build tools when producing native binaries outside managed Expo workflows.

Environment-specific credentials and production configuration are intentionally excluded from this public overview.

## Quality and Security

Changes are validated through a combined pipeline that includes frontend linting and type checking, production web export, Chromium and WebKit workflows, screenshot regression tests, backend unit and API tests, migration replay, and database security assertions.

The application separates public client configuration from server-only secrets. Sensitive provider operations are handled by backend services, and database access is constrained through reviewed migrations and row-level policies. Authentication, account recovery, logging, and scheduled integration jobs are tested as security-sensitive workflows.

## Project Status

Bzzy is under active private development. The repository is proprietary and is not distributed as open-source software. Third-party libraries and framework-derived files retain their respective licenses.

Copyright © 2026 Bzzy. All rights reserved.
