import type { HttpClient, RequestOptions, PollingOptions } from '@runapi.ai/core';
import { compactParams } from '@runapi.ai/core';
import { pollUntilComplete } from '@runapi.ai/core/internal';
import type {
  CompletedMotionControlResponse,
  MotionControlParams,
  MotionControlResponse,
  TaskCreateResponse,
} from '../types';

const ENDPOINT = '/api/v1/kling/motion_control';

export class MotionControl {
  constructor(private readonly http: HttpClient) {}

  async run(params: MotionControlParams, options?: RequestOptions & PollingOptions): Promise<CompletedMotionControlResponse> {
    const { id } = await this.create(params, options);
    const response = await pollUntilComplete<MotionControlResponse>(() => this.get(id, options), {
      maxWaitMs: options?.maxWaitMs,
      pollIntervalMs: options?.pollIntervalMs,
    });
    return response as CompletedMotionControlResponse;
  }

  async create(params: MotionControlParams, options?: RequestOptions): Promise<TaskCreateResponse> {
    return this.http.request<TaskCreateResponse>('POST', ENDPOINT, {
      body: compactParams(params),
      ...options,
    });
  }

  async get(id: string, options?: RequestOptions): Promise<MotionControlResponse> {
    return this.http.request<MotionControlResponse>('GET', `${ENDPOINT}/${id}`, {
      ...options,
    });
  }
}
