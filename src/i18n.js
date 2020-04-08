import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import XHR from "i18next-xhr-backend";

import translationEn from "../locales/en/translation.json";
import translationEs from "../locales/es/translation.json";
import translationDe from "../locales/de/translation.json";
import translationFr from "../locales/fr/translation.json";
import translationIt from "../locales/it/translation.json";
import translationKr from "../locales/kr/translation.json";
import translationZhCN from "../locales/zh-CN/translation.json";
import translationZhTW from "../locales/zh-TW/translation.json";
import translationZhHK from "../locales/zh-HK/translation.json";

i18n
  .use(XHR)
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    // we init with resources
    debug: true,
    detection: {
      // order and from where user language should be detected
      order: [
        "querystring",
        "cookie",
        "localStorage",
        "navigator",
        "htmlTag",
        "path",
        "subdomain",
      ],
    },

    fallbackLng: "en",

    keySeparator: false, // we use content as keys

    interpolation: {
      escapeValue: false,
    },

    resources: {
      en: {
        translations: translationEn,
      },
      es: {
        translations: translationEs,
      },
      de: {
        translations: translationDe,
      },
      fr: {
        translations: translationFr,
      },
      it: {
        translations: translationIt,
      },
      kr: {
        translations: translationKr,
      },
      "zh": {
        translations: translationZhCN,
      },
      "zh-CN": {
        translations: translationZhCN,
      },
      "zh-TW": {
        translations: translationZhTW,
      },
      "zh-HK": {
        translations: translationZhHK,
      },
    },

    // have a common namespace used around the full app
    ns: ["translations"],
    defaultNS: "translations",
  });

export default i18n;
