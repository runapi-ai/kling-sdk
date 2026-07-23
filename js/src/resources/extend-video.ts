import type { HttpClient, RequestOptions, PollingOptions, ActionSchema } from '@runapi.ai/core';
import { compactParams, validateParams } from '@runapi.ai/core';
import { pollUntilComplete } from '@runapi.ai/core/internal';
import { contract } from '../contract_gen';
import type { KlingExtendVideoParams, TextToVideoResponse, TaskCreateResponse } from '../types';

const ENDPOINT = '/api/v1/kling/extend_video';

export class ExtendVideo {
  constructor(private readonly http: HttpClient) {}

  async run(params: KlingExtendVideoParams, options?: RequestOptions & PollingOptions): Promise<TextToVideoResponse> {
    const { id } = await this.create(params, options);
    return pollUntilComplete<TextToVideoResponse>(() => this.get(id, options), {
      maxWaitMs: options?.maxWaitMs,
      pollIntervalMs: options?.pollIntervalMs,
    });
  }

  async create(params: KlingExtendVideoParams, options?: RequestOptions): Promise<TaskCreateResponse> {
    const body = compactParams(params);
    validateParams(contract['extend-video'] as ActionSchema, body as Record<string, unknown>);
    return this.http.request<TaskCreateResponse>('POST', ENDPOINT, { body, ...options });
  }

  async get(id: string, options?: RequestOptions): Promise<TextToVideoResponse> {
    return this.http.request<TextToVideoResponse>('GET', `${ENDPOINT}/${id}`, { ...options });
  }
}
