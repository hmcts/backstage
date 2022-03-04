/*
 * Copyright 2021 The Backstage Authors
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

import { CatalogApi } from '@backstage/catalog-client';
import {
  Entity,
  parseEntityRef,
  RELATION_MEMBER_OF,
  RELATION_OWNED_BY,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { identityApiRef, useApi } from '@backstage/core-plugin-api';
import { useMemo } from 'react';
import useAsync from 'react-use/lib/useAsync';
import { catalogApiRef } from '../api';
import { getEntityRelations } from '../utils/getEntityRelations';

/**
 * Takes the relevant parts of the User entity corresponding to the Backstage
 * identity, and translates them into a list of entity refs on string form that
 * represent the user's ownership connections.
 *
 * @public
 *
 * @param catalogApi - The Catalog API implementation
 * @param identityOwnerRefs - List of identity owner refs as strings
 * @returns OwnerRefs as a string array
 * @deprecated Use `ownershipEntityRefs` from `identityApi.getBackstageIdentity()` instead.
 */
export async function loadCatalogOwnerRefs(
  catalogApi: CatalogApi,
  identityOwnerRefs: string[],
): Promise<string[]> {
  const result = new Array<string>();

  const primaryUserRef = identityOwnerRefs.find(ref => ref.startsWith('user:'));
  if (primaryUserRef) {
    const entity = await catalogApi.getEntityByRef(
      parseEntityRef(primaryUserRef),
    );
    if (entity) {
      const memberOf = getEntityRelations(entity, RELATION_MEMBER_OF, {
        kind: 'Group',
      });
      for (const group of memberOf) {
        result.push(stringifyEntityRef(group));
      }
    }
  }

  return result;
}

/**
 * Returns a function that checks whether the currently signed-in user is an
 * owner of a given entity. When the hook is initially mounted, the loading
 * flag will be true and the results returned from the function will always be
 * false.
 *
 * @public
 *
 * @returns a function that checks if the signed in user owns an entity
 */
export function useEntityOwnership(): {
  loading: boolean;
  isOwnedEntity: (entity: Entity) => boolean;
} {
  const identityApi = useApi(identityApiRef);
  const catalogApi = useApi(catalogApiRef);

  // Trigger load only on mount
  const { loading, value: refs } = useAsync(async () => {
    const { ownershipEntityRefs } = await identityApi.getBackstageIdentity();
    const catalogRefs = await loadCatalogOwnerRefs(
      catalogApi,
      ownershipEntityRefs,
    );
    return new Set([...ownershipEntityRefs, ...catalogRefs]);
  }, []);

  const isOwnedEntity = useMemo(() => {
    const myOwnerRefs = new Set(refs ?? []);
    return (entity: Entity) => {
      const entityOwnerRefs = getEntityRelations(entity, RELATION_OWNED_BY).map(
        stringifyEntityRef,
      );
      for (const ref of entityOwnerRefs) {
        if (myOwnerRefs.has(ref)) {
          return true;
        }
      }
      return false;
    };
  }, [refs]);

  return useMemo(() => ({ loading, isOwnedEntity }), [loading, isOwnedEntity]);
}
