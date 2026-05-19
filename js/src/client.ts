import { createHttpClient, type ClientOptions } from '@runapi.ai/core';
import { TextToVideo } from './resources/text-to-video';
import { ImageToVideo } from './resources/image-to-video';
import { AiAvatar } from './resources/ai-avatar';
import { MotionControl } from './resources/motion-control';

/** Kling video API client. */
export class KlingClient {
  /** Text-to-video operations. */
  public readonly textToVideo: TextToVideo;
  /** Image-to-video operations. */
  public readonly imageToVideo: ImageToVideo;
  /** AI avatar operations. */
  public readonly aiAvatar: AiAvatar;
  /** Motion control operations. */
  public readonly motionControl: MotionControl;

  constructor(options: ClientOptions = {}) {
    const http = createHttpClient(options);
    this.textToVideo = new TextToVideo(http);
    this.imageToVideo = new ImageToVideo(http);
    this.aiAvatar = new AiAvatar(http);
    this.motionControl = new MotionControl(http);
  }
}
