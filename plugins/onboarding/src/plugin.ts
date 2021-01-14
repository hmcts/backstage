import { createPlugin, createRouteRef } from '@backstage/core';
import ExampleComponent from './components/ExampleComponent';

export const rootRouteRef = createRouteRef({
  path: '/onboarding',
  title: 'onboarding',
});

export const plugin = createPlugin({
  id: 'onboarding',
  register({ router }) {
    router.addRoute(rootRouteRef, ExampleComponent);
  },
});
