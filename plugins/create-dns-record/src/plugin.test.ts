import { createDnsRecordPlugin } from './plugin';

describe('create-dns-record', () => {
  it('should export plugin', () => {
    expect(createDnsRecordPlugin).toBeDefined();
  });
});
