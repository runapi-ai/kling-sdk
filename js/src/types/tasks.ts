import type { AsyncTaskStatus, TaskResponse } from '@runapi.ai/core';
import type { modelValues } from '../contract_gen';
import type { KlingEditVideoModel, KlingDuration, KlingTextToVideoOutputResolution, KlingAspectRatio } from './common';

/** Continue a completed Kling V2.5 Turbo video task. */
export interface KlingExtendVideoParams {
  source_task_id: string;
  mode?: 'std' | 'pro';
  prompt?: string;
  callback_url?: string;
}

/** Parameters for Kling v3 Omni source-video editing. */
export interface EditVideoParams {
  model: KlingEditVideoModel;
  /** Video description prompt. */
  prompt: string;
  /** Caller-owned source video URL. Mutually exclusive with source_task_id. */
  source_video_url?: string;
  /** Completed compatible RunAPI task ID. Mutually exclusive with source_video_url. */
  source_task_id?: string;
  /** Ordered reference image URLs. */
  reference_image_urls?: string[];
  /** Output duration in seconds. Source-only requests use five seconds. */
  duration_seconds?: KlingDuration;
  /** Output resolution. */
  output_resolution?: KlingTextToVideoOutputResolution;
  /** Output aspect ratio. Source-only requests use auto. */
  aspect_ratio?: KlingAspectRatio | 'auto';
  /** Enable synchronized sound generation. */
  enable_sound?: boolean;
  /** URL for completion callback notifications. */
  callback_url?: string;
}

export interface AsyncTaskResponse extends TaskResponse {
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
  (typeof modelValues.avatar)[keyof typeof modelValues.avatar];

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

export type MotionControlModel =
  (typeof modelValues.motionControl)[keyof typeof modelValues.motionControl];

interface MotionControlCommonParams {
  /** Subject image URL whose appearance is preserved. */
  source_image_url: string;
  /** Reference video URL whose motion patterns are transferred (Kling 2.6: 3-10 seconds with image orientation or 3-30 seconds with video orientation). */
  reference_video_url: string;
  /** Optional description prompt. */
  prompt?: string;
  callback_url?: string;
}

/** Kling 3.0 motion transfer with explicit resolution and optional character orientation. */
export interface Kling3MotionControlParams extends MotionControlCommonParams {
  model: (typeof modelValues.motionControl.KLING_3_0);
  output_resolution: '720p' | '1080p';
  /** Whether the character faces the direction from the video or the image. */
  character_orientation?: 'video' | 'image';
}

/** Kling 2.6 motion transfer with explicit resolution and character orientation. */
export interface KlingV26MotionControlParams extends MotionControlCommonParams {
  model: (typeof modelValues.motionControl.KLING_V2_6);
  output_resolution: '720p' | '1080p';
  character_orientation: 'video' | 'image';
}

export type MotionControlParams = Kling3MotionControlParams | KlingV26MotionControlParams;

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
