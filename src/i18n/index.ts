/*
 * SPDX-FileCopyrightText: 2020 Stalwart Labs LLC <hello@stalw.art>
 *
 * SPDX-License-Identifier: AGPL-3.0-only OR LicenseRef-SEL
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import zh from './zh.json';

const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur'];

const resources = {
  en: { translation: en },
  zh: { translation: zh },
};

/** Languages with a bundled translation; anything else falls back to English. */
const supportedLanguages = Object.keys(resources);

/** `zh-Hans`, `zh_CN`, `zh-CN` → `zh`; a language without a bundle → `en`. */
function normalizeLanguage(locale: string): string {
  const base = locale.split('_')[0].split('-')[0];
  return supportedLanguages.includes(base) ? base : 'en';
}

i18n.use(initReactI18next).init({
  resources,
  lng: normalizeLanguage(navigator.language ?? 'en'),
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

document.documentElement.lang = i18n.language;

export function setLocale(locale: string) {
  const lang = normalizeLanguage(locale);
  i18n.changeLanguage(lang);
  document.documentElement.lang = lang;
  const isRtl = RTL_LANGUAGES.includes(lang);
  document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
}

export default i18n;
