"""Kling image-to-video resource."""

from __future__ import annotations

from typing import Any, Optional

from runapi.core import Resource, RequestOptions

from ..types import (
    CompletedImageToVideoResponse,
    ImageToVideoResponse,
)

V26_MODEL = "kling-v2.6"
V3_OMNI_MODEL = "kling-v3-omni"
V3_TURBO_MODEL = "kling-v3-turbo-image-to-video"


class ImageToVideo(Resource):
    """Generate videos from an input image with Kling models."""

    ENDPOINT = "/api/v1/kling/image_to_video"

    RESPONSE_CLASS = ImageToVideoResponse
    COMPLETED_RESPONSE_CLASS = CompletedImageToVideoResponse

    def run(self, options: Optional[RequestOptions] = None, **params: Any) -> Any:
        """Generate a video from an image and poll until it completes.

        Args:
            **params: Image-to-video parameters (model, prompt, first_frame_image_url, ...).

        Returns:
            The completed task with videos.
        """
        task = self.create(options=options, **params)
        return self._poll_until_complete(lambda: self.get(task.id, options=options))

    def create(self, options: Optional[RequestOptions] = None, **params: Any) -> Any:
        """Create an image-to-video task and return immediately with an ``id``.

        Args:
            **params: Image-to-video parameters (model, prompt, first_frame_image_url, ...).

        Returns:
            The task creation result with an id.
        """
        compacted = self._compact_params(params)
        return self._request("post", self.ENDPOINT, body=compacted, options=options)

    def get(self, id: str, options: Optional[RequestOptions] = None) -> Any:
        """Fetch the current status of an image-to-video task.

        Args:
            id: The task id.

        Returns:
            The current task status.
        """
        return self._request("get", f"{self.ENDPOINT}/{id}", options=options)
