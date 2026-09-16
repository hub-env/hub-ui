import { DOCUMENT, DatePipe, NgComponentOutlet } from '@angular/common';
import {
	Component,
	computed,
	inject,
	input,
	OnDestroy,
	OnInit,
	signal,
	viewChild,
	ChangeDetectionStrategy
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HubNavScrollSpyDirective, HubNavScrollSpySectionDirective } from 'ng-hub-ui-nav';
import { TranslatePipe } from 'ng-hub-ui-utils';
import { HighlightModule } from 'ngx-highlightjs';
import { ExampleRegistry } from '../src/app/shared/example-viewer/example-registry';
import { ExampleViewer } from '../src/app/shared/example-viewer/example-viewer';
import { PlaygroundComponent } from '../src/app/shared/playground/playground.component';
import { PlaygroundConfig } from '../src/app/shared/playground/playground.interface';
import { Library } from '../src/models/interfaces';
import { Subscription } from 'rxjs';
import { getLibrarySeoDefinition, LIBRARY_TABS, type LibrarySeoKey, type LibraryTabSeoId } from '../src/app/seo/seo.config';
import { LIBRARY_LAST_MODIFIED } from '../src/app/seo/library-versions.generated';
import { AppI18nService, SEMANTIC_KEY_RE } from '../src/app/services/app-i18n.service';

/**
 * Shared component for displaying library documentation pages.
 * Provides a standardized interface for all ng-hub-ui libraries with
 * tabs for overview, API reference, and examples.
 */
@Component({
	selector: 'app-library-page',
	standalone: true,
	imports: [
		DatePipe,
		HighlightModule,
		NgComponentOutlet,
		ExampleViewer,
		PlaygroundComponent,
		HubNavScrollSpyDirective,
		HubNavScrollSpySectionDirective,
		RouterLink,
		TranslatePipe
	],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<div class="library-page">
			<!-- Fixed Header Section -->
			<header class="library-page__header">
				<div class="library-page__header-content">
					<h1 class="library-page__title">{{ heroTitle() }}</h1>
					<p class="library-page__description">{{ localizedDescription() }}</p>
					@if (activeTab() === 'overview' && lastUpdatedLabel(); as lastUpdated) {
						<p class="library-page__last-updated">
							<small>{{ 'UI.LIBRARY.LAST_UPDATED' | translate }} {{ lastUpdated }}</small>
						</p>
					}
				</div>

				@if (!hideTabs()) {
					<!-- Navigation Tabs -->
					<nav class="library-page__nav">
						<button
							type="button"
							class="library-page__nav-button"
							[class.library-page__nav-button--active]="activeTab() === 'overview'"
							(click)="setActiveTab('overview')"
						>
							{{ 'UI.LIBRARY.TABS.OVERVIEW' | translate }}
						</button>
						<button
							type="button"
							class="library-page__nav-button"
							[class.library-page__nav-button--active]="activeTab() === 'api'"
							(click)="setActiveTab('api')"
						>
							{{ 'UI.LIBRARY.TABS.API' | translate }}
						</button>
						<button
							type="button"
							class="library-page__nav-button"
							[class.library-page__nav-button--active]="activeTab() === 'styles'"
							(click)="setActiveTab('styles')"
						>
							{{ 'UI.LIBRARY.TABS.STYLES' | translate }}
						</button>
						<button
							type="button"
							class="library-page__nav-button"
							[class.library-page__nav-button--active]="activeTab() === 'examples'"
							(click)="setActiveTab('examples')"
						>
							{{ 'UI.LIBRARY.TABS.EXAMPLES' | translate }}
						</button>
						@if (hasPlayground()) {
							<button
								type="button"
								class="library-page__nav-button"
								[class.library-page__nav-button--active]="activeTab() === 'playground'"
								(click)="setActiveTab('playground')"
							>
								{{ 'UI.LIBRARY.TABS.PLAYGROUND' | translate }}
							</button>
						}
					</nav>
				}
			</header>

			<!-- Scrollable Content Area -->
			<main class="library-page__content">
				@if (library().deprecated; as deprecation) {
					<div class="alert alert-warning library-page__deprecation" role="alert">
						<i class="fa-solid fa-triangle-exclamation me-2" aria-hidden="true"></i>
						<span>{{ deprecation.message }}</span>
						@if (deprecation.replacementRoute && deprecation.replacementName) {
							<a class="alert-link ms-1" [routerLink]="deprecation.replacementRoute">{{
								deprecation.replacementName
							}}</a>
						}
					</div>
				}

				<!-- Overview Tab -->
				@if (activeTab() === 'overview') {
					<section class="library-page__section library-page__section--overview">
						<h2 class="library-page__section-title">{{ 'UI.LIBRARY.TABS.OVERVIEW' | translate }}</h2>

						@if (currentLibrarySeoEntry(); as seo) {
							<div class="library-page__section-group">
								<h3 class="library-page__section-subtitle">{{ 'UI.LIBRARY.PAGE.WHY_SEARCH' | translate }}</h3>
								<p class="library-page__text">{{ localizedIntro() }}</p>
							</div>

							<div class="library-page__section-group library-page__quickstart">
								<div class="library-page__quickstart-card">
									<h3 class="library-page__section-subtitle">{{ 'UI.LIBRARY.PAGE.INSTALL' | translate }}</h3>
									<pre class="library-page__code"><code>{{ installCommand() }}</code></pre>
								</div>

								<div class="library-page__quickstart-card">
									<h3 class="library-page__section-subtitle">{{ 'UI.LIBRARY.PAGE.JUMP_TO' | translate }}</h3>
									<div class="library-page__quick-links">
										@if (hasApiReference()) {
											<button
												type="button"
												class="library-page__quick-link"
												(click)="setActiveTab('api')"
											>
												{{ 'UI.LIBRARY.TABS.API' | translate }}
											</button>
										}
										<button
											type="button"
											class="library-page__quick-link"
											(click)="setActiveTab('examples')"
										>
											{{ 'UI.LIBRARY.TABS.EXAMPLES' | translate }}
										</button>
									</div>
								</div>
							</div>

							<div class="library-page__section-group">
								<h3 class="library-page__section-subtitle">{{ 'UI.LIBRARY.PAGE.IDEAL_FOR' | translate }}</h3>
								<ul class="library-page__use-cases">
									@for (useCase of localizedUseCases(); track useCase) {
										<li class="library-page__use-case">{{ useCase }}</li>
									}
								</ul>
							</div>
						}

						<div class="library-page__section-group">
							<h3 class="library-page__section-subtitle">
								{{ 'UI.LIBRARY.PAGE.ABOUT_PREFIX' | translate }} {{ getLibraryShortName() }}
							</h3>
							<p class="library-page__text">{{ localizedOverviewText() }}</p>
						</div>

						<div class="library-page__section-group">
							<h3 class="library-page__section-subtitle">{{ 'UI.LIBRARY.PAGE.FEATURE_GUIDES' | translate }}</h3>
							@if (library().functionalities.length > 0) {
								@for (feature of library().functionalities; track feature.title) {
									<div class="library-page__feature" [attr.id]="overviewFeatureSectionId(feature.title)">
										<h4 class="library-page__feature-title">{{ translateText(feature.title) }}</h4>
										<p class="library-page__feature-description">
											{{ translateText(feature.description) }}
										</p>
										@if (feature.examples.length > 0) {
											<h5 class="library-page__feature-examples-title">
												{{ 'UI.LIBRARY.PAGE.EXAMPLES' | translate }}:
											</h5>
											@for (example of feature.examples; track example.title) {
												<div class="library-page__example">
													<h6 class="library-page__example-title">
														{{ translateText(example.title) }}
													</h6>
													<p class="library-page__example-description">
														{{ translateText(example.description) }}
													</p>

													<div class="library-page__example-demo">
														@if (example.previewComponent) {
															<ng-container
																*ngComponentOutlet="example.previewComponent"
															></ng-container>
														} @else {
															<p class="library-page__text">
																{{ 'UI.LIBRARY.PAGE.LIVE_PREVIEW_UNAVAILABLE' | translate }}
															</p>
														}
													</div>

													@if (example.import || example.template || example.component) {
														<h6 class="library-page__code-title">
															{{ 'UI.LIBRARY.PAGE.CODE' | translate }}
														</h6>
													}

													@if (example.import) {
														<h6 class="library-page__code-subtitle">
															{{ 'UI.LIBRARY.PAGE.IMPORT' | translate }}:
														</h6>
														<pre
															class="library-page__code"
														><code [highlight]="example.import" language="typescript"></code></pre>
													}
													@if (example.template) {
														<h6 class="library-page__code-subtitle">
															{{ 'UI.LIBRARY.PAGE.TEMPLATE' | translate }}:
														</h6>
														<pre
															class="library-page__code"
														><code [highlight]="example.template" language="xml"></code></pre>
													}
													@if (example.component) {
														<h6 class="library-page__code-subtitle">
															{{ 'UI.LIBRARY.PAGE.COMPONENT' | translate }}:
														</h6>
														<pre
															class="library-page__code"
														><code [highlight]="example.component" language="typescript"></code></pre>
													}
												</div>
											}
										}
									</div>
								}
							} @else {
								<p class="library-page__text">{{ 'UI.LIBRARY.PAGE.FEATURE_GUIDES_EMPTY' | translate }}</p>
							}
						</div>

						@if (localizedHighlights().length > 0) {
							<div class="library-page__section-group">
								<h3 class="library-page__section-subtitle">{{ 'UI.LIBRARY.PAGE.KEY_FEATURES' | translate }}</h3>
								<div class="library-page__highlights">
									@for (h of localizedHighlights(); track h.title) {
										<button
											type="button"
											class="library-page__highlight-card"
											[class.library-page__highlight-card--clickable]="hasOverviewFeature(h.title)"
											[disabled]="!hasOverviewFeature(h.title)"
											(click)="scrollToOverviewFeature(h.title)"
										>
											<div class="library-page__highlight-icon-wrap">
												<i [class]="h.icon + ' library-page__highlight-icon'" aria-hidden="true"></i>
											</div>
											<h4 class="library-page__highlight-title">{{ translateText(h.title) }}</h4>
											<p class="library-page__highlight-desc">{{ translateText(h.description) }}</p>
										</button>
									}
								</div>
							</div>
						}

						<div class="library-page__section-group">
							<h3 class="library-page__section-subtitle">{{ 'UI.LIBRARY.PAGE.RECENT_CHANGES' | translate }}</h3>
							@if (library().overview.changelog.length > 0) {
								@for (entry of library().overview.changelog; track entry.version) {
									<div class="library-page__changelog-entry">
										<h4 class="library-page__changelog-version">
											Version {{ entry.version }} - {{ entry.date | date: 'short' }}
										</h4>
										@for (change of entry.changes; track change.description) {
											<p class="library-page__changelog-change">
												<span class="library-page__changelog-type">{{ change.type }}:</span>
												{{ translateText(change.description) }}
											</p>
										}
									</div>
								}
							} @else {
								<p class="library-page__text">{{ 'UI.LIBRARY.PAGE.NO_CHANGELOG' | translate }}</p>
							}
						</div>

						@if (relatedLibraries().length > 0) {
							<div class="library-page__section-group">
								<h3 class="library-page__section-subtitle">
									{{ 'UI.LIBRARY.PAGE.RELATED_LIBRARIES' | translate }}
								</h3>
								<div class="library-page__related-links">
									@for (relatedLibrary of relatedLibraries(); track relatedLibrary.route) {
										<a
											class="library-page__related-link"
											[routerLink]="i18n.localizePath('/' + relatedLibrary.route + '/overview')"
										>
											{{ relatedLibrary.label }}
										</a>
									}
								</div>
							</div>
						}

						<!--
            Rendered open on purpose: AI crawlers extract the served HTML, and
            several never execute JavaScript. Hiding these behind an accordion
            would defeat the point of writing them.
          -->
						@if (faqEntries().length > 0) {
							<div class="library-page__section-group">
								<h3 class="library-page__section-subtitle">{{ 'UI.LIBRARY.PAGE.FAQ' | translate }}</h3>
								@for (faq of faqEntries(); track faq.question) {
									<div class="library-page__faq-item">
										<h4 class="library-page__faq-question">{{ faq.question }}</h4>
										<p class="library-page__text">{{ faq.answer }}</p>
									</div>
								}
							</div>
						}
					</section>
				}

				<!-- API Tab -->
				@if (activeTab() === 'api') {
					<section class="library-page__section library-page__section--api">
						<h2 class="library-page__section-title">{{ 'UI.LIBRARY.PAGE.API_REFERENCE' | translate }}</h2>
						<p class="library-page__section-lede">{{ apiNarrative().intro }}</p>

						<div class="library-page__api-group">
							<h3 class="library-page__api-group-title">{{ 'UI.LIBRARY.PAGE.INPUTS' | translate }}</h3>
							@if (library().api.inputs.length > 0) {
								<p class="library-page__api-lede">{{ apiNarrative().inputs }}</p>
								<div class="library-page__table-wrap">
									<table class="library-page__api-table">
										<thead>
											<tr>
												<th>{{ 'UI.LIBRARY.PAGE.NAME' | translate }}</th>
												<th>{{ 'UI.LIBRARY.PAGE.TYPE' | translate }}</th>
												<th>{{ 'UI.LIBRARY.PAGE.DEFAULT' | translate }}</th>
												<th>{{ 'UI.LIBRARY.PAGE.DESCRIPTION_COLUMN' | translate }}</th>
											</tr>
										</thead>
										<tbody>
											@for (input of library().api.inputs; track input.name) {
												<tr>
													<td class="library-page__api-cell-name">
														<code>{{ input.name }}</code>
														@if (input.required) {
															<span class="library-page__api-badge">{{
																'UI.LIBRARY.PAGE.REQUIRED' | translate
															}}</span>
														}
													</td>
													<td>
														<code class="library-page__api-type">{{ input.type }}</code>
													</td>
													<td>
														@if (input.defaultValue) {
															<code>{{ input.defaultValue }}</code>
														} @else {
															<span class="library-page__api-empty">—</span>
														}
													</td>
													<td>{{ translateText(input.description) }}</td>
												</tr>
											}
										</tbody>
									</table>
								</div>
							} @else {
								<p class="library-page__text">{{ 'UI.LIBRARY.PAGE.NO_INPUTS' | translate }}</p>
							}
						</div>

						<div class="library-page__api-group">
							<h3 class="library-page__api-group-title">{{ 'UI.LIBRARY.PAGE.OUTPUTS' | translate }}</h3>
							@if (library().api.outputs.length > 0) {
								<p class="library-page__api-lede">{{ apiNarrative().outputs }}</p>
								<div class="library-page__table-wrap">
									<table class="library-page__api-table">
										<thead>
											<tr>
												<th>{{ 'UI.LIBRARY.PAGE.NAME' | translate }}</th>
												<th>{{ 'UI.LIBRARY.PAGE.TYPE' | translate }}</th>
												<th>{{ 'UI.LIBRARY.PAGE.DESCRIPTION_COLUMN' | translate }}</th>
											</tr>
										</thead>
										<tbody>
											@for (output of library().api.outputs; track output.name) {
												<tr>
													<td class="library-page__api-cell-name">
														<code>{{ output.name }}</code>
													</td>
													<td>
														<code class="library-page__api-type">{{ output.type }}</code>
													</td>
													<td>{{ translateText(output.description) }}</td>
												</tr>
											}
										</tbody>
									</table>
								</div>
							} @else {
								<p class="library-page__text">{{ 'UI.LIBRARY.PAGE.NO_OUTPUTS' | translate }}</p>
							}
						</div>

						@if (library().api.methods?.length) {
							<div class="library-page__api-group">
								<h3 class="library-page__api-group-title">{{ 'UI.LIBRARY.API.METHODS_TITLE' | translate }}</h3>
								<p class="library-page__api-lede">{{ apiNarrative().methods }}</p>
								<div class="library-page__table-wrap">
									<table class="library-page__api-table">
										<thead>
											<tr>
												<th>{{ 'UI.LIBRARY.PAGE.NAME' | translate }}</th>
												<th>{{ 'UI.LIBRARY.PAGE.SIGNATURE' | translate }}</th>
												<th>{{ 'UI.LIBRARY.PAGE.RETURNS' | translate }}</th>
												<th>{{ 'UI.LIBRARY.PAGE.DESCRIPTION_COLUMN' | translate }}</th>
											</tr>
										</thead>
										<tbody>
											@for (method of library().api.methods; track method.name) {
												<tr>
													<td class="library-page__api-cell-name">
														<code>{{ method.name }}</code>
													</td>
													<td>
														<code class="library-page__api-type">{{ method.signature }}</code>
													</td>
													<td>
														@if (method.returns) {
															<code class="library-page__api-type">{{ method.returns }}</code>
														} @else {
															<span class="library-page__api-empty">—</span>
														}
													</td>
													<td>{{ translateText(method.description) }}</td>
												</tr>
											}
										</tbody>
									</table>
								</div>
							</div>
						}

						<div class="library-page__api-group">
							<h3 class="library-page__api-group-title">{{ 'UI.LIBRARY.PAGE.TEMPLATES' | translate }}</h3>
							@if (library().api.templates.length > 0) {
								<p class="library-page__api-lede">{{ apiNarrative().templates }}</p>
								<div class="library-page__table-wrap">
									<table class="library-page__api-table">
										<thead>
											<tr>
												<th>{{ 'UI.LIBRARY.PAGE.NAME' | translate }}</th>
												<th>{{ 'UI.LIBRARY.PAGE.DESCRIPTION_COLUMN' | translate }}</th>
												<th>{{ 'UI.LIBRARY.PAGE.EXAMPLE' | translate }}</th>
											</tr>
										</thead>
										<tbody>
											@for (template of library().api.templates; track template.name) {
												<tr>
													<td class="library-page__api-cell-name">
														<code>{{ translateText(template.name) }}</code>
													</td>
													<td>{{ translateText(template.description) }}</td>
													<td>
														<code class="library-page__api-inline-code">{{
															template.example
														}}</code>
													</td>
												</tr>
											}
										</tbody>
									</table>
								</div>
							} @else {
								<p class="library-page__text">{{ 'UI.LIBRARY.PAGE.NO_TEMPLATES' | translate }}</p>
							}
						</div>
					</section>
				}

				<!-- Styles Tab -->
				@if (activeTab() === 'styles') {
					<section class="library-page__section library-page__section--styles">
						<h2 class="library-page__section-title">{{ 'UI.LIBRARY.TABS.STYLES' | translate }}</h2>

						@if (library().mixins; as mixins) {
							<div class="library-page__api-group">
								<h3 class="library-page__api-group-title">{{ 'UI.LIBRARY.PAGE.MIXINS' | translate }}</h3>
								<p class="library-page__api-lede">{{ translateText(mixins.intro) }}</p>
								<pre class="library-page__code"><code [highlight]="mixins.use" language="scss"></code></pre>

								@for (demo of mixins.demos; track demo.title) {
									<div class="library-page__example">
										<h5 class="library-page__example-title">{{ translateText(demo.title) }}</h5>
										<div class="library-page__example-demo">
											<ng-container *ngComponentOutlet="demo.previewComponent"></ng-container>
										</div>
										<pre
											class="library-page__code"
										><code [highlight]="demo.code" language="scss"></code></pre>
									</div>
								}

								@if (!mixins.demos?.length) {
									@for (group of mixins.catalog; track group.group) {
										@for (m of group.mixins; track m.name) {
											@if (m.example) {
												<div class="library-page__example">
													<h5 class="library-page__example-title">
														<code>{{ m.name }}()</code>
													</h5>
													<pre
														class="library-page__code"
													><code [highlight]="m.example" language="scss"></code></pre>
												</div>
											}
										}
									}
								}

								<div class="library-page__table-wrap">
									<table class="library-page__api-table">
										<thead>
											<tr>
												<th>{{ 'UI.LIBRARY.PAGE.MIXIN' | translate }}</th>
												<th>{{ 'UI.LIBRARY.PAGE.PARAMETERS' | translate }}</th>
												<th>{{ 'UI.LIBRARY.PAGE.DESCRIPTION_COLUMN' | translate }}</th>
											</tr>
										</thead>
										<tbody>
											@for (group of mixins.catalog; track group.group) {
												<tr>
													<td colspan="3" class="fw-semibold">{{ translateText(group.group) }}</td>
												</tr>
												@for (m of group.mixins; track m.name) {
													<tr>
														<td class="library-page__api-cell-name">
															<code>{{ m.name }}()</code>
														</td>
														<td>
															@if (m.paramTokens?.length) {
																@for (pt of m.paramTokens; track pt.param) {
																	<div class="library-page__mixin-param">
																		<code class="library-page__api-inline-code">{{
																			pt.param
																		}}</code>
																		<span
																			class="library-page__mixin-param-arrow"
																			aria-hidden="true"
																			>→</span
																		>
																		@for (token of pt.tokens; track token) {
																			<code class="library-page__css-variable-example">{{
																				token
																			}}</code>
																		}
																	</div>
																}
															} @else {
																<code class="library-page__api-inline-code">{{
																	m.params
																}}</code>
															}
														</td>
														<td>{{ translateText(m.description) }}</td>
													</tr>
												}
											}
										</tbody>
									</table>
								</div>
							</div>
						}

						<div class="library-page__api-group">
							<h3 class="library-page__api-group-title">{{ 'UI.LIBRARY.PAGE.CSS_VARIABLES' | translate }}</h3>
							@if (library().api.cssVariables.length > 0) {
								<p class="library-page__api-lede">{{ apiNarrative().cssVariables }}</p>
								@for (group of library().api.cssVariables; track group.title) {
									<div class="library-page__css-variable-group">
										<h4 class="library-page__css-variable-group-title">{{ translateText(group.title) }}</h4>
										<p class="library-page__css-variable-group-description">
											{{ translateText(group.description) }}
										</p>

										<div class="library-page__table-wrap">
											<table class="library-page__api-table">
												<thead>
													<tr>
														<th>{{ 'UI.LIBRARY.PAGE.VARIABLE' | translate }}</th>
														<th>{{ 'UI.LIBRARY.PAGE.DEFAULT' | translate }}</th>
														<th>{{ 'UI.LIBRARY.PAGE.TYPE' | translate }}</th>
														<th>{{ 'UI.LIBRARY.PAGE.DESCRIPTION_COLUMN' | translate }}</th>
													</tr>
												</thead>
												<tbody>
													@for (variable of group.variables; track variable.name) {
														<tr>
															<td class="library-page__api-cell-name">
																<code>{{ variable.name }}</code>
															</td>
															<td>
																<code>{{ variable.defaultValue }}</code>
															</td>
															<td>{{ variable.type }}</td>
															<td>
																{{ translateText(variable.description) }}
																@if (variable.examples && variable.examples.length > 0) {
																	<span class="library-page__api-examples">
																		@for (example of variable.examples; track example) {
																			<code class="library-page__css-variable-example">{{
																				example
																			}}</code>
																		}
																	</span>
																}
															</td>
														</tr>
													}
												</tbody>
											</table>
										</div>
									</div>
								}
							} @else {
								<p class="library-page__text">{{ 'UI.LIBRARY.PAGE.NO_CSS_VARIABLES' | translate }}</p>
							}
						</div>

						@if (library().styling.length > 0) {
							<div class="library-page__api-group">
								<h3 class="library-page__api-group-title">{{ 'UI.LIBRARY.PAGE.STYLING_GUIDE' | translate }}</h3>
								@for (styleCategory of library().styling; track styleCategory.title) {
									<div class="library-page__feature">
										<h3 class="library-page__feature-title">{{ translateText(styleCategory.title) }}</h3>
										<p class="library-page__feature-description">
											{{ translateText(styleCategory.description) }}
										</p>
										@if (styleCategory.examples.length > 0) {
											<h4 class="library-page__feature-examples-title">
												{{ 'UI.LIBRARY.PAGE.EXAMPLES' | translate }}:
											</h4>
											@for (example of styleCategory.examples; track example.title) {
												<div class="library-page__example">
													<h5 class="library-page__example-title">
														{{ translateText(example.title) }}
													</h5>
													<p class="library-page__example-description">
														{{ translateText(example.description) }}
													</p>

													<!-- Live styling preview -->
													<div class="library-page__example-demo">
														@if (example.previewComponent) {
															<ng-container
																*ngComponentOutlet="example.previewComponent"
															></ng-container>
														} @else {
															<p class="library-page__text">
																{{ 'UI.LIBRARY.PAGE.LIVE_PREVIEW_UNAVAILABLE' | translate }}
															</p>
														}
													</div>

													<!-- Code Section -->
													<h6 class="library-page__code-title">
														{{ 'UI.LIBRARY.PAGE.CODE' | translate }}
													</h6>

													@if (example.import) {
														<h6 class="library-page__code-subtitle">
															{{ 'UI.LIBRARY.PAGE.IMPORT' | translate }}:
														</h6>
														<pre
															class="library-page__code"
														><code [highlight]="example.import" language="typescript"></code></pre>
													}
													@if (example.template) {
														<h6 class="library-page__code-subtitle">
															{{ 'UI.LIBRARY.PAGE.TEMPLATE' | translate }}:
														</h6>
														<pre
															class="library-page__code"
														><code [highlight]="example.template" language="xml"></code></pre>
													}
													@if (example.component) {
														<h6 class="library-page__code-subtitle">
															{{ 'UI.LIBRARY.PAGE.COMPONENT' | translate }}:
														</h6>
														<pre
															class="library-page__code"
														><code [highlight]="example.component" language="typescript"></code></pre>
													}
												</div>
											}
										}
									</div>
								}
							</div>
						}
					</section>
				}

				<!-- Examples Tab -->
				@if (activeTab() === 'examples') {
					<section
						class="library-page__section library-page__section--examples"
						#examplesSpy="hubNavScrollSpy"
						[hubNavScrollSpy]="enableScrollSpy()"
						[offset]="scrollSpyOffset()"
						(activeSectionChange)="onSpyActiveSectionChange($event)"
					>
						<h2 class="library-page__section-title">{{ 'UI.LIBRARY.PAGE.INTERACTIVE_EXAMPLES' | translate }}</h2>
						<p class="library-page__text">{{ 'UI.LIBRARY.PAGE.INTERACTIVE_EXAMPLES_INTRO' | translate }}</p>

						@if (groupedExamples().length > 0) {
							@for (group of groupedExamples(); track group.title) {
								@if (group.title) {
									<h3 class="library-page__example-group-title">{{ group.title | translate }}</h3>
									@if (group.description) {
										<p class="library-page__example-group-description">
											{{ group.description | translate }}
										</p>
									}
								}
								@for (example of group.examples; track example.id) {
									<div
										[id]="example.id"
										[hubNavScrollSpySection]="example.id"
										class="library-page__example-container mb-5"
									>
										<example-viewer [example]="example.id" [view]="'demo'"></example-viewer>
									</div>
								}
							}
						} @else if (registeredExamples().length > 0) {
							@for (example of registeredExamples(); track example.id) {
								<div
									[id]="example.id"
									[hubNavScrollSpySection]="example.id"
									class="library-page__example-container mb-5"
								>
									<example-viewer [example]="example.id" [view]="'demo'"></example-viewer>
								</div>
							}
						} @else {
							<p class="library-page__text">{{ 'UI.LIBRARY.PAGE.INTERACTIVE_EXAMPLES_EMPTY' | translate }}</p>
						}
					</section>
				}

				<!-- Playground Tab -->
				@if (activeTab() === 'playground') {
					<section class="library-page__section library-page__section--playground">
						<h2 class="library-page__section-title">{{ 'UI.LIBRARY.PAGE.PLAYGROUND_TITLE' | translate }}</h2>
						<p class="library-page__text">{{ 'UI.LIBRARY.PAGE.PLAYGROUND_INTRO' | translate }}</p>

						@if (hasPlayground()) {
							<hub-playground [configs]="playground()!" />
						} @else {
							<p class="library-page__text">{{ 'UI.LIBRARY.PAGE.PLAYGROUND_EMPTY' | translate }}</p>
						}
					</section>
				}

				<ng-content></ng-content>
			</main>
		</div>
	`
})
export class LibraryPageComponent implements OnInit, OnDestroy {
	private readonly _exampleRegistry = inject(ExampleRegistry);
	protected readonly _router = inject(Router);
	protected readonly _route = inject(ActivatedRoute);
	private readonly _document = inject(DOCUMENT);
	protected readonly i18n = inject(AppI18nService);

	/** Reference to the examples scroll spy directive instance (when rendered). */
	readonly examplesSpy = viewChild<HubNavScrollSpyDirective>('examplesSpy');

	/**
	 * Input property for the library data to display
	 */
	readonly library = input.required<Library>();

	/**
	 * Input property for filtering examples by package
	 * Can be a single package name or an array of package names
	 */
	readonly package = input<string | string[]>();

	/**
	 * Optional interactive playground configurations. When provided, a "Playground"
	 * tab is exposed where users can edit every input and preview the component live.
	 * Reusable across libraries — each page supplies its own component configs.
	 */
	readonly playground = input<PlaygroundConfig[]>();

	/** Whether the library exposes at least one playground configuration. */
	readonly hasPlayground = computed(() => (this.playground()?.length ?? 0) > 0);

	/**
	 * Overrides the quick-start command.
	 *
	 * `npm install <package>` is the right answer for a library you import. It is the wrong
	 * one for the package that IS the installer, where the command that does anything is
	 * `ng add` — and where `npm install` would add a schematic to the runtime dependencies
	 * and change nothing else.
	 */
	readonly install = input<string>();

	/**
	 * Whether there is an API reference worth linking to from the quick-start card.
	 *
	 * A command-line package has no inputs, outputs, template slots or custom properties, so
	 * the link would land the reader on four empty headings.
	 */
	readonly hasApiReference = computed(() => {
		const api = this.library().api;
		return (
			api.inputs.length > 0 ||
			api.outputs.length > 0 ||
			api.templates.length > 0 ||
			(api.methods?.length ?? 0) > 0 ||
			api.cssVariables.length > 0
		);
	});

	/**
	 * Friendly, dynamic narrative for the API tab. Builds an introduction and a short
	 * lead-in for each section using the library's short name and the live counts of
	 * inputs, outputs, template slots and CSS variables. Localized for EN / ES.
	 */
	readonly apiNarrative = computed(() => {
		const name = this.getLibraryShortName();
		const api = this.library().api;
		const cssVars = api.cssVariables.reduce((total, group) => total + group.variables.length, 0);

		return {
			intro: this.i18n.translate('UI.LIBRARY.PAGE.API_INTRO', { name }),
			inputs: this.i18n.translate('UI.LIBRARY.PAGE.API_INPUTS_LEDE', { name, count: api.inputs.length }),
			outputs: this.i18n.translate('UI.LIBRARY.PAGE.API_OUTPUTS_LEDE', { name, count: api.outputs.length }),
			methods: this.i18n.translate('UI.LIBRARY.PAGE.API_METHODS_LEDE', { name, count: api.methods?.length ?? 0 }),
			templates: this.i18n.translate('UI.LIBRARY.PAGE.API_TEMPLATES_LEDE', { name, count: api.templates.length }),
			cssVariables: this.i18n.translate('UI.LIBRARY.PAGE.API_CSS_VARS_LEDE', { name, count: cssVars })
		};
	});

	/**
	 * ISO date of the library's latest changelog entry, resolved from the
	 * generated `LIBRARY_LAST_MODIFIED` map using the active library route.
	 */
	readonly lastUpdatedIso = computed(() => {
		const routeKey = this.resolveLibraryRouteKey();
		return routeKey ? (LIBRARY_LAST_MODIFIED[routeKey] ?? null) : null;
	});

	/**
	 * Human-readable "last updated" date, formatted with the active UI locale.
	 * Formatting is pinned to UTC so server and client render the same string.
	 */
	readonly lastUpdatedLabel = computed(() => {
		const iso = this.lastUpdatedIso();
		if (!iso) {
			return null;
		}

		const date = new Date(iso);
		if (Number.isNaN(date.getTime())) {
			return null;
		}

		return new Intl.DateTimeFormat(this.i18n.lang(), {
			dateStyle: 'medium',
			timeZone: 'UTC'
		}).format(date);
	});

	/**
	 * Controls whether the internal tab navigation is rendered.
	 * Defaults to `true` because tab navigation is handled by the sidebar shell.
	 * Set to `false` to restore the built-in tab bar.
	 */
	readonly hideTabs = input<boolean>(true);

	/**
	 * Headings for the Examples tab: each group names a run of examples by id.
	 *
	 * Handed in rather than read off `library.functionalities`, even though most libraries can
	 * pass exactly that. The two answer different questions — a feature block is prose for the
	 * Overview tab, a group is an ordering for the panel — and a library is free to want the
	 * second without inventing the first. Absent, the examples render as one flat run.
	 */
	readonly exampleGroups = input<ReadonlyArray<{ title: string; description?: string; exampleIds: string[] }>>();

	/**
	 * The examples of this library arranged under their feature headings, in the order the
	 * feature groups declare — which is what makes the headings worth having: the groups become
	 * the single source of order, rather than a second one drifting against the registry's.
	 *
	 * Anything registered but not named by a group lands in a trailing untitled section, so
	 * turning grouping on can never make an example disappear from the page.
	 *
	 * Empty when grouping is off or the library declares no groups; the flat list renders then.
	 */
	readonly groupedExamples = computed<{ title: string; description: string; examples: { id: string }[] }[]>(() => {
		const declared = this.exampleGroups();

		if (!declared?.length) {
			return [];
		}

		const available = this.registeredExamples();
		const byId = new Map(available.map((example) => [example.id, example]));
		const groups: { title: string; description: string; examples: { id: string }[] }[] = [];
		const claimed = new Set<string>();

		for (const group of declared) {
			const examples = group.exampleIds
				.map((id) => byId.get(id))
				.filter((example): example is NonNullable<typeof example> => !!example);

			examples.forEach((example) => claimed.add(example.id));

			if (examples.length > 0) {
				groups.push({ title: group.title, description: group.description ?? '', examples });
			}
		}

		if (groups.length === 0) {
			return [];
		}

		const leftovers = available.filter((example) => !claimed.has(example.id));

		return leftovers.length > 0 ? [...groups, { title: '', description: '', examples: leftovers }] : groups;
	});

	/**
	 * Enables scroll spy synchronization for the examples section.
	 * When enabled, the URL fragment is updated while scrolling examples.
	 */
	readonly enableScrollSpy = input<boolean>(true);

	/**
	 * Vertical offset used to determine the active example section.
	 * This compensates sticky headers in the page layout.
	 */
	readonly scrollSpyOffset = input<number>(120);

	/**
	 * Signal to track the currently active tab
	 */
	activeTab = signal<LibraryTabSeoId>('overview');

	/** Route param subscription. */
	private _routeParamSub?: Subscription;

	/** Route fragment subscription. */
	private _routeFragmentSub?: Subscription;

	/** Guard to avoid cyclic route updates while syncing URL fragment from observer. */
	private _isSyncingFragment = false;

	/**
	 * Signal that returns registered examples filtered by package (reactive)
	 */
	readonly registeredExamples = computed(() => {
		const examples = this._exampleRegistry.examples();
		const pkg = this.package();

		if (!pkg) {
			return examples;
		}

		const packages = Array.isArray(pkg) ? pkg : [pkg];
		return examples.filter((ex) => packages.includes(ex.packagePath));
	});

	/**
	 * SEO metadata for the current library page, inferred from the active route.
	 */
	readonly currentLibrarySeoEntry = computed(() => {
		const routeKey = this.resolveLibraryRouteKey();
		return getLibrarySeoDefinition(routeKey);
	});

	/**
	 * Builds the `SEO.LIBRARY.<KEY>` translation prefix for the active library.
	 *
	 * Hyphens fold into underscores: a route id like `action-sheet` has to reach
	 * `SEO.LIBRARY.ACTION_SHEET`, the shape every key in the translation files uses.
	 *
	 * @param entry Active SEO definition.
	 * @returns Uppercase SEO key prefix.
	 */
	private seoKeyPrefix(entry: NonNullable<ReturnType<typeof getLibrarySeoDefinition>>): string {
		return `SEO.LIBRARY.${entry.key.toUpperCase().replace(/-/g, '_')}`;
	}

	/**
	 * Marketing-friendly heading shown in the hero area.
	 */
	readonly heroTitle = computed(() => {
		this.i18n.lang();
		const entry = this.currentLibrarySeoEntry();
		return entry ? this.i18n.translate(`${this.seoKeyPrefix(entry)}.HEADLINE`) : this.library().title;
	});

	/**
	 * SEO description shown below the hero title.
	 */
	readonly localizedDescription = computed(() => {
		this.i18n.lang();
		const entry = this.currentLibrarySeoEntry();
		return entry ? this.i18n.translate(`${this.seoKeyPrefix(entry)}.DESCRIPTION`) : this.library().description;
	});

	/**
	 * Question-and-answer pairs for the overview tab, read from the indexed
	 * `SEO.LIBRARY.<KEY>.FAQ.<n>` keys.
	 *
	 * A library opts in simply by declaring the keys — none are required, and the
	 * loop stops at the first missing index, which `translate` reports by echoing
	 * the key back. Written as questions because that is the shape AI systems
	 * match against a user's prompt; the same copy also feeds the FAQPage
	 * structured data emitted by SeoService.
	 */
	readonly faqEntries = computed(() => {
		this.i18n.lang();
		const entry = this.currentLibrarySeoEntry();
		if (!entry) {
			return [];
		}

		const lang = this.i18n.lang();
		const prefix = `${this.seoKeyPrefix(entry)}.FAQ`;
		const entries: { question: string; answer: string }[] = [];

		// `hasIn`, not `translate`: the English fallback would put English questions
		// under a translated heading while the copy is still being rolled out.
		for (let index = 0; this.i18n.hasIn(lang, `${prefix}.${index}.Q`); index++) {
			entries.push({
				question: this.i18n.translate(`${prefix}.${index}.Q`),
				answer: this.i18n.translate(`${prefix}.${index}.A`)
			});
		}

		return entries;
	});

	/**
	 * Localized intro paragraph used in the overview tab.
	 */
	readonly localizedIntro = computed(() => {
		this.i18n.lang();
		const entry = this.currentLibrarySeoEntry();
		return entry ? this.i18n.translate(`${this.seoKeyPrefix(entry)}.INTRO`) : this.library().description;
	});

	/**
	 * Localized long-form overview paragraph.
	 */
	readonly localizedOverviewText = computed(() => {
		this.i18n.lang();
		const entry = this.currentLibrarySeoEntry();
		return entry ? this.i18n.translate(`${this.seoKeyPrefix(entry)}.OVERVIEW`) : this.library().overview.text;
	});

	/**
	 * Localized overview highlight cards (icons stay structural in seo.config).
	 */
	readonly localizedHighlights = computed(() => {
		this.i18n.lang();
		const entry = this.currentLibrarySeoEntry();
		if (!entry) {
			return this.library().overview.highlights ?? [];
		}

		const prefix = this.seoKeyPrefix(entry);
		return entry.localizedHighlights.map((highlight, index) => ({
			icon: highlight.icon,
			title: this.i18n.translate(`${prefix}.HIGHLIGHT.${index}.TITLE`),
			description: this.i18n.translate(`${prefix}.HIGHLIGHT.${index}.DESCRIPTION`)
		}));
	});

	/**
	 * Localized use-case pills, read positionally until a missing key is hit.
	 */
	readonly localizedUseCases = computed(() => {
		this.i18n.lang();
		const entry = this.currentLibrarySeoEntry();
		if (!entry) {
			return [];
		}

		const prefix = this.seoKeyPrefix(entry);
		const useCases: string[] = [];
		for (let index = 0; ; index++) {
			const key = `${prefix}.USE_CASE.${index}`;
			const value = this.i18n.translate(key);
			if (value === key) {
				break;
			}
			useCases.push(value);
		}
		return useCases;
	});

	/**
	 * Related library links surfaced from the SEO configuration.
	 */
	readonly relatedLibraries = computed(() => {
		const current = this.currentLibrarySeoEntry();
		if (!current) {
			return [];
		}

		return current.related
			.map((relatedKey) => getLibrarySeoDefinition(relatedKey))
			.filter((entry) => entry !== null)
			.map((entry) => ({
				route: entry!.route,
				label: entry!.packageName
			}));
	});

	ngOnInit(): void {
		this.validateInput();

		// Subscribe to the active child path to keep the tab state in sync with routing.
		this._routeParamSub = this._route.url.subscribe((segments) => {
			const tab = segments[0]?.path;
			if (tab && (LIBRARY_TABS as readonly string[]).includes(tab)) {
				this.activeTab.set(tab as LibraryTabSeoId);
				if (tab === 'examples') {
					const fragment = this._route.snapshot.fragment;
					if (fragment) {
						this.scheduleScrollToExample(fragment, 'auto');
					}
				}
			}
		});

		// Track fragment changes to support direct anchor navigation and back/forward.
		this._routeFragmentSub = this._route.fragment.subscribe((fragment) => {
			if (this.activeTab() !== 'examples' || !fragment) {
				return;
			}

			// Ignore fragment events generated by the scroll-spy URL sync itself.
			if (this._isSyncingFragment) {
				return;
			}

			this.scheduleScrollToExample(fragment, 'smooth');
		});
	}

	ngOnDestroy(): void {
		this._routeParamSub?.unsubscribe();
		this._routeFragmentSub?.unsubscribe();
	}

	/**
	 * Validates that required inputs are provided
	 */
	private validateInput(): void {
		if (!this.library()) {
			throw new Error('LibraryPageComponent requires a library input');
		}
	}

	/**
	 * Sets the active tab by navigating to the corresponding route
	 * @param tab - The tab to activate
	 */
	setActiveTab(tab: LibraryTabSeoId): void {
		this.activeTab.set(tab); // Optimistic update
		this._router.navigate(['./', tab], { relativeTo: this._route.parent || this._route });
	}

	/**
	 * Gets a short name for the library by removing common prefixes
	 * @returns Shortened library name
	 */
	getLibraryShortName(): string {
		return this.library()
			.title.replace(/^ng-hub-ui-/, '')
			.replace(/^ng-/, '')
			.replace(/^hub-/, '');
	}

	/**
	 * Returns the install command for the current library package.
	 *
	 * @returns npm install command string.
	 */
	installCommand(): string {
		return this.install() ?? `npm install ${this.library().title}`;
	}

	/**
	 * Translates library-owned documentation copy using the current UI language.
	 *
	 * @param text Source text authored in the page-level library data.
	 * @returns Localized string when available.
	 */
	translateText(text: string): string {
		if (text && SEMANTIC_KEY_RE.test(text)) {
			return this.i18n.translate(text);
		}
		return text ?? '';
	}

	/**
	 * Builds a stable anchor id for an overview feature section.
	 *
	 * @param title Feature title authored in the library metadata.
	 * @returns DOM-friendly anchor id.
	 */
	overviewFeatureSectionId(title: string): string {
		return `overview-feature-${this.slugify(this.translateText(title))}`;
	}

	/**
	 * Returns whether a highlight card can deep-link to a documented overview feature.
	 *
	 * @param title Highlight title, already localized for the current UI language.
	 * @returns True when a matching feature section exists.
	 */
	hasOverviewFeature(title: string): boolean {
		return this.resolveOverviewFeatureSectionId(title) !== null;
	}

	/**
	 * Scrolls to the matching overview feature and synchronizes the route fragment.
	 *
	 * @param title Localized highlight title clicked by the user.
	 */
	scrollToOverviewFeature(title: string): void {
		const targetId = this.resolveOverviewFeatureSectionId(title);
		if (!targetId) {
			return;
		}

		const target = this._document.getElementById(targetId);
		target?.scrollIntoView({
			behavior: 'smooth',
			block: 'start',
			inline: 'nearest'
		});

		void this._router.navigate([], {
			relativeTo: this._route,
			fragment: targetId,
			queryParamsHandling: 'preserve',
			replaceUrl: true
		});
	}

	/**
	 * Handles active section changes emitted by the nav scroll spy directive.
	 *
	 * @param sectionId Active example section id.
	 */
	onSpyActiveSectionChange(sectionId: string): void {
		this.syncFragmentWithActiveSection(sectionId);
	}

	/**
	 * Updates the route fragment without pushing a new history entry.
	 *
	 * @param sectionId Active example section id.
	 */
	private syncFragmentWithActiveSection(sectionId: string): void {
		if (this._isSyncingFragment) {
			return;
		}

		// Avoid redundant router updates while staying in the same section.
		if (this._route.snapshot.fragment === sectionId) {
			return;
		}

		this._isSyncingFragment = true;
		void this._router
			.navigate([], {
				relativeTo: this._route,
				fragment: sectionId,
				queryParamsHandling: 'preserve',
				replaceUrl: true
			})
			.finally(() => {
				this._isSyncingFragment = false;
			});
	}

	/**
	 * Schedules scrolling to a concrete example section once it exists in the DOM.
	 *
	 * @param id Example section id.
	 * @param behavior Native scroll behavior.
	 */
	private scheduleScrollToExample(id: string, behavior: ScrollBehavior): void {
		this._document.defaultView?.requestAnimationFrame(() => {
			const didScroll = this.examplesSpy()?.scrollTo(id, behavior) ?? false;
			if (didScroll) {
				return;
			}

			// Fallback for the first render frame before the directive is instantiated.
			const target = this._document.getElementById(id);
			target?.scrollIntoView({
				behavior,
				block: 'start',
				inline: 'nearest'
			});
		});
	}

	/**
	 * Resolves the matching overview feature anchor id from a localized highlight title.
	 *
	 * @param localizedTitle Current-language highlight title.
	 * @returns Matching feature anchor id, when documented.
	 */
	private resolveOverviewFeatureSectionId(localizedTitle: string): string | null {
		const feature = this.library().functionalities.find((item) => this.translateText(item.title) === localizedTitle);
		return feature ? this.overviewFeatureSectionId(feature.title) : null;
	}

	/**
	 * Produces a compact slug suitable for DOM ids and URL fragments.
	 *
	 * @param value Source string.
	 * @returns Slugified identifier.
	 */
	private slugify(value: string): string {
		return value
			.toLowerCase()
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-+|-+$/g, '');
	}

	/**
	 * Resolves the current library route key from the parent route definition.
	 *
	 * @returns Library route id when available.
	 */
	private resolveLibraryRouteKey(): LibrarySeoKey | null {
		const routeKey = this._route.parent?.routeConfig?.path ?? null;
		return routeKey as LibrarySeoKey | null;
	}
}
