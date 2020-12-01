import React, { FC } from 'react';
import {
  createApp,
  AlertDisplay,
  microsoftAuthApiRef,
  OAuthRequestDialog,
  SidebarPage,
  SignInPage,
  createRouteRef,
} from '@backstage/core';
import { useApi, configApiRef } from '@backstage/core-api';
import { apis } from './apis';
import * as plugins from './plugins';
import { AppSidebar } from './sidebar';
import { Route, Routes, Navigate } from 'react-router';
import { Router as CatalogRouter } from '@backstage/plugin-catalog';
import { Router as DocsRouter } from '@backstage/plugin-techdocs';
import { Router as RegisterComponentRouter } from '@backstage/plugin-register-component';
import { Router as TechRadarRouter } from '@backstage/plugin-tech-radar';
import { Router as SettingsRouter } from '@backstage/plugin-user-settings';

import { EntityPage } from './components/catalog/EntityPage';

const app = createApp({
  apis,
  plugins: Object.values(plugins),
  components: {
    SignInPage: props => {
      const configApi = useApi(configApiRef);
      const appUrl = configApi.getString('app.baseUrl');

      let providers : any;
      if (appUrl.includes('localhost')) {
        providers = ['guest']
      } else {
        providers = [
          {
            id: 'microsoft-auth-provider',
            title: 'Microsoft',
            message: 'Sign In using Microsoft Azure AD',
            apiRef: microsoftAuthApiRef,
          }
        ]
      }

      return (
        <SignInPage
          {...props}
          providers={[...providers]}
          title="Select a sign-in method"
          align="center"
        />
      );
    },
  },
});

const AppProvider = app.getProvider();
const AppRouter = app.getRouter();
const deprecatedAppRoutes = app.getRoutes();

const catalogRouteRef = createRouteRef({
  path: '/catalog',
  title: 'Service Catalog',
});

const App: FC<{}> = () => (
  <AppProvider>
    <AlertDisplay />
    <OAuthRequestDialog />
    <AppRouter>
      <SidebarPage>
        <AppSidebar />
        <Routes>
          <Navigate key="/" to="/catalog" />
          <Route
            path="/catalog/*"
            element={<CatalogRouter EntityPage={EntityPage} />}
          />
          <Route path="/docs/*" element={<DocsRouter />} />
          <Route
            path="/tech-radar"
            element={<TechRadarRouter width={1500} height={800} />}
          />
          <Route path="/settings" element={<SettingsRouter />} />
          <Route
            path="/register-component"
            element={<RegisterComponentRouter catalogRouteRef={catalogRouteRef} />}
          />
          {deprecatedAppRoutes}
        </Routes>
      </SidebarPage>
    </AppRouter>
  </AppProvider>
);

export default App;
