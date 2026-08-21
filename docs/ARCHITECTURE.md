# Front-end Architecture

```text
src/
├── app/                 # Route groups and route entry points
├── components/
│   ├── brand/           # Logo and brand-owned primitives
│   ├── layout/          # Shared auth/app shells, header, sidebar
│   └── ui/              # Reusable element-level components
├── features/
│   ├── auth/            # Auth page sections
│   └── garage/          # Garage sections, data, and types
└── styles/
    ├── fonts.ts         # The only font-family configuration
    ├── _tools.scss      # Globally available Sass breakpoints/mixins
    └── tokens/          # Runtime color and typography custom properties
```

Routes compose features. Features compose UI primitives. UI primitives never import from features. Shared layouts may import UI and brand primitives.

Create a component when markup is repeated, owns behavior, has a distinct visual boundary, or has a clear reusable responsibility. Avoid components that only rename a single native element without adding a consistent API or design behavior.

## Styling architecture

- Use colocated `.module.scss` files for component styling and `src/app/globals.scss` only for global resets and element defaults.
- `src/styles/tokens/colors.scss` is the single source of literal color values. It exposes runtime CSS custom properties consumed through `var(...)`.
- `src/styles/tokens/typography.scss` owns shared runtime typography sizes and weights.
- Next.js injects `src/styles/_tools.scss` into every Sass file. Use its breakpoint mixins and build-time helpers; do not import or duplicate it manually.
- Sass variables and mixins are for build-time structure. Runtime brand values remain CSS custom properties so themes and component states share one token source.
