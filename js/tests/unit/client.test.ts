import { describe, it, expect } from 'vitest';
import { KlingClient } from '../../src/client';
import { Files, Account } from '@runapi.ai/core';

describe('KlingClient universal resources', () => {
  it('exposes files and account inherited from the base client', () => {
    const client = new KlingClient({ apiKey: 'test-key' });

    expect(client.files).toBeInstanceOf(Files);
    expect(client.account).toBeInstanceOf(Account);
  });
});
