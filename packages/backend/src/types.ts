import { coreServices } from '@backstage/backend-plugin-api';
import { Config } from '@backstage/config';
import { IdentityApi } from '@backstage/plugin-auth-node';
import { PermissionEvaluator } from '@backstage/plugin-permission-common';

export type PluginEnvironment = {
  logger: typeof coreServices.logger;
  database: typeof coreServices.database;
  cache: typeof coreServices.cache;
  config: Config;
  discovery: typeof coreServices.discovery;
  scheduler: typeof coreServices.scheduler;
  permissions: PermissionEvaluator;
  identity: IdentityApi;
  reader: typeof coreServices.urlReader;
};
