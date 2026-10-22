import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TextToVideo } from '../../src/resources/text-to-video';
import type { HttpClient } from '@runapi.ai/core';
import type { TextToVideoResponse, TaskCreateResponse } from '../../src/types';

describe('TextToVideo', () => {
  const mockHttp: HttpClient = {
    request: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('create', () => {
    it('should send correct request for single-shot mode', async () => {
      const mockResponse: TaskCreateResponse = { id: 'task-123' };
      vi.mocked(mockHttp.request).mockResolvedValueOnce(mockResponse);

      const textToVideo = new TextToVideo(mockHttp);
      const result = await textToVideo.create({
        model: 'kling-3.0',
        prompt: 'A cat playing piano',
        enable_sound: true,
        duration_seconds: 5,
        aspect_ratio: '16:9',
        output_resolution: '1080p',
      });

      expect(mockHttp.request).toHaveBeenCalledWith(
        'POST',
        '/api/v1/kling/text_to_video',
        {
          body: {
            model: 'kling-3.0',
            prompt: 'A cat playing piano',
            enable_sound: true,
            duration_seconds: 5,
            aspect_ratio: '16:9',
            output_resolution: '1080p',
          },
        }
      );
      expect(result).toEqual(mockResponse);
    });

  });

  describe('get', () => {
    it('should fetch task status by ID', async () => {
      const mockResponse: TextToVideoResponse = {
        id: 'task-123',
        status: 'processing',
        model: 'kling-3.0',
      };
      vi.mocked(mockHttp.request).mockResolvedValueOnce(mockResponse);

      const textToVideo = new TextToVideo(mockHttp);
      const result = await textToVideo.get('task-123');

      expect(mockHttp.request).toHaveBeenCalledWith(
        'GET',
        '/api/v1/kling/text_to_video/task-123',
        {}
      );
      expect(result).toEqual(mockResponse);
    });

    it('should return completed status with videos', async () => {
      const mockResponse: TextToVideoResponse = {
        id: 'task-123',
        status: 'completed',
        model: 'kling-3.0',
        videos: [{ url: 'https://cdn.runapi.ai/public/samples/video.mp4' }],
      };
      vi.mocked(mockHttp.request).mockResolvedValueOnce(mockResponse);

      const textToVideo = new TextToVideo(mockHttp);
      const result = await textToVideo.get('task-123');

      expect(result.status).toBe('completed');
      expect(result.videos).toHaveLength(1);
      expect(result.videos?.[0].url).toBe('https://cdn.runapi.ai/public/samples/video.mp4');
    });

    it('should return failed status with error', async () => {
      const mockResponse: TextToVideoResponse = {
        id: 'task-123',
        status: 'failed',
        model: 'kling-3.0',
        error: 'Task failed',
      };
      vi.mocked(mockHttp.request).mockResolvedValueOnce(mockResponse);

      const textToVideo = new TextToVideo(mockHttp);
      const result = await textToVideo.get('task-123');

      expect(result.status).toBe('failed');
      expect(result.error).toBe('Task failed');
    });
  });

  describe('run', () => {
    it('should create and poll until completion', async () => {
      const createResponse: TaskCreateResponse = { id: 'task-123' };
      const processingResponse: TextToVideoResponse = {
        id: 'task-123',
        status: 'processing',
        model: 'kling-3.0',
      };
      const completedResponse: TextToVideoResponse = {
        id: 'task-123',
        status: 'completed',
        model: 'kling-3.0',
        videos: [{ url: 'https://cdn.runapi.ai/public/samples/video.mp4' }],
      };

      vi.mocked(mockHttp.request)
        .mockResolvedValueOnce(createResponse)
        .mockResolvedValueOnce(processingResponse)
        .mockResolvedValueOnce(completedResponse);

      const textToVideo = new TextToVideo(mockHttp);
      const result = await textToVideo.run({
        model: 'kling-3.0',
        prompt: 'A cat playing',
      });

      expect(result.status).toBe('completed');
      expect(result.videos).toHaveLength(1);
    });
  });
});
