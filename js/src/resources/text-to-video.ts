import type { HttpClient, RequestOptions, PollingOptions, ActionSchema } from '@runapi.ai/core';
import { compactParams, validateParams } from '@runapi.ai/core';
import { pollUntilComplete } from '@runapi.ai/core/internal';
import { contract } from '../contract_gen';
import type {
  CompletedTextToVideoResponse,
  TextToVideoParams,
  TextToVideoResponse,
  TaskCreateResponse,
} from '../types';

const ENDPOINT = '/api/v1/kling/text_to_video';

/** Generate video from text prompts. Supports multi-shot, sound, first/last frame images, and Kling elements on kling-3.0; negative prompts and cfg_scale on V2.x models. */
export class TextToVideo {
  constructor(private readonly http: HttpClient) {}

  /**
   * Generate a video from a text prompt and wait until complete.
   * @param params Text-to-video parameters.
   * @param options Per-request and polling overrides.
   * @returns The completed task with videos.
   */
  async run(params: TextToVideoParams, options?: RequestOptions & PollingOptions): Promise<CompletedTextToVideoResponse> {
    const { id } = await this.create(params, options);
    const response = await pollUntilComplete<TextToVideoResponse>(() => this.get(id, options), {
      maxWaitMs: options?.maxWaitMs,
      pollIntervalMs: options?.pollIntervalMs,
    });
    return response as CompletedTextToVideoResponse;
  }

  /**
   * Create a text-to-video task; returns immediately with a task id.
   * @param params Text-to-video parameters.
   * @param options Per-request overrides.
   * @returns The task creation result with id.
   */
  async create(params: TextToVideoParams, options?: RequestOptions): Promise<TaskCreateResponse> {
    const body = compactParams(params);
    validateParams(contract['text-to-video'] as ActionSchema, body as Record<string, unknown>);
    return this.http.request<TaskCreateResponse>('POST', ENDPOINT, {
      body,
      ...options,
    });
  }

  /**
   * Fetch the current status of a text-to-video task.
   * @param id The task id.
   * @param options Per-request overrides.
   * @returns The current text-to-video task status.
   */
  async get(id: string, options?: RequestOptions): Promise<TextToVideoResponse> {
    return this.http.request<TextToVideoResponse>('GET', `${ENDPOINT}/${id}`, {
      ...options,
    });
  }
}
