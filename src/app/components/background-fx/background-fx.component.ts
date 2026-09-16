import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	ElementRef,
	NgZone,
	OnDestroy,
	PLATFORM_ID,
	afterNextRender,
	effect,
	inject,
	viewChild
} from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { FxMode, Particle, Rgb, Ring } from './background-fx.model';

export type { FxMode, Particle, Rgb, Ring } from './background-fx.model';

/** Maps each theme id to its signature pointer-reactive effect. */
const THEME_MODE: Record<string, FxMode> = {
	base: 'aurora',
	light: 'aurora',
	bootstrap: 'blueprint',
	dark: 'constellation',
	sunset: 'embers',
	forest: 'fireflies',
	mono: 'ripples',
	terminal: 'scan'
};

/**
 * Global pointer-reactive background.
 *
 * Renders a single fixed canvas behind the page content and draws a different
 * ambient effect for every theme, all tinted from the active theme's
 * `--hub-sys-gradient-*` tokens so the field re-paints itself on theme change.
 *
 * The whole engine runs outside Angular and is fully disabled under
 * `prefers-reduced-motion` (a single static frame is drawn instead).
 */
@Component({
	selector: 'hub-background-fx',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `<canvas #canvas class="hub-fx" aria-hidden="true"></canvas>`,
	styles: [
		`
			:host {
				position: fixed;
				inset: 0;
				z-index: 0;
				pointer-events: none;
				overflow: hidden;
				contain: strict;
			}

			.hub-fx {
				display: block;
				width: 100%;
				height: 100%;
			}
		`
	]
})
export class BackgroundFxComponent implements OnDestroy {
	private readonly canvasRef = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');
	private readonly themeService = inject(ThemeService);
	private readonly platformId = inject(PLATFORM_ID);
	private readonly zone = inject(NgZone);
	private readonly doc = inject(DOCUMENT);

	private ctx: CanvasRenderingContext2D | null = null;
	private rafId: number | null = null;
	private dpr = 1;
	private width = 0;
	private height = 0;

	/** Smoothed pointer focus and its raw target. */
	private readonly focus = { x: 0, y: 0 };
	private readonly target = { x: 0, y: 0 };
	/** Timestamp of the last real pointer move; drives the idle auto-orbit. */
	private lastPointerAt = 0;
	private hasPointer = false;
	private lastFrame = 0;

	private mode: FxMode = 'aurora';
	/** True on near-black themes, where additive blending reads as a glow. */
	private darkBg = false;
	private colors: Rgb[] = [
		{ r: 124, g: 58, b: 237 },
		{ r: 219, g: 39, b: 119 },
		{ r: 217, g: 119, b: 6 }
	];

	private particles: Particle[] = [];
	private rings: Ring[] = [];
	private ringTimer = 0;

	private reducedMotion = false;
	private readonly boundPointerMove = (event: PointerEvent) => this.onPointerMove(event);
	private readonly boundResize = () => this.resize();
	private readonly boundVisibility = () => this.onVisibilityChange();
	private motionQuery: MediaQueryList | null = null;
	private readonly boundMotionChange = () => this.applyReducedMotion();

	constructor() {
		// Rebuild colours and the active mode whenever the theme changes.
		effect(() => {
			const themeId = this.themeService.selectedTheme();
			if (!isPlatformBrowser(this.platformId) || !this.ctx) {
				return;
			}
			this.applyTheme(themeId);
		});

		afterNextRender(() => this.setup());
	}

	/** Stops the render loop and removes all global listeners. */
	ngOnDestroy(): void {
		this.stop();
		if (!isPlatformBrowser(this.platformId)) {
			return;
		}
		window.removeEventListener('pointermove', this.boundPointerMove);
		window.removeEventListener('resize', this.boundResize);
		this.doc.removeEventListener('visibilitychange', this.boundVisibility);
		this.motionQuery?.removeEventListener('change', this.boundMotionChange);
	}

	/** Wires the canvas, listeners and starts the render loop. */
	private setup(): void {
		const canvas = this.canvasRef().nativeElement;
		this.ctx = canvas.getContext('2d');
		if (!this.ctx) {
			return;
		}

		this.motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
		this.reducedMotion = this.motionQuery.matches;

		this.focus.x = this.target.x = window.innerWidth / 2;
		this.focus.y = this.target.y = window.innerHeight * 0.4;

		this.resize();
		this.applyTheme(this.themeService.selectedTheme());

		this.zone.runOutsideAngular(() => {
			window.addEventListener('pointermove', this.boundPointerMove, { passive: true });
			window.addEventListener('resize', this.boundResize, { passive: true });
			this.doc.addEventListener('visibilitychange', this.boundVisibility);
			this.motionQuery?.addEventListener('change', this.boundMotionChange);

			if (this.reducedMotion) {
				this.renderStaticFrame();
			} else {
				this.start();
			}
		});
	}

	/** Resolves theme colours, picks the matching mode and seeds its particles. */
	private applyTheme(themeId: string): void {
		this.colors = this.readColors();
		this.darkBg = themeId === 'dark' || themeId === 'terminal';
		const nextMode = THEME_MODE[themeId] ?? 'aurora';
		this.mode = nextMode;
		this.seedParticles();
		this.canvasRef().nativeElement.style.opacity = this.opacityForMode(nextMode);
		if (this.reducedMotion) {
			this.renderStaticFrame();
		}
	}

	/** Reads the three gradient stops from the active theme. */
	private readColors(): Rgb[] {
		const cs = getComputedStyle(this.doc.documentElement);
		const stops = [1, 2, 3].map((i) => this.hexToRgb(cs.getPropertyValue(`--hub-sys-gradient-${i}`).trim()));
		return stops.every(Boolean) ? (stops as Rgb[]) : this.colors;
	}

	/** Parses a `#rgb` / `#rrggbb` string into an RGB triplet. */
	private hexToRgb(hex: string): Rgb | null {
		const value = hex.replace('#', '');
		if (value.length === 3) {
			return {
				r: parseInt(value[0] + value[0], 16),
				g: parseInt(value[1] + value[1], 16),
				b: parseInt(value[2] + value[2], 16)
			};
		}
		if (value.length === 6) {
			return {
				r: parseInt(value.slice(0, 2), 16),
				g: parseInt(value.slice(2, 4), 16),
				b: parseInt(value.slice(4, 6), 16)
			};
		}
		return null;
	}

	/** Per-mode canvas opacity, kept ambient and readable. */
	private opacityForMode(mode: FxMode): string {
		switch (mode) {
			case 'constellation':
			case 'scan':
				return '0.6';
			case 'blueprint':
			case 'ripples':
				return '0.5';
			default:
				return '0.7';
		}
	}

	/** (Re)builds the particle/ring pools for the current mode. */
	private seedParticles(): void {
		this.particles = [];
		this.rings = [];
		const w = this.width || window.innerWidth;
		const h = this.height || window.innerHeight;
		const rand = (min: number, max: number) => min + Math.random() * (max - min);

		const counts: Partial<Record<FxMode, number>> = {
			constellation: 70,
			embers: 60,
			fireflies: 46,
			scan: 28
		};
		const count = counts[this.mode] ?? 0;

		for (let i = 0; i < count; i++) {
			this.particles.push({
				x: rand(0, w),
				y: rand(0, h),
				vx: rand(-0.25, 0.25),
				vy: this.mode === 'embers' ? rand(-0.6, -0.18) : rand(-0.25, 0.25),
				seed: rand(0, Math.PI * 2)
			});
		}
	}

	/** Starts the requestAnimationFrame render loop if not already running. */
	private start(): void {
		if (this.rafId !== null) {
			return;
		}
		this.lastFrame = performance.now();
		const loop = (now: number) => {
			this.rafId = requestAnimationFrame(loop);
			const dt = Math.min(2.5, (now - this.lastFrame) / 16.67);
			this.lastFrame = now;
			this.frame(now, dt);
		};
		this.rafId = requestAnimationFrame(loop);
	}

	/** Cancels the active render loop, if any. */
	private stop(): void {
		if (this.rafId !== null) {
			cancelAnimationFrame(this.rafId);
			this.rafId = null;
		}
	}

	/** Pauses the loop while the tab is hidden and resumes it when visible. */
	private onVisibilityChange(): void {
		if (this.reducedMotion) {
			return;
		}
		if (this.doc.hidden) {
			this.stop();
		} else {
			this.start();
		}
	}

	/**
	 * Re-evaluates the reduced-motion preference and switches between the
	 * animated loop and a single static frame accordingly.
	 */
	private applyReducedMotion(): void {
		this.reducedMotion = this.motionQuery?.matches ?? false;
		if (this.reducedMotion) {
			this.stop();
			this.renderStaticFrame();
		} else {
			this.start();
		}
	}

	/**
	 * Records the latest pointer position as the focus target and timestamps it.
	 *
	 * @param event Pointer move event from the window.
	 */
	private onPointerMove(event: PointerEvent): void {
		this.target.x = event.clientX;
		this.target.y = event.clientY;
		this.hasPointer = true;
		this.lastPointerAt = performance.now();
	}

	/** Resizes the backing canvas to the viewport and device pixel ratio. */
	private resize(): void {
		const canvas = this.canvasRef().nativeElement;
		this.dpr = Math.min(window.devicePixelRatio || 1, 1.5);
		this.width = window.innerWidth;
		this.height = window.innerHeight;
		canvas.width = Math.round(this.width * this.dpr);
		canvas.height = Math.round(this.height * this.dpr);
		if (this.ctx) {
			this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
		}
		if (this.reducedMotion) {
			this.renderStaticFrame();
		}
	}

	/** Advances and renders a single animation frame. */
	private frame(now: number, dt: number): void {
		const ctx = this.ctx;
		if (!ctx) {
			return;
		}

		// Idle / touch: drift the focus along a slow Lissajous so the field
		// stays alive when the pointer is absent.
		if (!this.hasPointer || now - this.lastPointerAt > 2600) {
			const t = now / 1000;
			this.target.x = this.width * (0.5 + 0.32 * Math.cos(t * 0.21));
			this.target.y = this.height * (0.42 + 0.26 * Math.sin(t * 0.27));
		}
		this.focus.x += (this.target.x - this.focus.x) * 0.06 * dt;
		this.focus.y += (this.target.y - this.focus.y) * 0.06 * dt;

		ctx.clearRect(0, 0, this.width, this.height);

		switch (this.mode) {
			case 'aurora':
				this.drawAurora(ctx, now);
				break;
			case 'blueprint':
				this.drawBlueprint(ctx);
				break;
			case 'constellation':
				this.drawConstellation(ctx, dt);
				break;
			case 'embers':
				this.drawEmbers(ctx, now, dt);
				break;
			case 'fireflies':
				this.drawFireflies(ctx, now, dt);
				break;
			case 'ripples':
				this.drawRipples(ctx, dt);
				break;
			case 'scan':
				this.drawScan(ctx, now, dt);
				break;
		}
	}

	/**
	 * Builds a CSS `rgba()` color string from an RGB triplet and alpha.
	 *
	 * @param c RGB triplet.
	 * @param a Alpha in the range [0, 1].
	 * @returns CSS `rgba()` color string.
	 */
	private rgba(c: Rgb, a: number): string {
		return `rgba(${c.r}, ${c.g}, ${c.b}, ${a})`;
	}

	/** Soft radial blob helper. */
	private glow(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, color: Rgb, alpha: number): void {
		const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
		grad.addColorStop(0, this.rgba(color, alpha));
		grad.addColorStop(1, this.rgba(color, 0));
		ctx.fillStyle = grad;
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, Math.PI * 2);
		ctx.fill();
	}

	// ── base ─────────────────────────────────────────────────────────────────
	/**
	 * Renders the aurora effect: orbiting gradient blobs tinted by the theme.
	 *
	 * @param ctx Canvas 2D rendering context.
	 * @param now Current timestamp in milliseconds.
	 */
	private drawAurora(ctx: CanvasRenderingContext2D, now: number): void {
		// Additive glow on dark surfaces; on light surfaces normal compositing
		// tints the page toward the theme colours instead of washing to white.
		ctx.globalCompositeOperation = this.darkBg ? 'lighter' : 'source-over';
		const alpha = this.darkBg ? 0.5 : 0.62;
		const t = now / 1000;
		const base = Math.min(this.width, this.height) * 0.42;
		const cx = this.width / 2;
		const cy = this.height / 2;
		for (let i = 0; i < 3; i++) {
			const ang = t * (0.12 + i * 0.05) + (i * Math.PI * 2) / 3;
			const orbit = base * 0.5;
			const x = cx + Math.cos(ang) * orbit + (this.focus.x - cx) * 0.35;
			const y = cy + Math.sin(ang) * orbit + (this.focus.y - cy) * 0.35;
			this.glow(ctx, x, y, base, this.colors[i], alpha);
		}
		ctx.globalCompositeOperation = 'source-over';
	}

	// ── bootstrap ──────────────────────────────────────────────────────────────
	/**
	 * Renders the blueprint effect: a dotted grid that brightens near the focus.
	 *
	 * @param ctx Canvas 2D rendering context.
	 */
	private drawBlueprint(ctx: CanvasRenderingContext2D): void {
		const gap = 40;
		const spot = 200;
		this.glow(ctx, this.focus.x, this.focus.y, spot * 1.4, this.colors[0], 0.18);
		for (let x = gap / 2; x < this.width; x += gap) {
			for (let y = gap / 2; y < this.height; y += gap) {
				const d = Math.hypot(x - this.focus.x, y - this.focus.y);
				const near = Math.max(0, 1 - d / spot);
				const alpha = 0.05 + near * 0.6;
				const size = 1 + near * 1.6;
				ctx.fillStyle = this.rgba(this.colors[1], alpha);
				ctx.beginPath();
				ctx.arc(x, y, size, 0, Math.PI * 2);
				ctx.fill();
			}
		}
	}

	// ── dark ─────────────────────────────────────────────────────────────────
	/**
	 * Renders the constellation effect: drifting nodes that link to the focus.
	 *
	 * @param ctx Canvas 2D rendering context.
	 * @param dt Frame delta time multiplier.
	 */
	private drawConstellation(ctx: CanvasRenderingContext2D, dt: number): void {
		const link = 150;
		for (const p of this.particles) {
			p.x += p.vx * dt;
			p.y += p.vy * dt;
			if (p.x < 0) p.x += this.width;
			else if (p.x > this.width) p.x -= this.width;
			if (p.y < 0) p.y += this.height;
			else if (p.y > this.height) p.y -= this.height;

			ctx.fillStyle = this.rgba(this.colors[0], 0.7);
			ctx.beginPath();
			ctx.arc(p.x, p.y, 1.4, 0, Math.PI * 2);
			ctx.fill();

			const d = Math.hypot(p.x - this.focus.x, p.y - this.focus.y);
			if (d < link) {
				ctx.strokeStyle = this.rgba(this.colors[1], (1 - d / link) * 0.5);
				ctx.lineWidth = 1;
				ctx.beginPath();
				ctx.moveTo(p.x, p.y);
				ctx.lineTo(this.focus.x, this.focus.y);
				ctx.stroke();
			}
		}
		this.glow(ctx, this.focus.x, this.focus.y, 90, this.colors[2], 0.28);
	}

	// ── sunset ─────────────────────────────────────────────────────────────────
	/**
	 * Renders the embers effect: rising, twinkling glow particles.
	 *
	 * @param ctx Canvas 2D rendering context.
	 * @param now Current timestamp in milliseconds.
	 * @param dt Frame delta time multiplier.
	 */
	private drawEmbers(ctx: CanvasRenderingContext2D, now: number, dt: number): void {
		ctx.globalCompositeOperation = this.darkBg ? 'lighter' : 'source-over';
		const boost = this.darkBg ? 1 : 1.4;
		this.glow(ctx, this.focus.x, this.focus.y, 260, this.colors[0], 0.32 * boost);
		for (const p of this.particles) {
			p.x += p.vx * dt + Math.sin(now / 900 + p.seed) * 0.3;
			p.y += p.vy * dt;
			if (p.y < -10) {
				p.y = this.height + 10;
				p.x = Math.random() * this.width;
			}
			const col = this.colors[1 + (Math.round(p.seed) % 2)];
			const twinkle = 0.4 + 0.4 * Math.sin(now / 600 + p.seed);
			this.glow(ctx, p.x, p.y, 14, col, 0.5 * twinkle * boost);
		}
		ctx.globalCompositeOperation = 'source-over';
	}

	// ── forest ─────────────────────────────────────────────────────────────────
	/**
	 * Renders the fireflies effect: glow particles gently drawn toward the focus.
	 *
	 * @param ctx Canvas 2D rendering context.
	 * @param now Current timestamp in milliseconds.
	 * @param dt Frame delta time multiplier.
	 */
	private drawFireflies(ctx: CanvasRenderingContext2D, now: number, dt: number): void {
		ctx.globalCompositeOperation = this.darkBg ? 'lighter' : 'source-over';
		const boost = this.darkBg ? 1 : 1.35;
		for (const p of this.particles) {
			const dx = this.focus.x - p.x;
			const dy = this.focus.y - p.y;
			const dist = Math.hypot(dx, dy) || 1;
			const pull = Math.min(0.04, 30 / (dist * dist));
			p.vx += (dx / dist) * pull * dt;
			p.vy += (dy / dist) * pull * dt;
			p.vx = Math.max(-0.7, Math.min(0.7, p.vx * 0.99));
			p.vy = Math.max(-0.7, Math.min(0.7, p.vy * 0.99));
			p.x += p.vx * dt;
			p.y += p.vy * dt;
			if (p.x < 0) p.x += this.width;
			else if (p.x > this.width) p.x -= this.width;
			if (p.y < 0) p.y += this.height;
			else if (p.y > this.height) p.y -= this.height;

			const twinkle = 0.35 + 0.45 * Math.sin(now / 500 + p.seed);
			const col = this.colors[Math.round(p.seed) % 3];
			this.glow(ctx, p.x, p.y, 9, col, 0.55 * twinkle * boost);
		}
		ctx.globalCompositeOperation = 'source-over';
	}

	// ── mono ─────────────────────────────────────────────────────────────────
	/**
	 * Renders the ripples effect: expanding concentric rings emitted at the focus.
	 *
	 * @param ctx Canvas 2D rendering context.
	 * @param dt Frame delta time multiplier.
	 */
	private drawRipples(ctx: CanvasRenderingContext2D, dt: number): void {
		this.ringTimer -= dt;
		if (this.ringTimer <= 0) {
			this.ringTimer = 42;
			this.rings.push({ x: this.focus.x, y: this.focus.y, radius: 0, life: 1 });
			if (this.rings.length > 7) {
				this.rings.shift();
			}
		}
		for (const ring of this.rings) {
			ring.radius += 1.4 * dt;
			ring.life -= 0.006 * dt;
		}
		this.rings = this.rings.filter((r) => r.life > 0);
		for (const ring of this.rings) {
			ctx.strokeStyle = this.rgba(this.colors[1], Math.max(0, ring.life) * 0.5);
			ctx.lineWidth = 1.2;
			ctx.beginPath();
			ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2);
			ctx.stroke();
		}
		ctx.fillStyle = this.rgba(this.colors[0], 0.5);
		ctx.beginPath();
		ctx.arc(this.focus.x, this.focus.y, 3, 0, Math.PI * 2);
		ctx.fill();
	}

	// ── terminal ───────────────────────────────────────────────────────────────
	/**
	 * Renders the scan effect: falling phosphor ticks and a pointer reticle.
	 *
	 * @param ctx Canvas 2D rendering context.
	 * @param now Current timestamp in milliseconds.
	 * @param dt Frame delta time multiplier.
	 */
	private drawScan(ctx: CanvasRenderingContext2D, now: number, dt: number): void {
		ctx.globalCompositeOperation = 'lighter';
		// Sparse falling phosphor ticks.
		for (const p of this.particles) {
			p.y += (1.4 + p.seed * 0.3) * dt;
			if (p.y > this.height + 12) {
				p.y = -12;
				p.x = Math.round(Math.random() * (this.width / 14)) * 14;
			}
			ctx.fillStyle = this.rgba(this.colors[0], 0.5);
			ctx.fillRect(p.x, p.y, 2, 10);
		}
		// Glowing reticle that tracks the pointer.
		const fx = this.focus.x;
		const fy = this.focus.y;
		this.glow(ctx, fx, fy, 70, this.colors[0], 0.3);
		ctx.strokeStyle = this.rgba(this.colors[1], 0.55);
		ctx.lineWidth = 1;
		const r = 14 + Math.sin(now / 300) * 2;
		ctx.beginPath();
		ctx.arc(fx, fy, r, 0, Math.PI * 2);
		ctx.moveTo(fx - r - 8, fy);
		ctx.lineTo(fx - r + 4, fy);
		ctx.moveTo(fx + r - 4, fy);
		ctx.lineTo(fx + r + 8, fy);
		ctx.moveTo(fx, fy - r - 8);
		ctx.lineTo(fx, fy - r + 4);
		ctx.moveTo(fx, fy + r - 4);
		ctx.lineTo(fx, fy + r + 8);
		ctx.stroke();
		ctx.globalCompositeOperation = 'source-over';
	}

	/** Draws one calm frame for reduced-motion users (no animation loop). */
	private renderStaticFrame(): void {
		const ctx = this.ctx;
		if (!ctx) {
			return;
		}
		ctx.clearRect(0, 0, this.width, this.height);
		const cx = this.width / 2;
		const cy = this.height * 0.4;
		const base = Math.min(this.width, this.height) * 0.4;
		ctx.globalCompositeOperation = 'lighter';
		this.glow(ctx, cx - base * 0.3, cy, base, this.colors[0], 0.32);
		this.glow(ctx, cx + base * 0.3, cy, base, this.colors[1], 0.28);
		ctx.globalCompositeOperation = 'source-over';
	}
}
