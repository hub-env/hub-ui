import { Component, input, ChangeDetectionStrategy } from '@angular/core';

/**
 * Inline SVG brand logo component.
 * Renders the full logo or the icon-only variant based on the `collapsed` input.
 * Colors respond to CSS variables `--hub-logo-from` and `--hub-logo-to`,
 * which can be driven by the active theme.
 */
@Component({
	selector: 'app-brand-logo',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		class: 'app-brand-logo',
		'[class.app-brand-logo--collapsed]': 'collapsed()'
	},
	template: `
		@if (collapsed()) {
			<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 178.78 243.95">
				<defs>
					<linearGradient
						id="hub-icon-g1"
						x1="33.98"
						y1="124.52"
						x2="6.39"
						y2="-47.78"
						gradientUnits="userSpaceOnUse"
					>
						<stop offset="0" stop-color="var(--hub-logo-from, #191b86)" />
						<stop offset="1" stop-color="var(--hub-logo-to, #64cee7)" />
					</linearGradient>
					<linearGradient
						id="hub-icon-g2"
						x1="21.33"
						y1="127.78"
						x2="31.73"
						y2="274.74"
						gradientUnits="userSpaceOnUse"
					>
						<stop offset="0" stop-color="var(--hub-logo-from, #191b86)" />
						<stop offset="1" stop-color="var(--hub-logo-to, #64cee7)" />
					</linearGradient>
					<linearGradient
						id="hub-icon-g3"
						x1="145.36"
						y1="116.16"
						x2="166.5"
						y2="269.59"
						gradientUnits="userSpaceOnUse"
					>
						<stop offset="0" stop-color="var(--hub-logo-from, #191b86)" />
						<stop offset="1" stop-color="var(--hub-logo-to, #64cee7)" />
					</linearGradient>
					<linearGradient
						id="hub-icon-g4"
						x1="143.38"
						y1="104.71"
						x2="163.68"
						y2="-19.45"
						gradientUnits="userSpaceOnUse"
					>
						<stop offset="0" stop-color="var(--hub-logo-from, #191b86)" />
						<stop offset="1" stop-color="var(--hub-logo-to, #64cee7)" />
					</linearGradient>
					<linearGradient
						id="hub-icon-g5"
						x1="-21.24"
						y1="122.19"
						x2="222.46"
						y2="122.19"
						gradientUnits="userSpaceOnUse"
					>
						<stop offset="0" stop-color="var(--hub-logo-from, #191b86)" />
						<stop offset="1" stop-color="var(--hub-logo-to, #64cee7)" />
					</linearGradient>
				</defs>
				<path
					fill="url(#hub-icon-g1)"
					d="M1.86,115.28v-17.83l.02-67.46c0-2.78.33-5.57,1.18-8.23C5.9,12.79,13.06,5.76,22.99,4.61c12.97-1.5,24.43,8.75,25.83,21.42.09.82.1,1.65.1,2.48l-.05,59.28c0,2.56-2.08,4.63-4.63,4.62h-5.06c-15.94,0-30.26,8.88-37.32,22.87Z"
				/>
				<path
					fill="url(#hub-icon-g2)"
					d="M39.18,151.01h9.66s-.05,66.56-.05,66.56c0,5.01-1.37,9.99-4.27,14.09-11.15,15.8-37.61,12.34-42.13-9.3-.41-1.99-.56-4.02-.56-6.03v-20.91c0-7.33.95-14.64,2.8-21.73h0c5.68-13.58,19.54-22.68,34.55-22.68Z"
				/>
				<path
					fill="url(#hub-icon-g3)"
					d="M176.89,129.93v16.55s-.06,71.08-.06,71.08c0,5.01-1.38,9.99-4.27,14.09-11.16,15.8-37.62,12.34-42.14-9.3-.41-1.99-.55-4.02-.55-6.03v-61.61c0-2,1.64-3.63,3.64-3.63h6.98c15.27,0,29.06-8.15,36.4-21.15Z"
				/>
				<path
					fill="url(#hub-icon-g4)"
					d="M176.95,26.55l-.03,32.5c0,3.68-.79,7.32-2.3,10.68h0c-5.72,13.83-19.12,22.76-34.14,22.76h-10.59s0-64.45,0-64.45c0-2.78.33-5.57,1.18-8.23,2.85-8.98,10.01-16,19.93-17.16,12.97-1.5,24.44,8.75,25.83,21.42.09.82.1,1.65.1,2.48Z"
				/>
				<path
					fill="url(#hub-icon-g5)"
					d="M176.92,77.18l-.02,21.3v16c-.46,2.75-1.22,5.43-2.29,8-5.72,13.81-19.11,22.73-34.12,22.73l-101.31-.08c-15.59,0-30.09,8.72-37.34,22.07v-21.8s0-16.11,0-16.11c.51-2.07,1.43-4.14,2.31-6.18.31-.71.62-1.4.9-2.09,5.71-13.81,19.1-22.73,34.12-22.73h9.69l81.03.07h10.59c15.3,0,29.11-8.18,36.43-21.18Z"
				/>
			</svg>
		} @else {
			<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 858.29 243.95">
				<defs>
					<linearGradient
						id="hub-logo-g1"
						x1="518.6"
						y1="238.65"
						x2="366.38"
						y2="16.23"
						gradientUnits="userSpaceOnUse"
					>
						<stop offset="0" stop-color="var(--hub-logo-from, #191b86)" />
						<stop offset="1" stop-color="var(--hub-logo-to, #64cee7)" />
					</linearGradient>
					<linearGradient
						id="hub-logo-g2"
						x1="824.99"
						y1="253.68"
						x2="838.3"
						y2="-52.99"
						gradientUnits="userSpaceOnUse"
					>
						<stop offset="0" stop-color="var(--hub-logo-from, #191b86)" />
						<stop offset="1" stop-color="var(--hub-logo-to, #64cee7)" />
					</linearGradient>
					<linearGradient
						id="hub-logo-g3"
						x1="411.3"
						y1="124.18"
						x2="567.5"
						y2="124.18"
						gradientUnits="userSpaceOnUse"
					>
						<stop offset="0" stop-color="var(--hub-logo-from, #191b86)" />
						<stop offset="1" stop-color="var(--hub-logo-to, #64cee7)" />
					</linearGradient>
					<linearGradient
						id="hub-logo-g4"
						x1="259.91"
						y1="221.93"
						x2="196.8"
						y2="42.79"
						gradientUnits="userSpaceOnUse"
					>
						<stop offset="0" stop-color="var(--hub-logo-from, #191b86)" />
						<stop offset="1" stop-color="var(--hub-logo-to, #64cee7)" />
					</linearGradient>
					<linearGradient
						id="hub-logo-g5"
						x1="234.93"
						y1="263.23"
						x2="372.76"
						y2="55.69"
						gradientUnits="userSpaceOnUse"
					>
						<stop offset="0" stop-color="var(--hub-logo-from, #191b86)" />
						<stop offset="1" stop-color="var(--hub-logo-to, #64cee7)" />
					</linearGradient>
					<linearGradient
						id="hub-logo-g6"
						x1="720.76"
						y1="244.59"
						x2="525.33"
						y2="-46.79"
						gradientUnits="userSpaceOnUse"
					>
						<stop offset="0" stop-color="var(--hub-logo-from, #191b86)" />
						<stop offset="1" stop-color="var(--hub-logo-to, #64cee7)" />
					</linearGradient>
					<linearGradient
						id="hub-logo-g7"
						x1="704.17"
						y1="252.4"
						x2="791.03"
						y2="-58.12"
						gradientUnits="userSpaceOnUse"
					>
						<stop offset="0" stop-color="var(--hub-logo-from, #191b86)" />
						<stop offset="1" stop-color="var(--hub-logo-to, #64cee7)" />
					</linearGradient>
					<linearGradient
						id="hub-logo-g8"
						x1="36.24"
						y1="124.55"
						x2="8.31"
						y2="-49.85"
						gradientUnits="userSpaceOnUse"
					>
						<stop offset="0" stop-color="var(--hub-logo-from, #191b86)" />
						<stop offset="1" stop-color="var(--hub-logo-to, #64cee7)" />
					</linearGradient>
					<linearGradient
						id="hub-logo-g9"
						x1="23.44"
						y1="127.85"
						x2="33.96"
						y2="276.59"
						gradientUnits="userSpaceOnUse"
					>
						<stop offset="0" stop-color="var(--hub-logo-from, #191b86)" />
						<stop offset="1" stop-color="var(--hub-logo-to, #64cee7)" />
					</linearGradient>
					<linearGradient
						id="hub-logo-g10"
						x1="148.97"
						y1="116.09"
						x2="170.37"
						y2="271.38"
						gradientUnits="userSpaceOnUse"
					>
						<stop offset="0" stop-color="var(--hub-logo-from, #191b86)" />
						<stop offset="1" stop-color="var(--hub-logo-to, #64cee7)" />
					</linearGradient>
					<linearGradient
						id="hub-logo-g11"
						x1="146.96"
						y1="104.5"
						x2="167.51"
						y2="-21.17"
						gradientUnits="userSpaceOnUse"
					>
						<stop offset="0" stop-color="var(--hub-logo-from, #191b86)" />
						<stop offset="1" stop-color="var(--hub-logo-to, #64cee7)" />
					</linearGradient>
					<linearGradient
						id="hub-logo-g12"
						x1="-19.65"
						y1="122.19"
						x2="227.01"
						y2="122.19"
						gradientUnits="userSpaceOnUse"
					>
						<stop offset="0" stop-color="var(--hub-logo-from, #191b86)" />
						<stop offset="1" stop-color="var(--hub-logo-to, #64cee7)" />
					</linearGradient>
				</defs>
				<path
					fill="url(#hub-logo-g1)"
					d="M493.81,118.34c41.49,1.7,71,44.19,54.87,83.46-5.74,13.99-25.89,29.29-39.75,34.81-33.14,13.2-67.29,3.96-89.96-18.26-16.68-16.35-25.69-38.98-25.69-62.33V26.39c-.01-4.79,1.27-9.55,4-13.49,11.11-16.08,38.49-11.06,40.37,13.02,3.4,43.69-3.84,92.7-.04,136.17,1.59,18.12,16.64,35.48,35.13,37.28,39.52,3.83,59.21-42.17,34.03-70.74-4.09-4.64-8.54-6.33-12.95-10.28Z"
				/>
				<path
					fill="url(#hub-logo-g2)"
					d="M828.35,2.99c13.55-1.57,25.47,9.53,26.24,22.93l-.13,190.62c0,5.08-1.39,10.11-4.32,14.26-11.29,15.99-38.08,12.49-42.64-9.41-.42-2.01-.56-4.06-.56-6.11l.04-189.32c1.3-11.64,9.32-21.58,21.37-22.97Z"
				/>
				<path
					fill="url(#hub-logo-g3)"
					d="M444.08,84.76c0-2.31,1.32-4.44,3.42-5.41,31.42-14.66,71.58-3.73,93.85,22.26,15.58,18.18,24.04,46.48,19.48,70.2-.3,1.58.02,3.33-2.15,3.78-1.15-57.49-76.54-86.47-114.59-42.13v-48.7Z"
				/>
				<g>
					<path
						fill="url(#hub-logo-g4)"
						d="M288.87,198.29c-.33.6-1.1,1.14-2.11,1.64-32.31,16.06-84.36-4.35-84.36-42.17,0-26.29.07-41.04.15-60.85.01-3.34.26-6.71,1.52-9.8,8.1-19.82,40.24-16.49,42.68,4.72,2.96,25.72-7.55,72.39,9.14,92.42,7.9,9.48,20.62,14.95,32.98,14.04Z"
					/>
					<path
						fill="url(#hub-logo-g5)"
						d="M340.46,74.27c8.62-1.79,16.4.15,21.8,5.26,4.35,4.11,5.98,9.67,6.29,16.03,3.93,80.89,3.09,89.57-18.58,116.79-41.28,51.87-130.01,32.12-144.84-27.92l7.16,6.99c15.79,16.85,44.23,24.7,68.48,17.69,15.56-4.5,29.46-14.35,37.85-29.16,12.96-22.86,1.8-63.08,6.17-88.9,1.2-7.07,8.6-15.3,15.66-16.76Z"
					/>
				</g>
				<g>
					<path
						fill="url(#hub-logo-g6)"
						d="M727.99,233.68c0,.5-1.91,1.67-3.07,2.13-54.26,21.49-121.45-12.83-123.54-72.6-1.53-43.7-.02-91.14.04-135.54,0-3.13.44-6.26,1.5-9.21,8.28-23.06,43.09-20.22,45.95,7.62,2.72,44.68-3.21,92.87.07,137.13,2.02,27.2,21.75,55.03,46.87,65.52,2.52,1.05,10.17,3.94,16.22,4.92s15.96.03,15.96.03Z"
					/>
					<path
						fill="url(#hub-logo-g7)"
						d="M752.49,3.01c10.69-1.4,19.57,4.07,24.15,12.64,2.07,3.89,3.03,8.27,3.03,12.68,0,124.79.19,126.65.15,131.65-.31,40.73-17.03,57.87-40.65,65.25-27.95,8.73-57.48-6.22-72.59-29.82-.78-1.22.52-2.69,1.82-2.05l2.76,1.36c5.32,2.62,11.08,4.34,17,4.71,23.62,1.49,42.31-15.96,44.09-41.62,3.06-44.09-2.46-91.63.04-136.09,1.72-9.63,10.58-17.46,20.19-18.72Z"
					/>
				</g>
				<g>
					<path
						fill="url(#hub-logo-g8)"
						d="M3.73,115.2v-18.04l.02-68.28c0-2.82.34-5.64,1.19-8.33C7.81,11.46,15.06,4.35,25.11,3.18c13.13-1.52,24.72,8.85,26.14,21.68.09.83.1,1.67.1,2.51l-.05,60c0,2.59-2.1,4.68-4.69,4.68h-5.12c-16.13,0-30.62,8.99-37.77,23.14Z"
					/>
					<path
						fill="url(#hub-logo-g9)"
						d="M41.5,151.36h9.77s-.05,67.36-.05,67.36c0,5.07-1.39,10.11-4.32,14.26-11.28,15.99-38.07,12.49-42.64-9.41-.42-2.01-.57-4.06-.57-6.11v-21.16c0-7.42.96-14.81,2.84-22h0c5.75-13.74,19.78-22.95,34.97-22.95Z"
					/>
					<path
						fill="url(#hub-logo-g10)"
						d="M180.88,130.03v16.75s-.06,71.94-.06,71.94c0,5.07-1.4,10.11-4.32,14.26-11.29,15.99-38.08,12.49-42.65-9.41-.42-2.01-.56-4.06-.56-6.11v-62.36c0-2.03,1.66-3.67,3.68-3.67h7.06c15.46,0,29.41-8.25,36.84-21.41Z"
					/>
					<path
						fill="url(#hub-logo-g11)"
						d="M180.94,25.39l-.03,32.89c0,3.73-.79,7.41-2.32,10.81h0c-5.79,14-19.35,23.04-34.55,23.04h-10.72s0-65.23,0-65.23c0-2.82.34-5.64,1.19-8.33,2.88-9.09,10.13-16.2,20.17-17.37,13.13-1.52,24.73,8.85,26.14,21.68.09.83.1,1.67.1,2.51Z"
					/>
					<path
						fill="url(#hub-logo-g12)"
						d="M180.91,76.63l-.02,21.56v16.19c-.47,2.79-1.24,5.49-2.32,8.1-5.79,13.98-19.34,23.01-34.53,23.01l-102.54-.08c-15.78,0-30.46,8.82-37.79,22.34v-22.07s0-16.31,0-16.31c.52-2.09,1.45-4.19,2.34-6.26.32-.71.62-1.42.91-2.11,5.78-13.98,19.33-23.01,34.53-23.01h9.8l82.02.07h10.72c15.49,0,29.46-8.28,36.87-21.43Z"
					/>
				</g>
			</svg>
		}
	`,
	styles: `
		:host {
			display: inline-flex;
			align-items: center;
		}
		svg {
			display: block;
			overflow: visible;
			height: 28px;
			width: auto;
		}
		:host(.app-brand-logo--collapsed) svg {
			height: 32px;
			width: auto;
		}
	`
})
export class AppBrandLogoComponent {
	/** When true, renders the compact icon; otherwise the full horizontal logo. */
	readonly collapsed = input(false);
}
