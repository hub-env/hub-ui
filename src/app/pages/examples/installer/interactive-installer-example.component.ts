import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CodeSnippet } from '../../../shared/example-viewer/code-snippet';

/** The command, and the prompt the Angular CLI renders once the schematic takes over. */
const COMMAND = `ng add ng-hub-ui`;

/** Trimmed to the first entries: the real prompt lists all 25 catalogued libraries. */
const PROMPT = `? Which ng-hub-ui libraries do you want to install?
  (Press <space> to select, <a> to toggle all, <i> to invert selection)
 ◯ Action Sheet
 ◯ Avatar
 ◯ Badges & Chips
 ◯ Board (Kanban)
 ◉ Modal
 ◉ Paginable (table & list)
 ◯ …

✔ Packages installed successfully.
Installed ng-hub-ui libraries: modal, paginable`;

/**
 * The default way in: one command, a multi-select, and the schematic resolves the rest.
 *
 * There is nothing to render for a package that ships no components, so the demo is the
 * transcript — which is also what the reader is about to see in their own terminal. The
 * selection is what the schematic reads; every co-installed peer is added on top of it
 * without being offered in the list.
 */
@Component({
	selector: 'app-installer-interactive-example',
	standalone: true,
	imports: [CodeSnippet],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<code-snippet [code]="command" language="bash" />
		<code-snippet [code]="prompt" language="bash" />
		<p class="text-muted small mb-0 mt-3">
			Space selects, <code>a</code> toggles everything and <code>i</code> inverts the selection. The schematic writes the
			chosen packages into <code>dependencies</code> and then lets the package manager install them.
		</p>
	`,
	styles: []
})
export class InteractiveInstallerExampleComponent {
	protected readonly command = COMMAND;
	protected readonly prompt = PROMPT;

	/** Read statically by the example viewer; the class is never instantiated for this. */
	static readonly sourceCode: Record<string, string> = {
		SH: `${COMMAND}\n\n${PROMPT}`
	};
}
