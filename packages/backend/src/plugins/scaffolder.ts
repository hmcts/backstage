import { DockerContainerRunner } from '@backstage/backend-common';
import { CatalogClient } from '@backstage/catalog-client';
import { createBuiltinActions, createRouter } from '@backstage/plugin-scaffolder-backend';
import Docker from 'dockerode';
import { Router } from 'express';
import { ScmIntegrations } from '@backstage/integration';
import type { PluginEnvironment } from '../types';
import { scriptAction } from './scaffolder/actions/custom';

export default async function createPlugin({
  logger,
  config,
  database,
  reader,
  discovery,
}: PluginEnvironment): Promise<Router> {
  const dockerClient = new Docker();
  const containerRunner = new DockerContainerRunner({ dockerClient });
  const catalogClient = new CatalogClient({ discoveryApi: discovery });

  const integrations = ScmIntegrations.fromConfig(config);

  const builtInActions = createBuiltinActions({
    containerRunner,
    integrations,
    config,
    catalogClient,
    reader,
  });

  const actions = [...builtInActions, scriptAction()];

  return await createRouter({
    containerRunner,
    logger,
    config,
    database,
    catalogClient,
    reader,
    actions,
  });
}
