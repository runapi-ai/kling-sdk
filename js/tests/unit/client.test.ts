import { describe, it, expect } from 'vitest';
import { KlingClient } from '../../src/client';
import { Files, Account, Pricing } from '@runapi.ai/core';
import type { TaskCreateResponse, TextToVideoResponse } from '../../src/types';

describe('KlingClient universal resources', () => {
  it('exposes universal resources inherited from the base client', () => {
    const client = new KlingClient({ apiKey: 'test-key' });

    expect(client.files).toBeInstanceOf(Files);
    expect(client.account).toBeInstanceOf(Account);
    expect(client.pricing).toBeInstanceOf(Pricing);
  });

  it('types usage.cost on completed query responses and omits it from create acknowledgements', () => {
    const creation: TaskCreateResponse = { id: 'task-1' };
    const response: TextToVideoResponse = {
      id: 'task-1', status: 'completed', usage: { cost: 0.12 },
    };

    expect('usage' in creation).toBe(false);
    expect(response.usage?.cost).toBe(0.12);
  });
});
