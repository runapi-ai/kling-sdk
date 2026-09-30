"""Kling response models."""

from __future__ import annotations

from runapi.core import BaseModel, TaskResponse, optional, required


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
