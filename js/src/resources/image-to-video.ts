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

export class ImageToVideo {
  constructor(private readonly http: HttpClient) {}

  async run(params: ImageToVideoParams, options?: RequestOptions & PollingOptions): Promise<CompletedImageToVideoResponse> {
    const { id } = await this.create(params, options);
    const response = await pollUntilComplete<ImageToVideoResponse>(() => this.get(id, options), {
      maxWaitMs: options?.maxWaitMs,
      pollIntervalMs: options?.pollIntervalMs,
    });
    return response as CompletedImageToVideoResponse;
  }

  async create(params: ImageToVideoParams, options?: RequestOptions): Promise<TaskCreateResponse> {
    return this.http.request<TaskCreateResponse>('POST', ENDPOINT, {
      body: compactParams(params),
      ...options,
    });
  }

  async get(id: string, options?: RequestOptions): Promise<ImageToVideoResponse> {
    return this.http.request<ImageToVideoResponse>('GET', `${ENDPOINT}/${id}`, {
      ...options,
    });
  }
}
