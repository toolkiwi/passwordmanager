import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './en/_init';
import fr from './fr/_init';
import de from './de/_init';
import es from './es/_init';
import nl from './nl/_init';
import ru from './ru/_init';
import cn from './cn/_init';
import jp from './jp/_init';

import I18nextBrowserLanguageDetector from 'i18next-browser-languagedetector';

/**
 * Translation object
 */
const LANGUAGES = {
    en,
    fr,
    de,
    es,
    nl,
    ru,
    cn,
    jp,
};

/**
 * Initiate
 */
i18n.use(I18nextBrowserLanguageDetector)
    .use(initReactI18next)
    .init({
        supportedLngs: ['en', 'fr', 'de', 'es', 'nl', 'ru', 'cn', 'jp'],
        compatibilityJSON: 'v4',
        resources: LANGUAGES,
        fallbackLng: 'en',
        react: {
            useSuspense: false,
        },
        interpolation: {
            escapeValue: false,
        },
        defaultNS: false,
    });
