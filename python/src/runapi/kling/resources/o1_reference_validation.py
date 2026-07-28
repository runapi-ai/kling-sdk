"""Cross-field validation shared by Kling O1 video resources."""

from __future__ import annotations

import ipaddress
import re
from pathlib import PurePosixPath
from typing import Any, Dict
from urllib.parse import urlparse

from runapi.core import ValidationError

O1_MODEL = "kling-o1"
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png"}
VIDEO_EXTENSIONS = {".mp4", ".mov"}
NONCANONICAL_IPV4_LITERAL = re.compile(
    r"(?:0x[0-9a-f]+|\d+)(?:\.(?:0x[0-9a-f]+|\d+)){0,3}",
    re.IGNORECASE,
)
BLOCKED_IP_NETWORKS = tuple(
    ipaddress.ip_network(cidr)
    for cidr in (
        "0.0.0.0/8",
        "10.0.0.0/8",
        "100.64.0.0/10",
        "127.0.0.0/8",
        "169.254.0.0/16",
        "172.16.0.0/12",
        "192.0.0.0/24",
        "192.0.2.0/24",
        "192.88.99.0/24",
        "192.168.0.0/16",
        "198.18.0.0/15",
        "198.51.100.0/24",
        "203.0.113.0/24",
        "224.0.0.0/4",
        "240.0.0.0/4",
        "255.255.255.255/32",
        "::/128",
        "::1/128",
        "64:ff9b::/96",
        "64:ff9b:1::/48",
        "100::/64",
        "2001::/32",
        "2001:2::/48",
        "2001:db8::/32",
        "2002::/16",
        "3fff::/20",
        "fc00::/7",
        "fe80::/10",
        "ff00::/8",
    )
)


def validate_kling_o1_references(params: Dict[str, Any]) -> None:
    if params.get("model") != O1_MODEL:
        return
    if params.get("enable_sound") is True:
        raise ValidationError(f"enable_sound is not supported by {O1_MODEL}")

    for field in ("first_frame_image_url", "last_frame_image_url"):
        value = params.get(field)
        if value and not _is_public_http_url(value):
            raise ValidationError(f"{field} must be a public HTTP or HTTPS URL")
        if value and _url_extension(value) not in IMAGE_EXTENSIONS:
            raise ValidationError(f"{field} must use a JPG, JPEG, or PNG URL")

    prompt = params.get("prompt")
    if not isinstance(prompt, str):
        raise ValidationError("prompt must be a string")
    reference_images = params.get("reference_image_urls") or []
    reference_video_url = params.get("reference_video_url")
    if reference_video_url is not None and not isinstance(reference_video_url, str):
        raise ValidationError("reference_video_url must be a string")
    if params.get("last_frame_image_url") and (
        reference_images or reference_video_url
    ):
        raise ValidationError(
            "last_frame_image_url cannot be combined with "
            "reference_image_urls or reference_video_url"
        )
    if reference_video_url and len(reference_images) > 4:
        raise ValidationError(
            "reference_image_urls must contain at most 4 items when "
            "reference_video_url is present"
        )

    for index, image_url in enumerate(reference_images):
        if not isinstance(image_url, str):
            raise ValidationError(
                f"reference_image_urls[{index}] must be a string"
            )
        if not _is_public_http_url(image_url):
            raise ValidationError(
                f"reference_image_urls[{index}] must be a public HTTP or HTTPS URL"
            )
        if _url_extension(image_url) not in IMAGE_EXTENSIONS:
            raise ValidationError(
                f"reference_image_urls[{index}] must use a JPG, JPEG, or PNG URL"
            )
        marker = f"<<<image_{index + 1}>>>"
        if marker not in prompt:
            raise ValidationError(
                f"prompt must reference reference_image_urls[{index}] as {marker}"
            )

    for marker_index in re.findall(r"<<<image_(\d+)>>>", prompt):
        index = int(marker_index)
        if index < 1 or index > len(reference_images):
            raise ValidationError(f"prompt references missing image_{index}")

    if not reference_video_url:
        if "reference_video_type" in params:
            raise ValidationError("reference_video_type requires reference_video_url")
        if "preserve_reference_video_audio" in params:
            raise ValidationError(
                "preserve_reference_video_audio requires reference_video_url"
            )
        missing_marker = re.search(r"<<<video_([^>]+)>>>", prompt)
        if missing_marker:
            raise ValidationError(
                f"prompt references missing video_{missing_marker.group(1)}"
            )
        return

    if not _is_public_http_url(reference_video_url):
        raise ValidationError(
            "reference_video_url must be a public HTTP or HTTPS URL"
        )
    if _url_extension(reference_video_url) not in VIDEO_EXTENSIONS:
        raise ValidationError("reference_video_url must use an MP4 or MOV URL")
    if "<<<video_1>>>" not in prompt:
        raise ValidationError(
            "prompt must reference reference_video_url as <<<video_1>>>"
        )
    if any(index != "1" for index in re.findall(r"<<<video_([^>]+)>>>", prompt)):
        raise ValidationError("prompt may only reference video_1")

    reference_video_type = params.get("reference_video_type") or "base"
    if reference_video_type == "base" and (
        params.get("first_frame_image_url") or params.get("last_frame_image_url")
    ):
        raise ValidationError(
            "reference_video_type base cannot be combined with "
            "first_frame_image_url or last_frame_image_url"
        )


def _url_extension(value: str) -> str:
    return PurePosixPath(urlparse(str(value)).path).suffix.lower()


def _is_public_http_url(value: str) -> bool:
    try:
        parsed = urlparse(value)
        return (
            parsed.scheme.lower() in {"http", "https"}
            and bool(parsed.hostname)
            and parsed.username is None
            and parsed.password is None
            and not _is_blocked_host(parsed.hostname)
        )
    except (TypeError, ValueError):
        return False


def _is_blocked_host(hostname: str) -> bool:
    host = hostname.lower().rstrip(".")
    if host == "localhost" or host.endswith(".localhost"):
        return True
    try:
        address = ipaddress.ip_address(host)
    except ValueError:
        return NONCANONICAL_IPV4_LITERAL.fullmatch(host) is not None
    if isinstance(address, ipaddress.IPv6Address) and address.ipv4_mapped:
        address = address.ipv4_mapped
    return any(address in network for network in BLOCKED_IP_NETWORKS)
