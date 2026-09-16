import { Component } from '@angular/core';
import { HubSkeletonComponent } from 'ng-hub-ui-skeleton';

/**
 * Focused example that explains the compact DSL with visual outputs.
 */
@Component({
	selector: 'app-compact-dsl-skeleton-example',
	standalone: true,
	imports: [HubSkeletonComponent],
	template:
		`
		<div class="dsl-layout">
			<section class="dsl-card">
				<h4>Structure</h4>
				<p>` +
		'`+`' +
		` creates siblings and ` +
		'`>`' +
		` nests children.</p>
				<hub-skeleton [template]="templates.structure"></hub-skeleton>
			</section>

			<section class="dsl-card">
				<h4>Params & repeats</h4>
				<p>Use <code>{{ '{{param}}' }}</code> placeholders and <code>*N</code> repeaters to scale rows quickly.</p>
				<hub-skeleton [template]="templates.params" [params]="{ items: 4, titleWidth: '46%' }"></hub-skeleton>
			</section>

			<section class="dsl-card">
				<h4>Responsive values</h4>
				<p>Switch spacing or columns inline with compact breakpoint tokens.</p>
				<hub-skeleton [template]="templates.responsive"></hub-skeleton>
			</section>
		</div>
	`,
	styles: `
		:host {
			display: block;
		}

		.dsl-layout {
			display: grid;
			grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
			gap: 1rem;
		}

		.dsl-card {
			display: grid;
			gap: 0.875rem;
			padding: 1rem;
			border-radius: 1rem;
			border: 1px solid rgba(148, 163, 184, 0.2);
			background: rgba(255, 255, 255, 0.92);
		}

		.dsl-card h4 {
			margin: 0;
			font-size: 0.95rem;
		}

		.dsl-card p {
			margin: 0;
			font-size: 0.8rem;
			line-height: 1.5;
			color: #64748b;
		}
	`
})
export class CompactDslSkeletonExampleComponent {
	readonly templates = {
		structure: 'stack(gap:12)>circle(size:44)+stack(gap:8)>line(width:40%)+line(width:68%)',
		params: 'stack(gap:14)>line(height:18,width:{{titleWidth}})+stack(gap:10)>stack(direction:row,gap:10,align:center)>circle(size:34)+stack(gap:6,grow:1)>line(height:12,width:34%)+line(height:10,width:56%)*{{items}}',
		responsive: 'grid(columns:1|md=2|lg=3,gap:10|md=14|lg=18)>block(height:72,radius:16)*3'
	} as const;

	static readonly templateCode = `<hub-skeleton
  [template]="'stack(gap:12)>circle(size:44)+stack(gap:8)>line(width:40%)+line(width:68%)'"
></hub-skeleton>

<hub-skeleton
  [template]="'grid(columns:1|md=2|lg=3,gap:10|md=14|lg=18)>block(height:72,radius:16)*3'"
></hub-skeleton>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { HubSkeletonComponent } from 'ng-hub-ui-skeleton';

@Component({
  standalone: true,
  imports: [HubSkeletonComponent],
  template: \`
    <hub-skeleton [template]="templates.structure"></hub-skeleton>
    <hub-skeleton [template]="templates.responsive"></hub-skeleton>
  \`
})
export class CompactDslSkeletonExampleComponent {
  readonly templates = {
    structure: 'stack(gap:12)>circle(size:44)+stack(gap:8)>line(width:40%)+line(width:68%)',
    responsive: 'grid(columns:1|md=2|lg=3,gap:10|md=14|lg=18)>block(height:72,radius:16)*3'
  };
}`;
}
