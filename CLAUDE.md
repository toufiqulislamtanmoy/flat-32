# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Current state notes (not yet reflected in AGENTS.md)

- `src/middleware.ts` still exists and is in active use — the repo has **not** migrated to `proxy.ts` yet. Don't assume the migration happened; check which file exists before editing auth-guard logic.
- Feature pages are mid-migration from static mock data to live API data. `src/app/(main)/page.tsx` and the `plans/[planId]` detail sub-components (e.g. `PlanCard`, `SummaryCards`) still read from each feature's local `mock-data.ts`, while `PlanHeader` and the create-plan flow already call the backend via `axiosClient` + React Query. When touching a plan/home component, check whether it has been converted yet rather than assuming either pattern.

## Provider composition (`src/app/layout.tsx`)

Root layout nests providers in this fixed order — preserve it when adding a new global provider:

```
StoreProvider (Redux Toolkit store)
  → AuthProviders (NextAuth SessionProvider → AuthContext)
    → QueryClientProviderLocal (TanStack Query)
      → AlertProvider
        → ModalProvider
          → {children}
          → GlobalModal
```

- `AuthProviders` wraps NextAuth's `SessionProvider` and re-exposes the session through `AuthContext`/`useAuthData()` (`src/context/AuthContext.tsx`, `src/hook/useAuthData.tsx`) — components should read auth state via `useAuthData()`, not `useSession()` directly.
- A single `QueryClient` is created per render in `QueryClientProviderLocal` (`src/provider/QueryClientProviderLocal.tsx`) — no custom `staleTime`/`retry` defaults are configured, so set them per-`useQuery` call if needed.

## Global state (Redux Toolkit)

- The store lives in `src/store/store.ts` (currently an empty `combineReducers({})` — no slices yet) and is wired up via `src/providers/StoreProvider.tsx` in root layout. Typed hooks are in `src/store/hooks.ts` (`useAppDispatch`, `useAppSelector`) — use these instead of the raw `useDispatch`/`useSelector` from `react-redux`.
- Reach for Redux only for state that's genuinely global and shared across unrelated component trees. Local form state stays in Formik; server data stays in TanStack Query; per-feature UI state (e.g. modal open/close) stays in its own context. Add a new slice under `src/store/slices/<name>Slice.ts` and register it in `rootReducer` when a real need shows up — don't pre-populate the store with speculative state.

## Global modal system

Don't render ad-hoc `Dialog` instances for app-level modals (invite member, add transaction, etc.). Use the shared system instead:

- `src/components/shared/modal/ModalContext.tsx` — `useModal()` exposes `openModal({ content, title?, ... })` / `closeModal()`; only one modal can be open at a time (single `ModalState`, not a stack).
- `src/components/shared/modal/GlobalModal.tsx` — the single `Dialog` mounted once in root layout that renders whatever `openModal` was called with.
- Dialog form contents (e.g. `src/components/plan/dialogs/*`) are plain components passed as `content` — they don't manage their own open state.

## Data fetching

- Server calls go through the shared `axiosClient` (`src/helper/axiosClient.ts`), not raw `fetch` or per-file axios instances. It injects `Authorization: Bearer <accessToken>` from `localStorage` and centralizes 401/403/500 handling.
- Reads use TanStack Query (`useQuery`) directly in the component that needs the data (no query-hooks layer yet) — see `PlanHeader` for the pattern: `queryKey` includes the route param and `user_data?.user?.id`, and the query is gated with `enabled`.
- NextAuth's `authorize()` in `src/auth.ts` calls the backend directly via `fetch` (not `axiosClient`, since there's no session yet) and maps the backend's `{ status, data }` envelope onto the NextAuth user object.

## Reusable form fields

`src/components/shared/form/` wraps the shadcn/base-ui primitives (`Input`, `Textarea`, `Select`, `Calendar`+`Popover`, `Checkbox`) with Formik's `useField`/`useFormikContext`, so form fields stay one-liners instead of hand-rolled `<label>`/`<input>`/error markup. Use these (via the barrel `@/components/shared/form`) inside any `<Formik>`/`<Form>` tree instead of raw `<Field>`/`<input>`:

- `FormInput` — text/number/etc. inputs, label + error message included.
- `FormTextarea` — multiline text.
- `FormSelect` — dropdown; takes `options: { label, value }[]`, stores the string `value` in Formik state.
- `FormDatePicker` — button that opens a `Popover` with a shadcn `Calendar`; stores the date as an ISO `yyyy-MM-dd` string in Formik state (formats display with `date-fns`).
- `FormCheckbox` — boolean field, uses Formik's checkbox field mode (`useField({ name, type: "checkbox" })`).

Each one reads `name` to hook into the enclosing `Formik` context — there's no controlled-value plumbing to wire up in the parent. See `src/components/plan/dialogs/AddTransactionForm.tsx` for the reference usage. Older dialogs (`InviteMemberForm`) still use raw `<input>`/`<select>` and haven't been migrated yet.

## UI spec workflow

- `docs/ui/*.md` are the source-of-truth specs for each page (`homepage.md`, `create-plan.md`, `plan-details.md`), written as UI-only tasks against static mock data. Read the matching spec before reworking a page's layout/content so changes stay consistent with the intended design, even after a section has since been wired to real data.
- Each feature folder under `src/components/<feature>/` keeps its own `mock-data.ts` (types + sample arrays) — reuse those types (e.g. `Plan` from `components/home/mock-data`) when wiring in real API data rather than redefining shapes, until the API response types fully replace them.
