<p align="center">
  <a href="https://hubui.dev/en/">
    <img src="assets/logo.svg" alt="Hub UI" width="320">
  </a>
</p>

<h3 align="center">Angular components for the parts you don't want to build again.</h3>

<p align="center">
  Data tables, kanban boards, calendars, form fields, steppers and modals for Angular 22.<br>
  Each one is its own npm package, so you install the component you need and nothing else.
</p>

<p align="center">
  <a href="https://hubui.dev/en/"><strong>Documentation</strong></a> ·
  <a href="https://hubui.dev/en/paginable/examples/"><strong>Live examples</strong></a> ·
  <a href="#packages"><strong>Packages</strong></a> ·
  <a href="ROADMAP.md"><strong>Roadmap</strong></a> ·
  <a href="https://github.com/hub-env/hub-ui/stargazers"><strong>Star on GitHub</strong></a>
</p>

<p align="center">
  <a href="https://github.com/hub-env/hub-ui/stargazers"><img src="https://img.shields.io/github/stars/hub-env/hub-ui?style=flat&logo=github&label=stars" alt="GitHub stars"></a>
  <a href="https://angular.dev"><img src="https://img.shields.io/badge/Angular-22-dd0031?logo=angular" alt="Angular 22"></a>
  <a href="#packages"><img src="https://img.shields.io/badge/npm%20packages-26-cb3837?logo=npm" alt="26 npm packages"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-green" alt="MIT license"></a>
</p>

[Español](README.es.md) | **English**

---

## Why Hub UI

A full UI framework brings its own theme, layout system and way of building forms. Hub UI is split into packages instead: if your app already has a look and you only need a server-side data table, you install `ng-hub-ui-paginable` and stop there.

The packages cover the components that take weeks to get right and that teams keep rebuilding from one project to the next:

- **Data table** with server-side pagination, search, column filters, sorting, selection and row reordering.
- **Kanban board** with native drag and drop. It does not depend on Angular CDK.
- **Calendar** with month, week, day and year views, and events you can drag to reschedule.
- **Form fields** (input, OTP, select, datepicker, timepicker, slider, file upload) that show validation errors on their own.
- **Stepper**, **modal**, **toast**, **navigation** and a dozen smaller pieces.

Every component is standalone, uses signals and `OnPush`, and is built to WCAG 2.1 AA, with keyboard support and screen-reader announcements. Styling goes through CSS custom properties: the design system documents more than 2,000 `--hub-*` variables and ships eight themes, light and dark included.

## Quick start

Install the package you need:

```bash
npm install ng-hub-ui-board ng-hub-ui-utils
```

Import the component and use it:

```ts
import { Component, signal } from '@angular/core';
import { Board, HubBoardComponent, HubCardTemplateDirective } from 'ng-hub-ui-board';

@Component({
	selector: 'app-sprint-board',
	imports: [HubBoardComponent, HubCardTemplateDirective],
	template: `
		<hub-board [board]="board()">
			<ng-template cardTpt let-card="item">
				<strong>{{ card.title }}</strong>
			</ng-template>
		</hub-board>
	`
})
export class SprintBoardComponent {
	board = signal<Board>({
		title: 'Sprint 14',
		columns: [
			{ title: 'To do', cards: [{ title: 'Login page' }] },
			{ title: 'Done', cards: [{ title: 'Project scaffold' }] }
		]
	});
}
```

Each package's page on [hubui.dev](https://hubui.dev/en/) has the full API, live examples and the list of CSS variables it reads.

The installer schematic, still in pre-release, can also ask which libraries you want and wire them into your app:

```bash
ng add ng-hub-ui
```

## See it running

Every package has a page of live examples you can try and copy from:

- [Kanban board](https://hubui.dev/en/board/examples/): drag cards and columns, custom templates, keyboard moves.
- [Data table](https://hubui.dev/en/paginable/examples/): server-side pagination, filters, selection, row reordering.
- [Calendar](https://hubui.dev/en/calendar/examples/): month, week, day and year views with drag-to-reschedule.
- [Form fields](https://hubui.dev/en/forms/examples/): datepicker, select, OTP, file upload and validation messages.
- [Stepper](https://hubui.dev/en/stepper/examples/) and [modal](https://hubui.dev/en/modal/examples/).

## Packages

All packages are published on npm under the `ng-hub-ui-*` prefix. Their major version follows the Angular major they target: `22.x` is for Angular 22.

### Data and layout

| Package | What it does | Links |
| --- | --- | --- |
| `ng-hub-ui-paginable` | Data table and hierarchical list: pagination, search, column filters, sorting, selection, drag-and-drop reordering, plus a standalone paginator | [docs](https://hubui.dev/en/paginable/overview/) · [npm](https://www.npmjs.com/package/ng-hub-ui-paginable) · [source](https://github.com/hub-env/ng-hub-ui-paginable) |
| `ng-hub-ui-board` | Kanban board with native drag and drop, no CDK required | [docs](https://hubui.dev/en/board/overview/) · [npm](https://www.npmjs.com/package/ng-hub-ui-board) · [source](https://github.com/hub-env/ng-hub-ui-board) |
| `ng-hub-ui-calendar` | Month, week, day and year views with drag-and-drop rescheduling | [docs](https://hubui.dev/en/calendar/overview/) · [npm](https://www.npmjs.com/package/ng-hub-ui-calendar) · [source](https://github.com/hub-env/ng-hub-ui-calendar) |
| `ng-hub-ui-sortable` | Drag-and-drop reordering for arrays, signals and `FormArray`, with a keyboard path | [docs](https://hubui.dev/en/sortable/overview/) · [npm](https://www.npmjs.com/package/ng-hub-ui-sortable) · [source](https://github.com/hub-env/ng-hub-ui-sortable) |
| `ng-hub-ui-panels` | Tabs, pills, accordion or plain cards from one API, plus a non-modal side panel | [docs](https://hubui.dev/en/panels/overview/) · [npm](https://www.npmjs.com/package/ng-hub-ui-panels) · [source](https://github.com/hub-env/ng-hub-ui-panels) |
| `ng-hub-ui-nav` | Horizontal menus, vertical sidebars, offcanvas, flyout and drill-down navigation | [docs](https://hubui.dev/en/nav/overview/) · [npm](https://www.npmjs.com/package/ng-hub-ui-nav) · [source](https://github.com/hub-env/ng-hub-ui-nav) |
| `ng-hub-ui-breadcrumbs` | Breadcrumbs built from your router configuration | [docs](https://hubui.dev/en/breadcrumbs/overview/) · [npm](https://www.npmjs.com/package/ng-hub-ui-breadcrumbs) · [source](https://github.com/hub-env/ng-hub-ui-breadcrumbs) |
| `ng-hub-ui-stepper` | Multi-step form wizard with vertical, sidebar and RTL layouts | [docs](https://hubui.dev/en/stepper/overview/) · [npm](https://www.npmjs.com/package/ng-hub-ui-stepper) · [source](https://github.com/hub-env/ng-hub-ui-stepper) |

### Forms

| Package | What it does | Links |
| --- | --- | --- |
| `ng-hub-ui-forms` | Input, OTP, textarea, slider, segmented, select, datepicker, timepicker and file input, with automatic validation messages | [docs](https://hubui.dev/en/forms/overview/) · [npm](https://www.npmjs.com/package/ng-hub-ui-forms) · [source](https://github.com/hub-env/ng-hub-ui-forms) |
| `ng-hub-ui-signature` | SVG signature field with pointer and keyboard signing, undo/redo and PNG export | [docs](https://hubui.dev/en/signature/overview/) · [npm](https://www.npmjs.com/package/ng-hub-ui-signature) · [source](https://github.com/hub-env/ng-hub-ui-signature) |
| `ng-hub-ui-history` | Signal-based undo/redo store with patch diffs, transactions and form tracking | [docs](https://hubui.dev/en/history/overview/) · [npm](https://www.npmjs.com/package/ng-hub-ui-history) · [source](https://github.com/hub-env/ng-hub-ui-history) |

### Overlays and feedback

| Package | What it does | Links |
| --- | --- | --- |
| `ng-hub-ui-modal` | Modals from a `TemplateRef`, a component or a string; edge placements, offcanvas drawers, stacking and focus trap | [docs](https://hubui.dev/en/modal/overview/) · [npm](https://www.npmjs.com/package/ng-hub-ui-modal) · [source](https://github.com/hub-env/ng-hub-ui-modal) |
| `ng-hub-ui-toast` | Toast notifications with lifecycle observables, progress bar and six positions | [docs](https://hubui.dev/en/toast/overview/) · [npm](https://www.npmjs.com/package/ng-hub-ui-toast) · [source](https://github.com/hub-env/ng-hub-ui-toast) |
| `ng-hub-ui-action-sheet` | Mobile-first action sheets with grouped actions and swipe to close | [docs](https://hubui.dev/en/action-sheet/overview/) · [npm](https://www.npmjs.com/package/ng-hub-ui-action-sheet) · [source](https://github.com/hub-env/ng-hub-ui-action-sheet) |
| `ng-hub-ui-loading` | Inline, overlay and fullscreen loading indicators, plus a page progress bar wired to the router and `HttpClient` | [docs](https://hubui.dev/en/loading/overview/) · [npm](https://www.npmjs.com/package/ng-hub-ui-loading) · [source](https://github.com/hub-env/ng-hub-ui-loading) |
| `ng-hub-ui-skeleton` | Skeleton placeholders described with an Emmet-like syntax | [docs](https://hubui.dev/en/skeleton/overview/) · [npm](https://www.npmjs.com/package/ng-hub-ui-skeleton) · [source](https://github.com/hub-env/ng-hub-ui-skeleton) |
| `ng-hub-ui-portal` | Service that renders components and templates anywhere in the DOM | [docs](https://hubui.dev/en/portal/overview/) · [npm](https://www.npmjs.com/package/ng-hub-ui-portal) · [source](https://github.com/hub-env/ng-hub-ui-portal) |

### Display

| Package | What it does | Links |
| --- | --- | --- |
| `ng-hub-ui-buttons` | Buttons (five variants, nine accents), floating action button, speed dial and a dropdown directive | [docs](https://hubui.dev/en/buttons/overview/) · [npm](https://www.npmjs.com/package/ng-hub-ui-buttons) · [source](https://github.com/hub-env/ng-hub-ui-buttons) |
| `ng-hub-ui-avatar` | Avatars from Gravatar, GitHub, initials, images or projected icons | [docs](https://hubui.dev/en/avatar/overview/) · [npm](https://www.npmjs.com/package/ng-hub-ui-avatar) · [source](https://github.com/hub-env/ng-hub-ui-avatar) |
| `ng-hub-ui-badges` | Badges, status pills and removable filter tags | [docs](https://hubui.dev/en/badges/overview/) · [npm](https://www.npmjs.com/package/ng-hub-ui-badges) · [source](https://github.com/hub-env/ng-hub-ui-badges) |
| `ng-hub-ui-icons` | One icon API for Font Awesome, Bootstrap Icons, Material Symbols, Solar or your own SVGs | [docs](https://hubui.dev/en/icons/overview/) · [npm](https://www.npmjs.com/package/ng-hub-ui-icons) · [source](https://github.com/hub-env/ng-hub-ui-icons) |
| `ng-hub-ui-metrics` | Progress bars, meters and gauges driven by signals | [docs](https://hubui.dev/en/metrics/overview/) · [npm](https://www.npmjs.com/package/ng-hub-ui-metrics) · [source](https://github.com/hub-env/ng-hub-ui-metrics) |
| `ng-hub-ui-milestones` | Vertical or horizontal timelines with projected content | [docs](https://hubui.dev/en/milestones/overview/) · [npm](https://www.npmjs.com/package/ng-hub-ui-milestones) · [source](https://github.com/hub-env/ng-hub-ui-milestones) |

### Foundations

| Package | What it does | Links |
| --- | --- | --- |
| `ng-hub-ui-ds` | Design tokens (`--hub-ref-*`, `--hub-sys-*`), eight themes, utility classes and Sass mixins | [docs](https://hubui.dev/en/design-system/) · [npm](https://www.npmjs.com/package/ng-hub-ui-ds) · [source](https://github.com/hub-env/ng-hub-ui-ds) |
| `ng-hub-ui-utils` | Shared focus management, overlays, focus trap, i18n, pipes and colour contrast helpers | [docs](https://hubui.dev/en/utils/overview/) · [npm](https://www.npmjs.com/package/ng-hub-ui-utils) · [source](https://github.com/hub-env/ng-hub-ui-utils) |
| `ng-hub-ui` | `ng add` installer that picks the libraries and wires them in (pre-release, ships no components) | [docs](https://hubui.dev/en/installer/overview/) · [npm](https://www.npmjs.com/package/ng-hub-ui) · [source](https://github.com/hub-env/ng-hub-ui-installer) |

## How it is put together

- **One package per component family.** Most packages build on `ng-hub-ui-utils` and can optionally use `ng-hub-ui-ds` for tokens and themes.
- **No UI framework underneath.** Drag and drop, overlays and focus management live in `ng-hub-ui-utils`, so you don't need Angular CDK or Bootstrap JS. The only third-party runtime dependencies are SortableJS (in `ng-hub-ui-sortable`) and ts-md5 (in `ng-hub-ui-avatar`).
- **Theming through CSS variables.** Components read `--hub-*` custom properties with built-in fallbacks. Without `ng-hub-ui-ds` they render with their defaults; add it and they pick up the shared palette, dark mode and the other themes.
- **Versioning follows Angular.** When Angular 23 ships, the packages move to `23.0.0` together. A breaking change inside a major line is announced in the package's `BREAKING_CHANGES.md`.
- **Each package has its own repository and changelog.** This repository is the entry point: documentation site, development workspace, roadmap and the issue tracker for every package.

## Packages that work better together

Each package works on its own and never requires a sibling. Where two packages can cooperate, the library exposes an injection token and a `provide…()` helper; register a sibling's adapter once and the feature upgrades everywhere, or leave it out and the component falls back to native behaviour.

| Capability | In package | Wire with | Adapter from | Without it |
| --- | --- | --- | --- | --- |
| Tooltip on a truncated badge | `ng-hub-ui-badges` | `provideHubBadgeTooltip(hubTooltipAdapter)` | `ng-hub-ui-utils` | native `title` |
| Tooltip on a truncated breadcrumb | `ng-hub-ui-breadcrumbs` | `provideHubBreadcrumbTooltip(hubTooltipAdapter)` | `ng-hub-ui-utils` | native `title` |
| Table search and page-size controls | `ng-hub-ui-paginable` | `provideHubPaginableFormControls(hubFormControlAdapter)` | `ng-hub-ui-forms` | native `<input>` and `<select>` |
| Table row buttons and menus | `ng-hub-ui-paginable` | `provideHubPaginableActions(hubActionsAdapter)` | `ng-hub-ui-buttons` | built-in markup |

Each package's README describes its integration points in detail.

## Developing Hub UI

This repository is also the development workspace. It holds the source of [hubui.dev](https://hubui.dev/en/), and every library is mounted in `projects/` as a git submodule pointing at its own repository:

```bash
git clone --recurse-submodules https://github.com/hub-env/hub-ui.git
cd hub-ui
npm ci
npm start
```

[CONTRIBUTING.md](CONTRIBUTING.md) covers the rest: commands, where a change goes and how to send it.

## Issues and questions

Bugs, questions and ideas for any package go to [this repository's issues](https://github.com/hub-env/hub-ui/issues/new/choose). The form asks which package it is about. Security problems are reported privately, as [SECURITY.md](.github/SECURITY.md) explains.

## Contributing

Contributions are welcome, from typo fixes to new examples. [CONTRIBUTING.md](CONTRIBUTING.md) explains how the repositories are organised and how to send a change, and everyone taking part follows the [Code of Conduct](CODE_OF_CONDUCT.md).

## Roadmap

See [ROADMAP.md](ROADMAP.md) for what is done and what is planned next.

## Support

If Hub UI saves you time, the most useful thing you can do is [star this repository](https://github.com/hub-env/hub-ui/stargazers). It is how other Angular developers find the project. You can also [buy me a coffee](https://buymeacoffee.com/carlosmorcillo).

## License

MIT © [Carlos Morcillo](https://www.carlosmorcillo.com)
