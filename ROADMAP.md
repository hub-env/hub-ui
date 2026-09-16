# Hub UI roadmap

This page lists what already works and what I plan to do next. Items only appear under "Planned" when I intend to build them. If something you need is missing, [open an issue](https://github.com/hub-env/hub-ui/issues/new/choose).

## Done

- [x] Every package targets Angular 22: standalone components, signals and `OnPush`.
- [x] Design system package with light and dark modes plus six more themes, all driven by `--hub-*` custom properties.
- [x] Native drag and drop in the board and the calendar, with no Angular CDK dependency.
- [x] Server-side and client-side modes in the data table.
- [x] Form fields with automatic validation messages, including datepicker, timepicker and file input.
- [x] Documentation site with live examples and API tables for every package, in six languages.
- [x] `ng add ng-hub-ui` installer (pre-release).
- [x] [`llms.txt`](https://hubui.dev/llms.txt) and [`llms-full.txt`](https://hubui.dev/llms-full.txt) on hubui.dev, so coding assistants can read the documentation.
- [x] One repository as the entry point for the project, with a single issue tracker for all packages.

## Planned

- [ ] A complete example app (a project-management dashboard) built only with Hub UI packages.
- [ ] The migration guides from `angular2-signaturepad` and `ngx-sortablejs`, which today ship as `MIGRATION.md` inside each package, published as pages on hubui.dev.
- [ ] A "Built with Hub UI" showcase, open to submissions.
- [ ] Angular 23 support, released as `23.0.0` across all packages once Angular 23 is out.

## Exploring

These are ideas I'm looking into. They may change or be dropped.

- [ ] An MCP server so coding agents can search components, APIs and examples directly.
