import type { HttpClient, RequestOptions, PollingOptions } from '@runapi.ai/core';
import { compactParams } from '@runapi.ai/core';
import { pollUntilComplete } from '@runapi.ai/core/internal';
import type {
  CompletedImageToVideoResponse,
  ImageToVideoParams,
  ImageToVideoResponse,
  TaskCreateResponse,
} from '../types';

const ENDPOINT = '/api/v1/kling/image_to_video';

/** Animate a still image into video, guided by a text prompt and first-frame image. */
export class ImageToVideo {
  constructor(private readonly http: HttpClient) {}

  /**
   * Generate a video from an input image and wait until complete.
   * @param params Image-to-video parameters.
   * @param options Per-request and polling overrides.
   * @returns The completed task with videos.
   */
  async run(params: ImageToVideoParams, options?: RequestOptions & PollingOptions): Promise<CompletedImageToVideoResponse> {
    const { id } = await this.create(params, options);
    const response = await pollUntilComplete<ImageToVideoResponse>(() => this.get(id, options), {
      maxWaitMs: options?.maxWaitMs,
      pollIntervalMs: options?.pollIntervalMs,
    });
    return response as CompletedImageToVideoResponse;
  }

  /**
   * Create an image-to-video task; returns immediately with a task id.
   * @param params Image-to-video parameters.
   * @param options Per-request overrides.
   * @returns The task creation result with id.
   */
  async create(params: ImageToVideoParams, options?: RequestOptions): Promise<TaskCreateResponse> {
    return this.http.request<TaskCreateResponse>('POST', ENDPOINT, {
      body: compactParams(params),
      ...options,
    });
  }

  /**
   * Fetch the current status of an image-to-video task.
   * @param id The task id.
   * @param options Per-request overrides.
   * @returns The current image-to-video task status.
   */
  async get(id: string, options?: RequestOptions): Promise<ImageToVideoResponse> {
    return this.http.request<ImageToVideoResponse>('GET', `${ENDPOINT}/${id}`, {
      ...options,
    });
  }
}
