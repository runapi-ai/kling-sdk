import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MotionControl } from '../../src/resources/motion-control';
import type { HttpClient } from '@runapi.ai/core';
import type { MotionControlResponse, TaskCreateResponse } from '../../src/types';

describe('MotionControl', () => {
  const mockHttp: HttpClient = {
    request: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('create', () => {
    it('should send correct request', async () => {
      const mockResponse: TaskCreateResponse = { id: 'task-123' };
      vi.mocked(mockHttp.request).mockResolvedValueOnce(mockResponse);

      const motionControl = new MotionControl(mockHttp);
      const result = await motionControl.create({
        model: 'kling-3.0',
        source_image_url: 'https://cdn.runapi.ai/public/samples/portrait.jpg',
        reference_video_url: 'https://cdn.runapi.ai/public/samples/video.mp4',
        prompt: 'A person dancing',
        output_resolution: '1080p',
      });

      expect(mockHttp.request).toHaveBeenCalledWith(
        'POST',
        '/api/v1/kling/motion_control',
        {
          body: {
            model: 'kling-3.0',
            source_image_url: 'https://cdn.runapi.ai/public/samples/portrait.jpg',
            reference_video_url: 'https://cdn.runapi.ai/public/samples/video.mp4',
            prompt: 'A person dancing',
            output_resolution: '1080p',
          },
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should send correct request with all optional fields', async () => {
      const mockResponse: TaskCreateResponse = { id: 'task-456' };
      vi.mocked(mockHttp.request).mockResolvedValueOnce(mockResponse);

      const motionControl = new MotionControl(mockHttp);
      await motionControl.create({
        model: 'kling-3.0',
        source_image_url: 'https://cdn.runapi.ai/public/samples/portrait.jpg',
        reference_video_url: 'https://cdn.runapi.ai/public/samples/video.mp4',
        prompt: 'A person dancing',
        output_resolution: '720p',
        character_orientation: 'video',
        background_source: 'video',
        callback_url: 'https://your-domain.com/webhook',
      });

      expect(mockHttp.request).toHaveBeenCalledWith(
        'POST',
        '/api/v1/kling/motion_control',
        {
          body: {
            model: 'kling-3.0',
            source_image_url: 'https://cdn.runapi.ai/public/samples/portrait.jpg',
            reference_video_url: 'https://cdn.runapi.ai/public/samples/video.mp4',
            prompt: 'A person dancing',
            output_resolution: '720p',
            character_orientation: 'video',
            background_source: 'video',
            callback_url: 'https://your-domain.com/webhook',
          },
        }
      );
    });

    it('should send a Kling 2.6 request with required motion fields', async () => {
      vi.mocked(mockHttp.request).mockResolvedValueOnce({ id: 'task-v26' });

      const motionControl = new MotionControl(mockHttp);
      await motionControl.create({
        model: 'kling-v2.6',
        source_image_url: 'https://cdn.runapi.ai/public/samples/portrait.jpg',
        reference_video_url: 'https://cdn.runapi.ai/public/samples/video.mp4',
        output_resolution: '1080p',
        character_orientation: 'image',
      });

      expect(mockHttp.request).toHaveBeenCalledWith(
        'POST',
        '/api/v1/kling/motion_control',
        {
          body: {
            model: 'kling-v2.6',
            source_image_url: 'https://cdn.runapi.ai/public/samples/portrait.jpg',
            reference_video_url: 'https://cdn.runapi.ai/public/samples/video.mp4',
            output_resolution: '1080p',
            character_orientation: 'image',
          },
        }
      );
    });

    it.each(['output_resolution', 'character_orientation'] as const)(
      'should require %s for Kling 2.6',
      async (field) => {
        const motionControl = new MotionControl(mockHttp);
        const params: Record<string, unknown> = {
          model: 'kling-v2.6',
          source_image_url: 'https://cdn.runapi.ai/public/samples/portrait.jpg',
          reference_video_url: 'https://cdn.runapi.ai/public/samples/video.mp4',
          output_resolution: '720p',
          character_orientation: 'video',
        };
        delete params[field];

        await expect(motionControl.create(params as never)).rejects.toThrow(`${field} is required`);
        expect(mockHttp.request).not.toHaveBeenCalled();
      }
    );

    it('should reject background_source for Kling 2.6', async () => {
      const motionControl = new MotionControl(mockHttp);

      await expect(motionControl.create({
        model: 'kling-v2.6',
        source_image_url: 'https://cdn.runapi.ai/public/samples/portrait.jpg',
        reference_video_url: 'https://cdn.runapi.ai/public/samples/video.mp4',
        output_resolution: '720p',
        character_orientation: 'video',
        background_source: 'video',
      } as never)).rejects.toThrow('background_source is not allowed when model is kling-v2.6');
      expect(mockHttp.request).not.toHaveBeenCalled();
    });

  });

  describe('get', () => {
    it('should fetch task status by ID', async () => {
      const mockResponse: MotionControlResponse = {
        id: 'task-123',
        status: 'processing',
        model: 'kling-3.0',
      };
      vi.mocked(mockHttp.request).mockResolvedValueOnce(mockResponse);

      const motionControl = new MotionControl(mockHttp);
      const result = await motionControl.get('task-123');

      expect(mockHttp.request).toHaveBeenCalledWith(
        'GET',
        '/api/v1/kling/motion_control/task-123',
        {}
      );
      expect(result).toEqual(mockResponse);
    });

    it('should return completed status with videos', async () => {
      const mockResponse: MotionControlResponse = {
        id: 'task-123',
        status: 'completed',
        model: 'kling-3.0',
        videos: [{ url: 'https://cdn.runapi.ai/public/samples/video.mp4' }],
      };
      vi.mocked(mockHttp.request).mockResolvedValueOnce(mockResponse);

      const motionControl = new MotionControl(mockHttp);
      const result = await motionControl.get('task-123');

      expect(result.status).toBe('completed');
      expect(result.videos).toHaveLength(1);
      expect(result.videos?.[0].url).toBe('https://cdn.runapi.ai/public/samples/video.mp4');
    });

    it('should return failed status with error', async () => {
      const mockResponse: MotionControlResponse = {
        id: 'task-123',
        status: 'failed',
        model: 'kling-3.0',
        error: 'Generation failed',
      };
      vi.mocked(mockHttp.request).mockResolvedValueOnce(mockResponse);

      const motionControl = new MotionControl(mockHttp);
      const result = await motionControl.get('task-123');

      expect(result.status).toBe('failed');
      expect(result.error).toBe('Generation failed');
    });
  });

  describe('run', () => {
    it('should create and poll until completion', async () => {
      const createResponse: TaskCreateResponse = { id: 'task-123' };
      const processingResponse: MotionControlResponse = {
        id: 'task-123',
        status: 'processing',
        model: 'kling-3.0',
      };
      const completedResponse: MotionControlResponse = {
        id: 'task-123',
        status: 'completed',
        model: 'kling-3.0',
        videos: [{ url: 'https://cdn.runapi.ai/public/samples/video.mp4' }],
      };

      vi.mocked(mockHttp.request)
        .mockResolvedValueOnce(createResponse)
        .mockResolvedValueOnce(processingResponse)
        .mockResolvedValueOnce(completedResponse);

      const motionControl = new MotionControl(mockHttp);
      const result = await motionControl.run({
        model: 'kling-3.0',
        source_image_url: 'https://cdn.runapi.ai/public/samples/portrait.jpg',
        reference_video_url: 'https://cdn.runapi.ai/public/samples/video.mp4',
      });

      expect(result.status).toBe('completed');
      expect(result.videos).toHaveLength(1);
    });
  });
});
