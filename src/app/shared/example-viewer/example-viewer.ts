/**
 * ExampleViewer - Componente para visualizar ejemplos de código
 * Portado de Angular Material a Bootstrap/FontAwesome/ng-hub-ui-toast
 */

import { Clipboard } from '@angular/cdk/clipboard';
import { NgComponentOutlet } from '@angular/common';
import {
	Component,
	computed,
	ElementRef,
	inject,
	Input,
	model,
	signal,
	Type,
	viewChildren,
	ChangeDetectionStrategy
} from '@angular/core';
import { HubTooltipDirective, TranslatePipe } from 'ng-hub-ui-utils';
import { HubToastService } from 'ng-hub-ui-toast';
import { AppI18nService, SEMANTIC_KEY_RE } from '../../services/app-i18n.service';
import { CodeSnippet } from './code-snippet';
import { ExampleRegistry, LiveExample } from './example-registry';
import { Views } from './example-viewer.model';
import { HubButtonComponent } from 'ng-hub-ui-buttons';

export type { Views } from './example-viewer.model';

/** Orden preferido para archivos de ejemplo en el visor. */
const preferredExampleFileOrder = ['HTML', 'TS', 'CSS'];

/** Snippets que un ejemplo publica como miembros estáticos para las pestañas de código. */
type ExampleSnippets = Partial<Record<'templateCode' | 'componentCode' | 'dataCode' | 'cssCode', string>>;

@Component({
	selector: 'example-viewer',
	standalone: true,
	templateUrl: './example-viewer.html',
	styleUrls: ['./example-viewer.scss'],
	imports: [CodeSnippet, NgComponentOutlet, HubTooltipDirective, TranslatePipe, HubButtonComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	host: {
		'[attr.id]': 'example'
	}
})
export class ExampleViewer {
	private readonly _toast = inject(HubToastService);
	private readonly _clipboard = inject(Clipboard);
	private readonly _elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
	private readonly _exampleRegistry = inject(ExampleRegistry);
	private readonly _i18n = inject(AppI18nService);
	readonly snippet = viewChildren(CodeSnippet);

	/** La pestaña a mostrar al expandir desde vista snippet. */
	readonly selectedTab = signal(0);

	/** Mapa de archivos de ejemplo que deben mostrarse en la pestaña view-source en orden. */
	readonly exampleTabs = signal<Record<string, string>>({});

	/** Datos del ejemplo actualmente seleccionado. */
	readonly exampleData = signal<LiveExample | null>(null);

	/** URL para obtener el snippet de código en vista compact. */
	readonly fileUrl = computed(() => {
		const file = this.file();
		const exampleData = this.exampleData();
		const region = this.region();

		if (!file) {
			return undefined;
		}

		const lastDotIndex = file.lastIndexOf('.');
		const contentBeforeDot = file.substring(0, lastDotIndex);
		const contentAfterDot = file.substring(lastDotIndex + 1);
		let fileName: string;

		if (region) {
			fileName = `${contentBeforeDot}_${region}-${contentAfterDot}.html`;
		} else {
			fileName = `${contentBeforeDot}-${contentAfterDot}.html`;
		}

		return exampleData ? `/docs-content/examples-highlighted/${exampleData.packagePath}/${fileName}` : '';
	});

	/** Tipo de componente para el ejemplo actual. */
	readonly _exampleComponentType = signal<Type<any> | null>(null);

	/** Vista del componente de ejemplo. */
	readonly view = model<Views>();

	/** Si mostrar toggle para vista compacta. */
	readonly showCompactToggle = model(false);

	/** Clave string del ejemplo actualmente mostrado. */
	@Input()
	get example() {
		return this._example;
	}
	set example(exampleName: string | undefined) {
		if (exampleName && exampleName !== this._example) {
			this._example = exampleName;
			this._exampleChanged(exampleName);
		}
	}
	private _example: string | undefined;

	/** Rango de líneas del código fuente a mostrar en vista compacta. */
	readonly region = signal<string | undefined>(undefined);

	/** Nombre del archivo a mostrar en vista compacta. */
	readonly file = model<string | undefined>();

	/** Selecciona la pestaña correcta basándose en el archivo de la vista compacta. */
	selectCorrectTab() {
		const file = this.file();
		const exampleTabNames = this._exampleTabNames();

		if (!file || !exampleTabNames.length) {
			return;
		}

		const extension = file.substring(file.lastIndexOf('.') + 1);

		for (let i = 0; i < exampleTabNames.length; i++) {
			const tabName = exampleTabNames[i];
			if (tabName.toLowerCase() === extension || tabName.endsWith(`.${extension}`)) {
				this.selectedTab.set(i);
				return;
			}
		}

		console.error(`No se encontró pestaña para extensión: "${extension}".`);
	}

	/**
	 * Toggles between the compact snippet view and the full source view,
	 * selecting the correct tab when expanding.
	 */
	toggleCompactView() {
		if (this.view() === 'snippet') {
			this.view.set('full');
			this.selectCorrectTab();
		} else {
			this.view.set('snippet');
		}
	}

	/**
	 * Toggles between the full source view and the rendered demo view.
	 */
	toggleSourceView(): void {
		this.view.set(this.view() === 'full' ? 'demo' : 'full');
	}

	/**
	 * Copies the textual content of the selected code snippet to the clipboard
	 * and surfaces a success or error toast.
	 *
	 * @param snippets Available rendered code snippets.
	 * @param selectedIndex Index of the snippet to copy.
	 */
	copySource(snippets: readonly CodeSnippet[], selectedIndex: number = 0) {
		const text = snippets[selectedIndex]?.textContent || '';
		if (this._clipboard.copy(text)) {
			this._toast.success(this._i18n.translate('UI.LIBRARY.EXAMPLE_VIEWER.CODE_COPIED'), '', { timeOut: 2500 });
		} else {
			this._toast.error(this._i18n.translate('UI.LIBRARY.EXAMPLE_VIEWER.COPY_ERROR'), '', { timeOut: 2500 });
		}
	}

	/** Ordered example tab names following the preferred file order. */
	protected _exampleTabNames = computed(() => {
		const exampleTabs = this.exampleTabs();

		if (!exampleTabs) {
			return [];
		}

		return Object.keys(exampleTabs).sort((a, b) => {
			let indexA = preferredExampleFileOrder.indexOf(a);
			let indexB = preferredExampleFileOrder.indexOf(b);
			if (indexA === -1) {
				indexA = preferredExampleFileOrder.length;
			}

			if (indexB === -1) {
				indexB = preferredExampleFileOrder.length;
			}

			return indexA - indexB || 1;
		});
	});

	/**
	 * Copies a deep link to the current example to the clipboard and surfaces a
	 * success or error toast.
	 */
	_copyLink() {
		const fullUrl = location.origin + location.pathname + '#' + this._example;
		const copySuccessful = this._clipboard.copy(fullUrl);

		if (copySuccessful) {
			this._toast.success(this._i18n.translate('UI.LIBRARY.EXAMPLE_VIEWER.LINK_COPIED'), '', { timeOut: 2500 });
		} else {
			this._toast.error(this._i18n.translate('UI.LIBRARY.EXAMPLE_VIEWER.LINK_COPY_ERROR'), '', { timeOut: 2500 });
		}
	}

	/**
	 * Loads the example data and component for the given example name and
	 * extracts its source code into the viewer tabs.
	 *
	 * @param name Identifier of the example to display.
	 */
	private async _exampleChanged(name: string) {
		const example = this._exampleRegistry.get(name);
		this.exampleData.set(example || null);

		if (!this.exampleData()) {
			console.error(`No se encontró ejemplo: ${name}`);
			return;
		}

		try {
			// Cargar el componente del ejemplo
			const componentType = await this._exampleRegistry.loadComponent(name);
			this._exampleComponentType.set(componentType);

			// Extraer código del componente si tiene propiedades de código
			this._extractCodeFromComponent(componentType);
		} catch (e) {
			console.error(`Error cargando ejemplo '${name}': ${e}`);
		}
	}

	/**
	 * Llena las pestañas de código con el `sourceCode` del registro o, si no lo hay, con los
	 * snippets que el ejemplo publica como miembros estáticos.
	 *
	 * Nunca construye el componente: un ejemplo que usa `inject()` revienta con NG0203 bajo
	 * `new`, y el fallback anterior se tragaba ese fallo en un `console.warn` dejando al
	 * lector unas pestañas vacías sin explicación.
	 */
	private _extractCodeFromComponent(componentType: Type<any> | null) {
		const tabs: Record<string, string> = {};
		const data = this.exampleData();

		// 1. Prioridad: Usar sourceCode si está definido en el registro
		if (data?.sourceCode && Object.keys(data.sourceCode).length > 0) {
			for (const [key, code] of Object.entries(data.sourceCode)) {
				tabs[key] = code;
			}
		}
		// 2. Fallback: los snippets estáticos declarados por la clase del ejemplo
		else if (componentType) {
			const snippets = componentType as unknown as ExampleSnippets;
			if (snippets.templateCode) tabs['HTML'] = snippets.templateCode;
			if (snippets.componentCode) tabs['TS'] = snippets.componentCode;
			if (snippets.dataCode) tabs['DATA'] = snippets.dataCode;
			if (snippets.cssCode) tabs['CSS'] = snippets.cssCode;
		}

		this.exampleTabs.set(tabs);
	}

	/**
	 * Builds the example tabs from the registry-provided source code, keying each
	 * tab by the uppercased file extension.
	 *
	 * @param data Example data whose source code populates the tabs.
	 */
	private _generateExampleTabs(data: LiveExample | null) {
		const tabs: Record<string, string> = {};

		if (data && data.sourceCode) {
			// Usar código fuente proporcionado directamente
			for (const [fileName, code] of Object.entries(data.sourceCode)) {
				const extension = fileName.split('.').pop()?.toUpperCase() || fileName;
				tabs[extension] = code;
			}
		}

		this.exampleTabs.set(tabs);
	}

	/**
	 * Translates example titles and other library-owned copy shown by the example viewer.
	 *
	 * @param text Source text stored in the example registry.
	 * @returns Localized text when available.
	 */
	translateExampleText(text: string | null | undefined): string {
		if (text && SEMANTIC_KEY_RE.test(text)) {
			return this._i18n.translate(text);
		}
		return text ?? '';
	}

	/** Cambiar a la pestaña con el índice dado */
	selectTab(index: number) {
		this.selectedTab.set(index);
	}

	/** Determina el lenguaje de resaltado para una pestaña */
	getLanguageForTab(tabName: string): string {
		switch (tabName.toLowerCase()) {
			case 'ts':
			case 'typescript':
				return 'typescript';
			case 'html':
			case 'template':
				return 'xml';
			case 'css':
			case 'scss':
				return 'css';
			case 'sh':
			case 'bash':
			case 'shell':
				return 'bash';
			case 'json':
				return 'json';
			default:
				return 'typescript';
		}
	}
}
