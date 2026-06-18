"""Kling model lists, enums, and response models."""

from __future__ import annotations

from runapi.core import BaseModel, TaskResponse, optional, required

TEXT_TO_VIDEO_MODELS = [
    "kling-3.0",
    "kling-v2.5-turbo-text-to-video-pro",
    "kling-v2.1-master-text-to-video",
]

AI_AVATAR_MODELS = [
    "kling-ai-avatar-pro",
    "kling-ai-avatar-standard",
    "kling-ai-avatar-v1-pro",
    "kling-v1-avatar-standard",
]

IMAGE_TO_VIDEO_MODELS = [
    "kling-v2.5-turbo-image-to-video-pro",
    "kling-v2.1-pro",
    "kling-v2.1-standard",
    "kling-v2.1-master-image-to-video",
]

TEXT_TO_VIDEO_OUTPUT_RESOLUTIONS = ["720p", "1080p", "4k"]

MOTION_CONTROL_MODELS = ["kling-3.0"]

MOTION_CONTROL_OUTPUT_RESOLUTIONS = ["720p", "1080p"]

MOTION_CONTROL_CHARACTER_ORIENTATIONS = ["video", "image"]

MOTION_CONTROL_BACKGROUND_SOURCES = ["video", "image"]

ASPECT_RATIOS = ["16:9", "9:16", "1:1"]

DURATION_RANGE = range(3, 16)

MULTI_PROMPT_DURATION_RANGE = range(1, 13)

FIXED_DURATIONS = [5, 10]

MULTI_PROMPT_MAX_LENGTH = 500


class Video(BaseModel):
    url = optional(str)


class AsyncTaskResponse(TaskResponse):
    """Base response for an asynchronous Kling task."""

    id = required(str)
    status = optional(str, enum=lambda: TaskResponse.Status.ALL)


class TextToVideoResponse(AsyncTaskResponse):
    """Response for a text-to-video task."""

    videos = optional([lambda: Video])
    error = optional(str)


class AiAvatarResponse(AsyncTaskResponse):
    """Response for an AI avatar task."""

    videos = optional([lambda: Video])
    error = optional(str)


class ImageToVideoResponse(AsyncTaskResponse):
    """Response for an image-to-video task."""

    videos = optional([lambda: Video])
    error = optional(str)


class MotionControlResponse(AsyncTaskResponse):
    """Response for a motion control task."""

    videos = optional([lambda: Video])
    error = optional(str)


# Narrowed responses returned by ``run()`` once polling observes completion.
# ``videos`` is required so consumers never have to null-check it on success.
class CompletedTextToVideoResponse(TextToVideoResponse):
    """Narrowed text-to-video response once polling observes completion."""

    videos = required([lambda: Video])


class CompletedAiAvatarResponse(AiAvatarResponse):
    """Narrowed AI avatar response once polling observes completion."""

    videos = required([lambda: Video])


class CompletedImageToVideoResponse(ImageToVideoResponse):
    """Narrowed image-to-video response once polling observes completion."""

    videos = required([lambda: Video])


class CompletedMotionControlResponse(MotionControlResponse):
    """Narrowed motion control response once polling observes completion."""

    videos = required([lambda: Video])
