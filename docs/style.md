## VibeMix Project Style Guide

This short guide captures the conventions we’ll follow to keep the current aesthetic and structure consistent as we add features.

### Tech & Architecture
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom CSS variables; shadcn-ui primitives built on Radix
- **Routing**: React Router v6
- **Data/Server**: Supabase client-side SDK
- **Async**: TanStack Query for data fetching and caching

### Project Structure
- Keep feature code under `src/components/<area>` and `src/pages` for routes
- Shared UI primitives live in `src/components/ui` and should be reused, not forked
- Contexts live in `src/contexts`; keep them small, composable, and focused
- Shared helpers in `src/lib` (e.g., `utils.ts`); avoid duplicating helpers in components
- Supabase integration under `src/integrations/supabase`

### Design System
- Use Tailwind tokens defined in `tailwind.config.ts` (e.g., `bg-background`, `text-foreground`, `text-muted-foreground`, `border`, `primary`, `accent`)
- Prefer existing animations (`animate-fade-in`, `slide-up`, `pulse-glow`, etc.) and shadows (e.g., `shadow-elevated`)
- Avoid hard-coded colors; rely on semantic tokens and `hsl(var(--...))`
- Maintain spacing/padding harmony (base 4px scale via Tailwind spacing)

### Components
- Build with shadcn primitives from `src/components/ui` (e.g., `Button`, `Card`, `Dialog`, `Tabs`)
- Keep components **presentational and focused**; lift state to pages/contexts when it grows
- Use **controlled inputs** and `react-hook-form` where forms are non-trivial
- Co-locate component-specific helpers/types next to the component if they aren’t shared

### State & Data
- Use `AuthContext` for auth state; don’t reinvent local auth state
- Use TanStack Query for server data; prefer `useQuery`/`useMutation` over ad-hoc `useEffect` fetches
- Keys: namespace by feature, e.g., `['profile', userId]`
- Keep mutations optimistic only when UX demands it; otherwise, prefer refetch on success

### Auth & Supabase
- Use `supabase` from `src/integrations/supabase/client`
- Listen to auth changes via `onAuthStateChange`; handle `SIGNED_IN`, `SIGNED_OUT`, `TOKEN_REFRESHED`, `USER_UPDATED`
- For profiles, prefer `upsert` with `onConflict: 'user_id'` to avoid duplicates
- Keep user-facing messages via `useToast` with consistent titles/descriptions

### UX & Feedback
- Use `useToast` for notifications; avoid `alert`
- Use existing overlay pattern for blocking flows (e.g., signing out)
- Keep page transitions subtle; avoid introducing new, heavy animations

### TypeScript & Code Style
- Exported/public functions and components should have explicit types
- Prefer descriptive names (avoid 1–2 letter vars)
- Use early returns over deep nesting; handle error/edge cases first
- Keep comments minimal and “why”-focused; avoid inline noise

### Routing & Layout
- Keep `App.tsx` providers order intact: Query > Theme > Language > Router > Auth > AuthWrapper > Tooltip/Toasters
- Add new routes in `App.tsx` above the catch-all `*` route
- Maintain layout: `Header` then `<main className="flex-1">` and `Footer`

### Tailwind Conventions
- Order classes logically: layout (flex/grid) → size → spacing → borders → colors → effects → animations
- Avoid arbitrary values unless necessary; prefer tokens and existing utilities
- Use responsive modifiers sparingly and consistently (`md:`, `lg:`), keeping mobile-first defaults

### Testing & Linting
- Run `npm run lint` before PRs; fix obvious issues or annotate with rationale when needed
- Prefer small, focused PRs that map to a single feature or improvement

### When Adding New Features
1. Reuse `src/components/ui` primitives first
2. Follow existing spacing, colors, and motion patterns
3. Place new shared utilities in `src/lib`, not in components
4. Use `useToast` for success/error feedback
5. Wire data through TanStack Query; avoid redundant local state

If a change requires deviating from these rules, call it out explicitly in the PR description with the rationale.


