import React from 'react';
import {Route} from 'react-router';
import {apiDocsPlugin, ApiExplorerPage} from '@backstage/plugin-api-docs';
import {
    CatalogEntityPage,
    CatalogIndexPage,
    catalogPlugin,
} from '@backstage/plugin-catalog';
import {
    CatalogImportPage,
    catalogImportPlugin,
} from '@backstage/plugin-catalog-import';
import {ScaffolderPage, scaffolderPlugin} from '@backstage/plugin-scaffolder';
import {orgPlugin} from '@backstage/plugin-org';
import {SearchPage} from '@backstage/plugin-search';
import {TechRadarPage} from '@backstage/plugin-tech-radar';
import {
    TechDocsIndexPage,
    techdocsPlugin,
    TechDocsReaderPage,
} from '@backstage/plugin-techdocs';
import {UserSettingsPage} from '@backstage/plugin-user-settings';
import {apis} from './apis';
import {entityPage} from './components/catalog/EntityPage';
import {searchPage} from './components/search/SearchPage';
import {Root} from './components/Root';

import {AlertDisplay, OAuthRequestDialog, SignInProviderConfig, SignInPage} from '@backstage/core-components';
import {createApp} from '@backstage/app-defaults';
import {FlatRoutes} from '@backstage/core-app-api';
import {CatalogGraphPage} from '@backstage/plugin-catalog-graph';
import {RequirePermission} from '@backstage/plugin-permission-react';
import {catalogEntityCreatePermission} from '@backstage/plugin-catalog-common/alpha';
import {microsoftAuthApiRef} from '@backstage/core-plugin-api';

import { HomepageCompositionRoot } from '@backstage/plugin-home';
import { HomePage } from './components/home/HomePage';
import { CreateDnsRecordPage } from '@internal/plugin-create-dns-record';

const microsoftAuthProvider: SignInProviderConfig = {
    id: 'azure-auth-provider',
    title: 'Microsoft Active Directory',
    message: 'Sign in to Backstage Application using your Active Directory account.',
    apiRef: microsoftAuthApiRef,
};

const app = createApp({
    apis,
    components: {
        SignInPage: props => (
            <SignInPage
                {...props}
                auto
                provider={microsoftAuthProvider}
            />
        ),
    },
    bindRoutes({bind}) {
        bind(catalogPlugin.externalRoutes, {
            createComponent: scaffolderPlugin.routes.root,
            viewTechDoc: techdocsPlugin.routes.docRoot,
        });
        bind(apiDocsPlugin.externalRoutes, {
            registerApi: catalogImportPlugin.routes.importPage,
        });
        bind(scaffolderPlugin.externalRoutes, {
            registerComponent: catalogImportPlugin.routes.importPage,
        });
        bind(orgPlugin.externalRoutes, {
            catalogIndex: catalogPlugin.routes.catalogIndex,
        });
    },
});

const AppProvider = app.getProvider();
const AppRouter = app.getRouter();

const routes = (
    <FlatRoutes>
        <Route path="/" element={<HomepageCompositionRoot />}>
            <HomePage />
        </Route>
        <Route path="/catalog" element={<CatalogIndexPage/>}/>
        <Route
            path="/catalog/:namespace/:kind/:name"
            element={<CatalogEntityPage/>}
        >
            {entityPage}
        </Route>
        <Route path="/docs" element={<TechDocsIndexPage/>}/>
        <Route
            path="/docs/:namespace/:kind/:name/*"
            element={<TechDocsReaderPage/>}
        />
        <Route path="/create" element={<ScaffolderPage/>}/>
        <Route path="/api-docs" element={<ApiExplorerPage/>}/>
        <Route
            path="/tech-radar"
            element={<TechRadarPage width={1500} height={800}/>}
        />
        <Route
            path="/catalog-import"
            element={
                <RequirePermission permission={catalogEntityCreatePermission}>
                    <CatalogImportPage/>
                </RequirePermission>
            }/>
        <Route path="/search" element={<SearchPage/>}>
            {searchPage}
        </Route>
        <Route path="/settings" element={<UserSettingsPage/>}/>
        <Route path="/catalog-graph" element={<CatalogGraphPage/>}/>
        <Route path="/create-dns-record" element={<CreateDnsRecordPage />}/>
    </FlatRoutes>
);

const App = () => (
    <AppProvider>
        <AlertDisplay/>
        <OAuthRequestDialog/>
        <AppRouter>
            <Root>{routes}</Root>
        </AppRouter>
    </AppProvider>
);

export default App;
