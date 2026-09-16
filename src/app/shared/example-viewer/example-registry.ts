import { Injectable, signal, Type } from '@angular/core';
import { LiveExample } from './example-registry.model';

export type { LiveExample } from './example-registry.model';

/**
 * Registro de ejemplos del proyecto.
 * Permite registrar y cargar ejemplos dinámicamente.
 * Usa signals para reactividad.
 */
@Injectable({ providedIn: 'root' })
export class ExampleRegistry {
	private _examples: Map<string, LiveExample> = new Map();

	/** Signal que emite cuando hay cambios en los ejemplos registrados */
	readonly examples = signal<LiveExample[]>([]);

	/**
	 * Registra un nuevo ejemplo
	 */
	register(example: LiveExample): void {
		this._examples.set(example.id, example);
		this._updateSignal();
	}

	/**
	 * Registra múltiples ejemplos
	 */
	registerAll(examples: LiveExample[]): void {
		examples.forEach((example) => this._examples.set(example.id, example));
		this._updateSignal();
	}

	/**
	 * Obtiene un ejemplo por su ID
	 */
	get(id: string): LiveExample | undefined {
		return this._examples.get(id);
	}

	/**
	 * Obtiene todos los ejemplos registrados
	 */
	getAll(): LiveExample[] {
		return Array.from(this._examples.values());
	}

	/**
	 * Carga el componente de un ejemplo
	 */
	async loadComponent(id: string): Promise<Type<any> | null> {
		const example = this._examples.get(id);
		if (!example) {
			console.error(`Ejemplo no encontrado: ${id}`);
			return null;
		}
		try {
			return await example.loader();
		} catch (error) {
			console.error(`Error cargando ejemplo '${id}':`, error);
			return null;
		}
	}

	/**
	 * Comprueba si un ejemplo existe
	 */
	has(id: string): boolean {
		return this._examples.has(id);
	}

	/**
	 * Refreshes the public `examples` signal from the internal registry map.
	 */
	private _updateSignal(): void {
		this.examples.set(Array.from(this._examples.values()));
	}
}
