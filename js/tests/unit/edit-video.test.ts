import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { HttpClient } from '@runapi.ai/core';
import { EditVideo } from '../../src/resources/edit-video';

describe('EditVideo', () => {
  const mockHttp: HttpClient = {request: vi.fn()};

  beforeEach(() => vi.clearAllMocks());

  it('creates an edit-video task with the reference model', async () => {
    vi.mocked(mockHttp.request).mockResolvedValueOnce({id: 'task-edit'});

    await new EditVideo(mockHttp).create({
      model: 'kling-v3-omni-reference',
      prompt: 'Keep the source subject consistent',
      source_video_url: 'https://cdn.runapi.ai/public/samples/video.mp4',
      duration_seconds: 5,
      output_resolution: '720p',
      aspect_ratio: 'auto',
      enable_sound: false,
    });

    expect(mockHttp.request).toHaveBeenCalledWith('POST', '/api/v1/kling/edit_video', {
      body: {
        model: 'kling-v3-omni-reference',
        prompt: 'Keep the source subject consistent',
        source_video_url: 'https://cdn.runapi.ai/public/samples/video.mp4',
        duration_seconds: 5,
        output_resolution: '720p',
        aspect_ratio: 'auto',
        enable_sound: false,
      },
    });
  });

  it('gets an edit-video task', async () => {
    vi.mocked(mockHttp.request).mockResolvedValueOnce({id: 'task-edit', status: 'processing'});

    await new EditVideo(mockHttp).get('task-edit');

    expect(mockHttp.request).toHaveBeenCalledWith('GET', '/api/v1/kling/edit_video/task-edit', {});
  });

  it('creates and polls an edit-video task with the edit model', async () => {
    vi.mocked(mockHttp.request)
      .mockResolvedValueOnce({id: 'task-edit'})
      .mockResolvedValueOnce({id: 'task-edit', status: 'completed', videos: [{url: 'https://file.runapi.ai/edit.mp4'}]});

    const result = await new EditVideo(mockHttp).run({
      model: 'kling-v3-omni-edit',
      prompt: 'Turn the source video into a watercolor scene',
      source_video_url: 'https://cdn.runapi.ai/public/samples/video.mp4',
      aspect_ratio: 'auto',
      enable_sound: true,
    }, {pollIntervalMs: 0, maxWaitMs: 100});

    expect(result.status).toBe('completed');
    expect(result.videos).toHaveLength(1);
  });
});
