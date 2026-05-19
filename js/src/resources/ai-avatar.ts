import type { HttpClient, RequestOptions, PollingOptions } from '@runapi.ai/core';
import { compactParams } from '@runapi.ai/core';
import { pollUntilComplete } from '@runapi.ai/core/internal';
import type {
  CompletedAiAvatarResponse,
  AiAvatarParams,
  AiAvatarResponse,
  TaskCreateResponse,
} from '../types';

const ENDPOINT = '/api/v1/kling/ai_avatar';

export class AiAvatar {
  constructor(private readonly http: HttpClient) {}

  async run(params: AiAvatarParams, options?: RequestOptions & PollingOptions): Promise<CompletedAiAvatarResponse> {
    const { id } = await this.create(params, options);
    const response = await pollUntilComplete<AiAvatarResponse>(() => this.get(id, options), {
      maxWaitMs: options?.maxWaitMs,
      pollIntervalMs: options?.pollIntervalMs,
    });
    return response as CompletedAiAvatarResponse;
  }

  async create(params: AiAvatarParams, options?: RequestOptions): Promise<TaskCreateResponse> {
    return this.http.request<TaskCreateResponse>('POST', ENDPOINT, {
      body: compactParams(params),
      ...options,
    });
  }

  async get(id: string, options?: RequestOptions): Promise<AiAvatarResponse> {
    return this.http.request<AiAvatarResponse>('GET', `${ENDPOINT}/${id}`, {
      ...options,
    });
  }
}
