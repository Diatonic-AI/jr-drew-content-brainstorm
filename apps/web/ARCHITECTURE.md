# Frontend Architecture

- **Framework:** React 18 with Vite bundler.
- **State management:** Zustand stores under `src/stores` (tracking, focus, breaks, projects, tasks, settings, auth, notifications, AI).
- **Routing:** React Router with configuration in `src/routes/index.tsx`, consumed through `AppRoutes`.
- **UI layer:** Tailwind CSS with custom utility components in `src/components/ui` and feature components grouped by domain (`dashboard`, `focus`, `breaks`, `productivity`, etc.).
- **Data models:** Strongly typed TypeScript interfaces under `src/types` for activity, tracking, focus, breaks, projects, tasks, scores, integrations, settings, user, AI, and workblocks.
- **Services:** Fetch wrappers located at `src/services` for tracking, focus, breaks, projects, tasks, integrations, notifications, analytics.
- **Tracking & AI libs:** Core logic in `src/lib/tracking` (window monitor, classifier, metadata extractor) and `src/lib/ai` (OpenAI client, voice assistant, productivity coach).
- **Utilities:** Date/time/formatting helpers in `src/lib/utils` and constants in `src/lib/constants` for consistent configuration.
