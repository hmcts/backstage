import { UrlReader } from '@backstage/backend-common';
import { Entity } from '@backstage/catalog-model';
import {
  EntityProvider,
  EntityProviderConnection,
} from '@backstage/plugin-catalog-backend';
import { Logger } from 'winston';

/**
 * Provides entities from fictional frobs service.
 */
export class FrobsProvider implements EntityProvider {
  private readonly env: string;
  private readonly reader: UrlReader;
  private logger: Logger;
  private connection?: EntityProviderConnection;

  /** [1] **/
  constructor(env: string, reader: UrlReader, logger: Logger) {
    this.env = env;
    this.reader = reader;
    this.logger = logger;
    logger.info("I am a test log");

  }

  /** [2] **/
  getProviderName(): string {
    return `frobs-${this.env}`;
  }

  /** [3] **/
  async connect(connection: EntityProviderConnection): Promise<void> {
    this.connection = connection;
  }

  /** [4] **/
  async run(): Promise<void> {
    this.logger.info("I am a test log1");

    if (!this.connection) {
      throw new Error('Not initialized');
    }
    this.logger.info("I am a test log2");
    let raw = {}
    try {
     raw = await this.reader.read(
      `https://raw.githubusercontent.com/hmcts/reform-api-docs/master/docs/backstage/labs-jackmaloney2-api.yaml`,
    );
    } catch(err) {
      console.log(err)
      this.logger.error('Failed to fetch', err);
    }
    this.logger.info("I am a test log3 " + raw.toString());
    const data = JSON.parse(raw.toString());

    this.logger.info("I am a test log4", data);
    this.logger.info(data);
    console.log(raw)

    /** [5] **/
    const entities: Entity[] = [];

    /** [6] **/
    await this.connection.applyMutation({
      type: 'full',
      entities: entities.map(entity => ({
        entity,
        locationKey: `frobs-provider:${this.env}`,
      })),
    });
  }
}
