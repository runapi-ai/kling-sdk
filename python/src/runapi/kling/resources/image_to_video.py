"""Kling image-to-video resource."""

from __future__ import annotations

from typing import Any, Dict, Optional

from runapi.core import Resource, ValidationError, RequestOptions

from ..contract_gen import CONTRACT
from ..types import (
    CompletedImageToVideoResponse,
    ImageToVideoResponse,
)

V3_TURBO_MODEL = "kling-v3-turbo-image-to-video"
V3_TURBO_UNSUPPORTED_FIELDS = (
    "aspect_ratio",
    "negative_prompt",
    "cfg_scale",
    "last_frame_image_url",
)


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
        self._validate_params(compacted)
        return self._request("post", self.ENDPOINT, body=compacted, options=options)

    def get(self, id: str, options: Optional[RequestOptions] = None) -> Any:
        """Fetch the current status of an image-to-video task.

        Args:
            id: The task id.

        Returns:
            The current task status.
        """
        return self._request("get", f"{self.ENDPOINT}/{id}", options=options)

    def _validate_params(self, params: Dict[str, Any]) -> None:
        self._reject_unsupported_v3_turbo_fields(params)
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

    def _reject_unsupported_v3_turbo_fields(self, params: Dict[str, Any]) -> None:
        if params.get("model") != V3_TURBO_MODEL:
            return

        for field in V3_TURBO_UNSUPPORTED_FIELDS:
            if self._field_present(params, field):
                raise ValidationError(f"{field} is not supported by {V3_TURBO_MODEL}")
