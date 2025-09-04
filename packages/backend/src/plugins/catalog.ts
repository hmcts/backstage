import { MicrosoftGraphOrgEntityProvider } from '@backstage/plugin-catalog-backend-module-msgraph';
import {
  createBackendModule,
  coreServices,
} from '@backstage/backend-plugin-api';
import { catalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node/alpha';

const catalogModuleCustomExtensions = createBackendModule({
  pluginId: 'catalog', // name of the plugin that the module is targeting
  moduleId: 'microsoft-graph-origin',
  register(env) {
    env.registerInit({
      deps: {
        catalog: catalogProcessingExtensionPoint,
        logger: coreServices.logger,
      },
      async init({ catalog }) {
        catalog.addEntityProvider(
          MicrosoftGraphOrgEntityProvider.fromConfig(env.config, {
            id: 'production', // uniquely identify this provider
            target: 'https://graph.microsoft.com/v1.0',
            logger,
            schedule: env.scheduler.createScheduledTaskRunner({
              frequency: { hours: 1 },
              timeout: { minutes: 50 },
              initialDelay: { seconds: 15 },
            }),
          }),
        );
      },
    });
  },
});

export default catalogModuleCustomExtensions;