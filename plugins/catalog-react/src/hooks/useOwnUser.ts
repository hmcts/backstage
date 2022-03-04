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

import {
  DEFAULT_NAMESPACE,
  parseEntityRef,
  UserEntity,
} from '@backstage/catalog-model';
import useAsync, { AsyncState } from 'react-use/lib/useAsync';
import { catalogApiRef } from '../api';
import { identityApiRef, useApi } from '@backstage/core-plugin-api';

/**
 * Get the catalog User entity (if any) that matches the logged-in user.
 * @public
 * @deprecated due to low external usage.
 */
export function useOwnUser(): AsyncState<UserEntity | undefined> {
  const catalogApi = useApi(catalogApiRef);
  const identityApi = useApi(identityApiRef);

  return useAsync(async () => {
    const identity = await identityApi.getBackstageIdentity();
    // TODO(freben): Defensively parse with defaults even though getEntityByRef
    // supports the string form, since some auth resolvers have been known to
    // return incomplete refs (just the name part) historically. This can be
    // simplified in the future to just pass the ref immediately to
    // getEntityByRef.
    return catalogApi.getEntityByRef(
      parseEntityRef(identity.userEntityRef, {
        defaultKind: 'User',
        defaultNamespace: DEFAULT_NAMESPACE,
      }),
    ) as Promise<UserEntity | undefined>;
  }, [catalogApi, identityApi]);
}
