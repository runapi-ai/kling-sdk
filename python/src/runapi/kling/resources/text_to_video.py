"""Kling text-to-video resource."""

from __future__ import annotations

from typing import Any, Dict, Optional

from runapi.core import Resource, ValidationError, RequestOptions

from ..contract_gen import CONTRACT
from ..types import (
    MULTI_PROMPT_DURATION_RANGE,
    MULTI_PROMPT_MAX_LENGTH,
    CompletedTextToVideoResponse,
    TextToVideoResponse,
)
from .o1_reference_validation import validate_kling_o1_references

V26_MODEL = "kling-v2.6"
V3_TURBO_MODEL = "kling-v3-turbo-text-to-video"
V3_TURBO_UNSUPPORTED_FIELDS = (
    "enable_sound",
    "negative_prompt",
    "cfg_scale",
    "multi_shots",
    "multi_prompt",
    "first_frame_image_url",
    "last_frame_image_url",
    "kling_elements",
)


class TextToVideo(Resource):
    """Generate videos from text prompts with Kling models."""

    ENDPOINT = "/api/v1/kling/text_to_video"

    RESPONSE_CLASS = TextToVideoResponse
    COMPLETED_RESPONSE_CLASS = CompletedTextToVideoResponse

    def run(self, options: Optional[RequestOptions] = None, **params: Any) -> Any:
        """Generate a video from text and poll until it completes.

        Args:
            **params: Text-to-video parameters (model, prompt, ...).

        Returns:
            The completed task with videos.
        """
        task = self.create(options=options, **params)
        return self._poll_until_complete(lambda: self.get(task.id, options=options))

    def create(self, options: Optional[RequestOptions] = None, **params: Any) -> Any:
        """Create a text-to-video task and return immediately with an ``id``.

        Args:
            **params: Text-to-video parameters (model, prompt, ...).

        Returns:
            The task creation result with an id.
        """
        compacted = self._compact_params(params)
        self._validate_params(compacted)
        return self._request("post", self.ENDPOINT, body=compacted, options=options)

    def get(self, id: str, options: Optional[RequestOptions] = None) -> Any:
        """Fetch the current status of a text-to-video task.

        Args:
            id: The task id.

        Returns:
            The current task status.
        """
        return self._request("get", f"{self.ENDPOINT}/{id}", options=options)

    def _validate_params(self, params: Dict[str, Any]) -> None:
        self._reject_unsupported_v3_turbo_fields(params)
        self._validate_contract(CONTRACT["text-to-video"], params)
        self._validate_v26_params(params)
        validate_kling_o1_references(params)

        # Bespoke cross-field rules the contract cannot express.
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

    def _validate_v26_params(self, params: Dict[str, Any]) -> None:
        if (
            params.get("model") == V26_MODEL
            and params.get("enable_sound") is True
            and params.get("mode") != "pro"
        ):
            raise ValidationError(f"enable_sound requires mode pro for {V26_MODEL}")

    def _reject_unsupported_v3_turbo_fields(self, params: Dict[str, Any]) -> None:
        if params.get("model") != V3_TURBO_MODEL:
            return

        for field in V3_TURBO_UNSUPPORTED_FIELDS:
            if self._field_present(params, field):
                raise ValidationError(f"{field} is not supported by {V3_TURBO_MODEL}")

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
