# NexBikes Brand Guidelines

Source of truth: `NexBikes_Design_System_v1.0.pdf` (v1.0, status in progress).

## Typography

### Orbitron — primary display font

Use only for page headings, bike names, secondary display headings, statistics, and large numbers. Orbitron content is always uppercase.

| Usage | Size | Weight |
| --- | ---: | --- |
| Page heading | 34px | Bold |
| Bike name / H1 | 24px | Bold |
| Heading 2 | 18px | Medium |
| Statistics | 48–90px | Adaptive |

### Inter — interface font

Use for all normal UI elements.

| Usage | Size | Weight |
| --- | ---: | --- |
| H1 | 24px | Medium |
| H2 | 18px | Semi Bold |
| Paragraph 1 | 16px | Regular / Medium |
| Paragraph 2 | 14px | Regular |
| Primary CTA | 16px | Medium |
| Secondary CTA | 14px | Medium |

## Approved palette

| Name | Value | Intended use |
| --- | --- | --- |
| Nex Deep End | `#0F2C2D` | Headings, login/signup buttons |
| Nex Olive | `#616C19` | Primary buttons |
| Nex Gravel | `#84714B` | Statistics bars |
| Nex Lime | `#C1DB79` | Logo, accent, subtle hover fill |
| Dark Grey | `#333333` | Sub-headings |
| Medium Grey | `#828282` | Paragraph text |
| Light Grey | `#BDBDBD` | Placeholder text |
| Border Grey | `#E0E0E0` | Borders and dividers |
| Dashboard Grey | `#F6F6F6` | Dashboard background |
| Black | `#000000` | Base color |
| White | `#FFFFFF` | Base color |

### Supplied login artwork colors

The approved auth compositions include a small set of exact artwork values in addition to the core product palette. They are limited to auth pages and official provider artwork: logo olive `#626E2F`, logo deep `#012B2B`, title black `#111111`, auth ink `#0E121A`, muted text `#888888`, divider `#E7E7E7`, inactive pagination `#164A4B`, password-reset panel teal `#16494B`, the supplied `#B8DC83` password-reset ring transparencies, and the official Google icon colors. Their implementation tokens remain centralized in `src/styles/tokens/colors.scss`.

### Supplied Garage composition colors

The approved Garage composition adds exact, page-scoped semantic values for selected bikes, secondary actions, maintenance states, connected-app states, and the ride-usage chart. These values include action green `#55781F`, selected green `#626E2F`, content ink `#1D1D1D`, secondary slate `#6B7280`, alert red `#EB5757`, alert icon red `#EF4444`, success green `#67B470`, chart orange `#F97316`, and their supplied muted surfaces and chart/shadow transparencies. They are limited to reproducing the supplied Garage design and are centralized as `--color-garage-*` and `--shadow-garage-*` tokens in `src/styles/tokens/colors.scss`.

### Supplied Dashboard composition colors

The approved Dashboard composition adds page-scoped deep teal surfaces `#082B2C`, `#14313A`, and `#164849`; sidebar border teal `#204041`; action olive `#626E2F`; collapsed-sidebar logo green `#B8DC83`; status green `#61A061`; progress olive `#9BA47D`; notification red `#FB1C1B`; profile-arrow grey `#9B9DA3`; and the supplied soft border and panel-tint values. They are limited to reproducing the supplied Dashboard and shared signed-in shell reference and are centralized as `--color-dashboard-*`, `--shadow-dashboard-*`, and `--background-dashboard-*` tokens in `src/styles/tokens/colors.scss`.

## General rules

- Maintain the typography hierarchy consistently.
- Avoid introducing colors outside the approved palette without design approval.
- Statistics typography remains adaptive until the design phase is finalized.
- Keep the product voice direct, calm, capable, and useful.
