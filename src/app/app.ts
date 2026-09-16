import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { AnalyticsConsentComponent } from './components/analytics-consent/analytics-consent.component';
import { AppShellComponent } from './components/app-shell/app-shell.component';
import { AnalyticsService } from './services/analytics.service';
import { SeoService } from './services/seo.service';

@Component({
	selector: 'app-root',
	imports: [AppShellComponent, AnalyticsConsentComponent],
	template: '<app-shell></app-shell><app-analytics-consent></app-analytics-consent>',
	changeDetection: ChangeDetectionStrategy.Eager,
	styleUrl: './app.scss'
})
export class App {
	/** Root-level SEO initializer kept alive for the lifetime of the application shell. */
	private readonly _seoService = inject(SeoService);

	/** Root-level analytics initializer kept alive for the lifetime of the application shell. */
	private readonly _analyticsService = inject(AnalyticsService);
}
