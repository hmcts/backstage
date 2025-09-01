import { ApiCatalogProvider } from './apiCatalogProvider';

import { coreServices, createBackendModule } from '@backstage/backend-plugin-api';
import { catalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node/alpha';
import { ScaffolderEntitiesProcessor } from "@backstage/plugin-catalog-backend-module-scaffolder-entity-model";
import logger = coreServices.logger
import config = coreServices.rootConfig

const catalogModuleCustomExtensions = createBackendModule({
  pluginId: 'catalog', // name of the plugin that the module is targeting
  moduleId: 'custom-extensions',
  register(env) {
    env.registerInit({
      deps: {
        catalog: catalogProcessingExtensionPoint,
          config: config,
          logger: logger
      },
      async init({ catalog, config, logger }) {
        catalog.addEntityProvider(
          new ApiCatalogProvider(config, logger),
        );
        catalog.addProcessor(new ScaffolderEntitiesProcessor());
      },
    });
  },
});

export default catalogModuleCustomExtensions;
