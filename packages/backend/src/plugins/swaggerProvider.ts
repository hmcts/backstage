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
 * Provides entities to update swagger documentation.
 */
export class SwaggerProvider implements EntityProvider {
  private readonly env: string;
  private readonly config: Config;
  private readonly reader: UrlReader;
  private logger: Logger;
  private connection?: EntityProviderConnection;

  /** [1] **/
  constructor(config: Config, env: string, reader: UrlReader, logger: Logger) {
    this.config = config;
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

//     if (!this.connection) {
//       throw new Error('Not initialized');
//     }
//
//     const raw = await this.reader.read(
//       `https://raw.githubusercontent.com/hmcts/reform-api-docs/master/docs/backstage/labs-jackmaloney2-api.yaml`,
//     );
//
//     this.logger.info("This shows the api json " + raw.toString());
//

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


//     /** [6] **/
//     const rawString = raw.toString()
//     try {
//     await this.connection.applyMutation({
//       type: 'full',
//       entities: rawString
//     });
//     } catch (err) {
//         console.log(err)
//       this.logger.error('Failed to fetch', err);
//     }
    this.logger.info("I am a test here");


    const entities = this.getEntitiesFromConfig();

    let currentKey = JSON.stringify(entities);

    this.logger.info("I am a test, here is the key: " + currentKey);
      await this.connection.applyMutation({
        type: 'full',
        entities,
      });

//       if (this.config.subscribe) {
//         let currentKey = JSON.stringify(entities);
//         this.logger.info("I am a test, here is the key: " + currentKey);
//
//         this.config.subscribe(() => {
//           this.logger.info("I am a test here6");
//           const newEntities = this.getEntitiesFromConfig();
//
//           const newKey = JSON.stringify(newEntities);
//           this.logger.info("I am a test here8");
//
//           if (currentKey !== newKey) {
//             currentKey = newKey;
//             connection.applyMutation({
//               type: 'full',
//               entities: newEntities,
//           });
//
//           this.logger.info("I am a test here9");
//         }
//       });
//     }
    this.logger.info("I am a test here10");
  }

  private getEntitiesFromConfig() {
    const locationConfigs = this.config.getOptionalConfigArray('catalog.locations') ?? [];

      return locationConfigs.map(location => {
        const type = location.getString('type');
        const target = location.getString('target');

        const entity = locationSpecToLocationEntity({
          type,
          target: type === 'file' ? path.resolve(target) : target,
        });

// Maybe don't need this? Can delete util.ts if so
//         this.logger.info("I am a test here13");
//         const locationKey = getEntityLocationRef(entity);
//         this.logger.info("I am a test here14");

        return { entity };
      });
    }
}
