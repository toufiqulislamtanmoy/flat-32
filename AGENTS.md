# AGENTS.md — Flat Mate (flat-32)

## Tech Stack

- **Next.js 16.2.4** (App Router) — NOT the version from training data
- **React 19.2.4**, **Tailwind CSS v4** (no `tailwind.config.js` — uses `@theme inline` in `globals.css`)
- **shadcn/ui base-nova style** — uses `@base-ui/react`, NOT `@radix-ui/react`
- **TypeScript** strict mode, path alias `@/*` → `./src/*`

## Critical: Next.js 16 Breaking Changes

- `middleware.ts` is deprecated → use `proxy.ts` instead (same location, same API, new name)
- Read the relevant guide in `node_modules/next/dist/docs/` before writing any Next.js code
- Build will emit a deprecation warning until `middleware.ts` is migrated to `proxy.ts`

## Commands

- `npm run dev` — dev server
- `npm run build` — production build (Turbopack)
- `npm run lint` — ESLint
- `npm run format` — Prettier
- `npx tsc --noEmit` — typecheck

No test suite exists. No CI workflows.

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Auth pages — standalone layout, no shared shell
│   ├── (main)/          # Dashboard — Navbar + Sidebar layout
│       ├── plans/       # Plan routes (create, [planId])
│   └── api/auth/        # NextAuth route handler
├── components/
│   ├── ui/              # shadcn/ui primitives (Button, Card)
│   ├── home/            # Homepage components (flat files)
│   ├── create-plan/     # Create Plan components (flat files)
│   ├── plan/            # Plan Details components (flat files)
│   ├── Auth/            # Auth forms (Formik + Yup)
│   ├── Navbar/          # Top nav (Index.tsx pattern)
│   └── Sidebar/         # Left sidebar (Index.tsx pattern)
├── lib/utils.ts         # cn() helper
├── auth.ts              # NextAuth v5 config
├── helper/axiosClient.ts
└── context/, hook/, provider/, providers/
```

## Component Conventions

- **shadcn/ui components**: `src/components/ui/` — add via `npx shadcn@latest add <component>`
- **Feature components**: flat `.tsx` files in `src/components/<feature>/`
- **Layout components**: PascalCase folder + `Index.tsx` (e.g. `Navbar/Index.tsx`)
- All use `"use client"` and default exports
- Props defined with TypeScript interfaces inline

## Forms

- **Formik + Yup** for forms (NOT react-hook-form)
- Auth forms use raw `<input>` with Tailwind classes, not shadcn Input
- Submit button pattern: `bg-linear-to-r from-gradient-start-rgb to-gradient-end-rgb`

## Design Tokens (globals.css)

Custom theme — use these Tailwind classes:
- `text-natural` (#0f172a) — headings
- `bg-primary` (#00d1ff) — brand cyan
- `bg-secondary` (#10b981) — emerald green
- `bg-login-background` (#f3f4f6) — page background
- `text-muted-foreground` (#6b7280) — secondary text
- `border-border` (#e5e7eb) — borders

## Auth

- NextAuth v5 beta (`next-auth@^5.0.0-beta.31`) with Credentials provider
- Backend at `NEXT_PUBLIC_BACKEND_URL` (port 5000)
- Middleware protects all routes except `/api/*`, `/_next/*`, `*.png`
- Unauthenticated users → `/login?from=<path>`
- Authenticated users on auth pages → `/`

## UI Specs

Feature specs live in `docs/ui/` as markdown files. Read the relevant spec before building a new page.

## Prettier

Semi, double quotes, 2-space indent, trailing commas `es5`, printWidth 100, `endOfLine: "lf"`.
