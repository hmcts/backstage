import {
  createBackendModule,
  coreServices,
} from '@backstage/backend-plugin-api';
import {
  catalogProcessingExtensionPoint,
} from '@backstage/plugin-catalog-node/alpha';
import { GitHubEntityProvider } from '@backstage/plugin-catalog-backend-module-github';
import { MicrosoftGraphOrgEntityProvider } from '@backstage/plugin-catalog-backend-module-msgraph';
import { ScaffolderEntitiesProcessor } from '@backstage/plugin-catalog-backend-module-scaffolder-entity-model';
import { ApiCatalogProvider } from './apiCatalogProvider';

export const catalogModuleCustomEntityProviders = createBackendModule({
  pluginId: 'catalog',
  moduleId: 'custom-entity-providers',
  register(env) {
    env.registerInit({
      deps: {
        catalog: catalogProcessingExtensionPoint,
        config: coreServices.rootConfig,
        logger: coreServices.logger,
        scheduler: coreServices.scheduler,
      },
      async init({ catalog, config, logger, scheduler }) {
        // Register GitHub entity provider
        catalog.addEntityProvider(
          GitHubEntityProvider.fromConfig(config, {
            logger,
            schedule: scheduler.createScheduledTaskRunner({
              frequency: { hours: 20 },
              timeout: { hours: 3 },
              initialDelay: { minutes: 5 },
            }),
          }),
        );

        // Register Microsoft Graph entity provider
        catalog.addEntityProvider(
          MicrosoftGraphOrgEntityProvider.fromConfig(config, {
            logger,
            schedule: scheduler.createScheduledTaskRunner({
              frequency: { hours: 1 },
              timeout: { minutes: 50 },
              initialDelay: { minutes: 1 },
            }),
          }),
        );

        // Register custom API catalog provider
        const apiProvider = new ApiCatalogProvider(config, logger);
        catalog.addEntityProvider(apiProvider);

        // Register scaffolder processor
        catalog.addProcessor(new ScaffolderEntitiesProcessor());

        // Schedule manual running of custom API provider
        await scheduler.scheduleTask({
          id: 'run_api_catalog_provider_refresh',
          fn: async () => {
            await apiProvider.run();
          },
          frequency: { hours: 5 },
          timeout: { minutes: 3 },
          initialDelay: { minutes: 20 },
        });
      },
    });
  },
});

export default catalogModuleCustomEntityProviders;
