import { ScaffolderEntitiesProcessor } from '@backstage/plugin-catalog-backend-module-scaffolder-entity-model';
import { ApiCatalogProvider } from './apiCatalogProvider';

import { createBackendModule } from '@backstage/backend-plugin-api';
import { catalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node/alpha';

const catalogModuleCustomExtensions = createBackendModule({
  pluginId: 'catalog', // name of the plugin that the module is targeting
  moduleId: 'custom-extensions',
  register(env) {
    env.registerInit({
      deps: {
        catalog: catalogProcessingExtensionPoint,
      },
      async init({ catalog }) {
        catalog.addEntityProvider(
          new ApiCatalogProvider(
            null as unknown as any,
            null as unknown as any,
          ),
        );
        catalog.addProcessor(new ScaffolderEntitiesProcessor());
      },
    });
  },
});

export default catalogModuleCustomExtensions;
