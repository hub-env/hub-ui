import { Component, ChangeDetectionStrategy } from '@angular/core';
import { HubAvatarComponent } from 'ng-hub-ui-avatar';

/**
 * Demonstrates the avatar `badge` overlay: a plain dot (presence) coloured by a
 * semantic `badgeColor`, and a labelled badge (count / text). No manual markup.
 */
@Component({
	selector: 'app-avatar-status-example',
	standalone: true,
	imports: [HubAvatarComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<div class="d-flex flex-wrap align-items-center gap-4">
			<!-- presence dots: badge (no content) + a semantic colour -->
			<hub-avatar name="Ada Lovelace" size="56" badge badgeColor="success"></hub-avatar>
			<hub-avatar name="Grace Hopper" size="56" badge badgeColor="warning"></hub-avatar>
			<hub-avatar name="Alan Turing" size="56" badge badgeColor="danger"></hub-avatar>
			<hub-avatar name="Linus Torvalds" size="56" badge badgeColor="secondary"></hub-avatar>

			<!-- labelled badge: count / text -->
			<hub-avatar name="Carlos Morcillo" size="56" badge="4k" badgeColor="danger"></hub-avatar>
			<hub-avatar name="Jane Doe" size="56" badge="9+" badgeColor="primary"></hub-avatar>
		</div>
	`
})
export class AvatarStatusExampleComponent {
	static readonly templateCode = `<!-- presence dot: badge (no content) + a semantic colour -->
<hub-avatar name="Ada Lovelace" badge badgeColor="success"></hub-avatar>   <!-- online -->
<hub-avatar name="Grace Hopper" badge badgeColor="warning"></hub-avatar>   <!-- away -->
<hub-avatar name="Alan Turing"  badge badgeColor="danger"></hub-avatar>    <!-- busy -->
<hub-avatar name="Linus T"      badge badgeColor="secondary"></hub-avatar> <!-- offline -->

<!-- labelled badge: badge="<count / text>" -->
<hub-avatar name="Carlos M" badge="4k" badgeColor="danger"></hub-avatar>
<hub-avatar name="Jane Doe" badge="9+" badgeColor="primary"></hub-avatar>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { HubAvatarComponent } from 'ng-hub-ui-avatar';

@Component({
  selector: 'app-avatar-badge-example',
  standalone: true,
  imports: [HubAvatarComponent],
  templateUrl: './avatar-badge-example.component.html'
})
export class AvatarBadgeExampleComponent {}`;
}
