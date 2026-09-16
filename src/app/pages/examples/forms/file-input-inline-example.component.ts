import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HubCurrentFile, HubFileInputComponent } from 'ng-hub-ui-forms';

/** A small stand-in for the logo a company record already has on the server. */
const STORED_LOGO =
	"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 40'%3E%3Crect width='120' height='40' rx='8' fill='%230d6efd'/%3E%3Ctext x='60' y='26' font-family='sans-serif' font-size='16' font-weight='700' fill='white' text-anchor='middle'%3EACME%3C/text%3E%3C/svg%3E";

/**
 * A one-page PDF, so the stored documents of the demo really open in a new tab. A real application
 * passes the URL its API serves the file from.
 */
const DEMO_PDF = `%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj
3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 300 144]/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>endobj
4 0 obj<</Length 46>>stream
BT /F1 18 Tf 36 72 Td (Stored document) Tj ET
endstream endobj
5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj
trailer<</Root 1 0 R>>
%%EOF`;

/**
 * `preview="inline"`: the files sit inside the field, as tiles. The logo and the contract are one
 * tile each, showing what the record already has; the avatar is the same field reshaped into a
 * circle with tokens alone. The attachments mix stored and picked files, images and documents, in
 * one grid with a limit; the scans draw every file as its kind icon, images included.
 *
 * Activating a tile opens its file, the pill replaces it, the corner button removes it. Removing or
 * replacing a stored file never touches the form value: it emits `currentFileRemoved`, which the
 * page collects as the deletions it would send on save.
 */
@Component({
	selector: 'app-forms-file-input-inline-example',
	standalone: true,
	imports: [ReactiveFormsModule, HubFileInputComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<form [formGroup]="form" style="display: grid; gap: 1.25rem; max-width: 40rem;">
			<hub-file-input
				formControlName="logo"
				label="Logo"
				accept="image/*"
				preview="inline"
				[currentFile]="storedLogo"
				(currentFileRemoved)="markForDeletion($event)"
			/>
			<hub-file-input
				formControlName="contract"
				label="Signed contract"
				accept=".pdf,.doc,.docx"
				preview="inline"
				[currentFile]="storedContract"
				(currentFileRemoved)="markForDeletion($event)"
			/>
			<hub-file-input
				formControlName="avatar"
				label="Avatar"
				accept="image/*"
				preview="inline"
				[dragDrop]="false"
				hint=""
				style="
					--hub-file-input-inline-width: 8rem;
					--hub-file-input-inline-aspect-ratio: 1;
					--hub-file-input-inline-min-height: 0;
					--hub-file-input-tile-radius: 50%;
					--hub-file-input-tile-fit: cover;
					--hub-file-input-tile-padding: 0;
				"
			/>
			<hub-file-input
				formControlName="attachments"
				label="Claim attachments"
				accept="image/*,.pdf,.doc,.docx,.xlsx,.zip"
				preview="inline"
				[multiple]="true"
				[maxFiles]="5"
				[currentFile]="storedAttachments"
				(currentFileRemoved)="markForDeletion($event)"
			/>
			<hub-file-input
				formControlName="scans"
				label="Scanned receipts (no image previews)"
				accept="image/*,.pdf"
				preview="inline"
				[multiple]="true"
				[imagePreview]="false"
			/>
			<p style="margin: 0; font-size: 0.875rem;">
				New files: {{ pickedNames() }}<br />
				Deleted on save: {{ deletions().length ? deletions().join(', ') : '—' }}
			</p>
		</form>
	`
})
export class FormsFileInputInlineExampleComponent {
	readonly #pdfUrl = URL.createObjectURL(new Blob([DEMO_PDF], { type: 'application/pdf' }));

	readonly storedLogo = STORED_LOGO;

	/** The URL says nothing about the file, so the name and type travel with it. */
	readonly storedContract: HubCurrentFile = {
		url: this.#pdfUrl,
		name: 'Service agreement 2026 — signed by both parties.pdf',
		type: 'application/pdf'
	};

	/** What the claim already has on the server: a report and a photo. */
	readonly storedAttachments: HubCurrentFile[] = [
		{ url: this.#pdfUrl, name: 'Claim report.pdf', type: 'application/pdf' },
		{ url: '/og-image.png', name: 'Damage photo.png' }
	];

	readonly form = new FormGroup({
		logo: new FormControl<File | null>(null),
		contract: new FormControl<File | null>(null),
		avatar: new FormControl<File | null>(null),
		attachments: new FormControl<File[] | null>(null),
		scans: new FormControl<File[] | null>(null)
	});

	/** The stored files the user removed or replaced, by name, as the application would collect them. */
	readonly deletions = signal<string[]>([]);

	/** The names of the files currently picked across the fields. */
	readonly pickedNames = signal('—');

	constructor() {
		inject(DestroyRef).onDestroy(() => URL.revokeObjectURL(this.#pdfUrl));

		this.form.valueChanges.subscribe((value) => {
			const names = [value.logo, value.contract, value.avatar, ...(value.attachments ?? []), ...(value.scans ?? [])]
				.filter((file): file is File => !!file)
				.map((file) => file.name);

			this.pickedNames.set(names.length ? names.join(', ') : '—');
		});
	}

	/**
	 * Records a stored file that left a field. The field has already stopped showing it; deleting it
	 * on the server is the application's decision, taken here on save.
	 *
	 * @param file - The stored file, with its name and type filled in.
	 */
	markForDeletion(file: HubCurrentFile): void {
		this.deletions.update((names) => [...names, file.name ?? file.url]);
	}

	static readonly templateCode = `<hub-file-input
  formControlName="logo"
  label="Logo"
  accept="image/*"
  preview="inline"
  [currentFile]="company.logoUrl"
  (currentFileRemoved)="markForDeletion($event)" />

<!-- An avatar is the same field, reshaped with tokens -->
<hub-file-input
  class="avatar-field"
  formControlName="avatar"
  label="Avatar"
  accept="image/*"
  preview="inline"
  [dragDrop]="false"
  hint="" />

<!-- Stored and picked files in one grid, with a limit -->
<hub-file-input
  formControlName="attachments"
  label="Claim attachments"
  accept="image/*,.pdf,.doc,.docx,.xlsx,.zip"
  preview="inline"
  [multiple]="true"
  [maxFiles]="5"
  [currentFile]="claim.attachments"
  (currentFileRemoved)="markForDeletion($event)" />

<!-- Long lists of photos: icons only, no object URLs -->
<hub-file-input
  formControlName="scans"
  label="Scanned receipts"
  accept="image/*,.pdf"
  preview="inline"
  [multiple]="true"
  [imagePreview]="false" />`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HubCurrentFile, HubFileInputComponent } from 'ng-hub-ui-forms';

@Component({
  selector: 'app-claim-files',
  standalone: true,
  imports: [ReactiveFormsModule, HubFileInputComponent],
  templateUrl: './claim-files.html'
})
export class ClaimFilesComponent {
  // Stored files are only shown; each control holds the Files the user picked.
  readonly company = { logoUrl: '/api/companies/1/logo' };
  readonly claim: { attachments: HubCurrentFile[] } = {
    attachments: [
      { url: '/api/claims/7/files/1', name: 'Claim report.pdf', type: 'application/pdf' },
      { url: '/api/claims/7/files/2', name: 'Damage photo.jpg', type: 'image/jpeg' }
    ]
  };

  readonly form = new FormGroup({
    logo: new FormControl<File | null>(null),
    avatar: new FormControl<File | null>(null),
    attachments: new FormControl<File[] | null>(null),
    scans: new FormControl<File[] | null>(null)
  });

  private readonly deletions: HubCurrentFile[] = [];

  // A stored file left a field — removed, or replaced. Delete it on the server when saving.
  markForDeletion(file: HubCurrentFile): void {
    this.deletions.push(file);
  }
}`;

	static readonly cssCode = `.avatar-field {
  --hub-file-input-inline-width: 8rem;
  --hub-file-input-inline-aspect-ratio: 1;
  --hub-file-input-inline-min-height: 0;
  --hub-file-input-tile-radius: 50%;
  --hub-file-input-tile-fit: cover;
  --hub-file-input-tile-padding: 0;
}`;
}
