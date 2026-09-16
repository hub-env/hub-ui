/**
 * GENERATED FILE — do not edit by hand.
 *
 * Complete SCSS mixin catalogs for the library docs pages' "Styles" tab, parsed from each
 * library's `_*-theme.scss` files (discovered by their scss-docs-start/end markers).
 *
 * Regenerate with: npm run docs:mixins
 */
import { LibraryMixins } from '../../models/interfaces';

export const MD_MIXINS: Record<string, LibraryMixins> = {
	'avatar': {
		intro: 'Override any of the `--hub-avatar-*` design tokens in a single include. Every parameter is OPTIONAL and defaults to `null`: only the parameters you pass are emitted, so the rest keep the component\'s defaults.',
		use: '@use \'ng-hub-ui-avatar/styles\' as avatar;',
		catalog: [
			{
				group: 'Theming',
				mixins: [
					{
						name: 'hub-avatar-theme',
						params: '$size, $border-radius, $border-width, $border-color, $bg, $fg, $object-fit, $font-family, $font-weight, $font-size, $text-transform, $content-padding, $content-icon-size, $badge-size, $badge-offset, $badge-ring-width, $badge-ring-color, $badge-color, $badge-text-color, $badge-font-size, $badge-padding, $group-overlap, $group-ring-width, $group-ring-color',
						description: 'One-call token theming for `hub-avatar-theme`.',
						example: 'hub-avatar.brand {\n  @include avatar.hub-avatar-theme(\n    $size: 64px, $bg: #ede9fe, $fg: #5b21b6, $badge-color: #f43f5e\n  );\n}',
						paramTokens: [
							{ param: '$size', tokens: ['--hub-avatar-size'] },
							{ param: '$border-radius', tokens: ['--hub-avatar-border-radius'] },
							{ param: '$border-width', tokens: ['--hub-avatar-border-width'] },
							{ param: '$border-color', tokens: ['--hub-avatar-border-color'] },
							{ param: '$bg', tokens: ['--hub-avatar-bg-color'] },
							{ param: '$fg', tokens: ['--hub-avatar-fg-color'] },
							{ param: '$object-fit', tokens: ['--hub-avatar-object-fit'] },
							{ param: '$font-family', tokens: ['--hub-avatar-font-family'] },
							{ param: '$font-weight', tokens: ['--hub-avatar-font-weight'] },
							{ param: '$font-size', tokens: ['--hub-avatar-font-size'] },
							{ param: '$text-transform', tokens: ['--hub-avatar-text-transform'] },
							{ param: '$content-padding', tokens: ['--hub-avatar-content-padding'] },
							{ param: '$content-icon-size', tokens: ['--hub-avatar-content-icon-size'] },
							{ param: '$badge-size', tokens: ['--hub-avatar-badge-size'] },
							{ param: '$badge-offset', tokens: ['--hub-avatar-badge-offset'] },
							{ param: '$badge-ring-width', tokens: ['--hub-avatar-badge-ring-width'] },
							{ param: '$badge-ring-color', tokens: ['--hub-avatar-badge-ring-color'] },
							{ param: '$badge-color', tokens: ['--hub-avatar-badge-color'] },
							{ param: '$badge-text-color', tokens: ['--hub-avatar-badge-text-color'] },
							{ param: '$badge-font-size', tokens: ['--hub-avatar-badge-font-size'] },
							{ param: '$badge-padding', tokens: ['--hub-avatar-badge-padding'] },
							{ param: '$group-overlap', tokens: ['--hub-avatar-group-overlap'] },
							{ param: '$group-ring-width', tokens: ['--hub-avatar-group-ring-width'] },
							{ param: '$group-ring-color', tokens: ['--hub-avatar-group-ring-color'] },
						]
					},
				]
			}
		]
	},
	'badges': {
		intro: 'Override the key `--hub-badge-*` design tokens in a single include. Every parameter is OPTIONAL and defaults to `null`: only the parameters you pass are emitted, so the rest keep the component defaults. Token-based and self-contained.',
		use: '@use \'ng-hub-ui-badges/styles\' as badges;',
		catalog: [
			{
				group: 'Theming',
				mixins: [
					{
						name: 'hub-badge-theme',
						params: '$accent, $bg, $color, $border-color, $border-radius, $border-width, $padding-x, $padding-y, $gap, $font-size, $font-weight',
						description: 'One-call token theming for `<hub-badge>` (and `<hub-chip>`)',
						example: '@use \'ng-hub-ui-badges/styles\' as *;\n\n.brand-badge {\n  @include hub-badge-theme($accent: var(--hub-sys-color-brand), $border-radius: 0.25rem);\n}',
						paramTokens: [
							{ param: '$accent', tokens: ['--hub-badge-accent'] },
							{ param: '$bg', tokens: ['--hub-badge-bg'] },
							{ param: '$color', tokens: ['--hub-badge-color'] },
							{ param: '$border-color', tokens: ['--hub-badge-border-color'] },
							{ param: '$border-radius', tokens: ['--hub-badge-border-radius'] },
							{ param: '$border-width', tokens: ['--hub-badge-border-width'] },
							{ param: '$padding-x', tokens: ['--hub-badge-padding-x'] },
							{ param: '$padding-y', tokens: ['--hub-badge-padding-y'] },
							{ param: '$gap', tokens: ['--hub-badge-gap'] },
							{ param: '$font-size', tokens: ['--hub-badge-font-size'] },
							{ param: '$font-weight', tokens: ['--hub-badge-font-weight'] },
						]
					},
				]
			}
		]
	},
	'board': {
		intro: 'Override any of the `--hub-board-*` design tokens in a single include. Every parameter is OPTIONAL and defaults to `null`: only the parameters you pass are emitted, so the rest keep the component\'s defaults. Token-based and self-contained (no Bootstrap dependencies).',
		use: '@use \'ng-hub-ui-board/styles\' as board;',
		catalog: [
			{
				group: 'Theming',
				mixins: [
					{
						name: 'hub-board-theme',
						params: '$accent, $container-bg, $container-color, $border-color, $border-radius, $columns-gap, $column-bg, $column-color, $column-border-color, $column-border-radius, $column-width, $column-header-bg, $column-header-color, $card-bg, $card-color, $card-border-color, $card-border-radius, $card-padding-x, $card-padding-y, $card-shadow',
						description: 'One-call theming for `<hub-board>` (Kanban board)',
						example: '@use \'ng-hub-ui-board/styles\' as *;\n\n.sprint-board {\n  @include hub-board-theme(\n    $accent: var(--hub-sys-color-success),\n    $column-bg: #f6f8fa,\n    $card-border-radius: 0.75rem,\n    $columns-gap: 1.25rem\n  );\n}',
						paramTokens: [
							{ param: '$accent', tokens: ['--hub-board-accent'] },
							{ param: '$container-bg', tokens: ['--hub-board-container-bg'] },
							{ param: '$container-color', tokens: ['--hub-board-container-color'] },
							{ param: '$border-color', tokens: ['--hub-board-border-color'] },
							{ param: '$border-radius', tokens: ['--hub-board-border-radius'] },
							{ param: '$columns-gap', tokens: ['--hub-board-columns-gap'] },
							{ param: '$column-bg', tokens: ['--hub-board-column-bg'] },
							{ param: '$column-color', tokens: ['--hub-board-column-color'] },
							{ param: '$column-border-color', tokens: ['--hub-board-column-border-color'] },
							{ param: '$column-border-radius', tokens: ['--hub-board-column-border-radius'] },
							{ param: '$column-width', tokens: ['--hub-board-column-width'] },
							{ param: '$column-header-bg', tokens: ['--hub-board-column-header-bg'] },
							{ param: '$column-header-color', tokens: ['--hub-board-column-header-color'] },
							{ param: '$card-bg', tokens: ['--hub-board-card-bg'] },
							{ param: '$card-color', tokens: ['--hub-board-card-color'] },
							{ param: '$card-border-color', tokens: ['--hub-board-card-border-color'] },
							{ param: '$card-border-radius', tokens: ['--hub-board-card-border-radius'] },
							{ param: '$card-padding-x', tokens: ['--hub-board-card-padding-x'] },
							{ param: '$card-padding-y', tokens: ['--hub-board-card-padding-y'] },
							{ param: '$card-shadow', tokens: ['--hub-board-card-box-shadow'] },
						]
					},
				]
			}
		]
	},
	'breadcrumbs': {
		intro: 'Override any of the `--hub-breadcrumb-*` design tokens in a single include. Every parameter is OPTIONAL and defaults to `null`: only the parameters you pass are emitted, so the rest keep the component\'s defaults. Token-based and self-contained (no Bootstrap dependencies).',
		use: '@use \'ng-hub-ui-breadcrumbs/styles\' as breadcrumbs;',
		catalog: [
			{
				group: 'Theming',
				mixins: [
					{
						name: 'hub-breadcrumb-theme',
						params: '$bg, $color, $border-radius, $padding-x, $padding-y, $margin-bottom, $font-size, $divider, $divider-flipped, $divider-color, $item-padding-x, $item-active-color, $accent, $link-color, $link-hover-color, $link-decoration, $link-hover-decoration',
						description: 'One-call theming for `<hub-breadcrumb>`',
						example: '@use \'ng-hub-ui-breadcrumbs/styles\' as *;\n\nhub-breadcrumb.docs-breadcrumb {\n  @include hub-breadcrumb-theme(\n    $bg: #f8fafc,\n    $padding-x: 0.75rem,\n    $divider: "\'/\'",   // keep the inner quotes — it feeds CSS `content`\n    $accent: var(--hub-sys-color-info)\n  );\n}',
						paramTokens: [
							{ param: '$bg', tokens: ['--hub-breadcrumb-bg'] },
							{ param: '$color', tokens: ['--hub-breadcrumb-color'] },
							{ param: '$border-radius', tokens: ['--hub-breadcrumb-border-radius'] },
							{ param: '$padding-x', tokens: ['--hub-breadcrumb-padding-x'] },
							{ param: '$padding-y', tokens: ['--hub-breadcrumb-padding-y'] },
							{ param: '$margin-bottom', tokens: ['--hub-breadcrumb-margin-bottom'] },
							{ param: '$font-size', tokens: ['--hub-breadcrumb-font-size'] },
							{ param: '$divider', tokens: ['--hub-breadcrumb-divider'] },
							{ param: '$divider-flipped', tokens: ['--hub-breadcrumb-divider-flipped'] },
							{ param: '$divider-color', tokens: ['--hub-breadcrumb-divider-color'] },
							{ param: '$item-padding-x', tokens: ['--hub-breadcrumb-item-padding-x'] },
							{ param: '$item-active-color', tokens: ['--hub-breadcrumb-item-active-color'] },
							{ param: '$accent', tokens: ['--hub-breadcrumb-accent'] },
							{ param: '$link-color', tokens: ['--hub-breadcrumb-link-color'] },
							{ param: '$link-hover-color', tokens: ['--hub-breadcrumb-link-hover-color'] },
							{ param: '$link-decoration', tokens: ['--hub-breadcrumb-link-decoration'] },
							{ param: '$link-hover-decoration', tokens: ['--hub-breadcrumb-link-hover-decoration'] },
						]
					},
				]
			}
		]
	},
	'buttons': {
		intro: 'Override the key button design tokens in a single include. Every parameter is OPTIONAL and defaults to `null`: only the parameters you pass are emitted, so the rest keep the component defaults. Token-based and self-contained.',
		use: '@use \'ng-hub-ui-buttons/styles\' as buttons;',
		catalog: [
			{
				group: 'Theming',
				mixins: [
					{
						name: 'hub-btn-theme',
						params: '$accent, $border-radius, $padding-x, $padding-y, $font-size',
						description: 'One-call token theming for `<hub-button>` / `[hubButton]`',
						example: '@use \'ng-hub-ui-buttons/styles\' as *;\n\n.toolbar {\n  @include hub-btn-theme($accent: var(--hub-sys-color-brand), $border-radius: 999px);\n}',
						paramTokens: [
							{ param: '$accent', tokens: ['--hub-btn-accent'] },
							{ param: '$border-radius', tokens: ['--hub-button-border-radius'] },
							{ param: '$padding-x', tokens: ['--hub-button-padding-x'] },
							{ param: '$padding-y', tokens: ['--hub-button-padding-y'] },
							{ param: '$font-size', tokens: ['--hub-button-font-size'] },
						]
					},
				]
			}
		]
	},
	'calendar': {
		intro: 'Override any of the `--hub-calendar-*` design tokens in a single include. Every parameter is OPTIONAL and defaults to `null`: only the parameters you pass are emitted, so the rest keep the component\'s defaults. Token-based and self-contained (no Bootstrap dependencies).',
		use: '@use \'ng-hub-ui-calendar/styles\' as calendar;',
		catalog: [
			{
				group: 'Theming',
				mixins: [
					{
						name: 'hub-calendar-theme',
						params: '$accent, $accent-subtle, $bg, $color, $border-color, $border-radius, $header-bg, $header-padding-x, $header-padding-y, $btn-bg, $btn-color, $btn-border-color, $btn-hover-bg, $btn-active-bg, $btn-active-color, $day-min-height, $day-hover-bg, $day-today-bg, $day-selected-bg, $day-other-month-bg, $day-other-month-color, $day-weekend-bg, $event-bg, $event-color, $event-border-radius, $event-font-size',
						description: 'One-call theming for `<hub-calendar>`',
						example: '@use \'ng-hub-ui-calendar/styles\' as *;\n\n.planner {\n  @include hub-calendar-theme(\n    $accent: var(--hub-sys-color-info),\n    $day-min-height: 110px,\n    $event-border-radius: 999px\n  );\n}',
						paramTokens: [
							{ param: '$accent', tokens: ['--hub-calendar-accent'] },
							{ param: '$accent-subtle', tokens: ['--hub-calendar-accent-subtle'] },
							{ param: '$bg', tokens: ['--hub-calendar-bg'] },
							{ param: '$color', tokens: ['--hub-calendar-color'] },
							{ param: '$border-color', tokens: ['--hub-calendar-border-color'] },
							{ param: '$border-radius', tokens: ['--hub-calendar-border-radius'] },
							{ param: '$header-bg', tokens: ['--hub-calendar-header-bg'] },
							{ param: '$header-padding-x', tokens: ['--hub-calendar-header-padding-x'] },
							{ param: '$header-padding-y', tokens: ['--hub-calendar-header-padding-y'] },
							{ param: '$btn-bg', tokens: ['--hub-calendar-btn-bg'] },
							{ param: '$btn-color', tokens: ['--hub-calendar-btn-color'] },
							{ param: '$btn-border-color', tokens: ['--hub-calendar-btn-border-color'] },
							{ param: '$btn-hover-bg', tokens: ['--hub-calendar-btn-hover-bg'] },
							{ param: '$btn-active-bg', tokens: ['--hub-calendar-btn-active-bg'] },
							{ param: '$btn-active-color', tokens: ['--hub-calendar-btn-active-color'] },
							{ param: '$day-min-height', tokens: ['--hub-calendar-day-min-height'] },
							{ param: '$day-hover-bg', tokens: ['--hub-calendar-day-hover-bg'] },
							{ param: '$day-today-bg', tokens: ['--hub-calendar-day-today-bg'] },
							{ param: '$day-selected-bg', tokens: ['--hub-calendar-day-selected-bg'] },
							{ param: '$day-other-month-bg', tokens: ['--hub-calendar-day-other-month-bg'] },
							{ param: '$day-other-month-color', tokens: ['--hub-calendar-day-other-month-color'] },
							{ param: '$day-weekend-bg', tokens: ['--hub-calendar-day-weekend-bg'] },
							{ param: '$event-bg', tokens: ['--hub-calendar-event-bg'] },
							{ param: '$event-color', tokens: ['--hub-calendar-event-color'] },
							{ param: '$event-border-radius', tokens: ['--hub-calendar-event-border-radius'] },
							{ param: '$event-font-size', tokens: ['--hub-calendar-event-font-size'] },
						]
					},
				]
			}
		]
	},
	'forms': {
		intro: 'Override any of the `--hub-file-input-*` design tokens in a single include. Every parameter is OPTIONAL and defaults to `null`: only the parameters you pass are emitted, so the rest keep the component\'s defaults. Token-based and self-contained (no Bootstrap dependencies).',
		use: '@use \'ng-hub-ui-forms/styles\' as forms;',
		catalog: [
			{
				group: 'Theming',
				mixins: [
					{
						name: 'hub-file-input-theme',
						params: '$bg, $color, $border-width, $border-style, $border-color, $border-radius, $padding-x, $padding-y, $min-height, $gap, $hover-bg, $hover-border-color, $dragover-bg, $dragover-border-color, $prompt-color, $browse-color, $hint-color, $icon, $icon-size, $icon-color, $file-icon, $file-icon-color, $remove-icon, $cancel-icon, $retry-icon, $done-icon, $done-color, $item-bg, $item-border-color, $item-border-radius, $thumb-size, $grid-min-width, $grid-thumb-height, $progress-height, $progress-track-bg, $progress-bar-bg',
						description: 'One-call theming for `<hub-file-input>`',
						example: '@use \'ng-hub-ui-forms/styles\' as *;\n\n.attachments {\n  @include hub-file-input-theme(\n    $border-style: solid,\n    $border-radius: 0.75rem,\n    $dragover-border-color: var(--hub-sys-color-brand),\n    $browse-color: var(--hub-sys-color-brand),\n    $icon: url(\'/assets/upload.svg\'),\n    $icon-color: var(--hub-sys-color-brand),\n    $progress-bar-bg: var(--hub-sys-color-brand)\n  );\n}',
						paramTokens: [
							{ param: '$bg', tokens: ['--hub-file-input-bg'] },
							{ param: '$color', tokens: ['--hub-file-input-color'] },
							{ param: '$border-width', tokens: ['--hub-file-input-border-width'] },
							{ param: '$border-style', tokens: ['--hub-file-input-border-style'] },
							{ param: '$border-color', tokens: ['--hub-file-input-border-color'] },
							{ param: '$border-radius', tokens: ['--hub-file-input-border-radius'] },
							{ param: '$padding-x', tokens: ['--hub-file-input-padding-x'] },
							{ param: '$padding-y', tokens: ['--hub-file-input-padding-y'] },
							{ param: '$min-height', tokens: ['--hub-file-input-min-height'] },
							{ param: '$gap', tokens: ['--hub-file-input-gap'] },
							{ param: '$hover-bg', tokens: ['--hub-file-input-hover-bg'] },
							{ param: '$hover-border-color', tokens: ['--hub-file-input-hover-border-color'] },
							{ param: '$dragover-bg', tokens: ['--hub-file-input-dragover-bg'] },
							{ param: '$dragover-border-color', tokens: ['--hub-file-input-dragover-border-color'] },
							{ param: '$prompt-color', tokens: ['--hub-file-input-prompt-color'] },
							{ param: '$browse-color', tokens: ['--hub-file-input-browse-color'] },
							{ param: '$hint-color', tokens: ['--hub-file-input-hint-color'] },
							{ param: '$icon', tokens: ['--hub-file-input-icon'] },
							{ param: '$icon-size', tokens: ['--hub-file-input-icon-size'] },
							{ param: '$icon-color', tokens: ['--hub-file-input-icon-color'] },
							{ param: '$file-icon', tokens: ['--hub-file-input-file-icon'] },
							{ param: '$file-icon-color', tokens: ['--hub-file-input-file-icon-color'] },
							{ param: '$remove-icon', tokens: ['--hub-file-input-remove-icon'] },
							{ param: '$cancel-icon', tokens: ['--hub-file-input-cancel-icon'] },
							{ param: '$retry-icon', tokens: ['--hub-file-input-retry-icon'] },
							{ param: '$done-icon', tokens: ['--hub-file-input-done-icon'] },
							{ param: '$done-color', tokens: ['--hub-file-input-done-color'] },
							{ param: '$item-bg', tokens: ['--hub-file-input-item-bg'] },
							{ param: '$item-border-color', tokens: ['--hub-file-input-item-border-color'] },
							{ param: '$item-border-radius', tokens: ['--hub-file-input-item-border-radius'] },
							{ param: '$thumb-size', tokens: ['--hub-file-input-thumb-size'] },
							{ param: '$grid-min-width', tokens: ['--hub-file-input-grid-min-width'] },
							{ param: '$grid-thumb-height', tokens: ['--hub-file-input-grid-thumb-height'] },
							{ param: '$progress-height', tokens: ['--hub-file-input-progress-height'] },
							{ param: '$progress-track-bg', tokens: ['--hub-file-input-progress-track-bg'] },
							{ param: '$progress-bar-bg', tokens: ['--hub-file-input-progress-bar-bg'] },
						]
					},
					{
						name: 'hub-forms-theme',
						params: '$focus-ring-color, $focus-ring-width, $invalid-color, $valid-color, $disabled-opacity, $transition',
						description: 'One-call theming for the shared `ng-hub-ui-forms` chrome',
						example: '@use \'ng-hub-ui-forms/styles\' as *;\n\n:root {\n  @include hub-forms-theme(\n    $focus-ring-color: var(--hub-sys-color-info-subtle),\n    $disabled-opacity: 0.5\n  );\n}',
						paramTokens: [
							{ param: '$focus-ring-color', tokens: ['--hub-form-focus-ring-color'] },
							{ param: '$focus-ring-width', tokens: ['--hub-form-focus-ring-width'] },
							{ param: '$invalid-color', tokens: ['--hub-form-invalid-color', '--hub-form-invalid-border-color'] },
							{ param: '$valid-color', tokens: ['--hub-form-valid-color', '--hub-form-valid-border-color'] },
							{ param: '$disabled-opacity', tokens: ['--hub-form-disabled-opacity'] },
							{ param: '$transition', tokens: ['--hub-form-transition'] },
						]
					},
					{
						name: 'hub-segmented-theme',
						params: '$bg, $selected-bg, $selected-color, $radius, $gap, $padding-x, $padding-y',
						description: 'One-call theming for `<hub-segmented>`',
						example: '@use \'ng-hub-ui-forms/styles\' as *;\n\n.view-switch {\n  @include hub-segmented-theme(\n    $selected-bg: var(--hub-sys-color-brand),\n    $selected-color: var(--hub-sys-color-brand-on, #fff),\n    $radius: 0.75rem,\n    $padding-y: 0.375rem\n  );\n}',
						paramTokens: [
							{ param: '$bg', tokens: ['--hub-segmented-bg'] },
							{ param: '$selected-bg', tokens: ['--hub-segmented-selected-bg'] },
							{ param: '$selected-color', tokens: ['--hub-segmented-selected-color'] },
							{ param: '$radius', tokens: ['--hub-segmented-radius'] },
							{ param: '$gap', tokens: ['--hub-segmented-gap'] },
							{ param: '$padding-x', tokens: ['--hub-segmented-padding-x'] },
							{ param: '$padding-y', tokens: ['--hub-segmented-padding-y'] },
						]
					},
				]
			}
		]
	},
	'icons': {
		intro: 'Override the `--hub-icon-*` design tokens in a single include. Every parameter is OPTIONAL and defaults to `null`: only the parameters you pass are emitted, so the rest keep the defaults. `color` defaults to `currentColor`, so an icon inherits its surrounding text colour unless themed. Token-based and self-contained.',
		use: '@use \'ng-hub-ui-icons/styles\' as icons;',
		catalog: [
			{
				group: 'Theming',
				mixins: [
					{
						name: 'hub-icon-theme',
						params: '$color, $size, $weight, $fill, $grade, $optical-size',
						description: 'One-call token theming for `<hub-icon>` / `[hubIcon]`',
						example: '@use \'ng-hub-ui-icons/styles\' as *;\n\n.toolbar { @include hub-icon-theme($color: var(--hub-sys-color-primary), $size: 1.5rem); }',
						paramTokens: [
							{ param: '$color', tokens: ['--hub-icon-color'] },
							{ param: '$size', tokens: ['--hub-icon-size'] },
							{ param: '$weight', tokens: ['--hub-icon-weight'] },
							{ param: '$fill', tokens: ['--hub-icon-fill'] },
							{ param: '$grade', tokens: ['--hub-icon-grade'] },
							{ param: '$optical-size', tokens: ['--hub-icon-optical-size'] },
						]
					},
				]
			}
		]
	},
	'loading': {
		intro: 'Override the `--hub-loading-bar-*` design tokens in a single include. Every parameter is OPTIONAL and defaults to `null`: only the parameters you pass are emitted, so a theme that cares about the accent alone does not freeze the other twelve tokens at today\'s defaults. Token-based and self-contained (no Bootstrap dependencies).',
		use: '@use \'ng-hub-ui-loading/styles\' as loading;',
		catalog: [
			{
				group: 'Theming',
				mixins: [
					{
						name: 'hub-loading-bar-theme',
						params: '$accent, $height, $track-bg, $radius, $speed, $fade, $easing, $glow-color, $glow-blur, $glow-spread, $indeterminate-speed, $offset, $z-index',
						description: 'One-call theming for `<hub-loading-bar>`',
						example: '@use \'ng-hub-ui-loading/styles\' as *;\n\n.app-shell--dark {\n  @include hub-loading-bar-theme(\n    $accent: #7dd3fc,\n    $height: 2px,\n    $offset: 56px,\n    $glow-blur: 14px\n  );\n}',
						paramTokens: [
							{ param: '$accent', tokens: ['--hub-loading-bar-accent'] },
							{ param: '$height', tokens: ['--hub-loading-bar-height'] },
							{ param: '$track-bg', tokens: ['--hub-loading-bar-track-bg'] },
							{ param: '$radius', tokens: ['--hub-loading-bar-radius'] },
							{ param: '$speed', tokens: ['--hub-loading-bar-speed'] },
							{ param: '$fade', tokens: ['--hub-loading-bar-fade'] },
							{ param: '$easing', tokens: ['--hub-loading-bar-easing'] },
							{ param: '$glow-color', tokens: ['--hub-loading-bar-glow-color'] },
							{ param: '$glow-blur', tokens: ['--hub-loading-bar-glow-blur'] },
							{ param: '$glow-spread', tokens: ['--hub-loading-bar-glow-spread'] },
							{ param: '$indeterminate-speed', tokens: ['--hub-loading-bar-indeterminate-speed'] },
							{ param: '$offset', tokens: ['--hub-loading-bar-offset'] },
							{ param: '$z-index', tokens: ['--hub-loading-bar-z-index'] },
						]
					},
					{
						name: 'hub-loading-theme',
						params: '$accent, $size, $thickness, $speed, $gap, $text-color, $font-size, $backdrop-bg, $backdrop-blur, $z-index, $image-size',
						description: 'One-call theming for `<hub-loading>`',
						example: '@use \'ng-hub-ui-loading/styles\' as *;\n\n.app-shell--dark {\n  @include hub-loading-theme(\n    $accent: #7dd3fc,\n    $text-color: rgba(255, 255, 255, 0.82),\n    $backdrop-bg: rgba(15, 23, 42, 0.72),\n    $speed: 1.2s\n  );\n}',
						paramTokens: [
							{ param: '$accent', tokens: ['--hub-loading-accent'] },
							{ param: '$size', tokens: ['--hub-loading-size'] },
							{ param: '$thickness', tokens: ['--hub-loading-thickness'] },
							{ param: '$speed', tokens: ['--hub-loading-speed'] },
							{ param: '$gap', tokens: ['--hub-loading-gap'] },
							{ param: '$text-color', tokens: ['--hub-loading-text-color'] },
							{ param: '$font-size', tokens: ['--hub-loading-font-size'] },
							{ param: '$backdrop-bg', tokens: ['--hub-loading-backdrop-bg'] },
							{ param: '$backdrop-blur', tokens: ['--hub-loading-backdrop-blur'] },
							{ param: '$z-index', tokens: ['--hub-loading-z-index'] },
							{ param: '$image-size', tokens: ['--hub-loading-image-size'] },
						]
					},
				]
			}
		]
	},
	'metrics': {
		intro: 'Override the shared `--hub-progress-*`, `--hub-meter-*` and `--hub-ring-*` tokens in a single include. Every parameter is OPTIONAL and defaults to `null`: only the parameters you pass are emitted as CSS custom properties, so the rest keep each component\'s own defaults. Token-based and self-contained (no Bootstrap dependency).',
		use: '@use \'ng-hub-ui-metrics/styles\' as metrics;',
		catalog: [
			{
				group: 'Theming',
				mixins: [
					{
						name: 'hub-metrics-theme',
						params: '$accent, $track, $low, $optimum, $high, $radius',
						description: 'One-call theming for the metrics primitives',
						example: '@use \'ng-hub-ui-metrics/styles\' as hub;\n\n.app-panel {\n  @include hub.hub-metrics-theme($accent: var(--hub-sys-color-info), $radius: 0.25rem);\n}',
						paramTokens: [
							{ param: '$accent', tokens: ['--hub-progress-accent', '--hub-ring-indicator'] },
							{ param: '$track', tokens: ['--hub-progress-track-bg', '--hub-meter-track-bg', '--hub-ring-track'] },
							{ param: '$low', tokens: ['--hub-meter-low-bg', '--hub-ring-low-color'] },
							{ param: '$optimum', tokens: ['--hub-meter-optimum-bg'] },
							{ param: '$high', tokens: ['--hub-meter-high-bg', '--hub-ring-high-color'] },
							{ param: '$radius', tokens: ['--hub-progress-radius', '--hub-meter-radius'] },
						]
					},
				]
			}
		]
	},
	'milestones': {
		intro: 'Override the `--hub-milestone-*` design tokens in a single include. Every parameter is OPTIONAL and defaults to `null`: only the parameters you pass are emitted, so the rest keep their defaults. Token-based and self-contained.',
		use: '@use \'ng-hub-ui-milestones/styles\' as milestones;',
		catalog: [
			{
				group: 'Theming',
				mixins: [
					{
						name: 'hub-milestones-theme',
						params: '$node-color, $node-text, $node-size, $node-font-size, $connector-bg, $connector-pending-bg, $connector-thickness, $pending-bg, $pending-border, $pending-color, $error-bg, $body-color, $body-muted, $gap, $spacing',
						description: 'One-call token theming for `<hub-milestones>`',
						example: '@use \'ng-hub-ui-milestones/styles\' as *;\n\n.onboarding {\n    @include hub-milestones-theme($node-color: var(--hub-sys-color-primary), $connector-thickness: 3px);\n}',
						paramTokens: [
							{ param: '$node-color', tokens: ['--hub-milestone-node-color'] },
							{ param: '$node-text', tokens: ['--hub-milestone-node-text'] },
							{ param: '$node-size', tokens: ['--hub-milestone-node-size'] },
							{ param: '$node-font-size', tokens: ['--hub-milestone-node-font-size'] },
							{ param: '$connector-bg', tokens: ['--hub-milestone-connector-bg'] },
							{ param: '$connector-pending-bg', tokens: ['--hub-milestone-connector-pending-bg'] },
							{ param: '$connector-thickness', tokens: ['--hub-milestone-connector-thickness'] },
							{ param: '$pending-bg', tokens: ['--hub-milestone-pending-bg'] },
							{ param: '$pending-border', tokens: ['--hub-milestone-pending-border'] },
							{ param: '$pending-color', tokens: ['--hub-milestone-pending-color'] },
							{ param: '$error-bg', tokens: ['--hub-milestone-error-bg'] },
							{ param: '$body-color', tokens: ['--hub-milestone-body-color'] },
							{ param: '$body-muted', tokens: ['--hub-milestone-body-muted'] },
							{ param: '$gap', tokens: ['--hub-milestone-gap'] },
							{ param: '$spacing', tokens: ['--hub-milestone-spacing'] },
						]
					},
				]
			}
		]
	},
	'modal': {
		intro: 'Override any of the `--hub-modal-*` design tokens in a single include. Every parameter is OPTIONAL and defaults to `null`: only the parameters you pass are emitted, so the rest keep the component\'s defaults. Token-based and self-contained (no Bootstrap dependencies).',
		use: '@use \'ng-hub-ui-modal/styles\' as modal;',
		catalog: [
			{
				group: 'Theming',
				mixins: [
					{
						name: 'hub-modal-theme',
						params: '$accent, $accent-subtle, $accent-border, $accent-bar-width, $bg, $color, $title-color, $border-color, $border-width, $border-radius, $box-shadow, $max-width, $header-padding-x, $header-padding-y, $header-gap, $header-border-color, $body-padding-x, $body-padding-y, $footer-padding-x, $footer-padding-y, $footer-gap, $footer-border-color, $backdrop-bg',
						description: 'One-call theming for `<hub-modal>` dialogs',
						example: '@use \'ng-hub-ui-modal/styles\' as *;\n\n.branded-dialog {\n  @include hub-modal-theme(\n    $accent: var(--hub-sys-color-success),\n    $bg: #f6fff9,\n    $border-color: #b7e4c7,\n    $border-radius: 0.75rem,\n    $box-shadow: 0 1.5rem 4rem rgba(0, 0, 0, 0.2)\n  );\n}\n\n// this.modal.open(MyDialog, { windowClass: \'branded-dialog\' });',
						paramTokens: [
							{ param: '$accent', tokens: ['--hub-modal-accent'] },
							{ param: '$accent-subtle', tokens: ['--hub-modal-accent-subtle'] },
							{ param: '$accent-border', tokens: ['--hub-modal-accent-border'] },
							{ param: '$accent-bar-width', tokens: ['--hub-modal-accent-bar-width'] },
							{ param: '$bg', tokens: ['--hub-modal-bg'] },
							{ param: '$color', tokens: ['--hub-modal-color'] },
							{ param: '$title-color', tokens: ['--hub-modal-title-color'] },
							{ param: '$border-color', tokens: ['--hub-modal-border-color'] },
							{ param: '$border-width', tokens: ['--hub-modal-border-width'] },
							{ param: '$border-radius', tokens: ['--hub-modal-border-radius'] },
							{ param: '$box-shadow', tokens: ['--hub-modal-box-shadow'] },
							{ param: '$max-width', tokens: ['--hub-modal-max-width'] },
							{ param: '$header-padding-x', tokens: ['--hub-modal-header-padding-x'] },
							{ param: '$header-padding-y', tokens: ['--hub-modal-header-padding-y'] },
							{ param: '$header-gap', tokens: ['--hub-modal-header-gap'] },
							{ param: '$header-border-color', tokens: ['--hub-modal-header-border-color'] },
							{ param: '$body-padding-x', tokens: ['--hub-modal-body-padding-x'] },
							{ param: '$body-padding-y', tokens: ['--hub-modal-body-padding-y'] },
							{ param: '$footer-padding-x', tokens: ['--hub-modal-footer-padding-x'] },
							{ param: '$footer-padding-y', tokens: ['--hub-modal-footer-padding-y'] },
							{ param: '$footer-gap', tokens: ['--hub-modal-footer-gap'] },
							{ param: '$footer-border-color', tokens: ['--hub-modal-footer-border-color'] },
							{ param: '$backdrop-bg', tokens: ['--hub-modal-backdrop-bg'] },
						]
					},
				]
			}
		]
	},
	'nav': {
		intro: 'Override the most useful `--hub-nav-*` design tokens in a single include. Every parameter is OPTIONAL and defaults to `null`: only the parameters you pass are emitted, so the rest keep their defaults. For any token not exposed here, set the `--hub-nav-*` custom property directly — this mixin is sugar for the common knobs, not a replacement for the full token surface.',
		use: '@use \'ng-hub-ui-nav/styles\' as nav;',
		catalog: [
			{
				group: 'Theming',
				mixins: [
					{
						name: 'hub-nav-theme',
						params: '$accent, $bg, $color, $border-color, $gap, $padding-x, $padding-y, $item-color, $item-active-bg, $item-active-color, $item-border-radius, $item-font-size, $item-padding-x, $item-padding-y',
						description: 'One-call token theming for `<hub-nav>`',
						example: '@use \'ng-hub-ui-nav/styles\' as *;\n\n.app-shell nav {\n    @include hub-nav-theme($accent: var(--hub-sys-color-brand), $item-border-radius: 0.5rem);\n}',
						paramTokens: [
							{ param: '$accent', tokens: ['--hub-nav-accent'] },
							{ param: '$bg', tokens: ['--hub-nav-bg'] },
							{ param: '$color', tokens: ['--hub-nav-color'] },
							{ param: '$border-color', tokens: ['--hub-nav-border-color'] },
							{ param: '$gap', tokens: ['--hub-nav-gap'] },
							{ param: '$padding-x', tokens: ['--hub-nav-padding-x'] },
							{ param: '$padding-y', tokens: ['--hub-nav-padding-y'] },
							{ param: '$item-color', tokens: ['--hub-nav-item-color'] },
							{ param: '$item-active-bg', tokens: ['--hub-nav-item-active-bg'] },
							{ param: '$item-active-color', tokens: ['--hub-nav-item-active-color'] },
							{ param: '$item-border-radius', tokens: ['--hub-nav-item-border-radius'] },
							{ param: '$item-font-size', tokens: ['--hub-nav-item-font-size'] },
							{ param: '$item-padding-x', tokens: ['--hub-nav-item-padding-x'] },
							{ param: '$item-padding-y', tokens: ['--hub-nav-item-padding-y'] },
						]
					},
				]
			}
		]
	},
	'panels': {
		intro: 'Override the most useful `--hub-panels-*` design tokens in a single include. Every parameter is OPTIONAL and defaults to `null`: only the parameters you pass are emitted, so the rest keep their defaults. For any token not exposed here, set the `--hub-panels-*` custom property directly — this mixin is sugar for the common knobs, not a replacement for the full token surface.',
		use: '@use \'ng-hub-ui-panels/styles\' as panels;',
		catalog: [
			{
				group: 'Theming',
				mixins: [
					{
						name: 'hub-panels-theme',
						params: '$accent, $border-color, $border-radius, $border-width, $content-bg, $content-padding-x, $content-padding-y, $tab-bg-active, $tab-color-active, $tab-font-size, $tab-padding-x, $tab-padding-y, $nav-gap',
						description: 'One-call token theming for `<hub-panels>`',
						example: '@use \'ng-hub-ui-panels/styles\' as *;\n\n.settings {\n    @include hub-panels-theme($accent: var(--hub-sys-color-brand), $border-radius: 0.75rem);\n}',
						paramTokens: [
							{ param: '$accent', tokens: ['--hub-panels-accent'] },
							{ param: '$border-color', tokens: ['--hub-panels-border-color'] },
							{ param: '$border-radius', tokens: ['--hub-panels-border-radius'] },
							{ param: '$border-width', tokens: ['--hub-panels-border-width'] },
							{ param: '$content-bg', tokens: ['--hub-panels-content-bg'] },
							{ param: '$content-padding-x', tokens: ['--hub-panels-content-padding-x'] },
							{ param: '$content-padding-y', tokens: ['--hub-panels-content-padding-y'] },
							{ param: '$tab-bg-active', tokens: ['--hub-panels-tab-bg-active'] },
							{ param: '$tab-color-active', tokens: ['--hub-panels-tab-color-active'] },
							{ param: '$tab-font-size', tokens: ['--hub-panels-tab-font-size'] },
							{ param: '$tab-padding-x', tokens: ['--hub-panels-tab-padding-x'] },
							{ param: '$tab-padding-y', tokens: ['--hub-panels-tab-padding-y'] },
							{ param: '$nav-gap', tokens: ['--hub-panels-nav-gap'] },
						]
					},
				]
			}
		]
	},
	'signature': {
		intro: 'Override the `--hub-signature-*` design tokens in a single include, without coupling the consumer to the component\'s DOM. Every parameter is OPTIONAL and defaults to `null`: only the parameters you pass are emitted, so the tokens you leave alone keep resolving through their own defaults. An include with no arguments would therefore emit nothing at all, which reads as a broken build rather than as a no-op — so it raises a `@warn` instead of failing silently. Token-based and self-contained (no Bootstrap dependencies).',
		use: '@use \'ng-hub-ui-signature/styles\' as signature;',
		catalog: [
			{
				group: 'Theming',
				mixins: [
					{
						name: 'hub-signature-theme',
						params: '$background, $color, $border-color, $border-radius, $focus-border-color, $border-width, $focus-shadow, $font-size, $label-color, $label-font-size, $actions-gap',
						description: 'One-call theming for `<hub-signature>`',
						example: '@use \'ng-hub-ui-signature/styles\' as *;\n\n.contract-panel--dark {\n  @include hub-signature-theme(\n    $background: #0f172a,\n    $color: rgba(255, 255, 255, 0.92),\n    $border-color: rgba(255, 255, 255, 0.24),\n    $border-radius: 12px,\n    $focus-border-color: #7dd3fc,\n    $focus-shadow: 0 0 0 0.25rem rgb(125 211 252 / 35%),\n    $label-color: rgba(255, 255, 255, 0.72)\n  );\n}',
					},
				]
			}
		]
	},
	'skeleton': {
		intro: 'Override the `--hub-skeleton-*` design tokens in a single include. Every parameter is OPTIONAL and defaults to `null`: only the parameters you pass are emitted, so the rest keep the component\'s defaults. Token-based and self-contained (no Bootstrap dependencies).',
		use: '@use \'ng-hub-ui-skeleton/styles\' as skeleton;',
		catalog: [
			{
				group: 'Theming',
				mixins: [
					{
						name: 'hub-skeleton-theme',
						params: '$bg, $highlight, $radius, $gap, $animation-duration',
						description: 'One-call theming for `<hub-skeleton>`',
						example: '@use \'ng-hub-ui-skeleton/styles\' as *;\n\nhub-skeleton.on-dark {\n  @include hub-skeleton-theme(\n    $bg: rgba(255, 255, 255, 0.10),\n    $highlight: rgba(255, 255, 255, 0.22),\n    $radius: 8px,\n    $animation-duration: 1.8s\n  );\n}',
						paramTokens: [
							{ param: '$bg', tokens: ['--hub-skeleton-bg'] },
							{ param: '$highlight', tokens: ['--hub-skeleton-highlight'] },
							{ param: '$radius', tokens: ['--hub-skeleton-radius'] },
							{ param: '$gap', tokens: ['--hub-skeleton-gap'] },
							{ param: '$animation-duration', tokens: ['--hub-skeleton-animation-duration'] },
						]
					},
				]
			}
		]
	},
	'stepper': {
		intro: 'Override any of the `--hub-stepper-*` design tokens in a single include. Every parameter is OPTIONAL and defaults to `null`: only the parameters you pass are emitted, so the rest keep the component\'s defaults. Token-based and self-contained (no Bootstrap dependencies).',
		use: '@use \'ng-hub-ui-stepper/styles\' as stepper;',
		catalog: [
			{
				group: 'Theming',
				mixins: [
					{
						name: 'hub-stepper-theme',
						params: '$accent, $surface, $background, $text, $border, $gap, $disabled-opacity, $nav-bg, $nav-padding-x, $nav-padding-y, $nav-border-width, $nav-border-color, $nav-gap, $nav-link-color, $nav-link-hover-color, $nav-link-hover-bg, $nav-link-active-color, $nav-link-active-bg, $nav-link-active-border-color, $nav-link-disabled-color, $trigger-padding-x, $trigger-padding-y, $trigger-gap, $trigger-font-size, $controls-gap, $controls-justify, $control-padding-x, $control-padding-y, $control-font-size, $sidebar-width',
						description: 'One-call theming for `<hub-stepper>`',
						example: '@use \'ng-hub-ui-stepper/styles\' as *;\n\n.checkout-stepper {\n  @include hub-stepper-theme(\n    $accent: var(--hub-sys-color-success),\n    $gap: 1.5rem,\n    $nav-link-active-color: #fff,\n    $sidebar-width: 220px\n  );\n}',
						paramTokens: [
							{ param: '$accent', tokens: ['--hub-stepper-accent'] },
							{ param: '$surface', tokens: ['--hub-stepper-surface-color'] },
							{ param: '$background', tokens: ['--hub-stepper-background-color'] },
							{ param: '$text', tokens: ['--hub-stepper-text-color'] },
							{ param: '$border', tokens: ['--hub-stepper-border-color'] },
							{ param: '$gap', tokens: ['--hub-stepper-gap'] },
							{ param: '$disabled-opacity', tokens: ['--hub-stepper-disabled-opacity'] },
							{ param: '$nav-bg', tokens: ['--hub-stepper-nav-bg'] },
							{ param: '$nav-padding-x', tokens: ['--hub-stepper-nav-padding-x'] },
							{ param: '$nav-padding-y', tokens: ['--hub-stepper-nav-padding-y'] },
							{ param: '$nav-border-width', tokens: ['--hub-stepper-nav-border-width'] },
							{ param: '$nav-border-color', tokens: ['--hub-stepper-nav-border-color'] },
							{ param: '$nav-gap', tokens: ['--hub-stepper-nav-gap'] },
							{ param: '$nav-link-color', tokens: ['--hub-stepper-nav-link-color'] },
							{ param: '$nav-link-hover-color', tokens: ['--hub-stepper-nav-link-hover-color'] },
							{ param: '$nav-link-hover-bg', tokens: ['--hub-stepper-nav-link-hover-bg'] },
							{ param: '$nav-link-active-color', tokens: ['--hub-stepper-nav-link-active-color'] },
							{ param: '$nav-link-active-bg', tokens: ['--hub-stepper-nav-link-active-bg'] },
							{ param: '$nav-link-active-border-color', tokens: ['--hub-stepper-nav-link-active-border-color'] },
							{ param: '$nav-link-disabled-color', tokens: ['--hub-stepper-nav-link-disabled-color'] },
							{ param: '$trigger-padding-x', tokens: ['--hub-stepper-nav-trigger-padding-x'] },
							{ param: '$trigger-padding-y', tokens: ['--hub-stepper-nav-trigger-padding-y'] },
							{ param: '$trigger-gap', tokens: ['--hub-stepper-nav-trigger-gap'] },
							{ param: '$trigger-font-size', tokens: ['--hub-stepper-nav-trigger-font-size'] },
							{ param: '$controls-gap', tokens: ['--hub-stepper-controls-gap'] },
							{ param: '$controls-justify', tokens: ['--hub-stepper-controls-justify'] },
							{ param: '$control-padding-x', tokens: ['--hub-stepper-control-padding-x'] },
							{ param: '$control-padding-y', tokens: ['--hub-stepper-control-padding-y'] },
							{ param: '$control-font-size', tokens: ['--hub-stepper-control-font-size'] },
							{ param: '$sidebar-width', tokens: ['--hub-stepper-sidebar-width'] },
						]
					},
				]
			}
		]
	},
	'table': {
		intro: 'Override any of the `--hub-list-*` design tokens in a single include. Every parameter is OPTIONAL and defaults to `null`: only the parameters you pass are emitted, so the rest keep the component\'s defaults. Token-based and self-contained (no Bootstrap dependencies). Covers both the `list` and the `cards` display modes.',
		use: '@use \'ng-hub-ui-paginable/styles\' as paginable;',
		catalog: [
			{
				group: 'Theming',
				mixins: [
					{
						name: 'hub-list-theme',
						params: '$accent, $bg, $item-bg, $item-color, $item-border-color, $hover-bg, $selected-bg, $selected-color, $border-radius, $item-border-radius, $item-padding-x, $item-padding-y, $gap, $cards-bg, $cards-border-color, $cards-border-radius, $cards-padding-x, $cards-padding-y, $cards-min-column-width, $cards-gap, $footer-gap, $footer-justify, $footer-align, $footer-wrap',
						description: 'One-call theming for `<hub-list>` (list & cards layouts)',
						example: '@use \'ng-hub-ui-paginable/styles/mixins/list-theme\' as *;\n\n.team-list {\n  @include hub-list-theme(\n    $accent: var(--hub-sys-color-success),\n    $item-border-radius: 0.75rem,\n    $gap: 0.5rem,\n    $cards-min-column-width: 16rem,\n    $footer-justify: end\n  );\n}',
						paramTokens: [
							{ param: '$accent', tokens: ['--hub-list-accent'] },
							{ param: '$bg', tokens: ['--hub-list-bg'] },
							{ param: '$item-bg', tokens: ['--hub-list-item-bg'] },
							{ param: '$item-color', tokens: ['--hub-list-item-color'] },
							{ param: '$item-border-color', tokens: ['--hub-list-item-border-color'] },
							{ param: '$hover-bg', tokens: ['--hub-list-item-hover-bg'] },
							{ param: '$selected-bg', tokens: ['--hub-list-item-selected-bg'] },
							{ param: '$selected-color', tokens: ['--hub-list-item-selected-color'] },
							{ param: '$border-radius', tokens: ['--hub-list-border-radius'] },
							{ param: '$item-border-radius', tokens: ['--hub-list-item-border-radius'] },
							{ param: '$item-padding-x', tokens: ['--hub-list-item-padding-x'] },
							{ param: '$item-padding-y', tokens: ['--hub-list-item-padding-y'] },
							{ param: '$gap', tokens: ['--hub-list-items-gap'] },
							{ param: '$cards-bg', tokens: ['--hub-list-cards-bg'] },
							{ param: '$cards-border-color', tokens: ['--hub-list-cards-border-color'] },
							{ param: '$cards-border-radius', tokens: ['--hub-list-cards-border-radius'] },
							{ param: '$cards-padding-x', tokens: ['--hub-list-cards-padding-x'] },
							{ param: '$cards-padding-y', tokens: ['--hub-list-cards-padding-y'] },
							{ param: '$cards-min-column-width', tokens: ['--hub-list-cards-min-column-width'] },
							{ param: '$cards-gap', tokens: ['--hub-list-cards-gap'] },
							{ param: '$footer-gap', tokens: ['--hub-list-bottom-bar-gap'] },
							{ param: '$footer-justify', tokens: ['--hub-list-bottom-bar-justify-content'] },
							{ param: '$footer-align', tokens: ['--hub-list-bottom-bar-align-items'] },
							{ param: '$footer-wrap', tokens: ['--hub-list-bottom-bar-wrap'] },
						]
					},
					{
						name: 'hub-table-theme',
						params: '$accent, $bg, $color, $border-color, $hover-bg, $hover-color, $selected-bg, $selected-color, $striped-bg, $striped-color, $border-width, $border-radius, $cell-padding-x, $cell-padding-y, $footer-gap, $footer-justify, $footer-align, $footer-wrap',
						description: 'One-call theming for `<hub-table>`',
						example: '@use \'ng-hub-ui-paginable/styles/mixins/table-theme\' as *;\n\n.invoices-table {\n  @include hub-table-theme(\n    $accent: var(--hub-sys-color-success),\n    $border-radius: 0.5rem,\n    $cell-padding-y: 0.375rem,\n    $footer-justify: end\n  );\n}',
						paramTokens: [
							{ param: '$accent', tokens: ['--hub-table-accent'] },
							{ param: '$bg', tokens: ['--hub-table-bg', '--hub-table-container-bg'] },
							{ param: '$color', tokens: ['--hub-table-color', '--hub-table-container-color'] },
							{ param: '$border-color', tokens: ['--hub-table-border-color'] },
							{ param: '$hover-bg', tokens: ['--hub-table-hover-bg'] },
							{ param: '$hover-color', tokens: ['--hub-table-hover-color'] },
							{ param: '$selected-bg', tokens: ['--hub-table-selected-bg'] },
							{ param: '$selected-color', tokens: ['--hub-table-selected-color'] },
							{ param: '$striped-bg', tokens: ['--hub-table-striped-bg'] },
							{ param: '$striped-color', tokens: ['--hub-table-striped-color'] },
							{ param: '$border-width', tokens: ['--hub-table-border-width'] },
							{ param: '$border-radius', tokens: ['--hub-table-border-radius'] },
							{ param: '$cell-padding-x', tokens: ['--hub-table-cell-padding-x'] },
							{ param: '$cell-padding-y', tokens: ['--hub-table-cell-padding-y'] },
							{ param: '$footer-gap', tokens: ['--hub-table-bottom-bar-gap'] },
							{ param: '$footer-justify', tokens: ['--hub-table-bottom-bar-justify-content'] },
							{ param: '$footer-align', tokens: ['--hub-table-bottom-bar-align-items'] },
							{ param: '$footer-wrap', tokens: ['--hub-table-bottom-bar-wrap'] },
						]
					},
				]
			}
		]
	},
	'toast': {
		intro: 'Override any of the `--hub-toast-*` design tokens in a single include. Every parameter is OPTIONAL and defaults to `null`: only the parameters you pass are emitted, so the rest keep the component\'s defaults. Token-based and self-contained (no Bootstrap dependencies).',
		use: '@use \'ng-hub-ui-toast/styles\' as toast;',
		catalog: [
			{
				group: 'Theming',
				mixins: [
					{
						name: 'hub-toast-theme',
						params: '$accent, $bg, $color, $border, $border-width, $border-radius, $shadow, $min-width, $max-width, $padding-x, $padding-y, $gap, $font-size, $title-font-size, $title-font-weight, $progress-bg, $progress-height, $close-opacity, $close-opacity-hover, $container-gap, $container-offset, $container-z-index',
						description: 'One-call theming for `<hub-toast>` notifications',
						example: '@use \'ng-hub-ui-toast/styles\' as *;\n\n// Brand the shared shell:\nhub-toast {\n  @include hub-toast-theme(\n    $border-radius: 0.75rem,\n    $border-width: 2px,\n    $shadow: 0 0.5rem 1.5rem rgba(0, 0, 0, 0.18)\n  );\n}\n\n// Or a custom semantic type (data-type="brand"):\nhub-toast[data-type=\'brand\'] {\n  @include hub-toast-theme($accent: #6f42c1, $bg: #f5f0fb, $color: #4a2c82);\n}',
						paramTokens: [
							{ param: '$accent', tokens: ['--hub-toast-accent'] },
							{ param: '$bg', tokens: ['--hub-toast-bg'] },
							{ param: '$color', tokens: ['--hub-toast-color'] },
							{ param: '$border', tokens: ['--hub-toast-border'] },
							{ param: '$border-width', tokens: ['--hub-toast-border-width'] },
							{ param: '$border-radius', tokens: ['--hub-toast-border-radius'] },
							{ param: '$shadow', tokens: ['--hub-toast-shadow'] },
							{ param: '$min-width', tokens: ['--hub-toast-min-width'] },
							{ param: '$max-width', tokens: ['--hub-toast-max-width'] },
							{ param: '$padding-x', tokens: ['--hub-toast-padding-x'] },
							{ param: '$padding-y', tokens: ['--hub-toast-padding-y'] },
							{ param: '$gap', tokens: ['--hub-toast-gap'] },
							{ param: '$font-size', tokens: ['--hub-toast-font-size'] },
							{ param: '$title-font-size', tokens: ['--hub-toast-title-font-size'] },
							{ param: '$title-font-weight', tokens: ['--hub-toast-title-font-weight'] },
							{ param: '$progress-bg', tokens: ['--hub-toast-progress-bg'] },
							{ param: '$progress-height', tokens: ['--hub-toast-progress-height'] },
							{ param: '$close-opacity', tokens: ['--hub-toast-close-opacity'] },
							{ param: '$close-opacity-hover', tokens: ['--hub-toast-close-opacity-hover'] },
							{ param: '$container-gap', tokens: ['--hub-toast-container-gap'] },
							{ param: '$container-offset', tokens: ['--hub-toast-container-offset'] },
							{ param: '$container-z-index', tokens: ['--hub-toast-container-zindex'] },
						]
					},
				]
			}
		]
	},
};
