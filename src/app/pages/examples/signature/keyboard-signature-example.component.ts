import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { HubSignatureComponent, type HubSignatureDrawEvent } from 'ng-hub-ui-signature';
import { AppI18nService } from '../../../services/app-i18n.service';
import { HubBadgeComponent } from 'ng-hub-ui-badges';

/**
 * The signing path for anyone without a pointer, and the reason the draw outputs carry a union.
 *
 * Tab into the surface and the pen appears in the middle of it. The stroke the keyboard produces
 * is indistinguishable from a drawn one — same geometry, same SVG, same reported value — so the
 * badge can only tell the two apart by narrowing `HubSignatureDrawEvent`, which is exactly what a
 * host that cares about the input device has to do.
 */
@Component({
	selector: 'app-signature-keyboard-example',
	standalone: true,
	imports: [HubSignatureComponent, HubBadgeComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="d-flex flex-column gap-3">
			<hub-signature
				[label]="i18n.translate('DOCS.SIGNATURE.EXAMPLE.KEYBOARD.LABEL')"
				[formText]="i18n.translate('DOCS.SIGNATURE.EXAMPLE.KEYBOARD.HELP')"
				(drawStart)="onDrawStart($event)"
			/>

			<ul class="list-unstyled d-flex flex-column gap-2 mb-0 small">
				<li class="d-flex gap-2 align-items-baseline">
					<span class="text-nowrap"><kbd>&larr;</kbd> <kbd>&uarr;</kbd> <kbd>&darr;</kbd> <kbd>&rarr;</kbd></span>
					<span>{{ i18n.translate('DOCS.SIGNATURE.EXAMPLE.KEYBOARD.MOVE') }}</span>
				</li>
				<li class="d-flex gap-2 align-items-baseline">
					<span class="text-nowrap"><kbd>Shift</kbd> + <kbd>&rarr;</kbd></span>
					<span>{{ i18n.translate('DOCS.SIGNATURE.EXAMPLE.KEYBOARD.COARSE') }}</span>
				</li>
				<li class="d-flex gap-2 align-items-baseline">
					<span class="text-nowrap"><kbd>Space</kbd> / <kbd>Enter</kbd></span>
					<span>{{ i18n.translate('DOCS.SIGNATURE.EXAMPLE.KEYBOARD.TOGGLE') }}</span>
				</li>
				<li class="d-flex gap-2 align-items-baseline">
					<span class="text-nowrap"><kbd>Esc</kbd></span>
					<span>{{ i18n.translate('DOCS.SIGNATURE.EXAMPLE.KEYBOARD.DISCARD') }}</span>
				</li>
			</ul>

			<hub-badge
				shape="rounded"
				class="align-self-start"
				[class.text-bg-primary]="device() === 'keyboard'"
				[class.text-bg-secondary]="device() !== 'keyboard'"
			>
				{{ statusText() }}
			</hub-badge>
		</div>
	`,
	styles: []
})
export class KeyboardSignatureExampleComponent {
	/** Translation facade used to keep the interactive documentation locale-aware. */
	protected readonly i18n = inject(AppI18nService);

	/** Which device wrote the most recent stroke, or none yet. */
	protected readonly device = signal<'keyboard' | 'pointer' | null>(null);

	/**
	 * The payload is the only signal of intent available: the committed stroke carries no trace
	 * of how it was written.
	 */
	protected onDrawStart(event: HubSignatureDrawEvent): void {
		this.device.set(event instanceof KeyboardEvent ? 'keyboard' : 'pointer');
	}

	protected statusText(): string {
		switch (this.device()) {
			case 'keyboard':
				return this.i18n.translate('DOCS.SIGNATURE.EXAMPLE.KEYBOARD.BY_KEYBOARD');
			case 'pointer':
				return this.i18n.translate('DOCS.SIGNATURE.EXAMPLE.KEYBOARD.BY_POINTER');
			default:
				return this.i18n.translate('DOCS.SIGNATURE.EXAMPLE.KEYBOARD.UNSIGNED');
		}
	}

	static readonly templateCode = `<hub-signature
  label="Signature"
  formText="Tab into the box, then use the arrow keys and Space."
  (drawStart)="onDrawStart($event)"
/>

<hub-badge shape="rounded">{{ statusText() }}</hub-badge>`;

	static readonly componentCode = `import { Component, signal } from '@angular/core';
import { HubSignatureComponent, type HubSignatureDrawEvent } from 'ng-hub-ui-signature';

export class KeyboardSigningComponent {
  readonly device = signal<'keyboard' | 'pointer' | null>(null);

  // A keyboard stroke and a drawn one are identical once committed, so the
  // event payload is the only place the difference survives. That is why
  // (drawStart) and (drawEnd) carry PointerEvent | KeyboardEvent.
  onDrawStart(event: HubSignatureDrawEvent) {
    this.device.set(event instanceof KeyboardEvent ? 'keyboard' : 'pointer');
  }

  statusText() {
    return this.device() ? \`Signed with the \${this.device()}\` : 'Not signed yet';
  }
}`;
}
