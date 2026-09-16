import { Component, ChangeDetectionStrategy } from '@angular/core';
import { GetPipe, IsObjectPipe, IsStringPipe, UcfirstPipe, UnwrapAsyncPipe } from 'ng-hub-ui-utils';
import { Subject } from 'rxjs';

/**
 * Example demonstrating utility pipes from ng-hub-ui-utils
 */
@Component({
	selector: 'app-pipes-utils-example',
	standalone: true,
	imports: [GetPipe, IsStringPipe, IsObjectPipe, UcfirstPipe, UnwrapAsyncPipe],
	template: `
		<div class="examples-container">
			<h4>GetPipe - Access nested properties</h4>
			<div class="example-row">
				<code>user | get:'profile.name'</code>
				<span class="result">→ {{ user | get: 'profile.name' }}</span>
			</div>
			<div class="example-row">
				<code>user | get:'profile.address.city'</code>
				<span class="result">→ {{ user | get: 'profile.address.city' }}</span>
			</div>

			<h4 class="mt-4">IsStringPipe - Type checking</h4>
			<div class="example-row">
				<code>'Hello' | isString</code>
				<span class="result">→ {{ stringValue | isString }}</span>
			</div>
			<div class="example-row">
				<code>123 | isString</code>
				<span class="result">→ {{ numberValue | isString }}</span>
			</div>

			<h4 class="mt-4">IsObjectPipe - Object detection</h4>
			<div class="example-row">
				<code>{{ '{' }} a: 1 {{ '}' }} | isObject</code>
				<span class="result">→ {{ objectValue | isObject }}</span>
			</div>
			<div class="example-row">
				<code>'string' | isObject</code>
				<span class="result">→ {{ stringValue | isObject }}</span>
			</div>

			<h4 class="mt-4">UcfirstPipe - Capitalize first letter</h4>
			<div class="example-row">
				<code>'hello world' | ucfirst</code>
				<span class="result">→ {{ 'hello world' | ucfirst }}</span>
			</div>

			<h4 class="mt-4">UnwrapAsyncPipe - Observable or plain value, same template</h4>
			<div class="example-row">
				<code>status$ | unwrapAsync</code>
				<span class="result">→ {{ (status$ | unwrapAsync) ?? 'nothing emitted yet' }}</span>
				<button type="button" class="btn btn-sm btn-outline-secondary" (click)="advanceStatus()">Emit next</button>
			</div>
			<div class="example-row">
				<code>'not an observable' | unwrapAsync</code>
				<span class="result">→ {{ plainValue | unwrapAsync }}</span>
			</div>
		</div>
	`,
	changeDetection: ChangeDetectionStrategy.Eager,
	styles: `
		.examples-container {
			padding: 1rem;
		}
		.example-row {
			display: flex;
			gap: 1rem;
			align-items: center;
			padding: 0.5rem;
			background: var(--hub-sys-surface-elevated, #f8f9fa);
			border-radius: 4px;
			margin-bottom: 0.5rem;
		}
		.example-row code {
			background: var(--hub-sys-state-hover-bg, #e9ecef);
			padding: 0.25rem 0.5rem;
			border-radius: 4px;
			font-family: monospace;
		}
		.result {
			color: #28a745;
			font-weight: 500;
		}
		h4 {
			margin-bottom: 0.75rem;
			color: var(--hub-sys-text-secondary, #495057);
		}
		.mt-4 {
			margin-top: 1.5rem;
		}
	`
})
export class PipesUtilsExampleComponent {
	// ===========================================
	// DATOS PARA LA DEMO
	// ===========================================

	user = {
		id: 1,
		profile: {
			name: 'John Doe',
			address: {
				city: 'New York',
				country: 'USA'
			}
		}
	};

	stringValue = 'Hello';
	numberValue = 123;
	objectValue = { a: 1 };

	/**
	 * The interesting half of `unwrapAsync`: the same expression also renders a plain value,
	 * so a template does not have to know whether the input arrived synchronously.
	 */
	readonly status$ = new Subject<string>();
	readonly plainValue = 'not an observable';

	/** The states pushed through the subject, in order. */
	private readonly states = ['queued', 'running', 'done'];
	private currentState = -1;

	/** Pushes the next state into the subject, which the pipe renders on the spot. */
	advanceStatus(): void {
		this.currentState = (this.currentState + 1) % this.states.length;
		this.status$.next(this.states[this.currentState]);
	}

	// ===========================================
	// CÓDIGO PARA LAS PESTAÑAS (OBLIGATORIO)
	// ===========================================

	static readonly templateCode = `<div class="example">
  <!-- GetPipe: Access nested properties -->
  <p>Name: {{ user | get:'profile.name' }}</p>
  <p>City: {{ user | get:'profile.address.city' }}</p>
  
  <!-- IsStringPipe -->
  @if (value | isString) {
    <p>Value is a string!</p>
  }
  
  <!-- IsObjectPipe -->
  @if (data | isObject) {
    <p>Data is an object</p>
  }
  
  <!-- UcfirstPipe -->
  <p>{{ 'hello world' | ucfirst }}</p>

  <!-- UnwrapAsyncPipe: renders an Observable or a plain value, same expression -->
  <p>{{ status$ | unwrapAsync }}</p>
  <p>{{ 'not an observable' | unwrapAsync }}</p>
</div>`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { GetPipe, IsStringPipe, IsObjectPipe, UcfirstPipe, UnwrapAsyncPipe } from 'ng-hub-ui-utils';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [GetPipe, IsStringPipe, IsObjectPipe, UcfirstPipe, UnwrapAsyncPipe],
  template: \`
    <p>{{ user | get:'profile.name' }}</p>
    @if (value | isString) {
      <span>It's a string</span>
    }
    <p>{{ 'hello' | ucfirst }}</p>

    <!-- Whether the label arrived as an Observable or as a string is the caller's business,
         not the template's — which is why an API that accepts both can stay that way. -->
    <p>{{ status$ | unwrapAsync }}</p>
  \`
})
export class ExampleComponent {
  user = {
    profile: {
      name: 'John Doe',
      address: { city: 'NYC' }
    }
  };

  value = 'test';

  status$ = new Subject<string>();
}`;
}
