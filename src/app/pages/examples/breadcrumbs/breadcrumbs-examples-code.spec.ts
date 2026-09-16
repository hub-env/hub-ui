import { Type } from '@angular/core';
import { BasicBreadcrumbsExampleComponent } from './basic-breadcrumbs-example.component';
import { CollapseBreadcrumbsExampleComponent } from './collapse-breadcrumbs-example.component';
import { CustomBreadcrumbsExampleComponent } from './custom-breadcrumbs-example.component';
import { DynamicBreadcrumbsExampleComponent } from './dynamic-breadcrumbs-example.component';
import { ExternalLinksBreadcrumbsExampleComponent } from './external-links-breadcrumbs-example.component';
import { FocusRingBreadcrumbsExampleComponent } from './focus-ring-breadcrumbs-example.component';
import { IconsBreadcrumbsExampleComponent } from './icons-breadcrumbs-example.component';
import { RtlBreadcrumbsExampleComponent } from './rtl-breadcrumbs-example.component';
import { SignalBreadcrumbsExampleComponent } from './signal-breadcrumbs-example.component';
import { TruncationBreadcrumbsExampleComponent } from './truncation-breadcrumbs-example.component';

/**
 * ExampleViewer fills the code tabs from `templateCode` and `componentCode`, read off the class
 * and never off an instance. An example publishing neither renders an empty tab and says nothing
 * about it — which is exactly how the dynamic example shipped a TS tab with no TypeScript in it,
 * its routing snippet parked in a field nothing reads.
 */
const EXAMPLES = [
	['BasicBreadcrumbsExampleComponent', BasicBreadcrumbsExampleComponent],
	['DynamicBreadcrumbsExampleComponent', DynamicBreadcrumbsExampleComponent],
	['CustomBreadcrumbsExampleComponent', CustomBreadcrumbsExampleComponent],
	['IconsBreadcrumbsExampleComponent', IconsBreadcrumbsExampleComponent],
	['RtlBreadcrumbsExampleComponent', RtlBreadcrumbsExampleComponent],
	['TruncationBreadcrumbsExampleComponent', TruncationBreadcrumbsExampleComponent],
	['CollapseBreadcrumbsExampleComponent', CollapseBreadcrumbsExampleComponent],
	['ExternalLinksBreadcrumbsExampleComponent', ExternalLinksBreadcrumbsExampleComponent],
	['FocusRingBreadcrumbsExampleComponent', FocusRingBreadcrumbsExampleComponent],
	['SignalBreadcrumbsExampleComponent', SignalBreadcrumbsExampleComponent]
] as const;

interface CodeCarrier {
	templateCode?: string;
	componentCode?: string;
}

/** Resolves the snippets the way ExampleViewer does: off the class, without constructing it. */
function snippets(ctor: Type<unknown>): CodeCarrier {
	return ctor as unknown as CodeCarrier;
}

describe('breadcrumbs examples code snippets', () => {
	it.each(EXAMPLES)('%s fills both code tabs', (_name, ctor) => {
		const code = snippets(ctor as unknown as Type<unknown>);

		expect(typeof code.templateCode).toBe('string');
		expect(code.templateCode).not.toBe('');
		expect(typeof code.componentCode).toBe('string');
		expect(code.componentCode).not.toBe('');
	});
});
