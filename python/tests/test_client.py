import pytest

from runapi.core import config
from runapi.core.errors import AuthenticationError, ValidationError
from runapi.kling import KlingClient
from runapi.kling.resources.ai_avatar import AiAvatar
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


def test_exposes_resource_accessors():
    client = KlingClient(api_key="k", http_client=FakeHttp())
    assert isinstance(client.text_to_video, TextToVideo)
    assert isinstance(client.ai_avatar, AiAvatar)
    assert isinstance(client.image_to_video, ImageToVideo)
    assert isinstance(client.motion_control, MotionControl)


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
        ),
    ]
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
                    "https://upload.wikimedia.org/wikipedia/commons/9/9a/Pug_600.jpg",
                ],
                "element_input_audio_urls": ["https://cdn.runapi.ai/public/samples/music.mp3"],
            },
            {
                "name": "element_run",
                "description": "running dog",
                "element_input_urls": ["https://cdn.runapi.ai/public/samples/video.mp4"],
                "start_time": 1000,
                "end_time": 6000,
            },
        ],
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
                            "https://upload.wikimedia.org/wikipedia/commons/9/9a/Pug_600.jpg",
                        ],
                        "element_input_audio_urls": [
                            "https://cdn.runapi.ai/public/samples/music.mp3"
                        ],
                    },
                    {
                        "name": "element_run",
                        "description": "running dog",
                        "element_input_urls": [
                            "https://cdn.runapi.ai/public/samples/video.mp4"
                        ],
                        "start_time": 1000,
                        "end_time": 6000,
                    },
                ],
            },
        ),
    ]
    assert isinstance(result, TextToVideoResponse)


def test_text_to_video_get_fetches_by_id():
    fake = FakeHttp({"id": "t1", "status": "processing"})
    client = KlingClient(api_key="k", http_client=fake)
    client.text_to_video.get("t1")
    assert fake.calls == [("get", "/api/v1/kling/text_to_video/t1", None)]


def test_text_to_video_run_narrows_completed_type():
    fake = FakeHttp(
        {"id": "t1", "status": "pending"},
        {"id": "t1", "status": "completed", "videos": [{"url": "https://x/y.mp4"}]},
    )
    client = KlingClient(api_key="k", http_client=fake)
    result = client.text_to_video.run(model="kling-3.0", prompt="a serene forest")
    assert isinstance(result, CompletedTextToVideoResponse)
    assert result.videos[0].url == "https://x/y.mp4"


def test_text_to_video_rejects_missing_model():
    client = KlingClient(api_key="k", http_client=FakeHttp())
    with pytest.raises(ValidationError, match="model must be one of:"):
        client.text_to_video.create(prompt="hello")


def test_text_to_video_rejects_unknown_model():
    client = KlingClient(api_key="k", http_client=FakeHttp())
    with pytest.raises(ValidationError, match="model must be one of:"):
        client.text_to_video.create(model="nope", prompt="hello")


def test_text_to_video_requires_prompt():
    client = KlingClient(api_key="k", http_client=FakeHttp())
    with pytest.raises(ValidationError, match="prompt is required"):
        client.text_to_video.create(model="kling-3.0")


def test_text_to_video_multi_shots_requires_enable_sound():
    client = KlingClient(api_key="k", http_client=FakeHttp())
    with pytest.raises(ValidationError, match="enable_sound must be true when multi_shots is true"):
        client.text_to_video.create(model="kling-3.0", multi_shots=True)


def test_text_to_video_multi_shots_rejects_last_frame():
    client = KlingClient(api_key="k", http_client=FakeHttp())
    with pytest.raises(
        ValidationError, match="last_frame_image_url is not supported when multi_shots is true"
    ):
        client.text_to_video.create(
            model="kling-3.0",
            multi_shots=True,
            enable_sound=True,
            last_frame_image_url="https://x/a.png",
            multi_prompt=[{"prompt": "shot one", "duration_seconds": 5}],
        )


def test_text_to_video_multi_prompt_must_be_non_empty():
    client = KlingClient(api_key="k", http_client=FakeHttp())
    with pytest.raises(
        ValidationError, match="multi_prompt must be a non-empty array when multi_shots is true"
    ):
        client.text_to_video.create(
            model="kling-3.0", multi_shots=True, enable_sound=True, multi_prompt=[]
        )


def test_text_to_video_multi_prompt_requires_prompt():
    client = KlingClient(api_key="k", http_client=FakeHttp())
    with pytest.raises(ValidationError, match=r"multi_prompt\[0\].prompt is required"):
        client.text_to_video.create(
            model="kling-3.0",
            multi_shots=True,
            enable_sound=True,
            multi_prompt=[{"duration_seconds": 5}],
        )


def test_text_to_video_multi_prompt_max_length():
    client = KlingClient(api_key="k", http_client=FakeHttp())
    with pytest.raises(ValidationError, match=r"multi_prompt\[0\].prompt exceeds 500 characters"):
        client.text_to_video.create(
            model="kling-3.0",
            multi_shots=True,
            enable_sound=True,
            multi_prompt=[{"prompt": "x" * 501, "duration_seconds": 5}],
        )


def test_text_to_video_multi_prompt_requires_duration():
    client = KlingClient(api_key="k", http_client=FakeHttp())
    with pytest.raises(ValidationError, match=r"multi_prompt\[0\].duration_seconds is required"):
        client.text_to_video.create(
            model="kling-3.0",
            multi_shots=True,
            enable_sound=True,
            multi_prompt=[{"prompt": "shot one"}],
        )


def test_text_to_video_multi_prompt_duration_range():
    client = KlingClient(api_key="k", http_client=FakeHttp())
    with pytest.raises(
        ValidationError, match=r"multi_prompt\[0\].duration_seconds must be between 1 and 12"
    ):
        client.text_to_video.create(
            model="kling-3.0",
            multi_shots=True,
            enable_sound=True,
            multi_prompt=[{"prompt": "shot one", "duration_seconds": 20}],
        )


def test_text_to_video_rejects_invalid_output_resolution():
    client = KlingClient(api_key="k", http_client=FakeHttp())
    with pytest.raises(ValidationError, match="output_resolution must be one of: 720p, 1080p, 4k"):
        client.text_to_video.create(model="kling-3.0", prompt="hello", output_resolution="9k")


def test_text_to_video_rejects_invalid_aspect_ratio():
    client = KlingClient(api_key="k", http_client=FakeHttp())
    with pytest.raises(ValidationError, match=r"aspect_ratio must be one of: 16:9, 9:16, 1:1"):
        client.text_to_video.create(model="kling-3.0", prompt="hello", aspect_ratio="4:3")


def test_text_to_video_fixed_duration_models():
    client = KlingClient(api_key="k", http_client=FakeHttp())
    with pytest.raises(ValidationError, match="duration_seconds must be one of: 5, 10"):
        client.text_to_video.create(
            model="kling-v2.1-master-text-to-video", prompt="hello", duration_seconds=7
        )


def test_text_to_video_range_duration_models():
    client = KlingClient(api_key="k", http_client=FakeHttp())
    with pytest.raises(
        ValidationError,
        match="duration_seconds must be one of: 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15",
    ):
        client.text_to_video.create(model="kling-3.0", prompt="hello", duration_seconds=20)


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
                "output_resolution": "1080p",
            },
        ),
    ]


def test_text_to_video_v3_turbo_rejects_unsupported_fields():
    fake = FakeHttp()
    client = KlingClient(api_key="k", http_client=fake)
    with pytest.raises(
        ValidationError, match="enable_sound is not supported by kling-v3-turbo-text-to-video"
    ):
        client.text_to_video.create(
            model="kling-v3-turbo-text-to-video",
            prompt="a quiet city street after rain",
            enable_sound=False,
        )
    assert fake.calls == []


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
                "aspect_ratio": "16:9",
            },
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
                "aspect_ratio": "16:9",
            },
        )
    ]


def test_text_to_video_v26_rejects_sound_outside_pro_mode():
    fake = FakeHttp()
    client = KlingClient(api_key="k", http_client=fake)

    with pytest.raises(
        ValidationError, match="enable_sound requires mode pro for kling-v2.6"
    ):
        client.text_to_video.create(
            model="kling-v2.6", prompt="test", enable_sound=True
        )
    assert fake.calls == []


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
                "duration_seconds": 5,
            },
        )
    ]


def test_text_to_video_o1_rejects_reference_without_prompt_marker():
    fake = FakeHttp()
    client = KlingClient(api_key="k", http_client=fake)

    with pytest.raises(
        ValidationError,
        match=r"prompt must reference reference_image_urls\[0\] as <<<image_1>>>",
    ):
        client.text_to_video.create(
            model="kling-o1",
            prompt="Keep the same subject",
            reference_image_urls=[
                "https://cdn.runapi.ai/public/samples/portrait.jpg"
            ],
        )
    assert fake.calls == []


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
                "source_audio_url": "https://x/a.mp3",
            },
        ),
    ]
    assert isinstance(result, AiAvatarResponse)


def test_ai_avatar_get_fetches_by_id():
    fake = FakeHttp({"id": "t1", "status": "processing"})
    client = KlingClient(api_key="k", http_client=fake)
    client.ai_avatar.get("t1")
    assert fake.calls == [("get", "/api/v1/kling/ai_avatar/t1", None)]


def test_ai_avatar_run_narrows_completed_type():
    fake = FakeHttp(
        {"id": "t1", "status": "pending"},
        {"id": "t1", "status": "completed", "videos": [{"url": "https://x/a.mp4"}]},
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


def test_ai_avatar_rejects_unknown_model():
    client = KlingClient(api_key="k", http_client=FakeHttp())
    with pytest.raises(ValidationError, match="model must be one of:"):
        client.ai_avatar.create(model="nope")


def test_ai_avatar_requires_source_image_url():
    client = KlingClient(api_key="k", http_client=FakeHttp())
    with pytest.raises(ValidationError, match="source_image_url is required"):
        client.ai_avatar.create(
            model="kling-ai-avatar-pro",
            prompt="a host",
            source_audio_url="https://x/a.mp3",
        )


def test_ai_avatar_requires_source_audio_url():
    client = KlingClient(api_key="k", http_client=FakeHttp())
    with pytest.raises(ValidationError, match="source_audio_url is required"):
        client.ai_avatar.create(
            model="kling-ai-avatar-pro",
            prompt="a host",
            source_image_url="https://x/p.jpg",
        )


def test_ai_avatar_requires_prompt():
    client = KlingClient(api_key="k", http_client=FakeHttp())
    with pytest.raises(ValidationError, match="prompt is required"):
        client.ai_avatar.create(
            model="kling-ai-avatar-pro",
            source_image_url="https://x/p.jpg",
            source_audio_url="https://x/a.mp3",
        )


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
                "first_frame_image_url": "https://x/f.jpg",
            },
        ),
    ]
    assert isinstance(result, ImageToVideoResponse)


def test_image_to_video_get_fetches_by_id():
    fake = FakeHttp({"id": "t1", "status": "processing"})
    client = KlingClient(api_key="k", http_client=fake)
    client.image_to_video.get("t1")
    assert fake.calls == [("get", "/api/v1/kling/image_to_video/t1", None)]


def test_image_to_video_run_narrows_completed_type():
    fake = FakeHttp(
        {"id": "t1", "status": "pending"},
        {"id": "t1", "status": "completed", "videos": [{"url": "https://x/i.mp4"}]},
    )
    client = KlingClient(api_key="k", http_client=fake)
    result = client.image_to_video.run(
        model="kling-v2.1-pro", prompt="zoom", first_frame_image_url="https://x/f.jpg"
    )
    assert isinstance(result, CompletedImageToVideoResponse)
    assert result.videos[0].url == "https://x/i.mp4"


def test_image_to_video_rejects_unknown_model():
    client = KlingClient(api_key="k", http_client=FakeHttp())
    with pytest.raises(ValidationError, match="model must be one of:"):
        client.image_to_video.create(model="nope")


def test_image_to_video_requires_prompt():
    client = KlingClient(api_key="k", http_client=FakeHttp())
    with pytest.raises(ValidationError, match="prompt is required"):
        client.image_to_video.create(
            model="kling-v2.1-pro", first_frame_image_url="https://x/f.jpg"
        )


def test_image_to_video_requires_first_frame_image_url():
    client = KlingClient(api_key="k", http_client=FakeHttp())
    with pytest.raises(ValidationError, match="first_frame_image_url is required"):
        client.image_to_video.create(model="kling-v2.1-pro", prompt="zoom")


def test_image_to_video_rejects_invalid_duration():
    client = KlingClient(api_key="k", http_client=FakeHttp())
    with pytest.raises(ValidationError, match="duration_seconds must be one of: 5, 10"):
        client.image_to_video.create(
            model="kling-v2.1-pro",
            prompt="zoom",
            first_frame_image_url="https://x/f.jpg",
            duration_seconds=7,
        )


def test_image_to_video_last_frame_model_gate():
    client = KlingClient(api_key="k", http_client=FakeHttp())
    with pytest.raises(
        ValidationError,
        match="last_frame_image_url is only supported by kling-v2.5-turbo-image-to-video-pro and kling-v2.1-pro",
    ):
        client.image_to_video.create(
            model="kling-v2.1-standard",
            prompt="zoom",
            first_frame_image_url="https://x/f.jpg",
            last_frame_image_url="https://x/l.jpg",
        )


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
                "output_resolution": "720p",
            },
        ),
    ]


def test_image_to_video_v3_turbo_rejects_unsupported_fields():
    fake = FakeHttp()
    client = KlingClient(api_key="k", http_client=fake)
    with pytest.raises(
        ValidationError, match="last_frame_image_url is not supported by kling-v3-turbo-image-to-video"
    ):
        client.image_to_video.create(
            model="kling-v3-turbo-image-to-video",
            prompt="camera glides toward the lighthouse",
            first_frame_image_url="https://x/lighthouse.jpg",
            last_frame_image_url="https://x/lighthouse-end.jpg",
        )
    assert fake.calls == []


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
                "aspect_ratio": "16:9",
            },
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
                "aspect_ratio": "9:16",
            },
        )
    ]


def test_image_to_video_v26_rejects_sound_outside_pro_mode():
    client = KlingClient(api_key="k", http_client=FakeHttp())

    with pytest.raises(
        ValidationError, match="enable_sound requires mode pro for kling-v2.6"
    ):
        client.image_to_video.create(
            model="kling-v2.6",
            prompt="test",
            first_frame_image_url="https://x/first.jpg",
            enable_sound=True,
        )


@pytest.mark.parametrize(
    ("extra", "message"),
    [
        ({}, "last_frame_image_url requires mode pro for kling-v2.6"),
        (
            {"mode": "pro", "duration_seconds": 10},
            "last_frame_image_url requires duration_seconds 5 for kling-v2.6",
        ),
    ],
)
def test_image_to_video_v26_rejects_invalid_final_frame_combinations(extra, message):
    client = KlingClient(api_key="k", http_client=FakeHttp())

    with pytest.raises(ValidationError, match=message):
        client.image_to_video.create(
            model="kling-v2.6",
            prompt="test",
            first_frame_image_url="https://x/first.jpg",
            last_frame_image_url="https://x/last.jpg",
            **extra,
        )


def test_image_to_video_v3_omni_rejects_final_frame_outside_five_seconds():
    fake = FakeHttp()
    client = KlingClient(api_key="k", http_client=fake)

    with pytest.raises(
        ValidationError,
        match="last_frame_image_url requires duration_seconds 5 for kling-v3-omni",
    ):
        client.image_to_video.create(
            model="kling-v3-omni",
            prompt="test",
            first_frame_image_url="https://cdn.runapi.ai/public/samples/portrait.jpg",
            last_frame_image_url="https://cdn.runapi.ai/public/samples/image.jpg",
            duration_seconds=7,
        )


def test_image_to_video_o1_rejects_base_video_with_frame_input():
    fake = FakeHttp()
    client = KlingClient(api_key="k", http_client=fake)

    with pytest.raises(
        ValidationError,
        match="reference_video_type base cannot be combined with first_frame_image_url or last_frame_image_url",
    ):
        client.image_to_video.create(
            model="kling-o1",
            prompt="Use <<<video_1>>> as the base",
            first_frame_image_url="https://cdn.runapi.ai/public/samples/image-to-video.jpg",
            reference_video_url="https://cdn.runapi.ai/public/samples/video.mp4",
            reference_video_type="base",
        )
    assert fake.calls == []


def test_image_to_video_o1_rejects_tail_frame_with_reference_media():
    fake = FakeHttp()
    client = KlingClient(api_key="k", http_client=fake)

    with pytest.raises(
        ValidationError,
        match="last_frame_image_url cannot be combined with reference_image_urls or reference_video_url",
    ):
        client.image_to_video.create(
            model="kling-o1",
            prompt="Move toward <<<image_1>>>",
            first_frame_image_url="https://cdn.runapi.ai/public/samples/image-to-video.jpg",
            last_frame_image_url="https://cdn.runapi.ai/public/samples/last-frame.jpg",
            reference_image_urls=["https://cdn.runapi.ai/public/samples/portrait.jpg"],
        )
    assert fake.calls == []


def test_text_to_video_o1_rejects_missing_video_reference():
    fake = FakeHttp()
    client = KlingClient(api_key="k", http_client=fake)

    with pytest.raises(ValidationError, match="prompt references missing video_1"):
        client.text_to_video.create(
            model="kling-o1",
            prompt="Follow <<<video_1>>>",
        )
    assert fake.calls == []


@pytest.mark.parametrize(
    "reference_url",
    [
        "file:///etc/passwd.jpg",
        "http://localhost/reference.jpg",
        "http://127.0.0.1/reference.jpg",
        "http://169.254.169.254/reference.jpg",
        "http://[::ffff:127.0.0.1]/reference.jpg",
        "http://2130706433/reference.jpg",
        "http://127.1/reference.jpg",
        "http://0177.0.0.1/reference.jpg",
        "http://0x7f000001/reference.jpg",
    ],
)
def test_text_to_video_o1_rejects_non_public_reference_media(reference_url):
    fake = FakeHttp()
    client = KlingClient(api_key="k", http_client=fake)

    with pytest.raises(
        ValidationError,
        match=r"reference_image_urls\[0\] must be a public HTTP or HTTPS URL",
    ):
        client.text_to_video.create(
            model="kling-o1",
            prompt="Use <<<image_1>>>",
            reference_image_urls=[reference_url],
        )
    assert fake.calls == []


# --- motion_control -------------------------------------------------------


def test_motion_control_create_posts_body():
    fake = FakeHttp({"id": "t1", "status": "pending"})
    client = KlingClient(api_key="k", http_client=fake)
    result = client.motion_control.create(
        model="kling-3.0",
        source_image_url="https://x/s.jpg",
        reference_video_url="https://x/r.mp4",
    )
    assert fake.calls == [
        (
            "post",
            "/api/v1/kling/motion_control",
            {
                "model": "kling-3.0",
                "source_image_url": "https://x/s.jpg",
                "reference_video_url": "https://x/r.mp4",
            },
        ),
    ]
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


@pytest.mark.parametrize(
    ("missing", "message"),
    [
        ("output_resolution", "output_resolution is required"),
        ("character_orientation", "character_orientation is required"),
    ],
)
def test_motion_control_v26_requires_model_fields(missing, message):
    fake = FakeHttp()
    client = KlingClient(api_key="k", http_client=fake)
    params = {
        "model": "kling-v2.6",
        "source_image_url": "https://x/s.jpg",
        "reference_video_url": "https://x/r.mp4",
        "output_resolution": "720p",
        "character_orientation": "video",
    }
    del params[missing]

    with pytest.raises(ValidationError, match=message):
        client.motion_control.create(**params)
    assert fake.calls == []


def test_motion_control_v26_rejects_background_source():
    fake = FakeHttp()
    client = KlingClient(api_key="k", http_client=fake)
    with pytest.raises(
        ValidationError,
        match="background_source is not allowed when model is kling-v2.6",
    ):
        client.motion_control.create(
            model="kling-v2.6",
            source_image_url="https://x/s.jpg",
            reference_video_url="https://x/r.mp4",
            output_resolution="720p",
            character_orientation="video",
            background_source="video",
        )
    assert fake.calls == []


def test_motion_control_get_fetches_by_id():
    fake = FakeHttp({"id": "t1", "status": "processing"})
    client = KlingClient(api_key="k", http_client=fake)
    client.motion_control.get("t1")
    assert fake.calls == [("get", "/api/v1/kling/motion_control/t1", None)]


def test_motion_control_run_narrows_completed_type():
    fake = FakeHttp(
        {"id": "t1", "status": "pending"},
        {"id": "t1", "status": "completed", "videos": [{"url": "https://x/m.mp4"}]},
    )
    client = KlingClient(api_key="k", http_client=fake)
    result = client.motion_control.run(
        model="kling-3.0",
        source_image_url="https://x/s.jpg",
        reference_video_url="https://x/r.mp4",
    )
    assert isinstance(result, CompletedMotionControlResponse)
    assert result.videos[0].url == "https://x/m.mp4"


def test_motion_control_rejects_unknown_model():
    client = KlingClient(api_key="k", http_client=FakeHttp())
    with pytest.raises(ValidationError, match="model must be one of:"):
        client.motion_control.create(model="nope")


def test_motion_control_rejects_invalid_output_resolution():
    client = KlingClient(api_key="k", http_client=FakeHttp())
    with pytest.raises(ValidationError, match="output_resolution must be one of: 720p, 1080p"):
        client.motion_control.create(model="kling-3.0", output_resolution="4k")


def test_motion_control_rejects_invalid_character_orientation():
    client = KlingClient(api_key="k", http_client=FakeHttp())
    with pytest.raises(ValidationError, match="character_orientation must be one of: video, image"):
        client.motion_control.create(model="kling-3.0", character_orientation="upside-down")


def test_motion_control_rejects_invalid_background_source():
    client = KlingClient(api_key="k", http_client=FakeHttp())
    with pytest.raises(ValidationError, match="background_source must be one of: video, image"):
        client.motion_control.create(model="kling-3.0", background_source="audio")


def test_motion_control_requires_source_image_url():
    client = KlingClient(api_key="k", http_client=FakeHttp())
    with pytest.raises(ValidationError, match="source_image_url is required"):
        client.motion_control.create(
            model="kling-3.0", reference_video_url="https://x/r.mp4"
        )


def test_motion_control_requires_reference_video_url():
    client = KlingClient(api_key="k", http_client=FakeHttp())
    with pytest.raises(ValidationError, match="reference_video_url is required"):
        client.motion_control.create(model="kling-3.0", source_image_url="https://x/s.jpg")


def test_text_to_video_non_numeric_duration_raises_validation_error():
    # Regression: a non-numeric duration must raise the SDK's ValidationError,
    # not a bare error from the contract enum coercion.
    client = KlingClient(api_key="k", http_client=FakeHttp())
    with pytest.raises(ValidationError, match="duration_seconds must be one of:"):
        client.text_to_video.create(model="kling-3.0", prompt="a cat", duration_seconds="abc")


def test_multi_prompt_non_numeric_duration_raises_validation_error():
    client = KlingClient(api_key="k", http_client=FakeHttp())
    with pytest.raises(ValidationError, match=r"multi_prompt\[0\].duration_seconds must be between"):
        client.text_to_video.create(
            model="kling-3.0",
            multi_shots=True,
            enable_sound=True,
            multi_prompt=[{"prompt": "shot one", "duration_seconds": "abc"}],
        )
