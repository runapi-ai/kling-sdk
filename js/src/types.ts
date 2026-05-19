import type { AsyncTaskStatus } from '@runapi.ai/core';

export type KlingTextToVideoModel = 'kling-3.0' | 'kling-v2.5-turbo-text-to-video-pro';
export type KlingImageToVideoModel = 'kling-v2.5-turbo-image-to-video-pro';
export type KlingMode = 'std' | 'pro';
export type KlingAspectRatio = '16:9' | '9:16' | '1:1';
export type KlingDuration = string;

/** A single shot in a multi-shot text-to-video sequence. */
export interface MultiPromptItem {
  prompt: string;
  duration: number;
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
  duration?: KlingDuration;
  aspect_ratio?: KlingAspectRatio;
  mode?: KlingMode;
  kling_elements?: KlingElement[];
  callback_url?: string;
}

export interface Kling3TextToVideoSingleShotParams extends Kling3TextToVideoCommonParams {
  prompt: string;
  sound?: boolean;
  image_urls?: string[];
}

export interface Kling3TextToVideoMultiShotParams extends Kling3TextToVideoCommonParams {
  multi_shots: true;
  sound: true;
  multi_prompt: MultiPromptItem[];
  image_urls?: string[];
}

export interface V25TurboTextToVideoParams {
  model: 'kling-v2.5-turbo-text-to-video-pro';
  prompt: string;
  duration?: '5' | '10';
  aspect_ratio?: KlingAspectRatio;
  negative_prompt?: string;
  cfg_scale?: number;
  callback_url?: string;
}

export interface ImageToVideoParams {
  model: 'kling-v2.5-turbo-image-to-video-pro';
  prompt: string;
  image_url: string;
  duration?: '5' | '10';
  negative_prompt?: string;
  cfg_scale?: number;
  callback_url?: string;
}

export type TextToVideoParams =
  | Kling3TextToVideoSingleShotParams
  | Kling3TextToVideoMultiShotParams
  | V25TurboTextToVideoParams;

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

export type AiAvatarModel = 'kling-ai-avatar-pro' | 'kling-ai-avatar-standard';

export interface AiAvatarParams {
  model: AiAvatarModel;
  image_url: string;
  audio_url: string;
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
  input_urls: string[];
  video_urls: string[];
  prompt?: string;
  mode?: '720p' | '1080p';
  character_orientation?: 'video' | 'image';
  background_source?: 'input_video' | 'input_image';
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
