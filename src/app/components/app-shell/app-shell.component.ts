import { Component, computed, inject, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { HubLoadingBarComponent } from 'ng-hub-ui-loading';
import {
	HubNavComponent,
	HubNavConfig,
	HubNavEndDirective,
	HubNavItem,
	HubNavOrientation,
	HubNavStartDirective
} from 'ng-hub-ui-nav';
import { HubSelectComponent } from 'ng-hub-ui-forms';
import { TranslatePipe } from 'ng-hub-ui-utils';
import { MenuItem } from '../../models/navigation.model';
import { CONSULTING_URL_EN, CONSULTING_URL_ES, REPOSITORY_URL } from '../../seo/seo.config';
import { APP_VERSION } from '../../version.generated';
import { APP_LANGUAGES, AppI18nService, AppLang, SEMANTIC_KEY_RE } from '../../services/app-i18n.service';
import { NavigationService } from '../../services/navigation.service';
import { ThemeService } from '../../services/theme.service';
import { AppBrandLogoComponent } from '../app-brand-logo/app-brand-logo.component';
import { LibrarySectionDefinition } from './app-shell.model';
import { FORMS_FUNCTIONALITIES } from '../../pages/forms/forms-functionalities';
import { TABLE_EXAMPLE_GROUPS } from '../../pages/table/table-example-groups';
import { BOARD_EXAMPLE_GROUPS } from '../../pages/board/board-example-groups';
import { PANELS_FUNCTIONALITIES } from '../../pages/panels/panels-functionalities';
import { NAV_FUNCTIONALITIES } from '../../pages/nav/nav-functionalities';
import { AVATAR_FUNCTIONALITIES } from '../../pages/avatar/avatar-functionalities';
import { ICONS_FUNCTIONALITIES } from '../../pages/icons/icons-functionalities';
import { ACTION_SHEET_FUNCTIONALITIES } from '../../pages/action-sheet/action-sheet-functionalities';
import { INSTALLER_FUNCTIONALITIES } from '../../pages/installer/installer-functionalities';
import { LOADING_FUNCTIONALITIES } from '../../pages/loading/loading-functionalities';

export type { LibrarySectionDefinition, LibrarySectionTab } from './app-shell.model';

/**
 * Two-level static sections shown for each library in the side navigation.
 */
const LIBRARY_SECTIONS: readonly LibrarySectionDefinition[] = [
	{ id: 'overview', label: 'UI.LIBRARY.TABS.OVERVIEW', tab: 'overview' },
	{ id: 'api', label: 'UI.LIBRARY.TABS.API', tab: 'api' },
	{ id: 'styles', label: 'UI.LIBRARY.TABS.STYLES', tab: 'styles' }
];

/**
 * In-page sections of the Design System guide page (`/design-system`), surfaced
 * as a second-level submenu whose entries scroll to the matching anchor id.
 *
 * The anchor id stays Spanish because it is part of the URL and changing it would break every
 * link ever shared; the label is a translation key, because it is what the reader sees. They were
 * Spanish literals, which rendered as Spanish whatever language the site was set to.
 */
const DESIGN_SYSTEM_SECTIONS: ReadonlyArray<{ id: string; label: string }> = [
	{ id: 'que-es', label: 'UI.DESIGN_SYSTEM.QUE_ES' },
	{ id: 'instalacion', label: 'UI.DESIGN_SYSTEM.INSTALACION' },
	{ id: 'arquitectura', label: 'UI.DESIGN_SYSTEM.ARQUITECTURA' },
	{ id: 'colores', label: 'UI.DESIGN_SYSTEM.COLORES' },
	{ id: 'crea-tu-tema', label: 'UI.DESIGN_SYSTEM.CREA_TU_TEMA' },
	{ id: 'familia', label: 'UI.DESIGN_SYSTEM.FAMILIA' },
	{ id: 'modificar', label: 'UI.DESIGN_SYSTEM.MODIFICAR' },
	{ id: 'funciones', label: 'UI.DESIGN_SYSTEM.FUNCIONES' },
	{ id: 'estructura', label: 'UI.DESIGN_SYSTEM.ESTRUCTURA' },
	{ id: 'mixins', label: 'UI.DESIGN_SYSTEM.MIXINS' },
	{ id: 'utilidades', label: 'UI.DESIGN_SYSTEM.UTILIDADES' },
	{ id: 'flexbox', label: 'UI.DESIGN_SYSTEM.FLEXBOX' },
	{ id: 'columnas', label: 'UI.DESIGN_SYSTEM.COLUMNAS' },
	{ id: 'texto', label: 'UI.DESIGN_SYSTEM.TEXTO' },
	{ id: 'superficies', label: 'UI.DESIGN_SYSTEM.SUPERFICIES' },
	{ id: 'helpers', label: 'UI.DESIGN_SYSTEM.HELPERS' },
	{ id: 'puentes', label: 'UI.DESIGN_SYSTEM.PUENTES' },
	{ id: 'referencia', label: 'UI.DESIGN_SYSTEM.REFERENCIA' }
];

/**
 * Library route ids that follow the standard `/:library/:tab` page format.
 */
const TABBED_LIBRARY_IDS = new Set([
	'action-sheet',
	'avatar',
	'board',
	'badges',
	'breadcrumbs',
	'buttons',
	'calendar',
	'forms',
	'history',
	'icons',
	'installer',
	'loading',
	'metrics',
	'signature',
	'milestones',
	'modal',
	'paginable',
	'panels',
	'portal',
	'skeleton',
	'utils',
	'sortable',
	'stepper',
	'toast',
	'nav'
]);

/**
 * Library route ids that expose an interactive Playground tab. Gating keeps the
 * extra section out of the sidebar for libraries that have not opted in yet.
 */
const LIBRARIES_WITH_PLAYGROUND = new Set([
	'forms',
	'avatar',
	'board',
	'badges',
	'breadcrumbs',
	'calendar',
	'loading',
	'milestones',
	'modal',
	'nav',
	'paginable',
	'panels',
	'skeleton',
	'sortable',
	'stepper',
	'toast'
]);

/**
 * Route ids whose page carries no API reference and no stylesheet.
 *
 * The installer is a command-line schematic — no inputs, no outputs, no template slots, no
 * custom properties — so its route tree has Overview and Examples only. Offering the other
 * two sections here would put links to redirects in the sidebar.
 */
const LIBRARIES_WITHOUT_API_SECTIONS = new Set(['installer']);

/**
 * Feature groups that give a library's example panel its section headings.
 *
 * Keyed by library so the rollout is per page: a library absent from here keeps the flat list.
 * The value is the SAME constant the documentation page uses for its feature blocks, so the
 * panel order, the page order and the feature list cannot drift apart.
 */
const LIBRARY_EXAMPLE_GROUPS: Record<string, ReadonlyArray<{ title: string; exampleIds: string[] }>> = {
	paginable: TABLE_EXAMPLE_GROUPS,
	forms: FORMS_FUNCTIONALITIES,
	panels: PANELS_FUNCTIONALITIES,
	nav: NAV_FUNCTIONALITIES,
	avatar: AVATAR_FUNCTIONALITIES,
	board: BOARD_EXAMPLE_GROUPS,
	icons: ICONS_FUNCTIONALITIES,
	loading: LOADING_FUNCTIONALITIES,
	'action-sheet': ACTION_SHEET_FUNCTIONALITIES,
	installer: INSTALLER_FUNCTIONALITIES
};

/**
 * Static map of example IDs and labels per library for the third-level nav panel.
 * Defined statically so the nav panel is fully populated from app startup,
 * independent of lazy page-level example registration timing.
 *
 * Where {@link LIBRARY_EXAMPLE_GROUPS} names a library, this map supplies only the labels —
 * the groups supply the order.
 */
const LIBRARY_EXAMPLES_NAV: Record<string, Array<{ id: string; label: string }>> = {
	avatar: [
		{ id: 'avatar-facebook', label: 'DOCS.AVATAR.NAV.FACEBOOK' },
		{ id: 'avatar-gravatar', label: 'DOCS.AVATAR.NAV.GRAVATAR' },
		{ id: 'avatar-github', label: 'DOCS.AVATAR.NAV.GITHUB' },
		{ id: 'avatar-custom-image', label: 'DOCS.AVATAR.NAV.CUSTOM_IMAGE' },
		{ id: 'avatar-initials', label: 'DOCS.AVATAR.NAV.INITIALS' },
		{ id: 'avatar-value', label: 'DOCS.AVATAR.NAV.VALUE' },
		{ id: 'avatar-fallback', label: 'DOCS.AVATAR.NAV.FALLBACK' },
		{ id: 'avatar-size', label: 'DOCS.AVATAR.NAV.SIZE' },
		{ id: 'avatar-text-ratio', label: 'DOCS.AVATAR.NAV.TEXT_RATIO' },
		{ id: 'avatar-initials-size', label: 'DOCS.AVATAR.NAV.INITIALS_SIZE' },
		{ id: 'avatar-round', label: 'DOCS.AVATAR.NAV.ROUND' },
		{ id: 'avatar-corner-radius', label: 'DOCS.AVATAR.NAV.CORNER_RADIUS' },
		{ id: 'avatar-colors', label: 'DOCS.AVATAR.NAV.COLORS' },
		{ id: 'avatar-border', label: 'DOCS.AVATAR.NAV.BORDER' },
		{ id: 'avatar-custom-style', label: 'DOCS.AVATAR.NAV.CUSTOM_STYLE' },
		{ id: 'avatar-click', label: 'DOCS.AVATAR.NAV.CLICK' },
		{ id: 'avatar-group', label: 'DOCS.AVATAR.NAV.GROUP' },
		{ id: 'avatar-status', label: 'DOCS.AVATAR.NAV.STATUS' },
		{ id: 'avatar-custom-content', label: 'DOCS.AVATAR.NAV.CUSTOM_CONTENT' }
	],
	board: [
		{ id: 'board-basic', label: 'DOCS.BOARD.NAV.BASIC' },
		{ id: 'board-card-drag-drop', label: 'DOCS.BOARD.NAV.CARD_DRAG_DROP' },
		{ id: 'board-keyboard-accessibility', label: 'DOCS.BOARD.NAV.KEYBOARD_ACCESSIBILITY' },
		{ id: 'board-column-reordering', label: 'DOCS.BOARD.NAV.COLUMN_REORDERING' },
		{ id: 'board-card-click', label: 'DOCS.BOARD.NAV.CARD_CLICK' },
		{ id: 'board-infinite-scroll', label: 'DOCS.BOARD.NAV.INFINITE_SCROLL' },
		{ id: 'board-custom-card-template', label: 'DOCS.BOARD.NAV.CUSTOM_CARD_TEMPLATE' },
		{ id: 'board-custom-header-template', label: 'DOCS.BOARD.NAV.CUSTOM_HEADER_TEMPLATE' },
		{ id: 'board-custom-footer-template', label: 'DOCS.BOARD.NAV.CUSTOM_FOOTER_TEMPLATE' },
		{ id: 'board-disable-sorting', label: 'DOCS.BOARD.NAV.DISABLE_SORTING' },
		{ id: 'board-drag-behavior', label: 'DOCS.BOARD.NAV.DRAG_BEHAVIOR' },
		{ id: 'board-styling-customization', label: 'DOCS.BOARD.NAV.STYLING_CUSTOMIZATION' },
		{ id: 'board-card-placeholder', label: 'DOCS.BOARD.NAV.CARD_PLACEHOLDER' },
		{ id: 'board-column-placeholder', label: 'DOCS.BOARD.NAV.COLUMN_PLACEHOLDER' },
		{ id: 'board-drag-preview', label: 'DOCS.BOARD.NAV.DRAG_PREVIEW' },
		{ id: 'board-events', label: 'DOCS.BOARD.NAV.EVENTS' }
	],
	badges: [
		{ id: 'badges-matrix', label: 'DOCS.BADGES.NAV.MATRIX' },
		{ id: 'badges-scale-shape', label: 'DOCS.BADGES.NAV.SCALE_SHAPE' },
		{ id: 'badges-status-counters', label: 'DOCS.BADGES.NAV.STATUS_COUNTERS' },
		{ id: 'badges-removable', label: 'DOCS.BADGES.NAV.REMOVABLE' },
		{ id: 'badges-theming', label: 'DOCS.BADGES.NAV.THEMING' },
		{ id: 'badges-chip', label: 'DOCS.BADGES.NAV.CHIP' },
		{ id: 'badges-chip-colors', label: 'DOCS.BADGES.NAV.CHIP_COLORS' },
		{ id: 'badges-truncation', label: 'DOCS.BADGES.EXAMPLE.TRUNCATION.TITLE' }
	],
	buttons: [
		{ id: 'buttons-btn-variants', label: 'DOCS.BUTTONS.NAV.BTN_VARIANTS' },
		{ id: 'buttons-fab', label: 'DOCS.BUTTONS.NAV.FAB' },
		{ id: 'buttons-speed-dial', label: 'DOCS.BUTTONS.NAV.SPEED_DIAL' },
		{ id: 'buttons-dropdown', label: 'DOCS.BUTTONS.NAV.DROPDOWN' },
		{ id: 'buttons-css-variables', label: 'DOCS.BUTTONS.NAV.CSS_VARIABLES' },
		{ id: 'buttons-loading', label: 'DOCS.BUTTONS.EXAMPLE.LOADING.TITLE' },
		{ id: 'buttons-custom-color', label: 'DOCS.BUTTONS.EXAMPLE.CUSTOM_COLOR.TITLE' },
		{ id: 'buttons-single-open', label: 'DOCS.BUTTONS.EXAMPLE.SINGLE_OPEN.TITLE' }
	],
	breadcrumbs: [
		{ id: 'basic-breadcrumbs', label: 'DOCS.BREADCRUMBS.NAV.BASIC' },
		{ id: 'dynamic-breadcrumbs', label: 'DOCS.BREADCRUMBS.NAV.DYNAMIC' },
		{ id: 'custom-templates', label: 'DOCS.BREADCRUMBS.NAV.CUSTOM' },
		{ id: 'icons-breadcrumbs', label: 'DOCS.BREADCRUMBS.NAV.ICONS' },
		{ id: 'rtl-breadcrumbs', label: 'DOCS.BREADCRUMBS.NAV.RTL' },
		{ id: 'truncation-breadcrumbs', label: 'DOCS.BREADCRUMBS.NAV.TRUNCATION' },
		{ id: 'collapse-breadcrumbs', label: 'DOCS.BREADCRUMBS.NAV.COLLAPSE' },
		{ id: 'external-links-breadcrumbs', label: 'DOCS.BREADCRUMBS.NAV.EXTERNAL_LINKS' },
		{ id: 'focus-ring-breadcrumbs', label: 'DOCS.BREADCRUMBS.NAV.FOCUS_RING' },
		{ id: 'signal-breadcrumbs', label: 'DOCS.BREADCRUMBS.NAV.SIGNAL' }
	],
	calendar: [
		{ id: 'calendar-basic', label: 'DOCS.CALENDAR.NAV.BASIC' },
		{ id: 'calendar-navigation', label: 'DOCS.CALENDAR.NAV.NAVIGATION' },
		{ id: 'calendar-events', label: 'DOCS.CALENDAR.NAV.EVENTS' },
		{ id: 'calendar-event-overflow', label: 'DOCS.CALENDAR.NAV.EVENT_OVERFLOW' },
		{ id: 'calendar-drag-drop', label: 'DOCS.CALENDAR.NAV.DRAG_DROP' },
		{ id: 'calendar-templates', label: 'DOCS.CALENDAR.NAV.TEMPLATES' },
		{ id: 'calendar-formats', label: 'DOCS.CALENDAR.EXAMPLE.FORMATS.TITLE' },
		{ id: 'calendar-configuration', label: 'DOCS.CALENDAR.NAV.CONFIGURATION' },
		{ id: 'calendar-styling', label: 'DOCS.CALENDAR.NAV.STYLING' },
		{ id: 'calendar-variant', label: 'DOCS.CALENDAR.NAV.VARIANT' },
		{ id: 'calendar-i18n', label: 'DOCS.CALENDAR.NAV.I18N' }
	],
	forms: [
		{ id: 'forms-input-basic', label: 'DOCS.FORMS.EXAMPLE.INPUT_BASIC.TITLE' },
		{ id: 'forms-input-password', label: 'DOCS.FORMS.EXAMPLE.INPUT_PASSWORD.TITLE' },
		{ id: 'forms-input-formats', label: 'DOCS.FORMS.EXAMPLE.INPUT_FORMATS.TITLE' },
		{ id: 'forms-input-color-swatches', label: 'DOCS.FORMS.EXAMPLE.INPUT_COLOR_SWATCHES.TITLE' },
		{ id: 'forms-input-groups', label: 'DOCS.FORMS.EXAMPLE.INPUT_GROUPS.TITLE' },
		{ id: 'forms-input-mask', label: 'DOCS.FORMS.EXAMPLE.INPUT_MASK.TITLE' },
		{ id: 'forms-input-otp', label: 'DOCS.FORMS.EXAMPLE.INPUT_OTP.TITLE' },
		{ id: 'forms-input-search', label: 'DOCS.FORMS.EXAMPLE.INPUT_SEARCH.TITLE' },
		{ id: 'forms-textarea', label: 'DOCS.FORMS.EXAMPLE.TEXTAREA.TITLE' },
		{ id: 'forms-slider', label: 'DOCS.FORMS.EXAMPLE.SLIDER.TITLE' },
		{ id: 'forms-slider-styling', label: 'DOCS.FORMS.EXAMPLE.SLIDER_STYLING.TITLE' },
		{ id: 'forms-segmented', label: 'DOCS.FORMS.EXAMPLE.SEGMENTED.TITLE' },
		{ id: 'forms-segmented-template', label: 'DOCS.FORMS.EXAMPLE.SEGMENTED_TEMPLATE.TITLE' },
		{ id: 'forms-select', label: 'DOCS.FORMS.EXAMPLE.SELECT.TITLE' },
		{ id: 'forms-select-grouped', label: 'DOCS.FORMS.EXAMPLE.SELECT_GROUPED.TITLE' },
		{ id: 'forms-select-search', label: 'DOCS.FORMS.EXAMPLE.SELECT_SEARCH.TITLE' },
		{ id: 'forms-select-typeahead', label: 'DOCS.FORMS.EXAMPLE.SELECT_TYPEAHEAD.TITLE' },
		{ id: 'forms-select-templates', label: 'DOCS.FORMS.EXAMPLE.SELECT_TEMPLATES.TITLE' },
		{ id: 'forms-select-formats', label: 'DOCS.FORMS.EXAMPLE.SELECT_FORMATS.TITLE' },
		{ id: 'forms-select-in-modal', label: 'DOCS.FORMS.EXAMPLE.SELECT_IN_MODAL.TITLE' },
		{ id: 'forms-select-addons', label: 'DOCS.FORMS.EXAMPLE.SELECT_ADDONS.TITLE' },
		{ id: 'forms-field-attached', label: 'DOCS.FORMS.EXAMPLE.FIELD_ATTACHED.TITLE' },
		{ id: 'forms-timepicker', label: 'DOCS.FORMS.EXAMPLE.TIMEPICKER.TITLE' },
		{ id: 'forms-datepicker', label: 'DOCS.FORMS.EXAMPLE.DATEPICKER.TITLE' },
		{ id: 'forms-datepicker-time', label: 'DOCS.FORMS.EXAMPLE.DATEPICKER_TIME.TITLE' },
		{ id: 'forms-datepicker-granularity', label: 'DOCS.FORMS.EXAMPLE.DATEPICKER_GRANULARITY.TITLE' },
		{ id: 'forms-datepicker-formats', label: 'DOCS.FORMS.EXAMPLE.DATEPICKER_FORMATS.TITLE' },
		{ id: 'forms-datepicker-day-time-range', label: 'DOCS.FORMS.EXAMPLE.DATEPICKER_DAY_TIME_RANGE.TITLE' },
		{ id: 'forms-file-input-basic', label: 'DOCS.FORMS.EXAMPLE.FILE_INPUT_BASIC.TITLE' },
		{ id: 'forms-file-input-dropzone', label: 'DOCS.FORMS.EXAMPLE.FILE_INPUT_DROPZONE.TITLE' },
		{ id: 'forms-file-input-upload', label: 'DOCS.FORMS.EXAMPLE.FILE_INPUT_UPLOAD.TITLE' },
		{ id: 'forms-file-input-inline', label: 'DOCS.FORMS.EXAMPLE.FILE_INPUT_INLINE.TITLE' },
		{ id: 'forms-containers', label: 'DOCS.FORMS.EXAMPLE.CONTAINERS.TITLE' },
		{ id: 'forms-plaintext', label: 'DOCS.FORMS.EXAMPLE.PLAINTEXT.TITLE' },
		{ id: 'forms-form-text-tooltip', label: 'DOCS.FORMS.EXAMPLE.FORM_TEXT_TOOLTIP.TITLE' },
		{ id: 'forms-label-visually-hidden', label: 'DOCS.FORMS.EXAMPLE.LABEL_VISUALLY_HIDDEN.TITLE' },
		{ id: 'forms-datepicker-in-modal', label: 'DOCS.FORMS.EXAMPLE.DATEPICKER_IN_MODAL.TITLE' },
		{ id: 'forms-rtl', label: 'DOCS.FORMS.EXAMPLE.RTL.TITLE' }
	],
	history: [
		{ id: 'history-basic', label: 'DOCS.HISTORY.NAV.BASIC' },
		{ id: 'history-nested', label: 'DOCS.HISTORY.NAV.NESTED' },
		{ id: 'history-reactive-form', label: 'DOCS.HISTORY.NAV.REACTIVE_FORM' },
		{ id: 'history-transaction-limits', label: 'DOCS.HISTORY.NAV.TRANSACTION_LIMITS' }
	],
	icons: [
		{ id: 'icons-setup', label: 'DOCS.ICONS.EXAMPLE.SETUP.TITLE' },
		{ id: 'icons-font-awesome', label: 'DOCS.ICONS.EXAMPLE.FONT_AWESOME.TITLE' },
		{ id: 'icons-bootstrap', label: 'DOCS.ICONS.EXAMPLE.BOOTSTRAP.TITLE' },
		{ id: 'icons-material', label: 'DOCS.ICONS.EXAMPLE.MATERIAL.TITLE' },
		{ id: 'icons-solar', label: 'DOCS.ICONS.EXAMPLE.SOLAR.TITLE' },
		{ id: 'icons-svg', label: 'DOCS.ICONS.EXAMPLE.SVG.TITLE' },
		{ id: 'icons-sprite', label: 'DOCS.ICONS.EXAMPLE.SPRITE.TITLE' },
		{ id: 'icons-img', label: 'DOCS.ICONS.EXAMPLE.IMG.TITLE' },
		{ id: 'icons-variants', label: 'DOCS.ICONS.EXAMPLE.VARIANTS.TITLE' },
		{ id: 'icons-directive', label: 'DOCS.ICONS.EXAMPLE.DIRECTIVE.TITLE' },
		{ id: 'icons-theming', label: 'DOCS.ICONS.EXAMPLE.THEMING.TITLE' },
		{ id: 'icons-buttons', label: 'DOCS.ICONS.EXAMPLE.BUTTONS.TITLE' }
	],
	'action-sheet': [
		{ id: 'action-sheet-basic', label: 'DOCS.ACTION_SHEET.NAV.BASIC' },
		{ id: 'action-sheet-roles', label: 'DOCS.ACTION_SHEET.NAV.ROLES' },
		{ id: 'action-sheet-groups', label: 'DOCS.ACTION_SHEET.NAV.GROUPS' },
		{ id: 'action-sheet-theming', label: 'DOCS.ACTION_SHEET.NAV.THEMING' }
	],
	installer: [
		{ id: 'installer-interactive', label: 'DOCS.INSTALLER.NAV.INTERACTIVE' },
		{ id: 'installer-non-interactive', label: 'DOCS.INSTALLER.NAV.NON_INTERACTIVE' },
		{ id: 'installer-resolved-dependencies', label: 'DOCS.INSTALLER.NAV.RESOLVED_DEPENDENCIES' }
	],
	loading: [
		{ id: 'loading-basic-usage', label: 'DOCS.LOADING.NAV.BASIC_USAGE' },
		{ id: 'loading-indicator-variants', label: 'DOCS.LOADING.NAV.INDICATOR_VARIANTS' },
		{ id: 'loading-container-overlay', label: 'DOCS.LOADING.NAV.CONTAINER_OVERLAY' },
		{ id: 'loading-fullscreen-service', label: 'DOCS.LOADING.NAV.FULLSCREEN_SERVICE' },
		{ id: 'loading-branded-image', label: 'DOCS.LOADING.NAV.BRANDED_IMAGE' },
		{ id: 'loading-css-variables', label: 'DOCS.LOADING.NAV.CSS_VARIABLES' },
		{ id: 'loading-page-progress', label: 'DOCS.LOADING.NAV.PAGE_PROGRESS' },
		{ id: 'loading-determinate-bar', label: 'DOCS.LOADING.NAV.DETERMINATE_BAR' },
		{ id: 'loading-router-http-bar', label: 'DOCS.LOADING.NAV.ROUTER_HTTP_BAR' },
		{ id: 'loading-rtl-sweep', label: 'DOCS.LOADING.NAV.RTL_SWEEP' }
	],
	// Kept in the registry's own order, and complete: an example missing from here is
	// registered, rendered and unreachable from the sidebar.
	modal: [
		{ id: 'modal-content', label: 'DOCS.MODAL.NAV.CONTENT' },
		{ id: 'modal-options', label: 'DOCS.MODAL.NAV.OPTIONS' },
		{ id: 'modal-placement', label: 'DOCS.MODAL.NAV.PLACEMENT' },
		{ id: 'modal-offcanvas', label: 'DOCS.MODAL.EXAMPLE.OFFCANVAS.TITLE' },
		{ id: 'modal-ref', label: 'DOCS.MODAL.NAV.REF' },
		{ id: 'modal-active', label: 'DOCS.MODAL.NAV.ACTIVE' },
		{ id: 'modal-typed-data', label: 'DOCS.MODAL.EXAMPLE.TYPED_DATA.TITLE' },
		{ id: 'modal-stack', label: 'DOCS.MODAL.NAV.STACK' },
		{ id: 'modal-fullscreen', label: 'DOCS.MODAL.NAV.FULLSCREEN' },
		{ id: 'modal-projection', label: 'DOCS.MODAL.NAV.PROJECTION' },
		{ id: 'modal-body-selector', label: 'DOCS.MODAL.EXAMPLE.BODY_SELECTOR.TITLE' },
		{ id: 'modal-variants', label: 'DOCS.MODAL.EXAMPLE.VARIANTS.TITLE' },
		{ id: 'modal-styling', label: 'DOCS.MODAL.NAV.STYLING' }
	],
	nav: [
		{ id: 'nav-basic-horizontal', label: 'DOCS.NAV.NAV.BASIC_HORIZONTAL' },
		{ id: 'nav-vertical-accordion', label: 'DOCS.NAV.NAV.VERTICAL_ACCORDION' },
		{ id: 'nav-vertical-flyout', label: 'DOCS.NAV.NAV.VERTICAL_FLYOUT' },
		{ id: 'nav-vertical-sticky', label: 'DOCS.NAV.NAV.VERTICAL_STICKY' },
		{ id: 'nav-rail-collapse', label: 'DOCS.NAV.NAV.RAIL_COLLAPSE' },
		{ id: 'nav-nested-dropdowns', label: 'DOCS.NAV.NAV.NESTED_DROPDOWNS' },
		{ id: 'nav-headers-separators', label: 'DOCS.NAV.NAV.HEADERS_SEPARATORS' },
		{ id: 'nav-disabled-states', label: 'DOCS.NAV.NAV.DISABLED_STATES' },
		{ id: 'nav-dropdown-triggers', label: 'DOCS.NAV.NAV.DROPDOWN_TRIGGERS' },
		{ id: 'nav-responsive-collapse', label: 'DOCS.NAV.NAV.RESPONSIVE_COLLAPSE' },
		{ id: 'nav-brand-slot', label: 'DOCS.NAV.NAV.BRAND_SLOT' },
		{ id: 'nav-custom-item-template', label: 'DOCS.NAV.NAV.CUSTOM_ITEM_TEMPLATE' },
		{ id: 'nav-rtl-slots', label: 'DOCS.NAV.NAV.RTL_SLOTS' },
		{ id: 'nav-events-api', label: 'DOCS.NAV.NAV.EVENTS_API' },
		{ id: 'nav-router-active', label: 'DOCS.NAV.NAV.ROUTER_ACTIVE' },
		{ id: 'nav-panel-drilldown', label: 'DOCS.NAV.NAV.PANEL_DRILLDOWN' },
		{ id: 'nav-mixed-expand-modes', label: 'DOCS.NAV.NAV.MIXED_EXPAND_MODES' },
		{ id: 'nav-sidebar-right-panel', label: 'DOCS.NAV.NAV.SIDEBAR_RIGHT_PANEL' },
		{ id: 'nav-truncated-labels', label: 'DOCS.NAV.EXAMPLE.TRUNCATED_LABELS.TITLE' }
	],
	milestones: [
		{ id: 'milestones-vertical', label: 'DOCS.MILESTONES.EXAMPLE.VERTICAL.TITLE' },
		{ id: 'milestones-horizontal', label: 'DOCS.MILESTONES.EXAMPLE.HORIZONTAL.TITLE' },
		{ id: 'milestones-horizontal-pulse', label: 'DOCS.MILESTONES.EXAMPLE.HORIZONTAL_PULSE.TITLE' },
		{ id: 'milestones-states', label: 'DOCS.MILESTONES.EXAMPLE.STATES.TITLE' },
		{ id: 'milestones-custom-nodes', label: 'DOCS.MILESTONES.EXAMPLE.CUSTOM_NODES.TITLE' },
		{ id: 'milestones-css-variables', label: 'DOCS.MILESTONES.EXAMPLE.CSS_VARIABLES.TITLE' }
	],
	panels: [
		{ id: 'panels-basic', label: 'DOCS.PANELS.NAV.BASIC' },
		{ id: 'panels-pills', label: 'DOCS.PANELS.NAV.PILLS' },
		{ id: 'panels-accordion', label: 'DOCS.PANELS.NAV.ACCORDION' },
		{ id: 'panels-vertical', label: 'DOCS.PANELS.NAV.VERTICAL' },
		{ id: 'panels-justified', label: 'DOCS.PANELS.NAV.JUSTIFIED' },
		{ id: 'panels-scrollable', label: 'DOCS.PANELS.NAV.SCROLLABLE' },
		{ id: 'panels-disabled', label: 'DOCS.PANELS.NAV.DISABLED' },
		{ id: 'panels-removable', label: 'DOCS.PANELS.NAV.REMOVABLE' },
		{ id: 'panels-custom-heading', label: 'DOCS.PANELS.NAV.CUSTOM_HEADING' },
		{ id: 'panels-reactive-forms', label: 'DOCS.PANELS.NAV.REACTIVE_FORMS' },
		{ id: 'panels-multiple', label: 'DOCS.PANELS.NAV.MULTIPLE' },
		{ id: 'panels-multiple-flush', label: 'DOCS.PANELS.NAV.MULTIPLE_FLUSH' },
		{ id: 'panels-keyboard', label: 'DOCS.PANELS.NAV.KEYBOARD' },
		{ id: 'panels-card', label: 'DOCS.PANELS.NAV.CARD' },
		{ id: 'panels-card-slots', label: 'DOCS.PANELS.EXAMPLE.CARD_SLOTS.TITLE' },
		{ id: 'panels-alert', label: 'DOCS.PANELS.NAV.ALERT' },
		{ id: 'panels-variant', label: 'DOCS.PANELS.EXAMPLE.VARIANT.TITLE' },
		{ id: 'panels-tab-nav', label: 'DOCS.PANELS.EXAMPLE.TAB_NAV.TITLE' },
		{ id: 'panels-side-panel', label: 'DOCS.PANELS.EXAMPLE.SIDE_PANEL.TITLE' },
		{ id: 'panels-multiple-vertical', label: 'DOCS.PANELS.EXAMPLE.MULTIPLE_VERTICAL.TITLE' },
		{ id: 'panels-heading-actions', label: 'DOCS.PANELS.EXAMPLE.HEADING_ACTIONS.TITLE' },
		{ id: 'panels-mixin', label: 'DOCS.PANELS.EXAMPLE.MIXIN.TITLE' }
	],
	paginable: [
		{ id: 'table-basic', label: 'DOCS.PAGINABLE.NAV.BASIC' },
		{ id: 'table-css-variables', label: 'DOCS.PAGINABLE.NAV.CSS_VARIABLES' },
		{ id: 'table-pagination', label: 'DOCS.PAGINABLE.NAV.PAGINATION' },
		{ id: 'table-sorting-filtering', label: 'DOCS.PAGINABLE.NAV.SORTING_FILTERING' },
		{ id: 'table-advanced-filtering', label: 'DOCS.PAGINABLE.NAV.ADVANCED_FILTERING' },
		{ id: 'table-menu-filters', label: 'DOCS.PAGINABLE.EXAMPLE.MENU_FILTERS.TITLE' },
		{ id: 'table-selection', label: 'DOCS.PAGINABLE.NAV.SELECTION' },
		{ id: 'table-expandable-sticky', label: 'DOCS.PAGINABLE.NAV.EXPANDABLE_STICKY' },
		{ id: 'table-multiple-sticky', label: 'DOCS.PAGINABLE.EXAMPLE.MULTIPLE_STICKY.TITLE' },
		{ id: 'table-themeable-header', label: 'DOCS.PAGINABLE.EXAMPLE.THEMEABLE_HEADER.TITLE' },
		{ id: 'table-sticky-header-scroll', label: 'DOCS.PAGINABLE.EXAMPLE.STICKY_HEADER_SCROLL.TITLE' },
		{ id: 'table-tag-retheme-dark', label: 'DOCS.PAGINABLE.EXAMPLE.TAG_RETHEME_DARK.TITLE' },
		{ id: 'table-caret-icons', label: 'DOCS.PAGINABLE.EXAMPLE.CARET_ICONS.TITLE' },
		{ id: 'table-custom-icons', label: 'DOCS.PAGINABLE.EXAMPLE.CUSTOM_ICONS.TITLE' },
		{ id: 'table-mixin-theme', label: 'DOCS.PAGINABLE.EXAMPLE.MIXIN_THEME.TITLE' },
		{ id: 'table-custom-templates', label: 'DOCS.PAGINABLE.NAV.CUSTOM_TEMPLATES' },
		{ id: 'table-responsive-states', label: 'DOCS.PAGINABLE.NAV.RESPONSIVE_STATES' },
		{ id: 'list-basic', label: 'DOCS.PAGINABLE.NAV.LIST_BASIC' },
		{ id: 'list-connected', label: 'DOCS.PAGINABLE.EXAMPLE.CONNECTED_LIST.TITLE' },
		{ id: 'list-selection', label: 'DOCS.PAGINABLE.EXAMPLE.LIST_SELECTION.TITLE' },
		{ id: 'list-cards', label: 'DOCS.PAGINABLE.NAV.CARDS' },
		{ id: 'list-nested', label: 'DOCS.PAGINABLE.NAV.LIST_NESTED' },
		{ id: 'list-drag-drop', label: 'DOCS.PAGINABLE.NAV.LIST_DRAG_DROP' },
		{ id: 'list-whole-item-drag', label: 'DOCS.PAGINABLE.NAV.LIST_WHOLE_ITEM_DRAG' },
		{ id: 'list-nested-drag', label: 'DOCS.PAGINABLE.NAV.LIST_NESTED_DRAG' },
		{ id: 'list-css-variables', label: 'DOCS.PAGINABLE.NAV.LIST_CSS_VARIABLES' },
		{ id: 'table-row-class', label: 'DOCS.PAGINABLE.NAV.ROW_CLASS' },
		{ id: 'table-master-detail-selection', label: 'DOCS.PAGINABLE.EXAMPLE.MASTER_DETAIL_SELECTION.TITLE' },
		{ id: 'table-i18n', label: 'DOCS.PAGINABLE.NAV.I18N' },
		{ id: 'table-batch-actions', label: 'DOCS.PAGINABLE.NAV.BATCH_ACTIONS' },
		{ id: 'table-rtl', label: 'DOCS.PAGINABLE.NAV.RTL' },
		{ id: 'table-pagination-position', label: 'DOCS.PAGINABLE.EXAMPLE.PAGINATION_POSITION.TITLE' },
		{ id: 'table-server-side-operations', label: 'DOCS.PAGINABLE.NAV.SERVER_SIDE_OPERATIONS' },
		{ id: 'table-bottom-bar-ordering', label: 'DOCS.PAGINABLE.NAV.BOTTOM_BAR_ORDERING' },
		{ id: 'table-form-controls', label: 'DOCS.PAGINABLE.EXAMPLE.FORM_CONTROLS.TITLE' },
		{ id: 'table-client-pagination', label: 'DOCS.PAGINABLE.EXAMPLE.CLIENT_PAGINATION.TITLE' },
		{ id: 'table-default-state-components', label: 'DOCS.PAGINABLE.EXAMPLE.DEFAULT_STATE_COMPONENTS.TITLE' },
		{ id: 'list-states', label: 'DOCS.PAGINABLE.EXAMPLE.LIST_STATES.TITLE' },
		{ id: 'table-action-buttons', label: 'DOCS.PAGINABLE.EXAMPLE.ACTION_BUTTONS.TITLE' },
		{ id: 'table-column-visibility', label: 'DOCS.PAGINABLE.EXAMPLE.COLUMN_VISIBILITY.TITLE' },
		{ id: 'table-custom-filter-templates', label: 'DOCS.PAGINABLE.EXAMPLE.CUSTOM_FILTER_TEMPLATES.TITLE' },
		{ id: 'table-empty-error-states', label: 'DOCS.PAGINABLE.EXAMPLE.EMPTY_ERROR_STATES.TITLE' },
		{ id: 'table-resizable-columns', label: 'DOCS.PAGINABLE.EXAMPLE.RESIZABLE_COLUMNS.TITLE' },
		{ id: 'table-row-click', label: 'DOCS.PAGINABLE.EXAMPLE.ROW_CLICK.TITLE' },
		{ id: 'table-row-menus', label: 'DOCS.PAGINABLE.EXAMPLE.ROW_MENUS.TITLE' },
		{ id: 'table-filter-theming', label: 'DOCS.PAGINABLE.EXAMPLE.FILTER_THEMING.TITLE' },
		{ id: 'table-resource', label: 'DOCS.PAGINABLE.EXAMPLE.RESOURCE.TITLE' },
		{ id: 'list-resource', label: 'DOCS.PAGINABLE.EXAMPLE.LIST_RESOURCE.TITLE' },
		{ id: 'table-select-while-selecting', label: 'DOCS.PAGINABLE.EXAMPLE.SELECT_WHILE_SELECTING.TITLE' },
		{ id: 'table-compare-search-fn', label: 'DOCS.PAGINABLE.EXAMPLE.COMPARE_SEARCH_FN.TITLE' },
		{ id: 'paginator-basic', label: 'DOCS.PAGINABLE.EXAMPLE.PAGINATOR_BASIC.TITLE' },
		{ id: 'table-editable', label: 'DOCS.PAGINABLE.EXAMPLE.TABLE_EDITABLE.TITLE' },
		{ id: 'table-action-variants', label: 'DOCS.PAGINABLE.EXAMPLE.ACTION_VARIANTS.TITLE' },
		{ id: 'list-flush', label: 'DOCS.PAGINABLE.EXAMPLE.LIST_FLUSH.TITLE' },
		{ id: 'list-group-selection', label: 'DOCS.PAGINABLE.EXAMPLE.LIST_GROUP_SELECTION.TITLE' }
	],
	portal: [
		{ id: 'portal-component-rendering', label: 'DOCS.PORTAL.NAV.COMPONENT_RENDERING' },
		{ id: 'portal-templateref-rendering', label: 'DOCS.PORTAL.NAV.TEMPLATEREF_RENDERING' },
		{ id: 'portal-string-content', label: 'DOCS.PORTAL.NAV.STRING_CONTENT' },
		{ id: 'portal-data-passing', label: 'DOCS.PORTAL.NAV.DATA_PASSING' },
		{ id: 'portal-content-projection', label: 'DOCS.PORTAL.NAV.CONTENT_PROJECTION' },
		{ id: 'portal-progressive-open', label: 'DOCS.PORTAL.NAV.PROGRESSIVE_OPEN' },
		{ id: 'portal-toggle', label: 'DOCS.PORTAL.NAV.TOGGLE' },
		{ id: 'portal-basic', label: 'DOCS.PORTAL.NAV.BASIC' },
		{ id: 'portal-positioning', label: 'DOCS.PORTAL.NAV.POSITIONING' },
		{ id: 'portal-service', label: 'DOCS.PORTAL.NAV.SERVICE' }
	],
	metrics: [
		{ id: 'metrics-progress', label: 'DOCS.METRICS.NAV.PROGRESS' },
		{ id: 'metrics-meter', label: 'DOCS.METRICS.NAV.METER' },
		{ id: 'metrics-ring', label: 'DOCS.METRICS.NAV.RING' },
		{ id: 'metrics-theming', label: 'DOCS.METRICS.EXAMPLE.THEMING.TITLE' }
	],
	signature: [
		{ id: 'signature-basic', label: 'DOCS.COMMON.LIBRARY.SIGNATURE' },
		{ id: 'signature-i18n', label: 'DOCS.SIGNATURE.EXAMPLE.I18N.TITLE' },
		{ id: 'signature-keyboard', label: 'DOCS.SIGNATURE.EXAMPLE.KEYBOARD.TITLE' },
		{ id: 'signature-form', label: 'DOCS.SIGNATURE.EXAMPLE.FORM.TITLE' },
		{ id: 'signature-draw-events', label: 'DOCS.SIGNATURE.EXAMPLE.DRAW_EVENTS.TITLE' },
		{ id: 'signature-surface', label: 'DOCS.SIGNATURE.EXAMPLE.SURFACE.TITLE' },
		{ id: 'signature-label-type', label: 'DOCS.SIGNATURE.EXAMPLE.LABEL_TYPE.TITLE' },
		{ id: 'signature-naming', label: 'DOCS.SIGNATURE.EXAMPLE.NAMING.TITLE' },
		{ id: 'signature-projected-templates', label: 'DOCS.SIGNATURE.EXAMPLE.PROJECTED.TITLE' }
	],
	skeleton: [
		{ id: 'skeleton-preset-catalogue', label: 'DOCS.SKELETON.NAV.PRESET_CATALOGUE' },
		{ id: 'skeleton-card-preset', label: 'DOCS.SKELETON.NAV.CARD_PRESET' },
		{ id: 'skeleton-compact-dsl', label: 'DOCS.SKELETON.NAV.COMPACT_DSL' },
		{ id: 'skeleton-inline-template', label: 'DOCS.SKELETON.NAV.INLINE_TEMPLATE' },
		{ id: 'skeleton-custom-preset', label: 'DOCS.SKELETON.NAV.CUSTOM_PRESET' },
		{ id: 'skeleton-responsive-table', label: 'DOCS.SKELETON.NAV.RESPONSIVE_TABLE' },
		{ id: 'skeleton-compact-variant', label: 'DOCS.SKELETON.NAV.COMPACT_VARIANT' },
		{ id: 'skeleton-dashboard-composition', label: 'DOCS.SKELETON.NAV.DASHBOARD_COMPOSITION' }
	],
	sortable: [
		{ id: 'sortable-array', label: 'DOCS.SORTABLE.NAV.ARRAY' },
		{ id: 'sortable-form-array', label: 'DOCS.SORTABLE.NAV.FORM_ARRAY' },
		{ id: 'sortable-options', label: 'DOCS.SORTABLE.NAV.OPTIONS' },
		{ id: 'sortable-multiple-lists', label: 'DOCS.SORTABLE.NAV.MULTIPLE_LISTS' },
		{ id: 'sortable-layout-builder', label: 'DOCS.SORTABLE.NAV.LAYOUT_BUILDER' },
		{ id: 'sortable-signal', label: 'DOCS.SORTABLE.NAV.SIGNAL' },
		{ id: 'sortable-manual', label: 'DOCS.SORTABLE.NAV.MANUAL' }
	],
	stepper: [
		{ id: 'stepper-basic', label: 'DOCS.STEPPER.NAV.BASIC' },
		{ id: 'stepper-validation', label: 'DOCS.STEPPER.NAV.VALIDATION' },
		{ id: 'stepper-programmatic', label: 'DOCS.STEPPER.NAV.PROGRAMMATIC' },
		{ id: 'stepper-orientation', label: 'DOCS.STEPPER.NAV.ORIENTATION' },
		{ id: 'stepper-theming', label: 'DOCS.STEPPER.NAV.THEMING' },
		{ id: 'stepper-custom-nav', label: 'DOCS.STEPPER.NAV.CUSTOM_NAV' },
		{ id: 'stepper-custom-controls', label: 'DOCS.STEPPER.NAV.CUSTOM_CONTROLS' },
		{ id: 'stepper-animations', label: 'DOCS.STEPPER.NAV.ANIMATIONS' },
		{ id: 'stepper-i18n', label: 'DOCS.STEPPER.NAV.I18N' },
		{ id: 'stepper-rtl', label: 'DOCS.STEPPER.NAV.RTL' },
		{ id: 'stepper-truncated-titles', label: 'DOCS.STEPPER.EXAMPLE.TRUNCATED_TITLES.TITLE' },
		{ id: 'stepper-modal', label: 'DOCS.STEPPER.EXAMPLE.MODAL.TITLE' }
	],
	toast: [
		{ id: 'toast-basic', label: 'DOCS.TOAST.NAV.BASIC' },
		{ id: 'toast-config', label: 'DOCS.TOAST.NAV.CONFIG' },
		{ id: 'toast-position', label: 'DOCS.TOAST.NAV.POSITION' },
		{ id: 'toast-prevent-duplicates', label: 'DOCS.TOAST.NAV.PREVENT_DUPLICATES' },
		{ id: 'toast-max-opened', label: 'DOCS.TOAST.NAV.MAX_OPENED' },
		{ id: 'toast-lifecycle', label: 'DOCS.TOAST.NAV.LIFECYCLE' },
		{ id: 'toast-css-variables', label: 'DOCS.TOAST.NAV.CSS_VARIABLES' }
	],
	utils: [
		{ id: 'utils-pipes', label: 'DOCS.UTILS.NAV.PIPES' },
		{ id: 'utils-translation', label: 'DOCS.UTILS.NAV.TRANSLATION' },
		{ id: 'utils-external-translation-adapter', label: 'DOCS.UTILS.EXAMPLE.EXTERNAL_ADAPTER.TITLE' },
		{ id: 'utils-functions', label: 'DOCS.UTILS.NAV.FUNCTIONS' },
		{ id: 'utils-focus-trap', label: 'DOCS.UTILS.NAV.FOCUS_TRAP' },
		{ id: 'utils-scrollbar', label: 'DOCS.UTILS.NAV.SCROLLBAR' },
		{ id: 'utils-overlay', label: 'DOCS.UTILS.NAV.OVERLAY' },
		{ id: 'utils-tooltip', label: 'DOCS.UTILS.NAV.TOOLTIP' },
		{ id: 'utils-popup', label: 'DOCS.UTILS.EXAMPLE.POPUP.TITLE' },
		{ id: 'utils-transitions', label: 'DOCS.UTILS.EXAMPLE.TRANSITIONS.TITLE' },
		{ id: 'utils-dom', label: 'DOCS.UTILS.EXAMPLE.DOM.TITLE' },
		{ id: 'utils-color-parsing', label: 'DOCS.UTILS.NAV.COLOR_PARSING' },
		{ id: 'utils-color-contrast', label: 'DOCS.UTILS.NAV.COLOR_CONTRAST' },
		{ id: 'utils-color-gamut', label: 'DOCS.UTILS.NAV.COLOR_GAMUT' },
		{ id: 'utils-color-palette', label: 'DOCS.UTILS.FEATURE.COLOR_PALETTE.TITLE' }
	]
};

/**
 * Local storage key used to persist the shell nav orientation.
 */
const APP_SHELL_NAV_ORIENTATION_KEY = 'app-shell.nav-orientation';

@Component({
	selector: 'app-shell',
	standalone: true,
	imports: [
		RouterOutlet,
		RouterLink,
		FormsModule,
		HubNavComponent,
		HubNavStartDirective,
		HubNavEndDirective,
		HubSelectComponent,
		HubLoadingBarComponent,
		TranslatePipe,
		AppBrandLogoComponent
	],
	templateUrl: './app-shell.component.html',
	styleUrl: './app-shell.component.scss',
	changeDetection: ChangeDetectionStrategy.Eager,
	host: {
		class: 'app-shell',
		'[class.app-shell--sticky-sidebar]': 'navOrientation() === "vertical"',
		'[class.app-shell--horizontal-nav]': 'navOrientation() === "horizontal"'
	}
})
export class AppShellComponent implements OnInit {
	protected readonly repositoryUrl = REPOSITORY_URL;

	/** Build stamp (version · commit) shown in the nav footer to verify deploys. */
	protected readonly appVersion = APP_VERSION;
	private readonly navigationService = inject(NavigationService);
	protected readonly themeService = inject(ThemeService);
	protected readonly i18nService = inject(AppI18nService);
	private readonly router = inject(Router);

	/** Base menu items from the legacy navigation service. */
	menuItems = signal<MenuItem[]>([]);

	/** Current sidebar orientation — toggled by the end-slot button. */
	readonly navOrientation = signal<HubNavOrientation>('vertical');
	readonly homeRoute = computed(() => this.i18nService.localizePath('/'));

	/** Consulting link in the visitor's language: Spanish page for 'es', English for the rest. */
	readonly consultingUrl = computed(() => (this.i18nService.lang() === 'es' ? CONSULTING_URL_ES : CONSULTING_URL_EN));

	/**
	 * Toggles the sidebar between vertical and horizontal orientations.
	 */
	toggleOrientation(): void {
		this.navOrientation.update((o) => {
			const next = o === 'vertical' ? 'horizontal' : 'vertical';
			this.persistNavOrientation(next);
			return next;
		});
	}

	/**
	 * Hub-nav side navigation items with 3 levels:
	 * library -> sections -> example anchors.
	 */
	readonly hubNavItems = computed<HubNavItem[]>(() => {
		const items = this.menuItems().map((item) => this.mapPrimaryMenuItem(item));
		const firstLibraryIndex = items.findIndex((item) => item.type === 'dropdown' && TABBED_LIBRARY_IDS.has(item.id));

		if (firstLibraryIndex <= 0) {
			return items;
		}

		const groupedItems = [...items];
		groupedItems.splice(firstLibraryIndex, 0, {
			id: 'components-header',
			label: this.i18nService.translate('UI.NAV.COMPONENTS'),
			type: 'header'
		});

		return groupedItems;
	});

	/**
	 * Side navigation configuration using panel drill-down for nested levels.
	 */
	readonly hubNavConfig = computed<Partial<HubNavConfig>>(() => ({
		orientation: this.navOrientation(),
		verticalExpandMode: 'panel',
		panelMaxVisible: 2,
		panelWidth: '192px',
		collapseBreakpoint: 992,
		collapseMode: 'offcanvas',
		dropdownTrigger: 'click',
		// The sidebar is the library's own shop window, and a moving mark is the kind of
		// thing a screenshot cannot show.
		activeIndicator: true,
		// The examples panel carries a scroll spy, which names every section the reader
		// passes: following each report restyled a thirty-item menu twenty times in six
		// seconds of ordinary reading. The menu still says where they are — it just waits
		// for them to stop, rather than walking down the list behind them.
		followReplacedUrls: 400
	}));

	/**
	 * Angular lifecycle hook. Restores the persisted nav orientation, loads the
	 * main menu, initializes the active theme and syncs i18n with the current URL.
	 */
	ngOnInit(): void {
		this.restoreNavOrientation();
		this.menuItems.set(this.navigationService.getMainMenu());
		this.themeService.initializeTheme();
		this.i18nService.syncWithUrl(this.router.url);
	}

	/** Available languages for the sidebar language selector. */
	protected readonly languages = APP_LANGUAGES;

	/**
	 * Mutable copy of {@link languages} for `hub-select`'s `[items]` input, which
	 * is typed `any[]` and rejects the `readonly` source array.
	 */
	protected readonly languageOptions = [...APP_LANGUAGES];

	/**
	 * Switches the shell to the chosen language while preserving the current route.
	 *
	 * @param lang Target language code.
	 */
	selectLanguage(lang: AppLang): void {
		void this.i18nService.switchRouteLanguage(lang);
	}

	/**
	 * Builds the first-level navigation item.
	 *
	 * @param item Legacy menu item descriptor.
	 * @returns Hub-nav compatible item.
	 */
	private mapPrimaryMenuItem(item: MenuItem): HubNavItem {
		if (item.id === 'home' && item.route) {
			return {
				id: item.id,
				label: this.translateSidebarLabel(item.label),
				type: 'link',
				route: this.localizeRoute(item.route)
			};
		}

		if (item.id === 'design-system') {
			return this.buildDesignSystemItem(item);
		}

		if (TABBED_LIBRARY_IDS.has(item.id) && item.route) {
			return this.buildLibraryRootItem(item);
		}

		if (item.children && item.children.length > 0) {
			return this.mapLegacyTree(item);
		}

		return {
			id: item.id,
			label: this.translateSidebarLabel(item.label),
			type: 'link',
			route: this.localizeRoute(item.route ?? '/')
		};
	}

	/**
	 * Builds a library root item with standard second-level sections and
	 * a third-level examples panel linked to in-page anchors.
	 *
	 * @param item Library root menu item.
	 * @returns Dropdown nav item with section children.
	 */
	private buildLibraryRootItem(item: MenuItem): HubNavItem {
		const baseRoute = this.localizeRoute(item.route ?? `/${item.id}`);
		const libraryId = item.id;
		const sections = LIBRARIES_WITHOUT_API_SECTIONS.has(libraryId)
			? LIBRARY_SECTIONS.filter((section) => section.tab === 'overview')
			: LIBRARY_SECTIONS;
		const sectionChildren: HubNavItem[] = sections.map((section) => ({
			id: `${item.id}-${section.id}`,
			label: this.translateSidebarLabel(section.label),
			type: 'link',
			route: `${baseRoute}/${section.tab}`
		}));

		const exampleChildren = this.buildExampleAnchorItems(libraryId);

		sectionChildren.push(
			exampleChildren.length > 0
				? {
						id: `${item.id}-examples`,
						label: this.translateSidebarLabel('UI.LIBRARY.TABS.EXAMPLES'),
						type: 'dropdown',
						route: `${baseRoute}/examples`,
						children: exampleChildren
					}
				: {
						id: `${item.id}-examples`,
						label: this.translateSidebarLabel('UI.LIBRARY.TABS.EXAMPLES'),
						type: 'link',
						route: `${baseRoute}/examples`
					}
		);

		if (LIBRARIES_WITH_PLAYGROUND.has(libraryId)) {
			sectionChildren.push({
				id: `${item.id}-playground`,
				label: this.translateSidebarLabel('UI.LIBRARY.TABS.PLAYGROUND'),
				type: 'link',
				route: `${baseRoute}/playground`
			});
		}

		return {
			id: item.id,
			label: this.translateSidebarLabel(item.label),
			type: 'dropdown',
			route: `${baseRoute}/overview`,
			badge: item.badge,
			children: sectionChildren
		};
	}

	/**
	 * Builds the Design System root item: a dropdown whose children are the
	 * in-page sections of the guide (scrolled to via anchor fragments) plus the
	 * Tokens reference as a nested sub-page.
	 *
	 * @param item Design System menu item.
	 * @returns Dropdown nav item with section and Tokens children.
	 */
	private buildDesignSystemItem(item: MenuItem): HubNavItem {
		const baseRoute = this.localizeRoute(item.route ?? '/design-system');
		const children: HubNavItem[] = DESIGN_SYSTEM_SECTIONS.map((section) => ({
			id: `design-system-${section.id}`,
			label: this.translateSidebarLabel(section.label),
			type: 'link',
			route: baseRoute,
			fragment: section.id
		}));

		children.push({
			id: 'design-system-tokens',
			label: this.translateSidebarLabel('DOCS.COMMON.NAV.TOKENS'),
			type: 'link',
			route: this.localizeRoute('/tokens')
		});

		children.push({
			id: 'design-system-theming',
			label: this.translateSidebarLabel('DOCS.COMMON.NAV.THEMING'),
			type: 'link',
			route: this.localizeRoute('/theming')
		});

		return {
			id: item.id,
			label: this.translateSidebarLabel(item.label),
			type: 'dropdown',
			route: baseRoute,
			children
		};
	}

	/**
	 * Creates third-level example links sourced from the static `LIBRARY_EXAMPLES_NAV`
	 * map. Using a static map ensures the panel is populated immediately at app startup
	 * without depending on lazy page-level example registration.
	 *
	 * @param libraryId Library route id.
	 * @returns Example link items in declaration order.
	 */
	private buildExampleAnchorItems(libraryId: string): HubNavItem[] {
		const staticExamples = LIBRARY_EXAMPLES_NAV[libraryId] ?? [];
		const link = ({ id, label }: { id: string; label: string }): HubNavItem => ({
			id: `${libraryId}-example-${id}`,
			label: this.translateSidebarLabel(label),
			type: 'link',
			route: this.localizeRoute(`/${libraryId}/examples`),
			fragment: id
		});

		const groups = LIBRARY_EXAMPLE_GROUPS[libraryId];

		if (!groups) {
			return staticExamples.map(link);
		}

		// The groups carry the order, this map carries the labels, and nothing is invented in
		// between: a third hand-kept ordering is exactly what let the flat list drift out of step
		// with the feature groups it is supposed to mirror.
		const labels = new Map(staticExamples.map((example) => [example.id, example.label]));
		const claimed = new Set<string>();
		const items: HubNavItem[] = [];

		for (const group of groups) {
			const links = group.exampleIds
				.filter((id) => labels.has(id))
				.map((id) => {
					claimed.add(id);
					return link({ id, label: labels.get(id)! });
				});

			if (links.length === 0) {
				continue;
			}

			items.push({
				id: `${libraryId}-example-group-${items.length}`,
				label: this.translateSidebarLabel(group.title),
				type: 'header'
			});
			items.push(...links);
		}

		// Anything the groups do not name still has to be reachable, so it trails the sections
		// rather than vanishing from the panel.
		items.push(...staticExamples.filter((example) => !claimed.has(example.id)).map(link));

		return items;
	}

	/**
	 * Restores the persisted nav orientation from local storage.
	 * Falls back to the default signal value when unavailable or invalid.
	 */
	private restoreNavOrientation(): void {
		try {
			const storedValue = localStorage.getItem(APP_SHELL_NAV_ORIENTATION_KEY);
			if (storedValue === 'horizontal' || storedValue === 'vertical') {
				this.navOrientation.set(storedValue);
			}
		} catch {
			// Intentionally ignore storage access errors (private mode, blocked storage, etc.).
		}
	}

	/**
	 * Persists the current nav orientation in local storage.
	 *
	 * @param orientation Orientation value to persist.
	 */
	private persistNavOrientation(orientation: HubNavOrientation): void {
		try {
			localStorage.setItem(APP_SHELL_NAV_ORIENTATION_KEY, orientation);
		} catch {
			// Intentionally ignore storage access errors (private mode, blocked storage, etc.).
		}
	}

	/**
	 * Recursively maps the legacy `MenuItem` tree for modules that still use custom routes.
	 *
	 * @param item Legacy menu node.
	 * @returns Hub-nav item.
	 */
	private mapLegacyTree(item: MenuItem): HubNavItem {
		const hasChildren = (item.children?.length ?? 0) > 0;
		return {
			id: item.id,
			label: this.translateSidebarLabel(item.label),
			type: hasChildren ? 'dropdown' : 'link',
			route: item.route ? this.localizeRoute(item.route) : undefined,
			children: item.children?.map((child) => this.mapLegacyTree(child))
		};
	}

	/**
	 * Prefixes internal routes with the active language segment.
	 *
	 * @param route Route path declared in the legacy navigation data.
	 * @returns Localized route path.
	 */
	private localizeRoute(route: string): string {
		return this.i18nService.localizePath(route);
	}

	/**
	 * Translates a sidebar label into the active language using the shared
	 * library-content dictionary (8 languages, English source as fallback).
	 *
	 * @param label Label declared in the static navigation maps.
	 * @returns Localized label string.
	 */
	private translateSidebarLabel(label: string): string {
		if (label && SEMANTIC_KEY_RE.test(label)) {
			return this.i18nService.translate(label);
		}
		return label ?? '';
	}
}
