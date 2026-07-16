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

    it('should send correct request for multi-shot mode', async () => {
      const mockResponse: TaskCreateResponse = { id: 'task-multi' };
      vi.mocked(mockHttp.request).mockResolvedValueOnce(mockResponse);

      const textToVideo = new TextToVideo(mockHttp);
      await textToVideo.create({
        model: 'kling-3.0',
        multi_shots: true,
        enable_sound: true,
        duration_seconds: 6,
        output_resolution: '1080p',
        multi_prompt: [
          { prompt: 'A dog running on the beach', duration_seconds: 3 },
          { prompt: 'The dog catches a frisbee', duration_seconds: 3 },
        ],
      });

      expect(mockHttp.request).toHaveBeenCalledWith(
        'POST',
        '/api/v1/kling/text_to_video',
        {
          body: {
            model: 'kling-3.0',
            multi_shots: true,
            enable_sound: true,
            duration_seconds: 6,
            output_resolution: '1080p',
            multi_prompt: [
              { prompt: 'A dog running on the beach', duration_seconds: 3 },
              { prompt: 'The dog catches a frisbee', duration_seconds: 3 },
            ],
          },
        }
      );
    });

    it('should send correct request for 4k output resolution', async () => {
      const mockResponse: TaskCreateResponse = { id: 'task-4k' };
      vi.mocked(mockHttp.request).mockResolvedValueOnce(mockResponse);

      const textToVideo = new TextToVideo(mockHttp);
      await textToVideo.create({
        model: 'kling-3.0',
        prompt: 'A 4K establishing shot of a glass observatory above clouds',
        duration_seconds: 5,
        aspect_ratio: '16:9',
        output_resolution: '4k',
      });

      expect(mockHttp.request).toHaveBeenCalledWith(
        'POST',
        '/api/v1/kling/text_to_video',
        {
          body: {
            model: 'kling-3.0',
            prompt: 'A 4K establishing shot of a glass observatory above clouds',
            duration_seconds: 5,
            aspect_ratio: '16:9',
            output_resolution: '4k',
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
        first_frame_image_url: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Golde33443.jpg',
        kling_elements: [
          {
            name: 'element_dog',
            description: 'dog',
            element_input_urls: [
              'https://upload.wikimedia.org/wikipedia/commons/6/6e/Golde33443.jpg',
              'https://upload.wikimedia.org/wikipedia/commons/9/9a/Pug_600.jpg',
            ],
            element_input_audio_urls: ['https://cdn.runapi.ai/public/samples/music.mp3'],
          },
          {
            name: 'element_run',
            description: 'running dog',
            element_input_urls: ['https://cdn.runapi.ai/public/samples/video.mp4'],
            start_time: 1000,
            end_time: 6000,
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
            first_frame_image_url: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Golde33443.jpg',
            kling_elements: [
              {
                name: 'element_dog',
                description: 'dog',
                element_input_urls: [
                  'https://upload.wikimedia.org/wikipedia/commons/6/6e/Golde33443.jpg',
                  'https://upload.wikimedia.org/wikipedia/commons/9/9a/Pug_600.jpg',
                ],
                element_input_audio_urls: ['https://cdn.runapi.ai/public/samples/music.mp3'],
              },
              {
                name: 'element_run',
                description: 'running dog',
                element_input_urls: ['https://cdn.runapi.ai/public/samples/video.mp4'],
                start_time: 1000,
                end_time: 6000,
              },
            ],
          },
        }
      );
    });

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

    it('rejects unsupported V3 Turbo text-to-video fields', async () => {
      const textToVideo = new TextToVideo(mockHttp);

      await expect(
        textToVideo.create({
          model: 'kling-v3-turbo-text-to-video',
          prompt: 'A quiet city street after rain',
          enable_sound: false,
        } as never)
      ).rejects.toThrow('enable_sound is not supported by kling-v3-turbo-text-to-video');
      expect(mockHttp.request).not.toHaveBeenCalled();
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
