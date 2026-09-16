import ui from '../ui/fr.json';
import seo from '../seo/fr.json';
import docs from '../docs/fr.json';
import { assemble } from '../merge';
import type { Dict } from '../i18n.model';

/**
 * Raw 'fr' dictionary: the three translation domains merged, WITHOUT the
 * English fallback base. The English layering happens at load time in
 * AppI18nService so this lazy chunk only carries this language's content.
 */
export const raw: Dict = assemble(ui as Dict, seo as Dict, docs as Dict);
