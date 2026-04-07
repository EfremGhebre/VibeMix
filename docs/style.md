## VibeMix Style Guide

This guide keeps the UI and codebase consistent as features evolve.

## Stack and Structure

- React + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- React Router for pages
- Supabase for auth, storage, and edge functions

Use this structure:

- `src/pages` for route-level screens
- `src/components/<domain>` for feature UI
- `src/components/ui` for shared primitives only
- `src/contexts` for app-wide state
- `src/lib` for shared helpers
- `src/integrations/supabase` for Supabase client/types

## UI and Design Rules

- Prefer semantic theme classes (`bg-background`, `text-foreground`, `text-muted-foreground`, `border`).
- Prefer existing component variants before introducing custom one-off styles.
- Keep layouts simple and responsive (mobile-first).
- Keep animations subtle and purposeful.
- Use consistent spacing rhythm (Tailwind scale).

## Component Rules

- Keep components focused and readable.
- Lift shared state to page/context when logic grows.
- Reuse `Button`, `Card`, `Badge`, `Dialog`, etc. from `src/components/ui`.
- Avoid duplicating near-identical components.

## Data and Supabase Rules

- Use the shared Supabase client from `src/integrations/supabase/client`.
- Validate inputs in edge functions and fail with clear messages.
- Keep sensitive keys server-side only.
- Keep client behavior aligned with deployed edge functions.

## UX and Messaging

- Use `useToast` for user feedback.
- Keep messages short, clear, and actionable.
- Prefer non-blocking UI feedback over disruptive patterns.

## TypeScript and Code Style

- Use explicit types for exported APIs/components.
- Prefer descriptive names and early returns.
- Keep comments minimal and explain intent ("why"), not obvious behavior ("what").
- Remove dead code and unused imports during each change.

## Routing and Layout

- Keep provider order in `src/App.tsx` intact unless there is a strong reason.
- Add routes above the `*` fallback route.
- Keep page shell consistent: header, main content, footer.

## Quality Gate Before Push

1. Run lint and fix introduced issues.
2. Remove unused files/imports created during refactors.
3. Confirm docs still match current architecture.
4. Verify key flows manually (Discover -> Generate -> Saved Vibes).


