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

/** Transfer motion from a reference video onto a subject image, preserving the subject's appearance. */
export class MotionControl {
  constructor(private readonly http: HttpClient) {}

  /**
   * Generate a video with motion transfer from a reference video and wait until complete.
   * @param params Motion control parameters.
   * @param options Per-request and polling overrides.
   * @returns The completed task with videos.
   */
  async run(params: MotionControlParams, options?: RequestOptions & PollingOptions): Promise<CompletedMotionControlResponse> {
    const { id } = await this.create(params, options);
    const response = await pollUntilComplete<MotionControlResponse>(() => this.get(id, options), {
      maxWaitMs: options?.maxWaitMs,
      pollIntervalMs: options?.pollIntervalMs,
    });
    return response as CompletedMotionControlResponse;
  }

  /**
   * Create a motion control generation task; returns immediately with a task id.
   * @param params Motion control parameters.
   * @param options Per-request overrides.
   * @returns The task creation result with id.
   */
  async create(params: MotionControlParams, options?: RequestOptions): Promise<TaskCreateResponse> {
    return this.http.request<TaskCreateResponse>('POST', ENDPOINT, {
      body: compactParams(params),
      ...options,
    });
  }

  /**
   * Fetch the current status of a motion control task.
   * @param id The task id.
   * @param options Per-request overrides.
   * @returns The current motion control task status.
   */
  async get(id: string, options?: RequestOptions): Promise<MotionControlResponse> {
    return this.http.request<MotionControlResponse>('GET', `${ENDPOINT}/${id}`, {
      ...options,
    });
  }
}
