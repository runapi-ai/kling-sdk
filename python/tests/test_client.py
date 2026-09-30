import pytest

from runapi.core import config
from runapi.core.errors import AuthenticationError
from runapi.kling import KlingClient
from runapi.kling.resources.ai_avatar import AiAvatar
from runapi.kling.resources.edit_video import EditVideo
from runapi.kling.resources.image_to_video import ImageToVideo
from runapi.kling.resources.motion_control import MotionControl
from runapi.kling.resources.text_to_video import TextToVideo
from runapi.kling.types import (
    AiAvatarResponse,
    CompletedAiAvatarResponse,
    CompletedImageToVideoResponse,
    CompletedMotionControlResponse,
    CompletedTextToVideoResponse,
    ImageToVideoResponse,
    MotionControlResponse,
    TextToVideoResponse,
)


class FakeHttp:
    def __init__(self, *responses):
        self._responses = list(responses)
        self.calls = []

    def request(self, method, path, body=None, options=None):
        self.calls.append((method, path, body))
        if self._responses:
            return self._responses.pop(0)
        return {"id": "task_1", "status": "pending"}


@pytest.fixture(autouse=True)
def reset_config(monkeypatch):
    monkeypatch.delenv("RUNAPI_API_KEY", raising=False)
    monkeypatch.setattr(config, "api_key", None)
    yield


# --- auth -----------------------------------------------------------------


def test_accepts_api_key_parameter():
    assert isinstance(KlingClient(api_key="k", http_client=FakeHttp()), KlingClient)


def test_falls_back_to_global(monkeypatch):
    monkeypatch.setattr(config, "api_key", "global-key")
    assert isinstance(KlingClient(http_client=FakeHttp()), KlingClient)


def test_falls_back_to_env(monkeypatch):
    monkeypatch.setenv("RUNAPI_API_KEY", "env-key")
    assert isinstance(KlingClient(http_client=FakeHttp()), KlingClient)


def test_raises_without_api_key():
    with pytest.raises(AuthenticationError, match="API key is required"):
        KlingClient()


# --- injection / accessors ------------------------------------------------


def test_uses_injected_http_client():
    fake = FakeHttp()
    client = KlingClient(api_key="k", http_client=fake)
    assert client.text_to_video._http is fake
    assert client.ai_avatar._http is fake
    assert client.image_to_video._http is fake
    assert client.motion_control._http is fake
    assert client.edit_video._http is fake


def test_exposes_resource_accessors():
    client = KlingClient(api_key="k", http_client=FakeHttp())
    assert isinstance(client.text_to_video, TextToVideo)
    assert isinstance(client.ai_avatar, AiAvatar)
    assert isinstance(client.image_to_video, ImageToVideo)
    assert isinstance(client.motion_control, MotionControl)
    assert isinstance(client.edit_video, EditVideo)


# --- text_to_video --------------------------------------------------------


def test_text_to_video_create_posts_compacted_body():
    fake = FakeHttp({"id": "t1", "status": "pending"})
    client = KlingClient(api_key="k", http_client=fake)
    result = client.text_to_video.create(
        model="kling-3.0", prompt="a cat in a garden", aspect_ratio="16:9", seed=None
    )
    assert fake.calls == [
        (
            "post",
            "/api/v1/kling/text_to_video",
            {"model": "kling-3.0", "prompt": "a cat in a garden", "aspect_ratio": "16:9"},
        )]
    assert isinstance(result, TextToVideoResponse)


def test_text_to_video_create_posts_element_audio_and_time_fields():
    fake = FakeHttp({"id": "t1", "status": "pending"})
    client = KlingClient(api_key="k", http_client=fake)
    result = client.text_to_video.create(
        model="kling-3.0",
        prompt="A bright room @element_dog @element_run",
        kling_elements=[
            {
                "name": "element_dog",
                "description": "dog",
                "element_input_urls": [
                    "https://upload.wikimedia.org/wikipedia/commons/6/6e/Golde33443.jpg",
                    "https://upload.wikimedia.org/wikipedia/commons/9/9a/Pug_600.jpg"],
                "element_input_audio_urls": ["https://cdn.runapi.ai/public/samples/music.mp3"]},
            {
                "name": "element_run",
                "description": "running dog",
                "element_input_urls": ["https://cdn.runapi.ai/public/samples/video.mp4"],
                "start_time": 1000,
                "end_time": 6000}],
    )
    assert fake.calls == [
        (
            "post",
            "/api/v1/kling/text_to_video",
            {
                "model": "kling-3.0",
                "prompt": "A bright room @element_dog @element_run",
                "kling_elements": [
                    {
                        "name": "element_dog",
                        "description": "dog",
                        "element_input_urls": [
                            "https://upload.wikimedia.org/wikipedia/commons/6/6e/Golde33443.jpg",
                            "https://upload.wikimedia.org/wikipedia/commons/9/9a/Pug_600.jpg"],
                        "element_input_audio_urls": [
                            "https://cdn.runapi.ai/public/samples/music.mp3"
                        ]},
                    {
                        "name": "element_run",
                        "description": "running dog",
                        "element_input_urls": [
                            "https://cdn.runapi.ai/public/samples/video.mp4"
                        ],
                        "start_time": 1000,
                        "end_time": 6000}]},
        )]
    assert isinstance(result, TextToVideoResponse)


def test_text_to_video_get_fetches_by_id():
    fake = FakeHttp({"id": "t1", "status": "processing"})
    client = KlingClient(api_key="k", http_client=fake)
    client.text_to_video.get("t1")
    assert fake.calls == [("get", "/api/v1/kling/text_to_video/t1", None)]


def test_text_to_video_run_narrows_completed_type():
    fake = FakeHttp(
        {"id": "t1", "status": "pending"},
        {"id": "t1", "status": "completed", "usage": {"cost": 0.05}, "videos": [{"url": "https://x/y.mp4"}]},
    )
    client = KlingClient(api_key="k", http_client=fake)
    result = client.text_to_video.run(model="kling-3.0", prompt="a serene forest")
    assert isinstance(result, CompletedTextToVideoResponse)
    assert result.videos[0].url == "https://x/y.mp4"


def test_text_to_video_v3_turbo_posts_body():
    fake = FakeHttp({"id": "t1", "status": "pending"})
    client = KlingClient(api_key="k", http_client=fake)
    client.text_to_video.create(
        model="kling-v3-turbo-text-to-video",
        prompt="a silver train crossing a moonlit bridge",
        duration_seconds=7,
        aspect_ratio="16:9",
        output_resolution="1080p",
    )
    assert fake.calls == [
        (
            "post",
            "/api/v1/kling/text_to_video",
            {
                "model": "kling-v3-turbo-text-to-video",
                "prompt": "a silver train crossing a moonlit bridge",
                "duration_seconds": 7,
                "aspect_ratio": "16:9",
                "output_resolution": "1080p"},
        )]


def test_text_to_video_v26_posts_mode_and_sound_fields():
    fake = FakeHttp({"id": "t1", "status": "pending"})
    client = KlingClient(api_key="k", http_client=fake)

    client.text_to_video.create(
        model="kling-v2.6",
        prompt="a paper boat crossing a rain puddle",
        mode="pro",
        duration_seconds=10,
        enable_sound=True,
        aspect_ratio="16:9",
    )

    assert fake.calls == [
        (
            "post",
            "/api/v1/kling/text_to_video",
            {
                "model": "kling-v2.6",
                "prompt": "a paper boat crossing a rain puddle",
                "mode": "pro",
                "duration_seconds": 10,
                "enable_sound": True,
                "aspect_ratio": "16:9"},
        )
    ]


def test_text_to_video_v3_omni_posts_resolution_and_sound_fields():
    fake = FakeHttp({"id": "t1", "status": "pending"})
    client = KlingClient(api_key="k", http_client=fake)

    client.text_to_video.create(
        model="kling-v3-omni",
        prompt="a paper boat crossing a rain puddle",
        output_resolution="1080p",
        duration_seconds=10,
        enable_sound=True,
        aspect_ratio="16:9",
    )

    assert fake.calls == [
        (
            "post",
            "/api/v1/kling/text_to_video",
            {
                "model": "kling-v3-omni",
                "prompt": "a paper boat crossing a rain puddle",
                "output_resolution": "1080p",
                "duration_seconds": 10,
                "enable_sound": True,
                "aspect_ratio": "16:9"},
        )
    ]


def test_text_to_video_o1_posts_reference_fields():
    fake = FakeHttp({"id": "t1", "status": "pending"})
    client = KlingClient(api_key="k", http_client=fake)

    client.text_to_video.create(
        model="kling-o1",
        prompt="Keep <<<image_1>>> beside <<<video_1>>>",
        reference_image_urls=["https://cdn.runapi.ai/public/samples/portrait.jpg"],
        reference_video_url="https://cdn.runapi.ai/public/samples/video.mp4",
        reference_video_type="feature",
        preserve_reference_video_audio=True,
        duration_seconds=5,
    )

    assert fake.calls == [
        (
            "post",
            "/api/v1/kling/text_to_video",
            {
                "model": "kling-o1",
                "prompt": "Keep <<<image_1>>> beside <<<video_1>>>",
                "reference_image_urls": [
                    "https://cdn.runapi.ai/public/samples/portrait.jpg"
                ],
                "reference_video_url": "https://cdn.runapi.ai/public/samples/video.mp4",
                "reference_video_type": "feature",
                "preserve_reference_video_audio": True,
                "duration_seconds": 5},
        )
    ]


# --- ai_avatar ------------------------------------------------------------


def test_ai_avatar_create_posts_body():
    fake = FakeHttp({"id": "t1", "status": "pending"})
    client = KlingClient(api_key="k", http_client=fake)
    result = client.ai_avatar.create(
        model="kling-ai-avatar-pro",
        prompt="a host greeting",
        source_image_url="https://x/p.jpg",
        source_audio_url="https://x/a.mp3",
    )
    assert fake.calls == [
        (
            "post",
            "/api/v1/kling/ai_avatar",
            {
                "model": "kling-ai-avatar-pro",
                "prompt": "a host greeting",
                "source_image_url": "https://x/p.jpg",
                "source_audio_url": "https://x/a.mp3"},
        )]
    assert isinstance(result, AiAvatarResponse)


def test_ai_avatar_get_fetches_by_id():
    fake = FakeHttp({"id": "t1", "status": "processing"})
    client = KlingClient(api_key="k", http_client=fake)
    client.ai_avatar.get("t1")
    assert fake.calls == [("get", "/api/v1/kling/ai_avatar/t1", None)]


def test_ai_avatar_run_narrows_completed_type():
    fake = FakeHttp(
        {"id": "t1", "status": "pending"},
        {"id": "t1", "status": "completed", "usage": {"cost": 0.05}, "videos": [{"url": "https://x/a.mp4"}]},
    )
    client = KlingClient(api_key="k", http_client=fake)
    result = client.ai_avatar.run(
        model="kling-ai-avatar-pro",
        prompt="a host",
        source_image_url="https://x/p.jpg",
        source_audio_url="https://x/a.mp3",
    )
    assert isinstance(result, CompletedAiAvatarResponse)
    assert result.videos[0].url == "https://x/a.mp4"


# --- image_to_video -------------------------------------------------------


def test_image_to_video_create_posts_body():
    fake = FakeHttp({"id": "t1", "status": "pending"})
    client = KlingClient(api_key="k", http_client=fake)
    result = client.image_to_video.create(
        model="kling-v2.1-pro",
        prompt="zoom out slowly",
        first_frame_image_url="https://x/f.jpg",
    )
    assert fake.calls == [
        (
            "post",
            "/api/v1/kling/image_to_video",
            {
                "model": "kling-v2.1-pro",
                "prompt": "zoom out slowly",
                "first_frame_image_url": "https://x/f.jpg"},
        )]
    assert isinstance(result, ImageToVideoResponse)


def test_image_to_video_get_fetches_by_id():
    fake = FakeHttp({"id": "t1", "status": "processing"})
    client = KlingClient(api_key="k", http_client=fake)
    client.image_to_video.get("t1")
    assert fake.calls == [("get", "/api/v1/kling/image_to_video/t1", None)]


def test_image_to_video_run_narrows_completed_type():
    fake = FakeHttp(
        {"id": "t1", "status": "pending"},
        {"id": "t1", "status": "completed", "usage": {"cost": 0.05}, "videos": [{"url": "https://x/i.mp4"}]},
    )
    client = KlingClient(api_key="k", http_client=fake)
    result = client.image_to_video.run(
        model="kling-v2.1-pro", prompt="zoom", first_frame_image_url="https://x/f.jpg"
    )
    assert isinstance(result, CompletedImageToVideoResponse)
    assert result.videos[0].url == "https://x/i.mp4"


def test_image_to_video_last_frame_allowed_for_supported_model():
    fake = FakeHttp({"id": "t1", "status": "pending"})
    client = KlingClient(api_key="k", http_client=fake)
    client.image_to_video.create(
        model="kling-v2.1-pro",
        prompt="zoom",
        first_frame_image_url="https://x/f.jpg",
        last_frame_image_url="https://x/l.jpg",
    )
    assert fake.calls[0][2]["last_frame_image_url"] == "https://x/l.jpg"


def test_image_to_video_v3_turbo_posts_body():
    fake = FakeHttp({"id": "t1", "status": "pending"})
    client = KlingClient(api_key="k", http_client=fake)
    client.image_to_video.create(
        model="kling-v3-turbo-image-to-video",
        prompt="camera glides toward the lighthouse",
        first_frame_image_url="https://x/lighthouse.jpg",
        duration_seconds=7,
        output_resolution="720p",
    )
    assert fake.calls == [
        (
            "post",
            "/api/v1/kling/image_to_video",
            {
                "model": "kling-v3-turbo-image-to-video",
                "prompt": "camera glides toward the lighthouse",
                "first_frame_image_url": "https://x/lighthouse.jpg",
                "duration_seconds": 7,
                "output_resolution": "720p"},
        )]


def test_image_to_video_v26_posts_mode_sound_and_final_frame_fields():
    fake = FakeHttp({"id": "t1", "status": "pending"})
    client = KlingClient(api_key="k", http_client=fake)

    client.image_to_video.create(
        model="kling-v2.6",
        prompt="camera follows the cyclist through fog",
        first_frame_image_url="https://x/first.jpg",
        last_frame_image_url="https://x/last.jpg",
        mode="pro",
        duration_seconds=5,
        enable_sound=True,
        aspect_ratio="16:9",
    )

    assert fake.calls == [
        (
            "post",
            "/api/v1/kling/image_to_video",
            {
                "model": "kling-v2.6",
                "prompt": "camera follows the cyclist through fog",
                "first_frame_image_url": "https://x/first.jpg",
                "last_frame_image_url": "https://x/last.jpg",
                "mode": "pro",
                "duration_seconds": 5,
                "enable_sound": True,
                "aspect_ratio": "16:9"},
        )
    ]


def test_image_to_video_v3_omni_posts_resolution_sound_and_final_frame_fields():
    fake = FakeHttp({"id": "t1", "status": "pending"})
    client = KlingClient(api_key="k", http_client=fake)

    client.image_to_video.create(
        model="kling-v3-omni",
        prompt="camera follows the cyclist through fog",
        first_frame_image_url="https://cdn.runapi.ai/public/samples/portrait.jpg",
        last_frame_image_url="https://cdn.runapi.ai/public/samples/image.jpg",
        output_resolution="4k",
        duration_seconds=5,
        enable_sound=False,
        aspect_ratio="9:16",
    )

    assert fake.calls == [
        (
            "post",
            "/api/v1/kling/image_to_video",
            {
                "model": "kling-v3-omni",
                "prompt": "camera follows the cyclist through fog",
                "first_frame_image_url": "https://cdn.runapi.ai/public/samples/portrait.jpg",
                "last_frame_image_url": "https://cdn.runapi.ai/public/samples/image.jpg",
                "output_resolution": "4k",
                "duration_seconds": 5,
                "enable_sound": False,
                "aspect_ratio": "9:16"},
        )
    ]


# --- motion_control -------------------------------------------------------


def test_motion_control_create_posts_body():
    fake = FakeHttp({"id": "t1", "status": "pending"})
    client = KlingClient(api_key="k", http_client=fake)
    result = client.motion_control.create(
        model="kling-3.0",
        source_image_url="https://x/s.jpg",
        reference_video_url="https://x/r.mp4",
        output_resolution="720p",
    )
    assert fake.calls == [
        (
            "post",
            "/api/v1/kling/motion_control",
            {
                "model": "kling-3.0",
                "source_image_url": "https://x/s.jpg",
                "reference_video_url": "https://x/r.mp4",
                "output_resolution": "720p"},
        )]
    assert isinstance(result, MotionControlResponse)


def test_motion_control_create_posts_v26_body():
    fake = FakeHttp({"id": "t26", "status": "pending"})
    client = KlingClient(api_key="k", http_client=fake)
    client.motion_control.create(
        model="kling-v2.6",
        source_image_url="https://x/s.jpg",
        reference_video_url="https://x/r.mp4",
        output_resolution="1080p",
        character_orientation="image",
    )
    assert fake.calls[0][2]["model"] == "kling-v2.6"
    assert fake.calls[0][2]["output_resolution"] == "1080p"
    assert fake.calls[0][2]["character_orientation"] == "image"


def test_motion_control_get_fetches_by_id():
    fake = FakeHttp({"id": "t1", "status": "processing"})
    client = KlingClient(api_key="k", http_client=fake)
    client.motion_control.get("t1")
    assert fake.calls == [("get", "/api/v1/kling/motion_control/t1", None)]


def test_motion_control_run_narrows_completed_type():
    fake = FakeHttp(
        {"id": "t1", "status": "pending"},
        {"id": "t1", "status": "completed", "usage": {"cost": 0.05}, "videos": [{"url": "https://x/m.mp4"}]},
    )
    client = KlingClient(api_key="k", http_client=fake)
    result = client.motion_control.run(
        model="kling-3.0",
        source_image_url="https://x/s.jpg",
        reference_video_url="https://x/r.mp4",
        output_resolution="720p",
    )
    assert isinstance(result, CompletedMotionControlResponse)
    assert result.videos[0].url == "https://x/m.mp4"


def test_text_to_video_accepts_reference_image_model():
    fake = FakeHttp({"id": "reference-image", "status": "processing"})
    client = KlingClient(api_key="k", http_client=fake)
    params = {
        "model": "kling-v3-omni-reference",
        "prompt": "Keep the subject from the reference image",
        "reference_image_urls": ["https://cdn.runapi.ai/public/samples/image.jpg"],
        "aspect_ratio": "16:9"}

    client.text_to_video.create(**params)
    assert fake.calls == [("post", "/api/v1/kling/text_to_video", params)]


def test_edit_video_create_get_and_run_for_edit_model():
    fake = FakeHttp(
        {"id": "edit-create", "status": "processing"},
        {"id": "edit-get", "status": "processing"},
        {"id": "edit-run", "status": "processing"},
        {"id": "edit-run", "status": "completed", "usage": {"cost": 0.05}, "videos": [{"url": "https://file.runapi.ai/edit.mp4"}]},
    )
    client = KlingClient(api_key="k", http_client=fake)
    params = {
        "model": "kling-v3-omni-edit",
        "prompt": "Turn the source video into a watercolor scene",
        "source_video_url": "https://cdn.runapi.ai/public/samples/video.mp4",
        "aspect_ratio": "auto"}

    client.edit_video.create(**params)
    client.edit_video.get("edit-get")
    result = client.edit_video.run(**params)

    assert fake.calls == [
        ("post", "/api/v1/kling/edit_video", params),
        ("get", "/api/v1/kling/edit_video/edit-get", None),
        ("post", "/api/v1/kling/edit_video", params),
        ("get", "/api/v1/kling/edit_video/edit-run", None)]
    assert result.status == "completed"
