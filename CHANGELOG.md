# Changelog

All notable changes to the **ng-hub-ui docs site** (hubui.dev) are documented in this
file. Each library under `projects/` keeps its own `CHANGELOG.md`; entries here cover
the documentation app, its SEO surface and the release batches it records.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). The
version stamped here must match the root `package.json` `version` — it is what the
aside footer displays (`scripts/generate-version.mjs`).

## [Unreleased]

### Changed

- **Every GitHub link on the site now leads to `hub-env/hub-ui`.** The footer button, both home
  calls to action, the organization `sameAs` in the structured data and the repository line of
  `llms.txt` pointed at the `carlos-morcillo` profile, because there was no project repository to
  point at. The home hero button now asks for a star, in all eight languages, as the closing one
  already did. The author's `Person` entity keeps the personal profile.
- **Library repository links and the submodule URLs follow the move to the `hub-env` organization.**
  GitHub redirects the old addresses, so nothing was broken, but each link now names the real one.
- **The site's source now lives in `hub-env/hub-ui`,** next to the project's landing README, roadmap
  and issue tracker, so contributors clone one repository to work on any package. Internal plans and
  reports stay in the maintainer's knowledge base.
- **`npm run deploy` reads the server address and SSH user only from `DEPLOY_HOST` and
  `DEPLOY_USER`.** The repository is public now, and those values used to be written in as defaults.

## [22.6.1] - 2026-09-06

### Changed

- **The row-marking example says its state in a sentence instead of a chip.** The count sat in a
  solid blue badge glued to the front of the sentence that followed, which read as stray selected
  text rather than as a state. It now reads "With 6 picked, a row click marks the row".

## [22.6.0] - 2026-09-06

### Added

- **The breadcrumbs page shows the trail being read from outside the component.** 22.6.0 publishes
  `HubBreadcrumbsService.breadcrumbs` as a signal, and the nine examples on the page all ended at
  `<hub-breadcrumb>` — the one place that never needed the signal, because it reads the service
  itself. The new _The Trail as a Signal_ example puts a page header above the crumbs whose heading
  and subtitle are `computed` from the last two entries, so the header re-titles itself on every
  navigation with no route naming the title twice and nothing to unsubscribe. Its buttons stand in
  for the router, which the docs page does not have: `breadcrumbs-demo.providers.ts` grew a
  navigable stand-in publishing the same signal the real service publishes, and the example reads
  it exactly as an application would. Both new examples are also named in the shell's examples
  panel, which keeps its own label map: an example missing from it is registered, rendered and
  unreachable from the sidebar.

- **The loading page shows the indeterminate sweep travelling with the text.** Both READMEs have
  explained since 22.1.0 that the sweep reverses under `[dir='rtl']`, and no reader could see it.
  The new _Sweeping Right to Left_ example puts the same `<hub-loading-bar indeterminate />` inside
  a `dir="ltr"` card and a `dir="rtl"` one, with Arabic copy in the second so the direction is the
  thing being read rather than a claim about it. Measured in a browser against the shipped
  stylesheet: `--hub-loading-bar-sweep-direction` resolves to `1` and `-1` respectively, and the
  fragment travels 300px one way and the other. The example also says where `dir` may sit, which
  is anywhere above the bar or on the bar itself.

- **`labelType="visually-hidden"` has a running example.** The value shipped with forms 22.33.0
  and reached the site as three rows of the API table, which is the one place a reader who does
  not already know the feature exists will never look. The new forms example puts it where it is
  actually reached for — a toolbar search box whose magnifier and placeholder already say
  "search", and a grid of editable cells where the column header names the column and therefore
  names none of the controls under it — with a switch that reveals the same labels, so the
  reader can see that only the CSS changed and the `for`/`id` pair never went anywhere.

- **The signature field's projected `hubFormText` and `hubValidationError` are demonstrated.**
  Both templates started rendering in signature 22.7.0 and no example used either, so the release
  that fixed a slot which "compiled and silently drew nothing" left it looking the same from the
  documentation. A required signature field now carries a keyboard hint with real key caps and a
  `required` message written in the product's own words — markup neither `[formText]` nor the
  default message builder can carry, since both take a string. The page's `api.templates` table
  was empty and now documents the two slots.

- **The metrics demos name their gauges, which is the only way a `<hub-meter>` or a `<hub-ring>`
  can be named at all.** An element with `role="meter"` takes its accessible name from the author:
  the meter draws no text of its own, the caption projected into the ring is decoration, and the
  percentage in its middle says how much but never of what. So every gauge on the page reached a
  screen reader unnamed — and the ring worse than unnamed, announcing itself as "92%" until
  metrics 22.3.0 stopped hard-wiring `aria-label` to its own value. The four demos that draw one
  (meters, ring gauges, theming, the mixin preview) now pass `label`, with names that mean
  something — "Disk usage", "Quality score", "Service health" — and their code tabs pass it too,
  because the snippet is the half a reader takes away. A spec renders each demo and fails on any
  gauge left without a name.

- **The toast configuration demo shows both levels of configuration, not just the per-call one.**
  It offered three switches and never mentioned that everything they do not name is inherited from
  the application-wide defaults. It now carries a field for `closeButtonAriaLabel` — the whole of
  what a screen reader announces for a toast's only control, since the `×` is decorative — seeded
  from `ToastConfigService.defaults` rather than from a literal, so the page states the default the
  library actually ships instead of a copy of it that can go stale. The copy beside it says the
  library ships that name in English and translates nothing, and the code tab shows the two ways
  in: once for the application with `provideToast({ closeButtonAriaLabel })`, or per call as the
  demo does.

- **The modal projection demo names the dismiss button the library draws for it.** Naming a header
  or footer slot is what makes the library build its own header, dismiss button included; that
  button has no text, so its `aria-label` is its entire name, and it shipped as the English literal
  `"Close"` with no way for an application to translate it before modal 22.11.0. The demo now
  passes `closeAriaLabel`, both halves of it explain why the option exists and when it is not
  needed, and the snippet also shows the once-for-the-application form on `HubModalConfig`.

- **The paginable page demonstrates what 22.18.0 added, instead of only announcing it.** Five
  inputs shipped with nothing on the site a reader could try: `[resource]` on the table and on the
  list, `selectWhileSelecting`, the keyboard half of `clickFn`, and `searchFn` / `compareFn`, which
  had been declared for releases without the component reading either. There are five new examples,
  and each is built around the thing that is easy to get wrong rather than around the input's name.
  The table one is fed by a real `resource()` whose fake endpoint can be broken from a button, so
  the loading state, the rows and the failure are all reachable, and paging bumps the signal the
  loader reads — which is how the reader sees that the table never reloads a resource it does not
  own. The list one answers with a plain array, which is the other shape a resource value may take.
  The selection one pairs `selectWhileSelecting` with a `clickFn` and a switch, so the difference is
  something you feel: with the switch off, a click while picking opens the record and the pick is
  gone. The predicates one searches on a requester and on tags that have no column, and restores a
  selection saved before the schema grew a field — the two cases where the defaults quietly give
  the wrong answer.

- **`hub-paginator` has an example at last.** The component is exported, answers to three element
  names and had never been shown outside a table; the folder that should have held its examples was
  empty and was deleted in the previous sweep. It now pages an audit trail with its own page-size
  control and count line beside it, which is also the honest way to show that those two belong to
  whoever mounts the paginator — inside `hub-table` they are drawn by the bottom bar, which is why
  they look built in there and are absent here.

- **The paginable page shows where the pagination bar sits.** `paginationPosition` was fixed in
  this release and demonstrated nowhere, which is the state a reader cannot tell apart from an
  input that does not work. The new _Where the pagination bar sits_ example is a three-way switch
  — `bottom`, `top`, `both` — over a table small enough that the paginator has somewhere to go,
  and the copy under it points at the part that is easy to misread: the value does not move the
  paginator, it moves the whole bar, so the page links, the rows-per-page selector and the row
  count travel together. That was once the implementation's own mistake, and `top` used to delete
  the paginator rather than relocate it. Its row in the library's `FUNCTIONALITIES.md` goes to
  covered, and the spec beside it reads the placement off the rendered DOM rather than off the
  signal the switch writes.

### Changed

- **Every example publishes its snippets on the class, and the viewer no longer constructs an
  example to find them.** `ExampleViewer` read the statics first and, finding none, fell back to
  `new componentType()` inside a `try/catch` that only logged a warning about not being able to
  instantiate the component. That fallback held for as long as every example happened to be
  constructible: the first one to reach for `inject()` would have thrown NG0203, and the reader
  would have got empty code tabs with nothing anywhere to explain them. A hundred examples across
  avatar, board, breadcrumbs, calendar, forms, list, milestones, nav and sortable move
  `templateCode`, `componentCode`, `dataCode` and `cssCode` to `static readonly`; in breadcrumbs
  and sortable the `FeatureExample` `template` and `component` fields stay, now reading from those
  statics instead of the other way round. With the fallback removed, a snippet left on an instance
  fails a spec rather than vanishing in the browser.

- **The skeleton page introduces its examples in the reader's language.** It built each example
  component to read a `title` and a `description` off the instance, and those were English
  literals: seven of the eight locales showed English copy under a translated heading, and the
  day an example reached for `inject()` the construction would have thrown NG0203 and taken the
  page with it. Titles and descriptions are now `DOCS.SKELETON.EXAMPLE.*` keys, translated in all
  eight languages, the snippets are read off the class the way `ExampleViewer` already reads them,
  and the eight examples drop the instance copies that existed only to feed that construction. The
  mixin demo heading was a hardcoded English literal in the same file and became a key too.

- **The table's `paginationPosition` row describes three placements again.** The row had been
  rewritten to admit what the template did — a single bar under the rows, with `top` merely hiding
  the pager — and it left the input itself for the library to settle. The library settled it in
  22.18.0: all three values now move the whole bar, so the row is back to reading as a placement,
  and it names the `hub-table__bottom-bar--top` / `hub-table__bottom-bar--bottom` modifiers that
  tell the two apart when `both` draws them both. The page's "Recent changes" carries the fix.

- **Eight library pages caught up with their `CHANGELOG.md`.** A release batch on 2026-09-01 never
  reached the documentation, so avatar, history, milestones, panels, portal, skeleton, sortable and
  stepper announced an old version and said nothing about fixes that were already published. A spec
  now checks, for every library with a page, that the page carries its latest release with the date
  the library gives it — the copy was never forced to be made, which is why it silently was not.

- **The breadcrumbs API table documents the service, which is where the trail actually lives.** The
  page listed seven inputs, one output and the tooltip provider, and never named the two members a
  consumer reads to get the trail. `HubBreadcrumbsService.breadcrumbs` and `breadcrumbs$` are now
  rows of their own, typed as what they are — a `Signal<BreadcrumbItem[]>` and an
  `Observable<BreadcrumbItem[]>` — with the choice between them stated: they report the same
  navigation, so the one to take is whichever the calling code already speaks.

- **The avatar API table names `Source`, which 22.10.0 made public.** The output row already typed
  the payload `OutputEmitterRef<Source | null>`, and nothing on the page told the reader that
  `Source` is importable — so the type in that cell read as an internal name, and a handler written
  from the page alone still ended at `any`. The row now names the three members the payload
  carries and says the type is exported, and `Source.getAvatar(size)` gets a methods row of its
  own: it is the one callable member, and the reason to hold on to the payload at all.

- **`FUNCTIONALITIES.md` in both libraries stops under-reporting what the site covers.** Loading
  marked the RTL sweep uncovered, which the new example settles. Breadcrumbs gains a row for the
  trail read from outside the component and keeps its note about no example rendering a
  router-derived trail, which the new one does not change: like every other breadcrumbs demo it
  swaps the service for a stand-in, since by the time a docs example renders the router has long
  since activated.

- **The containers example shows both selector forms of the fieldset.** Grouping fields costs one
  element instead of two since forms 22.33.0, and the point of the change is being able to pick:
  the example drew only `<fieldset hubFieldset>` and mentioned `<hub-fieldset>` in a comment. It
  now renders one group each way, which also puts `[group]` and `groupName` side by side, and a
  spec reads both out of the DOM so a comment can never stand in for a demonstration again. The
  form container has no element form to show — `form[hubForm]` is an attribute selector, because
  the `formGroup` directive has to sit on the same host — and the snippet now says so.

- **The ring's `<ng-content>` row stops leaving the reader to assume the caption is a name.** The
  API table described what the slot renders and said nothing about what it does not do, which is
  the exact misunderstanding the `label` input exists to correct: a caption is decoration, and an
  element with `role="meter"` is named by its author. The row now says so and points at `label`,
  in all eight languages, and the snippet beside it passes the input.

- **The metrics theming demo themes the ring's geometry, which it could not do until this
  release.** `--hub-ring-size` and `--hub-ring-thickness` were advertised as themeable by the
  README, the CSS reference and the token spec while the component wrote a concrete length inline
  on every render, so nothing short of `!important` reached them. metrics 22.3.0 drops that inline
  declaration when the inputs are unset; the demo now sets both tokens in its theme scope and the
  CSS tab explains that an input still wins, because an input is a per-instance override.

- **Three coverage tables stop under-reporting themselves.** `FUNCTIONALITIES.md` in metrics marked
  the accessible name of the meter and of the ring, and the two ring geometry tokens, as shown
  nowhere; modal said the same of `closeAriaLabel` and toast of `closeButtonAriaLabel` and of
  `ToastConfigService.defaults`. Each of those is now demonstrated by a live example, so each row
  says so — and toast's row for the config service is split, because only `defaults` is on the
  page and `resolve()` still is not.

- **The stepper demos stop teaching the module this release retires.** Thirteen examples and the
  playground preview declared the convenience `NgModule` in their `imports` and published that same
  import in the `componentCode` string the reader copies out of the code tab — the one artefact on
  the site that gets pasted into a real application without being read twice. All fourteen now name
  the standalone building blocks the library's README already prescribes: `StepperComponent` and
  `StepComponent` everywhere, plus `StepperNavDirective` in the custom-rail demo and
  `PreviousButtonDirective` / `NextButtonDirective` / `SubmitButtonDirective` in the custom-controls
  one. Both halves moved together, because a demo that compiles against the new shape while handing
  out the old one is worse than either.

- **The i18n demo now says where Back, Continue and Submit come from without the module.** Those
  three words are the only strings the stepper renders on its own, and the `forRoot()` call being
  retired was the only thing that registered them — along with `HubTranslationService` itself, which
  is not `providedIn: 'root'` and which the `translate` pipe injects. A reader who copied a demo's
  new `imports` and nothing else would have met `NullInjectorError` on first render with nothing on
  the page to explain it. The demo's TypeScript tab now names the three paths that work: the
  per-instance `backLabel` / `continueLabel` / `submitLabel` inputs, `provideHubTranslation()` with
  your own dictionary under `HUBUI.STEPPER`, and `provideHubTranslationAdapter()` for an application
  that already has an i18n framework. A spec reads all fourteen demo files and fails if the module's
  name comes back or if those three replacements stop being named, so neither can quietly reverse.

- **The portal service demo injects `HubPortal` and drops the module import that did nothing.** It
  was already injecting the service — the module sat in the `imports` array beside it, teaching a
  redundant second instance as if it were setup. That is the whole content of the deprecation:
  `HubPortalModule`'s body is `providers: [HubPortal]`, and `HubPortal` is `providedIn: 'root'`, so
  the import never switched anything on. The snippet published the same pairing, which is how a line
  that does nothing gets copied into applications for years. A spec now reads every portal demo and
  fails on the module's name, and checks that the ones opening a portal reach the service the way
  the migration note prescribes — by injection.

- **That same demo hands its chrome back to `ExampleViewer`.** It was still wrapping itself in the
  legacy `<app-example-container>` and drawing its own code panes with `HighlightModule`, nested
  inside the tabs the viewer had already drawn around it — and the two service snippets it printed
  there lived on the instance, out of reach of the viewer, which reads statics. It is now the demo
  and nothing else, with a `static readonly templateCode` beside the `componentCode` it already had,
  so the viewer draws both tabs itself like it does for every other example on the site.

### Fixed

- **Three paginable examples were demonstrating templates the table never captured.** They
  projected into `hubTableNotFound`, `hubTableError`, `hubTableLoading` and `hubTableFilter` —
  four attribute names no library in this repository has ever declared — so every one of them
  rendered the built-in default while its code tab taught a reader a spelling that cannot work.
  Angular reports nothing for this: an unmatched attribute on an `<ng-template>` is just an
  attribute. The empty/error/loading example also never bound `[error]`, so its "Show error state"
  button set a flag the table never saw, and the filter example asked for a context key
  (`let-filter`) the outlet does not hand over, on two columns whose `mode: 'menu'` renders no
  projected template at all. Both examples now use the real directives, import them — they are
  standalone, and leaving them out is the same silence again — and read the `formControl` the
  outlet actually passes. A spec reads every `<ng-template>` in the paginable example folders,
  published snippets included, against the selectors the workspace declares.

- **The one-call theming example publishes the code its preview runs.** Its code tab printed the
  `--hub-table-*` tokens on a bare wrapper — the very defect the snippet beside it warns about,
  since the table declares its own defaults on `:host` and out-ranks anything inherited from an
  ancestor — quoted three parameters where the preview sets six, and reached the mixin through a
  deep partial path instead of the `ng-hub-ui-paginable/styles` entry the READMEs teach. The
  published snippet is now the include the page teaches, on a CSS tab where SCSS belongs, with the
  component's own TypeScript on the TS tab. The spec that read the page's snippet against the
  preview now reads the published one against both.

- **Two paginable examples were registered, rendered and unreachable from the panel.** Row menus
  and filter theming are named by their group and by the page, but not by the shell's label map —
  and the panel filters a group's ids down to the ones it can label, so both were dropped from the
  sidebar without a word. The map now names them. A spec reads the three lists against each other,
  so the next example that arrives with two of the three wired fails instead of quietly going
  missing.

- **Eight portal examples declared two imports no template of theirs used.** `HighlightModule` and
  `TranslatePipe`, in `basic`, `component-rendering`, `content-projection`, `data-passing`,
  `progressive-open`, `string-content`, `templateref-rendering` and `toggle` — eight of the nine
  NG8113 warnings every build printed. One is left, in a forms example, which is the point of
  clearing the rest: a warning nobody can read past is a warning nobody reads.

- **The loading page no longer teaches a limitation the library has stopped having.** The RTL
  example said `dir` had to sit on an ancestor because on the `<hub-loading-bar>` element itself it
  did not reach the sweep. That was true of the selector and is not true any more — loading 22.1.1
  matches the bar directly as well — so the example, its CSS snippet and the paragraph under it now
  say the attribute counts wherever it sits.

### Removed

- **Thirty-four example files no page had loaded since it superseded them**, some 7,300 lines: a
  whole `paginator/` folder with no page to consume it, the avatar and modal generations that were
  replaced by differently-named files, and ten table examples. The commented-out block in
  `table.component.ts` that kept three of them looking referenced goes with them — `data-example`
  has not been read by anything for a long time.

- **The three paginable examples that sweep left standing, and the five files it left behind.**
  `pagination-table-example` sold a `paginationPosition` of `top` that the table template cannot
  draw — there is one bottom bar, and the input only decides whether the paginator sits inside it —
  and its other control, the `paginate` toggle, is already shown by two registered examples.
  `sticky-columns-table-example` pinned one column per side where `multiple-sticky-columns` pins
  two. `mixin-table-example` was the preview of the "Mixins and styles" demo and set its tokens on
  a bare wrapper, which the table's own `:host` defaults shadow, so the reader got the default
  theme under a snippet promising purple; the demo now previews `mixin-theme-table-example`, which
  sets them on the table, and the snippet quotes the six parameters that component really sets.
  Two models and the two filtered-table templates under `examples/table/`, plus the last model left
  in `examples/paginator/`, follow the examples that used to import them. A spec holds the line
  from here: every example under the folders the paginable page owns has to be named by a page,
  every helper has to belong to an example, and specs do not count as readers.

## [22.5.6] - 2026-09-05

Records `ng-hub-ui-loading@22.1.0` / `ng-hub-ui-modal@22.10.0`.

### Added

- **The page-progress bar, documented and wired into the site.** `hub-loading-bar` gets three examples, a playground entry, its API tables and the `DOCS.LOADING` and SEO keys in all eight languages. The site drives it too: `provideHubLoadingBarRouter()` and the HTTP interceptor in `app.config.ts`, and a fixed bar at the top of the shell whose z-index derives from the sticky sidebar token rather than a number somebody picked.

    Its `delay` is set to `0` here, against the library's own default, and the reason is measured. Every page on this site ships in the initial bundle, so `NavigationStart` to `NavigationEnd` takes 10 ms; any grace period at all would keep the bar permanently hidden. The bar therefore acknowledges that the click registered rather than reporting elapsed work. If the library pages ever become lazy routes, that setting is the first thing to revisit, because the default would then have real waiting to describe.

### Changed

- **The modal page catches up with 22.10.0.** Its changelog gains the release, and the variants example is registered so the accent bar — off by default from this version — has somewhere to be seen.

## [22.5.5] - 2026-08-31

Records `ng-hub-ui-forms@22.28.0` / `ng-hub-ui-ds@22.7.19`.

### Added

- **A datepicker inside a modal**, the example the fix needed and the site did not have. The select had carried this case since its own stacking bug; the datepicker's was the same shape for a different reason, and nothing on the site would have caught it. The demo is the check: open the dialog, open the calendar, then click away — the calendar draws over the dialog, and its backdrop closes the calendar while leaving the dialog open.

## [22.5.4] - 2026-08-27

Closes the two items left open by the previous release.

### Added

- **CI checks formatting.** `.prettierrc` was declared and enforced nowhere: the script globbed `src/**` only, so 260 files across the 25 libraries had drifted from a config they were nominally held to. They were normalised in 22.5.3 and the glob widened; this adds the step to `ci.yml`, next to the lint it belongs with. A rule nothing enforces is a rule that comes back.

### Changed

- **Eight portal examples stop drawing their own demo/code tabs.** `<app-example-container>` renders its own tab strip and projects `[slot='demo']` / `[slot='code']` — the hand-rolled navigation the example standards prohibit, because `ExampleViewer` already supplies title, tabs and a copy button around every registered example. Each one was rendering that chrome twice. They are bare components now, and the viewer dresses them; the CSS block of the basic example moved to `cssCode`, which is the slot the viewer gives it.

    **Two of the ten keep the container on purpose**: `positioning-portal` carries a third block of portal options and `service-portal` carries two service files, and the viewer has four fixed slots — `templateCode`, `componentCode`, `dataCode`, `cssCode` — with no room for them. The registry can name arbitrary tabs through `sourceCode`, but reaching a component's statics from there means importing it eagerly, which would undo the lazy loading the page is built on. Migrating them would have dropped documented code from the page, so they wait for the viewer to grow a slot rather than lose it.

## [22.5.3] - 2026-08-27

Records `ng-hub-ui-forms@22.26.0` / `ng-hub-ui-ds@22.7.18`, and shows two shapes the site could not show.

### Added

- **The attached-field example gains the leading edge.** Nine slots in it and eight held a button; the only one holding a field held it on the trailing edge — which is the case that never broke. The shape the 22.25.1 corner fix was written for, a count prepended to a period, had no demo anywhere on the site: the fix was pinned by a spec and invisible to a reader. "Repeat: every [2] [weeks]" is now beside "Rate: [180 €] [per month]", so the two directions of the same idea sit together.
- **The timepicker example shows the group it just gained.** Text addons on both edges (`From … UTC`) and a projected action that does something — a _Now_ button that stamps the current time — because a field that can be attached to and nothing on the site attaches to it is a claim rather than a feature.

Both examples' published snippets were updated with them: `field-attached` showed only the appended case, and the timepicker's showed no group at all.

### Changed

- **Arabic and French are withheld from search**, while staying reachable from the language switcher. Over 90 days the two returned zero clicks between them from positions 50-68, while the crawl budget they consumed left newly published English pages unindexed for weeks — `signature`, `loading` and `i18n` all sitting at "Discovered, currently not indexed" while translations ranked at 79. Arabic stays online for a reason beyond politeness: it is the site's live demonstration of RTL support.

    A withheld locale is marked `noindex` **and** dropped from every `hreflang` cluster, because `hreflang` pointing at a `noindex` page is a contradiction Google may resolve by discarding the cluster entirely. Verified in the built output: `/ar/` carries `noindex,follow`, the English cluster lists `en/es/de/zh-Hans/ru/ja/x-default` and neither withheld code, and the sitemap falls from 600 indexable URLs to 432 with no `/ar/` entry at all. `ja` and `zh` are deliberately left indexed pending the 2026-09-05 review, and removing a code restores its pages on the next deploy.

- **A headless library no longer offers an empty `/styles/` tab to the index.** A store, a portal or a set of drag-and-drop helpers exposes no CSS variables, so that tab documents nothing; three of them were being crawled as empty pages. The list of themeable routes is generated alongside the variable tables rather than kept by hand, so it cannot drift from what the tabs actually render.

## [22.5.2] - 2026-08-26

Records `ng-hub-ui-utils@22.11.0` / `ng-hub-ui-forms@22.25.0`, and closes two internationalisation gaps that a key-by-key comparison could not see, because the strings never reached the translation files at all.

### Fixed

- **The theme names were English literals in the service.** `Base`, `Dark`, `Sunset`, `Forest`, `Mono` and `Terminal` were hard-coded in `ThemeService`, so a reader on any other language met them in English among otherwise translated chrome, and no key existed to translate. They come from `UI.THEMES.*` now, in all eight languages, resolved through a `computed` over the language signal so they follow a switch without a reload. `Bootstrap` stays as it is — it is another framework's name, not a description of a colour scheme.
- **The Design System submenu was Spanish-only, whatever the language.** Its eighteen entries were Spanish literals in `app-shell.component.ts`, which the code itself admitted in a comment. They are translation keys now, in all eight languages. The anchor ids stay Spanish: they are part of the URL, and changing them would break every link ever shared.
- **`Badges`, `Buttons` and `Toast` were the only library names untranslated in every locale** while the other twenty were translated. Named now in Arabic, Japanese, Russian and Chinese, and in Spanish, German and French where a natural term exists — `Toast` stays in the Latin-script locales the way `Modal` does.

### Removed

- **`src/app/components/docs/board/`** — 469 orphaned lines, routed from nowhere and imported by nothing, telling the reader that `ng-hub-ui-board` requires Angular CDK for its drag & drop. It imports the CDK zero times, and the install command named a package that does not exist.

## [22.5.1] - 2026-08-26

Records the `ng-hub-ui-forms@22.24.0` / `ng-hub-ui-ds@22.7.17` release and the docs work it exposed.

### Added

- **A right-to-left example for `forms`**, in a section of its own. The release claimed the whole library mirrored and nothing on the site rendered it. It puts every field under a direction the reader can flip, so the three components whose geometry is only half CSS — slider, switch and segmented — can be seen doing it rather than read about. The segmented one is the point of the toggle: before this release its indicator stayed where it was on a direction change, up to 145px from the option it marked.
- **A floating datepicker in the select example**, so the three fields that can float a label stand side by side at the same 56px. Previously the changelog claimed three and only two could.

### Fixed

- **Sixteen corrections to the `forms` API table**, each verified against the component source rather than against the previous table: an output that does not exist (`hubForm` listens to the form's own `submit` event and has no custom output of its own), `classlist` typed `string | string[]` when every one of its nine declarations is `input<string>('')` and two of the components credited with it do not have it, `searchFn` undocumented, `disabled` and `required` documented as one component's when every field inherits them as two-way models, and `hub-timepicker` without a single row. Nineteen descriptions added or rewritten across all eight locales.
- **Twenty-eight example components published an empty code tab.** The viewer reads the snippets off the class and falls back to instantiating the component, which throws `NG0203` for anything using `inject()` or a signal input — so the fallback never returned anything. Eighty warnings per build, ten portal examples across eight prerendered locales, are now none. The examples that draw their own code tabs reach the static through `this.constructor`, since a template cannot.
- **The token parity check no longer skips a declaration that wraps.** Its pattern needed the whole declaration, terminating `;` included, on one line, so a long `calc()` registered as _undeclared_: value parity had nothing to compare and the documented value was free to drift in silence. Teaching it to read a wrapped declaration surfaced sixteen stale values — one in the token spec and fifteen in the per-library reference docs of `avatar`, `board`, `modal`, `paginable`, `panels` and `stepper`, where for instance `--hub-modal-margin` was still documented as `1.75rem auto` long after the code had decomposed it into four per-side tokens.
- **The deprecated `<hub-input type="file">` in the input-groups example is marked as such** where it is read, not only on the page's feature list. The library warns in the console on every render; a console warning is not visible in a screenshot, and the example is what gets copied.

## [22.5.0] - 2026-08-21

Three weeks of work on the documentation site went unlogged, so this entry is written from the history rather than from memory: 74 commits since `22.4.3`.

### Added

- **Examples grouped under feature headings**, in the menu and on the page, so a library with twenty of them reads as a catalogue rather than a list. The active example is marked and the scroll spy follows it — with the marking now pinned to what the reader is actually looking at rather than to whichever section last crossed the threshold.
- **A travelling mark on the nav**, so moving between sections reads as one element crossing rather than two blinking.
- **The signature library page and an i18n guide**, and a demo of the nav's rail mode with the shell adapted to it.
- **New examples for what shipped this month**: a stepper driving a modal from its footer, a field attached to another field's edge, single selection over a grouped list, the flush variant of a list and a table, a table whose controls are drawn as a spreadsheet, an editable modal body slot, and row actions with a variant and an accent.

### Fixed

- **Every library is built, not the fifteen the list had drifted to.** The build enumerated its libraries by hand and the list fell behind, so packages were being released from a `dist/` nobody had rebuilt.
- **The prerendered redirect stubs answer 301 instead of 200**, and internal links are emitted in the canonical trailing-slash form — two ways the site was telling a crawler that a redirect was a page.
- **Library symbols are generated before the library test suite runs**, which is what made that step fail in CI and pass locally.
- **The app shell registers the example links it was missing** and drops a stale caret.

### Changed

- **The deployment goes over rsync**, retrying three times before falling back to the SFTP mirror, which took the deploy from a quarter of an hour to a couple of minutes when the host is healthy — and survives it when it is not.
- **Each library's `/api` meta description names its public symbols**, so a search result says what the package exports instead of repeating the package name.
- **`socket.yml` records the supply-chain sweep**: what was checked across all 23 buildable libraries, what was accepted and why, and what is deliberately left reported.

## [22.4.3] - 2026-07-30

### Library releases recorded in this cycle

- `forms 22.11.1` — **the caret flip shipped in 22.11.0 never engaged in apps
  without a global tick** (zoneless / OnPush islands): `ng-select-opened` was a
  host binding, host bindings apply during the parent view's refresh, and
  `open()` only refreshes its own template via a local `detectChanges()`. The
  class is now reflected imperatively (synchronous in `open()`/`close()` + an
  effect for `[isOpen]`-driven writes), the mechanism the panel's
  `ng-select-bottom` already proved CD-proof. The regression spec toggles the
  select under zone-based AND zoneless change detection with no manual tick —
  the manual tick in test setups is exactly what masked the bug.

## [22.4.2] - 2026-07-29

### Changed

- The forms, table and stepper pages record today's upstream batch; the forms
  page also backfills the missing 22.10.0 entry (the accent-dedup release). The
  generated CSS-variables tables grow from 1253 to 1259 tokens (the home stat
  follows automatically).

### Library releases recorded in this cycle

The second consumer-reported batch of the day — three premises, all three
verified true before touching:

- `forms 22.11.0` — **the select caret had never rendered** (the vendored
  engine ships `.ng-arrow` as a 0×0 border-triangle span and the theme only
  published `border-color`). Full geometry now ships, with clearance
  (`--hub-select-arrow-gap`), an open-state upward flip, a size token
  (`--hub-select-arrow-size`) and a regression spec that pins the complete
  closed/open declarations.
- `paginable 22.7.0` — the header gains `--hub-table-head-border-width`
  (defaults to the shared cell border: zero visual change),
  `--hub-table-head-text-transform` and `--hub-table-head-letter-spacing`.
- `stepper 22.7.0` — `--hub-stepper-indicator-size`, the canonical
  step-indicator metric for custom trigger templates and companion tracks,
  space-derived so density re-themes move it.
- `ds 22.7.1` — token catalogue documents the six new tokens; README mixin
  list carries the `offset` entry the 22.7.0 tarball missed.

## [22.4.1] - 2026-07-29

### Changed

- **The design-system page documents the ds utility growth with live demos**:
  offsets rendered on the real grid (`col-4 offset-4`, `col-3 offset-9`), a
  resize-me responsive flex row (`flex-column flex-md-row
align-items-md-center`), the `.vr` separator and the `.h1…6` scale next to
  `.fs-*` (with the difference explained); the responsive section truthfully
  lists the whole flex family, the grid and flex snippets show `offset-md-8`,
  `flex-md-row` and `.vr`, and the layout-mixins table and quick reference gain
  the new `offset($n)` / responsive entries.
- The `anyComponentStyle` error budget rises from 96 kB to 128 kB: the
  design-system page embeds the three full ds utility sheets by design and the
  22.7.0 growth left it at 91 kB — 5 kB from failing the build on the next ds
  addition. The 12 kB warning still flags ordinary components.

### Library releases recorded in this cycle

`ds 22.7.0` — a consumer-reported audit against Bootstrap 5 (verified before
touching: 4 real gaps, 1 false premise — `m-b-0` was never a Bootstrap 5 name —
and `dropdown-item` declined as component territory): `.offset-1…11` +
responsive offsets on the CSS grid with a new `offset($n)` mixin, responsive
variants for the whole flex family across sm…xxl, `.h1`–`.h6` heading classes
and the `.vr` vertical rule.

## [22.4.0] - 2026-07-28

The five-front release: complete API documentation, a pipeline that actually
gates, and one accent resolver for the whole family.

### Added

- **`methods` API section** on the library pages, populated with source-verified
  truth for the service-first libraries (modal 17 rows, history 16, portal 5,
  toast 7); complete input/output tables for buttons (34/9), board, toast, nav
  and the forms gaps; a locale-formatted "Last updated" line on every overview;
  20 registered-but-invisible examples rescued into the aside; milestones and
  installer rows in the root READMEs. 157 new i18n keys translated across the 8
  locales (parity exact: ui 246×8, docs 1492×8).
- **IndexNow** (static key + resilient ping after each successful deploy) and
  truthful `<lastmod>` on 512 sitemap URLs; `llms-full.txt` grows from ~800 to
  6,075 words of real per-library grounding; `llms.txt` lists all 21 API
  references.
- **CI/CD teeth**: the workspace is compiled in CI and the full library suite
  gates every deploy; angular-eslint (517 errors → 0, behavioral rules visible
  as warnings), prettier and coverage tooling, dependabot/CODEOWNERS/SECURITY/PR
  template, jsdom setupFiles for all 22 library test targets, realistic bundle
  budgets, strict npm peer resolution restored.

### Changed

- Tab titles fit SERPs: the 21 `/api` titles now max at 60 chars, home
  description ≤160 and about title ≤60 in all 8 locales; hreflang announces
  `zh-Hans`; `og:locale` for Arabic is `ar_SA`; HTML answers with
  `max-age=300, stale-while-revalidate`; `.txt` ships UTF-8.

### Library releases recorded in this cycle

Accent dedup (single canonical `resolveHubAccent` from utils, new peer):
`avatar 22.9.0` · `forms 22.10.0` · `metrics 22.2.0` · `milestones 22.3.0` ·
`panels 22.10.0` · `toast 22.6.0` · `installer 0.1.2` (co-installs utils).
Test hardening: `skeleton 22.2.1` (4→79 tests) · `history 22.0.1` (5→38 tests).

## [22.3.0] - 2026-07-28

The technical-SEO release: faster boot, honest 404s and a coherent entity graph.

### Changed

- **One language per visitor.** The i18n dictionaries are no longer bundled
  eagerly for all 8 locales (~2 MB raw / 396 KB brotli modulepreloaded on every
  page view): English ships statically as default + fallback base, and every
  other language is a lazy chunk awaited by a route guard before its pages
  render — prerender stays fully localized, and page views save roughly 360 KB
  compressed.
- **Structured data describes ONE entity per package.** Locale-neutral singleton
  `@id`s (`#software-<lib>`), byte-identical across tabs and locales, pinned to
  the canonical English overview; `Organization`/`Person` now travel in every
  graph (no dangling references), with real `softwareVersion`/`dateModified`
  projected from each library's package.json/CHANGELOG by a new generator.

### Fixed

- **Unknown URLs answer a real 404** (the shell defaults to `noindex,follow` and
  `.htaccess` serves it via `ErrorDocument 404`), rendering a localized
  not-found page instead of masquerading as an indexable copy of the homepage.
- `inLanguage`/`url` are no longer injected into JSON-LD types that don't admit
  them (`Organization`, `Person`, `BreadcrumbList`).
- The SFTP deploy retries its idempotent mirror up to 3 times (two transient
  Hostinger drops killed deploys on 2026-07-28).

### Removed

- The ~45 orphaned `/examples/**` standalone routes and their 42 eager imports
  (nothing linked them; the aside navigates by in-page anchors). 24 fewer
  prerendered pages; the sitemap stays at 544 indexable URLs.

## [22.2.0] - 2026-07-28

The accessibility release: every interactive library now has a real keyboard and
screen-reader story.

### Added

- **Docs for the accessibility batch across ten libraries**: pages record the new
  releases and gain the new api rows (`interactive`, `removeLabel`, `railLabel`,
  `boardLabel`), the panels removable example demonstrates `removeLabel`, and 4 new
  DOCS keys ship translated in the 8 locales (docs domain at 1340/1340 parity).

### Fixed

- **Prerender was throwing 8 `ReferenceError`s per build** (swallowed with a 200):
  the portal toggle example interpolated a bare `${name}` inside its code snippet —
  `window.name` in the browser, undefined in Node. Escaped.
- CI workflows gained `concurrency` groups after two overlapping SFTP deploys raced
  on the remote tree: deploys now queue, superseded CI runs are cancelled.

### Library releases recorded in this cycle

`calendar 22.5.0` (ARIA grid + keyboard navigation + first test suite) ·
`board 22.4.0` (keyboard card reorder + live announcer + `boardLabel`) ·
`panels 22.9.0` (real remove button + focus return + `removeLabel`) ·
`stepper 22.6.0` (APG tablist rail + `railLabel` + `type="button"` form fix) ·
`avatar 22.8.0` (`interactive` input) · `toast 22.5.2` (live regions) ·
`breadcrumbs 22.4.1` (`aria-current`) · `milestones 22.2.1` (list semantics) ·
`portal 22.0.3` (invalid `aria-portal` removed) · `sortable 22.1.1` (pointer-only
limitation documented) · `installer 0.1.1` (history restored to the catalogue;
npm publish deliberately on hold) — see each `projects/<lib>/CHANGELOG.md`.

## [22.1.0] - 2026-07-28

### Added

- **Every library `examples` tab is prerendered** (168 pages: 21 libraries × 8
  locales) with its own title, canonical and `noindex,follow` — those URLs used to
  serve the raw CSR shell with the homepage metadata.
- **Own SEO metadata for `/tokens`, `/theming` and `/design-system`** (localized
  `SEO.PAGE.*` titles/descriptions in the 8 locales); the bare `/examples` container
  route is now honestly `noindex`.
- **Two new forms examples**: async typeahead + tag creation for `hub-select`
  (`forms-select-typeahead`) and the `hubSegmentedOption` custom option template
  (`forms-segmented-template`), both registered and reachable from the aside.
- **Icons and Metrics cards in the home catalogue**, with localized descriptions.
- **This changelog**, and a real version for the docs app (`22.1.0`): the aside
  footer used to render `v0.0.0` because the root `package.json` was never versioned.

### Changed

- **Home stats are derived, not hardcoded**: component count comes from the
  catalogue (21) and the CSS-variables count from the generated docs tables (1253) —
  the footer previously claimed «19» and «80+».
- **SEO i18n backfill**: `SEO.LIBRARY.BUTTONS.*` and `SEO.LIBRARY.BADGES.*`
  translated into fr/de/zh/ru/ar/ja (their pages shipped English or empty metadata
  in 6 locales); key parity verified across the three i18n domains
  (seo 312 · docs 1336 · ui 238 × 8 locales).
- **Sitemap at 544 indexable URLs** (all with 9 hreflang alternates), regenerated on
  every build.
- Library docs pages record the new releases; the utils page gained its first
  changelog block.

### Fixed

- **Legacy two-segment redirects** (`/<lib>/overview` …) meta-refreshed to broken
  duplicated paths (`/buttons/en/buttons/overview`) — targets are now absolute.
- **All 6 breadcrumbs example anchors in the aside were dead** (ids never matched
  the registered examples); the truncation example is now reachable and the
  non-existent «styling» entry is gone.
- `hubui.dev/icons` legacy URL redirects to the library page instead of falling
  through to home.
- The typeahead example guards against the vendor's `null` emission when the search
  box clears after a selection (console `TypeError` on every selection).
- 2 missing `DOCS.PANELS.API.INPUT.*` keys in the 7 non-English docs files.

### Library releases recorded in this cycle

`utils 22.7.1` · `nav 22.7.2` · `modal 22.5.0` · `forms 22.9.0` · `stepper 22.5.1` ·
`paginable 22.6.1` · `buttons 22.9.1` · `calendar 22.4.1` · `portal 22.0.2` ·
`panels 22.8.3` · `history 22.0.0` (first publish) · `installer 0.1.0` (first
publish) — see each `projects/<lib>/CHANGELOG.md` for details.

## [22.0.0] - 2026-07-10

Baseline of the versioned docs site: the state deployed to hubui.dev before this
changelog existed. Documentation for 21 libraries (overview / API / styles /
examples / playground) in 8 locales (en, es, fr, de, zh, ru, ar, ja) with full key
parity; Angular 22 static prerender (~1500 routes) with per-page canonical,
hreflang and JSON-LD; the `--hub-ref-*`/`--hub-sys-*` design-token system with
generated CSS-variable and mixin references; generated sitemap, `llms.txt` and
`llms-full.txt`; and the June 2026 SEO sweep (trailing-slash canonicalization,
root 301, security headers, AI-crawler policy).
