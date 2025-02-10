import { LANGUAGES_SUPPORTED } from '@/types/enums';
import i18n, { InitOptions } from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend, { HttpBackendOptions } from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

i18n.use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: LANGUAGES_SUPPORTED.Vietnamese,
        supportedLngs: Object.values(LANGUAGES_SUPPORTED),
        debug: false,
        detection: {
            order: [
                'querystring',
                'cookie',
                'sessionStorage',
                'localStorage',
                'navigator',
                'htmlTag'
            ],
            caches: ['cookie']
        },
        backend: {
            loadPath: '/locales/{{lng}}/translation.json'
        } as HttpBackendOptions,
        interpolation: {
            escapeValue: false
        }
    } as InitOptions);

export default i18n;
