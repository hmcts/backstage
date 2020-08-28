import React, { FC } from 'react';
import {
  createApp,
  AlertDisplay,
  microsoftAuthApiRef,
  OAuthRequestDialog,
  SidebarPage,
  SignInPage,
} from '@backstage/core';
import { useApi, configApiRef } from '@backstage/core-api';
import { apis } from './apis';
import * as plugins from './plugins';
import { AppSidebar } from './sidebar';

const app = createApp({
  apis,
  plugins: Object.values(plugins),
  components: {
    SignInPage: props => {
      const configApi = useApi(configApiRef);
      const appUrl = configApi.getString('app.baseUrl');

      let providers;
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
const AppRoutes = app.getRoutes();

const App: FC<{}> = () => (
  <AppProvider>
    <AlertDisplay />
    <OAuthRequestDialog />
    <AppRouter>
      <SidebarPage>
        <AppSidebar />
        <AppRoutes />
      </SidebarPage>
    </AppRouter>
  </AppProvider>
);

export default App;
