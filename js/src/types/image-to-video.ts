import type { modelValues } from '../contract_gen';
import type { KlingV2ImageToVideoModel, KlingDuration, KlingV3TurboOutputResolution, KlingV26Mode, KlingAspectRatio, KlingO1ReferenceParams, KlingTextToVideoOutputResolution } from './common';

/**
 * Earlier V2 image-to-video parameters. A first-frame image is required; the model
 * animates it into video guided by the text prompt. last_frame_image_url is supported
 * on V2.5 turbo and V2.1 pro.
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
  model: (typeof modelValues.imageToVideo.KLING_V3_TURBO_IMAGE_TO_VIDEO);
  prompt: string;
  first_frame_image_url: string;
  duration_seconds?: KlingDuration;
  output_resolution?: KlingV3TurboOutputResolution;
  callback_url?: string;
}

/** Kling 2.6 image-to-video with optional sound and final-frame control in pro mode. */
export interface KlingV26ImageToVideoParams {
  model: 'kling-v2.6';
  prompt: string;
  first_frame_image_url: string;
  /** Final frame URL; requires mode pro and duration_seconds 5. */
  last_frame_image_url?: string;
  mode?: KlingV26Mode;
  duration_seconds?: 5 | 10;
  /** Generate synchronized audio; true requires mode pro. */
  enable_sound?: boolean;
  aspect_ratio?: KlingAspectRatio;
  callback_url?: string;
}

/** Kling O1 image-to-video with a first frame plus either a final frame or reference media. */
export interface KlingO1ImageToVideoParams extends KlingO1ReferenceParams {
  model: (typeof modelValues.imageToVideo.KLING_O1);
  prompt: string;
  first_frame_image_url: string;
  /** Final frame URL; cannot be combined with reference_image_urls or reference_video_url. */
  last_frame_image_url?: string;
  mode?: KlingV26Mode;
  duration_seconds?: 5;
  enable_sound?: false;
  aspect_ratio?: KlingAspectRatio;
  callback_url?: string;
}

/** Kling v3 Omni image-to-video from caller-owned first and optional final frames. */
export interface V3OmniImageToVideoParams {
  model: (typeof modelValues.imageToVideo.KLING_V3_OMNI);
  prompt: string;
  first_frame_image_url: string;
  /** Final frame image URL; requires duration_seconds 5. */
  last_frame_image_url?: string;
  output_resolution?: KlingTextToVideoOutputResolution;
  duration_seconds?: KlingDuration;
  enable_sound?: boolean;
  aspect_ratio?: KlingAspectRatio;
  callback_url?: string;
}

export type ImageToVideoParams =
  | V2ImageToVideoParams
  | KlingV26ImageToVideoParams
  | KlingO1ImageToVideoParams
  | V3TurboImageToVideoParams
  | V3OmniImageToVideoParams;
