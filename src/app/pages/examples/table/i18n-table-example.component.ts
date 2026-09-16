import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import {
	anLocale,
	arLocale,
	astLocale,
	caLocale,
	deLocale,
	enLocale,
	esLocale,
	euLocale,
	glLocale,
	PaginableTableHeader,
	ruLocale,
	HubTableComponent,
	zhLocale
} from 'ng-hub-ui-paginable';
import { HubTranslationService } from 'ng-hub-ui-utils';

/**
 * Internationalization example that switches the table labels between the built-in paginable dictionaries.
 */
@Component({
	selector: 'app-i18n-table-example',
	standalone: true,
	imports: [HubTableComponent],
	// Example-scoped service: the demo switches languages at runtime and must
	// never mutate the app-wide dictionary (it used to flip the whole docs page
	// to English and broke SSR with NG0100).
	providers: [HubTranslationService],
	template: `
		<div class="language-selector mb-3">
			<label class="form-label fw-bold" for="table-language">Select language:</label>
			<select
				id="table-language"
				class="form-select"
				style="max-width: 320px"
				[value]="currentLang()"
				(change)="setLanguage($any($event.target).value)"
			>
				@for (language of languages; track language.lang) {
					<option [value]="language.lang">{{ language.label }}</option>
				}
			</select>
		</div>

		<hub-table [data]="users" [headers]="headers" [totalItems]="users.length" [page]="1" [searchable]="true"></hub-table>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: `
		.language-selector {
			display: grid;
			gap: 0.5rem;
			max-width: 320px;
			padding: 1rem;
			background: var(--hub-sys-surface-elevated, #f8f9fa);
			border-radius: 0.5rem;
		}
	`
})
export class I18nTableExampleComponent {
	private readonly translate = inject(HubTranslationService);

	/** Snapshot of the app-level dictionary the demo languages are layered on top of. */
	private readonly appTranslations = inject(HubTranslationService, { skipSelf: true }).translations;

	/** Available dictionaries exposed by the paginable library. */
	readonly languages = [
		{ lang: enLocale.lang, label: 'English' },
		{ lang: esLocale.lang, label: 'Castellano' },
		{ lang: caLocale.lang, label: 'Català' },
		{ lang: euLocale.lang, label: 'Euskara' },
		{ lang: glLocale.lang, label: 'Galego' },
		{ lang: astLocale.lang, label: 'Astur-leonés' },
		{ lang: anLocale.lang, label: 'Aragonés' },
		{ lang: deLocale.lang, label: 'Deutsch' },
		{ lang: zhLocale.lang, label: '中文' },
		{ lang: arLocale.lang, label: 'العربية' },
		{ lang: ruLocale.lang, label: 'Русский' }
	] as const;

	/** Current language code selected in the demo. */
	currentLang = signal<(typeof this.languages)[number]['lang']>('en');

	/** Sample data rendered by the table. */
	users = [
		{ id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
		{ id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Editor' },
		{ id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User' },
		{ id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Moderator' },
		{ id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'Admin' },
		{ id: 6, name: 'Diana Martinez', email: 'diana@example.com', role: 'Editor' },
		{ id: 7, name: 'Edward Taylor', email: 'edward@example.com', role: 'User' },
		{ id: 8, name: 'Fiona Anderson', email: 'fiona@example.com', role: 'Moderator' },
		{ id: 9, name: 'George Lee', email: 'george@example.com', role: 'Admin' },
		{ id: 10, name: 'Hannah White', email: 'hannah@example.com', role: 'Editor' },
		{ id: 11, name: 'Ivan Clark', email: 'ivan@example.com', role: 'User' },
		{ id: 12, name: 'Julia Scott', email: 'julia@example.com', role: 'Moderator' }
	];

	/** Dictionary map sourced from the library exports. */
	private readonly dictionaries = {
		en: enLocale.data,
		es: esLocale.data,
		ca: caLocale.data,
		eu: euLocale.data,
		gl: glLocale.data,
		ast: astLocale.data,
		an: anLocale.data,
		de: deLocale.data,
		zh: zhLocale.data,
		ar: arLocale.data,
		ru: ruLocale.data
	} as const;

	/** Static table headers — only pagination UI labels are translated. */
	readonly headers: PaginableTableHeader[] = [
		{ property: 'id', title: 'ID' },
		{ property: 'name', title: 'Name' },
		{ property: 'email', title: 'Email' },
		{ property: 'role', title: 'Role' }
	];

	/**
	 * Initializes the component with English as the default table language.
	 */
	constructor() {
		this.setLanguage('en');
	}

	/**
	 * Switches the active dictionary and refreshes the demo state.
	 *
	 * @param lang Target language code.
	 */
	setLanguage(lang: string): void {
		if (!(lang in this.dictionaries)) {
			return;
		}
		const nextLang = lang as keyof typeof this.dictionaries;
		this.currentLang.set(nextLang);
		this.translate.setTranslations({
			...this.appTranslations,
			HUBUI: { PAGINABLE: this.dictionaries[nextLang] ?? this.dictionaries.en }
		});
	}

	/** Template snippet shown in the code panel. */
	static readonly templateCode = `<div class="language-selector">
  <label for="table-language">Select language:</label>
  <select id="table-language" [value]="currentLang()" (change)="setLanguage($any($event.target).value)">
    @for (language of languages; track language.lang) {
      <option [value]="language.lang">{{ language.label }}</option>
    }
  </select>
</div>

<hub-table [data]="users" [headers]="headers" [totalItems]="users.length" [page]="1"></hub-table>`;

	/** Component snippet shown in the code panel. */
	static readonly componentCode = `// Configure once in app.config.ts; do not inject HubTranslationService in a component.
provideHubTranslationAdapter(() => ({
  dictionary: transloco.selectTranslation('HUBUI'),
  namespace: 'HUBUI'
}));`;

	/** Dictionary setup snippet shown in the code panel. */
	static readonly dataCode = `{
  "HUBUI": {
    "PAGINABLE": {
      "SEARCH": "Search",
      "ROWS_PER_PAGE": "Rows per page",
      "NO_RESULTS_FOUND": "No results found"
    }
  }
}`;
}
