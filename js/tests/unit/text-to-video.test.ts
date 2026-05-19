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
        sound: true,
        duration: '5',
        aspect_ratio: '16:9',
        mode: 'pro',
      });

      expect(mockHttp.request).toHaveBeenCalledWith(
        'POST',
        '/api/v1/kling/text_to_video',
        {
          body: {
            model: 'kling-3.0',
            prompt: 'A cat playing piano',
            sound: true,
            duration: '5',
            aspect_ratio: '16:9',
            mode: 'pro',
          },
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should send correct request for multi-shot mode', async () => {
      const mockResponse: TaskCreateResponse = { id: 'task-multi' };
      vi.mocked(mockHttp.request).mockResolvedValueOnce(mockResponse);

      const textToVideo = new TextToVideo(mockHttp);
      await textToVideo.create({
        model: 'kling-3.0',
        multi_shots: true,
        sound: true,
        duration: '6',
        mode: 'pro',
        multi_prompt: [
          { prompt: 'A dog running on the beach', duration: 3 },
          { prompt: 'The dog catches a frisbee', duration: 3 },
        ],
      });

      expect(mockHttp.request).toHaveBeenCalledWith(
        'POST',
        '/api/v1/kling/text_to_video',
        {
          body: {
            model: 'kling-3.0',
            multi_shots: true,
            sound: true,
            duration: '6',
            mode: 'pro',
            multi_prompt: [
              { prompt: 'A dog running on the beach', duration: 3 },
              { prompt: 'The dog catches a frisbee', duration: 3 },
            ],
          },
        }
      );
    });

    it('should send correct request with element references', async () => {
      const mockResponse: TaskCreateResponse = { id: 'task-elements' };
      vi.mocked(mockHttp.request).mockResolvedValueOnce(mockResponse);

      const textToVideo = new TextToVideo(mockHttp);
      await textToVideo.create({
        model: 'kling-3.0',
        prompt: 'A bright room @element_dog',
        image_urls: ['https://example.com/frame.png'],
        kling_elements: [
          {
            name: 'element_dog',
            description: 'dog',
            element_input_urls: [
              'https://example.com/dog1.jpg',
              'https://example.com/dog2.jpg',
            ],
          },
        ],
      });

      expect(mockHttp.request).toHaveBeenCalledWith(
        'POST',
        '/api/v1/kling/text_to_video',
        {
          body: {
            model: 'kling-3.0',
            prompt: 'A bright room @element_dog',
            image_urls: ['https://example.com/frame.png'],
            kling_elements: [
              {
                name: 'element_dog',
                description: 'dog',
                element_input_urls: [
                  'https://example.com/dog1.jpg',
                  'https://example.com/dog2.jpg',
                ],
              },
            ],
          },
        }
      );
    });
  });


    it('should send correct request for V2.5 Turbo text-to-video', async () => {
      const mockResponse: TaskCreateResponse = { id: 'task-v25' };
      vi.mocked(mockHttp.request).mockResolvedValueOnce(mockResponse);

      const textToVideo = new TextToVideo(mockHttp);
      await textToVideo.create({
        model: 'kling-v2.5-turbo-text-to-video-pro',
        prompt: 'A sunset over the ocean',
        duration: '5',
        aspect_ratio: '16:9',
      });

      expect(mockHttp.request).toHaveBeenCalledWith(
        'POST',
        '/api/v1/kling/text_to_video',
        {
          body: {
            model: 'kling-v2.5-turbo-text-to-video-pro',
            prompt: 'A sunset over the ocean',
            duration: '5',
            aspect_ratio: '16:9',
          },
        }
      );
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
        videos: [{ url: 'https://example.com/video.mp4' }],
      };
      vi.mocked(mockHttp.request).mockResolvedValueOnce(mockResponse);

      const textToVideo = new TextToVideo(mockHttp);
      const result = await textToVideo.get('task-123');

      expect(result.status).toBe('completed');
      expect(result.videos).toHaveLength(1);
      expect(result.videos?.[0].url).toBe('https://example.com/video.mp4');
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
        videos: [{ url: 'https://example.com/video.mp4' }],
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
