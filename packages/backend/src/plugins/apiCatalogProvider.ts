import { Config } from '@backstage/config';
import { UrlReader } from '@backstage/backend-common';
import { Entity } from '@backstage/catalog-model';
import {
  EntityProvider,
  EntityProviderConnection,
} from '@backstage/plugin-catalog-backend';
import { Logger } from 'winston';
import { locationSpecToLocationEntity } from '../util/conversion';
import { getEntityLocationRef } from '../processing/util';

/**
 * Provides entities to update API Swagger documentation.
 */
export class ApiCatalogProvider implements EntityProvider {
  private readonly env: string;
  private readonly config: Config;
  private readonly reader: UrlReader;
  private logger: Logger;
  private connection?: EntityProviderConnection;

  constructor(config: Config, env: string, reader: UrlReader, logger: Logger) {
    this.config = config;
    this.env = env;
    this.reader = reader;
    this.logger = logger;
  }

  getProviderName(): string {
    return `ApiCatalogProvider`;
  }

  async connect(connection: EntityProviderConnection): Promise<void> {
    this.connection = connection;
  }

  async run(): Promise<void> {
    this.logger.info("About to refresh API catalog");

    const entities = this.getEntitiesFromConfig();

    await this.connection.applyMutation({
      type: 'full',
      entities,
    });

    this.logger.info("API catalog updated");
  }

  private getEntitiesFromConfig() {
    const locationConfigs = this.config.getOptionalConfigArray('catalog.apis') ?? [];

      return locationConfigs.map(location => {
        const type = location.getString('type');
        const target = location.getString('target');

        const entity = locationSpecToLocationEntity({
          type,
          target: type === 'file' ? path.resolve(target) : target,
        });

        const locationKey = getEntityLocationRef(entity);

        return { entity, locationKey };
      });
    }
}