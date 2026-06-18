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

/** Lip-sync a face image to an audio track, producing a talking-head video. */
export class AiAvatar {
  constructor(private readonly http: HttpClient) {}

  /**
   * Generate an AI avatar video and wait until complete.
   * @param params AI avatar parameters.
   * @param options Per-request and polling overrides.
   * @returns The completed task with videos.
   */
  async run(params: AiAvatarParams, options?: RequestOptions & PollingOptions): Promise<CompletedAiAvatarResponse> {
    const { id } = await this.create(params, options);
    const response = await pollUntilComplete<AiAvatarResponse>(() => this.get(id, options), {
      maxWaitMs: options?.maxWaitMs,
      pollIntervalMs: options?.pollIntervalMs,
    });
    return response as CompletedAiAvatarResponse;
  }

  /**
   * Create an AI avatar generation task; returns immediately with a task id.
   * @param params AI avatar parameters.
   * @param options Per-request overrides.
   * @returns The task creation result with id.
   */
  async create(params: AiAvatarParams, options?: RequestOptions): Promise<TaskCreateResponse> {
    return this.http.request<TaskCreateResponse>('POST', ENDPOINT, {
      body: compactParams(params),
      ...options,
    });
  }

  /**
   * Fetch the current status of an AI avatar task.
   * @param id The task id.
   * @param options Per-request overrides.
   * @returns The current AI avatar task status.
   */
  async get(id: string, options?: RequestOptions): Promise<AiAvatarResponse> {
    return this.http.request<AiAvatarResponse>('GET', `${ENDPOINT}/${id}`, {
      ...options,
    });
  }
}
