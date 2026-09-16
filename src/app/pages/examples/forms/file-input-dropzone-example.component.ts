import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HubFileInputComponent, HubFileRejection, hubMaxFileSize, hubMaxFiles } from 'ng-hub-ui-forms';

const MAX_SIZE = 2 * 1024 * 1024;

/**
 * Multi-file `hub-file-input` with drag-and-drop, image thumbnails in a grid, and every constraint
 * enforced twice: as component inputs (offending files are filtered and reported through
 * `(rejected)`) and as validators (a value patched in from elsewhere makes the control invalid).
 */
@Component({
	selector: 'app-forms-file-input-dropzone-example',
	standalone: true,
	imports: [ReactiveFormsModule, HubFileInputComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	template: `
		<form [formGroup]="form" style="display: grid; gap: 1.25rem; max-width: 36rem;">
			<hub-file-input
				formControlName="gallery"
				label="Gallery"
				[multiple]="true"
				accept="image/*"
				[maxSize]="maxSize"
				[maxFiles]="3"
				preview="grid"
				(rejected)="onRejected($event)"
			/>

			@if (lastRejections().length) {
				<ul style="margin: 0; padding-left: 1.25rem; color: var(--hub-sys-color-danger); font-size: 0.875rem;">
					@for (rejection of lastRejections(); track rejection.file.name) {
						<li>{{ rejection.file.name }} — rejected: {{ rejection.reason }}</li>
					}
				</ul>
			}
		</form>
	`
})
export class FormsFileInputDropzoneExampleComponent {
	readonly maxSize = MAX_SIZE;

	readonly form = new FormGroup({
		gallery: new FormControl<File[]>([], [hubMaxFiles(3), hubMaxFileSize(MAX_SIZE)])
	});

	/** The files refused by the last drop, so the demo can show why. */
	readonly lastRejections = signal<HubFileRejection[]>([]);

	/**
	 * Records the files the component refused.
	 *
	 * @param rejections - The refused files and the constraint each one violated.
	 */
	onRejected(rejections: HubFileRejection[]): void {
		this.lastRejections.set(rejections);
	}

	static readonly templateCode = `<hub-file-input
  formControlName="gallery"
  label="Gallery"
  [multiple]="true"
  accept="image/*"
  [maxSize]="2 * 1024 * 1024"
  [maxFiles]="3"
  preview="grid"
  (rejected)="onRejected($event)" />`;

	static readonly componentCode = `import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HubFileInputComponent, HubFileRejection, hubMaxFileSize, hubMaxFiles } from 'ng-hub-ui-forms';

const MAX_SIZE = 2 * 1024 * 1024;

@Component({
  selector: 'app-file-input-dropzone',
  standalone: true,
  imports: [ReactiveFormsModule, HubFileInputComponent],
  templateUrl: './file-input-dropzone.html'
})
export class FileInputDropzoneComponent {
  // Two layers, on purpose:
  //   · the inputs FILTER — an offending file never enters the value, and surfaces in (rejected);
  //   · the validators INVALIDATE — they also catch a value patched in programmatically.
  readonly form = new FormGroup({
    gallery: new FormControl<File[]>([], [hubMaxFiles(3), hubMaxFileSize(MAX_SIZE)])
  });

  readonly lastRejections = signal<HubFileRejection[]>([]);

  onRejected(rejections: HubFileRejection[]): void {
    this.lastRejections.set(rejections);
  }
}`;
}
