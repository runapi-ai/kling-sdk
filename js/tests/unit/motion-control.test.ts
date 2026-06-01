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
        source_image_url: 'https://cdn.runapi.ai/public/samples/person.jpg',
        reference_video_url: 'https://cdn.runapi.ai/public/samples/result.mp4',
        prompt: 'A person dancing',
        output_resolution: '1080p',
      });

      expect(mockHttp.request).toHaveBeenCalledWith(
        'POST',
        '/api/v1/kling/motion_control',
        {
          body: {
            model: 'kling-3.0',
            source_image_url: 'https://cdn.runapi.ai/public/samples/person.jpg',
            reference_video_url: 'https://cdn.runapi.ai/public/samples/result.mp4',
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
        source_image_url: 'https://cdn.runapi.ai/public/samples/person.jpg',
        reference_video_url: 'https://cdn.runapi.ai/public/samples/result.mp4',
        prompt: 'A person dancing',
        output_resolution: '720p',
        character_orientation: 'video',
        background_source: 'video',
        callback_url: 'https://example.com/webhook',
      });

      expect(mockHttp.request).toHaveBeenCalledWith(
        'POST',
        '/api/v1/kling/motion_control',
        {
          body: {
            model: 'kling-3.0',
            source_image_url: 'https://cdn.runapi.ai/public/samples/person.jpg',
            reference_video_url: 'https://cdn.runapi.ai/public/samples/result.mp4',
            prompt: 'A person dancing',
            output_resolution: '720p',
            character_orientation: 'video',
            background_source: 'video',
            callback_url: 'https://example.com/webhook',
          },
        }
      );
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
        videos: [{ url: 'https://cdn.runapi.ai/public/samples/motion.mp4' }],
      };
      vi.mocked(mockHttp.request).mockResolvedValueOnce(mockResponse);

      const motionControl = new MotionControl(mockHttp);
      const result = await motionControl.get('task-123');

      expect(result.status).toBe('completed');
      expect(result.videos).toHaveLength(1);
      expect(result.videos?.[0].url).toBe('https://cdn.runapi.ai/public/samples/motion.mp4');
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
        videos: [{ url: 'https://cdn.runapi.ai/public/samples/motion.mp4' }],
      };

      vi.mocked(mockHttp.request)
        .mockResolvedValueOnce(createResponse)
        .mockResolvedValueOnce(processingResponse)
        .mockResolvedValueOnce(completedResponse);

      const motionControl = new MotionControl(mockHttp);
      const result = await motionControl.run({
        model: 'kling-3.0',
        source_image_url: 'https://cdn.runapi.ai/public/samples/person.jpg',
        reference_video_url: 'https://cdn.runapi.ai/public/samples/result.mp4',
      });

      expect(result.status).toBe('completed');
      expect(result.videos).toHaveLength(1);
    });
  });
});
