import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AiAvatar } from '../../src/resources/ai-avatar';
import type { HttpClient } from '@runapi.ai/core';
import type { AiAvatarResponse, TaskCreateResponse } from '../../src/types';

describe('AiAvatar', () => {
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

      const aiAvatar = new AiAvatar(mockHttp);
      const result = await aiAvatar.create({
        model: 'kling-ai-avatar-pro',
        source_image_url: 'https://cdn.runapi.ai/public/samples/face.jpg',
        source_audio_url: 'https://cdn.runapi.ai/public/samples/audio.mp3',
        prompt: 'A person speaking naturally',
      });

      expect(mockHttp.request).toHaveBeenCalledWith(
        'POST',
        '/api/v1/kling/ai_avatar',
        {
          body: {
            model: 'kling-ai-avatar-pro',
            source_image_url: 'https://cdn.runapi.ai/public/samples/face.jpg',
            source_audio_url: 'https://cdn.runapi.ai/public/samples/audio.mp3',
            prompt: 'A person speaking naturally',
          },
        }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should send correct request with callback_url', async () => {
      const mockResponse: TaskCreateResponse = { id: 'task-456' };
      vi.mocked(mockHttp.request).mockResolvedValueOnce(mockResponse);

      const aiAvatar = new AiAvatar(mockHttp);
      await aiAvatar.create({
        model: 'kling-ai-avatar-standard',
        source_image_url: 'https://cdn.runapi.ai/public/samples/face.jpg',
        source_audio_url: 'https://cdn.runapi.ai/public/samples/audio.mp3',
        prompt: 'A person speaking',
        callback_url: 'https://example.com/webhook',
      });

      expect(mockHttp.request).toHaveBeenCalledWith(
        'POST',
        '/api/v1/kling/ai_avatar',
        {
          body: {
            model: 'kling-ai-avatar-standard',
            source_image_url: 'https://cdn.runapi.ai/public/samples/face.jpg',
            source_audio_url: 'https://cdn.runapi.ai/public/samples/audio.mp3',
            prompt: 'A person speaking',
            callback_url: 'https://example.com/webhook',
          },
        }
      );
    });

    it('should send correct request for v1 avatar model', async () => {
      const mockResponse: TaskCreateResponse = { id: 'task-v1-avatar' };
      vi.mocked(mockHttp.request).mockResolvedValueOnce(mockResponse);

      const aiAvatar = new AiAvatar(mockHttp);
      await aiAvatar.create({
        model: 'kling-ai-avatar-v1-pro',
        source_image_url: 'https://cdn.runapi.ai/public/samples/face.jpg',
        source_audio_url: 'https://cdn.runapi.ai/public/samples/audio.mp3',
        prompt: 'A person speaking',
      });

      expect(mockHttp.request).toHaveBeenCalledWith(
        'POST',
        '/api/v1/kling/ai_avatar',
        {
          body: {
            model: 'kling-ai-avatar-v1-pro',
            source_image_url: 'https://cdn.runapi.ai/public/samples/face.jpg',
            source_audio_url: 'https://cdn.runapi.ai/public/samples/audio.mp3',
            prompt: 'A person speaking',
          },
        }
      );
    });
  });

  describe('get', () => {
    it('should fetch task status by ID', async () => {
      const mockResponse: AiAvatarResponse = {
        id: 'task-123',
        status: 'processing',
        model: 'kling-ai-avatar-pro',
      };
      vi.mocked(mockHttp.request).mockResolvedValueOnce(mockResponse);

      const aiAvatar = new AiAvatar(mockHttp);
      const result = await aiAvatar.get('task-123');

      expect(mockHttp.request).toHaveBeenCalledWith(
        'GET',
        '/api/v1/kling/ai_avatar/task-123',
        {}
      );
      expect(result).toEqual(mockResponse);
    });

    it('should return completed status with videos', async () => {
      const mockResponse: AiAvatarResponse = {
        id: 'task-123',
        status: 'completed',
        model: 'kling-ai-avatar-pro',
        videos: [{ url: 'https://cdn.runapi.ai/public/samples/result.mp4' }],
      };
      vi.mocked(mockHttp.request).mockResolvedValueOnce(mockResponse);

      const aiAvatar = new AiAvatar(mockHttp);
      const result = await aiAvatar.get('task-123');

      expect(result.status).toBe('completed');
      expect(result.videos).toHaveLength(1);
      expect(result.videos?.[0].url).toBe('https://cdn.runapi.ai/public/samples/result.mp4');
    });

    it('should return failed status with error', async () => {
      const mockResponse: AiAvatarResponse = {
        id: 'task-123',
        status: 'failed',
        model: 'kling-ai-avatar-pro',
        error: 'Generation failed',
      };
      vi.mocked(mockHttp.request).mockResolvedValueOnce(mockResponse);

      const aiAvatar = new AiAvatar(mockHttp);
      const result = await aiAvatar.get('task-123');

      expect(result.status).toBe('failed');
      expect(result.error).toBe('Generation failed');
    });
  });

  describe('run', () => {
    it('should create and poll until completion', async () => {
      const createResponse: TaskCreateResponse = { id: 'task-123' };
      const processingResponse: AiAvatarResponse = {
        id: 'task-123',
        status: 'processing',
        model: 'kling-ai-avatar-pro',
      };
      const completedResponse: AiAvatarResponse = {
        id: 'task-123',
        status: 'completed',
        model: 'kling-ai-avatar-pro',
        videos: [{ url: 'https://cdn.runapi.ai/public/samples/result.mp4' }],
      };

      vi.mocked(mockHttp.request)
        .mockResolvedValueOnce(createResponse)
        .mockResolvedValueOnce(processingResponse)
        .mockResolvedValueOnce(completedResponse);

      const aiAvatar = new AiAvatar(mockHttp);
      const result = await aiAvatar.run({
        model: 'kling-ai-avatar-pro',
        source_image_url: 'https://cdn.runapi.ai/public/samples/face.jpg',
        source_audio_url: 'https://cdn.runapi.ai/public/samples/audio.mp3',
        prompt: 'A person speaking naturally',
      });

      expect(result.status).toBe('completed');
      expect(result.videos).toHaveLength(1);
    });
  });
});
