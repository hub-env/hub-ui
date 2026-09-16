import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CodeSnippet } from '../../../shared/example-viewer/code-snippet';

/** Two identifiers asked for; five packages written. */
const COMMAND = `ng add ng-hub-ui --libraries=signature,sortable`;

/**
 * The `dependencies` block afterwards. Ranges are the catalogue's, not this page's — the
 * point of the example is which KEYS appear, not the numbers beside them.
 */
const MANIFEST = `{
  "dependencies": {
    "ng-hub-ui-signature": "^22.6.1",
    "ng-hub-ui-forms": "^22.32.0",
    "ng-hub-ui-utils": "^22.12.0",
    "ng-hub-ui-sortable": "^22.1.3",
    "sortablejs": "^1.15.2"
  }
}`;

/**
 * What a selection actually writes, which is more than what was asked for.
 *
 * `signature` needs the form-field shell whose contract it inherits, and both it and
 * `sortable` need what their own peers need — including one package that is not ours at
 * all. Resolution is transitive, so a co-installed library contributes its peers too. A key
 * already present in the manifest is never rewritten, which is what keeps a version the
 * project has deliberately pinned from being replaced by the catalogue's range.
 */
@Component({
	selector: 'app-installer-resolved-dependencies-example',
	standalone: true,
	imports: [CodeSnippet],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<p class="text-muted small mb-2">Two libraries asked for…</p>
		<code-snippet [code]="command" language="bash" />

		<p class="text-muted small mb-2 mt-3">…five packages written into <code>package.json</code></p>
		<code-snippet [code]="manifest" language="json" />

		<p class="text-muted small mb-0 mt-3">
			The schematic adds a dependency only when the key is absent, so a version already pinned in your manifest survives
			the install untouched.
		</p>
	`,
	styles: []
})
export class ResolvedDependenciesInstallerExampleComponent {
	protected readonly command = COMMAND;
	protected readonly manifest = MANIFEST;

	/** Read statically by the example viewer; the class is never instantiated for this. */
	static readonly sourceCode: Record<string, string> = {
		SH: COMMAND,
		JSON: MANIFEST
	};
}
