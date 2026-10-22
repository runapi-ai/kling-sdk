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
    it('should send correct request for multi-shot mode', async () => {
      const mockResponse: TaskCreateResponse = { id: 'task-multi' };
      vi.mocked(mockHttp.request).mockResolvedValueOnce(mockResponse);

      const textToVideo = new TextToVideo(mockHttp);
      await textToVideo.create({
        model: 'kling-3.0',
        multi_shots: true,
        shot_type: 'custom',
        enable_sound: false,
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
            shot_type: 'custom',
            enable_sound: false,
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

    it('sends automatic storyboarding without custom shots', async () => {
      vi.mocked(mockHttp.request).mockResolvedValueOnce({ id: 'task-auto' });
      const params = { model: 'kling-3.0', multi_shots: true, shot_type: 'automatic', prompt: 'A sunrise over the sea' } satisfies import('../../src/types').TextToVideoParams;
      await new TextToVideo(mockHttp).create(params);
      expect(mockHttp.request).toHaveBeenCalledWith('POST', '/api/v1/kling/text_to_video', { body: params });
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

  });
});
