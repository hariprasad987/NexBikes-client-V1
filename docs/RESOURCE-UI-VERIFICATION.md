# Resource tables and shared scrollbar verification

- `pnpm check:design`, `pnpm lint`, `pnpm typecheck`, and `pnpm build`: passed.
- Chromium production-build checks: 24 routes across 320×568, 375×667, 390×844, 667×375, 768×1024, 1024×768, 1280×720, 1366×768, 1440×900, 1920×1080, and 2560×1440. No horizontal document overflow or JavaScript page errors.
- All 24 routes also passed a 640×360 effective viewport check, equivalent to the layout space of a 1280×720 browser at 200% zoom. Actual browser zoom controls were not exercised.
- Reviewed screenshots of the resource tables across the viewport matrix. Mobile tables reflow into labeled cards with independent vertical scrolling.
- Initial interaction checks passed: Lockring filtering, spare-part popup opening, Escape dismissal, and signup gallery scrollbar colors and 8px width. Desktop image loading passed for every table thumbnail.
- Final interaction suite: 60 checks passed across all 11 required viewports and the 640×360 effective zoom viewport. Verified keyboard filter activation, filtered row counts, empty categories, spare-part popup opening and Escape dismissal, focus restoration, guide-section navigation, and the maintenance-button SVG. Spare-part, edit-bike, and connected-app dialogs fit their viewports. All detected vertical scroll containers used the shared 8px scrollbar, Medium Grey thumb, and Border Grey track. No document overflow, scrollbar-style failures, or JavaScript page errors.
- Product photography differs from the screenshot cutouts. See RESOURCE-IMAGE-SOURCES.md for provenance and catalogue limitations.

## Support-card, maintenance-calendar, and View-action refinement

- Updated support cards to the supplied 34px outer spacing, 24px inner padding, 18px medium headings, 24px help icons, 8px heading-to-description gap, and 48px buttons. Description and actions align with the icon edge; the search icon inherits white. Mobile spacing and wrapped text remain fluid.
- Maintenance History now reuses the Garage DateRangePicker, including range selection, Apply, Cancel, keyboard navigation, and Escape. Its dialog has a maintenance-specific accessible label. As with the Garage usage picker, selecting a range updates the control; it does not filter the demonstration records.
- Both resource-table View actions use the shared text button variant: transparent hover background, no hover translation, retained keyboard focus styling.
- `pnpm check:design`, `pnpm lint`, `pnpm typecheck`, and `pnpm build` passed.
- 132 Chromium layout checks passed: Garage plus all ten bike-detail routes, at all eleven mandatory viewports and the 640×360 effective 200% zoom viewport. No document overflow or JavaScript page errors.
- Calendar selection and Escape, transparent hover states, support-card alignment, 18px headings, 24px help icons, and white search icon were checked at every matrix size. The Garage calendar still opens with its original accessible label.
