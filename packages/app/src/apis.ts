import {
  ApiRegistry,
  alertApiRef,
  errorApiRef,
  AlertApiForwarder,
  ConfigApi,
  ErrorApiForwarder,
  ErrorAlerter,
  MicrosoftAuth,
  microsoftAuthApiRef,
  oauthRequestApiRef,
  OAuthRequestManager,
  storageApiRef,
  WebStorage,
} from '@backstage/core';

import { catalogApiRef, CatalogClient } from '@backstage/plugin-catalog';

import { scaffolderApiRef, ScaffolderApi } from '@backstage/plugin-scaffolder';
import { jenkinsApiRef, JenkinsApi } from '@backstage/plugin-jenkins';
import {
  techdocsStorageApiRef,
  TechDocsStorageApi,
} from '@backstage/plugin-techdocs';
import {
  GithubPullRequestsClient,
  githubPullRequestsApiRef,
} from '@roadiehq/backstage-plugin-github-pull-requests';

import {
  GithubActionsClient,
  githubActionsApiRef,
} from '@backstage/plugin-github-actions';

export const apis = (config: ConfigApi) => {
  // eslint-disable-next-line no-console
  console.log(`Creating APIs for ${config.getString('app.title')}`);

  const backendUrl = config.getString('backend.baseUrl');
  const techdocsUrl = config.getString('techdocs.storageUrl');

  const builder = ApiRegistry.builder();

  const alertApi = builder.add(alertApiRef, new AlertApiForwarder());
  const errorApi = builder.add(
    errorApiRef,
    new ErrorAlerter(alertApi, new ErrorApiForwarder()),
  );

  builder.add(storageApiRef, WebStorage.create({ errorApi }));
  builder.add(oauthRequestApiRef, new OAuthRequestManager());

  builder.add(
    catalogApiRef,
    new CatalogClient({
      apiOrigin: backendUrl,
      basePath: '/catalog',
    }),
  );

  builder.add(jenkinsApiRef, new JenkinsApi(`${backendUrl}/proxy/jenkins/api`));
  builder.add(githubPullRequestsApiRef, new GithubPullRequestsClient());

  const oauthRequestApi = builder.add(
    oauthRequestApiRef,
    new OAuthRequestManager(),
  );

  builder.add(
    microsoftAuthApiRef,
    MicrosoftAuth.create({
      backendUrl,
      basePath: '/auth/',
      oauthRequestApi,
    }),
  );

  builder.add(githubActionsApiRef, new GithubActionsClient());

  builder.add(
    scaffolderApiRef,
    new ScaffolderApi({
      apiOrigin: backendUrl,
      basePath: '/scaffolder/v1',
    }),
  );

  builder.add(
    techdocsStorageApiRef,
    new TechDocsStorageApi({
      apiOrigin: techdocsUrl,
    }),
  );


  return builder.build();
};
