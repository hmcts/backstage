import { useHotCleanup } from '@backstage/backend-common';
import {
  CatalogBuilder,
  runPeriodically,
} from '@backstage/plugin-catalog-backend';
import { ScaffolderEntitiesProcessor } from '@backstage/plugin-scaffolder-backend';
import { Router } from 'express';
import { MicrosoftGraphOrgEntityProvider } from '@backstage/plugin-catalog-backend-module-msgraph';
import { PluginEnvironment } from '../types';
import { Duration } from 'luxon';
import { ApiCatalogProvider } from './apiCatalogProvider';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const builder = await CatalogBuilder.create(env);

  const provider = new ApiCatalogProvider(env.config, env.logger);
  builder.addEntityProvider(provider);

  const msGraphOrgEntityProvider = MicrosoftGraphOrgEntityProvider.fromConfig(
    env.config,
    {
      id: 'https://graph.microsoft.com/v1.0',
      target: 'https://graph.microsoft.com/v1.0',
      logger: env.logger,
    },
  );

  builder.addEntityProvider(msGraphOrgEntityProvider);

  useHotCleanup(
    module,
    runPeriodically(() => msGraphOrgEntityProvider.read(), 5 * 60 * 1000),
  );

  builder.addProcessor(new ScaffolderEntitiesProcessor());
  const { processingEngine, router } = await builder.build();
  await processingEngine.start();

  await env.scheduler.scheduleTask({
        id: 'run_api_catalog_provider_refresh',
        fn: async () => { await provider.run(); },
        frequency: Duration.fromObject({ minutes: 30 }),
        timeout: Duration.fromObject({ minutes: 2 }),
      });

  return router;
}
