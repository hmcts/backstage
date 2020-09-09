import {
  ApiRegistry,
  alertApiRef,
  errorApiRef,
  AlertApiForwarder,
  ConfigApi,
  ErrorApiForwarder,
  ErrorAlerter,
  discoveryApiRef,
  MicrosoftAuth,
  microsoftAuthApiRef,
  UrlPatternDiscovery,
  oauthRequestApiRef,
  OAuthRequestManager,
  storageApiRef,
  WebStorage,
} from '@backstage/core';

import {
  GithubActionsClient,
  githubActionsApiRef,
} from '@backstage/plugin-github-actions';

import { jenkinsApiRef, JenkinsApi } from '@backstage/plugin-jenkins';
import {
  techdocsStorageApiRef,
  TechDocsStorageApi,
} from '@backstage/plugin-techdocs';
import {
  GithubPullRequestsClient,
  githubPullRequestsApiRef,
} from '@roadiehq/backstage-plugin-github-pull-requests';

import { catalogApiRef, CatalogClient } from '@backstage/plugin-catalog';

import { scaffolderApiRef, ScaffolderApi } from '@backstage/plugin-scaffolder';

export const apis = (config: ConfigApi) => {
  // eslint-disable-next-line no-console
  console.log(`Creating APIs for ${config.getString('app.title')}`);

  const backendUrl = config.getString('backend.baseUrl');
  const techdocsStorageUrl = config.getString('techdocs.storageUrl');

  const builder = ApiRegistry.builder();

  const discoveryApi = builder.add(
    discoveryApiRef,
    UrlPatternDiscovery.compile(`${backendUrl}/{{ pluginId }}`),
  );
  const alertApi = builder.add(alertApiRef, new AlertApiForwarder());
  const errorApi = builder.add(
    errorApiRef,
    new ErrorAlerter(alertApi, new ErrorApiForwarder()),
  );

  builder.add(storageApiRef, WebStorage.create({ errorApi }));
  builder.add(oauthRequestApiRef, new OAuthRequestManager());

  builder.add(jenkinsApiRef, new JenkinsApi(`${backendUrl}/proxy/jenkins/api`));
  builder.add(githubPullRequestsApiRef, new GithubPullRequestsClient());

  const oauthRequestApi = builder.add(
    oauthRequestApiRef,
    new OAuthRequestManager(),
  );

  builder.add(
    microsoftAuthApiRef,
    MicrosoftAuth.create({
      discoveryApi,
      oauthRequestApi,
    }),
  );

  builder.add(githubActionsApiRef, new GithubActionsClient());
  builder.add(catalogApiRef, new CatalogClient({ discoveryApi }));

  builder.add(scaffolderApiRef, new ScaffolderApi({ discoveryApi }));

  builder.add(
    techdocsStorageApiRef,
    new TechDocsStorageApi({ apiOrigin: techdocsStorageUrl }),
  );

  return builder.build();
};
