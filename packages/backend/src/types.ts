import {
  PluginCacheManager,
  PluginDatabaseManager,
  PluginEndpointDiscovery,
  TokenManager,
} from '@backstage/backend-common';
import { UrlReaderService } from '@backstage/backend-plugin-api/index';
import { PluginTaskScheduler } from '@backstage/backend-tasks';
import { Config } from '@backstage/config';
import { IdentityApi } from '@backstage/plugin-auth-node';
import { PermissionEvaluator } from '@backstage/plugin-permission-common';
import { Logger } from 'winston';

export type PluginEnvironment = {
  logger: Logger;
  database: PluginDatabaseManager;
  cache: PluginCacheManager;
  config: Config;
  discovery: PluginEndpointDiscovery;
  tokenManager: TokenManager;
  scheduler: PluginTaskScheduler;
  permissions: PermissionEvaluator;
  identity: IdentityApi;
  reader: UrlReaderService;
};
