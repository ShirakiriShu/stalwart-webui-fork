/*
 * SPDX-FileCopyrightText: 2020 Stalwart Labs LLC <hello@stalw.art>
 *
 * SPDX-License-Identifier: AGPL-3.0-only OR LicenseRef-SEL
 */

import { describe, expect, it } from 'vitest';
import en from './en.json';
import zh from './zh.json';

/** Bundles shipped with the app; add each new locale here. */
const TRANSLATIONS = { zh };

type Leaves = Record<string, string>;

function flatten(source: unknown, prefix = '', out: Leaves = {}): Leaves {
  for (const [key, value] of Object.entries(source as Record<string, unknown>)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value !== null && typeof value === 'object') flatten(value, path, out);
    else out[path] = String(value);
  }
  return out;
}

function placeholders(value: string): string[] {
  return [...value.matchAll(/\{\{(\w+)\}\}/g)].map((match) => match[1]).sort();
}

const english = flatten(en);

describe('translation bundles', () => {
  for (const [language, bundle] of Object.entries(TRANSLATIONS)) {
    const translated = flatten(bundle);

    it(`${language}: covers every English key`, () => {
      const missing = Object.keys(english).filter(
        (key) =>
          translated[key] === undefined &&
          // Chinese has one plural form: `_one` is never resolved, only `_other` is.
          !(key.endsWith('_one') && translated[`${key.slice(0, -4)}_other`] !== undefined),
      );
      expect(missing).toEqual([]);
    });

    it(`${language}: has no unknown or unused plural keys`, () => {
      expect(Object.keys(translated).filter((key) => english[key] === undefined)).toEqual([]);
      expect(Object.keys(translated).filter((key) => key.endsWith('_one'))).toEqual([]);
    });

    it(`${language}: keeps placeholders and has no empty value`, () => {
      const broken: string[] = [];
      for (const [key, value] of Object.entries(translated)) {
        if (value.trim() === '') broken.push(`${key}: empty value`);
        else if (english[key] !== undefined && placeholders(value).join() !== placeholders(english[key]).join()) {
          broken.push(`${key}: ${value}`);
        }
      }
      expect(broken).toEqual([]);
    });
  }
});
