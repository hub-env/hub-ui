/**
 * DocViewer - Componente para mostrar documentación HTML
 * Portado de Angular Material a Bootstrap/vanilla
 */

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
	ApplicationRef,
	Component,
	ComponentRef,
	createComponent,
	ElementRef,
	EnvironmentInjector,
	inject,
	Injectable,
	Injector,
	Input,
	input,
	NgZone,
	OnDestroy,
	Type,
	ViewContainerRef,
	output,
	ChangeDetectionStrategy
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, Subscription } from 'rxjs';
import { shareReplay, take, tap } from 'rxjs/operators';
import { ExampleViewer } from '../example-viewer/example-viewer';
import { HeaderLink } from './header-link';

@Injectable({ providedIn: 'root' })
class DocFetcher {
	private _http = inject(HttpClient);

	private _cache: Record<string, Observable<string>> = {};

	fetchDocument(url: string): Observable<string> {
		if (this._cache[url]) {
			return this._cache[url];
		}

		const stream = this._http.get(url, { responseType: 'text' }).pipe(shareReplay(1));
		return stream.pipe(tap(() => (this._cache[url] = stream)));
	}
}

@Component({
	selector: 'doc-viewer',
	standalone: true,
	template: `
		<div class="doc-viewer-content" #contentContainer></div>
		@if (loading) {
			<div class="doc-viewer-loading">
				<div class="spinner-border spinner-border-sm" role="status">
					<span class="visually-hidden">Cargando documento...</span>
				</div>
				<span class="ms-2">Cargando documento...</span>
			</div>
		}
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: [
		`
			:host {
				display: block;
			}

			.doc-viewer-loading {
				display: flex;
				align-items: center;
				padding: 1rem;
				color: var(--bs-secondary);
			}

			.doc-viewer-content {
				:deep(pre) {
					background-color: var(--bs-gray-100);
					padding: 1rem;
					border-radius: 0.375rem;
					overflow-x: auto;
				}

				:deep(code) {
					font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
				}
			}
		`
	]
})
export class DocViewer implements OnDestroy {
	private _appRef = inject(ApplicationRef);
	_elementRef = inject(ElementRef);
	private _injector = inject(Injector);
	private _envInjector = inject(EnvironmentInjector);
	private _viewContainerRef = inject(ViewContainerRef);
	private _ngZone = inject(NgZone);
	private _domSanitizer = inject(DomSanitizer);
	private _docFetcher = inject(DocFetcher);

	private _componentRefs: ComponentRef<any>[] = [];
	private _documentFetchSubscription: Subscription | undefined;

	loading = false;

	readonly name = input<string>();
	readonly packageName = input<string>();

	/** El documento a mostrar, como URL a un archivo markdown o componente. */
	@Input()
	set document(document: string | Type<any> | undefined) {
		if (typeof document === 'string') {
			this._fetchDocument(document);
		} else if (document) {
			// Crear componente dinámicamente
			this._clearComponents();
			const componentRef = createComponent(document, {
				environmentInjector: this._envInjector,
				elementInjector: this._injector
			});
			this._appRef.attachView(componentRef.hostView);
			this._elementRef.nativeElement.appendChild(componentRef.location.nativeElement);
			this._componentRefs.push(componentRef);

			this._ngZone.onStable.pipe(take(1)).subscribe(() => this.contentRendered.emit(this._elementRef.nativeElement));
		}
	}

	readonly contentRendered = output<HTMLElement>();

	/** El texto del documento. No debe estar codificado en HTML. */
	textContent = '';

	private static _initExampleViewer(
		exampleViewerComponent: ExampleViewer,
		example: string,
		file: string | null,
		region: string | null
	) {
		exampleViewerComponent.example = example;
		if (file) {
			exampleViewerComponent.view.set('snippet');
			exampleViewerComponent.showCompactToggle.set(true);
			exampleViewerComponent.file.set(file);
			if (region) {
				exampleViewerComponent.region.set(region);
			}
		} else {
			exampleViewerComponent.view.set('demo');
		}
	}

	/** Obtener documento por URL. */
	private _fetchDocument(url: string) {
		this.loading = true;
		this._documentFetchSubscription?.unsubscribe();
		this._documentFetchSubscription = this._docFetcher.fetchDocument(url).subscribe({
			next: (document) => {
				this.loading = false;
				this._updateDocument(document);
			},
			error: (error) => {
				this.loading = false;
				this._showError(url, error);
			}
		});
	}

	/**
	 * Actualiza el documento mostrado.
	 * @param rawDocument El contenido raw del documento a mostrar.
	 */
	private _updateDocument(rawDocument: string) {
		// Reemplazar URLs de fragmento relativas con absolutas
		rawDocument = rawDocument.replace(/href="#([^"]*)"/g, (_m: string, fragmentUrl: string) => {
			const absoluteUrl = `${location.pathname}#${fragmentUrl}`;
			return `href="${this._domSanitizer.sanitize(2, absoluteUrl)}"`;
		});
		this._elementRef.nativeElement.innerHTML = rawDocument;
		this.textContent = this._elementRef.nativeElement.textContent;

		// Cargar componentes dinámicos
		this._loadComponents('docs-example', ExampleViewer);
		this._loadComponents('header-link', HeaderLink);

		this._ngZone.onStable.pipe(take(1)).subscribe(() => this.contentRendered.emit(this._elementRef.nativeElement));
	}

	/** Mostrar error al obtener documento. */
	private _showError(url: string, error: HttpErrorResponse) {
		console.error(error);
		this._elementRef.nativeElement.textContent = `Error al cargar documento: ${url}. Error: ${error.statusText}`;
	}

	/** Instanciar componentes para cada ejemplo. */
	private _loadComponents(componentName: string, componentClass: Type<ExampleViewer | HeaderLink>) {
		const exampleElements = this._elementRef.nativeElement.querySelectorAll(`[${componentName}]`);

		[...exampleElements].forEach((element: Element) => {
			const example = element.getAttribute(componentName);
			const region = element.getAttribute('region');
			const file = element.getAttribute('file');

			// Crear componente usando createComponent
			const componentRef = createComponent(componentClass, {
				environmentInjector: this._envInjector,
				elementInjector: this._injector,
				hostElement: element
			});

			this._appRef.attachView(componentRef.hostView);

			const instance = componentRef.instance;
			if (example !== null) {
				if (componentClass === ExampleViewer) {
					DocViewer._initExampleViewer(instance as ExampleViewer, example, file, region);
				} else {
					(instance as HeaderLink).example.set(example);
				}
			}

			this._componentRefs.push(componentRef);
		});
	}

	private _clearComponents() {
		this._componentRefs.forEach((ref) => {
			this._appRef.detachView(ref.hostView);
			ref.destroy();
		});
		this._componentRefs = [];
	}

	ngOnDestroy() {
		this._clearComponents();
		this._documentFetchSubscription?.unsubscribe();
	}
}
