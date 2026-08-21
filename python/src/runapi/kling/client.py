"""Kling client."""

from __future__ import annotations

from typing import Any, Optional

from runapi.core import ProviderClient

from .resources.ai_avatar import AiAvatar
from .resources.edit_video import EditVideo
from .resources.image_to_video import ImageToVideo
from .resources.motion_control import MotionControl
from .resources.text_to_video import TextToVideo
from .resources.extend_video import ExtendVideo


class KlingClient(ProviderClient):
    """Kling video generation client.

    Example::

        client = KlingClient(api_key="sk-...")
        result = client.text_to_video.run(
            model="kling-3.0", prompt="A cat walking through a garden"
        )
    """

    def __init__(self, api_key: Optional[str] = None, **options: Any) -> None:
        super().__init__(api_key, **options)
        http = self._http
        self.text_to_video = TextToVideo(http)
        self.ai_avatar = AiAvatar(http)
        self.image_to_video = ImageToVideo(http)
        self.motion_control = MotionControl(http)
        self.extend_video = ExtendVideo(http)
        self.edit_video = EditVideo(http)
