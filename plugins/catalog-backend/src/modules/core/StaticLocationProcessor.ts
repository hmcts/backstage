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

import { Config } from '@backstage/config';
import {
  processingResult,
  CatalogProcessorEmit,
  LocationSpec,
} from '../../api';

/**
 * @deprecated no longer in use, replaced by the ConfigLocationEntityProvider.
 * @public
 */
export class StaticLocationProcessor implements StaticLocationProcessor {
  static fromConfig(config: Config): StaticLocationProcessor {
    const locations: LocationSpec[] = [];

    const lConfigs = config.getOptionalConfigArray('catalog.locations') ?? [];
    for (const lConfig of lConfigs) {
      const type = lConfig.getString('type');
      const target = lConfig.getString('target');
      locations.push({ type, target });
    }

    return new StaticLocationProcessor(locations);
  }

  constructor(private readonly staticLocations: LocationSpec[]) {}

  async readLocation(
    location: LocationSpec,
    _optional: boolean,
    emit: CatalogProcessorEmit,
  ): Promise<boolean> {
    if (location.type !== 'bootstrap') {
      return false;
    }

    for (const staticLocation of this.staticLocations) {
      emit(processingResult.location(staticLocation));
    }

    return true;
  }
}
