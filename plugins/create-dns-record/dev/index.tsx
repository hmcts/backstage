import React from 'react';
import { createDevApp } from '@backstage/dev-utils';
import { createDnsRecordPlugin, CreateDnsRecordPage } from '../src/plugin';

createDevApp()
  .registerPlugin(createDnsRecordPlugin)
  .addPage({
    element: <CreateDnsRecordPage />,
    title: 'Root Page',
    path: '/create-dns-record'
  })
  .render();
