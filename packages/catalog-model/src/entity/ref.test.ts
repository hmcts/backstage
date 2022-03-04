/*
 * Copyright 2020 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { DEFAULT_NAMESPACE } from './constants';
import { parseEntityName, parseEntityRef } from './ref';

describe('ref', () => {
  describe('parseEntityName', () => {
    it('handles some omissions', () => {
      expect(parseEntityName('a:b/c')).toEqual({
        kind: 'a',
        namespace: 'b',
        name: 'c',
      });
      expect(() => parseEntityName('b/c')).toThrow(/kind/);
      expect(parseEntityName('a:c')).toEqual({
        kind: 'a',
        namespace: DEFAULT_NAMESPACE,
        name: 'c',
      });
      expect(() => parseEntityName('c')).toThrow(/kind/);
    });

    it('rejects bad inputs', () => {
      expect(() => parseEntityName(null as any)).toThrow();
      expect(() => parseEntityName(7 as any)).toThrow();
      expect(() => parseEntityName('a:b:c')).toThrow();
      expect(() => parseEntityName('a/b/c')).toThrow();
      expect(() => parseEntityName('a/b:c')).toThrow();
      expect(() => parseEntityName('a:b/c/d')).toThrow();
      expect(() => parseEntityName('a:b/c:d')).toThrow();
    });

    it('rejects empty parts in strings', () => {
      // one is empty
      expect(() => parseEntityName(':b/c')).toThrow();
      expect(() => parseEntityName('a:/c')).toThrow();
      expect(() => parseEntityName('a:b/')).toThrow();
      // two are empty
      expect(() => parseEntityName('a:/')).toThrow();
      expect(() => parseEntityName(':b/')).toThrow();
      expect(() => parseEntityName(':/c')).toThrow();
      // three are empty
      expect(() => parseEntityName(':/')).toThrow();
      // one is left out, one empty
      expect(() => parseEntityName('/c')).toThrow();
      expect(() => parseEntityName('b/')).toThrow();
      expect(() => parseEntityName(':c')).toThrow();
      expect(() => parseEntityName('a:')).toThrow();
      // nothing at all
      expect(() => parseEntityName('')).toThrow();
    });

    it('rejects empty parts in compounds', () => {
      // one is empty
      expect(() =>
        parseEntityName({ kind: '', namespace: 'b', name: 'c' }),
      ).toThrow();
      expect(() => parseEntityName({ namespace: 'b', name: 'c' })).toThrow();
      expect(() =>
        parseEntityName({ kind: 'a', namespace: '', name: 'c' }),
      ).toThrow();
      expect(() => parseEntityName({ kind: 'a', name: 'c' })).not.toThrow();
      expect(() =>
        parseEntityName({ kind: 'a', namespace: 'b', name: '' }),
      ).toThrow();
      expect(() =>
        parseEntityName({ kind: 'a', namespace: 'b' } as any),
      ).toThrow();
      // two are empty
      expect(() =>
        parseEntityName({ kind: '', namespace: '', name: 'c' }),
      ).toThrow();
      expect(() => parseEntityName({ name: 'c' })).toThrow();
      expect(() =>
        parseEntityName({ kind: '', namespace: 'b', name: '' }),
      ).toThrow();
      expect(() => parseEntityName({ namespace: 'b' } as any)).toThrow();
      expect(() =>
        parseEntityName({ kind: 'a', namespace: '', name: '' }),
      ).toThrow();
      expect(() => parseEntityName({ kind: 'a' } as any)).toThrow();
      // three are empty
      expect(() =>
        parseEntityName({ kind: '', namespace: '', name: '' }),
      ).toThrow();
      expect(() => parseEntityName({} as any)).toThrow();
      // one is left out, one empty
      expect(() => parseEntityName({ namespace: '', name: 'c' })).toThrow();
      expect(() => parseEntityName({ namespace: 'b', name: '' })).toThrow();
      expect(() => parseEntityName({ kind: '', name: 'c' })).toThrow();
      expect(() => parseEntityName({ kind: 'a', name: '' })).toThrow();
    });

    it('adds defaults where necessary to strings', () => {
      expect(
        parseEntityName('a:b/c', { defaultKind: 'x', defaultNamespace: 'y' }),
      ).toEqual({ kind: 'a', namespace: 'b', name: 'c' });
      expect(
        parseEntityName('b/c', { defaultKind: 'x', defaultNamespace: 'y' }),
      ).toEqual({ kind: 'x', namespace: 'b', name: 'c' });
      expect(
        parseEntityName('a:c', { defaultKind: 'x', defaultNamespace: 'y' }),
      ).toEqual({ kind: 'a', namespace: 'y', name: 'c' });
      expect(parseEntityName('a:c', { defaultKind: 'x' })).toEqual({
        kind: 'a',
        namespace: DEFAULT_NAMESPACE,
        name: 'c',
      });
      expect(
        parseEntityName('c', { defaultKind: 'x', defaultNamespace: 'y' }),
      ).toEqual({ kind: 'x', namespace: 'y', name: 'c' });
      expect(parseEntityName('c', { defaultKind: 'x' })).toEqual({
        kind: 'x',
        namespace: DEFAULT_NAMESPACE,
        name: 'c',
      });
    });

    it('adds defaults where necessary to compounds', () => {
      expect(
        parseEntityName(
          { kind: 'a', namespace: 'b', name: 'c' },
          { defaultKind: 'x', defaultNamespace: 'y' },
        ),
      ).toEqual({ kind: 'a', namespace: 'b', name: 'c' });
      expect(
        parseEntityName(
          { namespace: 'b', name: 'c' },
          { defaultKind: 'x', defaultNamespace: 'y' },
        ),
      ).toEqual({ kind: 'x', namespace: 'b', name: 'c' });
      expect(
        parseEntityName(
          { kind: 'a', name: 'c' },
          { defaultKind: 'x', defaultNamespace: 'y' },
        ),
      ).toEqual({ kind: 'a', namespace: 'y', name: 'c' });
      expect(
        parseEntityName({ kind: 'a', name: 'c' }, { defaultKind: 'x' }),
      ).toEqual({ kind: 'a', namespace: DEFAULT_NAMESPACE, name: 'c' });
      expect(
        parseEntityName(
          { name: 'c' },
          { defaultKind: 'x', defaultNamespace: 'y' },
        ),
      ).toEqual({ kind: 'x', namespace: 'y', name: 'c' });
      expect(parseEntityName({ name: 'c' }, { defaultKind: 'x' })).toEqual({
        kind: 'x',
        namespace: DEFAULT_NAMESPACE,
        name: 'c',
      });
      // empty strings are errors, not defaults
      expect(() =>
        parseEntityName(
          { kind: '', namespace: 'b', name: 'c' },
          { defaultKind: 'x', defaultNamespace: 'y' },
        ),
      ).toThrow(/kind/);
      expect(() =>
        parseEntityName(
          { kind: 'a', namespace: '', name: 'c' },
          { defaultKind: 'x', defaultNamespace: 'y' },
        ),
      ).toThrow(/namespace/);
    });
  });

  describe('parseEntityRef', () => {
    it('handles some omissions', () => {
      expect(parseEntityRef('a:b/c')).toEqual({
        kind: 'a',
        namespace: 'b',
        name: 'c',
      });
      expect(parseEntityRef('a:c')).toEqual({
        kind: 'a',
        namespace: 'default',
        name: 'c',
      });
    });

    it('rejects bad inputs', () => {
      expect(() => parseEntityRef(null as any)).toThrow();
      expect(() => parseEntityRef(7 as any)).toThrow();
      expect(() => parseEntityRef('a:b:c')).toThrow();
      expect(() => parseEntityRef('a/b/c')).toThrow();
      expect(() => parseEntityRef('a/b:c')).toThrow();
      expect(() => parseEntityRef('a:b/c/d')).toThrow();
      expect(() => parseEntityRef('a:b/c:d')).toThrow();
    });

    it('rejects empty parts in strings', () => {
      // one is empty
      expect(() => parseEntityRef(':b/c')).toThrow();
      expect(() => parseEntityRef('a:/c')).toThrow();
      expect(() => parseEntityRef('a:b/')).toThrow();
      // two are empty
      expect(() => parseEntityRef('a:/')).toThrow();
      expect(() => parseEntityRef(':b/')).toThrow();
      expect(() => parseEntityRef(':/c')).toThrow();
      // three are empty
      expect(() => parseEntityRef(':/')).toThrow();
      // one is left out, one empty
      expect(() => parseEntityRef('/c')).toThrow();
      expect(() => parseEntityRef('b/')).toThrow();
      expect(() => parseEntityRef(':c')).toThrow();
      expect(() => parseEntityRef('a:')).toThrow();
      // nothing at all
      expect(() => parseEntityRef('')).toThrow();
    });

    it('rejects empty parts in compounds', () => {
      // one is empty
      expect(() =>
        parseEntityRef({ kind: '', namespace: 'b', name: 'c' }),
      ).toThrow();
      expect(() =>
        parseEntityRef({ kind: 'a', namespace: '', name: 'c' }),
      ).toThrow();
      expect(() =>
        parseEntityRef({ kind: 'a', namespace: 'b', name: '' }),
      ).toThrow();
      // two are empty
      expect(() =>
        parseEntityRef({ kind: '', namespace: '', name: 'c' }),
      ).toThrow();
      expect(() =>
        parseEntityRef({ kind: '', namespace: 'b', name: '' }),
      ).toThrow();
      expect(() =>
        parseEntityRef({ kind: 'a', namespace: '', name: '' }),
      ).toThrow();
      // three are empty
      expect(() =>
        parseEntityRef({ kind: '', namespace: '', name: '' }),
      ).toThrow();
      // one is left out, one empty
      expect(() => parseEntityRef({ namespace: '', name: 'c' })).toThrow();
      expect(() => parseEntityRef({ namespace: 'b', name: '' })).toThrow();
      expect(() => parseEntityRef({ kind: '', name: 'c' })).toThrow();
      expect(() => parseEntityRef({ kind: 'a', name: '' })).toThrow();
      // nothing at all
      expect(() => parseEntityRef({} as any)).toThrow();
    });

    it('adds defaults where necessary to strings', () => {
      expect(
        parseEntityRef('a:b/c', { defaultKind: 'x', defaultNamespace: 'y' }),
      ).toEqual({ kind: 'a', namespace: 'b', name: 'c' });
      expect(
        parseEntityRef('b/c', { defaultKind: 'x', defaultNamespace: 'y' }),
      ).toEqual({ kind: 'x', namespace: 'b', name: 'c' });
      expect(
        parseEntityRef('a:c', { defaultKind: 'x', defaultNamespace: 'y' }),
      ).toEqual({ kind: 'a', namespace: 'y', name: 'c' });
      expect(
        parseEntityRef('c', { defaultKind: 'x', defaultNamespace: 'y' }),
      ).toEqual({ kind: 'x', namespace: 'y', name: 'c' });
    });

    it('adds defaults where necessary to compounds', () => {
      expect(
        parseEntityRef(
          { kind: 'a', namespace: 'b', name: 'c' },
          { defaultKind: 'x', defaultNamespace: 'y' },
        ),
      ).toEqual({ kind: 'a', namespace: 'b', name: 'c' });
      expect(
        parseEntityRef(
          { namespace: 'b', name: 'c' },
          { defaultKind: 'x', defaultNamespace: 'y' },
        ),
      ).toEqual({ kind: 'x', namespace: 'b', name: 'c' });
      expect(
        parseEntityRef(
          { kind: 'a', name: 'c' },
          { defaultKind: 'x', defaultNamespace: 'y' },
        ),
      ).toEqual({ kind: 'a', namespace: 'y', name: 'c' });
      expect(
        parseEntityRef(
          { name: 'c' },
          { defaultKind: 'x', defaultNamespace: 'y' },
        ),
      ).toEqual({ kind: 'x', namespace: 'y', name: 'c' });
      // empty strings are errors, not defaults
      expect(() =>
        parseEntityRef(
          { kind: '', namespace: 'b', name: 'c' },
          { defaultKind: 'x', defaultNamespace: 'y' },
        ),
      ).toThrow(/kind/);
      expect(() =>
        parseEntityRef(
          { kind: 'a', namespace: '', name: 'c' },
          { defaultKind: 'x', defaultNamespace: 'y' },
        ),
      ).toThrow(/namespace/);
    });
  });
});
