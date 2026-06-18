"""Kling image-to-video resource."""

from __future__ import annotations

from typing import Any, Dict

from runapi.core import Resource, ValidationError

from ..types import (
    FIXED_DURATIONS,
    IMAGE_TO_VIDEO_MODELS,
    CompletedImageToVideoResponse,
    ImageToVideoResponse,
)


class ImageToVideo(Resource):
    """Generate videos from an input image with Kling models."""

    ENDPOINT = "/api/v1/kling/image_to_video"

    RESPONSE_CLASS = ImageToVideoResponse
    COMPLETED_RESPONSE_CLASS = CompletedImageToVideoResponse

    def run(self, **params: Any) -> Any:
        """Generate a video from an image and poll until it completes.

        Args:
            **params: Image-to-video parameters (model, prompt, first_frame_image_url, ...).

        Returns:
            The completed task with videos.
        """
        task = self.create(**params)
        return self._poll_until_complete(lambda: self.get(task.id))

    def create(self, **params: Any) -> Any:
        """Create an image-to-video task and return immediately with an ``id``.

        Args:
            **params: Image-to-video parameters (model, prompt, first_frame_image_url, ...).

        Returns:
            The task creation result with an id.
        """
        compacted = self._compact_params(params)
        self._validate_params(compacted)
        return self._request("post", self.ENDPOINT, body=compacted)

    def get(self, id: str) -> Any:
        """Fetch the current status of an image-to-video task.

        Args:
            id: The task id.

        Returns:
            The current task status.
        """
        return self._request("get", f"{self.ENDPOINT}/{id}")

    def _validate_params(self, params: Dict[str, Any]) -> None:
        model = params.get("model")
        if not model:
            raise ValidationError("model is required")
        if model not in IMAGE_TO_VIDEO_MODELS:
            raise ValidationError(
                f"Invalid model: {model}. Must be one of: {', '.join(IMAGE_TO_VIDEO_MODELS)}"
            )

        if not params.get("prompt"):
            raise ValidationError("prompt is required")
        if not params.get("first_frame_image_url"):
            raise ValidationError("first_frame_image_url is required")

        duration_seconds = params.get("duration_seconds")
        if duration_seconds is not None and duration_seconds not in FIXED_DURATIONS:
            raise ValidationError(
                f"Invalid duration_seconds: {duration_seconds}. "
                f"Must be one of: {', '.join(str(d) for d in FIXED_DURATIONS)}"
            )

        last_frame_image_url = params.get("last_frame_image_url")
        if last_frame_image_url and model not in (
            "kling-v2.5-turbo-image-to-video-pro",
            "kling-v2.1-pro",
        ):
            raise ValidationError(
                "last_frame_image_url is only supported by "
                "kling-v2.5-turbo-image-to-video-pro and kling-v2.1-pro"
            )
