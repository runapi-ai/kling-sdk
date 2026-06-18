"""Kling AI avatar resource."""

from __future__ import annotations

from typing import Any, Dict

from runapi.core import Resource, ValidationError

from ..types import AI_AVATAR_MODELS, AiAvatarResponse, CompletedAiAvatarResponse


class AiAvatar(Resource):
    """Generate talking avatar videos from images and audio."""

    ENDPOINT = "/api/v1/kling/ai_avatar"

    RESPONSE_CLASS = AiAvatarResponse
    COMPLETED_RESPONSE_CLASS = CompletedAiAvatarResponse

    def run(self, **params: Any) -> Any:
        """Generate an AI avatar video and poll until it completes.

        Args:
            **params: AI avatar parameters (model, source_image_url, source_audio_url, prompt, ...).

        Returns:
            The completed task with videos.
        """
        task = self.create(**params)
        return self._poll_until_complete(lambda: self.get(task.id))

    def create(self, **params: Any) -> Any:
        """Create an AI avatar task and return immediately with an ``id``.

        Args:
            **params: AI avatar parameters (model, source_image_url, source_audio_url, prompt, ...).

        Returns:
            The task creation result with an id.
        """
        compacted = self._compact_params(params)
        self._validate_params(compacted)
        return self._request("post", self.ENDPOINT, body=compacted)

    def get(self, id: str) -> Any:
        """Fetch the current status of an AI avatar task.

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
        if model not in AI_AVATAR_MODELS:
            raise ValidationError(
                f"Invalid model: {model}. Must be one of: {', '.join(AI_AVATAR_MODELS)}"
            )

        if not params.get("source_image_url"):
            raise ValidationError("source_image_url is required")
        if not params.get("source_audio_url"):
            raise ValidationError("source_audio_url is required")
        if not params.get("prompt"):
            raise ValidationError("prompt is required")
