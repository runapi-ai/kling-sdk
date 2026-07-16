import type { AsyncTaskStatus } from '@runapi.ai/core';

/**
 * Text-to-video model variants. kling-3.0 supports multi-shot, sound, first/last frame images,
 * and Kling elements. V2.x models support negative prompts and cfg_scale instead.
 */
export type KlingTextToVideoModel =
  | 'kling-3.0'
  | 'kling-v3-turbo-text-to-video'
  | 'kling-v2.5-turbo-text-to-video-pro'
  | 'kling-v2.1-master-text-to-video';

/**
 * Image-to-video model variants. V2.5 turbo and V2.1 pro support last-frame image control.
 */
export type KlingV2ImageToVideoModel =
  | 'kling-v2.5-turbo-image-to-video-pro'
  | 'kling-v2.1-pro'
  | 'kling-v2.1-standard'
  | 'kling-v2.1-master-image-to-video';
export type KlingImageToVideoModel = KlingV2ImageToVideoModel | 'kling-v3-turbo-image-to-video';

/** Output resolution for text-to-video. 4k is highest quality but slowest. */
export type KlingTextToVideoOutputResolution = '720p' | '1080p' | '4k';
export type KlingV3TurboOutputResolution = '720p' | '1080p';
export type KlingAspectRatio = '16:9' | '9:16' | '1:1';
/** Duration in seconds. Range varies by model: 3-15 for kling-3.0, 5 or 10 for V2.x. */
export type KlingDuration = number;

/** A single shot in a multi-shot text-to-video sequence. */
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

interface Kling3TextToVideoCommonParams {
  model: 'kling-3.0';
  /** Duration in seconds (3-15). */
  duration_seconds?: KlingDuration;
  aspect_ratio?: KlingAspectRatio;
  output_resolution?: KlingTextToVideoOutputResolution;
  /** Visual elements for subject/style consistency across the video. */
  kling_elements?: KlingElement[];
  /** URL for completion callback notifications. */
  callback_url?: string;
}

/** Kling 3.0 single-shot text-to-video with optional sound and first/last frame control. */
export interface Kling3TextToVideoSingleShotParams extends Kling3TextToVideoCommonParams {
  /** Video description prompt. */
  prompt: string;
  /** Generate synchronized audio for the video. */
  enable_sound?: boolean;
  /** Opening frame image URL; overrides the generated first frame. */
  first_frame_image_url?: string;
  /** Closing frame image URL; only available in single-shot mode. */
  last_frame_image_url?: string;
}

/** Kling 3.0 multi-shot mode: stitch multiple prompted segments into one video with sound. */
export interface Kling3TextToVideoMultiShotParams extends Kling3TextToVideoCommonParams {
  /** Must be true to activate multi-shot generation. */
  multi_shots: true;
  /** Must be true; sound is always generated in multi-shot mode. */
  enable_sound: true;
  /** Ordered shot segments, each with its own prompt and duration. */
  multi_prompt: MultiPromptItem[];
  /** Opening frame image URL for the first shot. */
  first_frame_image_url?: string;
}

/** V2.5 Turbo text-to-video: fast, high-quality generation with negative prompt and cfg_scale control. */
export interface V25TurboTextToVideoParams {
  model: 'kling-v2.5-turbo-text-to-video-pro';
  prompt: string;
  /** Duration: 5 or 10 seconds. */
  duration_seconds?: 5 | 10;
  aspect_ratio?: KlingAspectRatio;
  /** Elements to exclude from the generated video. */
  negative_prompt?: string;
  /** Prompt adherence strength (higher = more literal). */
  cfg_scale?: number;
  callback_url?: string;
}

/** V2.1 Master text-to-video: highest V2.1 quality with negative prompt and cfg_scale control. */
export interface V21MasterTextToVideoParams {
  model: 'kling-v2.1-master-text-to-video';
  prompt: string;
  duration_seconds?: 5 | 10;
  aspect_ratio?: KlingAspectRatio;
  negative_prompt?: string;
  cfg_scale?: number;
  callback_url?: string;
}

/** V3 Turbo text-to-video: prompt-driven 3-15 second clips at 720p or 1080p. */
export interface V3TurboTextToVideoParams {
  model: 'kling-v3-turbo-text-to-video';
  prompt: string;
  /** Duration in seconds (3-15). */
  duration_seconds?: KlingDuration;
  aspect_ratio?: KlingAspectRatio;
  output_resolution?: KlingV3TurboOutputResolution;
  callback_url?: string;
}

/**
 * Image-to-video generation parameters. A first-frame image is required; the model
 * animates it into video guided by the text prompt. last_frame_image_url is supported
 * on V2.5 turbo and V2.1 pro models only.
 */
export interface V2ImageToVideoParams {
  model: KlingV2ImageToVideoModel;
  /** Video motion description prompt. */
  prompt: string;
  /** Source image URL used as the video's opening frame. */
  first_frame_image_url: string;
  duration_seconds?: 5 | 10;
  negative_prompt?: string;
  cfg_scale?: number;
  /** Target ending frame image URL; supported on V2.5 turbo and V2.1 pro. */
  last_frame_image_url?: string;
  callback_url?: string;
}

/** V3 Turbo image-to-video: animate one first-frame image at 720p or 1080p. */
export interface V3TurboImageToVideoParams {
  model: 'kling-v3-turbo-image-to-video';
  prompt: string;
  first_frame_image_url: string;
  duration_seconds?: KlingDuration;
  output_resolution?: KlingV3TurboOutputResolution;
  callback_url?: string;
}

export type TextToVideoParams =
  | Kling3TextToVideoSingleShotParams
  | Kling3TextToVideoMultiShotParams
  | V25TurboTextToVideoParams
  | V21MasterTextToVideoParams
  | V3TurboTextToVideoParams;

export type ImageToVideoParams = V2ImageToVideoParams | V3TurboImageToVideoParams;

export interface AsyncTaskResponse {
  id: string;
  status: AsyncTaskStatus;
}

export interface TaskCreateResponse {
  id: string;
}

export interface VideoMetadata {
  url: string;
}

export interface TextToVideoResponse extends AsyncTaskResponse {
  videos?: VideoMetadata[];
  error?: string;
  [key: string]: unknown;
}

export interface ImageToVideoResponse extends AsyncTaskResponse {
  videos?: VideoMetadata[];
  error?: string;
  [key: string]: unknown;
}

/**
 * AI avatar quality tier. Pro models produce the most natural lip movements;
 * Standard models are faster with slightly less refined lip sync.
 */
export type AiAvatarModel =
  | 'kling-ai-avatar-pro'
  | 'kling-ai-avatar-standard'
  | 'kling-ai-avatar-v1-pro'
  | 'kling-v1-avatar-standard';

/** Lip-sync a face image to an audio track, producing a talking-head video. */
export interface AiAvatarParams {
  model: AiAvatarModel;
  /** Face image URL; the face will be animated to match the audio. */
  source_image_url: string;
  /** Audio URL for lip synchronization. */
  source_audio_url: string;
  /** Description of the avatar's appearance and context. */
  prompt: string;
  callback_url?: string;
}

export interface AiAvatarResponse extends AsyncTaskResponse {
  videos?: VideoMetadata[];
  error?: string;
  [key: string]: unknown;
}

/**
 * Transfer motion from a reference video onto a subject image. The subject adopts
 * the movement patterns from the reference while preserving its own appearance.
 */
export interface MotionControlParams {
  model: 'kling-3.0';
  /** Subject image URL whose appearance is preserved. */
  source_image_url: string;
  /** Reference video URL whose motion patterns are transferred. */
  reference_video_url: string;
  /** Optional description prompt. */
  prompt?: string;
  output_resolution?: '720p' | '1080p';
  /** Whether the character faces the direction from the video or the image. */
  character_orientation?: 'video' | 'image';
  /** Whether the background comes from the video or the image. */
  background_source?: 'video' | 'image';
  callback_url?: string;
}

export interface MotionControlResponse extends AsyncTaskResponse {
  videos?: VideoMetadata[];
  error?: string;
  [key: string]: unknown;
}

export type CompletedTextToVideoResponse = TextToVideoResponse & {
  status: 'completed';
  videos: VideoMetadata[];
};

export type CompletedImageToVideoResponse = ImageToVideoResponse & {
  status: 'completed';
  videos: VideoMetadata[];
};

export type CompletedAiAvatarResponse = AiAvatarResponse & {
  status: 'completed';
  videos: VideoMetadata[];
};

export type CompletedMotionControlResponse = MotionControlResponse & {
  status: 'completed';
  videos: VideoMetadata[];
};
