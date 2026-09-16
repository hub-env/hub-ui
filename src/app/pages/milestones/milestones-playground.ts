import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { HubMilestoneComponent, HubMilestonesComponent, HubMilestonesOrientation } from 'ng-hub-ui-milestones';
import { PlaygroundConfig } from '../../shared/playground/playground.interface';

/**
 * Thin, SSR-safe preview wrapper for the milestones playground.
 *
 * `hub-milestones` works through content projection, which the generic playground host cannot
 * synthesise from a flat input map. This wrapper renders a canonical four-step timeline and
 * re-exposes the configurable surface (currently `orientation`) as its own `input()`, so the
 * playground can drive it like any other previewed component.
 */
@Component({
	selector: 'app-milestones-playground-preview',
	standalone: true,
	imports: [HubMilestonesComponent, HubMilestoneComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<hub-milestones [orientation]="orientation()">
			<hub-milestone state="complete">
				<h4 style="margin: 0; font-size: 0.95rem;">Information</h4>
				<p style="margin: 0.25rem 0 0; color: var(--hub-milestone-body-muted); font-size: 0.85rem;">
					Account verified.
				</p>
			</hub-milestone>
			<hub-milestone state="complete">
				<h4 style="margin: 0; font-size: 0.95rem;">Shipping</h4>
				<p style="margin: 0.25rem 0 0; color: var(--hub-milestone-body-muted); font-size: 0.85rem;">
					Address confirmed.
				</p>
			</hub-milestone>
			<hub-milestone state="active">
				<h4 style="margin: 0; font-size: 0.95rem;">Payment</h4>
				<p style="margin: 0.25rem 0 0; color: var(--hub-milestone-body-muted); font-size: 0.85rem;">In progress.</p>
			</hub-milestone>
			<hub-milestone state="pending">
				<h4 style="margin: 0; font-size: 0.95rem;">Review</h4>
				<p style="margin: 0.25rem 0 0; color: var(--hub-milestone-body-muted); font-size: 0.85rem;">Last step.</p>
			</hub-milestone>
		</hub-milestones>
	`
})
export class MilestonesPlaygroundPreviewComponent {
	/** Layout direction forwarded to the inner `hub-milestones`. */
	readonly orientation = input<HubMilestonesOrientation>('vertical');
}

/**
 * Interactive playground definitions for the ng-hub-ui-milestones documentation page.
 * Drives the canonical timeline wrapper above; the generated snippet reflects the chosen
 * orientation against the real `hub-milestones` API.
 */
export const MILESTONES_PLAYGROUND: PlaygroundConfig[] = [
	{
		id: 'milestones',
		title: 'Milestones',
		tag: 'hub-milestones',
		description:
			'A timeline / progress-steps container. Switch the orientation and theme the nodes, connector and spacing live.',
		component: MilestonesPlaygroundPreviewComponent,
		controls: [
			{
				name: 'orientation',
				label: 'Orientation',
				type: 'select',
				default: 'vertical',
				options: [
					{ label: 'vertical', value: 'vertical' },
					{ label: 'horizontal', value: 'horizontal' }
				]
			}
		],
		cssVariables: [
			{ name: '--hub-milestone-node-color', label: 'Node color', type: 'color', default: '#7c3aed' },
			{ name: '--hub-milestone-node-text', label: 'Node text', type: 'color', default: '#ffffff' },
			{ name: '--hub-milestone-pending-bg', label: 'Pending node bg', type: 'color', default: '#f1f3f5' },
			{ name: '--hub-milestone-pending-color', label: 'Pending node text', type: 'color', default: '#6c757d' },
			{ name: '--hub-milestone-pending-border', label: 'Pending node border', type: 'color', default: '#dee2e6' },
			{ name: '--hub-milestone-error-bg', label: 'Error node bg', type: 'color', default: '#dc3545' },
			{ name: '--hub-milestone-node-size', label: 'Node size', type: 'text', default: '2.75rem' },
			{ name: '--hub-milestone-connector-thickness', label: 'Connector thickness', type: 'text', default: '3px' },
			{
				name: '--hub-milestone-connector-bg',
				label: 'Connector fill',
				type: 'text',
				default: 'var(--hub-milestone-node-color)'
			},
			{ name: '--hub-milestone-connector-pending-bg', label: 'Pending connector fill', type: 'text', default: '#dee2e6' },
			{ name: '--hub-milestone-gap', label: 'Node / body gap', type: 'text', default: '1rem' },
			{ name: '--hub-milestone-spacing', label: 'Step spacing', type: 'text', default: '1.75rem' }
		],
		codeTemplate: (inputs) => {
			const orientation = String(inputs['orientation'] ?? 'vertical');
			return `<hub-milestones orientation="${orientation}">
  <hub-milestone state="complete">
    <h4>Information</h4>
    <p>Account verified.</p>
  </hub-milestone>
  <hub-milestone state="complete">
    <h4>Shipping</h4>
    <p>Address confirmed.</p>
  </hub-milestone>
  <hub-milestone state="active">
    <h4>Payment</h4>
    <p>In progress.</p>
  </hub-milestone>
  <hub-milestone state="pending">
    <h4>Review</h4>
    <p>Last step.</p>
  </hub-milestone>
</hub-milestones>`;
		}
	}
];
