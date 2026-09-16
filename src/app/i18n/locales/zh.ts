import ui from '../ui/zh.json';
import seo from '../seo/zh.json';
import docs from '../docs/zh.json';
import { assemble } from '../merge';
import type { Dict } from '../i18n.model';

/**
 * Raw 'zh' dictionary: the three translation domains merged, WITHOUT the
 * English fallback base. The English layering happens at load time in
 * AppI18nService so this lazy chunk only carries this language's content.
 */
export const raw: Dict = assemble(ui as Dict, seo as Dict, docs as Dict);
