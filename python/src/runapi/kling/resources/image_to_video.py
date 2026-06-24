"""Kling image-to-video resource."""

from __future__ import annotations

from typing import Any, Dict

from runapi.core import Resource, ValidationError

from ..contract_gen import CONTRACT
from ..types import (
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
        self._validate_contract(CONTRACT["image-to-video"], params)

        # Bespoke: last_frame_image_url is only allowed for select models
        # (model-gating, not expressible as a contract enum/required rule).
        model = params.get("model")
        last_frame_image_url = params.get("last_frame_image_url")
        if last_frame_image_url and model not in (
            "kling-v2.5-turbo-image-to-video-pro",
            "kling-v2.1-pro",
        ):
            raise ValidationError(
                "last_frame_image_url is only supported by "
                "kling-v2.5-turbo-image-to-video-pro and kling-v2.1-pro"
            )
