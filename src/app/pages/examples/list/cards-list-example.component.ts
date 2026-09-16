import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HubListComponent, HubPaginableListItemDirective, SelectionTypes } from 'ng-hub-ui-paginable';
import type { ContactCardItem } from './cards-list.model';

export type { ContactCardItem } from './cards-list.model';

/**
 * Demonstrates the card display mode integrated into the paginable list component.
 */
@Component({
	selector: 'app-cards-list-example',
	standalone: true,
	imports: [HubListComponent, HubPaginableListItemDirective],
	template: `
		<hub-list
			class="demo-cards-list"
			[items]="items"
			[bindLabel]="'name'"
			[options]="{ display: 'cards', hoverableRows: true }"
			[selectable]="selectionTypes.Multiple"
		>
			<ng-template listItemTpt let-item="data">
				<article class="contact-card">
					<header class="contact-card__header">
						<div class="contact-card__avatar">{{ getInitials(item.name) }}</div>
						<div class="contact-card__identity">
							<h3 class="contact-card__name">{{ item.name }}</h3>
							<p class="contact-card__role">{{ item.role }}</p>
						</div>
						<span class="contact-card__status" [class.contact-card__status--offline]="item.status === 'Offline'">
							{{ item.status }}
						</span>
					</header>

					<div class="contact-card__body">
						<p><strong>Email:</strong> {{ item.email }}</p>
						<p><strong>Phone:</strong> {{ item.phone }}</p>
					</div>
				</article>
			</ng-template>
		</hub-list>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: [
		`
			.demo-cards-list {
				--hub-list-cards-min-column-width: 19rem;
				--hub-list-items-gap: 1rem;
				--hub-list-cards-padding-x: 1rem;
				--hub-list-cards-padding-y: 1rem;
				--hub-list-cards-border-radius: 1rem;
				--hub-list-cards-border-color: #dbe4f0;
				--hub-list-cards-shadow: var(--hub-sys-shadow-sm);
				--hub-list-cards-hover-bg: #f6f9fc;
				--hub-list-cards-hover-shadow: var(--hub-sys-shadow);
				--hub-list-item-selected-bg: #1d4ed8;
				--hub-list-item-selected-color: #ffffff;
			}

			.contact-card {
				display: flex;
				flex-direction: column;
				gap: 1rem;
			}

			.contact-card__header {
				display: flex;
				align-items: flex-start;
				gap: 0.875rem;
			}

			.contact-card__avatar {
				display: inline-flex;
				align-items: center;
				justify-content: center;
				width: 3rem;
				height: 3rem;
				border-radius: 999px;
				background: linear-gradient(135deg, #2563eb, #7c3aed);
				color: #ffffff;
				font-weight: 700;
				flex-shrink: 0;
			}

			.contact-card__identity {
				flex: 1 1 auto;
				min-width: 0;
			}

			.contact-card__name {
				margin: 0;
				font-size: 1rem;
				font-weight: 700;
			}

			.contact-card__role {
				margin: 0.2rem 0 0;
				color: #64748b;
				font-size: 0.9rem;
			}

			.contact-card__status {
				display: inline-flex;
				align-items: center;
				border-radius: 999px;
				background: #dcfce7;
				color: #166534;
				padding: 0.25rem 0.625rem;
				font-size: 0.75rem;
				font-weight: 600;
				white-space: nowrap;
			}

			.contact-card__status--offline {
				background: #e2e8f0;
				color: #475569;
			}

			.contact-card__body {
				display: grid;
				gap: 0.375rem;
				font-size: 0.92rem;
			}

			.contact-card__body p {
				margin: 0;
			}
		`
	]
})
export class CardsListExampleComponent {
	/** Exposes selection enum values to the template. */
	readonly selectionTypes = SelectionTypes;

	/** Demo items used in the cards list. */
	readonly items: Array<ContactCardItem> = [
		{
			id: 1,
			name: 'Marta Ruiz',
			role: 'Product Designer',
			email: 'marta.ruiz@example.com',
			phone: '+34 600 111 222',
			status: 'Available'
		},
		{
			id: 2,
			name: 'Carlos Vega',
			role: 'Frontend Engineer',
			email: 'carlos.vega@example.com',
			phone: '+34 600 333 444',
			status: 'Busy'
		},
		{
			id: 3,
			name: 'Lucia Moreno',
			role: 'Engineering Manager',
			email: 'lucia.moreno@example.com',
			phone: '+34 600 555 666',
			status: 'Available'
		},
		{
			id: 4,
			name: 'Pablo Serra',
			role: 'QA Lead',
			email: 'pablo.serra@example.com',
			phone: '+34 600 777 888',
			status: 'Offline'
		}
	];

	/** Code snippet shown in the example viewer. */
	static readonly templateCode = `<hub-list
  class="demo-cards-list"
  [items]="items"
  [bindLabel]="'name'"
  [options]="{ display: 'cards', hoverableRows: true }"
  [selectable]="selectionTypes.Multiple"
>
  <ng-template listItemTpt let-item="data">
    <article class="contact-card">
      <header class="contact-card__header">
        <div class="contact-card__avatar">{{ getInitials(item.name) }}</div>
        <div class="contact-card__identity">
          <h3 class="contact-card__name">{{ item.name }}</h3>
          <p class="contact-card__role">{{ item.role }}</p>
        </div>
        <span class="contact-card__status">{{ item.status }}</span>
      </header>
      <div class="contact-card__body">
        <p><strong>Email:</strong> {{ item.email }}</p>
        <p><strong>Phone:</strong> {{ item.phone }}</p>
      </div>
    </article>
  </ng-template>
</hub-list>`;

	/** TypeScript snippet shown in the example viewer. */
	static readonly componentCode = `import { Component } from '@angular/core';
import { HubListComponent, HubPaginableListItemDirective, SelectionTypes } from 'ng-hub-ui-paginable';

@Component({
  selector: 'app-cards-list-example',
  standalone: true,
  imports: [HubListComponent, HubPaginableListItemDirective],
  template: \`...\`
})
export class CardsListExampleComponent {
  readonly selectionTypes = SelectionTypes;
  readonly items = [...];

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((part) => part.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  }
}`;

	/** CSS snippet shown in the example viewer. */
	static readonly cssCode = `.demo-cards-list {
  --hub-list-cards-min-column-width: 19rem;
  --hub-list-items-gap: 1rem;
  --hub-list-cards-padding-x: 1rem;
  --hub-list-cards-padding-y: 1rem;
  --hub-list-cards-border-radius: 1rem;
  --hub-list-cards-shadow: var(--hub-sys-shadow-sm);
  --hub-list-cards-hover-shadow: var(--hub-sys-shadow);
}

.contact-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}`;

	/**
	 * Returns the initials shown in the card avatar.
	 *
	 * @param name Full contact name.
	 * @returns Up to two initials.
	 */
	getInitials(name: string): string {
		return name
			.split(' ')
			.map((part) => part.charAt(0).toUpperCase())
			.slice(0, 2)
			.join('');
	}
}
