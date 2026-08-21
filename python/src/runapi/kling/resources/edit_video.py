"""Kling source-video editing resource."""

from __future__ import annotations

from typing import Any, Optional

from runapi.core import RequestOptions, Resource

from ..contract_gen import CONTRACT
from ..types import CompletedTextToVideoResponse, TextToVideoResponse


class EditVideo(Resource):
    """Edit a source video with a selected Kling V3 Omni model."""

    ENDPOINT = "/api/v1/kling/edit_video"
    RESPONSE_CLASS = TextToVideoResponse
    COMPLETED_RESPONSE_CLASS = CompletedTextToVideoResponse

    def run(self, options: Optional[RequestOptions] = None, **params: Any) -> Any:
        """Create an edit-video task and poll until it completes."""
        task = self.create(options=options, **params)
        return self._poll_until_complete(lambda: self.get(task.id, options=options))

    def create(self, options: Optional[RequestOptions] = None, **params: Any) -> Any:
        """Create an edit-video task with a caller-supplied model."""
        compacted = self._compact_params(params)
        self._validate_contract(CONTRACT["edit-video"], compacted)
        return self._request("post", self.ENDPOINT, body=compacted, options=options)

    def get(self, id: str, options: Optional[RequestOptions] = None) -> Any:
        """Fetch the current status of an edit-video task."""
        return self._request("get", f"{self.ENDPOINT}/{id}", options=options)
