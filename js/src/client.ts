import { BaseClient, type ClientOptions } from '@runapi.ai/core';
import { TextToVideo } from './resources/text-to-video';
import { ImageToVideo } from './resources/image-to-video';
import { AiAvatar } from './resources/ai-avatar';
import { MotionControl } from './resources/motion-control';
import { ExtendVideo } from './resources/extend-video';
import { EditVideo } from './resources/edit-video';

/**
 * Kling video generation, AI avatar lip-sync, and motion control API client.
 *
 * @example
 * ```typescript
 * const client = new KlingClient({ apiKey: 'your-api-key' });
 *
 * const result = await client.textToVideo.run({
 *   model: 'kling-3.0',
 *   prompt: 'A cat walking through a garden',
 * });
 * ```
 */
export class KlingClient extends BaseClient {
  /** Text-to-video generation with multi-shot, sound, and Kling elements support on kling-3.0. */
  public readonly textToVideo: TextToVideo;
  /** Image-to-video animation from a first-frame image guided by a text prompt. */
  public readonly imageToVideo: ImageToVideo;
  /** AI avatar lip-sync: animate a face image to match an audio track. */
  public readonly aiAvatar: AiAvatar;
  /** Transfer motion from a reference video onto a subject image. */
  public readonly motionControl: MotionControl;
  public readonly extendVideo: ExtendVideo;
  /** Edit a source video with the selected Kling v3 Omni model. */
  public readonly editVideo: EditVideo;

  constructor(options: ClientOptions = {}) {
    super(options);
    this.textToVideo = new TextToVideo(this.http);
    this.imageToVideo = new ImageToVideo(this.http);
    this.aiAvatar = new AiAvatar(this.http);
    this.motionControl = new MotionControl(this.http);
    this.extendVideo = new ExtendVideo(this.http);
    this.editVideo = new EditVideo(this.http);
  }
}
