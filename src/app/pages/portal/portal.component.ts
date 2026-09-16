import { Component, inject, OnInit, ChangeDetectionStrategy, Type } from '@angular/core';
import { LibraryPageComponent } from '../../../../shared/library-page.component';
import { FeatureExample, Library } from '../../../models/interfaces';
import { MD_CSS_VARIABLES } from '../../generated/md-css-variables';
import { ExampleRegistry } from '../../shared/example-viewer/example-registry';
import { BasicPortalExampleComponent } from '../examples/portal/basic-portal-example.component';
import { ComponentRenderingExampleComponent } from '../examples/portal/component-rendering-example.component';
import { ContentProjectionExampleComponent } from '../examples/portal/content-projection-example.component';
import { DataPassingExampleComponent } from '../examples/portal/data-passing-example.component';
import { PositioningPortalExampleComponent } from '../examples/portal/positioning-portal-example.component';
import { ProgressiveOpenExampleComponent } from '../examples/portal/progressive-open-example.component';
import { ServicePortalExampleComponent } from '../examples/portal/service-portal-example.component';
import { StringContentExampleComponent } from '../examples/portal/string-content-example.component';
import { TemplaterefRenderingExampleComponent } from '../examples/portal/templateref-rendering-example.component';
import { ToggleExampleComponent } from '../examples/portal/toggle-example.component';

/** An example class, seen through the two static snippets the page prints. */
type ExampleType = Type<unknown> & { templateCode?: string; componentCode?: string };

/**
 * `DOCS.PORTAL.EXAMPLE.*` key segment that holds the localized title and description of every
 * registered example.
 *
 * The copy lives in the locale files rather than in the registry entries so a reader in any of
 * the eight languages gets it in their own, instead of the English literal the page used to
 * hand the registry — a field `LiveExample` does not even declare, so nothing ever printed it.
 */
const EXAMPLE_I18N_KEYS: Record<string, string> = {
	'portal-component-rendering': 'COMPONENT_RENDERING',
	'portal-templateref-rendering': 'TEMPLATEREF_RENDERING',
	'portal-string-content': 'STRING_CONTENT',
	'portal-data-passing': 'DATA_PASSING',
	'portal-content-projection': 'CONTENT_PROJECTION',
	'portal-progressive-open': 'PROGRESSIVE_OPEN',
	'portal-toggle': 'TOGGLE',
	'portal-basic': 'BASIC',
	'portal-positioning': 'POSITIONING',
	'portal-service': 'SERVICE'
};

/** Live preview component for each registered example id. */
const PREVIEW_COMPONENTS: Record<string, ExampleType> = {
	'portal-component-rendering': ComponentRenderingExampleComponent,
	'portal-templateref-rendering': TemplaterefRenderingExampleComponent,
	'portal-string-content': StringContentExampleComponent,
	'portal-data-passing': DataPassingExampleComponent,
	'portal-content-projection': ContentProjectionExampleComponent,
	'portal-progressive-open': ProgressiveOpenExampleComponent,
	'portal-toggle': ToggleExampleComponent,
	'portal-basic': BasicPortalExampleComponent,
	'portal-positioning': PositioningPortalExampleComponent,
	'portal-service': ServicePortalExampleComponent
};

/** Module path of each example, used to print the import line of its snippet. */
const EXAMPLE_PATHS: Record<string, string> = {
	'portal-component-rendering': 'component-rendering-example.component',
	'portal-templateref-rendering': 'templateref-rendering-example.component',
	'portal-string-content': 'string-content-example.component',
	'portal-data-passing': 'data-passing-example.component',
	'portal-content-projection': 'content-projection-example.component',
	'portal-progressive-open': 'progressive-open-example.component',
	'portal-toggle': 'toggle-example.component',
	'portal-basic': 'basic-portal-example.component',
	'portal-positioning': 'positioning-portal-example.component',
	'portal-service': 'service-portal-example.component'
};

/**
 * Feature groups of the Overview tab, each naming the examples that demonstrate it.
 *
 * Every group has to be something the library actually does: the group that used to be called
 * "Positioning" promised placement strategies this library has never implemented — it appends
 * the window to a container and leaves the geometry to your CSS — so it is named after the
 * option it really exposes.
 */
const PORTAL_FEATURES: ReadonlyArray<{ title: string; description: string; exampleIds: string[] }> = [
	{
		title: 'DOCS.PORTAL.FEATURE.CONTENT_RENDERING.TITLE',
		description: 'DOCS.PORTAL.FEATURE.CONTENT_RENDERING.DESCRIPTION',
		exampleIds: [
			'portal-component-rendering',
			'portal-templateref-rendering',
			'portal-string-content',
			'portal-data-passing'
		]
	},
	{
		title: 'DOCS.PORTAL.FEATURE.OPENING_STRATEGIES.TITLE',
		description: 'DOCS.PORTAL.FEATURE.OPENING_STRATEGIES.DESCRIPTION',
		exampleIds: ['portal-progressive-open', 'portal-toggle']
	},
	{
		title: 'DOCS.PORTAL.FEATURE.CONTAINER_TARGETING.TITLE',
		description: 'DOCS.PORTAL.FEATURE.CONTAINER_TARGETING.DESCRIPTION',
		exampleIds: ['portal-positioning']
	},
	{
		title: 'DOCS.PORTAL.FEATURE.OVERLAY_MANAGEMENT.TITLE',
		description: 'DOCS.PORTAL.FEATURE.OVERLAY_MANAGEMENT.DESCRIPTION',
		exampleIds: ['portal-basic']
	},
	{
		title: 'DOCS.PORTAL.FEATURE.INTERACTION.TITLE',
		description: 'DOCS.PORTAL.FEATURE.INTERACTION.DESCRIPTION',
		exampleIds: ['portal-content-projection', 'portal-component-rendering']
	},
	{
		title: 'DOCS.PORTAL.FEATURE.LIFECYCLE.TITLE',
		description: 'DOCS.PORTAL.FEATURE.LIFECYCLE.DESCRIPTION',
		exampleIds: ['portal-service', 'portal-progressive-open']
	}
];

/**
 * Main portal library page component
 */
@Component({
	selector: 'app-portal',
	standalone: true,
	imports: [LibraryPageComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: ` <app-library-page [library]="portalLibrary" [package]="'portal'"> </app-library-page> `
})
export class PortalComponent implements OnInit {
	private readonly _exampleRegistry = inject(ExampleRegistry);

	/**
	 * Complete portal library data
	 */
	portalLibrary: Library = {
		title: 'ng-hub-ui-portal',
		description:
			'A headless Angular portal library that renders components, templates or plain text into any DOM container.',
		overview: {
			text: "The portal service renders dynamic content — a component class, a TemplateRef or a plain string — into any DOM container you name, and hands back a reference to close it, dismiss it and observe its lifecycle. It is headless by design: it owns the stack, the focus trap and the promises, and leaves the visual presentation to your own components and CSS. It does not position anything and it draws no backdrop; where the window ends up is decided by the container it is appended to and by the classes you attach through 'windowClass'.",
			highlights: [
				{
					icon: 'fa-solid fa-up-right-from-square',
					title: 'Render Outside the DOM Tree',
					description:
						'Project any Angular template to any DOM node in the document without breaking encapsulation or change detection.'
				},
				{
					icon: 'fa-solid fa-layer-group',
					title: 'Any DOM Container',
					description:
						'Point the container option at a CSS selector or an HTMLElement and the window is appended there; leave it out and it lands on the body.'
				},
				{
					icon: 'fa-solid fa-bolt',
					title: 'The Content Talks Back',
					description:
						'A component injects HubActivePortal, a template receives it as $implicit, and either one closes the portal with a result or dismisses it with a reason.'
				},
				{
					icon: 'fa-solid fa-recycle',
					title: 'Deterministic Teardown',
					description:
						'Closing or dismissing runs the hide transition, detaches the view, destroys the component and gives the page back its scrollbar and its aria-hidden siblings.'
				},
				{
					icon: 'fa-solid fa-code',
					title: 'Template & Component Portals',
					description:
						'A TemplateRef fragment, a component class or a plain string, all opened through the same HubPortal.open() call — the library ships services, not directives.'
				},
				{
					icon: 'fa-solid fa-universal-access',
					title: 'Focus & ARIA Context Preserved',
					description:
						'Focus moves into the window and returns where it came from, everything outside it goes aria-hidden, and Escape dismisses while the keyboard option is on.'
				}
			],
			changelog: [
				{
					version: '22.2.0',
					date: '2026-09-08',
					changes: [
						{
							type: 'fixed',
							description:
								'HubPortal.open() with a plain string opened an empty dialog. Every other kind of content is split into the three slots the window destructures, header, body and footer, but the string path returned a single slot: the text landed in the header and the body arrived undefined, which Angular projects as nothing, so the reader saw a blank box. The string now goes into the body slot like everything else, and four specs pin it. Worth stating plainly, because the same defect behaved worse in ng-hub-ui-modal, where it also took the keyboard down with it: here Escape never stopped working, because this window arms its listeners in ngOnInit rather than at the tail of the entry transition.'
						},
						{
							type: 'changed',
							description:
								'The body mark is hub-portal-open. The old portal-open claimed a name in the application namespace rather than in the library one, the same defect ng-hub-ui-utils retired from the bare [tooltip] attribute in 22.14.0, and nothing warns a host whose own .portal-open rule is silently joined by ours. Both classes are written for now, so a stylesheet matching the old name keeps working; portal-open is removed in 23.0.0. See BREAKING_CHANGES.md.'
						},
						{
							type: 'changed',
							description:
								'scrollable is delivered by the dialog rather than by a class on the content component host. That host is only a query root: its children are handed to the window and the host itself never enters the document, so component-host-scrollable, and the only rule this library shipped for it, matched nothing and asking for scrollable did nothing at all. The option now reaches the dialog through portal-dialog-scrollable, which the window already set, and the stylesheet dresses that class: the content box is pinned and the body scrolls inside it, or, where the content brings no .portal-body of its own, the content box is what scrolls.'
						},
						{
							type: 'changed',
							description:
								'The slot split is one documented function instead of three inline expressions. Both declared slots are taken out of the container before the body is captured, and the body is captured as a static array. The old code read the body between the two extractions and got away with it only because what it captured was the live childNodes list, which Angular snapshots later, once both markers are already gone: correct by accident, disagreeing with the Node[][] ContentRef declares, and going empty the moment the nodes are projected out. No behaviour changes, and a spec now guards the contract.'
						},
						{
							type: 'added',
							description:
								'Both READMEs state where this library stands on server-side rendering. The honest answer is not verified: a portal window only exists after a gesture, so the site prerender, which is the running proof for the libraries that render markup on the page, never draws one.'
						}
					]
				},
				{
					version: '22.1.0',
					date: '2026-09-06',
					changes: [
						{
							type: 'changed',
							description:
								'Dropped the angular16 keyword from the package manifest. The peer range has required Angular 18 or newer since 22.0.1, so the keyword was advertising the package to exactly the searchers whose install it would refuse.'
						},
						{
							type: 'changed',
							description:
								'HubPortalRef is generic, so opening a portal no longer costs you the types. HubPortal.open<C, R>() and toggle<C, R>() infer C from the class handed to them, which is what makes componentInstance the component instead of any, while R types the value that travels through close(), result and closed. Until now the README answered this with a hand-written cast that claims a type nobody checks. Both parameters default to any, but componentInstance narrows from any to C | void, so a call site that reached straight through it stops compiling: see BREAKING_CHANGES.md. content is now typed Type<C> | TemplateRef<any> | string, which is what the stack already accepted, and the whole shape mirrors what ng-hub-ui-modal settled on in 22.5.0. Dismiss reasons stay untyped on purpose, because they carry either an internal PortalDismissReasons value or whatever the consumer passed.'
						},
						{
							type: 'removed',
							description:
								'Removed the unused BACKDROP_ATTRIBUTES constant, a commented-out import in portal-config.ts and two commented-out lines of an older toggle() implementation. None of it was reachable, and backdropClass, the option that constant named, is not part of HubPortalOptions, so leaving it in suggested a backdrop API the library does not have. No behaviour changes.'
						},
						{
							type: 'fixed',
							description:
								'Escape now dismisses the portal, as the keyboard option has always promised. The option was declared, defaulted to true in HubPortalConfig and documented in the README and on the docs site, but no key listener existed anywhere in the library: the close button was the only way out of a focus-trapped role=dialog, which left keyboard and screen-reader users stuck and forced every consumer to wire their own listener inside the projected component. The window now rejects its result promise with PortalDismissReasons.ESC, the reason the library exported without ever emitting it, honours keyboard: false per portal, steps aside when another handler has already consumed the key, and reacts only in the window holding focus, so a stack dismisses one dialog at a time from the top.'
						},
						{
							type: 'fixed',
							description:
								'scrollable was declared a string on the portal window while HubPortalOptions declares it a boolean. Nothing misbehaved, because the template only tests the input for truthiness and the option reaches it through the name-based setInput, which no compiler ever checks, so the two had been free to disagree since the input was written. They now agree, which is what stops the next reader from believing the window and passing a string.'
						},
						{
							type: 'deprecated',
							description:
								'HubPortalModule is deprecated and will be removed in 23.0.0. Its whole body is providers: [HubPortal], and HubPortal is providedIn: root, so importing the module never enabled the service; it only added a redundant second instance in whichever injector declared the import, delegating to the same root HubPortalStack and HubPortalConfig. Inject HubPortal and drop the import. The class carried no @deprecated tag until now, so neither an editor nor the build could warn anyone it was on its way out. See BREAKING_CHANGES.md.'
						}
					]
				},
				{
					version: '22.0.5',
					date: '2026-09-01',
					changes: [
						{
							type: 'changed',
							description:
								"The homepage in the manifest points at this library's own documentation page rather than at the site root. It is the link a registry shows beside the package and the one a reader clicks from it, and landing on a front page they then have to search is a worse answer than landing on the reference for the package they were already looking at. Metadata only — no code, no types, no styles change, and nothing a consumer imports is affected."
						}
					]
				},
				{
					version: '22.0.4',
					date: '2026-08-08',
					changes: [
						{
							type: 'fixed',
							description:
								'Documentation links now point at the canonical localized URLs. The README linked to https://hubui.dev/<path> with no locale prefix and no trailing slash, and both forms are 301-redirected, so every reader arriving from npm or GitHub landed on a redirect instead of the canonical page.'
						}
					]
				},
				{
					version: '22.0.3',
					date: '2026-07-28',
					changes: [
						{
							type: 'fixed',
							description:
								'Removed the invalid aria-portal attribute from the portal window host (not a real ARIA attribute); role=dialog and the aria-labelledby/describedby wiring stay.'
						}
					]
				},
				{
					version: '22.0.2',
					date: '2026-07-26',
					changes: [
						{
							type: 'fixed',
							description:
								'Declared the real ng-hub-ui-utils peer range (>=22.0.0); the previous >=1.0.0 floor allowed resolving an incompatible utils major.'
						}
					]
				},
				{
					version: '22.0.1',
					date: '2026-06-26',
					changes: [
						{
							type: 'fixed',
							description:
								'Corrected the Angular peer dependency range to >=18.0.0. The library uses APIs introduced in Angular 17 (signal input()/output(), the @if control flow and signal queries), so the previous >=16.0.0 range let it install on versions it cannot run on.'
						},
						{
							type: 'fixed',
							description:
								'Corrected the ng-hub-ui-utils peer range. The previous caret range resolved to >=1 <2, which excluded the current utils (22.x) and made the peer impossible to satisfy.'
						}
					]
				},
				{
					version: '22.0.0',
					date: '2026-06-17',
					changes: [
						{ type: 'changed', description: 'Aligned with Angular 22.' },
						{ type: 'changed', description: 'README documentation standardized.' }
					]
				},
				{
					version: '0.3.4',
					date: '2026-06-14',
					changes: [
						{
							type: 'fixed',
							description:
								'Portal window options (animation, windowClass, portalDialogClass, …) are applied through ComponentRef.setInput instead of being assigned onto the instance. Since HubPortalWindow declares them as signal inputs, the direct assignment replaced the read-only signal function and threw TypeError: ctx.animation is not a function on every open().'
						},
						{
							type: 'fixed',
							description:
								'Guarded parentNode when removing the window element during teardown, which threw when the element had already been detached.'
						}
					]
				}
			]
		},
		functionalities: [],
		api: {
			inputs: [
				{
					name: 'animation',
					type: 'boolean',
					required: false,
					description: 'DOCS.PORTAL.API.INPUT.ANIMATION.DESCRIPTION'
				},
				{
					name: 'ariaLabelledBy',
					type: 'string',
					required: false,
					description: 'DOCS.PORTAL.API.INPUT.ARIA_LABELLED_BY.DESCRIPTION'
				},
				{
					name: 'ariaDescribedBy',
					type: 'string',
					required: false,
					description: 'DOCS.PORTAL.API.INPUT.ARIA_DESCRIBED_BY.DESCRIPTION'
				},
				{
					name: 'beforeDismiss',
					type: '() => boolean | Promise<boolean>',
					required: false,
					description: 'DOCS.PORTAL.API.INPUT.BEFORE_DISMISS.DESCRIPTION'
				},
				{
					name: 'container',
					type: 'string | HTMLElement',
					required: false,
					description: 'DOCS.PORTAL.API.INPUT.CONTAINER.DESCRIPTION'
				},
				{
					name: 'injector',
					type: 'Injector',
					required: false,
					description: 'DOCS.PORTAL.API.INPUT.INJECTOR.DESCRIPTION'
				},
				{
					name: 'keyboard',
					type: 'boolean',
					required: false,
					description: 'DOCS.PORTAL.API.INPUT.KEYBOARD.DESCRIPTION'
				},
				{
					name: 'scrollable',
					type: 'boolean',
					required: false,
					description: 'DOCS.PORTAL.API.INPUT.SCROLLABLE.DESCRIPTION'
				},
				{
					name: 'windowClass',
					type: 'string',
					required: false,
					description: 'DOCS.PORTAL.API.INPUT.WINDOW_CLASS.DESCRIPTION'
				},
				{
					name: 'portalDialogClass',
					type: 'string',
					required: false,
					description: 'DOCS.PORTAL.API.INPUT.PORTAL_DIALOG_CLASS.DESCRIPTION'
				},
				{
					name: 'portalContentClass',
					type: 'string',
					required: false,
					description: 'DOCS.PORTAL.API.INPUT.PORTAL_CONTENT_CLASS.DESCRIPTION'
				},
				{
					name: 'headerSelector',
					type: 'string',
					required: false,
					description: 'DOCS.PORTAL.API.INPUT.HEADER_SELECTOR.DESCRIPTION'
				},
				{
					name: 'footerSelector',
					type: 'string',
					required: false,
					description: 'DOCS.PORTAL.API.INPUT.FOOTER_SELECTOR.DESCRIPTION'
				},
				{
					name: 'dismissSelector',
					type: 'string',
					required: false,
					description: 'DOCS.PORTAL.API.INPUT.DISMISS_SELECTOR.DESCRIPTION'
				},
				{
					name: 'closeSelector',
					type: 'string',
					required: false,
					description: 'DOCS.PORTAL.API.INPUT.CLOSE_SELECTOR.DESCRIPTION'
				}
			],
			outputs: [],
			methods: [
				{
					name: 'HubPortal.open',
					signature:
						'open<C = any, R = any>(content: Type<C> | TemplateRef<any> | string, options?: HubPortalOptions): HubPortalRef<C, R>',
					description: 'DOCS.PORTAL.API.METHOD.OPEN.DESCRIPTION',
					returns: 'HubPortalRef<C, R>'
				},
				{
					name: 'HubPortal.toggle',
					signature:
						'toggle<C = any, R = any>(content: Type<C> | TemplateRef<any> | string, options?: HubPortalOptions): HubPortalRef<C, R>',
					description: 'DOCS.PORTAL.API.METHOD.TOGGLE.DESCRIPTION',
					returns: 'HubPortalRef<C, R>'
				},
				{
					name: 'HubPortal.dismissAll',
					signature: 'dismissAll(reason?: any): void',
					description: 'DOCS.PORTAL.API.METHOD.DISMISS_ALL.DESCRIPTION'
				},
				{
					name: 'HubPortal.hasOpenPortals',
					signature: 'hasOpenPortals(): boolean',
					description: 'DOCS.PORTAL.API.METHOD.HAS_OPEN_PORTALS.DESCRIPTION',
					returns: 'boolean'
				},
				{
					name: 'HubPortal.activeInstances',
					signature: 'activeInstances: EventEmitter<HubPortalRef[]>',
					description: 'DOCS.PORTAL.API.METHOD.ACTIVE_INSTANCES.DESCRIPTION',
					returns: 'EventEmitter<HubPortalRef[]>'
				}
			],
			templates: [
				{
					name: 'DOCS.PORTAL.API.TEMPLATE.0.NAME',
					description: 'DOCS.PORTAL.API.TEMPLATE.0.DESCRIPTION',
					example: `<ng-template #portalTemplate>
  <div class="portal-content">
    <div class="portal-header">
      <h4>Portal Title</h4>
      <button data-dismiss="portal">×</button>
    </div>
    <div class="portal-body">
      Portal content goes here
    </div>
    <div class="portal-footer">
      <button data-dismiss="portal">Cancel</button>
      <button data-close="portal">OK</button>
    </div>
  </div>
</ng-template>

<!-- Open the portal -->
<button (click)="portal.open(portalTemplate)">Open Portal</button>`
				}
			],
			cssVariables: MD_CSS_VARIABLES['portal'] ?? []
		},
		styling: []
	};

	/**
	 * Angular lifecycle hook. Registers the interactive examples and builds the grouped
	 * functionalities shown on the library page.
	 */
	ngOnInit(): void {
		this.registerExamples();
		this.populateFunctionalities();
	}

	/**
	 * Registers every portal example with the shared example registry so the
	 * example viewer can lazy-load and render each one on demand.
	 */
	private registerExamples(): void {
		const examples = [
			// Content Rendering examples
			{
				id: 'portal-component-rendering',
				title: 'DOCS.PORTAL.EXAMPLE.COMPONENT_RENDERING.TITLE',
				componentName: 'ComponentRenderingExampleComponent',
				files: ['component-rendering-example.component.ts'],
				loader: () =>
					import('../examples/portal/component-rendering-example.component').then(
						(m) => m.ComponentRenderingExampleComponent
					)
			},
			{
				id: 'portal-templateref-rendering',
				title: 'DOCS.PORTAL.EXAMPLE.TEMPLATEREF_RENDERING.TITLE',
				componentName: 'TemplaterefRenderingExampleComponent',
				files: ['templateref-rendering-example.component.ts'],
				loader: () =>
					import('../examples/portal/templateref-rendering-example.component').then(
						(m) => m.TemplaterefRenderingExampleComponent
					)
			},
			{
				id: 'portal-string-content',
				title: 'DOCS.PORTAL.EXAMPLE.STRING_CONTENT.TITLE',
				componentName: 'StringContentExampleComponent',
				files: ['string-content-example.component.ts'],
				loader: () =>
					import('../examples/portal/string-content-example.component').then((m) => m.StringContentExampleComponent)
			},
			{
				id: 'portal-data-passing',
				title: 'DOCS.PORTAL.EXAMPLE.DATA_PASSING.TITLE',
				componentName: 'DataPassingExampleComponent',
				files: ['data-passing-example.component.ts'],
				loader: () =>
					import('../examples/portal/data-passing-example.component').then((m) => m.DataPassingExampleComponent)
			},
			{
				id: 'portal-content-projection',
				title: 'DOCS.PORTAL.EXAMPLE.CONTENT_PROJECTION.TITLE',
				componentName: 'ContentProjectionExampleComponent',
				files: ['content-projection-example.component.ts'],
				loader: () =>
					import('../examples/portal/content-projection-example.component').then(
						(m) => m.ContentProjectionExampleComponent
					)
			},
			// Opening Strategies examples
			{
				id: 'portal-progressive-open',
				title: 'DOCS.PORTAL.EXAMPLE.PROGRESSIVE_OPEN.TITLE',
				componentName: 'ProgressiveOpenExampleComponent',
				files: ['progressive-open-example.component.ts'],
				loader: () =>
					import('../examples/portal/progressive-open-example.component').then(
						(m) => m.ProgressiveOpenExampleComponent
					)
			},
			{
				id: 'portal-toggle',
				title: 'DOCS.PORTAL.EXAMPLE.TOGGLE.TITLE',
				componentName: 'ToggleExampleComponent',
				files: ['toggle-example.component.ts'],
				loader: () => import('../examples/portal/toggle-example.component').then((m) => m.ToggleExampleComponent)
			},
			// Keep old examples for backward compatibility
			{
				id: 'portal-basic',
				title: 'DOCS.PORTAL.EXAMPLE.BASIC.TITLE',
				componentName: 'BasicPortalExampleComponent',
				files: ['basic-portal-example.component.ts'],
				loader: () =>
					import('../examples/portal/basic-portal-example.component').then((m) => m.BasicPortalExampleComponent)
			},
			{
				id: 'portal-positioning',
				title: 'DOCS.PORTAL.EXAMPLE.POSITIONING.TITLE',
				componentName: 'PositioningPortalExampleComponent',
				files: ['positioning-portal-example.component.ts'],
				loader: () =>
					import('../examples/portal/positioning-portal-example.component').then(
						(m) => m.PositioningPortalExampleComponent
					)
			},
			{
				id: 'portal-service',
				title: 'DOCS.PORTAL.EXAMPLE.SERVICE.TITLE',
				componentName: 'ServicePortalExampleComponent',
				files: ['service-portal-example.component.ts', 'services/toast.service.ts'],
				loader: () =>
					import('../examples/portal/service-portal-example.component').then((m) => m.ServicePortalExampleComponent)
			}
		];

		examples.forEach((ex) => {
			this._exampleRegistry.register({
				...ex,
				packagePath: 'portal'
			});
		});
	}

	/**
	 * Builds the grouped feature list, attaching a live preview to each example so the Overview
	 * "Feature guides" section shows the demo rather than announcing a group with nothing under it.
	 */
	private populateFunctionalities(): void {
		this.portalLibrary.functionalities = PORTAL_FEATURES.map((group) => ({
			title: group.title,
			description: group.description,
			examples: group.exampleIds
				.map((id) => this.createExample(id))
				.filter((example): example is FeatureExample => example !== null)
		}));
	}

	/**
	 * Describes one example from its id, its class and its locale entry.
	 *
	 * Nothing here constructs the component: the snippets are read off the class, which is where
	 * `ExampleViewer` reads them too, and every portal example calls `inject()`, so building one
	 * outside an injection context would throw NG0203 and take the whole Overview tab with it.
	 *
	 * @param exampleId Registered example id.
	 * @returns Populated feature example, or null when the id has no preview component.
	 */
	private createExample(exampleId: string): FeatureExample | null {
		const component = PREVIEW_COMPONENTS[exampleId];
		const key = EXAMPLE_I18N_KEYS[exampleId];

		if (!component || !key) {
			return null;
		}

		return {
			title: `DOCS.PORTAL.EXAMPLE.${key}.TITLE`,
			description: `DOCS.PORTAL.EXAMPLE.${key}.DESCRIPTION`,
			import: `import { ${component.name} } from './${EXAMPLE_PATHS[exampleId]}';`,
			template: component.templateCode ?? '',
			component: component.componentCode ?? '',
			previewComponent: component
		};
	}
}
