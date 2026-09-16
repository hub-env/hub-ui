import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Options, SortableDirective } from 'ng-hub-ui-sortable';
import { FeatureExample } from '../../../../../models/interfaces';
import { ExampleContainerComponent } from '../../../../components/shared/example-container/example-container.component';

/**
 * Demonstrates transferring items between connected sortable lists using the SortableJS
 * `group` option, including clone factories and asymmetric pull/put rules.
 */
@Component({
	selector: 'app-multiple-lists',
	standalone: true,
	imports: [ExampleContainerComponent, SortableDirective, JsonPipe],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<app-example-container
			title="Sortable - Multiple Lists"
			description="Connect lists with the group option to transfer items across containers. Build kanban boards, clone factories and constrained drop targets."
		>
			<div slot="demo">
				<h5 class="mb-3">Transfer between lists</h5>
				<div class="row">
					<div class="col-sm-6">
						<ul class="list-group sortable" [hubSortable]="normalList1" [options]="normalOptions">
							@for (item of normalList1; track item) {
								<li class="list-group-item">Element {{ item }}</li>
							}
						</ul>
						<div class="mt-2">
							<code>{{ normalList1 | json }}</code>
						</div>
					</div>
					<div class="col-sm-6">
						<ul class="list-group sortable" [hubSortable]="normalList2" [options]="normalOptions">
							@for (item of normalList2; track item) {
								<li class="list-group-item">Element {{ item }}</li>
							}
						</ul>
						<div class="mt-2">
							<code>{{ normalList2 | json }}</code>
						</div>
					</div>
				</div>

				<h5 class="mt-4 mb-3">Clone items</h5>
				<p class="text-muted small">List 1 is a clone factory; list 2 is its target.</p>
				<div class="row">
					<div class="col-sm-6">
						<ul class="list-group sortable" [hubSortable]="cloneList1" [options]="clone1Options">
							@for (item of cloneList1; track item) {
								<li class="list-group-item">Element {{ item }}</li>
							}
						</ul>
					</div>
					<div class="col-sm-6">
						<ul class="list-group sortable" [hubSortable]="cloneList2" [options]="clone2Options">
							@for (item of cloneList2; track item) {
								<li class="list-group-item">Element {{ item }}</li>
							}
						</ul>
					</div>
				</div>

				<h5 class="mt-4 mb-3">Constrained groups</h5>
				<div class="row">
					<div class="col-sm-3">
						<strong class="d-block mb-2">1. Cannot accept items</strong>
						<ul class="list-group sortable" [hubSortable]="list1" [options]="list1Options">
							@for (item of list1; track item) {
								<li class="list-group-item">Element {{ item }}</li>
							}
						</ul>
					</div>
					<div class="col-sm-3">
						<strong class="d-block mb-2">2. Normal list</strong>
						<ul class="list-group sortable" [hubSortable]="list2" [options]="list2Options">
							@for (item of list2; track item) {
								<li class="list-group-item">Element {{ item }}</li>
							}
						</ul>
					</div>
					<div class="col-sm-3">
						<strong class="d-block mb-2">3. Clones children</strong>
						<ul class="list-group sortable" [hubSortable]="list3" [options]="list3Options">
							@for (item of list3; track item) {
								<li class="list-group-item">Element {{ item }}</li>
							}
						</ul>
					</div>
					<div class="col-sm-3">
						<strong class="d-block mb-2">4. Only #1 can drop here</strong>
						<ul class="list-group sortable" [hubSortable]="list4" [options]="list4Options">
							@for (item of list4; track item) {
								<li class="list-group-item">Element {{ item }}</li>
							}
						</ul>
					</div>
				</div>
			</div>
		</app-example-container>
	`,
	styles: [
		`
			.sortable {
				background: var(--hub-ref-surface-2, #eee);
				border-radius: 0.25rem;
				min-height: 40px;
			}
		`
	]
})
export class MultipleListsComponent implements FeatureExample {
	title = 'Multiple Lists';
	description = 'Transfer items between connected lists with the SortableJS group option.';
	import = `import { Options, SortableDirective } from 'ng-hub-ui-sortable';`;

	// normal groups
	normalList1 = ['1', '2', '3', '4', '5'];
	normalList2 = ['6', '7', '8', '9', '10'];
	normalOptions: Options = {
		group: 'normal-group'
	};

	// clone groups
	cloneList1 = ['1', '2', '3', '4', '5'];
	cloneList2 = ['6', '7', '8', '9', '10'];
	clone1Options: Options = {
		group: {
			name: 'clone-group',
			pull: 'clone',
			put: false
		}
	};
	clone2Options: Options = {
		group: 'clone-group'
	};

	// constrained groups
	list1 = ['1', '2', '3', '4', '5'];
	list2 = ['6', '7', '8', '9', '10'];
	list3 = ['11', '12'];
	list4 = ['13'];

	list1Options: Options = {
		group: {
			name: 'group1',
			put: false
		}
	};
	list2Options: Options = {
		group: {
			name: 'group2',
			put: ['group1', 'group2']
		}
	};
	list3Options: Options = {
		group: {
			name: 'group2',
			pull: 'clone',
			put: ['group1', 'group2'],
			revertClone: true
		}
	};
	list4Options: Options = {
		group: {
			name: 'group2',
			put: ['group1']
		}
	};

	static readonly templateCode = `<div class="row">
	<ul class="col list-group" [hubSortable]="listA" [options]="groupOptions">
		@for (item of listA; track item) {
			<li class="list-group-item">Element {{ item }}</li>
		}
	</ul>
	<ul class="col list-group" [hubSortable]="listB" [options]="groupOptions">
		@for (item of listB; track item) {
			<li class="list-group-item">Element {{ item }}</li>
		}
	</ul>
</div>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { Options, SortableDirective } from 'ng-hub-ui-sortable';

@Component({
	selector: 'app-example',
	standalone: true,
	imports: [SortableDirective],
	templateUrl: './example.component.html'
})
export class ExampleComponent {
	listA = ['1', '2', '3'];
	listB = ['4', '5', '6'];
	groupOptions: Options = { group: 'shared' };
}`;

	/** FeatureExample mirror of the static template snippet. */
	template = MultipleListsComponent.templateCode;

	/** FeatureExample mirror of the static component snippet. */
	component = MultipleListsComponent.componentCode;
}
