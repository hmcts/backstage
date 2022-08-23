import {
  CatalogBuilder,
} from '@backstage/plugin-catalog-backend';
import { ScaffolderEntitiesProcessor } from '@backstage/plugin-scaffolder-backend';
import { Router } from 'express';
import { MicrosoftGraphOrgEntityProvider } from '@backstage/plugin-catalog-backend-module-msgraph';
import { PluginEnvironment } from '../types';
import { Duration } from 'luxon';
import { ApiCatalogProvider } from './apiCatalogProvider';
import { GitHubEntityProvider } from '@backstage/plugin-catalog-backend-module-github';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  const builder = await CatalogBuilder.create(env);

    builder.addEntityProvider(
        GitHubEntityProvider.fromConfig(env.config, {
            logger: env.logger,
            schedule: env.scheduler.createScheduledTaskRunner({
                frequency: {hours: 3},
                timeout: {minutes: 60},
            }),
        }),
    );

    builder.addEntityProvider(
        MicrosoftGraphOrgEntityProvider.fromConfig(env.config, {
            logger: env.logger,
            schedule: env.scheduler.createScheduledTaskRunner({
                frequency: {hours: 1},
                timeout: {minutes: 50},
                initialDelay: {seconds: 15}
            }),
        }),
    );

  const provider = new ApiCatalogProvider(env.config, env.logger);
  builder.addEntityProvider(provider);

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
