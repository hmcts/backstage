import React, { FC } from 'react';
import {
  createApp,
  AlertDisplay,
  OAuthRequestDialog,
  SidebarPage,
  SignInPage,
  microsoftAuthApiRef
} from '@backstage/core';
import { apis } from './apis';
import * as plugins from './plugins';
import { AppSidebar } from './sidebar';

const providers = [
  {
    id: 'microsoft-auth-provider',
    title: 'Microsoft',
    message: 'Sign In using Microsoft Azure AD',
    apiRef: microsoftAuthApiRef,
  }
]

const app = createApp({
  apis,
  plugins: Object.values(plugins),
  components: {
    SignInPage: props => {
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
