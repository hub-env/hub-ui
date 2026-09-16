import { Component } from '@angular/core';
import { HUB_SKELETON_PRESETS, HubSkeletonComponent, HubSkeletonPresetRegistryService } from 'ng-hub-ui-skeleton';

/**
 * Example showing per-component preset registration.
 *
 * Scoping a catalogue to one subtree means owning the registry there as well: the shared
 * root instance only reads the presets registered on the environment injector, so a token
 * provided on this element alone would never reach it.
 */
@Component({
	selector: 'app-custom-preset-skeleton-example',
	standalone: true,
	imports: [HubSkeletonComponent],
	providers: [
		HubSkeletonPresetRegistryService,
		{
			provide: HUB_SKELETON_PRESETS,
			multi: true,
			useValue: [
				{
					name: 'profile-card',
					template:
						'stack(gap:18,align:center)>circle(size:76)+line(height:18,width:48%)+line(height:12,width:62%)+grid(columns:2|md=4,gap:10)>block(height:58,radius:14)*4'
				}
			]
		}
	],
	template: `<hub-skeleton preset="profile-card"></hub-skeleton>`,
	styles: `
		:host {
			display: block;
			max-width: 30rem;
		}
	`
})
export class CustomPresetSkeletonExampleComponent {
	static readonly templateCode = `<hub-skeleton preset="profile-card"></hub-skeleton>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { HUB_SKELETON_PRESETS, HubSkeletonComponent, HubSkeletonPresetRegistryService } from 'ng-hub-ui-skeleton';

@Component({
  standalone: true,
  imports: [HubSkeletonComponent],
  providers: [
    HubSkeletonPresetRegistryService,
    {
      provide: HUB_SKELETON_PRESETS,
      multi: true,
      useValue: [
        {
          name: 'profile-card',
          template:
            'stack(gap:18,align:center)>circle(size:76)+line(height:18,width:48%)+line(height:12,width:62%)+grid(columns:2|md=4,gap:10)>block(height:58,radius:14)*4'
        }
      ]
    }
  ],
  template: \`<hub-skeleton preset="profile-card"></hub-skeleton>\`
})
export class CustomPresetSkeletonExampleComponent {}`;
}
