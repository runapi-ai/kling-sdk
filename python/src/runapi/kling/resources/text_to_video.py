"""Kling text-to-video resource."""

from __future__ import annotations

from typing import Any, Dict

from runapi.core import Resource, ValidationError

from ..types import (
    ASPECT_RATIOS,
    DURATION_RANGE,
    FIXED_DURATIONS,
    MULTI_PROMPT_DURATION_RANGE,
    MULTI_PROMPT_MAX_LENGTH,
    TEXT_TO_VIDEO_MODELS,
    TEXT_TO_VIDEO_OUTPUT_RESOLUTIONS,
    CompletedTextToVideoResponse,
    TextToVideoResponse,
)


class TextToVideo(Resource):
    """Generate videos from text prompts with Kling models."""

    ENDPOINT = "/api/v1/kling/text_to_video"

    RESPONSE_CLASS = TextToVideoResponse
    COMPLETED_RESPONSE_CLASS = CompletedTextToVideoResponse

    def run(self, **params: Any) -> Any:
        """Generate a video from text and poll until it completes.

        Args:
            **params: Text-to-video parameters (model, prompt, ...).

        Returns:
            The completed task with videos.
        """
        task = self.create(**params)
        return self._poll_until_complete(lambda: self.get(task.id))

    def create(self, **params: Any) -> Any:
        """Create a text-to-video task and return immediately with an ``id``.

        Args:
            **params: Text-to-video parameters (model, prompt, ...).

        Returns:
            The task creation result with an id.
        """
        compacted = self._compact_params(params)
        self._validate_params(compacted)
        return self._request("post", self.ENDPOINT, body=compacted)

    def get(self, id: str) -> Any:
        """Fetch the current status of a text-to-video task.

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
        if model not in TEXT_TO_VIDEO_MODELS:
            raise ValidationError(
                f"Invalid model: {model}. Must be one of: {', '.join(TEXT_TO_VIDEO_MODELS)}"
            )

        multi_shots = params.get("multi_shots") is True

        if multi_shots:
            if params.get("enable_sound") is not True:
                raise ValidationError("enable_sound must be true when multi_shots is true")
            if params.get("last_frame_image_url"):
                raise ValidationError("last_frame_image_url is not supported when multi_shots is true")

            self._validate_multi_prompt(params.get("multi_prompt"))
        else:
            if not params.get("prompt"):
                raise ValidationError("prompt is required")

        self._validate_optional(params, "output_resolution", TEXT_TO_VIDEO_OUTPUT_RESOLUTIONS)
        self._validate_optional(params, "aspect_ratio", ASPECT_RATIOS)

        duration_seconds = params.get("duration_seconds")
        if duration_seconds is not None:
            try:
                dur_int = int(duration_seconds)
            except (TypeError, ValueError):
                dur_int = None
            if model in ("kling-v2.1-master-text-to-video", "kling-v2.5-turbo-text-to-video-pro"):
                if duration_seconds not in FIXED_DURATIONS:
                    raise ValidationError(
                        f"Invalid duration_seconds: {duration_seconds}. "
                        f"Must be one of: {', '.join(str(d) for d in FIXED_DURATIONS)}"
                    )
            elif dur_int is None or dur_int not in DURATION_RANGE:
                raise ValidationError(
                    f"Invalid duration_seconds: {duration_seconds}. "
                    f"Must be an integer between {DURATION_RANGE.start} and {DURATION_RANGE.stop - 1}"
                )

    def _validate_multi_prompt(self, multi_prompt: Any) -> None:
        if not (isinstance(multi_prompt, list) and len(multi_prompt) > 0):
            raise ValidationError("multi_prompt must be a non-empty array when multi_shots is true")

        for index, shot in enumerate(multi_prompt):
            prompt = shot.get("prompt") if isinstance(shot, dict) else None
            duration_seconds = shot.get("duration_seconds") if isinstance(shot, dict) else None

            if prompt is None or len(prompt) == 0:
                raise ValidationError(f"multi_prompt[{index}].prompt is required")

            if len(prompt) > MULTI_PROMPT_MAX_LENGTH:
                raise ValidationError(
                    f"multi_prompt[{index}].prompt exceeds {MULTI_PROMPT_MAX_LENGTH} characters"
                )

            if duration_seconds is None:
                raise ValidationError(f"multi_prompt[{index}].duration_seconds is required")

            try:
                dur_int = int(duration_seconds)
            except (TypeError, ValueError):
                dur_int = None
            if dur_int is None or dur_int not in MULTI_PROMPT_DURATION_RANGE:
                raise ValidationError(
                    f"multi_prompt[{index}].duration_seconds must be between "
                    f"{MULTI_PROMPT_DURATION_RANGE.start} and {MULTI_PROMPT_DURATION_RANGE.stop - 1}"
                )
