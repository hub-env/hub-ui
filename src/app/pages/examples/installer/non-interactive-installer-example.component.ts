import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CodeSnippet } from '../../../shared/example-viewer/code-snippet';

/** Comma-separated selection — the shortest form, and the one a script usually writes. */
const COMMA_SEPARATED = `ng add ng-hub-ui --libraries=modal,paginable,utils`;

/** The same selection expressed one flag at a time. Both forms normalize identically. */
const REPEATED_FLAG = `ng add ng-hub-ui --libraries=calendar --libraries=stepper`;

/** Manifest only: the packages land in `dependencies`, the install is left to the caller. */
const SKIP_INSTALL = `ng add ng-hub-ui --libraries=modal --skip-install`;

/**
 * The prompt skipped, for CI and for anyone who already knows what they want.
 *
 * The identifiers are the ones in the catalogue table, not the labels the prompt renders —
 * those are two different strings, and passing a label is the mistake this example exists
 * to prevent. An unknown identifier stops the schematic before anything is written.
 */
@Component({
	selector: 'app-installer-non-interactive-example',
	standalone: true,
	imports: [CodeSnippet],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<p class="text-muted small mb-2">Comma-separated</p>
		<code-snippet [code]="commaSeparated" language="bash" />

		<p class="text-muted small mb-2 mt-3">Repeated flag — the same selection, normalized the same way</p>
		<code-snippet [code]="repeatedFlag" language="bash" />

		<p class="text-muted small mb-2 mt-3">Manifest only, install left to you</p>
		<code-snippet [code]="skipInstall" language="bash" />

		<p class="text-muted small mb-0 mt-3">
			An empty selection fails with <code>Select at least one ng-hub-ui library to install.</code> and an unknown
			identifier with <code>Unknown ng-hub-ui library: &lt;id&gt;.</code> — in both cases before
			<code>package.json</code> is touched.
		</p>
	`,
	styles: []
})
export class NonInteractiveInstallerExampleComponent {
	protected readonly commaSeparated = COMMA_SEPARATED;
	protected readonly repeatedFlag = REPEATED_FLAG;
	protected readonly skipInstall = SKIP_INSTALL;

	/** Read statically by the example viewer; the class is never instantiated for this. */
	static readonly sourceCode: Record<string, string> = {
		SH: `# Comma-separated\n${COMMA_SEPARATED}\n\n# Repeated flag\n${REPEATED_FLAG}\n\n# Manifest only\n${SKIP_INSTALL}`
	};
}
