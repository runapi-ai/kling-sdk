import type { modelValues } from '../contract_gen';
import type { KlingDuration, KlingAspectRatio, KlingTextToVideoOutputResolution, KlingElement, MultiPromptItem, KlingV3TurboOutputResolution, KlingV26Mode, KlingO1ReferenceParams } from './common';

interface Kling3TextToVideoCommonParams {
  model: (typeof modelValues.textToVideo.KLING_3_0);
  /** Duration in seconds (3-15), default 5. */
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

/** Kling 3.0 custom multi-shot mode with optional sound. */
export interface Kling3TextToVideoMultiShotParams extends Kling3TextToVideoCommonParams {
  /** Must be true to activate multi-shot generation. */
  multi_shots: true;
  /** Generate synchronized audio for the video. */
  enable_sound?: boolean;
  /** Custom storyboard; defaults to custom only when multi_shots is true. */
  shot_type?: 'custom';
  /** 1-6 ordered shots. Each prompt allows 500 effective characters; each @element reference counts as 37. */
  multi_prompt: MultiPromptItem[];
  /** Opening frame image URL for the first shot. */
  first_frame_image_url?: string;
}

/** Kling 3.0 automatic storyboard from one prompt with optional sound. */
export interface Kling3TextToVideoAutomaticShotParams extends Kling3TextToVideoCommonParams {
  multi_shots: true;
  shot_type: 'automatic';
  prompt: string;
  enable_sound?: boolean;
  multi_prompt?: never;
  first_frame_image_url?: string;
}

/** V2.5 Turbo text-to-video: fast, high-quality generation with negative prompt and cfg_scale control. */
export interface V25TurboTextToVideoParams {
  model: (typeof modelValues.textToVideo.KLING_V2_5_TURBO_TEXT_TO_VIDEO_PRO);
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
  model: (typeof modelValues.textToVideo.KLING_V2_1_MASTER_TEXT_TO_VIDEO);
  prompt: string;
  duration_seconds?: 5 | 10;
  aspect_ratio?: KlingAspectRatio;
  negative_prompt?: string;
  cfg_scale?: number;
  callback_url?: string;
}

/** V3 Turbo text-to-video: prompt-driven 3-15 second clips at 720p or 1080p. */
export interface V3TurboTextToVideoParams {
  model: (typeof modelValues.textToVideo.KLING_V3_TURBO_TEXT_TO_VIDEO);
  prompt: string;
  /** Duration in seconds (3-15). */
  duration_seconds?: KlingDuration;
  aspect_ratio?: KlingAspectRatio;
  output_resolution?: KlingV3TurboOutputResolution;
  callback_url?: string;
}

/** Kling 2.6 text-to-video with standard/pro quality modes and optional sound in pro mode. */
export interface KlingV26TextToVideoParams {
  model: 'kling-v2.6';
  prompt: string;
  mode?: KlingV26Mode;
  duration_seconds?: 5 | 10;
  /** Generate synchronized audio; true requires mode pro. */
  enable_sound?: boolean;
  aspect_ratio?: KlingAspectRatio;
  callback_url?: string;
}

/** Kling O1 text-to-video with image and video references. */
export interface KlingO1TextToVideoParams extends KlingO1ReferenceParams {
  model: (typeof modelValues.textToVideo.KLING_O1);
  prompt: string;
  mode?: KlingV26Mode;
  duration_seconds?: 5;
  enable_sound?: false;
  aspect_ratio?: KlingAspectRatio;
  callback_url?: string;
}

/** Kling v3 Omni text-to-video with native 4K, synchronized sound, and flexible duration. */
export interface V3OmniTextToVideoParams {
  model: (typeof modelValues.textToVideo.KLING_V3_OMNI);
  prompt: string;
  output_resolution?: KlingTextToVideoOutputResolution;
  duration_seconds?: KlingDuration;
  enable_sound?: boolean;
  aspect_ratio?: KlingAspectRatio;
  callback_url?: string;
}

/** Kling v3 Omni reference generation from one to seven reference images. */
export interface V3OmniReferenceTextToVideoParams {
  model: (typeof modelValues.textToVideo.KLING_V3_OMNI_REFERENCE);
  prompt: string;
  reference_image_urls: string[];
  duration_seconds?: KlingDuration;
  output_resolution?: KlingTextToVideoOutputResolution;
  aspect_ratio: KlingAspectRatio;
  enable_sound?: boolean;
  callback_url?: string;
}

export type TextToVideoParams =
  | Kling3TextToVideoSingleShotParams
  | Kling3TextToVideoMultiShotParams
  | Kling3TextToVideoAutomaticShotParams
  | KlingV26TextToVideoParams
  | KlingO1TextToVideoParams
  | V25TurboTextToVideoParams
  | V21MasterTextToVideoParams
  | V3TurboTextToVideoParams
  | V3OmniTextToVideoParams
  | V3OmniReferenceTextToVideoParams;
