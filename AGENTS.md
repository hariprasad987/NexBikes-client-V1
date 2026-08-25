# NexBikes Mandatory AI Development Contract

This file is the permanent source of truth for every human- or AI-assisted code change in this repository. These instructions apply to the entire project.

## Mandatory pre-change gate

Before creating, editing, moving, or deleting any code, the contributor or AI agent must:

1. Read this entire `AGENTS.md` file.
2. Identify whether the change affects a route, layout, page section, reusable UI element, brand primitive, feature data, SCSS, colors, fonts, or dependencies.
3. Inspect the existing component and feature folders for a reusable implementation before creating anything new.
4. For any visual or UI change, read `docs/BRAND-GUIDELINES.md` and consult `NexBikes_Design_System_v1.0.pdf` when typography, colors, hierarchy, or design intent is relevant.
5. Confirm the intended file location against the architecture below before editing.

Do not begin an implementation until this pre-change gate is complete. Do not bypass these rules for a quick fix, prototype, generated code, or AI suggestion.

## Technology baseline

- Framework: Next.js App Router with TypeScript.
- Package manager: pnpm only, using the version pinned in `package.json`.
- Styling: SCSS with locally scoped CSS Modules.
- Components: React Server Components by default.
- Client Components: add `"use client"` only when browser state, effects, browser APIs, or event handlers require it.
- Do not introduce another styling system, component framework, package manager, or state library without explicit approval.
- Never generate `package-lock.json` or `yarn.lock`.

## Required project architecture

```text
src/
├── app/
│   ├── (auth)/                 # Public/auth routes and their outer layout
│   ├── (app)/                  # Signed-in routes and their inner app layout
│   ├── globals.scss            # Global reset and base element styles only
│   └── layout.tsx              # Root document and global providers
├── components/
│   ├── brand/                  # Logo and brand-owned primitives
│   ├── layout/                 # Shared application shells, header, sidebar
│   └── ui/                     # Reusable element-level components
├── features/
│   └── <feature>/
│       ├── components/         # Page sections and feature-owned components
│       ├── data.json           # Local dynamic/display records for the feature
│       ├── data.ts             # Typed adapter and derived selectors for feature data
│       └── types.ts            # Feature-owned types when needed
└── styles/
    ├── _tools.scss             # Shared Sass breakpoints and mixins
    ├── fonts.ts                # The only font-family configuration
    └── tokens/
        ├── colors.scss         # The only literal color source
        └── typography.scss     # Shared runtime type sizes and weights
```

### Dependency direction

- Route files compose feature components and layouts.
- Feature components may compose `components/ui`, `components/brand`, and shared layouts where appropriate.
- Shared UI components must never import from a feature folder.
- Shared layouts may import UI and brand primitives, but must not contain page-specific business sections.
- Keep feature data and types inside their feature unless they are genuinely shared by multiple features.

## Pages and layouts

- Keep every `src/app/**/page.tsx` thin. A page file should provide metadata and compose feature-level sections; it must not contain a large page implementation.
- Keep route-group layout files thin. Shared shell behavior belongs in `src/components/layout/`.
- Public pages such as login, signup, forgot password, and other unauthenticated screens must use the `(auth)` route-group layout.
- Signed-in inner pages must use the `(app)` route-group layout with the shared application sidebar and top bar.
- Preserve the visual distinction between the public outer layout and signed-in inner layout shown in the supplied references.
- Do not duplicate headers, sidebars, navigation, authentication shells, or page shells inside individual pages.

## Component decomposition and reuse

- Every meaningful page section must be its own feature component under `src/features/<feature>/components/<section-name>/`.
- Every reusable interface element must live under `src/components/ui/<component-name>/`.
- Every component folder should colocate its implementation and style module:

```text
component-name/
├── component-name.tsx
└── component-name.module.scss
```

- Create or extract a component when markup:
  - repeats;
  - owns behavior or state;
  - has a meaningful visual boundary;
  - represents a named section from the design;
  - is likely to be reused;
  - or makes a parent component difficult to scan.
- Keep components small and focused on one responsibility.
- Prefer composition and explicit typed props over copied markup or highly configurable monoliths.
- Reuse existing buttons, cards, inputs, search fields, icons, progress bars, status pills, and other primitives. Do not recreate their markup inside features.
- Keep local data that represents dynamic, selectable, repeated, or API-shaped feature content outside JSX in a feature-owned JSON file such as `data.json`.
- Read feature JSON through a typed `data.ts` adapter. Components must consume typed records or props from that adapter rather than importing untyped JSON directly.
- Keep presentation logic, derived selectors, and runtime validation in `data.ts`; do not store functions, React elements, CSS classes, or other presentation implementation in JSON.
- When a feature is connected to a live API, preserve the same typed component contracts and replace or extend the adapter at the feature boundary instead of embedding response data in components.
- Keep domain and component contracts typed. Do not use `any` to avoid defining a proper type.
- Avoid extracting a component that only renames one native element and adds no shared behavior, accessibility, or visual contract.

### Dropdown controls

- All select-style controls must use the shared custom dropdown primitives under `src/components/ui/`; do not render native `<select>` elements in routes, layouts, or feature components.
- Use `src/components/ui/select-field/` for single-choice selection and `src/components/ui/multi-select-field/` for multiple-choice selection.
- Single-select and multi-select controls must have visibly distinct interaction designs. Multi-select controls must expose selected values and selection state without imitating a single-select control.
- Custom dropdowns must preserve accessible labels, keyboard navigation, visible focus states, Escape and outside-click dismissal, appropriate listbox semantics, and hidden form values when a `name` is supplied.
- Dropdown menus must reflow or reposition safely in narrow containers and must not be clipped, overlap required actions, or cause horizontal page overflow.
- Keep single-select and multi-select implementations as separate focused components; do not merge them into one highly configurable dropdown monolith.

## SCSS architecture

- Use `.module.scss` for all component-level styles.
- Use `src/app/globals.scss` only for global resets, document defaults, base native-element behavior, and global accessibility behavior.
- Shared Sass breakpoints and mixins belong only in `src/styles/_tools.scss`.
- Next.js injects `_tools.scss` into every Sass file; do not manually import it or create duplicate breakpoint maps in feature folders.
- Use the shared responsive mixins such as `@include down("tablet")` instead of repeating raw breakpoint values.
- Sass variables and mixins are for build-time organization only.
- Runtime design decisions must use the CSS custom properties provided by the token files.
- Do not create global feature selectors, deeply coupled selectors, or styling that depends on unrelated DOM structure.
- Keep selector nesting shallow and readable. Prefer a clear local class over deeply nested selectors.
- Do not use inline styles for visual styling. Inline values are permitted only when a true runtime value is required, such as a calculated progress width.

## Color system — single source only

- `src/styles/tokens/colors.scss` is the only file inside `src/` allowed to contain literal color values.
- Never add hex, `rgb()`, `rgba()`, `hsl()`, `hsla()`, `lab()`, `lch()`, `oklab()`, or `oklch()` values to another source file.
- Consume color variables through `var(--color-...)` everywhere, including backgrounds, borders, text, states, gradients, overlays, SVG styling, and shadows.
- Do not create a second palette using Sass variables, TypeScript constants, Tailwind configuration, inline styles, or component-local variables.
- Do not introduce a new color without explicit design approval. After approval, update both `colors.scss` and `docs/BRAND-GUIDELINES.md`.

Approved brand palette:

| Token name | Value | Primary usage |
| --- | --- | --- |
| Nex Deep End | `#0F2C2D` | Headings, login/signup controls, inner shell |
| Nex Olive | `#616C19` | Primary buttons and actions |
| Nex Gravel | `#84714B` | Statistics and condition bars |
| Nex Lime | `#C1DB79` | Logo, accents, subtle hover fills |
| Dark Grey | `#333333` | Sub-headings |
| Medium Grey | `#828282` | Paragraph text |
| Light Grey | `#BDBDBD` | Placeholder text |
| Border Grey | `#E0E0E0` | Borders and dividers |
| Dashboard Grey | `#F6F6F6` | Dashboard background |
| Black | `#000000` | Base color |
| White | `#FFFFFF` | Base color |

## Typography system — single configuration

- `src/styles/fonts.ts` is the only file allowed to import, load, or configure font families.
- `src/styles/tokens/typography.scss` owns shared runtime font sizes and weights.
- Orbitron is the primary display font. Use it only for high-emphasis content and always in uppercase:
  - page headings: 34px bold;
  - bike names/H1: 24px bold;
  - secondary display headings: 18px medium;
  - statistics and large numbers: adaptive 48–90px.
- Inter is the interface font for all normal UI text:
  - UI H1: 24px medium;
  - UI H2: 18px semibold;
  - paragraph 1: 16px regular/medium;
  - paragraph 2: 14px regular;
  - primary CTA: 16px medium;
  - secondary CTA: 14px medium.
- Do not configure `font-family` in SCSS or inline styles.
- Do not introduce another font without explicit design approval and a brand-documentation update.
- Maintain a consistent hierarchy; do not use Orbitron decoratively for ordinary interface copy.

## Design and branding requirements

- Treat `NexBikes_Design_System_v1.0.pdf` and `docs/BRAND-GUIDELINES.md` as the design authority.
- Match supplied page references closely in hierarchy, layout, alignment, spacing, scale, borders, imagery, and visual weight.
- Preserve the NexBikes visual character: restrained, technical, capable, clean, and premium.
- Keep the product voice direct, calm, capable, and useful.
- Do not add unapproved colors, gradients, fonts, visual effects, icon styles, or decorative patterns.
- Use brand assets and shared brand components instead of recreating the logo or wordmark per page.
- When a design decision is not specified, extend the established patterns from existing pages rather than inventing a conflicting style.

## Responsive layout requirements

- Responsiveness is a release requirement, not an optional refinement. Every new page and every changed existing page must remain usable across the full continuous range of supported viewport widths and heights.
- Every page, layout, section, component, navigation element, form, modal, table, chart, card collection, and image area must work at mobile, tablet, laptop, desktop, and wide-desktop sizes in both portrait and landscape orientations where applicable.
- Use the breakpoints defined in `src/styles/_tools.scss`.
- Design-reference dimensions such as 1920 × 1080 describe the target appearance at that viewport only. They must not be implemented as fixed page dimensions or assumptions about every screen.
- Build fluidly between breakpoints with Grid/Flexbox, intrinsic sizing, `min()`, `max()`, `clamp()`, `minmax()`, wrapping, and responsive spacing/type rules as appropriate.
- Content must reflow rather than overflow. The document must not have unintended horizontal scrolling at any supported viewport.
- Avoid fixed widths, fixed heights, large minimum sizes, absolute positioning, or `white-space: nowrap` when they can cause clipping, overlap, horizontal overflow, hidden actions, or unusable content at another width or height.
- Fixed dimensions are allowed only for intentionally fixed primitives such as icons and controls, or when a responsive override guarantees safe reflow at every smaller dimension.
- Width responsiveness and height responsiveness must both be handled. Pages must remain usable on short laptop screens, landscape phones/tablets, browser zoom, mobile browser chrome changes, and when form validation or translated/dynamic content increases the content height.
- Do not vertically center a page in a way that clips content on short screens. Allow the page to grow and scroll naturally when its content is taller than the viewport.
- Do not hide essential content or actions merely to make a smaller viewport fit. Reposition, stack, collapse behind an accessible control, or provide an equivalent mobile presentation.
- Text must wrap without colliding with adjacent content. Images and media must preserve appropriate aspect ratios and focal points without stretching.
- Preserve touch-friendly control sizes and spacing on mobile.
- Keep primary actions discoverable and navigation usable at every supported width.
- Components must be responsive within their parent container and must not depend only on the global viewport width; they may be reused in narrower columns on large screens.
- Responsive behavior must also tolerate 200% browser zoom without loss of content or functionality.

### Mandatory responsive verification matrix

After every visual, page, component, or layout update, review every affected route at a minimum at:

| Class | Viewport |
| --- | --- |
| Small mobile portrait | 320 × 568 |
| Mobile portrait | 375 × 667 and 390 × 844 |
| Mobile landscape | 667 × 375 |
| Tablet portrait | 768 × 1024 |
| Tablet landscape / short laptop | 1024 × 768 |
| Laptop | 1280 × 720 and 1366 × 768 |
| Desktop | 1440 × 900 |
| Supplied design reference | 1920 × 1080 |
| Wide desktop | 2560 × 1440 |

At each relevant viewport, verify:

1. No unintended horizontal page overflow.
2. No clipped, overlapping, or unreachable content.
3. All navigation, form controls, carousel controls, and primary actions remain visible and operable by keyboard and pointer/touch.
4. Typography wraps cleanly and keeps the intended hierarchy.
5. Cards, grids, tables, charts, images, sidebars, headers, and page shells reflow correctly.
6. The page can scroll vertically when needed, including on short-height screens.
7. The visual result still follows the supplied design and NexBikes brand system.

If an automated browser or screenshot tool is unavailable, perform a code-level responsive audit against this matrix and explicitly report that rendered viewport verification remains outstanding. Never claim that responsiveness was verified when the affected viewports were not actually reviewed.

## Accessibility and implementation quality

- Use semantic HTML before adding ARIA.
- Every form control must have an accessible label.
- Every icon-only action must have an accessible name.
- Preserve keyboard navigation and visible focus states.
- Maintain sufficient color contrast.
- Respect reduced-motion preferences.
- Images must have meaningful alt text or an empty alt attribute when purely decorative.
- Avoid unnecessary client-side JavaScript and keep Server Components as the default.
- Do not duplicate constants, labels, business data, or rendering logic.

## Dependency and command rules

- Use pnpm exclusively for installing, removing, or updating dependencies and for running project scripts.
- Keep `pnpm-lock.yaml` synchronized with `package.json`.
- Do not edit the lockfile manually.
- Do not add a dependency when the platform or existing dependency already provides the required behavior.
- Do not replace SCSS Modules with Tailwind, CSS-in-JS, styled-components, or another styling framework without explicit approval.
- Do not weaken TypeScript, ESLint, audit, or design-token checks to make an implementation pass.

## Required completion checklist

Before reporting any code update as complete:

1. Re-read the relevant sections of this contract.
2. Confirm route and layout files remain thin.
3. Confirm every new section and reusable element is in the correct small component folder.
4. Confirm existing primitives were reused and no repeated markup was introduced.
5. Confirm all component styles use `.module.scss`.
6. Confirm no raw color exists outside `src/styles/tokens/colors.scss`.
7. Confirm no font configuration exists outside `src/styles/fonts.ts`.
8. Confirm the UI follows the branding guide and supplied design references.
9. Confirm every affected route against the full mandatory responsive verification matrix, including narrow/wide widths, short heights, portrait/landscape behavior, and 200% zoom. Record any viewport that could not be rendered and reviewed.
10. Run `pnpm check:design`.
11. Run `pnpm lint`.
12. Run `pnpm typecheck`.
13. Run `pnpm build` for UI, layout, routing, configuration, dependency, or production-impacting changes.
14. Run `pnpm audit --prod` after dependency changes.
15. Report any check that could not be run and the exact reason.

An update is not complete while a required check is failing.
