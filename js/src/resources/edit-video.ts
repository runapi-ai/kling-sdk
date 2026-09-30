import type { HttpClient, PollingOptions, RequestOptions } from '@runapi.ai/core';
import { compactParams } from '@runapi.ai/core';
import { pollUntilComplete } from '@runapi.ai/core/internal';
import type { EditVideoParams, TaskCreateResponse, TextToVideoResponse } from '../types';

const ENDPOINT = '/api/v1/kling/edit_video';

export class EditVideo {
  constructor(private readonly http: HttpClient) {}

  async run(params: EditVideoParams, options?: RequestOptions & PollingOptions): Promise<TextToVideoResponse> {
    const { id } = await this.create(params, options);
    return pollUntilComplete<TextToVideoResponse>(() => this.get(id, options), {
      maxWaitMs: options?.maxWaitMs,
      pollIntervalMs: options?.pollIntervalMs,
    });
  }

  async create(params: EditVideoParams, options?: RequestOptions): Promise<TaskCreateResponse> {
    const body = compactParams(params);
    return this.http.request<TaskCreateResponse>('POST', ENDPOINT, { body, ...options });
  }

  async get(id: string, options?: RequestOptions): Promise<TextToVideoResponse> {
    return this.http.request<TextToVideoResponse>('GET', `${ENDPOINT}/${id}`, { ...options });
  }
}
