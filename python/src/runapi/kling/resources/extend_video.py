"""Kling video continuation resource."""

from __future__ import annotations

from typing import Any, Optional

from runapi.core import RequestOptions, Resource

from ..contract_gen import CONTRACT


class ExtendVideo(Resource):
    """Continue a completed Kling V2.5 Turbo video task."""

    ENDPOINT = "/api/v1/kling/extend_video"

    def run(self, options: Optional[RequestOptions] = None, **params: Any) -> Any:
        task = self.create(options=options, **params)
        return self._poll_until_complete(lambda: self.get(task.id, options=options))

    def create(self, options: Optional[RequestOptions] = None, **params: Any) -> Any:
        compacted = self._compact_params(params)
        self._validate_contract(CONTRACT["extend-video"], compacted)
        return self._request("post", self.ENDPOINT, body=compacted, options=options)

    def get(self, id: str, options: Optional[RequestOptions] = None) -> Any:
        return self._request("get", f"{self.ENDPOINT}/{id}", options=options)
