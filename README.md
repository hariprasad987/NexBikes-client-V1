# NexBikes Client

A responsive Next.js application foundation for NexBikes, built around the supplied login and My Garage references and the NexBikes Design System v1.0.

Use Node.js 20.9 or newer and pnpm 10.14 or newer. The project pins pnpm through the `packageManager` field, so Corepack can select the correct version automatically.

## Start locally

```bash
corepack enable
pnpm install
pnpm dev
```

Open `/login` for the public authentication screen or `/garage` for the signed-in dashboard shell.

## Quality checks

```bash
pnpm check
pnpm build
```

`pnpm check` validates the centralized color/font rules, ESLint, and TypeScript. Use pnpm for all dependency and script commands; do not generate npm or Yarn lockfiles.

## Mandatory development contract

Read [AGENTS.md](./AGENTS.md) in full before changing any code. It is the repository-wide mandatory contract for architecture, component decomposition, route layouts, SCSS, colors, fonts, branding, responsiveness, accessibility, pnpm, and verification. Architecture and extracted brand details are also documented in `docs/ARCHITECTURE.md` and `docs/BRAND-GUIDELINES.md`.

## Project conventions

- Route files only compose layouts and feature sections.
- Reusable elements live in `src/components/ui`.
- Shared public and inner application shells live in `src/components/layout`.
- Page-specific sections and data live in `src/features/<feature>`.
- Every color value lives in `src/styles/tokens/colors.scss`.
- Inter and Orbitron are configured only in `src/styles/fonts.ts`.
- Component styles use colocated `.module.scss` files, with shared Sass breakpoints and mixins in `src/styles/_tools.scss`.
