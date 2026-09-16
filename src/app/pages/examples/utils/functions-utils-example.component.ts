import { Component, ChangeDetectionStrategy } from '@angular/core';
import { equals, getValue, interpolateString, isDefined, isNumber, isString, padNumber, removeAccents } from 'ng-hub-ui-utils';

/**
 * Example demonstrating utility functions from ng-hub-ui-utils
 */
@Component({
	selector: 'app-functions-utils-example',
	standalone: true,
	imports: [],
	template: `
		<div class="examples-container">
			<h4>Type Guards</h4>
			<div class="example-row">
				<code>isString('hello')</code>
				<span class="result">→ {{ isStringResult }}</span>
			</div>
			<div class="example-row">
				<code>isNumber(42)</code>
				<span class="result">→ {{ isNumberResult }}</span>
			</div>
			<div class="example-row">
				<code>isDefined(null)</code>
				<span class="result">→ {{ isDefinedNullResult }}</span>
			</div>
			<div class="example-row">
				<code>isDefined('value')</code>
				<span class="result">→ {{ isDefinedValueResult }}</span>
			</div>

			<h4 class="mt-4">Deep Equality</h4>
			<div class="example-row">
				<code>equals({{ '{' }}a:1{{ '}' }}, {{ '{' }}a:1{{ '}' }})</code>
				<span class="result">→ {{ equalsResult }}</span>
			</div>
			<div class="example-row">
				<code>equals([1,2], [1,2])</code>
				<span class="result">→ {{ equalsArrayResult }}</span>
			</div>

			<h4 class="mt-4">Object Access</h4>
			<div class="example-row">
				<code>getValue(user, 'profile.name')</code>
				<span class="result">→ {{ getValueResult }}</span>
			</div>

			<h4 class="mt-4">String Interpolation</h4>
			<div class="example-row">
				<code>interpolateString('Hello {{ '{{' }}name{{ '}}' }}', {{ '{' }}name: 'World'{{ '}' }})</code>
				<span class="result">→ {{ interpolateResult }}</span>
			</div>

			<h4 class="mt-4">String Utilities</h4>
			<div class="example-row">
				<code>removeAccents('Ñoño café')</code>
				<span class="result">→ {{ removeAccentsResult }}</span>
			</div>
			<div class="example-row">
				<code>padNumber(5)</code>
				<span class="result">→ {{ padNumberResult }}</span>
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
			border: 1px solid var(--hub-sys-border-color-default, var(--hub-sys-border-color-default, #dee2e6));
			border-radius: 4px;
			margin-bottom: 0.5rem;
			flex-wrap: wrap;
		}
		.example-row code {
			background: var(--hub-sys-state-hover-bg, #e9ecef);
			padding: 0.25rem 0.5rem;
			border-radius: 4px;
			font-family: monospace;
		}
		.result {
			color: var(--hub-sys-color-success, #198754);
			font-weight: 500;
		}
		h4 {
			margin-bottom: 0.75rem;
			color: var(--hub-sys-text-primary, #212529);
		}
		.mt-4 {
			margin-top: 1.5rem;
		}
	`
})
export class FunctionsUtilsExampleComponent {
	// ===========================================
	// DATOS PARA LA DEMO
	// ===========================================

	user = {
		profile: {
			name: 'John Doe',
			email: 'john@example.com'
		}
	};

	// Type guards
	isStringResult = isString('hello');
	isNumberResult = isNumber(42);
	isDefinedNullResult = isDefined(null);
	isDefinedValueResult = isDefined('value');

	// Equality
	equalsResult = equals({ a: 1 }, { a: 1 });
	equalsArrayResult = equals([1, 2], [1, 2]);

	// Object access
	getValueResult = getValue(this.user, 'profile.name');

	// String utilities
	interpolateResult = interpolateString('Hello {{name}}', { name: 'World' });
	removeAccentsResult = removeAccents('Ñoño café');
	padNumberResult = padNumber(5);

	// ===========================================
	// CÓDIGO PARA LAS PESTAÑAS (OBLIGATORIO)
	// ===========================================

	static readonly templateCode = `<!-- Using utility functions in component -->
<p>Name: {{ userName }}</p>
<p>Greeting: {{ greeting }}</p>

@if (isValidString) {
  <p>Value is a valid string</p>
}`;

	static readonly componentCode = `import { Component } from '@angular/core';
import { 
  isString, 
  isDefined, 
  equals, 
  getValue, 
  interpolateString,
  removeAccents 
} from 'ng-hub-ui-utils';

@Component({
  selector: 'app-example',
  standalone: true,
  template: \`
    <p>Name: {{ userName }}</p>
    <p>Greeting: {{ greeting }}</p>
  \`
})
export class ExampleComponent {
  user = {
    profile: { name: 'John Doe' }
  };

  // Type guards
  isValidString = isString(this.someValue) && isDefined(this.someValue);
  
  // Deep equality check
  hasChanged = !equals(this.original, this.current);
  
  // Access nested properties safely
  userName = getValue(this.user, 'profile.name');
  
  // String interpolation
  greeting = interpolateString('Hello {{name}}!', { name: 'World' });
  
  // Remove accents for search
  searchable = removeAccents('Café résumé');
}`;
}
