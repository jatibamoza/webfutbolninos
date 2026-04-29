import { es } from './es';
import { ca } from './ca';

export type Locale = 'es' | 'ca';
type TranslationKey = keyof typeof es;

const translations: Record<Locale, Record<TranslationKey, string>> = { es, ca };

export function useTranslations(locale: Locale = 'es') {
  return function t(key: TranslationKey): string {
    return translations[locale][key] ?? translations['es'][key];
  };
}
