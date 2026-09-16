import { AvatarBorderExampleComponent } from './avatar-border-example.component';
import { AvatarClickExampleComponent } from './avatar-click-example.component';
import { AvatarColorsExampleComponent } from './avatar-colors-example.component';
import { AvatarCornerRadiusExampleComponent } from './avatar-corner-radius-example.component';
import { AvatarCustomContentExampleComponent } from './avatar-custom-content-example.component';
import { AvatarCustomImageExampleComponent } from './avatar-custom-image-example.component';
import { AvatarCustomStyleExampleComponent } from './avatar-custom-style-example.component';
import { AvatarFacebookExampleComponent } from './avatar-facebook-example.component';
import { AvatarFallbackExampleComponent } from './avatar-fallback-example.component';
import { AvatarGithubExampleComponent } from './avatar-github-example.component';
import { AvatarGravatarExampleComponent } from './avatar-gravatar-example.component';
import { AvatarGroupExampleComponent } from './avatar-group-example.component';
import { AvatarInitialsExampleComponent } from './avatar-initials-example.component';
import { AvatarInitialsSizeExampleComponent } from './avatar-initials-size-example.component';
import { AvatarRoundExampleComponent } from './avatar-round-example.component';
import { AvatarSizeExampleComponent } from './avatar-size-example.component';
import { AvatarStatusExampleComponent } from './avatar-status-example.component';
import { AvatarTextRatioExampleComponent } from './avatar-text-ratio-example.component';
import { AvatarValueExampleComponent } from './avatar-value-example.component';

/**
 * ExampleViewer reads the snippets off the class and never constructs the example, so a
 * snippet parked on an instance field simply does not reach the code tab. Pinning the static
 * shape here keeps that silent emptiness out of the docs.
 */
const EXAMPLES: ReadonlyArray<readonly [string, unknown, readonly string[]]> = [
	['AvatarBorderExampleComponent', AvatarBorderExampleComponent, ['templateCode', 'componentCode']],
	['AvatarClickExampleComponent', AvatarClickExampleComponent, ['templateCode', 'componentCode']],
	['AvatarColorsExampleComponent', AvatarColorsExampleComponent, ['templateCode', 'componentCode']],
	['AvatarCornerRadiusExampleComponent', AvatarCornerRadiusExampleComponent, ['templateCode', 'componentCode']],
	['AvatarCustomContentExampleComponent', AvatarCustomContentExampleComponent, ['templateCode', 'componentCode']],
	['AvatarCustomImageExampleComponent', AvatarCustomImageExampleComponent, ['templateCode', 'componentCode']],
	['AvatarCustomStyleExampleComponent', AvatarCustomStyleExampleComponent, ['templateCode', 'componentCode']],
	['AvatarFacebookExampleComponent', AvatarFacebookExampleComponent, ['templateCode', 'componentCode']],
	['AvatarFallbackExampleComponent', AvatarFallbackExampleComponent, ['templateCode', 'componentCode']],
	['AvatarGithubExampleComponent', AvatarGithubExampleComponent, ['templateCode', 'componentCode']],
	['AvatarGravatarExampleComponent', AvatarGravatarExampleComponent, ['templateCode', 'componentCode']],
	['AvatarGroupExampleComponent', AvatarGroupExampleComponent, ['templateCode', 'componentCode']],
	['AvatarInitialsExampleComponent', AvatarInitialsExampleComponent, ['templateCode', 'componentCode']],
	['AvatarInitialsSizeExampleComponent', AvatarInitialsSizeExampleComponent, ['templateCode', 'componentCode']],
	['AvatarRoundExampleComponent', AvatarRoundExampleComponent, ['templateCode', 'componentCode']],
	['AvatarSizeExampleComponent', AvatarSizeExampleComponent, ['templateCode', 'componentCode']],
	['AvatarStatusExampleComponent', AvatarStatusExampleComponent, ['templateCode', 'componentCode']],
	['AvatarTextRatioExampleComponent', AvatarTextRatioExampleComponent, ['templateCode', 'componentCode']],
	['AvatarValueExampleComponent', AvatarValueExampleComponent, ['templateCode', 'componentCode']]
];

describe('avatar examples code snippets', () => {
	it.each(EXAMPLES)('%s publishes its snippets on the class', (_name, ctor, keys) => {
		const snippets = ctor as Record<string, unknown>;

		for (const key of keys) {
			expect(typeof snippets[key]).toBe('string');
			expect(snippets[key]).not.toBe('');
		}
	});
});
