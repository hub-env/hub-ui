import { Component } from '@angular/core';
import { HubSkeletonComponent } from 'ng-hub-ui-skeleton';

/**
 * Inline DSL template example.
 */
@Component({
	selector: 'app-inline-template-skeleton-example',
	standalone: true,
	imports: [HubSkeletonComponent],
	template: `
		<hub-skeleton [template]="template" [params]="{ titleWidth: '44%', items: 3 }" appearance="subtle"></hub-skeleton>
	`,
	styles: `
		:host {
			display: block;
			max-width: 30rem;
		}
	`
})
export class InlineTemplateSkeletonExampleComponent {
	readonly template =
		'stack(gap:16)>line(height:18,width:{{titleWidth}})+stack(gap:10)>stack(direction:row,gap:10,align:center)>circle(size:36)+stack(gap:6,grow:1)>line(height:12,width:34%)+line(height:10,width:56%)*{{items}}';

	static readonly templateCode = `<hub-skeleton
  [template]="template"
  [params]="{ titleWidth: '44%', items: 3 }"
  appearance="subtle"
></hub-skeleton>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { HubSkeletonComponent } from 'ng-hub-ui-skeleton';

@Component({
  standalone: true,
  imports: [HubSkeletonComponent],
  template: \`
    <hub-skeleton [template]="template" [params]="{ titleWidth: '44%', items: 3 }"></hub-skeleton>
  \`
})
export class InlineTemplateSkeletonExampleComponent {
  readonly template =
    'stack(gap:16)>line(height:18,width:{{titleWidth}})+stack(gap:10)>stack(direction:row,gap:10,align:center)>circle(size:36)+stack(gap:6,grow:1)>line(height:12,width:34%)+line(height:10,width:56%)*{{items}}';
}`;
}
