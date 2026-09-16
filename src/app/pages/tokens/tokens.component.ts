import { afterNextRender, ChangeDetectionStrategy, Component, computed, inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser, NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from 'ng-hub-ui-utils';
import { COMPONENT_TOKEN_GROUPS, REF_TOKENS, SYS_TOKENS, TOKEN_LIBRARIES, TokenEntry, TokenGroup } from './tokens.data';

/**
 * Documentation page that lists every design token of the ng-hub-ui general
 * library, organised by the three-layer system: reference (`--hub-ref-*`),
 * system (`--hub-sys-*`) and component/general scoped tokens.
 *
 * Features:
 *   - A live, case-insensitive search box that filters all token groups by name.
 *   - A color swatch rendered only when a token resolves to a color value.
 *   - Click-to-copy on every token name (SSR-guarded clipboard access).
 *   - Runtime-resolved values read with `getComputedStyle`, computed lazily in
 *     `afterNextRender` so the page stays safe during server-side rendering.
 */
@Component({
	selector: 'app-tokens',
	standalone: true,
	imports: [TranslatePipe, NgTemplateOutlet, RouterLink],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="library-page tokens-page">
			<header class="library-page__header">
				<div class="library-page__header-content">
					<h1 class="library-page__title">{{ 'UI.TOKENS.TITLE' | translate }}</h1>
					<p class="library-page__description">{{ 'UI.TOKENS.INTRO' | translate }}</p>
				</div>
			</header>

			<div class="library-page__content">
				<div class="library-page__section">
					<div class="tokens-page__search">
						<input
							type="search"
							class="tokens-page__search-input"
							[value]="query()"
							(input)="onSearch($event)"
							[attr.placeholder]="'UI.TOKENS.SEARCH_PLACEHOLDER' | translate"
							[attr.aria-label]="'UI.TOKENS.SEARCH_PLACEHOLDER' | translate"
						/>
					</div>

					<!-- Libraries with component tokens -->
					<section class="library-page__section-group tokens-page__libs-section">
						<h2 class="library-page__section-subtitle">{{ 'UI.TOKENS.LIBRARIES_TITLE' | translate }}</h2>
						<p class="tokens-page__libs-intro">{{ 'UI.TOKENS.LIBRARIES_INTRO' | translate }}</p>
						<div class="tokens-page__libs">
							@for (lib of tokenLibraries; track lib.name) {
								<a class="tokens-page__lib" [routerLink]="lib.route">
									<span class="tokens-page__lib-head">
										<span class="tokens-page__lib-name">ng-hub-ui-{{ lib.name }}</span>
										<span class="tokens-page__lib-count"
											>{{ lib.count }} {{ 'UI.TOKENS.LIBRARIES_TOKENS' | translate }}</span
										>
									</span>
									<span class="tokens-page__lib-prefixes">
										@for (p of lib.prefixes; track p) {
											<code>--hub-{{ p }}-*</code>
										}
									</span>
								</a>
							}
						</div>
					</section>

					<!-- Reference layer -->
					@if (filteredRef().length > 0) {
						<section class="library-page__section-group">
							<h2 class="library-page__section-subtitle">{{ 'UI.TOKENS.REF_TITLE' | translate }}</h2>
							<ng-container
								[ngTemplateOutlet]="tokenTable"
								[ngTemplateOutletContext]="{ tokens: filteredRef() }"
							></ng-container>
						</section>
					}

					<!-- System layer -->
					@if (filteredSys().length > 0) {
						<section class="library-page__section-group">
							<h2 class="library-page__section-subtitle">{{ 'UI.TOKENS.SYS_TITLE' | translate }}</h2>
							<ng-container
								[ngTemplateOutlet]="tokenTable"
								[ngTemplateOutletContext]="{ tokens: filteredSys() }"
							></ng-container>
						</section>
					}

					<!-- Component / general scoped tokens -->
					@if (filteredComponent().length > 0) {
						<section class="library-page__section-group">
							<h2 class="library-page__section-subtitle">{{ 'UI.TOKENS.COMPONENT_TITLE' | translate }}</h2>
							@for (group of filteredComponent(); track group.title) {
								<div class="library-page__api-group">
									<h3 class="library-page__api-group-title">{{ group.title }}</h3>
									<ng-container
										[ngTemplateOutlet]="tokenTable"
										[ngTemplateOutletContext]="{ tokens: group.tokens }"
									></ng-container>
								</div>
							}
						</section>
					}

					@if (filteredRef().length === 0 && filteredSys().length === 0 && filteredComponent().length === 0) {
						<p class="library-page__api-empty">{{ 'UI.TOKENS.NO_RESULTS' | translate }}</p>
					}
				</div>
			</div>
		</div>

		<!-- Reusable token table -->
		<ng-template #tokenTable let-tokens="tokens">
			<div class="library-page__table-wrap">
				<table class="library-page__api-table tokens-page__table">
					<thead>
						<tr>
							<th class="tokens-page__col-swatch" scope="col">{{ 'UI.TOKENS.COL_SWATCH' | translate }}</th>
							<th scope="col">{{ 'UI.TOKENS.COL_TOKEN' | translate }}</th>
							<th scope="col">{{ 'UI.TOKENS.COL_VALUE' | translate }}</th>
							<th scope="col">{{ 'UI.TOKENS.COL_RESOLVED' | translate }}</th>
						</tr>
					</thead>
					<tbody>
						@for (token of tokens; track token.name) {
							<tr>
								<td class="tokens-page__col-swatch">
									@if (isColor(token)) {
										<span
											class="tokens-page__swatch"
											[style.background]="resolved(token.name) || token.value"
											aria-hidden="true"
										></span>
									}
								</td>
								<td class="library-page__api-cell-name">
									<code
										class="tokens-page__token-name"
										role="button"
										tabindex="0"
										[attr.title]="'UI.TOKENS.COPY_HINT' | translate"
										(click)="copy(token.name)"
										(keydown.enter)="copy(token.name)"
										(keydown.space)="copy(token.name)"
										>{{ token.name }}</code
									>
								</td>
								<td>
									<code class="library-page__api-inline-code">{{ token.value }}</code>
								</td>
								<td>
									<code class="library-page__api-inline-code">{{ resolved(token.name) || '—' }}</code>
								</td>
							</tr>
						}
					</tbody>
				</table>
			</div>
		</ng-template>
	`,
	styles: [
		`
			.tokens-page__search {
				margin-bottom: 2rem;
			}

			.tokens-page__search-input {
				width: 100%;
				max-width: 28rem;
				padding: 0.7rem 1rem;
				font-size: 0.95rem;
				color: var(--hub-sys-text-primary);
				background-color: var(--hub-sys-surface-page);
				border: 1px solid var(--hub-sys-border-color-default);
				border-radius: var(--hub-ref-radius-pill);
				transition:
					border-color 0.2s ease,
					box-shadow 0.2s ease;
			}

			.tokens-page__search-input:focus {
				outline: none;
				border-color: color-mix(in srgb, var(--hub-sys-gradient-1) 50%, var(--hub-sys-border-color-default));
				box-shadow: 0 0 0 var(--hub-sys-focus-ring-width) var(--hub-sys-focus-ring-color);
			}

			.tokens-page__col-swatch {
				width: 3.5rem;
				text-align: center;
			}

			.tokens-page__swatch {
				display: inline-block;
				width: 1.5rem;
				height: 1.5rem;
				border-radius: var(--hub-ref-radius-sm);
				border: 1px solid var(--hub-sys-border-color-default);
				box-shadow: var(--hub-sys-shadow-inset);
				vertical-align: middle;
			}

			.tokens-page__token-name {
				cursor: pointer;
			}

			.tokens-page__token-name:hover {
				color: var(--hub-sys-gradient-1);
			}

			.tokens-page__token-name:focus-visible {
				outline: none;
				box-shadow: 0 0 0 2px var(--hub-sys-focus-ring-color);
				border-radius: 4px;
			}

			.tokens-page__libs-section {
				margin-bottom: 2.5rem;
			}

			.tokens-page__libs-intro {
				margin: 0 0 1rem;
				color: var(--hub-sys-text-muted);
			}

			.tokens-page__libs {
				display: grid;
				grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
				gap: var(--hub-sys-gap-3);
			}

			.tokens-page__lib {
				display: flex;
				flex-direction: column;
				gap: var(--hub-sys-gap-2);
				padding: var(--hub-ref-space-3);
				text-decoration: none;
				color: var(--hub-sys-text-primary);
				background: var(--hub-sys-surface-page);
				border: 1px solid var(--hub-sys-border-color-default);
				border-radius: var(--hub-ref-radius-lg);
				transition:
					border-color 0.2s ease,
					box-shadow 0.2s ease,
					transform 0.2s ease;
			}

			.tokens-page__lib:hover {
				border-color: var(--hub-sys-color-primary-border-subtle);
				box-shadow: var(--hub-sys-shadow-sm);
				transform: translateY(-2px);
			}

			.tokens-page__lib:focus-visible {
				outline: none;
				box-shadow: 0 0 0 var(--hub-sys-focus-ring-width) var(--hub-sys-focus-ring-color);
			}

			.tokens-page__lib-head {
				display: flex;
				align-items: baseline;
				justify-content: space-between;
				gap: var(--hub-sys-gap-2);
			}

			.tokens-page__lib-name {
				font-weight: var(--hub-ref-font-weight-semibold);
			}

			.tokens-page__lib-count {
				flex: none;
				font-size: var(--hub-ref-font-size-sm);
				color: var(--hub-sys-color-primary-emphasis);
			}

			.tokens-page__lib-prefixes {
				display: flex;
				flex-wrap: wrap;
				gap: var(--hub-sys-gap-1);
			}

			.tokens-page__lib-prefixes code {
				font-size: var(--hub-ref-font-size-xs);
				padding: 0.1rem 0.4rem;
				color: var(--hub-sys-text-muted);
				background: var(--hub-sys-surface-elevated);
				border-radius: var(--hub-ref-radius-sm);
			}
		`
	]
})
export class TokensComponent {
	/** Reference layer tokens. */
	protected readonly refTokens = REF_TOKENS;
	/** System layer tokens. */
	protected readonly sysTokens = SYS_TOKENS;
	/** Component/general scoped token groups. */
	protected readonly componentGroups = COMPONENT_TOKEN_GROUPS;
	/** Libraries that declare component tokens, linked to their docs pages. */
	protected readonly tokenLibraries = TOKEN_LIBRARIES;

	/** Current case-insensitive search query, lower-cased on write. */
	protected readonly query = signal('');

	/** Runtime-resolved values keyed by token name (populated in the browser). */
	private readonly resolvedValues = signal<Map<string, string>>(new Map());

	/** Whether the code is running in a browser (vs. server-side rendering). */
	private readonly isBrowser: boolean;

	/** Reference tokens matching the current query. */
	protected readonly filteredRef = computed(() => this.filterTokens(this.refTokens));

	/** System tokens matching the current query. */
	protected readonly filteredSys = computed(() => this.filterTokens(this.sysTokens));

	/** Component groups matching the current query (empty groups are dropped). */
	protected readonly filteredComponent = computed<TokenGroup[]>(() =>
		this.componentGroups
			.map((group) => ({ title: group.title, tokens: this.filterTokens(group.tokens) }))
			.filter((group) => group.tokens.length > 0)
	);

	/**
	 * Creates the tokens page and schedules runtime value resolution.
	 */
	constructor() {
		this.isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
		afterNextRender(() => this.resolveAllValues());
	}

	/**
	 * Updates the search query from the input event.
	 *
	 * @param event The native input event from the search box.
	 */
	protected onSearch(event: Event): void {
		const value = (event.target as HTMLInputElement).value ?? '';
		this.query.set(value.trim().toLowerCase());
	}

	/**
	 * Returns the runtime-resolved/computed value for a token name, or an empty
	 * string when it has not been resolved (e.g. during SSR).
	 *
	 * @param name The custom-property name to look up.
	 * @returns The resolved value or an empty string.
	 */
	protected resolved(name: string): string {
		return this.resolvedValues().get(name) ?? '';
	}

	/**
	 * Determines whether a token's value should render a color swatch. Uses a
	 * pragmatic check on the raw value and, when available, the resolved value.
	 *
	 * @param token The token to inspect.
	 * @returns `true` when the token represents a color.
	 */
	protected isColor(token: TokenEntry): boolean {
		return this.looksLikeColor(token.value) || this.looksLikeColor(this.resolved(token.name));
	}

	/**
	 * Copies a token name to the clipboard, guarded for SSR and unsupported
	 * environments.
	 *
	 * @param name The token name to copy.
	 */
	protected copy(name: string): void {
		if (!this.isBrowser || typeof navigator === 'undefined' || !navigator.clipboard) {
			return;
		}
		void navigator.clipboard.writeText(name);
	}

	/**
	 * Filters a token list by the current query, matching case-insensitively on
	 * the token name.
	 *
	 * @param tokens The tokens to filter.
	 * @returns The matching tokens.
	 */
	private filterTokens(tokens: TokenEntry[]): TokenEntry[] {
		const q = this.query();
		if (q.length === 0) {
			return tokens;
		}
		return tokens.filter((token) => token.name.toLowerCase().includes(q));
	}

	/**
	 * Reads the computed value of every token from the document root and stores
	 * the results in the resolved-values map. No-op outside the browser.
	 */
	private resolveAllValues(): void {
		if (!this.isBrowser || typeof document === 'undefined') {
			return;
		}
		const root = document.documentElement;
		const styles = getComputedStyle(root);
		const next = new Map<string, string>();
		const allTokens: TokenEntry[] = [
			...this.refTokens,
			...this.sysTokens,
			...this.componentGroups.flatMap((group) => group.tokens)
		];
		for (const token of allTokens) {
			const value = styles.getPropertyValue(token.name).trim();
			if (value.length > 0) {
				next.set(token.name, value);
			}
		}
		this.resolvedValues.set(next);
	}

	/**
	 * Pragmatically detects whether a value string represents a CSS color.
	 *
	 * @param value The value to test.
	 * @returns `true` when the value looks like a color.
	 */
	private looksLikeColor(value: string): boolean {
		if (!value) {
			return false;
		}
		const v = value.trim().toLowerCase();
		// Gradients and var() references are not flat color swatches.
		if (v.includes('gradient') || v.startsWith('var(')) {
			return false;
		}
		if (v.startsWith('#') || v.startsWith('rgb') || v.startsWith('hsl') || v.startsWith('color-mix')) {
			return true;
		}
		return TokensComponent.NAMED_COLORS.has(v);
	}

	/** Small set of CSS named colors used by the token catalogue. */
	private static readonly NAMED_COLORS = new Set<string>([
		'white',
		'black',
		'transparent',
		'currentcolor',
		'red',
		'green',
		'blue',
		'yellow',
		'cyan',
		'magenta',
		'gray',
		'grey'
	]);
}
