import { createPlugin, createRoutableExtension } from '@backstage/core-plugin-api';

import { rootRouteRef } from './routes';

export const createDnsRecordPlugin = createPlugin({
  id: 'create-dns-record',
  routes: {
    root: rootRouteRef,
  },
});

export const CreateDnsRecordPage = createDnsRecordPlugin.provide(
  createRoutableExtension({
    name: 'CreateDnsRecordPage',
    component: () =>
      import('./components/createDnsRecord').then(m => m.dnsRecord),
    mountPoint: rootRouteRef,
  }),
);
