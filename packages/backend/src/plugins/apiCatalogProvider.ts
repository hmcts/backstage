import { Config } from '@backstage/config';
import { locationSpecToLocationEntity } from '../util/conversion';
import { getEntityLocationRef } from '../processing/util';
import { EntityProvider, EntityProviderConnection } from "@backstage/plugin-catalog-node";
import { LoggerService } from "@backstage/backend-plugin-api";

/**
 * Provides entities to update API Swagger documentation.
 */
export class ApiCatalogProvider implements EntityProvider {
  private readonly config: Config;
  private logger: LoggerService;
  private connection?: EntityProviderConnection;

  constructor(config: Config, logger: LoggerService) {
    this.config = config;
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

    await this?.connection?.applyMutation({
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
          target: target,
        });

        const locationKey = getEntityLocationRef(entity);

        return { entity, locationKey };
      });
    }
}
