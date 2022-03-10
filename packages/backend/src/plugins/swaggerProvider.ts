import { UrlReader } from '@backstage/backend-common';
import { Entity } from '@backstage/catalog-model';
import {
  EntityProvider,
  EntityProviderConnection,
} from '@backstage/plugin-catalog-backend';
import { Logger } from 'winston';

/**
 * Provides entities to update swagger documentation.
 */
export class SwaggerProvider implements EntityProvider {
  private readonly env: string;
  private readonly reader: UrlReader;
  private logger: Logger;
  private connection?: EntityProviderConnection;

  /** [1] **/
  constructor(env: string, reader: UrlReader, logger: Logger) {
    this.env = env;
    this.reader = reader;
    this.logger = logger;

  }

  /** [2] **/
  getProviderName(): string {
    return `SwaggerProvider`;
  }

  /** [3] **/
  async connect(connection: EntityProviderConnection): Promise<void> {
    this.connection = connection;
  }

  /** [4] **/
  async run(): Promise<void> {

    if (!this.connection) {
      throw new Error('Not initialized');
    }

    const raw = await this.reader.read(
      `https://raw.githubusercontent.com/hmcts/reform-api-docs/master/docs/backstage/labs-jackmaloney2-api.yaml`,
    );

    this.logger.info("This shows the api json " + raw.toString());


//     let data = {}
//     try {
//         data = JSON.parse(raw.toString());
//     } catch (err) {
//         console.log(err)
//       this.logger.error('Failed to fetch', err);
//     }
//
//     this.logger.info("I am a test here4");

//     /** [5] **/
//     const entities: Entity[] = [];

    /** [6] **/
    const rawString = raw.toString()
    try {
    await this.connection.applyMutation({
      type: 'full',
      entities: rawString
    });
    } catch (err) {
        console.log(err)
      this.logger.error('Failed to fetch', err);
    }
    this.logger.info("I am a test here");

  }
}
