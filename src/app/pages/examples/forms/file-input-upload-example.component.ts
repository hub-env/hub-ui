import { ChangeDetectionStrategy, Component, Injectable } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { concat, Observable, of, timer } from 'rxjs';
import { map, switchMap, takeWhile } from 'rxjs/operators';
import { HUB_FILE_UPLOADER, HubFileInputComponent, HubFileUploadEvent, HubFileUploader } from 'ng-hub-ui-forms';

/**
 * Demo uploader standing in for a real HTTP call: it streams progress and then fails for any file
 * whose name contains `fail`, so the retry path can be exercised without a backend.
 *
 * A real implementation wraps `HttpClient` with `{ reportProgress: true, observe: 'events' }` and
 * maps `HttpEventType.UploadProgress` onto `{ status: 'progress', loaded, total }`.
 *
 * It is a COLD observable: one subscription is one upload, so unsubscribing cancels it.
 */
@Injectable()
export class DemoFileUploader implements HubFileUploader {
	upload(file: File): Observable<HubFileUploadEvent> {
		const ticks = timer(0, 220).pipe(
			takeWhile((tick) => tick <= 10),
			map((tick) => ({ status: 'progress', loaded: tick * 10, total: 100 }) as HubFileUploadEvent)
		);

		const settle = of(null).pipe(
			switchMap(() =>
				of(
					file.name.includes('fail')
						? ({ status: 'error', error: new Error('The server rejected the file.') } as HubFileUploadEvent)
						: ({ status: 'done', response: { id: file.name } } as HubFileUploadEvent)
				)
			)
		);

		return concat(ticks, settle);
	}
}

/**
 * `hub-file-input` wired to an uploader: files upload as soon as they are accepted, each row shows
 * its own progress bar, and a failed upload can be retried. Name a file `*fail*` to see the error.
 */
@Component({
	selector: 'app-forms-file-input-upload-example',
	standalone: true,
	imports: [ReactiveFormsModule, HubFileInputComponent],
	changeDetection: ChangeDetectionStrategy.Eager,
	// `provideHubFileUploader()` returns EnvironmentProviders for the app bootstrap; at component
	// level the token is bound directly, which scopes the uploader to this subtree.
	providers: [DemoFileUploader, { provide: HUB_FILE_UPLOADER, useExisting: DemoFileUploader }],
	template: `
		<form [formGroup]="form" style="display: grid; gap: 1.25rem; max-width: 36rem;">
			<hub-file-input
				formControlName="attachments"
				label="Attachments"
				[multiple]="true"
				formText="Uploads start automatically. Rename a file to include “fail” to see the retry button."
			/>
		</form>
	`
})
export class FormsFileInputUploadExampleComponent {
	readonly form = new FormGroup({
		attachments: new FormControl<File[]>([])
	});

	static readonly templateCode = `<hub-file-input
  formControlName="attachments"
  label="Attachments"
  [multiple]="true" />`;

	static readonly componentCode = `import { HttpClient, HttpEventType } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, filter, map, Observable, of } from 'rxjs';
import { HubFileUploadEvent, HubFileUploader, provideHubFileUploader } from 'ng-hub-ui-forms';

// The library ships the CONTRACT, never the transport: the endpoint, the field name,
// the headers and the retry policy are yours.
@Injectable({ providedIn: 'root' })
export class ApiFileUploader implements HubFileUploader {
  readonly #http = inject(HttpClient);

  upload(file: File): Observable<HubFileUploadEvent> {
    const body = new FormData();
    body.append('file', file);

    return this.#http.post('/api/files', body, { reportProgress: true, observe: 'events' }).pipe(
      map((event) => {
        if (event.type === HttpEventType.UploadProgress) {
          // \`total\` is undefined when the size is unknown — pass null, not 0, so the bar
          // renders indeterminate instead of looking stalled.
          return { status: 'progress', loaded: event.loaded, total: event.total ?? null } as const;
        }
        if (event.type === HttpEventType.Response) {
          return { status: 'done', response: event.body } as const;
        }
        return null;
      }),
      filter((event) => event !== null),
      catchError((error) => of({ status: 'error', error } as const))
    );
  }
}

// bootstrapApplication(App, { providers: [provideHttpClient(), provideHubFileUploader(ApiFileUploader)] });`;
}
