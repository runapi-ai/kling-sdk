import type { HttpClient, RequestOptions, PollingOptions, ActionSchema } from '@runapi.ai/core';
import { ValidationError, compactParams, validateParams } from '@runapi.ai/core';
import { pollUntilComplete } from '@runapi.ai/core/internal';
import { contract } from '../contract_gen';
import type {
  CompletedTextToVideoResponse,
  TextToVideoParams,
  TextToVideoResponse,
  TaskCreateResponse,
} from '../types';

const ENDPOINT = '/api/v1/kling/text_to_video';
const V26_MODEL = 'kling-v2.6';
const V3_TURBO_MODEL = 'kling-v3-turbo-text-to-video';
const V3_TURBO_UNSUPPORTED_FIELDS = [
  'enable_sound',
  'negative_prompt',
  'cfg_scale',
  'multi_shots',
  'multi_prompt',
  'first_frame_image_url',
  'last_frame_image_url',
  'kling_elements',
];

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
    rejectUnsupportedV3TurboFields(body as Record<string, unknown>);
    validateParams(contract['text-to-video'] as ActionSchema, body as Record<string, unknown>);
    validateV26Params(body as Record<string, unknown>);
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

function validateV26Params(body: Record<string, unknown>): void {
  if (body.model !== V26_MODEL) return;
  if (body.enable_sound === true && body.mode !== 'pro') {
    throw new ValidationError(`enable_sound requires mode pro for ${V26_MODEL}`);
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
