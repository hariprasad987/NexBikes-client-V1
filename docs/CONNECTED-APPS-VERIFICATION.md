# Connected Apps and forgot-password UI verification

- Added `/connected-apps` under the existing signed-in shell, with feature-owned typed JSON records, a server-rendered page section, and a reusable feature connection card. Shared buttons, icons, status pills, and provider artwork are reused. The flat Strava asset uses the original artwork with its surrounding shadow cropped out.
- Cards reproduce the supplied connection status, statistics, benefits, borders, spacing, and actions. Actions update local preview state and announce that external accounts are unchanged. Reload restores the supplied sample records. OAuth, persistent connections, and activity import are not implemented by this UI task.
- The reset-email field wrapper now fills the existing 500px form, shrinking to its parent on smaller screens. Heading and description heights flow naturally to avoid text overlap. Reset-email sending remains the existing backend integration task.
- Chromium reviewed both routes at 320×568, 375×667, 390×844, 667×375, 768×1024, 1024×768, 1280×720, 1366×768, 1440×900, 1920×1080, and 2560×1440, plus a 640×360 effective viewport representing 200% zoom of a 1280×720 window. Actual browser zoom controls were not exercised.
- All 24 route/viewport checks passed: no horizontal document overflow, one H1 per route, and no JavaScript page errors. The email field equals the form width at every size (500px where space permits). Connect/disconnect transitions for both providers and email keyboard entry were exercised at every size. Full-page screenshots were reviewed for wrapping and responsive layout.
- Both routes have descriptive private-page metadata and noindex/nofollow. No project dependencies were added.

## Supplied icon update

- Connected on, Imported Activities, Last synced, Disconnect, and benefit ticks now use the supplied SVG paths in the shared Icon component. Their sizes are 16×16, 15×15, 16×16, 18×19, and 14×10 respectively. Colors use the existing Connected Apps tokens and SVG attributes use React-compatible names.
- Chromium checks and screenshot review passed across all eleven required viewports and the effective 200% zoom viewport. Both providers' local connect/disconnect controls remain operable, with no horizontal overflow or JavaScript page errors.
- `pnpm check:design`, `pnpm lint`, `pnpm typecheck`, and `pnpm build` passed.

## Imported Activities icon refinement

- Imported Activities now uses the updated supplied 16×16 SVG with two paths, including the small center mark. The rendered metric icon was checked in Chromium and reports `width="16"`, `height="16"`, and `viewBox="0 0 16 16"`.
- Chromium responsive checks passed across all eleven required viewports and the effective 200% zoom viewport, with no horizontal overflow, one page heading, and no JavaScript page errors.
- `pnpm check:design`, `pnpm lint`, `pnpm typecheck`, and `pnpm build` passed. The build uses `experimental.useTypeScriptCli: false` because this installed TypeScript CLI wrapper exits with empty stdout when Next invokes it through Node for `--showConfig`; the TypeScript compiler API path completes the normal `pnpm build`.
