/*
 * Hi!
 *
 * Note that this is an EXAMPLE Backstage backend. Please check the README.
 *
 * Happy hacking!
 */

import {
  createServiceBuilder,
  loadBackendConfig,
  getRootLogger,
  useHotMemoize,
} from '@backstage/backend-common';
import { ConfigReader, AppConfig } from '@backstage/config';
import healthcheck from './plugins/healthcheck';
import knex, { PgConnectionConfig } from 'knex';
import auth from './plugins/auth';
import catalog from './plugins/catalog';
import identity from './plugins/identity';
import scaffolder from './plugins/scaffolder';
import proxy from './plugins/proxy';
import techdocs from './plugins/techdocs';
import { PluginEnvironment } from './types';

function makeCreateEnv(loadedConfigs: AppConfig[]) {
  const config = ConfigReader.fromConfigs(loadedConfigs);

  return (plugin: string): PluginEnvironment => {
    const logger = getRootLogger().child({ type: 'plugin', plugin });

    const knexConfig = {
      client: 'pg',
      useNullAsDefault: true,
      connection: {
        port: process.env.POSTGRES_PORT,
        host: process.env.POSTGRES_HOST,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: `backstage_plugin_${plugin}`,
        ssl: process.env.POSTGRES_SSL
      } as PgConnectionConfig,
    };
    const database = knex(knexConfig);
    database.client.pool.on('createSuccess', (_eventId: any, resource: any) => {
      resource.run('PRAGMA foreign_keys = ON', () => {});
    });
    return { logger, database, config };
  };
}

async function main() {
  const configs = await loadBackendConfig();
  const configReader = ConfigReader.fromConfigs(configs);
  const createEnv = makeCreateEnv(configs);

  const healthcheckEnv = useHotMemoize(module, () => createEnv('healthcheck'));
  const catalogEnv = useHotMemoize(module, () => createEnv('catalog'));
  const scaffolderEnv = useHotMemoize(module, () => createEnv('scaffolder'));
  const authEnv = useHotMemoize(module, () => createEnv('auth'));
  const identityEnv = useHotMemoize(module, () => createEnv('identity'));
  const proxyEnv = useHotMemoize(module, () => createEnv('proxy'));
  const techdocsEnv = useHotMemoize(module, () => createEnv('techdocs'));

  const service = createServiceBuilder(module)
    .loadConfig(configReader)
    .addRouter('', await healthcheck(healthcheckEnv))
    .addRouter('/catalog', await catalog(catalogEnv))
    .addRouter('/scaffolder', await scaffolder(scaffolderEnv))
    .addRouter('/auth', await auth(authEnv))
    .addRouter('/identity', await identity(identityEnv))
    .addRouter('/techdocs', await techdocs(techdocsEnv))
    .addRouter('/proxy', await proxy(proxyEnv));

  await service.start().catch(err => {
    console.log(err);
    process.exit(1);
  });
}

module.hot?.accept();
main().catch(error => {
  console.error(`Backend failed to start up, ${error}`);
  process.exit(1);
});
