# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Gabi Mascellani, pet nutritionist (@gabi_nutripet) — the sole user, running her own consultório (private practice). Uses the app daily for professional work: registering patients (pets + tutors), building diet plans, tracking follow-up, and generating menus for tutors.

## Product Purpose

NutriPet is the internal tool that runs Gabi's pet-nutrition consultório: patient records, a reusable diet bank, per-consultation nutritional plan calculation, clinical anamnesis, a body-measurement diary, and printable/PDF menus handed to tutors.

## Positioning

The differentiator over a spreadsheet or a generic clinic-management app is the structured 4-week follow-up protocol: when a patient starts follow-up, the app automatically tracks which week (1–4, or "semanas extras" beyond that) they're in and surfaces reminders (last week of the protocol, patients stuck in extra weeks, upsell follow-ups after finalization) — so patients aren't silently forgotten between consultations, which a spreadsheet does not do on its own.

## Operating Context

- Single practitioner, daily internal use — not a multi-tenant SaaS.
- Workflow: register tutor+pet → optional anamnesis → build a nutritional plan from the diet bank (base diet + per-consultation variables: weight, factor) → generate/print a menu for the tutor → track weekly follow-up → log periodic weight/body measurements → eventually finalize the patient (with an upsell reminder to reconnect later).
- No staging environment; changes are pushed straight to production. Login is Google OAuth (Supabase Auth) with an email allow-list, so there is no way to test the logged-in app anonymously.

## Capabilities and Constraints

- Frontend is a single static `public/index.html` (vanilla JS/CSS/HTML, no build step, no framework) plus `public/exportar.html` for the printable menu. This is deliberate — zero build infrastructure.
- Backend: Vercel serverless functions under `/api`, Supabase (Postgres + Auth + Storage) behind them.
- Vercel Hobby plan caps serverless functions at 12 per deployment; the project is close to that limit, so new features should avoid adding `/api` endpoints without consolidating existing ones first.
- Shoelace (web components) is used narrowly for modals and toasts only; buttons/cards/badges/tabs/forms stay custom CSS.
- `public/exportar.html` must stay print-friendly — it's the document handed to the tutor.

## Brand Commitments

- Product name: NutriPet. Owner: Gabi Mascellani (nutri.pet, Instagram @gabi_nutripet).
- Tone: professional but warm, cheerful, confident — never cold or overly clinical.
- Existing visual system is documented in `DESIGN.md` (colors, typography, components, iconography).

## Evidence on Hand

- `DESIGN.md` — the current design system, source of visual truth for the incumbent implementation.
- No customer testimonials, case studies, or press exist (single internal user) — do not fabricate any.

## Product Principles

1. Single practitioner's daily tool, not a growth-oriented SaaS — prioritize her actual workflow speed over generic best practices.
2. No staging/tests: ship changes in small, reviewable increments; avoid risky one-shot rewrites.
3. Structured follow-up (the 4-week protocol) is the core differentiator — never regress its visibility or automation.
4. Zero build-step architecture is intentional; don't introduce a framework/bundler without an explicit, discussed decision.

## Accessibility & Inclusion

No specific accessibility requirement established — single internal user, no known assistive-technology need at this time.
