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
        image_url: 'https://example.com/flower.jpg',
        duration: '10',
      });

      expect(mockHttp.request).toHaveBeenCalledWith(
        'POST',
        '/api/v1/kling/image_to_video',
        {
          body: {
            model: 'kling-v2.5-turbo-image-to-video-pro',
            prompt: 'A flower blooming',
            image_url: 'https://example.com/flower.jpg',
            duration: '10',
          },
        }
      );
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
        videos: [{ url: 'https://example.com/video.mp4' }],
      };
      vi.mocked(mockHttp.request).mockResolvedValueOnce(mockResponse);

      const imageToVideo = new ImageToVideo(mockHttp);
      const result = await imageToVideo.get('task-123');

      expect(result.status).toBe('completed');
      expect(result.videos).toHaveLength(1);
      expect(result.videos?.[0].url).toBe('https://example.com/video.mp4');
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
        videos: [{ url: 'https://example.com/video.mp4' }],
      };

      vi.mocked(mockHttp.request)
        .mockResolvedValueOnce(createResponse)
        .mockResolvedValueOnce(processingResponse)
        .mockResolvedValueOnce(completedResponse);

      const imageToVideo = new ImageToVideo(mockHttp);
      const result = await imageToVideo.run({
        model: 'kling-v2.5-turbo-image-to-video-pro',
        prompt: 'A flower blooming',
        image_url: 'https://example.com/flower.jpg',
      });

      expect(result.status).toBe('completed');
      expect(result.videos).toHaveLength(1);
    });
  });
});
