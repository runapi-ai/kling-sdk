import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ImageToVideo } from '../../src/resources/image-to-video';
import type { HttpClient } from '@runapi.ai/core';
import type { ImageToVideoResponse, TaskCreateResponse } from '../../src/types';

describe('ImageToVideo', () => {
  const mockHttp: HttpClient = {
    request: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('create', () => {
    it('should send correct request for image-to-video', async () => {
      const mockResponse: TaskCreateResponse = { id: 'task-456' };
      vi.mocked(mockHttp.request).mockResolvedValueOnce(mockResponse);

      const imageToVideo = new ImageToVideo(mockHttp);
      await imageToVideo.create({
        model: 'kling-v2.5-turbo-image-to-video-pro',
        prompt: 'A flower blooming',
        first_frame_image_url: 'https://cdn.runapi.ai/public/samples/image-to-video.jpg',
        last_frame_image_url: 'https://cdn.runapi.ai/public/samples/last-frame.jpg',
        duration_seconds: 10,
      });

      expect(mockHttp.request).toHaveBeenCalledWith(
        'POST',
        '/api/v1/kling/image_to_video',
        {
          body: {
            model: 'kling-v2.5-turbo-image-to-video-pro',
            prompt: 'A flower blooming',
            first_frame_image_url: 'https://cdn.runapi.ai/public/samples/image-to-video.jpg',
            last_frame_image_url: 'https://cdn.runapi.ai/public/samples/last-frame.jpg',
            duration_seconds: 10,
          },
        }
      );
    });

    it('should send correct request for V2.1 Pro image-to-video', async () => {
      const mockResponse: TaskCreateResponse = { id: 'task-v21' };
      vi.mocked(mockHttp.request).mockResolvedValueOnce(mockResponse);

      const imageToVideo = new ImageToVideo(mockHttp);
      await imageToVideo.create({
        model: 'kling-v2.1-pro',
        prompt: 'Animate this frame',
        first_frame_image_url: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Golde33443.jpg',
        last_frame_image_url: 'https://cdn.runapi.ai/public/samples/last-frame.jpg',
        duration_seconds: 10,
      });

      expect(mockHttp.request).toHaveBeenCalledWith(
        'POST',
        '/api/v1/kling/image_to_video',
        {
          body: {
            model: 'kling-v2.1-pro',
            prompt: 'Animate this frame',
            first_frame_image_url: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Golde33443.jpg',
            last_frame_image_url: 'https://cdn.runapi.ai/public/samples/last-frame.jpg',
            duration_seconds: 10,
          },
        }
      );
    });

    it('should send correct request for V3 Turbo image-to-video', async () => {
      const mockResponse: TaskCreateResponse = { id: 'task-v3-i2v' };
      vi.mocked(mockHttp.request).mockResolvedValueOnce(mockResponse);

      const imageToVideo = new ImageToVideo(mockHttp);
      await imageToVideo.create({
        model: 'kling-v3-turbo-image-to-video',
        prompt: 'Camera glides toward the lighthouse',
        first_frame_image_url: 'https://cdn.runapi.ai/public/samples/image-to-video.jpg',
        duration_seconds: 7,
        output_resolution: '720p',
      });

      expect(mockHttp.request).toHaveBeenCalledWith(
        'POST',
        '/api/v1/kling/image_to_video',
        {
          body: {
            model: 'kling-v3-turbo-image-to-video',
            prompt: 'Camera glides toward the lighthouse',
            first_frame_image_url: 'https://cdn.runapi.ai/public/samples/image-to-video.jpg',
            duration_seconds: 7,
            output_resolution: '720p',
          },
        }
      );
    });

    it('rejects unsupported V3 Turbo image-to-video fields', async () => {
      const imageToVideo = new ImageToVideo(mockHttp);

      await expect(
        imageToVideo.create({
          model: 'kling-v3-turbo-image-to-video',
          prompt: 'Camera glides toward the lighthouse',
          first_frame_image_url: 'https://cdn.runapi.ai/public/samples/image-to-video.jpg',
          last_frame_image_url: 'https://cdn.runapi.ai/public/samples/last-frame.jpg',
        } as never)
      ).rejects.toThrow('last_frame_image_url is not supported by kling-v3-turbo-image-to-video');
      expect(mockHttp.request).not.toHaveBeenCalled();
    });

    it('sends Kling 2.6 image-to-video mode, sound, and final frame fields', async () => {
      vi.mocked(mockHttp.request).mockResolvedValueOnce({ id: 'task-v26-i2v' });

      const imageToVideo = new ImageToVideo(mockHttp);
      await imageToVideo.create({
        model: 'kling-v2.6',
        prompt: 'Camera follows the cyclist through fog',
        first_frame_image_url: 'https://cdn.runapi.ai/public/samples/image-to-video.jpg',
        last_frame_image_url: 'https://cdn.runapi.ai/public/samples/last-frame.jpg',
        mode: 'pro',
        duration_seconds: 5,
        enable_sound: true,
        aspect_ratio: '16:9',
      });

      expect(mockHttp.request).toHaveBeenCalledWith('POST', '/api/v1/kling/image_to_video', {
        body: {
          model: 'kling-v2.6',
          prompt: 'Camera follows the cyclist through fog',
          first_frame_image_url: 'https://cdn.runapi.ai/public/samples/image-to-video.jpg',
          last_frame_image_url: 'https://cdn.runapi.ai/public/samples/last-frame.jpg',
          mode: 'pro',
          duration_seconds: 5,
          enable_sound: true,
          aspect_ratio: '16:9',
        },
      });
    });

    it('rejects Kling 2.6 sound outside pro mode', async () => {
      const imageToVideo = new ImageToVideo(mockHttp);

      await expect(
        imageToVideo.create({
          model: 'kling-v2.6',
          prompt: 'Camera follows the cyclist through fog',
          first_frame_image_url: 'https://cdn.runapi.ai/public/samples/image-to-video.jpg',
          enable_sound: true,
        })
      ).rejects.toThrow('enable_sound requires mode pro for kling-v2.6');
      expect(mockHttp.request).not.toHaveBeenCalled();
    });

    it('rejects Kling 2.6 final frames outside pro five-second requests', async () => {
      const imageToVideo = new ImageToVideo(mockHttp);
      const baseParams = {
        model: 'kling-v2.6' as const,
        prompt: 'Camera follows the cyclist through fog',
        first_frame_image_url: 'https://cdn.runapi.ai/public/samples/image-to-video.jpg',
        last_frame_image_url: 'https://cdn.runapi.ai/public/samples/last-frame.jpg',
      };

      await expect(imageToVideo.create(baseParams)).rejects.toThrow(
        'last_frame_image_url requires mode pro for kling-v2.6'
      );
      await expect(
        imageToVideo.create({ ...baseParams, mode: 'pro', duration_seconds: 10 })
      ).rejects.toThrow('last_frame_image_url requires duration_seconds 5 for kling-v2.6');
      expect(mockHttp.request).not.toHaveBeenCalled();
    });

    it('sends Kling V3 Omni image-to-video resolution, sound, and final frame fields', async () => {
      vi.mocked(mockHttp.request).mockResolvedValueOnce({ id: 'task-v3-omni-i2v' });

      const imageToVideo = new ImageToVideo(mockHttp);
      await imageToVideo.create({
        model: 'kling-v3-omni',
        prompt: 'Camera follows the cyclist through fog',
        first_frame_image_url: 'https://cdn.runapi.ai/public/samples/portrait.jpg',
        last_frame_image_url: 'https://cdn.runapi.ai/public/samples/image.jpg',
        output_resolution: '4k',
        duration_seconds: 5,
        enable_sound: false,
        aspect_ratio: '9:16',
      });

      expect(mockHttp.request).toHaveBeenCalledWith('POST', '/api/v1/kling/image_to_video', {
        body: {
          model: 'kling-v3-omni',
          prompt: 'Camera follows the cyclist through fog',
          first_frame_image_url: 'https://cdn.runapi.ai/public/samples/portrait.jpg',
          last_frame_image_url: 'https://cdn.runapi.ai/public/samples/image.jpg',
          output_resolution: '4k',
          duration_seconds: 5,
          enable_sound: false,
          aspect_ratio: '9:16',
        },
      });
    });

    it('rejects Kling V3 Omni final frames outside five-second requests', async () => {
      const imageToVideo = new ImageToVideo(mockHttp);

      await expect(
        imageToVideo.create({
          model: 'kling-v3-omni',
          prompt: 'Camera follows the cyclist through fog',
          first_frame_image_url: 'https://cdn.runapi.ai/public/samples/portrait.jpg',
          last_frame_image_url: 'https://cdn.runapi.ai/public/samples/image.jpg',
          duration_seconds: 7,
        })
      ).rejects.toThrow('last_frame_image_url requires duration_seconds 5 for kling-v3-omni');
      expect(mockHttp.request).not.toHaveBeenCalled();
    });

    it('sends Kling O1 first-frame and reference-image fields', async () => {
      vi.mocked(mockHttp.request).mockResolvedValueOnce({ id: 'task-o1-i2v' });

      const imageToVideo = new ImageToVideo(mockHttp);
      await imageToVideo.create({
        model: 'kling-o1',
        prompt: 'Move from the opening frame toward <<<image_1>>>',
        first_frame_image_url: 'https://cdn.runapi.ai/public/samples/image-to-video.jpg',
        reference_image_urls: ['https://cdn.runapi.ai/public/samples/portrait.jpg'],
        mode: 'pro',
        duration_seconds: 5,
      });

      expect(mockHttp.request).toHaveBeenCalledWith('POST', '/api/v1/kling/image_to_video', {
        body: {
          model: 'kling-o1',
          prompt: 'Move from the opening frame toward <<<image_1>>>',
          first_frame_image_url: 'https://cdn.runapi.ai/public/samples/image-to-video.jpg',
          reference_image_urls: ['https://cdn.runapi.ai/public/samples/portrait.jpg'],
          mode: 'pro',
          duration_seconds: 5,
        },
      });
    });

    it('rejects Kling O1 tail frames combined with reference media', async () => {
      const imageToVideo = new ImageToVideo(mockHttp);

      await expect(
        imageToVideo.create({
          model: 'kling-o1',
          prompt: 'Move from the opening frame toward <<<image_1>>>',
          first_frame_image_url: 'https://cdn.runapi.ai/public/samples/image-to-video.jpg',
          last_frame_image_url: 'https://cdn.runapi.ai/public/samples/last-frame.jpg',
          reference_image_urls: ['https://cdn.runapi.ai/public/samples/portrait.jpg'],
        })
      ).rejects.toThrow(
        'last_frame_image_url cannot be combined with reference_image_urls or reference_video_url'
      );
      expect(mockHttp.request).not.toHaveBeenCalled();
    });

    it('rejects Kling O1 base video references combined with frame inputs', async () => {
      const imageToVideo = new ImageToVideo(mockHttp);

      await expect(
        imageToVideo.create({
          model: 'kling-o1',
          prompt: 'Use <<<video_1>>> as the base',
          first_frame_image_url: 'https://cdn.runapi.ai/public/samples/image-to-video.jpg',
          reference_video_url: 'https://cdn.runapi.ai/public/samples/video.mp4',
          reference_video_type: 'base',
        })
      ).rejects.toThrow(
        'reference_video_type base cannot be combined with first_frame_image_url or last_frame_image_url'
      );
      expect(mockHttp.request).not.toHaveBeenCalled();
    });

  });

  describe('get', () => {
    it('should fetch task status by ID', async () => {
      const mockResponse: ImageToVideoResponse = {
        id: 'task-123',
        status: 'processing',
        model: 'kling-v2.5-turbo-image-to-video-pro',
      };
      vi.mocked(mockHttp.request).mockResolvedValueOnce(mockResponse);

      const imageToVideo = new ImageToVideo(mockHttp);
      const result = await imageToVideo.get('task-123');

      expect(mockHttp.request).toHaveBeenCalledWith(
        'GET',
        '/api/v1/kling/image_to_video/task-123',
        {}
      );
      expect(result).toEqual(mockResponse);
    });

    it('should return completed status with videos', async () => {
      const mockResponse: ImageToVideoResponse = {
        id: 'task-123',
        status: 'completed',
        model: 'kling-v2.5-turbo-image-to-video-pro',
        videos: [{ url: 'https://cdn.runapi.ai/public/samples/video.mp4' }],
      };
      vi.mocked(mockHttp.request).mockResolvedValueOnce(mockResponse);

      const imageToVideo = new ImageToVideo(mockHttp);
      const result = await imageToVideo.get('task-123');

      expect(result.status).toBe('completed');
      expect(result.videos).toHaveLength(1);
      expect(result.videos?.[0].url).toBe('https://cdn.runapi.ai/public/samples/video.mp4');
    });

    it('should return failed status with error', async () => {
      const mockResponse: ImageToVideoResponse = {
        id: 'task-123',
        status: 'failed',
        model: 'kling-v2.5-turbo-image-to-video-pro',
        error: 'Task failed',
      };
      vi.mocked(mockHttp.request).mockResolvedValueOnce(mockResponse);

      const imageToVideo = new ImageToVideo(mockHttp);
      const result = await imageToVideo.get('task-123');

      expect(result.status).toBe('failed');
      expect(result.error).toBe('Task failed');
    });
  });

  describe('run', () => {
    it('should create and poll until completion', async () => {
      const createResponse: TaskCreateResponse = { id: 'task-123' };
      const processingResponse: ImageToVideoResponse = {
        id: 'task-123',
        status: 'processing',
        model: 'kling-v2.5-turbo-image-to-video-pro',
      };
      const completedResponse: ImageToVideoResponse = {
        id: 'task-123',
        status: 'completed',
        model: 'kling-v2.5-turbo-image-to-video-pro',
        videos: [{ url: 'https://cdn.runapi.ai/public/samples/video.mp4' }],
      };

      vi.mocked(mockHttp.request)
        .mockResolvedValueOnce(createResponse)
        .mockResolvedValueOnce(processingResponse)
        .mockResolvedValueOnce(completedResponse);

      const imageToVideo = new ImageToVideo(mockHttp);
      const result = await imageToVideo.run({
        model: 'kling-v2.5-turbo-image-to-video-pro',
        prompt: 'A flower blooming',
        first_frame_image_url: 'https://cdn.runapi.ai/public/samples/image-to-video.jpg',
      });

      expect(result.status).toBe('completed');
      expect(result.videos).toHaveLength(1);
    });
  });
});
