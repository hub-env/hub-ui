# Coding Rules

## Style encapsulation: when a library component may leave it

`ViewEncapsulation.Emulated` is the default and stays the default. Turning it off — or
reaching past it with `::ng-deep` — publishes the component's stylesheet into the
application's global cascade, where it competes with rules the library never sees and cannot
be removed by anyone who did not know it was there. So it needs a reason, and the reason has
to be one of these four.

**1. The element is not in the component's own view.** Content the consumer wrote and the
component only receives — `<ng-content>` slots, or nodes moved in imperatively as the modal
and portal windows do — carries the consumer's `_ngcontent` marker, not the component's, so
an encapsulated rule never reaches it. Same for a node the component creates on `document.body`
(a backdrop, an overlay) and for a class it writes on `body` or `:root`.

**2. The stylesheet is a public contract a consumer's own sheet has to reproduce.** When the
library ships a Sass mixin that emits rules for the component's *inner* elements, those rules
are authored outside the component and cannot carry its marker attribute. The component's own
rules must then match on the same plain selectors, or the built-in variants and the
consumer-generated ones stop being interchangeable.

**3. The rules also dress a sibling that is not this component.** One base stylesheet shared by
a component and a directive — `<hub-icon>` and `[hubIcon]` — is emitted once from the
component, and the directive's host is nobody's view.

**4. A third-party directive builds its element outside your reach** and accepts no class of
yours. Rare; the same rule applies — state which library and which element.

**What is not a reason:** applying the host's own class from the stylesheet (use `:host`);
"the tokens need to be global" (declare them on `:host` and let the consumer re-declare them
wherever they want — a custom property inherits); needing to beat a consumer's utility class
(that is a specificity decision, and it does not need the whole sheet made global); and "the
other components in this library already do it".

**Every exception is written down where it is taken.** A comment immediately above
`encapsulation: ViewEncapsulation.None` (or above the `::ng-deep` rule) naming which of the
four reasons applies and which element forced it. Not a link to this file — the reason the
next reader needs is the specific one, and it belongs at the exception. Without that comment
the exception cannot be reviewed, and nobody can ever tell whether it is still needed.

**Namespacing is required, not optional.** A global rule is still the library's, so every
selector it emits stays under the component's own `.hub-<component>*` prefix. No bare element
selectors, no utility-class names, nothing that could match an element the library does not own.

## Releases (ng-hub-ui-paginable)

1. Update the version in `projects/paginable/package.json` following SemVer.
2. Update `projects/paginable/CHANGELOG.md` with a new entry at the top:
   - Use the format `## [x.y.z] - YYYY-MM-DD`.
   - Group notes under `### Added`, `### Changed`, `### Fixed`, `### Removed` as needed.
3. Commit inside the submodule:
   - `git -C projects/paginable add -A`
   - `git -C projects/paginable commit -m "chore(release): x.y.z"`
4. Update the parent repo to point to the new submodule commit:
   - `git add projects/paginable`
   - `git commit -m "chore: bump paginable to x.y.z"`
5. (Optional) Tag and push:
   - `git -C projects/paginable tag vX.Y.Z`
   - `git -C projects/paginable push --tags`

## Releases (ng-hub-ui installer / schematics)

When publishing a library version that should be available through `ng add ng-hub-ui`, also check whether the installer catalogue needs an update:

1. Update `projects/installer/schematics/ng-add/library-packages.ts` with the published package version or new library entry.
2. Run `npm run publish:installer` to compile the schematic runtime files and publish the `ng-hub-ui` meta package.
3. Do not commit generated schematic `.js` files; they are build artifacts covered by `projects/installer/.gitignore`.
