import type { AsyncTaskStatus } from '@runapi.ai/core';

export type KlingTextToVideoModel =
  | 'kling-3.0'
  | 'kling-v2.5-turbo-text-to-video-pro'
  | 'kling-v2.1-master-text-to-video';
export type KlingImageToVideoModel =
  | 'kling-v2.5-turbo-image-to-video-pro'
  | 'kling-v2.1-pro'
  | 'kling-v2.1-standard'
  | 'kling-v2.1-master-image-to-video';
export type KlingTextToVideoOutputResolution = '720p' | '1080p' | '4k';
export type KlingAspectRatio = '16:9' | '9:16' | '1:1';
export type KlingDuration = number;

/** A single shot in a multi-shot text-to-video sequence. */
export interface MultiPromptItem {
  prompt: string;
  duration_seconds: number;
}

/** Element reference for subject/style guidance. */
export interface KlingElement {
  name: string;
  description: string;
  element_input_urls?: string[];
  element_input_video_urls?: string[];
}

interface Kling3TextToVideoCommonParams {
  model: 'kling-3.0';
  duration_seconds?: KlingDuration;
  aspect_ratio?: KlingAspectRatio;
  output_resolution?: KlingTextToVideoOutputResolution;
  kling_elements?: KlingElement[];
  callback_url?: string;
}

export interface Kling3TextToVideoSingleShotParams extends Kling3TextToVideoCommonParams {
  prompt: string;
  enable_sound?: boolean;
  first_frame_image_url?: string;
  last_frame_image_url?: string;
}

export interface Kling3TextToVideoMultiShotParams extends Kling3TextToVideoCommonParams {
  multi_shots: true;
  enable_sound: true;
  multi_prompt: MultiPromptItem[];
  first_frame_image_url?: string;
}

export interface V25TurboTextToVideoParams {
  model: 'kling-v2.5-turbo-text-to-video-pro';
  prompt: string;
  duration_seconds?: 5 | 10;
  aspect_ratio?: KlingAspectRatio;
  negative_prompt?: string;
  cfg_scale?: number;
  callback_url?: string;
}

export interface V21MasterTextToVideoParams {
  model: 'kling-v2.1-master-text-to-video';
  prompt: string;
  duration_seconds?: 5 | 10;
  aspect_ratio?: KlingAspectRatio;
  negative_prompt?: string;
  cfg_scale?: number;
  callback_url?: string;
}

export interface ImageToVideoParams {
  model: KlingImageToVideoModel;
  prompt: string;
  first_frame_image_url: string;
  duration_seconds?: 5 | 10;
  negative_prompt?: string;
  cfg_scale?: number;
  last_frame_image_url?: string;
  callback_url?: string;
}

export type TextToVideoParams =
  | Kling3TextToVideoSingleShotParams
  | Kling3TextToVideoMultiShotParams
  | V25TurboTextToVideoParams
  | V21MasterTextToVideoParams;

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

export type AiAvatarModel =
  | 'kling-ai-avatar-pro'
  | 'kling-ai-avatar-standard'
  | 'kling-ai-avatar-v1-pro'
  | 'kling-v1-avatar-standard';

export interface AiAvatarParams {
  model: AiAvatarModel;
  source_image_url: string;
  source_audio_url: string;
  prompt: string;
  callback_url?: string;
}

export interface AiAvatarResponse extends AsyncTaskResponse {
  videos?: VideoMetadata[];
  error?: string;
  [key: string]: unknown;
}

export interface MotionControlParams {
  model: 'kling-3.0';
  source_image_url: string;
  reference_video_url: string;
  prompt?: string;
  output_resolution?: '720p' | '1080p';
  character_orientation?: 'video' | 'image';
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
