"""Kling motion control resource."""

from __future__ import annotations

from typing import Any, Dict

from runapi.core import Resource, ValidationError

from ..types import (
    MOTION_CONTROL_BACKGROUND_SOURCES,
    MOTION_CONTROL_CHARACTER_ORIENTATIONS,
    MOTION_CONTROL_MODELS,
    MOTION_CONTROL_OUTPUT_RESOLUTIONS,
    CompletedMotionControlResponse,
    MotionControlResponse,
)


class MotionControl(Resource):
    """Generate videos with motion transfer from reference videos."""

    ENDPOINT = "/api/v1/kling/motion_control"

    RESPONSE_CLASS = MotionControlResponse
    COMPLETED_RESPONSE_CLASS = CompletedMotionControlResponse

    def run(self, **params: Any) -> Any:
        """Generate a motion control video and poll until it completes.

        Args:
            **params: Motion control parameters (model, source_image_url, reference_video_url, ...).

        Returns:
            The completed task with videos.
        """
        task = self.create(**params)
        return self._poll_until_complete(lambda: self.get(task.id))

    def create(self, **params: Any) -> Any:
        """Create a motion control task and return immediately with an ``id``.

        Args:
            **params: Motion control parameters (model, source_image_url, reference_video_url, ...).

        Returns:
            The task creation result with an id.
        """
        compacted = self._compact_params(params)
        self._validate_params(compacted)
        return self._request("post", self.ENDPOINT, body=compacted)

    def get(self, id: str) -> Any:
        """Fetch the current status of a motion control task.

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
        if model not in MOTION_CONTROL_MODELS:
            raise ValidationError(
                f"Invalid model: {model}. Must be one of: {', '.join(MOTION_CONTROL_MODELS)}"
            )

        self._validate_optional(params, "output_resolution", MOTION_CONTROL_OUTPUT_RESOLUTIONS)
        self._validate_optional(params, "character_orientation", MOTION_CONTROL_CHARACTER_ORIENTATIONS)
        self._validate_optional(params, "background_source", MOTION_CONTROL_BACKGROUND_SOURCES)

        if not params.get("source_image_url"):
            raise ValidationError("source_image_url is required")

        if not params.get("reference_video_url"):
            raise ValidationError("reference_video_url is required")
