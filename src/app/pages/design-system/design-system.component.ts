import { ChangeDetectionStrategy, Component, computed, inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HubPanelComponent } from 'ng-hub-ui-panels';
import { TranslatePipe } from 'ng-hub-ui-utils';
import { AppI18nService } from '../../services/app-i18n.service';
import { DS_FAMILY_LIBRARIES } from './design-system-family';

/**
 * Documentation page for the `ng-hub-ui-ds` package — the shared
 * design-token foundation of the family.
 *
 * It is a narrative/guide page (distinct from the tabular token reference at
 * `/tokens`): it explains what the package is, why it exists, how to consume and
 * modify it, the SCSS generation mechanism, and shows live, theme-reactive demos
 * (a semantic-colour swatch grid driven by a scoped theme switcher, and a live
 * custom-accent playground).
 *
 * Prose that carries inline markup is bound through `innerHTML` rather than split
 * into a key per fragment: word order moves between languages, and a sentence cut
 * around its own `<code>` tags cannot be translated, only reassembled wrongly.
 * Code samples stay untranslated — they are code, and their comments are English
 * like the rest of the repository.
 */
@Component({
	selector: 'app-design-system',
	standalone: true,
	imports: [RouterLink, HubPanelComponent, TranslatePipe],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="library-page ds-page">
			<header class="library-page__header">
				<div class="library-page__header-content">
					<h1 class="library-page__title">ng-hub-ui-ds</h1>
					<p class="library-page__description" [innerHTML]="'DOCS.DESIGN_SYSTEM.LEAD' | translate"></p>
				</div>
			</header>

			<div class="library-page__content">
				<!-- What is it? -->
				<section class="library-page__section" id="que-es">
					<h2 class="library-page__section-title">{{ 'DOCS.DESIGN_SYSTEM.WHAT.TITLE' | translate }}</h2>
					<p [innerHTML]="'DOCS.DESIGN_SYSTEM.WHAT.BODY' | translate"></p>
					<ul class="ds-list">
						<li [innerHTML]="'DOCS.DESIGN_SYSTEM.WHAT.LIST_1' | translate"></li>
						<li [innerHTML]="'DOCS.DESIGN_SYSTEM.WHAT.LIST_2' | translate"></li>
						<li [innerHTML]="'DOCS.DESIGN_SYSTEM.WHAT.LIST_3' | translate"></li>
						<li [innerHTML]="'DOCS.DESIGN_SYSTEM.WHAT.LIST_4' | translate"></li>
					</ul>
					<p class="ds-muted" [innerHTML]="'DOCS.DESIGN_SYSTEM.WHAT.NOTE' | translate: tokensParam()"></p>
				</section>

				<!-- Getting started -->
				<section class="library-page__section" id="instalacion">
					<h2 class="library-page__section-title">{{ 'DOCS.DESIGN_SYSTEM.START.TITLE' | translate }}</h2>
					<p [innerHTML]="'DOCS.DESIGN_SYSTEM.START.BODY' | translate"></p>

					<h3 class="ds-h3">{{ 'DOCS.DESIGN_SYSTEM.START.STEP1_TITLE' | translate }}</h3>
					<p class="ds-muted" [innerHTML]="'DOCS.DESIGN_SYSTEM.START.STEP1_NOTE' | translate"></p>
					<pre class="ds-code"><code>npm install ng-hub-ui-ds
npm install ng-hub-ui-panels ng-hub-ui-forms …   # the ones you use</code></pre>

					<h3 class="ds-h3">{{ 'DOCS.DESIGN_SYSTEM.START.STEP2_TITLE' | translate }}</h3>
					<pre class="ds-code"><code>{{ codeGettingStarted }}</code></pre>
					<p class="ds-muted" [innerHTML]="'DOCS.DESIGN_SYSTEM.START.STEP2_NOTE' | translate: cssImportParam"></p>
					<pre class="ds-code"><code>{{ codeImportAngular }}</code></pre>

					<h3 class="ds-h3">{{ 'DOCS.DESIGN_SYSTEM.START.STEP3_TITLE' | translate }}</h3>
					<div class="library-page__table-wrap">
						<table class="library-page__api-table">
							<thead>
								<tr>
									<th scope="col">{{ 'DOCS.DESIGN_SYSTEM.START.TABLE_WANT' | translate }}</th>
									<th scope="col">{{ 'DOCS.DESIGN_SYSTEM.START.TABLE_MECHANISM' | translate }}</th>
									<th scope="col">{{ 'DOCS.DESIGN_SYSTEM.START.TABLE_WHERE' | translate }}</th>
								</tr>
							</thead>
							<tbody>
								@for (row of mechanismRows; track row.want) {
									<tr>
										<td>{{ row.want | translate }}</td>
										<td [innerHTML]="row.how | translate"></td>
										<td [innerHTML]="row.where | translate: tokensParam()"></td>
									</tr>
								}
							</tbody>
						</table>
					</div>

					<h3 class="ds-h3">{{ 'DOCS.DESIGN_SYSTEM.START.STEP4_TITLE' | translate }}</h3>
					<p [innerHTML]="'DOCS.DESIGN_SYSTEM.START.STEP4_BODY' | translate"></p>
				</section>

				<!-- The two layers -->
				<section class="library-page__section" id="arquitectura">
					<h2 class="library-page__section-title">{{ 'DOCS.DESIGN_SYSTEM.ARCH.TITLE' | translate }}</h2>
					<div class="ds-layers">
						<div class="ds-layer">
							<span class="ds-layer__tag">ref</span>
							<h4><code>--hub-ref-*</code></h4>
							<p>{{ 'DOCS.DESIGN_SYSTEM.ARCH.REF' | translate }}</p>
							<code class="ds-inline">--hub-ref-color-blue-500</code>
						</div>
						<div class="ds-layer__arrow" aria-hidden="true">→</div>
						<div class="ds-layer">
							<span class="ds-layer__tag ds-layer__tag--sys">sys</span>
							<h4><code>--hub-sys-*</code></h4>
							<p>{{ 'DOCS.DESIGN_SYSTEM.ARCH.SYS' | translate }}</p>
							<code class="ds-inline">--hub-sys-color-primary</code>
						</div>
					</div>
					<p class="ds-muted" [innerHTML]="'DOCS.DESIGN_SYSTEM.ARCH.RULE' | translate"></p>
				</section>

				<!-- Semantic colours + themes (live demo) -->
				<section class="library-page__section" id="colores">
					<h2 class="library-page__section-title">{{ 'DOCS.DESIGN_SYSTEM.COLORS.TITLE' | translate }}</h2>
					<p [innerHTML]="'DOCS.DESIGN_SYSTEM.COLORS.BODY' | translate"></p>

					<div class="ds-themes">
						@for (theme of themes; track theme) {
							<button
								type="button"
								class="ds-theme-btn"
								[class.ds-theme-btn--active]="previewTheme() === theme"
								(click)="previewTheme.set(theme)"
							>
								{{ theme }}
							</button>
						}
					</div>

					<div class="ds-preview" [attr.data-theme]="previewTheme()">
						@for (variant of variants; track variant) {
							<div class="ds-family">
								<div class="ds-family__name">{{ variant }}</div>
								<div class="ds-family__roles">
									@for (role of roles; track role.suffix) {
										<div class="ds-swatch" [title]="'--hub-sys-color-' + variant + role.suffix">
											<span
												class="ds-swatch__chip"
												[style.background]="'var(--hub-sys-color-' + variant + role.suffix + ')'"
											></span>
											<span class="ds-swatch__label">{{ role.label }}</span>
										</div>
									}
								</div>
							</div>
						}

						<!-- A couple of sample alerts, themed live -->
						<div class="ds-samples">
							@for (variant of variants; track variant) {
								<div
									class="ds-sample"
									[style.background]="'var(--hub-sys-color-' + variant + '-subtle)'"
									[style.color]="'var(--hub-sys-color-' + variant + '-emphasis)'"
									[style.border-color]="'var(--hub-sys-color-' + variant + '-border-subtle)'"
									[style.border-inline-start-color]="'var(--hub-sys-color-' + variant + ')'"
								>
									{{ 'DOCS.DESIGN_SYSTEM.COLORS.ALERT' | translate }} <strong>{{ variant }}</strong>
								</div>
							}
						</div>
					</div>
				</section>

				<!-- Theme builder: change only the base colours -->
				<section class="library-page__section" id="crea-tu-tema">
					<h2 class="library-page__section-title">{{ 'DOCS.DESIGN_SYSTEM.BUILDER.TITLE' | translate }}</h2>
					<p [innerHTML]="'DOCS.DESIGN_SYSTEM.BUILDER.BODY' | translate"></p>

					<div class="ds-builder__controls">
						@for (v of variants; track v) {
							<label class="ds-builder__control">
								<input type="color" [value]="bases()[v]" (input)="onBase(v, $event)" [attr.aria-label]="v" />
								<span class="ds-builder__control-name">{{ v }}</span>
								<code>{{ bases()[v] }}</code>
							</label>
						}
						<button type="button" class="ds-builder__reset" (click)="resetBases()">
							{{ 'DOCS.DESIGN_SYSTEM.BUILDER.RESET' | translate }}
						</button>
					</div>

					<div
						class="ds-preview ds-builder-preview"
						[style.--hub-sys-color-primary]="bases()['primary']"
						[style.--hub-sys-color-secondary]="bases()['secondary']"
						[style.--hub-sys-color-success]="bases()['success']"
						[style.--hub-sys-color-danger]="bases()['danger']"
						[style.--hub-sys-color-warning]="bases()['warning']"
						[style.--hub-sys-color-info]="bases()['info']"
						[style.--hub-sys-color-neutral]="bases()['neutral']"
						[style.--hub-sys-color-light]="bases()['light']"
						[style.--hub-sys-color-dark]="bases()['dark']"
					>
						@for (variant of variants; track variant) {
							<div class="ds-family">
								<div class="ds-family__name">
									{{ variant }}
									<span class="ds-family__hint">{{ 'DOCS.DESIGN_SYSTEM.BUILDER.HINT' | translate }}</span>
								</div>
								<div class="ds-family__roles">
									@for (role of roles; track role.suffix) {
										<div class="ds-swatch" [title]="'--hub-sys-color-' + variant + role.suffix">
											<span
												class="ds-swatch__chip"
												[style.background]="'var(--hub-sys-color-' + variant + role.suffix + ')'"
											></span>
											<span class="ds-swatch__label">{{ role.label }}</span>
										</div>
									}
								</div>
							</div>
						}

						<div class="ds-showcase">
							<h4 class="ds-showcase__title">{{ 'DOCS.DESIGN_SYSTEM.BUILDER.SHOWCASE' | translate }}</h4>
							<div class="ds-showcase__row">
								@for (variant of variants; track variant) {
									<hub-panel appearance="alert" [variant]="variant"
										>{{ 'DOCS.DESIGN_SYSTEM.COLORS.ALERT' | translate }} {{ variant }}</hub-panel
									>
								}
							</div>
							<div class="ds-showcase__row ds-showcase__row--inline">
								@for (variant of variants; track variant) {
									<button type="button" class="ds-btn" [attr.data-variant]="variant">{{ variant }}</button>
								}
							</div>
							<div class="ds-showcase__row ds-showcase__row--inline">
								@for (variant of variants; track variant) {
									<span class="ds-badge" [attr.data-variant]="variant">{{ variant }}</span>
								}
							</div>
						</div>
					</div>

					<pre class="ds-code"><code>{{ codeDerive }}</code></pre>
				</section>

				<!-- Family gallery: integration status -->
				<section class="library-page__section" id="familia">
					<h2 class="library-page__section-title">{{ 'DOCS.DESIGN_SYSTEM.FAMILY.TITLE' | translate }}</h2>
					<p [innerHTML]="'DOCS.DESIGN_SYSTEM.FAMILY.BODY' | translate"></p>
					<div class="ds-gallery">
						@for (lib of libraries; track lib.name) {
							<a class="ds-gallery__card" [routerLink]="['..', lib.name]">
								<span class="ds-gallery__name">{{ lib.name }}</span>
								<span
									class="ds-gallery__badge"
									[class.ds-gallery__badge--wired]="lib.wired"
									[class.ds-gallery__badge--pending]="!lib.wired"
									>{{
										(lib.wired ? 'DOCS.DESIGN_SYSTEM.FAMILY.WIRED' : 'DOCS.DESIGN_SYSTEM.FAMILY.PENDING')
											| translate
									}}</span
								>
							</a>
						}
					</div>
				</section>

				<!-- How to modify it -->
				<section class="library-page__section" id="modificar">
					<h2 class="library-page__section-title">{{ 'DOCS.DESIGN_SYSTEM.MODIFY.TITLE' | translate }}</h2>

					<h3 class="ds-h3">{{ 'DOCS.DESIGN_SYSTEM.MODIFY.OVERRIDE_TITLE' | translate }}</h3>
					<p>{{ 'DOCS.DESIGN_SYSTEM.MODIFY.OVERRIDE_BODY' | translate }}</p>
					<pre class="ds-code"><code>{{ codeOverride }}</code></pre>

					<h3 class="ds-h3">{{ 'DOCS.DESIGN_SYSTEM.MODIFY.ACCENT_TITLE' | translate }}</h3>
					<p [innerHTML]="'DOCS.DESIGN_SYSTEM.MODIFY.ACCENT_BODY' | translate"></p>

					<div class="ds-accent-demo">
						<label class="ds-accent-demo__control">
							<span>{{ 'DOCS.DESIGN_SYSTEM.MODIFY.ACCENT_LABEL' | translate }}</span>
							<input
								type="color"
								[value]="brandColor()"
								(input)="onBrand($event)"
								[attr.aria-label]="'DOCS.DESIGN_SYSTEM.MODIFY.ACCENT_LABEL' | translate"
							/>
							<code>{{ brandColor() }}</code>
						</label>
						<div class="ds-accent-demo__preview" [style.--hub-sys-color-brand]="brandColor()">
							<div
								class="ds-sample ds-sample--accent"
								[innerHTML]="'DOCS.DESIGN_SYSTEM.MODIFY.ACCENT_SAMPLE' | translate"
							></div>
						</div>
					</div>

					<pre class="ds-code"><code>{{ codeAccent }}</code></pre>
					<p class="ds-muted" [innerHTML]="'DOCS.DESIGN_SYSTEM.MODIFY.ACCENT_NOTE' | translate"></p>

					<h3 class="ds-h3">{{ 'DOCS.DESIGN_SYSTEM.MODIFY.OPEN_MAP_TITLE' | translate }}</h3>
					<p [innerHTML]="'DOCS.DESIGN_SYSTEM.MODIFY.OPEN_MAP_BODY' | translate"></p>
					<pre class="ds-code"><code>{{ codeOpenMap }}</code></pre>

					<h3 class="ds-h3">{{ 'DOCS.DESIGN_SYSTEM.MODIFY.THEME_TITLE' | translate }}</h3>
					<pre class="ds-code"><code>{{ codeTheme }}</code></pre>

					<h3 class="ds-h3" [innerHTML]="'DOCS.DESIGN_SYSTEM.MODIFY.THEME_MIXIN_TITLE' | translate"></h3>
					<p [innerHTML]="'DOCS.DESIGN_SYSTEM.MODIFY.THEME_MIXIN_BODY' | translate"></p>
					<pre class="ds-code"><code>{{ codeThemeMixin }}</code></pre>
				</section>

				<!-- SCSS functions -->
				<section class="library-page__section" id="funciones">
					<h2 class="library-page__section-title">{{ 'DOCS.DESIGN_SYSTEM.FUNCTIONS.TITLE' | translate }}</h2>
					<p [innerHTML]="'DOCS.DESIGN_SYSTEM.FUNCTIONS.BODY' | translate"></p>
					<pre class="ds-code"><code>{{ codeMixin }}</code></pre>
					<p class="ds-muted" [innerHTML]="'DOCS.DESIGN_SYSTEM.FUNCTIONS.NOTE' | translate"></p>
				</section>

				<!-- Structural layer · live tokens -->
				<section class="library-page__section" id="estructura">
					<h2 class="library-page__section-title">{{ 'DOCS.DESIGN_SYSTEM.STRUCTURE.TITLE' | translate }}</h2>
					<p [innerHTML]="'DOCS.DESIGN_SYSTEM.STRUCTURE.BODY' | translate"></p>

					<h3 class="ds-h3" [innerHTML]="'DOCS.DESIGN_SYSTEM.STRUCTURE.SPACING_TITLE' | translate"></h3>
					<div class="ds-struct">
						@for (s of spaceSteps; track s) {
							<div class="ds-struct__row">
								<span class="ds-struct__label">space-{{ s }}</span>
								<span class="ds-struct__bar" [style.width]="'var(--hub-ref-space-' + s + ')'"></span>
							</div>
						}
					</div>

					<h3 class="ds-h3" [innerHTML]="'DOCS.DESIGN_SYSTEM.STRUCTURE.GAP_TITLE' | translate"></h3>
					<div class="ds-struct">
						@for (g of gapSteps; track g) {
							<div class="ds-struct__row">
								<span class="ds-struct__label">gap-{{ g }}</span>
								<div style="display:flex" [style.gap]="'var(--hub-sys-gap-' + g + ')'">
									<span class="ds-struct__box" style="width:2.5rem">A</span>
									<span class="ds-struct__box" style="width:2.5rem">B</span>
									<span class="ds-struct__box" style="width:2.5rem">C</span>
								</div>
							</div>
						}
					</div>

					<h3 class="ds-h3" [innerHTML]="'DOCS.DESIGN_SYSTEM.STRUCTURE.FRACTIONS_TITLE' | translate"></h3>
					<div class="ds-struct">
						@for (f of fractions; track f.cls) {
							<div class="ds-struct__row">
								<span class="ds-struct__label">size-{{ f.cls }}</span>
								<span class="ds-struct__box" [style.width]="'var(--hub-sys-size-' + f.cls + ')'">{{
									f.label
								}}</span>
							</div>
						}
					</div>

					<h3 class="ds-h3">{{ 'DOCS.DESIGN_SYSTEM.STRUCTURE.GRID_TITLE' | translate }}</h3>
					<div
						class="ds-struct__row"
						style="display:grid;grid-template-columns:repeat(auto-fit,minmax(7rem,1fr));gap:var(--hub-sys-gap-2)"
					>
						@for (n of [1, 2, 3, 4, 5, 6]; track n) {
							<span class="ds-struct__box">col {{ n }}</span>
						}
					</div>
					<div class="ds-struct" style="margin-top:1rem">
						@for (w of containerWidths; track w) {
							<div class="ds-struct__row">
								<span class="ds-struct__label">max-{{ w }}</span>
								<span
									class="ds-struct__bar"
									[style.width]="'min(100%, calc(var(--hub-sys-container-max-width-' + w + ') / 3))'"
								></span>
							</div>
						}
					</div>

					<pre class="ds-code"><code>{{ codeStructure }}</code></pre>
				</section>

				<!-- Mixins and styles -->
				<section class="library-page__section" id="mixins">
					<h2 class="library-page__section-title">{{ 'DOCS.DESIGN_SYSTEM.MIXINS.TITLE' | translate }}</h2>
					<p [innerHTML]="'DOCS.DESIGN_SYSTEM.MIXINS.BODY' | translate"></p>
					<p class="ds-muted" [innerHTML]="'DOCS.DESIGN_SYSTEM.MIXINS.NOTE' | translate"></p>

					<div class="ds-mixin-block">
						<h3 class="ds-h3" [innerHTML]="'DOCS.DESIGN_SYSTEM.MIXINS.CLUSTER_TITLE' | translate"></h3>
						<div class="cluster">
							@for (chip of clusterChips; track chip) {
								<span class="ds-chip">{{ chip | translate }}</span>
							}
						</div>
					</div>

					<div class="ds-mixin-block">
						<h3 class="ds-h3" [innerHTML]="'DOCS.DESIGN_SYSTEM.MIXINS.STACK_TITLE' | translate"></h3>
						<div class="stack" style="max-width:18rem">
							@for (n of [1, 2, 3]; track n) {
								<span class="ds-tile">{{ 'DOCS.DESIGN_SYSTEM.MIXINS.BLOCK' | translate }} {{ n }}</span>
							}
						</div>
					</div>

					<div class="ds-mixin-block">
						<h3 class="ds-h3" [innerHTML]="'DOCS.DESIGN_SYSTEM.MIXINS.GRID_TITLE' | translate"></h3>
						<div class="grid-auto">
							@for (n of [1, 2, 3, 4, 5, 6, 7, 8]; track n) {
								<span class="ds-tile">{{ n }}</span>
							}
						</div>
					</div>

					<div class="ds-mixin-block">
						<h3 class="ds-h3" [innerHTML]="'DOCS.DESIGN_SYSTEM.MIXINS.CENTER_TITLE' | translate"></h3>
						<div class="center ds-center-demo">
							<span class="ds-tile" style="background:transparent">{{
								'DOCS.DESIGN_SYSTEM.MIXINS.CENTER_DEMO' | translate
							}}</span>
						</div>
					</div>

					<pre class="ds-code"><code>{{ codeMixinsUse }}</code></pre>

					<h3 class="ds-h3">{{ 'DOCS.DESIGN_SYSTEM.MIXINS.CATALOG_TITLE' | translate }}</h3>
					<div class="library-page__table-wrap">
						<table class="library-page__api-table">
							<thead>
								<tr>
									<th scope="col">{{ 'DOCS.DESIGN_SYSTEM.MIXINS.TABLE_MIXIN' | translate }}</th>
									<th scope="col">{{ 'DOCS.DESIGN_SYSTEM.MIXINS.TABLE_PARAMS' | translate }}</th>
									<th scope="col">{{ 'DOCS.DESIGN_SYSTEM.MIXINS.TABLE_DESC' | translate }}</th>
								</tr>
							</thead>
							<tbody>
								@for (group of mixinCatalog; track group.group) {
									<tr>
										<td colspan="3" class="fw-semibold">{{ group.group | translate }}</td>
									</tr>
									@for (m of group.mixins; track m.name) {
										<tr>
											<td>
												<code>hub.{{ m.name }}()</code>
											</td>
											<td>
												<code class="library-page__api-inline-code">{{ m.params }}</code>
											</td>
											<td>{{ m.desc | translate }}</td>
										</tr>
									}
								}
							</tbody>
						</table>
					</div>
				</section>

				<!-- Utilities -->
				<section class="library-page__section" id="utilidades">
					<h2 class="library-page__section-title">{{ 'DOCS.DESIGN_SYSTEM.UTILITIES.TITLE' | translate }}</h2>
					<p [innerHTML]="'DOCS.DESIGN_SYSTEM.UTILITIES.BODY' | translate"></p>

					<div class="ds-util-demo">
						<h3 class="ds-h3"><code>.cluster .gap-2</code></h3>
						<div class="cluster gap-2">
							@for (word of countWords; track word) {
								<span>{{ word | translate }}</span>
							}
						</div>

						<h3 class="ds-h3"><code>.grid-auto .gap-2</code></h3>
						<div class="grid-auto gap-2">
							<span>A</span><span>B</span><span>C</span><span>D</span><span>E</span><span>F</span>
						</div>

						<h3 class="ds-h3" [innerHTML]="'DOCS.DESIGN_SYSTEM.UTILITIES.SIZING_TITLE' | translate"></h3>
						<div class="stack gap-2">
							<span class="w-50">w-50</span>
							<span class="w-25">w-25</span>
							<span class="w-auto">w-auto</span>
						</div>
					</div>

					<pre class="ds-code"><code>{{ codeUtilitiesUse }}</code></pre>
				</section>

				<!-- Flexbox -->
				<section class="library-page__section" id="flexbox">
					<h2 class="library-page__section-title">{{ 'DOCS.DESIGN_SYSTEM.FLEX.TITLE' | translate }}</h2>
					<p [innerHTML]="'DOCS.DESIGN_SYSTEM.FLEX.BODY' | translate"></p>

					<h3 class="ds-h3" [innerHTML]="'DOCS.DESIGN_SYSTEM.FLEX.JUSTIFY_TITLE' | translate"></h3>
					@for (j of justifyOptions; track j) {
						<span class="ds-flexrow__label">.justify-content-{{ j }}</span>
						<div class="ds-flexrow d-flex gap-2" [class]="'justify-content-' + j">
							<span class="ds-chip">A</span>
							<span class="ds-chip">B</span>
							<span class="ds-chip">C</span>
						</div>
					}

					<h3 class="ds-h3" [innerHTML]="'DOCS.DESIGN_SYSTEM.FLEX.ALIGN_TITLE' | translate"></h3>
					@for (a of alignOptions; track a) {
						<span class="ds-flexrow__label">.align-items-{{ a }}</span>
						<div class="ds-flexrow ds-flexrow--tall d-flex gap-2" [class]="'align-items-' + a">
							<span class="ds-chip ds-chip--sm">sm</span>
							<span class="ds-chip ds-chip--md">md</span>
							<span class="ds-chip ds-chip--lg">lg</span>
						</div>
					}

					<h3 class="ds-h3" [innerHTML]="'DOCS.DESIGN_SYSTEM.FLEX.DIRECTION_TITLE' | translate"></h3>
					<div class="ds-flexrow d-flex flex-column gap-2" style="max-width:14rem">
						@for (n of [1, 2, 3]; track n) {
							<span class="ds-chip">{{ 'DOCS.DESIGN_SYSTEM.FLEX.ROW' | translate }} {{ n }}</span>
						}
					</div>

					<h3 class="ds-h3" [innerHTML]="'DOCS.DESIGN_SYSTEM.FLEX.GROW_TITLE' | translate"></h3>
					<div class="ds-flexrow d-flex gap-2">
						<span class="ds-chip flex-fill">{{ 'DOCS.DESIGN_SYSTEM.FLEX.GROW_LABEL' | translate }}</span>
						<span class="ds-chip flex-grow-0">.flex-grow-0</span>
					</div>

					<h3 class="ds-h3" [innerHTML]="'DOCS.DESIGN_SYSTEM.FLEX.RESPONSIVE_TITLE' | translate"></h3>
					<p class="ds-muted" [innerHTML]="'DOCS.DESIGN_SYSTEM.FLEX.RESPONSIVE_NOTE' | translate"></p>
					<div class="ds-flexrow d-flex flex-column flex-md-row align-items-md-center gap-2">
						@for (word of countWords.slice(0, 3); track word) {
							<span class="ds-chip">{{ word | translate }}</span>
						}
					</div>

					<h3 class="ds-h3" [innerHTML]="'DOCS.DESIGN_SYSTEM.FLEX.DIVIDER_TITLE' | translate"></h3>
					<div class="ds-flexrow d-flex gap-3">
						<span class="ds-chip">{{ 'DOCS.DESIGN_SYSTEM.FLEX.LEFT' | translate }}</span>
						<span class="vr"></span>
						<span class="ds-chip">{{ 'DOCS.DESIGN_SYSTEM.FLEX.RIGHT' | translate }}</span>
					</div>

					<pre class="ds-code"><code>{{ codeFlexUse }}</code></pre>
				</section>

				<!-- Columns, widths and spacing -->
				<section class="library-page__section" id="columnas">
					<h2 class="library-page__section-title">{{ 'DOCS.DESIGN_SYSTEM.COLS.TITLE' | translate }}</h2>
					<p [innerHTML]="'DOCS.DESIGN_SYSTEM.COLS.BODY' | translate"></p>

					<h3 class="ds-h3" [innerHTML]="'DOCS.DESIGN_SYSTEM.COLS.COLUMNS_TITLE' | translate"></h3>
					@for (rowSpans of colRows; track $index) {
						<div class="row ds-cols">
							@for (span of rowSpans; track $index) {
								<div class="ds-cols__cell" [class]="'col-' + span">col-{{ span }}</div>
							}
						</div>
					}

					<h3 class="ds-h3" [innerHTML]="'DOCS.DESIGN_SYSTEM.COLS.OFFSETS_TITLE' | translate"></h3>
					<p class="ds-muted" [innerHTML]="'DOCS.DESIGN_SYSTEM.COLS.OFFSETS_NOTE' | translate"></p>
					<div class="row ds-cols">
						<div class="ds-cols__cell col-4 offset-4">col-4 offset-4</div>
					</div>
					<div class="row ds-cols">
						<div class="ds-cols__cell col-3 offset-9">col-3 offset-9</div>
					</div>

					<h3 class="ds-h3" [innerHTML]="'DOCS.DESIGN_SYSTEM.COLS.WIDTHS_TITLE' | translate"></h3>
					<div class="ds-struct">
						@for (w of widthPcts; track w) {
							<div class="ds-struct__row">
								<span class="ds-struct__label">w-{{ w }}</span>
								<span class="ds-wbar" [class]="'w-' + w">w-{{ w }}</span>
							</div>
						}
						<div class="ds-struct__row">
							<span class="ds-struct__label">w-auto</span>
							<span class="ds-wbar w-auto">w-auto</span>
						</div>
					</div>

					<h3 class="ds-h3" [innerHTML]="'DOCS.DESIGN_SYSTEM.COLS.PADDING_TITLE' | translate"></h3>
					<div class="ds-struct__row">
						@for (s of spacingSteps; track s) {
							<div class="ds-pbox" [class]="'p-' + s">
								<div class="ds-pbox__inner">p-{{ s }}</div>
							</div>
						}
					</div>

					<h3 class="ds-h3" [innerHTML]="'DOCS.DESIGN_SYSTEM.COLS.PADDING_AXIS_TITLE' | translate"></h3>
					<div class="ds-struct__row">
						<div class="ds-pbox px-4 py-1"><div class="ds-pbox__inner">px-4 · py-1</div></div>
						<div class="ds-pbox px-2 py-4"><div class="ds-pbox__inner">px-2 · py-4</div></div>
						<div class="ds-pbox px-5 py-3"><div class="ds-pbox__inner">px-5 · py-3</div></div>
					</div>

					<h3 class="ds-h3" [innerHTML]="'DOCS.DESIGN_SYSTEM.COLS.MARGIN_TITLE' | translate"></h3>
					<div class="ds-struct__row">
						@for (s of spacingSteps; track s) {
							<div class="ds-mframe">
								<div class="ds-mframe__child" [class]="'m-' + s">m-{{ s }}</div>
							</div>
						}
					</div>

					<h3 class="ds-h3" [innerHTML]="'DOCS.DESIGN_SYSTEM.COLS.MARGIN_AXIS_TITLE' | translate"></h3>
					<div class="ds-struct__row">
						<div class="ds-mframe"><div class="ds-mframe__child mx-4">mx-4</div></div>
						<div class="ds-mframe"><div class="ds-mframe__child my-3">my-3</div></div>
					</div>

					<h3 class="ds-h3" [innerHTML]="'DOCS.DESIGN_SYSTEM.COLS.RESPONSIVE_TITLE' | translate"></h3>
					<p class="ds-muted" [innerHTML]="'DOCS.DESIGN_SYSTEM.COLS.RESPONSIVE_NOTE' | translate"></p>
					<div class="row ds-cols">
						@for (n of [1, 2, 3, 4]; track n) {
							<div class="ds-cols__cell col-12 col-md-6 col-xl-3">col-12 · md-6 · xl-3</div>
						}
					</div>
					<pre class="ds-code"><code>{{ codeResponsiveUse }}</code></pre>

					<pre class="ds-code"><code>{{ codeColsUse }}</code></pre>
				</section>

				<!-- Text -->
				<section class="library-page__section" id="texto">
					<h2 class="library-page__section-title">{{ 'DOCS.DESIGN_SYSTEM.TEXT.TITLE' | translate }}</h2>
					<p [innerHTML]="'DOCS.DESIGN_SYSTEM.TEXT.BODY' | translate"></p>

					<h3 class="ds-h3" [innerHTML]="'DOCS.DESIGN_SYSTEM.TEXT.SIZE_TITLE' | translate"></h3>
					<div class="ds-struct">
						@for (level of fsLevels; track level) {
							<div class="ds-struct__row">
								<span class="ds-struct__label">.fs-{{ level }}</span>
								<span class="lh-1" [class]="'fs-' + level">{{
									'DOCS.DESIGN_SYSTEM.TEXT.SAMPLE_HEADING' | translate
								}}</span>
							</div>
						}
					</div>
					<p class="ds-muted" [innerHTML]="'DOCS.DESIGN_SYSTEM.TEXT.SIZE_NOTE' | translate"></p>
					<div class="ds-struct">
						@for (level of fsLevels; track level) {
							<div class="ds-struct__row">
								<span class="ds-struct__label">.h{{ level }}</span>
								<div [class]="'h' + level">{{ 'DOCS.DESIGN_SYSTEM.TEXT.SAMPLE_HEADING' | translate }}</div>
							</div>
						}
					</div>

					<h3 class="ds-h3" [innerHTML]="'DOCS.DESIGN_SYSTEM.TEXT.WEIGHT_TITLE' | translate"></h3>
					<div class="ds-struct">
						@for (w of fontWeights; track w) {
							<div class="ds-struct__row">
								<span class="ds-struct__label">.fw-{{ w }}</span>
								<span [class]="'fw-' + w">{{
									'DOCS.DESIGN_SYSTEM.TEXT.WEIGHT_SAMPLE' | translate: { weight: w }
								}}</span>
							</div>
						}
						<div class="ds-struct__row">
							<span class="ds-struct__label">.fst-italic</span>
							<span class="fst-italic">{{ 'DOCS.DESIGN_SYSTEM.TEXT.ITALIC' | translate }}</span>
						</div>
					</div>

					<h3 class="ds-h3" [innerHTML]="'DOCS.DESIGN_SYSTEM.TEXT.ALIGN_TITLE' | translate"></h3>
					<div class="stack gap-2">
						<div class="ds-textbox text-start">.text-start</div>
						<div class="ds-textbox text-center">.text-center</div>
						<div class="ds-textbox text-end">.text-end</div>
					</div>

					<h3 class="ds-h3">{{ 'DOCS.DESIGN_SYSTEM.TEXT.TRANSFORM_TITLE' | translate }}</h3>
					<div class="cluster gap-2">
						<span class="text-uppercase">.text-uppercase</span>
						<span class="text-capitalize">.text-capitalize</span>
						<span class="text-decoration-underline">.text-decoration-underline</span>
						<span class="text-decoration-line-through">.text-decoration-line-through</span>
						<span class="font-monospace">.font-monospace</span>
					</div>

					<h3 class="ds-h3" [innerHTML]="'DOCS.DESIGN_SYSTEM.TEXT.TABULAR_TITLE' | translate"></h3>
					<p class="ds-p">{{ 'DOCS.DESIGN_SYSTEM.TEXT.TABULAR_BODY' | translate }}</p>
					<div class="cluster gap-4">
						@for (col of tabularDemo; track col.label) {
							<div class="stack gap-1">
								<span class="ds-struct__label">{{ col.label | translate }}</span>
								@for (amount of tabularAmounts; track amount) {
									<div class="ds-textbox text-end" [class.font-tabular-nums]="col.tabular">{{ amount }}</div>
								}
							</div>
						}
					</div>

					<h3 class="ds-h3" [innerHTML]="'DOCS.DESIGN_SYSTEM.TEXT.TRUNCATE_TITLE' | translate"></h3>
					<div class="ds-textbox text-truncate" style="max-width:16rem">
						{{ 'DOCS.DESIGN_SYSTEM.TEXT.TRUNCATE_SAMPLE' | translate }}
					</div>

					<h3 class="ds-h3" [innerHTML]="'DOCS.DESIGN_SYSTEM.TEXT.LH_TITLE' | translate"></h3>
					<div class="ds-struct">
						@for (lh of lineHeights; track lh) {
							<div class="ds-struct__row">
								<span class="ds-struct__label">.lh-{{ lh }}</span>
								<span class="ds-textbox" style="max-width:22rem" [class]="'lh-' + lh">{{
									'DOCS.DESIGN_SYSTEM.TEXT.LH_SAMPLE' | translate
								}}</span>
							</div>
						}
					</div>

					<h3 class="ds-h3" [innerHTML]="'DOCS.DESIGN_SYSTEM.TEXT.COLORS_TITLE' | translate"></h3>
					<div class="cluster gap-2">
						@for (v of variants; track v) {
							<span class="fw-semibold" [class]="'text-' + v">{{ v }}</span>
						}
						<span class="fw-semibold text-body">body</span>
						<span class="fw-semibold text-muted">muted</span>
					</div>

					<h3 class="ds-h3" [innerHTML]="'DOCS.DESIGN_SYSTEM.TEXT.OPACITY_TITLE' | translate"></h3>
					<div class="cluster gap-3">
						@for (o of textOpacitySteps; track o) {
							<span class="fw-semibold text-primary" [class]="'text-opacity-' + o">{{ o }}</span>
						}
					</div>
					<div class="cluster gap-3 mt-2">
						<a href="#texto" class="link-primary">.link-primary</a>
						<a href="#texto" class="link-danger link-offset-2">.link-danger .link-offset-2</a>
						<a href="#texto" class="link-success link-underline-opacity-25"
							>.link-success .link-underline-opacity-25</a
						>
					</div>

					<pre class="ds-code"><code>{{ codeTextUse }}</code></pre>
				</section>

				<!-- Surfaces -->
				<section class="library-page__section" id="superficies">
					<h2 class="library-page__section-title">{{ 'DOCS.DESIGN_SYSTEM.SURFACES.TITLE' | translate }}</h2>
					<p [innerHTML]="'DOCS.DESIGN_SYSTEM.SURFACES.BODY' | translate"></p>

					<h3 class="ds-h3" [innerHTML]="'DOCS.DESIGN_SYSTEM.SURFACES.BACKGROUNDS_TITLE' | translate"></h3>
					<div class="cluster gap-2">
						@for (v of variants; track v) {
							<span class="ds-swatch" [class]="'bg-' + v" [title]="'.bg-' + v"></span>
						}
					</div>
					<div class="cluster gap-2 mt-2">
						@for (v of variants; track v) {
							<span class="ds-swatch" [class]="'bg-' + v + '-subtle'" [title]="'.bg-' + v + '-subtle'"></span>
						}
					</div>

					<h3 class="ds-h3" [innerHTML]="'DOCS.DESIGN_SYSTEM.SURFACES.TEXT_BG_TITLE' | translate"></h3>
					<div class="cluster gap-2">
						@for (v of variants; track v) {
							<span class="px-2 py-1 rounded" [class]="'text-bg-' + v">{{ v }}</span>
						}
					</div>

					<h3 class="ds-h3" [innerHTML]="'DOCS.DESIGN_SYSTEM.SURFACES.BORDERS_TITLE' | translate"></h3>
					<div class="cluster gap-2">
						<span class="ds-box border">border</span>
						<span class="ds-box border border-primary">primary</span>
						<span class="ds-box border border-danger border-3">danger · 3</span>
						<span class="ds-box border border-top-0 border-bottom-0">{{
							'DOCS.DESIGN_SYSTEM.SURFACES.BORDERS_NONE' | translate
						}}</span>
					</div>

					<h3 class="ds-h3" [innerHTML]="'DOCS.DESIGN_SYSTEM.SURFACES.RADIUS_TITLE' | translate"></h3>
					<div class="cluster gap-2">
						<span class="ds-box bg-primary-subtle rounded-0">0</span>
						<span class="ds-box bg-primary-subtle rounded-1">1</span>
						<span class="ds-box bg-primary-subtle rounded-2">2</span>
						<span class="ds-box bg-primary-subtle rounded-3">3</span>
						<span class="ds-box bg-primary-subtle rounded-4">4</span>
						<span class="ds-box bg-primary-subtle rounded-5">5</span>
						<span class="ds-box bg-primary-subtle rounded-pill">pill</span>
						<span class="ds-box ds-box--square bg-primary-subtle rounded-circle">1:1</span>
					</div>

					<h3 class="ds-h3" [innerHTML]="'DOCS.DESIGN_SYSTEM.SURFACES.SHADOWS_TITLE' | translate"></h3>
					<div class="cluster gap-3 p-3">
						<span class="ds-box bg-body rounded shadow-sm">sm</span>
						<span class="ds-box bg-body rounded shadow">md</span>
						<span class="ds-box bg-body rounded shadow-lg">lg</span>
					</div>

					<h3 class="ds-h3" [innerHTML]="'DOCS.DESIGN_SYSTEM.SURFACES.OPACITY_TITLE' | translate"></h3>
					<div class="cluster gap-2">
						@for (o of opacitySteps; track o) {
							<span class="ds-box text-bg-primary rounded" [class]="'opacity-' + o">{{ o }}</span>
						}
					</div>
					<div class="cluster gap-2 mt-2">
						@for (o of bgOpacitySteps; track o) {
							<span class="ds-box text-bg-primary rounded" [class]="'bg-opacity-' + o">bg-{{ o }}</span>
						}
					</div>

					<pre class="ds-code"><code>{{ codeSurfacesUse }}</code></pre>
				</section>

				<!-- Position and helpers -->
				<section class="library-page__section" id="helpers">
					<h2 class="library-page__section-title">{{ 'DOCS.DESIGN_SYSTEM.HELPERS.TITLE' | translate }}</h2>
					<p [innerHTML]="'DOCS.DESIGN_SYSTEM.HELPERS.BODY' | translate"></p>

					<h3 class="ds-h3" [innerHTML]="'DOCS.DESIGN_SYSTEM.HELPERS.POSITION_TITLE' | translate"></h3>
					<div class="ds-posdemo position-relative">
						<span class="ds-dot position-absolute top-0 start-0"></span>
						<span class="ds-dot position-absolute top-0 end-0"></span>
						<span class="ds-dot position-absolute top-50 start-50 translate-middle"></span>
						<span class="ds-dot position-absolute bottom-0 start-0"></span>
						<span class="ds-dot position-absolute bottom-0 end-0"></span>
					</div>

					<h3 class="ds-h3" [innerHTML]="'DOCS.DESIGN_SYSTEM.HELPERS.RATIO_TITLE' | translate"></h3>
					<div class="cluster gap-3 align-items-start">
						@for (r of ratios; track r) {
							<div class="ds-ratiobox">
								<div class="ratio" [class]="'ratio-' + r">
									<div class="ds-ratiofill">{{ r }}</div>
								</div>
							</div>
						}
					</div>

					<h3 class="ds-h3">{{ 'DOCS.DESIGN_SYSTEM.HELPERS.OVERFLOW_TITLE' | translate }}</h3>
					<div class="cluster gap-3 align-items-start">
						<div class="ds-box overflow-auto" style="max-width: 12rem; max-height: 3.5rem">
							{{ 'DOCS.DESIGN_SYSTEM.HELPERS.OVERFLOW_SAMPLE' | translate }}
						</div>
						<span class="ds-box border user-select-none">user-select-none</span>
						<span class="ds-box border pe-none">pe-none</span>
						<span class="ds-box border ms-auto">ms-auto</span>
					</div>

					<h3 class="ds-h3" [innerHTML]="'DOCS.DESIGN_SYSTEM.HELPERS.FOCUS_TITLE' | translate"></h3>
					<p class="ds-muted" [innerHTML]="'DOCS.DESIGN_SYSTEM.HELPERS.FOCUS_NOTE' | translate"></p>
					<button type="button" class="ds-box border rounded focus-ring">
						{{ 'DOCS.DESIGN_SYSTEM.HELPERS.FOCUS_BUTTON' | translate }}
					</button>

					<h3 class="ds-h3" [innerHTML]="'DOCS.DESIGN_SYSTEM.HELPERS.A11Y_TITLE' | translate"></h3>
					<p class="ds-muted" [innerHTML]="'DOCS.DESIGN_SYSTEM.HELPERS.A11Y_NOTE' | translate"></p>

					<pre class="ds-code"><code>{{ codeHelpersUse }}</code></pre>
				</section>

				<!-- Bridges to other systems -->
				<section class="library-page__section" id="puentes">
					<h2 class="library-page__section-title">{{ 'DOCS.DESIGN_SYSTEM.BRIDGES.TITLE' | translate }}</h2>
					<p [innerHTML]="'DOCS.DESIGN_SYSTEM.BRIDGES.BODY' | translate"></p>
					<pre class="ds-code"><code>{{ codeBridges }}</code></pre>
					<div class="library-page__table-wrap">
						<table class="library-page__api-table">
							<thead>
								<tr>
									<th scope="col">{{ 'DOCS.DESIGN_SYSTEM.BRIDGES.TABLE_MIXIN' | translate }}</th>
									<th scope="col">{{ 'DOCS.DESIGN_SYSTEM.BRIDGES.TABLE_SYSTEM' | translate }}</th>
									<th scope="col">adopt</th>
									<th scope="col">project</th>
								</tr>
							</thead>
							<tbody>
								@for (bridge of bridgeRows; track bridge.mixin) {
									<tr>
										<td>
											<code>hub.{{ bridge.mixin }}</code>
										</td>
										<td>{{ bridge.system }}</td>
										<td [innerHTML]="bridge.adopt | translate"></td>
										<td>
											@if (bridge.project) {
												<span [innerHTML]="bridge.project | translate"></span>
											} @else {
												—
											}
										</td>
									</tr>
								}
							</tbody>
						</table>
					</div>
				</section>

				<!-- Quick reference -->
				<section class="library-page__section" id="referencia">
					<h2 class="library-page__section-title">{{ 'DOCS.DESIGN_SYSTEM.QUICKREF.TITLE' | translate }}</h2>
					<div class="library-page__table-wrap">
						<table class="library-page__api-table">
							<thead>
								<tr>
									<th scope="col">{{ 'DOCS.DESIGN_SYSTEM.QUICKREF.TABLE_WANT' | translate }}</th>
									<th scope="col">{{ 'DOCS.DESIGN_SYSTEM.QUICKREF.TABLE_HOW' | translate }}</th>
								</tr>
							</thead>
							<tbody>
								@for (row of quickRef; track row.want) {
									<tr>
										<td>{{ row.want | translate }}</td>
										<td>
											<code class="library-page__api-inline-code">{{ row.how }}</code>
										</td>
									</tr>
								}
							</tbody>
						</table>
					</div>
				</section>
			</div>
		</div>
	`,
	styleUrl: './design-system.component.scss'
})
export class DesignSystemComponent {
	private readonly i18n = inject(AppI18nService);

	/** Built-in themes selectable in the live preview. */
	protected readonly themes = ['light', 'dark', 'base', 'bootstrap', 'sunset', 'forest', 'mono', 'terminal'];

	/** Open semantic accent set: 5 chromatic + 4 neutral variants. */
	protected readonly variants = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'neutral', 'light', 'dark'];

	/** The role family each accent derives (base + 4 derived roles). */
	protected readonly roles = [
		{ suffix: '', label: 'base' },
		{ suffix: '-subtle', label: 'subtle' },
		{ suffix: '-border-subtle', label: 'border' },
		{ suffix: '-emphasis', label: 'emphasis' },
		{ suffix: '-on', label: 'on' }
	];

	/** Spacing scale steps shown in the structural live demo. */
	protected readonly spaceSteps = ['0', '1', '2', '3', '4', '5', '6', '7'];

	/** Gap scale steps shown in the structural live demo. */
	protected readonly gapSteps = ['0', '1', '2', '3', '4', '5'];

	/** Fractional width tokens shown in the sizing live demo. */
	protected readonly fractions = [
		{ cls: '1-2', label: '1/2' },
		{ cls: '1-3', label: '1/3' },
		{ cls: '2-3', label: '2/3' },
		{ cls: '1-4', label: '1/4' },
		{ cls: '3-4', label: '3/4' },
		{ cls: 'full', label: 'full' }
	];

	/** Container max-width breakpoints shown in the structural demo. */
	protected readonly containerWidths = ['sm', 'md', 'lg', 'xl', 'xxl'];

	/** Column span combinations shown in the 12-column grid demo (each row sums to 12). */
	protected readonly colRows: number[][] = [[6, 6], [4, 4, 4], [3, 3, 6], [8, 4], [12], [2, 2, 2, 2, 2, 2]];

	/** Percentage widths shown in the width-utility demo. */
	protected readonly widthPcts = ['25', '50', '75', '100'];

	/** Directional spacing steps shown in the padding/margin demos. */
	protected readonly spacingSteps = ['1', '2', '3', '4', '5'];

	/** `justify-content` values shown in the flexbox demo. */
	protected readonly justifyOptions = ['start', 'end', 'center', 'between', 'around', 'evenly'];

	/** `align-items` values shown in the flexbox demo. */
	protected readonly alignOptions = ['start', 'center', 'end', 'stretch', 'baseline'];

	/** Heading-scale font-size levels shown in the text demo. */
	protected readonly fsLevels = [1, 2, 3, 4, 5, 6];

	/** Token-driven font-weight steps shown in the text demo. */
	protected readonly fontWeights = ['light', 'normal', 'medium', 'semibold', 'bold'];

	/** Line-height steps shown in the text demo. */
	protected readonly lineHeights = ['1', 'sm', 'base', 'lg'];

	/** Navigation-like labels filling the `cluster` demo. */
	protected readonly clusterChips = [
		'DOCS.DESIGN_SYSTEM.MIXINS.CHIP_1',
		'DOCS.DESIGN_SYSTEM.MIXINS.CHIP_2',
		'DOCS.DESIGN_SYSTEM.MIXINS.CHIP_3',
		'DOCS.DESIGN_SYSTEM.MIXINS.CHIP_4',
		'DOCS.DESIGN_SYSTEM.MIXINS.CHIP_5'
	];

	/** Counting words filling the utility and responsive demos. */
	protected readonly countWords = [
		'DOCS.DESIGN_SYSTEM.UTILITIES.ONE',
		'DOCS.DESIGN_SYSTEM.UTILITIES.TWO',
		'DOCS.DESIGN_SYSTEM.UTILITIES.THREE',
		'DOCS.DESIGN_SYSTEM.UTILITIES.FOUR'
	];

	/** Digit widths chosen so the two columns visibly disagree: 1 and 7 are the extremes. */
	protected readonly tabularAmounts = ['1.111,11 €', '9.087,70 €', '11,10 €', '777.777,77 €'];

	protected readonly tabularDemo = [
		{ label: 'DOCS.DESIGN_SYSTEM.TEXT.TABULAR_DEFAULT', tabular: false },
		{ label: 'DOCS.DESIGN_SYSTEM.TEXT.TABULAR_NUMS', tabular: true }
	];

	/** Opacity steps shown in the surfaces demo. */
	protected readonly opacitySteps = ['25', '50', '75', '100'];

	/** Background-opacity steps shown in the surfaces demo. */
	protected readonly bgOpacitySteps = ['10', '25', '50', '75', '100'];

	/** Text-opacity steps shown in the text demo. */
	protected readonly textOpacitySteps = ['25', '50', '75', '100'];

	/** Aspect-ratio helpers shown in the helpers demo. */
	protected readonly ratios = ['1x1', '4x3', '16x9', '21x9'];

	/** Rows of the "which mechanism for what" table: keys, resolved in the template. */
	protected readonly mechanismRows = [
		{
			want: 'DOCS.DESIGN_SYSTEM.START.ROW1_WANT',
			how: 'DOCS.DESIGN_SYSTEM.START.ROW1_HOW',
			where: 'DOCS.DESIGN_SYSTEM.START.LINK_MODIFY'
		},
		{
			want: 'DOCS.DESIGN_SYSTEM.START.ROW2_WANT',
			how: 'DOCS.DESIGN_SYSTEM.START.ROW2_HOW',
			where: 'DOCS.DESIGN_SYSTEM.START.LINK_MODIFY'
		},
		{
			want: 'DOCS.DESIGN_SYSTEM.START.ROW3_WANT',
			how: 'DOCS.DESIGN_SYSTEM.START.ROW3_HOW',
			where: 'DOCS.DESIGN_SYSTEM.START.LINK_FUNCTIONS'
		},
		{
			want: 'DOCS.DESIGN_SYSTEM.START.ROW4_WANT',
			how: 'DOCS.DESIGN_SYSTEM.START.ROW4_HOW',
			where: 'DOCS.DESIGN_SYSTEM.START.LINK_STRUCTURE'
		},
		{
			want: 'DOCS.DESIGN_SYSTEM.START.ROW5_WANT',
			how: 'DOCS.DESIGN_SYSTEM.START.ROW5_HOW',
			where: 'DOCS.DESIGN_SYSTEM.START.LINK_THEME'
		},
		{
			want: 'DOCS.DESIGN_SYSTEM.START.ROW6_WANT',
			how: 'DOCS.DESIGN_SYSTEM.START.ROW6_HOW',
			where: 'DOCS.DESIGN_SYSTEM.START.LINK_MIXINS'
		},
		{
			want: 'DOCS.DESIGN_SYSTEM.START.ROW7_WANT',
			how: 'DOCS.DESIGN_SYSTEM.START.ROW7_HOW',
			where: 'DOCS.DESIGN_SYSTEM.START.LINK_BRIDGES'
		},
		{
			want: 'DOCS.DESIGN_SYSTEM.START.ROW8_WANT',
			how: 'DOCS.DESIGN_SYSTEM.START.ROW8_HOW',
			where: 'DOCS.DESIGN_SYSTEM.START.LINK_TOKENS'
		}
	];

	/** Rows of the bridge table; `project` is empty for the read-only bridge. */
	protected readonly bridgeRows = [
		{
			mixin: 'bridge-bootstrap',
			system: 'Bootstrap 5.3+',
			adopt: 'DOCS.DESIGN_SYSTEM.BRIDGES.BOOTSTRAP_ADOPT',
			project: 'DOCS.DESIGN_SYSTEM.BRIDGES.BOOTSTRAP_PROJECT'
		},
		{
			mixin: 'bridge-material',
			system: 'Angular Material 3',
			adopt: 'DOCS.DESIGN_SYSTEM.BRIDGES.MATERIAL_ADOPT',
			project: 'DOCS.DESIGN_SYSTEM.BRIDGES.MATERIAL_PROJECT'
		},
		{
			mixin: 'bridge-tailwind',
			system: 'Tailwind v4',
			adopt: 'DOCS.DESIGN_SYSTEM.BRIDGES.TAILWIND_ADOPT',
			project: 'DOCS.DESIGN_SYSTEM.BRIDGES.TAILWIND_PROJECT'
		},
		{
			mixin: 'bridge-open-props',
			system: 'Open Props',
			adopt: 'DOCS.DESIGN_SYSTEM.BRIDGES.OPEN_PROPS_ADOPT',
			project: ''
		}
	];

	/** Full catalogue of the Sass mixins forwarded by `@use 'ng-hub-ui-ds' as hub`. */
	protected readonly mixinCatalog: { group: string; mixins: { name: string; params: string; desc: string }[] }[] = [
		{
			group: 'DOCS.DESIGN_SYSTEM.CATALOG.GROUP_THEME',
			mixins: [
				{
					name: 'theme',
					params: '$accents, $space, $gap, $radius, $shadow, $font-*, $line-height, $tokens',
					desc: 'DOCS.DESIGN_SYSTEM.CATALOG.THEME'
				}
			]
		},
		{
			group: 'DOCS.DESIGN_SYSTEM.CATALOG.GROUP_BREAKPOINTS',
			mixins: [
				{
					name: 'media-breakpoint-up',
					params: '$name, $breakpoints: $hub-breakpoints',
					desc: 'DOCS.DESIGN_SYSTEM.CATALOG.MEDIA_UP'
				},
				{
					name: 'media-breakpoint-down',
					params: '$name, $breakpoints: $hub-breakpoints',
					desc: 'DOCS.DESIGN_SYSTEM.CATALOG.MEDIA_DOWN'
				}
			]
		},
		{
			group: 'DOCS.DESIGN_SYSTEM.CATALOG.GROUP_LAYOUT',
			mixins: [
				{ name: 'stack', params: '$gap: 3, $align: stretch', desc: 'DOCS.DESIGN_SYSTEM.CATALOG.STACK' },
				{
					name: 'cluster',
					params: '$gap: 2, $align: center, $justify: flex-start',
					desc: 'DOCS.DESIGN_SYSTEM.CATALOG.CLUSTER'
				},
				{ name: 'grid', params: '$min: 16rem, $gap: 4', desc: 'DOCS.DESIGN_SYSTEM.CATALOG.GRID' },
				{ name: 'grid-fixed', params: '$cols: 12, $gap: 4', desc: 'DOCS.DESIGN_SYSTEM.CATALOG.GRID_FIXED' },
				{ name: 'row', params: '$gap: 3', desc: 'DOCS.DESIGN_SYSTEM.CATALOG.ROW' },
				{ name: 'col', params: '$span: 12', desc: 'DOCS.DESIGN_SYSTEM.CATALOG.COL' },
				{ name: 'offset', params: '$n: 0', desc: 'DOCS.DESIGN_SYSTEM.CATALOG.OFFSET' },
				{ name: 'center', params: '$max: xl, $pad: 3', desc: 'DOCS.DESIGN_SYSTEM.CATALOG.CENTER' }
			]
		},
		{
			group: 'DOCS.DESIGN_SYSTEM.CATALOG.GROUP_TYPOGRAPHY',
			mixins: [
				{ name: 'font-family', params: '$family: base', desc: 'DOCS.DESIGN_SYSTEM.CATALOG.FONT_FAMILY' },
				{ name: 'font-size', params: '$size: base', desc: 'DOCS.DESIGN_SYSTEM.CATALOG.FONT_SIZE' },
				{ name: 'font-weight', params: '$weight: base', desc: 'DOCS.DESIGN_SYSTEM.CATALOG.FONT_WEIGHT' },
				{ name: 'line-height', params: '$height: base', desc: 'DOCS.DESIGN_SYSTEM.CATALOG.LINE_HEIGHT' },
				{ name: 'text-color', params: '$variant: body', desc: 'DOCS.DESIGN_SYSTEM.CATALOG.TEXT_COLOR' },
				{ name: 'link-color', params: '$variant: primary', desc: 'DOCS.DESIGN_SYSTEM.CATALOG.LINK_COLOR' },
				{ name: 'text-truncate', params: '—', desc: 'DOCS.DESIGN_SYSTEM.CATALOG.TEXT_TRUNCATE' },
				{ name: 'text-break', params: '—', desc: 'DOCS.DESIGN_SYSTEM.CATALOG.TEXT_BREAK' }
			]
		},
		{
			group: 'DOCS.DESIGN_SYSTEM.CATALOG.GROUP_SURFACES',
			mixins: [
				{ name: 'bg', params: '$variant: body, $subtle: false', desc: 'DOCS.DESIGN_SYSTEM.CATALOG.BG' },
				{ name: 'text-bg', params: '$variant: primary', desc: 'DOCS.DESIGN_SYSTEM.CATALOG.TEXT_BG' },
				{ name: 'border', params: '$width: 1px, $color: …', desc: 'DOCS.DESIGN_SYSTEM.CATALOG.BORDER' },
				{ name: 'border-color', params: '$variant: primary', desc: 'DOCS.DESIGN_SYSTEM.CATALOG.BORDER_COLOR' },
				{ name: 'radius', params: '$size: md', desc: 'DOCS.DESIGN_SYSTEM.CATALOG.RADIUS' },
				{ name: 'shadow', params: '$size: md', desc: 'DOCS.DESIGN_SYSTEM.CATALOG.SHADOW' }
			]
		},
		{
			group: 'DOCS.DESIGN_SYSTEM.CATALOG.GROUP_HELPERS',
			mixins: [
				{ name: 'focus-ring', params: '—', desc: 'DOCS.DESIGN_SYSTEM.CATALOG.FOCUS_RING' },
				{ name: 'visually-hidden', params: '—', desc: 'DOCS.DESIGN_SYSTEM.CATALOG.VISUALLY_HIDDEN' },
				{ name: 'stretched-link', params: '—', desc: 'DOCS.DESIGN_SYSTEM.CATALOG.STRETCHED_LINK' },
				{ name: 'ratio', params: '$x: 16, $y: 9', desc: 'DOCS.DESIGN_SYSTEM.CATALOG.RATIO' },
				{ name: 'clearfix', params: '—', desc: 'DOCS.DESIGN_SYSTEM.CATALOG.CLEARFIX' }
			]
		},
		{
			group: 'DOCS.DESIGN_SYSTEM.CATALOG.GROUP_BRIDGES',
			mixins: [
				{
					name: 'bridge-bootstrap',
					params: '$mode: adopt | project',
					desc: 'DOCS.DESIGN_SYSTEM.CATALOG.BRIDGE_BOOTSTRAP'
				},
				{
					name: 'bridge-material',
					params: '$mode: adopt | project',
					desc: 'DOCS.DESIGN_SYSTEM.CATALOG.BRIDGE_MATERIAL'
				},
				{
					name: 'bridge-tailwind',
					params: '$mode: adopt | project',
					desc: 'DOCS.DESIGN_SYSTEM.CATALOG.BRIDGE_TAILWIND'
				},
				{ name: 'bridge-open-props', params: '$mode: adopt', desc: 'DOCS.DESIGN_SYSTEM.CATALOG.BRIDGE_OPEN_PROPS' }
			]
		}
	];

	/** Active theme of the scoped preview area. */
	protected readonly previewTheme = signal('light');

	/** Live custom-accent colour for the playground. */
	protected readonly brandColor = signal('#9333ea');

	/** Default base colours of the semantic families (theme-builder reset). */
	private readonly defaultBases: Record<string, string> = {
		primary: '#0d6efd',
		secondary: '#6c757d',
		success: '#198754',
		danger: '#dc3545',
		warning: '#ffc107',
		info: '#0dcaf0',
		neutral: '#6c757d',
		light: '#f8f9fa',
		dark: '#212529'
	};

	/** Live base colours edited in the theme builder; the rest derive from these. */
	protected readonly bases = signal<Record<string, string>>({ ...this.defaultBases });

	/**
	 * The ng-hub-ui family with its token-integration status. `wired` means the
	 * library already consumes `--hub-sys-*` (re-themes with the design-system);
	 * the rest are pending and addressed later.
	 */
	protected readonly libraries = DS_FAMILY_LIBRARIES;

	/**
	 * Interpolation payload for the two sentences linking to the token reference.
	 * The link is built from the active language rather than written as `/tokens`,
	 * which is redirected to the default language and drops the reader's own.
	 */
	protected readonly tokensParam = computed(() => ({ tokens: `/${this.i18n.lang()}/tokens/` }));

	/** Interpolation payload for the sentence quoting the plain-CSS import line. */
	protected readonly cssImportParam = { css: `@import 'ng-hub-ui-ds/styles/tokens/hub-tokens.css';` };

	protected readonly codeDerive = `.my-theme {
  /* define ONLY the base colour of each family */
  --hub-sys-color-primary: #6d28d9;

  /* the rest derives at runtime with color-mix / relative color — nothing to maintain */
  --hub-sys-color-primary-subtle:        color-mix(in oklch, var(--hub-sys-color-primary) 12%, var(--hub-sys-surface-page));
  --hub-sys-color-primary-border-subtle: color-mix(in oklch, var(--hub-sys-color-primary) 35%, var(--hub-sys-surface-page));
  --hub-sys-color-primary-emphasis:      color-mix(in oklch, var(--hub-sys-color-primary) 80%, var(--hub-sys-color-ink));
  --hub-sys-color-primary-on:            oklch(from var(--hub-sys-color-primary) clamp(0, (0.62 - l) * 1000, 1) 0 h);
}`;

	/** Quick-reference table rows: the "want" is a key, the "how" is code. */
	protected readonly quickRef = [
		{ want: 'DOCS.DESIGN_SYSTEM.QUICKREF.WANT_1', how: "@use '…/hub-tokens'" },
		{ want: 'DOCS.DESIGN_SYSTEM.QUICKREF.WANT_2', how: ':root { --hub-sys-color-primary: … }' },
		{ want: 'DOCS.DESIGN_SYSTEM.QUICKREF.WANT_3', how: 'with ($hub-accents-extra: (brand: …))' },
		{ want: 'DOCS.DESIGN_SYSTEM.QUICKREF.WANT_4', how: 'color: var(--hub-sys-color-primary-on)' },
		{ want: 'DOCS.DESIGN_SYSTEM.QUICKREF.WANT_5', how: '@include hub.center() · .stack' },
		{ want: 'DOCS.DESIGN_SYSTEM.QUICKREF.WANT_6', how: '@include hub.font-size(3) · .fs-3 .fw-bold .text-muted' },
		{
			want: 'DOCS.DESIGN_SYSTEM.QUICKREF.WANT_7',
			how: '@include hub.text-bg(brand) · .bg-primary-subtle .rounded .shadow'
		},
		{ want: 'DOCS.DESIGN_SYSTEM.QUICKREF.WANT_8', how: '.position-absolute .top-0 · .ratio-16x9 · .visually-hidden' },
		{
			want: 'DOCS.DESIGN_SYSTEM.QUICKREF.WANT_9',
			how: '.col-md-6 · .flex-md-row · .offset-md-8 · @include hub.media-breakpoint-up(md)'
		},
		{ want: 'DOCS.DESIGN_SYSTEM.QUICKREF.WANT_10', how: '@include hub.bridge-bootstrap($mode: adopt)' },
		{ want: 'DOCS.DESIGN_SYSTEM.QUICKREF.WANT_11', how: "[data-theme='<name>'] { … }" },
		{
			want: 'DOCS.DESIGN_SYSTEM.QUICKREF.WANT_12',
			how: '@include hub.theme($space: (3: 1.25rem), $accents: (primary: …))'
		}
	];

	protected readonly codeGettingStarted = `/* styles.scss (application root) */

/* 1 · Tokens — ALWAYS, exactly once: the base the whole family consumes */
@use 'ng-hub-ui-ds/styles/tokens/hub-tokens';

/* 2 · Native-element reset — only if your app does not ship one already (Bootstrap Reboot…) */
@use 'ng-hub-ui-ds/styles/base/reset';

/* 3 · Utilities — opt-in: import only the sheets you use
      (Bootstrap-exact names: do NOT load them next to a global Bootstrap) */
@use 'ng-hub-ui-ds/styles/utilities/layout';
@use 'ng-hub-ui-ds/styles/utilities/text';
@use 'ng-hub-ui-ds/styles/utilities/surfaces';

/* 4 · Sheets of their own shipped by some libraries — once, path documented by each README */
@use 'ng-hub-ui-forms/styles' as hub-forms;  // shared forms chrome
@use 'ng-hub-ui-utils/styles/tooltip';       // utils tooltip

/* 5 · Mixins — when you build your own components with the same system */
@use 'ng-hub-ui-ds' as hub;
.page { @include hub.center($max: xl); }`;

	protected readonly codeImportCss = `@import 'ng-hub-ui-ds/styles/tokens/hub-tokens.css';`;

	protected readonly codeImportAngular = `"styles": [
  "node_modules/ng-hub-ui-ds/styles/tokens/hub-tokens.css",
  "src/styles.scss"
]`;

	protected readonly codeImportScss = `@use 'ng-hub-ui-ds/styles/tokens/hub-tokens';`;

	protected readonly codeOverride = `:root {
  --hub-sys-color-primary: #7c3aed;
  --hub-sys-color-primary-subtle: #ede9fe;
  --hub-sys-color-primary-emphasis: #5b21b6;
}`;

	protected readonly codeAccent = `:root {
  --hub-sys-color-brand: #9333ea;
  --hub-sys-color-brand-subtle: #f3e8ff;
  --hub-sys-color-brand-border-subtle: #d8b4fe;
  --hub-sys-color-brand-emphasis: #6b21a8;
}

<!-- in any component that accepts a semantic variant -->
<hub-panel appearance="alert" variant="brand">Brand alert</hub-panel>`;

	protected readonly codeThemeMixin = `@use 'ng-hub-ui-ds' as hub;

/* change ONLY spacing step 3 — gap-3, .p-3, sys-gap-3, components… all move with it */
:root { @include hub.theme($space: (3: 1.25rem)); }

/* or a whole theme, scopeable to [data-theme] or to a subtree */
[data-theme='compact'] {
  @include hub.theme(
    $space: (3: 0.75rem, 4: 1rem),
    $radius: (md: 0.25rem),
    $accents: (primary: #0f766e, brand: #ff6b00)
  );
}`;

	protected readonly codeTheme = `[data-theme='corporate'] {
  --hub-sys-color-primary: #0033a0;
  --hub-sys-surface-page: #fbfcff;
  --hub-sys-text-primary: #0a1f44;
  /* …the rest of the tokens that differ from the base */
}`;

	protected readonly codeMixin = `// The accent set is an OPEN map with !default — add as many as you want.
$hub-accents: (
  primary: …, secondary: …, success: …, danger: …, warning: …,
  info: …, neutral: …, light: …, dark: …
) !default;

// The family is derived ONCE in :root, iterating EVERY key of the map,
// so any accent you add gets its family for free.
@mixin hub-color-derive() {
  @each $name in map.keys($hub-accents) {
    --hub-sys-color-#{$name}-subtle:   color-mix(in oklch, var(--hub-sys-color-#{$name}) 12%, var(--hub-sys-surface-page));
    --hub-sys-color-#{$name}-emphasis: color-mix(in oklch, var(--hub-sys-color-#{$name}) 80%, var(--hub-sys-color-ink));
    --hub-sys-color-#{$name}-on:       oklch(from var(--hub-sys-color-#{$name}) clamp(0, (0.62 - l) * 1000, 1) 0 h);
  }
}`;

	protected readonly codeOpenMap = `// Add your own variants — this recompiles the ds only, never the libraries.
@use 'ng-hub-ui-ds/styles/tokens/hub-tokens' with (
  $hub-accents-extra: (
    brand:    #ff6b00,
    accent:   #00b8d9,
    tertiary: #9c36b5
  )
);
// brand · accent · tertiary get subtle · border-subtle · emphasis · on automatically.`;

	protected readonly codeStructure = `/* Canonical structural tokens (ref → sys) */
gap: var(--hub-sys-gap-3);                  /* spacing scale */
padding-inline: var(--hub-ref-space-4);
max-width: var(--hub-sys-container-max-width-lg);
grid-template-columns: repeat(var(--hub-sys-grid-columns), minmax(0, 1fr));

/* Layout mixins */
@use 'ng-hub-ui-ds' as hub;
.page    { @include hub.center($max: xl); }
.toolbar { @include hub.cluster($gap: 2); }
.cards   { @include hub.grid($min: 16rem, $gap: 3); }

/* Opt-in utilities (Bootstrap naming, 3 sheets) */
@use 'ng-hub-ui-ds/styles/utilities/layout';    // .d-flex .gap-3 .ms-auto .position-* .ratio-*
@use 'ng-hub-ui-ds/styles/utilities/text';      // .fs-3 .fw-bold .text-truncate .text-muted
@use 'ng-hub-ui-ds/styles/utilities/surfaces';  // .bg-* .border .rounded .shadow .opacity-*`;

	protected readonly codeBridges = `@use 'ng-hub-ui-ds' as hub;

/* "I have Bootstrap and I want hub to adopt its palette" */
:root { @include hub.bridge-bootstrap($mode: adopt); }

/* "I want to tint Material and Tailwind with MY hub theme" */
:root { @include hub.bridge-material($mode: project); }
:root { @include hub.bridge-tailwind($mode: project); }`;

	protected readonly codeMixinsUse = `@use 'ng-hub-ui-ds' as hub;

.toolbar { @include hub.cluster($gap: 2); }          // a row that wraps
.feed    { @include hub.stack($gap: 3); }            // a column
.cards   { @include hub.grid($min: 8rem, $gap: 2); } // auto-fit grid
.page    { @include hub.center($max: sm); }          // centred wrapper`;

	protected readonly codeUtilitiesUse = `// three opt-in sheets — import only the ones you use
@use 'ng-hub-ui-ds/styles/utilities/layout';    // layout, spacing, position, helpers
@use 'ng-hub-ui-ds/styles/utilities/text';      // typography and text
@use 'ng-hub-ui-ds/styles/utilities/surfaces';  // backgrounds, borders, radii, shadows

<div class="cluster gap-2"> … </div>
<div class="grid-auto gap-2"> … </div>
<div class="w-50">half</div>
<div class="vh-100 min-vh-100">viewport height</div>`;

	protected readonly codeResponsiveUse = `<!-- mobile-first: 1 column → 2 at ≥768px → 4 at ≥1200px -->
<div class="row">
  <div class="col-12 col-md-6 col-xl-3">…</div>
</div>
<div class="d-none d-lg-flex">desktop only</div>
<section class="p-2 p-md-4">padding that grows with the viewport</section>

// breakpoints as a mixin — for any other utility or your own CSS
@use 'ng-hub-ui-ds' as hub;
@include hub.media-breakpoint-up(md) { .sidebar { width: 18rem; } }`;

	protected readonly codeColsUse = `<!-- 12-column grid: every row adds up to 12 -->
<div class="row">
  <div class="col-6">col-6</div>
  <div class="col-6">col-6</div>
</div>
<div class="row">
  <div class="col-4">col-4</div>
  <div class="col-4">col-4</div>
  <div class="col-4">col-4</div>
</div>

<!-- offset: .col-4.offset-8 starts on track 9 (offset-{bp}-0 resets it) -->
<div class="row">
  <div class="col-4 offset-md-8">col-4 offset-md-8</div>
</div>

<!-- widths · directional padding and margin -->
<div class="w-50">w-50</div>
<div class="p-3">1rem of padding on all four sides</div>
<div class="px-4 py-2">padding-inline 1.5rem · padding-block .5rem</div>
<div class="mx-3">margin-inline 1rem</div>`;

	protected readonly codeFlexUse = `<!-- display + direction / wrap -->
<div class="d-flex flex-wrap gap-2"> … </div>
<div class="d-flex flex-column"> … </div>

<!-- main axis (justify) and cross axis (align) -->
<div class="d-flex justify-content-between align-items-center"> … </div>

<!-- grow / pin -->
<div class="d-flex gap-2">
  <span class="flex-fill">grows</span>
  <span class="flex-grow-0">fixed</span>
</div>

<!-- responsive: a column on mobile, a top-aligned row from md up -->
<div class="d-flex flex-column flex-md-row align-items-md-start"> … </div>

<!-- vertical divider -->
<div class="d-flex gap-3">left <span class="vr"></span> right</div>`;

	protected readonly codeTextUse = `// import the sheet once
@use 'ng-hub-ui-ds/styles/utilities/text';

<h2 class="fs-3 fw-semibold">Headline</h2>
<p class="text-muted lh-lg">Secondary copy with generous leading</p>
<span class="text-uppercase fw-medium">label</span>
<td class="text-end font-monospace">1.234,56 €</td>
<p class="text-truncate" style="max-width: 16rem">Truncated with an ellipsis…</p>

// …or mint variants of your own with the mixins
@use 'ng-hub-ui-ds' as hub;
.card__title { @include hub.font-size(4); @include hub.font-weight(semibold); }
.card__meta  { @include hub.text-color(muted); @include hub.text-truncate(); }`;

	protected readonly codeSurfacesUse = `// import the sheet once
@use 'ng-hub-ui-ds/styles/utilities/surfaces';

<hub-badge color="success">active</hub-badge>
<div class="bg-warning-subtle border border-warning rounded-3 p-3">notice</div>
<div class="bg-body rounded shadow-lg p-4">raised card</div>

// …or mint variants of your own with the mixins
@use 'ng-hub-ui-ds' as hub;
.card        { @include hub.bg(body); @include hub.radius(lg); @include hub.shadow(sm); }
.card--brand { @include hub.text-bg(brand); }  // any accent of the open map`;

	protected readonly codeHelpersUse = `<!-- badge positioned over the corner of its container -->
<div class="position-relative">
  …
  <span class="position-absolute top-0 start-100 translate-middle text-bg-danger rounded-pill px-2">9+</span>
</div>

<!-- media at a fixed ratio -->
<div class="ratio ratio-16x9"><iframe src="…"></iframe></div>

<!-- whole card clickable + screen-reader-only text -->
<div class="position-relative">
  <a href="…" class="stretched-link">See more<span class="visually-hidden"> about surfaces</span></a>
</div>

<!-- push with auto margins inside a flex row -->
<nav class="d-flex gap-2"><span>logo</span><a class="ms-auto">login</a></nav>`;

	/**
	 * Scrolls to the section targeted by the route fragment when the sidebar
	 * submenu is used. The docs shell scrolls inside `.app-shell__main` (not the
	 * document), so `scrollIntoView` is used rather than the router's anchor
	 * scrolling. Browser-only; relies on `onSameUrlNavigation: 'reload'` so the
	 * fragment re-emits when navigating within the same page.
	 */
	constructor() {
		const route = inject(ActivatedRoute);
		if (!isPlatformBrowser(inject(PLATFORM_ID))) {
			return;
		}
		route.fragment.pipe(takeUntilDestroyed()).subscribe((fragment) => {
			if (!fragment) {
				return;
			}
			setTimeout(() => {
				document.getElementById(fragment)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
			}, 60);
		});
	}

	/** Updates the live accent colour from the colour input. */
	protected onBrand(event: Event): void {
		this.brandColor.set((event.target as HTMLInputElement).value);
	}

	/**
	 * Updates a single semantic base colour in the theme builder.
	 *
	 * @param variant The semantic family being edited.
	 * @param event The native input event from the colour picker.
	 */
	protected onBase(variant: string, event: Event): void {
		const value = (event.target as HTMLInputElement).value;
		this.bases.update((current) => ({ ...current, [variant]: value }));
	}

	/** Restores the default base colours of the theme builder. */
	protected resetBases(): void {
		this.bases.set({ ...this.defaultBases });
	}
}
