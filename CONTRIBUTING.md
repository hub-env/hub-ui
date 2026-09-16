# Contributing to Hub UI

Thanks for taking the time to help. A typo fix and a new component example count as much as a bug fix.

## Where things live

Hub UI lives in the [hub-env](https://github.com/hub-env) organization:

| Repository | What it holds |
| --- | --- |
| [`hub-ui`](https://github.com/hub-env/hub-ui) | This repository. The Angular workspace behind [hubui.dev](https://hubui.dev/en/) (documentation site, examples, build and test scripts), the roadmap and the issue tracker for the whole project |
| `ng-hub-ui-*` | One repository per npm package, with its source, `CHANGELOG.md` and `BREAKING_CHANGES.md`. Each one is mounted here in `projects/` as a git submodule |

```
hub-ui/
├── src/            documentation site: one page per library, with examples and API tables
├── projects/       the libraries, one git submodule per npm package
├── public/         static assets of the site
├── scripts/        generators (tokens, sitemap, llms.txt), library tests and publishing
└── shared/         pieces shared between the site and the libraries
```

## Reporting a bug or asking for a feature

Open an issue in [hub-ui](https://github.com/hub-env/hub-ui/issues/new/choose) and pick the package from the list. A bug report is much easier to act on when it includes:

- the package and version (`npm ls ng-hub-ui-board` prints it);
- your Angular version;
- a minimal reproduction, ideally a StackBlitz;
- what you expected and what happened instead.

Security problems go by email, never in a public issue. See [SECURITY.md](.github/SECURITY.md).

## Setting up the workspace

The workspace needs Node.js 22 or later and npm 10.

```bash
git clone --recurse-submodules https://github.com/hub-env/hub-ui.git
cd hub-ui
npm ci
npm start
```

`npm start` serves the documentation site at `http://localhost:4200` with every library built from source, so a change in `projects/<library>/src` shows up in its examples straight away.

Other commands you will use:

| Command | What it does |
| --- | --- |
| `npm test` | Unit tests of the documentation app (Vitest) |
| `npm run test:libs` | Unit tests of every library |
| `npm run lint` | ESLint over the app |
| `npm run format:check` | Prettier over the app and the libraries |
| `npm run build` | Production build of the site, plus the sitemap and `llms.txt` |
| `npm run build:all-libs` | Builds every library with ng-packagr |

## Making a change to a library

Each folder in `projects/` is the package's own repository, so the change and the pull request belong there:

1. Fork the package repository (for example `hub-env/ng-hub-ui-board`) and add your fork as a remote inside `projects/board`.
2. Create a branch in that folder and make the change.
3. Add an entry to the package's `CHANGELOG.md` under `[Unreleased]`, in English, with the date as `YYYY-MM-DD`.
4. Update the package's `README.md` and `README.es.md` if the public API changed.
5. Run the checks from the workspace root:

   ```bash
   npm run test:libs
   npm run format:check
   ```

6. Push the branch to your fork and open the pull request against the package repository. Link the issue it fixes.

Documentation and example changes are made in `src/` and go to this repository as a normal pull request.

## Code guidelines

The libraries follow the current [Angular style guide](https://angular.dev/style-guide). In practice:

- Standalone components with `ChangeDetectionStrategy.OnPush`, and signals for state.
- Built-in control flow (`@if`, `@for`, `@switch`) in templates, and no `CommonModule`.
- Host bindings and listeners in the `host` metadata object, not `@HostBinding` or `@HostListener`.
- Styles stay encapsulated and are themed through `--hub-*` custom properties. [CODING_RULES.md](CODING_RULES.md) lists the few cases where a component may leave encapsulation.
- JSDoc in English on public classes and methods, explaining why the code does what it does.
- Keyboard support and screen-reader behaviour are part of the feature. A change that breaks them is a bug.
- Formatting comes from [`.prettierrc`](.prettierrc): tabs, single quotes, 128 columns.

## Commit messages

Commits use [Conventional Commits](https://www.conventionalcommits.org/) with the package as the scope:

```
fix(board): announce the columns as the items of the board's list
feat(forms): add a clear button to the datepicker
docs(paginable): document the server-side mode
```

## Versioning

A package's major version matches the Angular major it supports, so a breaking change inside `22.x` is released as a minor version and explained in `BREAKING_CHANGES.md`. You don't need to bump versions in your pull request; that happens at release time.

## Finding something to work on

Issues labelled [`good first issue`](https://github.com/hub-env/hub-ui/labels/good%20first%20issue) are a reasonable size for a first contribution, and [`help wanted`](https://github.com/hub-env/hub-ui/labels/help%20wanted) marks the ones where outside help would make a difference. If you want to take one, leave a comment so nobody else starts on it at the same time.

## Code of conduct

Everyone taking part follows the [Code of Conduct](CODE_OF_CONDUCT.md).

## License

By contributing, you agree that your contribution is released under the [MIT license](LICENSE).
