# Contributing to Hub UI

Thanks for taking the time to help. A typo fix or a clear bug report counts as much as a new feature.

## Where things live

| Repository | What it holds |
| --- | --- |
| [`hub-ui`](https://github.com/hub-env/hub-ui) | This repository: overview, roadmap and the issue tracker for every package. It holds no code |
| `ng-hub-ui-*` | One repository per npm package, with its source, tests, `CHANGELOG.md` and `BREAKING_CHANGES.md`. The [package list](README.md#packages) links to each one |

The documentation site at [hubui.dev](https://hubui.dev/en/) is built from a private workspace that mounts every package repository. That is where each change is tested against the live examples before it is released.

## Reporting a bug or asking for a feature

Open an issue in [hub-ui](https://github.com/hub-env/hub-ui/issues/new/choose) and pick the package from the list. A bug report is much easier to act on when it includes:

- the package and version (`npm ls ng-hub-ui-board` prints it);
- your Angular version;
- a minimal reproduction, ideally a StackBlitz;
- what you expected and what happened instead.

Security problems go by email, never in a public issue. See [SECURITY.md](.github/SECURITY.md).

## Sending a change to a package

1. Open an issue first for anything bigger than a small fix, so the approach is settled before you write it.
2. Fork the package repository (for example `hub-env/ng-hub-ui-board`) and create a branch.
3. Make the change, and add or update the `*.spec.ts` file next to the code you touched.
4. Add an entry to the package's `CHANGELOG.md` under `[Unreleased]`, in English, with the date as `YYYY-MM-DD`.
5. Update `README.md` and `README.es.md` if the public API changed.
6. Open the pull request against the package repository, link the issue, and say how you tested the change in an app of yours.

I run the package's test suite and the documentation examples on every pull request before merging, so you don't need the private workspace to contribute.

## Code guidelines

The packages follow the current [Angular style guide](https://angular.dev/style-guide). In practice:

- Standalone components with `ChangeDetectionStrategy.OnPush`, and signals for state.
- Built-in control flow (`@if`, `@for`, `@switch`) in templates, and no `CommonModule`.
- Host bindings and listeners in the `host` metadata object, not `@HostBinding` or `@HostListener`.
- Styles stay encapsulated and are themed through `--hub-*` custom properties.
- JSDoc in English on public classes and methods, explaining why the code does what it does.
- Keyboard support and screen-reader behaviour are part of the feature. A change that breaks them is a bug.
- Formatting: tabs, single quotes, 128 columns, no trailing commas.

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
