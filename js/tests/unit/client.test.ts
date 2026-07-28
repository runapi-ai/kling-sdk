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

  it('types billing facts on task creation and query responses', () => {
    const creation: TaskCreateResponse = {
      id: 'task-1',
      billing: { reservation: null, settlement: null, refund: null },
    };
    const response: TextToVideoResponse = {
      id: 'task-1', status: 'completed', billing: { settlement: { charged_amount_cents: 12, amount_micro_cents: 1_200_000 } },
    };

    expect(creation.billing?.reservation).toBeNull();
    expect(response.billing?.settlement?.charged_amount_cents).toBe(12);
  });
});
