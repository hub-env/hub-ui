import { ChangeDetectionStrategy, Component, resource, signal } from '@angular/core';
import { HubButtonComponent } from 'ng-hub-ui-buttons';
import { HubListComponent, HubPaginableListItemDirective } from 'ng-hub-ui-paginable';

/** A room in the booking catalogue the fake endpoint serves. */
interface Room {
	code: string;
	name: string;
	capacity: number;
	floor: string;
}

/** Everything the fake endpoint knows, returned as one plain array. */
const CATALOGUE: Room[] = [
	{ code: 'A-01', name: 'Sala Azafrán', capacity: 12, floor: 'Ground floor' },
	{ code: 'A-02', name: 'Sala Genciana', capacity: 6, floor: 'Ground floor' },
	{ code: 'B-11', name: 'Sala Retama', capacity: 24, floor: 'First floor' },
	{ code: 'B-12', name: 'Sala Espliego', capacity: 8, floor: 'First floor' },
	{ code: 'C-21', name: 'Sala Enebro', capacity: 4, floor: 'Second floor' }
];

/**
 * The list fed by a whole `resource()` — the other half of `[resource]`, and the other shape a
 * resource value may take.
 *
 * Where the table example serves a `PaginationState`, this endpoint answers with a plain array:
 * the list renders it as the items and no page metadata is claimed. `isLoading()` draws the
 * loading state and `error()` the error state, so the collection, the wait and the failure travel
 * in a single binding instead of `[items]`, `[loading]` and `[error]` kept in step by hand.
 *
 * Break the endpoint and reload to see the failure surface, then mend it: the rooms come back
 * with no extra wiring on either side.
 */
@Component({
	selector: 'app-list-resource-example',
	// A fake loader on a timer registers no pending task, so prerendering serialises one state and
	// the browser starts in another. A real httpResource holds SSR until it answers; this one cannot,
	// and the demo exists to show the wait, so hydration is skipped for this subtree only.
	host: { ngSkipHydration: 'true' },
	standalone: true,
	imports: [HubListComponent, HubPaginableListItemDirective, HubButtonComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<div class="d-flex flex-wrap align-items-center gap-2 mb-3">
			<button type="button" hubButton variant="outline" color="primary" size="sm" (click)="rooms.reload()">Reload</button>
			<button
				type="button"
				hubButton
				variant="outline"
				[color]="broken() ? 'success' : 'danger'"
				size="sm"
				(click)="broken.set(!broken())"
			>
				{{ broken() ? 'Mend the endpoint' : 'Break the endpoint' }}
			</button>
			<span class="badge text-bg-secondary text-uppercase">{{ rooms.status() }}</span>
		</div>

		<hub-list [resource]="rooms" [bindLabel]="'name'">
			<ng-template listItemTpt let-room="data">
				<div class="d-flex align-items-center justify-content-between gap-3 p-2">
					<div>
						<h6 class="mb-0">{{ room.name }}</h6>
						<small class="text-muted">{{ room.code }} · {{ room.floor }}</small>
					</div>
					<span class="badge text-bg-light">{{ room.capacity }} seats</span>
				</div>
			</ng-template>
		</hub-list>
	`,
	styles: []
})
export class ResourceListExampleComponent {
	/** Whether the fake endpoint should reject, so the error state can be seen on demand. */
	protected readonly broken = signal(false);

	/**
	 * A plain `resource()` whose value is an array. `[resource]` is typed by shape, so an
	 * `httpResource()` — or anything exposing `value`, `isLoading` and `error` — fits the same way.
	 */
	protected readonly rooms = resource<Room[], { broken: boolean }>({
		params: () => ({ broken: this.broken() }),
		loader: ({ params }) => this.fetchRooms(params.broken)
	});

	/**
	 * Stands in for the HTTP call, latency and all, so the loading state lasts long enough to be
	 * seen. A real loader would be one `fetch` and no timer.
	 *
	 * @param broken Whether this request should fail instead of answering.
	 * @returns The whole catalogue, as a plain array.
	 */
	private fetchRooms(broken: boolean): Promise<Room[]> {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				if (broken) {
					reject(new Error('The booking service is not answering'));
					return;
				}
				resolve(CATALOGUE);
			}, 700);
		});
	}

	static readonly templateCode = `<button hubButton (click)="rooms.reload()">Reload</button>

<!-- The array, the wait and the failure all arrive through one binding -->
<hub-list [resource]="rooms" [bindLabel]="'name'">
  <ng-template listItemTpt let-room="data">
    <div class="d-flex align-items-center justify-content-between gap-3 p-2">
      <div>
        <h6 class="mb-0">{{ room.name }}</h6>
        <small class="text-muted">{{ room.code }} · {{ room.floor }}</small>
      </div>
      <span class="badge text-bg-light">{{ room.capacity }} seats</span>
    </div>
  </ng-template>
</hub-list>`;

	static readonly componentCode = `import { Component, resource } from '@angular/core';
import { HubListComponent, HubPaginableListItemDirective } from 'ng-hub-ui-paginable';

@Component({
  standalone: true,
  imports: [HubListComponent, HubPaginableListItemDirective],
  templateUrl: './rooms.component.html'
})
export class RoomsComponent {
  // A value that is a plain array becomes the items and claims no page metadata.
  // Return a PaginationState instead and the list also takes page, size and total.
  readonly rooms = resource<Room[], unknown>({
    loader: () =>
      fetch('/api/rooms').then((response) => {
        if (!response.ok) {
          throw new Error('The booking service is not answering');
        }
        return response.json();
      })
  });
}`;
}
