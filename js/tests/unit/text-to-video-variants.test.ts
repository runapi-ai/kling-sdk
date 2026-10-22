import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TextToVideo } from '../../src/resources/text-to-video';
import type { HttpClient } from '@runapi.ai/core';
import type { TaskCreateResponse } from '../../src/types';

describe('TextToVideo', () => {
  const mockHttp: HttpClient = {
    request: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('create', () => {
    it('should send correct request for V3 Turbo text-to-video', async () => {
      const mockResponse: TaskCreateResponse = { id: 'task-v3-turbo' };
      vi.mocked(mockHttp.request).mockResolvedValueOnce(mockResponse);

      const textToVideo = new TextToVideo(mockHttp);
      await textToVideo.create({
        model: 'kling-v3-turbo-text-to-video',
        prompt: 'A silver train crossing a moonlit bridge',
        duration_seconds: 7,
        aspect_ratio: '16:9',
        output_resolution: '1080p',
      });

      expect(mockHttp.request).toHaveBeenCalledWith(
        'POST',
        '/api/v1/kling/text_to_video',
        {
          body: {
            model: 'kling-v3-turbo-text-to-video',
            prompt: 'A silver train crossing a moonlit bridge',
            duration_seconds: 7,
            aspect_ratio: '16:9',
            output_resolution: '1080p',
          },
        }
      );
    });

    it('sends Kling 2.6 text-to-video mode and sound fields', async () => {
      vi.mocked(mockHttp.request).mockResolvedValueOnce({ id: 'task-v26' });

      const textToVideo = new TextToVideo(mockHttp);
      await textToVideo.create({
        model: 'kling-v2.6',
        prompt: 'A paper boat crossing a rain puddle',
        mode: 'pro',
        duration_seconds: 10,
        enable_sound: true,
        aspect_ratio: '16:9',
      });

      expect(mockHttp.request).toHaveBeenCalledWith('POST', '/api/v1/kling/text_to_video', {
        body: {
          model: 'kling-v2.6',
          prompt: 'A paper boat crossing a rain puddle',
          mode: 'pro',
          duration_seconds: 10,
          enable_sound: true,
          aspect_ratio: '16:9',
        },
      });
    });

    it('sends Kling O1 reference images and video fields', async () => {
      vi.mocked(mockHttp.request).mockResolvedValueOnce({ id: 'task-o1' });

      const textToVideo = new TextToVideo(mockHttp);
      await textToVideo.create({
        model: 'kling-o1',
        prompt: 'Keep <<<image_1>>> beside <<<video_1>>>',
        reference_image_urls: ['https://cdn.runapi.ai/public/samples/portrait.jpg'],
        reference_video_url: 'https://cdn.runapi.ai/public/samples/video.mp4',
        reference_video_type: 'feature',
        preserve_reference_video_audio: true,
        duration_seconds: 5,
        enable_sound: false,
      });

      expect(mockHttp.request).toHaveBeenCalledWith('POST', '/api/v1/kling/text_to_video', {
        body: {
          model: 'kling-o1',
          prompt: 'Keep <<<image_1>>> beside <<<video_1>>>',
          reference_image_urls: ['https://cdn.runapi.ai/public/samples/portrait.jpg'],
          reference_video_url: 'https://cdn.runapi.ai/public/samples/video.mp4',
          reference_video_type: 'feature',
          preserve_reference_video_audio: true,
          duration_seconds: 5,
          enable_sound: false,
        },
      });
    });

    it('sends Kling V3 Omni text-to-video resolution and sound fields', async () => {
      vi.mocked(mockHttp.request).mockResolvedValueOnce({ id: 'task-v3-omni' });

      const textToVideo = new TextToVideo(mockHttp);
      await textToVideo.create({
        model: 'kling-v3-omni',
        prompt: 'A paper boat crossing a rain puddle',
        output_resolution: '1080p',
        duration_seconds: 10,
        enable_sound: true,
        aspect_ratio: '16:9',
      });

      expect(mockHttp.request).toHaveBeenCalledWith('POST', '/api/v1/kling/text_to_video', {
        body: {
          model: 'kling-v3-omni',
          prompt: 'A paper boat crossing a rain puddle',
          output_resolution: '1080p',
          duration_seconds: 10,
          enable_sound: true,
          aspect_ratio: '16:9',
        },
      });
    });

    it('should send correct request for V2.5 Turbo text-to-video', async () => {
      const mockResponse: TaskCreateResponse = { id: 'task-v25' };
      vi.mocked(mockHttp.request).mockResolvedValueOnce(mockResponse);

      const textToVideo = new TextToVideo(mockHttp);
      await textToVideo.create({
        model: 'kling-v2.5-turbo-text-to-video-pro',
        prompt: 'A sunset over the ocean',
        duration_seconds: 5,
        aspect_ratio: '16:9',
      });

      expect(mockHttp.request).toHaveBeenCalledWith(
        'POST',
        '/api/v1/kling/text_to_video',
        {
          body: {
            model: 'kling-v2.5-turbo-text-to-video-pro',
            prompt: 'A sunset over the ocean',
            duration_seconds: 5,
            aspect_ratio: '16:9',
          },
        }
      );
    });

    it('should send correct request for V2.1 Master text-to-video', async () => {
      const mockResponse: TaskCreateResponse = { id: 'task-v21-master' };
      vi.mocked(mockHttp.request).mockResolvedValueOnce(mockResponse);

      const textToVideo = new TextToVideo(mockHttp);
      await textToVideo.create({
        model: 'kling-v2.1-master-text-to-video',
        prompt: 'A cinematic paratrooper scene',
        duration_seconds: 10,
        aspect_ratio: '16:9',
        negative_prompt: 'blur',
        cfg_scale: 0.5,
      });

      expect(mockHttp.request).toHaveBeenCalledWith(
        'POST',
        '/api/v1/kling/text_to_video',
        {
          body: {
            model: 'kling-v2.1-master-text-to-video',
            prompt: 'A cinematic paratrooper scene',
            duration_seconds: 10,
            aspect_ratio: '16:9',
            negative_prompt: 'blur',
            cfg_scale: 0.5,
          },
        }
      );
    });
  });
});
