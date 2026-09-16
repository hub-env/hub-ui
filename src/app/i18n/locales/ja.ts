import ui from '../ui/ja.json';
import seo from '../seo/ja.json';
import docs from '../docs/ja.json';
import { assemble } from '../merge';
import type { Dict } from '../i18n.model';

/**
 * Raw 'ja' dictionary: the three translation domains merged, WITHOUT the
 * English fallback base. The English layering happens at load time in
 * AppI18nService so this lazy chunk only carries this language's content.
 */
export const raw: Dict = assemble(ui as Dict, seo as Dict, docs as Dict);
