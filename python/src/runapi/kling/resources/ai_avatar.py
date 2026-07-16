"""Kling AI avatar resource."""

from __future__ import annotations

from typing import Any, Optional

from runapi.core import Resource, RequestOptions

from ..contract_gen import CONTRACT
from ..types import AiAvatarResponse, CompletedAiAvatarResponse


class AiAvatar(Resource):
    """Generate talking avatar videos from images and audio."""

    ENDPOINT = "/api/v1/kling/ai_avatar"

    RESPONSE_CLASS = AiAvatarResponse
    COMPLETED_RESPONSE_CLASS = CompletedAiAvatarResponse

    def run(self, options: Optional[RequestOptions] = None, **params: Any) -> Any:
        """Generate an AI avatar video and poll until it completes.

        Args:
            **params: AI avatar parameters (model, source_image_url, source_audio_url, prompt, ...).

        Returns:
            The completed task with videos.
        """
        task = self.create(options=options, **params)
        return self._poll_until_complete(lambda: self.get(task.id, options=options))

    def create(self, options: Optional[RequestOptions] = None, **params: Any) -> Any:
        """Create an AI avatar task and return immediately with an ``id``.

        Args:
            **params: AI avatar parameters (model, source_image_url, source_audio_url, prompt, ...).

        Returns:
            The task creation result with an id.
        """
        compacted = self._compact_params(params)
        self._validate_contract(CONTRACT["avatar"], compacted)
        return self._request("post", self.ENDPOINT, body=compacted, options=options)

    def get(self, id: str, options: Optional[RequestOptions] = None) -> Any:
        """Fetch the current status of an AI avatar task.

        Args:
            id: The task id.

        Returns:
            The current task status.
        """
        return self._request("get", f"{self.ENDPOINT}/{id}", options=options)
