/**
 * Type definitions for the pointer-reactive background effect component.
 */

/** RGB triplet resolved from a theme gradient token. */
export interface Rgb {
	/** Red channel in the range [0, 255]. */
	r: number;
	/** Green channel in the range [0, 255]. */
	g: number;
	/** Blue channel in the range [0, 255]. */
	b: number;
}

/** A lightweight particle shared by several render modes. */
export interface Particle {
	/** Horizontal position in CSS pixels. */
	x: number;
	/** Vertical position in CSS pixels. */
	y: number;
	/** Horizontal velocity in CSS pixels per frame step. */
	vx: number;
	/** Vertical velocity in CSS pixels per frame step. */
	vy: number;
	/** Per-particle phase used for twinkle/size variation. */
	seed: number;
}

/** An expanding ripple ring (mono mode). */
export interface Ring {
	/** Horizontal center in CSS pixels. */
	x: number;
	/** Vertical center in CSS pixels. */
	y: number;
	/** Current radius in CSS pixels. */
	radius: number;
	/** Remaining life in the range [1, 0]. */
	life: number;
}

/** The distinct background flavours, one per documentation theme. */
export type FxMode = 'aurora' | 'blueprint' | 'constellation' | 'embers' | 'fireflies' | 'ripples' | 'scan';
