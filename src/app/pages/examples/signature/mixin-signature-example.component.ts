import { ChangeDetectionStrategy, Component, inject, ViewEncapsulation } from '@angular/core';
import { HubSignatureComponent } from 'ng-hub-ui-signature';
import { AppI18nService } from '../../../services/app-i18n.service';

/**
 * Live demo for the `hub-signature-theme` SCSS mixin, setting the same `--hub-signature-*` custom
 * properties it emits so the rendered field matches the SCSS shown beside it.
 *
 * The overrides target `.hub-signature` itself, not the wrapper, and that is not a stylistic
 * choice: the component declares every slot on the field element through `:where(.hub-signature)`,
 * and a custom property declared on an element always beats one inherited from an ancestor
 * whatever the specificity. Setting these on `.signature-mixin-scope` alone renders nothing — the
 * mixin avoids the trap by emitting `<your scope> :where(.hub-signature)`.
 *
 * `ViewEncapsulation.None` for the same reason. Emulated encapsulation would rewrite these rules
 * with this component's `_ngcontent` attribute, which the field's own DOM does not carry, so they
 * would never match. The mixin is included from a global stylesheet in real use; the demo has to
 * behave the same way to show anything true.
 *
 * It passes tokens from both halves of the mixin's signature — the original five and the six added
 * in 22.3.0 — because a reader has no other way to see what the latter do.
 */
@Component({
	selector: 'app-signature-mixin-example',
	standalone: true,
	imports: [HubSignatureComponent],
	changeDetection: ChangeDetectionStrategy.Default,
	encapsulation: ViewEncapsulation.None,
	template: `
		<style>
			.signature-mixin-scope .hub-signature {
				--hub-signature-bg: #0f172a;
				--hub-signature-color: rgba(255, 255, 255, 0.92);
				--hub-signature-border-color: rgba(255, 255, 255, 0.24);
				--hub-signature-border-radius: 0.75rem;
				--hub-signature-border-width: 2px;
				--hub-signature-focus-border-color: #7dd3fc;
				--hub-signature-focus-shadow: 0 0 0 0.25rem rgb(125 211 252 / 35%);
				--hub-signature-label-color: rgba(255, 255, 255, 0.72);
				--hub-signature-label-font-size: 0.8125rem;
				--hub-signature-font-size: 0.9375rem;
				--hub-signature-actions-gap: 0.75rem;
			}

			.signature-mixin-scope {
				display: block;
				padding: 1rem;
				background: #0b1220;
				border-radius: 1rem;
			}
		</style>
		<div class="signature-mixin-scope">
			<hub-signature
				[label]="i18n.translate('DOCS.SIGNATURE.EXAMPLE.THEMING.LABEL')"
				[formText]="i18n.translate('DOCS.SIGNATURE.EXAMPLE.THEMING.HELP')"
			/>
		</div>
	`,
	styles: []
})
export class MixinSignatureExampleComponent {
	/** Translation facade used to keep the interactive documentation locale-aware. */
	protected readonly i18n = inject(AppI18nService);
}
