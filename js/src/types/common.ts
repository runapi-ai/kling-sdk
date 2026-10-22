import type { modelValues } from '../contract_gen';

/**
 * Text-to-video model variants. kling-3.0 supports multi-shot, sound, first/last frame images,
 * and Kling elements. V2.x models support negative prompts and cfg_scale instead.
 */
export type KlingTextToVideoModel =
  (typeof modelValues.textToVideo)[keyof typeof modelValues.textToVideo];

/** Earlier V2 image-to-video variants. V2.5 turbo and V2.1 pro support last-frame image control. */
export type KlingV2ImageToVideoModel =
  | (typeof modelValues.imageToVideo.KLING_V2_5_TURBO_IMAGE_TO_VIDEO_PRO)
  | (typeof modelValues.imageToVideo.KLING_V2_1_PRO)
  | (typeof modelValues.imageToVideo.KLING_V2_1_STANDARD)
  | (typeof modelValues.imageToVideo.KLING_V2_1_MASTER_IMAGE_TO_VIDEO);
export type KlingImageToVideoModel =
  (typeof modelValues.imageToVideo)[keyof typeof modelValues.imageToVideo];
/** Model variants for source-video editing. */
export type KlingEditVideoModel =
  (typeof modelValues.editVideo)[keyof typeof modelValues.editVideo];
/** Output resolution for text-to-video. 4k is highest quality but slowest. */
export type KlingTextToVideoOutputResolution = '720p' | '1080p' | '4k';
export type KlingV3TurboOutputResolution = '720p' | '1080p';
export type KlingAspectRatio = '16:9' | '9:16' | '1:1';
/** Duration in seconds. Range varies by model: 3-15 for kling-3.0, 5 or 10 for V2.x. */
export type KlingDuration = number;
export type KlingV26Mode = 'std' | 'pro';
export type KlingO1ReferenceVideoType = 'base' | 'feature';

/** A custom shot: 1-12 seconds; all shots sum to the total video duration. */
export interface MultiPromptItem {
  prompt: string;
  duration_seconds: number;
}

/** Named element (character, object, style) with reference image, video, or audio materials for generation consistency. */
export interface KlingElement {
  /** Element identifier used for prompt referencing. */
  name: string;
  /** Description of the element's visual characteristics. */
  description: string;
  /** Image or video URLs providing visual reference for the element. */
  element_input_urls?: string[];
  /** Video URLs providing motion reference for the element. */
  element_input_video_urls?: string[];
  /** Audio URLs providing voice or sound reference for the element. */
  element_input_audio_urls?: string[];
  /** Start time in milliseconds for video element capture. */
  start_time?: number;
  /** End time in milliseconds for video element capture; must be 3000-8000 ms after start_time. */
  end_time?: number;
}

export interface KlingO1ReferenceParams {
  /** Ordered public HTTP(S) image references; use matching `<<<image_N>>>` markers in prompt. */
  reference_image_urls?: string[];
  /** Public HTTP(S) MP4 or MOV reference video; use `<<<video_1>>>` in prompt. */
  reference_video_url?: string;
  /** Base edit or feature reference; defaults to base. */
  reference_video_type?: KlingO1ReferenceVideoType;
  /** Preserve audio from the reference video. */
  preserve_reference_video_audio?: boolean;
}
