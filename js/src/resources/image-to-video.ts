import type { HttpClient, RequestOptions, PollingOptions, ActionSchema } from '@runapi.ai/core';
import { ValidationError, compactParams, validateParams } from '@runapi.ai/core';
import { pollUntilComplete } from '@runapi.ai/core/internal';
import { contract } from '../contract_gen';
import { validateKlingO1References } from './o1-reference-validation';
import type {
  CompletedImageToVideoResponse,
  ImageToVideoParams,
  ImageToVideoResponse,
  TaskCreateResponse,
} from '../types';

const ENDPOINT = '/api/v1/kling/image_to_video';
const V26_MODEL = 'kling-v2.6';
const V3_OMNI_MODEL = 'kling-v3-omni';
const V3_TURBO_MODEL = 'kling-v3-turbo-image-to-video';
const V3_TURBO_UNSUPPORTED_FIELDS = [
  'aspect_ratio',
  'negative_prompt',
  'cfg_scale',
  'last_frame_image_url',
];

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
    const body = compactParams(params);
    rejectUnsupportedV3TurboFields(body as Record<string, unknown>);
    validateParams(contract['image-to-video'] as ActionSchema, body as Record<string, unknown>);
    validateV26Params(body as Record<string, unknown>);
    validateV3OmniFields(body as Record<string, unknown>);
    validateKlingO1References(body as Record<string, unknown>);
    return this.http.request<TaskCreateResponse>('POST', ENDPOINT, {
      body,
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

function validateV26Params(body: Record<string, unknown>): void {
  if (body.model !== V26_MODEL) return;
  if (body.enable_sound === true && body.mode !== 'pro') {
    throw new ValidationError(`enable_sound requires mode pro for ${V26_MODEL}`);
  }
  if (!fieldPresent(body, 'last_frame_image_url')) return;
  if (body.mode !== 'pro') {
    throw new ValidationError(`last_frame_image_url requires mode pro for ${V26_MODEL}`);
  }
  if (body.duration_seconds !== undefined && body.duration_seconds !== 5) {
    throw new ValidationError(`last_frame_image_url requires duration_seconds 5 for ${V26_MODEL}`);
  }
}

function validateV3OmniFields(body: Record<string, unknown>): void {
  if (body.model !== V3_OMNI_MODEL || !fieldPresent(body, 'last_frame_image_url')) return;
  if ((body.duration_seconds ?? 5) !== 5) {
    throw new ValidationError(`last_frame_image_url requires duration_seconds 5 for ${V3_OMNI_MODEL}`);
  }
}

function rejectUnsupportedV3TurboFields(body: Record<string, unknown>): void {
  if (body.model !== V3_TURBO_MODEL) return;

  const field = V3_TURBO_UNSUPPORTED_FIELDS.find((candidate) => fieldPresent(body, candidate));
  if (field) {
    throw new ValidationError(`${field} is not supported by ${V3_TURBO_MODEL}`);
  }
}

function fieldPresent(params: Record<string, unknown>, field: string): boolean {
  if (!(field in params)) return false;
  const value = params[field];
  if (value === false) return true;
  if (Array.isArray(value)) return value.some((item) => presentValue(item));
  return presentValue(value);
}

function presentValue(value: unknown): boolean {
  if (value === null || value === undefined || value === false) return false;
  if (value === true) return true;
  if (typeof value === 'string') return value.trim() !== '';
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.keys(value as object).length > 0;
  return true;
}
