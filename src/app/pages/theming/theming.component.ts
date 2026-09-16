import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemingDemoComponent } from '../examples/theming/theming-demo.component';

/**
 * Theming guide page (`/theming`).
 *
 * A narrative guide explaining how to customize the WHOLE ng-hub-ui family at once
 * through the design-system `hub.theme(...)` mixin (runtime CSS-variable maps),
 * compile-time module configuration (breakpoints, extra accents) and per-component
 * loops over the `hub-<lib>-theme` mixins. Includes a live pack-switcher demo.
 *
 * Copy is Spanish, matching the sibling `/design-system` guide page; it can be
 * moved to the i18n system later.
 */
@Component({
	selector: 'app-theming',
	standalone: true,
	imports: [RouterLink, ThemingDemoComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="library-page">
			<header class="library-page__header">
				<div class="library-page__header-content">
					<h1 class="library-page__title">Theming</h1>
					<p class="library-page__description">
						Personaliza <strong>todas las librerías a la vez</strong> desde un único sitio. El design system expone
						el mixin <code>hub.theme(...)</code>, que recibe tus <strong>packs</strong> (colores, spacers, radios,
						tipografía) como <strong>mapas</strong> y los recorre con bucles emitiendo los tokens
						<code>--hub-*</code> que lee toda la familia. Cambia un acento y su familia de rol se recalcula; cambia
						un spacer y todo lo que cuelga se re-deriva.
					</p>
				</div>
			</header>

			<div class="library-page__content">
				<!-- Modelo mental -->
				<section class="library-page__section" id="modelo">
					<h2 class="library-page__section-title">El modelo mental</h2>
					<p class="library-page__text">
						Los componentes nunca traen colores «a fuego»: leen tokens. Hay dos capas —
						<code>--hub-ref-*</code> (primitivas: escala de espaciado, radios, tipografía) y
						<code>--hub-sys-*</code> (semánticas: <code>primary</code>, <code>success</code>, <code>danger</code>…).
						Cada componente cuelga de ellas por la cadena <code>var()</code>. Por eso personalizar el design system
						re-tona el ecosistema entero, sin tocar cada librería.
					</p>
					<ul class="library-page__text">
						<li>
							<strong>Un acento</strong> → toda su familia de rol (<code>-subtle</code> / <code>-emphasis</code> /
							<code>-on</code>) se recalcula en runtime con <code>color-mix</code>.
						</li>
						<li>
							<strong>Un token de referencia</strong> (un paso de espaciado, un radio) → cada alias, utilidad y
							componente que lo usa se re-deriva.
						</li>
						<li>
							<strong>Runtime vs compile-time:</strong> colores/spacers/radios/tipografía son variables CSS
							(runtime, con <code>hub.theme</code>). Los <strong>breakpoints</strong> y qué pasos de utilidad
							existen son compile-time (las media queries no admiten <code>var()</code>).
						</li>
					</ul>
				</section>

				<!-- Runtime: hub.theme con tus packs -->
				<section class="library-page__section" id="runtime">
					<h2 class="library-page__section-title">1 · Tus packs en runtime — <code>hub.theme(...)</code></h2>
					<p class="library-page__text">
						Importa el ds una vez y pásale solo los overrides que quieras como mapas. El mixin hace
						<code>&#64;each</code> por dentro y emite los <code>--hub-*</code> canónicos; lo que no pasas conserva
						el valor base.
					</p>
					<pre class="library-page__code"><code>{{ codeRuntime }}</code></pre>

					<p class="library-page__text">
						El resultado: <strong>un solo pack re-tona todos los componentes a la vez</strong>. Cambia de pack y
						observa cómo botones, badges y la superficie siguen los mismos tokens (colores <em>y</em> radios):
					</p>
					<app-theming-demo></app-theming-demo>
				</section>

				<!-- Compile-time -->
				<section class="library-page__section" id="compile-time">
					<h2 class="library-page__section-title">2 · Compile-time — <code>&#64;use … with (…)</code></h2>
					<p class="library-page__text">
						Lo que no puede ser una variable CSS se configura por el sistema de módulos: los
						<strong>breakpoints</strong> (regeneran las utilidades responsive con
						<code>&#64;each $bp in $hub-breakpoints</code>), acentos extra registrados en compilación, o qué pasos
						existen.
					</p>
					<pre class="library-page__code"><code>{{ codeCompile }}</code></pre>
				</section>

				<!-- Bucle por-componente -->
				<section class="library-page__section" id="bucle">
					<h2 class="library-page__section-title">3 · Tu propio bucle sobre los mixins de cada lib</h2>
					<p class="library-page__text">
						Además del theming global, cada librería expone su mixin <code>hub-&lt;lib&gt;-theme</code>. Recorre tu
						pack con <code>&#64;each</code> para acuñar variantes por-componente en una sola pasada:
					</p>
					<pre class="library-page__code"><code>{{ codeLoop }}</code></pre>
				</section>

				<!-- Multi-tema scoped -->
				<section class="library-page__section" id="temas">
					<h2 class="library-page__section-title">4 · Multi-tema y scoped</h2>
					<p class="library-page__text">
						<code>hub.theme</code> se puede aplicar en <code>:root</code>, en un bloque <code>[data-theme]</code> o
						scopeado a cualquier subárbol; compone con los tokens base y con otros temas.
					</p>
					<pre class="library-page__code"><code>{{ codeScoped }}</code></pre>
				</section>

				<!-- Cierre -->
				<section class="library-page__section" id="mas">
					<h2 class="library-page__section-title">Y por componente</h2>
					<p class="library-page__text">
						Para ajustar una sola librería en un sitio concreto, cada una documenta su mixin y sus variables en su
						pestaña
						<strong>Estilos</strong>. La referencia completa de tokens vive en
						<a [routerLink]="['/tokens']">Tokens</a>, y el paquete base en
						<a [routerLink]="['/design-system']">Design System</a>.
					</p>
				</section>
			</div>
		</div>
	`,
	styles: []
})
export class ThemingComponent {
	/** Runtime theming with a brand pack via `hub.theme(...)`. */
	protected readonly codeRuntime = `@use 'ng-hub-ui-ds' as hub;

// Tu pack de marca
$brand: (
  primary: #0f766e,
  brand:   #14b8a6,
  success: #15803d,
  danger:  #b91c1c
);

:root {
  @include hub.theme(
    $accents: $brand,                          // → --hub-sys-color-*  (familia -subtle/-emphasis/-on por color-mix)
    $space:   (2: 0.375rem, 3: 0.75rem, 4: 1.25rem),  // → --hub-ref-space-*
    $radius:  (md: 0.5rem, lg: 1rem),                 // → --hub-ref-radius-*
    $font-family: (base: 'Inter, system-ui, sans-serif')
  );
}`;

	/** Compile-time module configuration (breakpoints, extra accents). */
	protected readonly codeCompile = `@use 'ng-hub-ui-ds' as hub with (
  $hub-breakpoints:   (sm: 576px, md: 768px, lg: 1200px, xl: 1600px),
  $hub-accents-extra: (brand: #ff6b00)
);`;

	/** Per-component variants by looping the pack over a library mixin. */
	protected readonly codeLoop = `@use 'ng-hub-ui-badges/styles' as badges;

$brand: (teal: #0f766e, sunset: #ff6b00, plum: #7c3aed);

@each $name, $hex in $brand {
  .badge--#{$name} {
    @include badges.hub-badge-theme($accent: $hex);
  }
}`;

	/** Scoped / multi-theme application of hub.theme. */
	protected readonly codeScoped = `@use 'ng-hub-ui-ds' as hub;

[data-theme='compact'] {
  @include hub.theme(
    $space:  (3: 0.5rem, 4: 0.75rem),
    $radius: (md: 0.25rem)
  );
}`;
}
