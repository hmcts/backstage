**Please DO NOT use this repo going forward.**
**This instance of Backstage has been superseded by https://github.com/hmcts/backstage-portal.**

# [Backstage](https://backstage.io)

This repository contains all things Backstage within HMCTS.


The Backstage application as deployed on HMCTS is made of 2 separate components:

- Frontend
- Backend

These are both contained within this repository which itself is considered a [monorepo](https://yarnpkg.com/features/workspaces) structure.

Each application is built using the `backstage-cli` which creates a scaffolded application that can then be customised, these are found under `packages` within this repository.
More information can be found [here](https://github.com/Diabol/Backstage/blob/master/docs/getting-started/create-an-app.md).

## Deployment

Backstage is deployed to Kubernetes (AKS) via [Flux](https://github.com/hmcts/cnp-flux-config/tree/master/apps/backstage).

It is deployed to only 2 environments, a non-production Sandbox environment and production PTL environment.

A Postgres database instance is created for the service as well using the Azure Postgres Flexible service.

Each environment has an integration with:

- Jenkins - used to monitor CI/CD pipelines for the deployed software components created by Backstage.
- GitHub - used to allow Backstage to connect, read and create repositories within GitHub when users request new components via the Backstage UI.
- Azure - used to allow Single Sign On log ins using an Application Registration.
- Azure Graph - used to scrape Azure Entra to populate the Backstage database with users and groups from Entra. This helps with ownership of components within Backstage.

### Helm Chart

The Helm Chart used to deploy the Backstage application is a fork of the `Roadie` Helm Chart.

- [Roadie repository](https://github.com/RoadieHQ/helm-charts)
- [HMCTS Fork](https://github.com/hmcts/RoadieHQ-helm-charts)

A Helm Repository resource has been created within Flux to allow for deployments from the HMCTS fork and works for the current version of Backstage that we have deployed.

Be mindful of the upgrades in the Roadie Helm Charts if you plan to upgrade Backstage as there may be necessary changes in the upstream charts that we do not currently have in our fork.

## Local Development

You can run Backstage locally to learn how it works, develop plugins or test upgrades without breaking the currently deployed versions.
Backstage uses [NodeJS](https://www.freecodecamp.org/news/node-version-manager-nvm-install-guide/) and [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable) to build and run so you will need to install both.

Once you have them, you can find commands to run in the `packages.json` file in the root of the repository:
```
  "scripts": {
    "dev": "concurrently \"yarn start\" \"yarn start-backend\"",
    "start": "yarn workspace app start",
    "start-backend": "yarn workspace backend start",
    "build": "backstage-cli repo build --all",
    "build-image": "yarn workspace backend build-image",
    "tsc": "tsc",
    "tsc:full": "tsc --skipLibCheck false --incremental false",
    "clean": "backstage-cli repo clean",
    "test": "backstage-cli test",
    "test:all": "lerna run test -- --coverage",
    "lint": "backstage-cli repo lint --since origin/master",
    "lint:all": "backstage-cli repo lint",
    "prettier:check": "prettier --check .",
    "create-plugin": "backstage-cli create-plugin --scope internal",
    "new": "backstage-cli new --scope internal"
  },
```

These commands allow you to do everything required for Backstage with regards to building, testing and running the application.

You will need to run the following commands to setup the application locally from the root of the repository:

```sh
yarn install
yarn tsc
yarn build
```
Once built you will need to also bring online the docker postgres database before you can start Backstage.

Within the repository you will find `docker-compose.yaml` which contains 2 container definitions.

- backend - only used when you build and image of the backend, not necessary now so you can comment this out completely.
- postgres - required to run Backstage locally as it acts as the database service.

To limit the integrations with 3rd party services you can comment out the following sections of `app-config.yaml` as they require connection details which are unnecessary for local development (unless you are specifically working on a plugin that uses them).

```yaml
jenkins:
  instances:
    - name: cft
      baseUrl: ${JENKINS_CFT_URL}
      username: ${JENKINS_CFT_USERNAME}
      apiKey: ${JENKINS_CFT_API_KEY}
```

```yaml
integrations:
  github:
    # This is a Personal Access Token or PAT from GitHub. You can find out how to generate this token, and more information
    # about setting up the GitHub integration here: https://backstage.io/docs/getting-started/configuration#setting-up-a-github-integration
    - host: github.com
      apps:
        - $include: github-app-backstage-hmcts-credentials.yaml

```

Finally before you can start the application you need to setup environment variables for the Azure SSO login and Postgres connection:

```sh
export AUTH_MICROSOFT_CLIENT_ID="< Found in Key Vault dtscftptl>"
export AUTH_MICROSOFT_CLIENT_SECRET="< Found in Key Vault dtscftptl>"
export AUTH_MICROSOFT_TENANT_ID="<Tenant ID>"
```

The following are based on the `docker-compose.yaml` file settings:

```sh
export POSTGRES_HOST=localhost
export POSTGRES_PORT=5432
export POSTGRES_USER=postgres
export POSTGRES_PASSWORD=postgres
```

At this point you can now run the following to start the frontend and backend packages:

```sh
yarn dev
```

A browser window should open and load `http://localhost:3000` for you to log into Backstage.

## Try out the Live deployment

Try it out at https://backstage.hmcts.net
