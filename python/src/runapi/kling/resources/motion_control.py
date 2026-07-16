"""Kling motion control resource."""

from __future__ import annotations

from typing import Any, Optional

from runapi.core import Resource, RequestOptions

from ..contract_gen import CONTRACT
from ..types import (
    CompletedMotionControlResponse,
    MotionControlResponse,
)


class MotionControl(Resource):
    """Generate videos with motion transfer from reference videos."""

    ENDPOINT = "/api/v1/kling/motion_control"

    RESPONSE_CLASS = MotionControlResponse
    COMPLETED_RESPONSE_CLASS = CompletedMotionControlResponse

    def run(self, options: Optional[RequestOptions] = None, **params: Any) -> Any:
        """Generate a motion control video and poll until it completes.

        Args:
            **params: Motion control parameters (model, source_image_url, reference_video_url, ...).

        Returns:
            The completed task with videos.
        """
        task = self.create(options=options, **params)
        return self._poll_until_complete(lambda: self.get(task.id, options=options))

    def create(self, options: Optional[RequestOptions] = None, **params: Any) -> Any:
        """Create a motion control task and return immediately with an ``id``.

        Args:
            **params: Motion control parameters (model, source_image_url, reference_video_url, ...).

        Returns:
            The task creation result with an id.
        """
        compacted = self._compact_params(params)
        self._validate_contract(CONTRACT["motion-control"], compacted)
        return self._request("post", self.ENDPOINT, body=compacted, options=options)

    def get(self, id: str, options: Optional[RequestOptions] = None) -> Any:
        """Fetch the current status of a motion control task.

        Args:
            id: The task id.

        Returns:
            The current task status.
        """
        return self._request("get", f"{self.ENDPOINT}/{id}", options=options)
