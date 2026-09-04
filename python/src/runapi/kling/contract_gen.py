CONTRACT = {
    "avatar": {
        "models": ["kling-ai-avatar-pro", "kling-ai-avatar-standard", "kling-ai-avatar-v1-pro", "kling-v1-avatar-standard"],
        "fields_by_model": {
            "kling-ai-avatar-pro": {
                "model": {
                    "required": True
                },
                "prompt": {
                    "required": True
                },
                "source_audio_url": {
                    "required": True
                },
                "source_image_url": {
                    "required": True
                }
            },
            "kling-ai-avatar-standard": {
                "model": {
                    "required": True
                },
                "prompt": {
                    "required": True
                },
                "source_audio_url": {
                    "required": True
                },
                "source_image_url": {
                    "required": True
                }
            },
            "kling-ai-avatar-v1-pro": {
                "model": {
                    "required": True
                },
                "prompt": {
                    "required": True
                },
                "source_audio_url": {
                    "required": True
                },
                "source_image_url": {
                    "required": True
                }
            },
            "kling-v1-avatar-standard": {
                "model": {
                    "required": True
                },
                "prompt": {
                    "required": True
                },
                "source_audio_url": {
                    "required": True
                },
                "source_image_url": {
                    "required": True
                }
            }
        }
    },
    "edit-video": {
        "models": ["kling-v3-omni-edit", "kling-v3-omni-reference"],
        "fields_by_model": {
            "kling-v3-omni-edit": {
                "aspect_ratio": {
                    "enum": ["auto", "16:9", "9:16", "1:1"]
                },
                "duration_seconds": {
                    "enum": [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
                    "type": "integer"
                },
                "model": {
                    "required": True
                },
                "output_resolution": {
                    "enum": ["720p", "1080p", "4k"]
                },
                "prompt": {
                    "required": True,
                    "min": 1,
                    "max": 2500,
                    "length": True
                },
                "reference_image_urls": {
                    "min_items": 1,
                    "max_items": 4
                }
            },
            "kling-v3-omni-reference": {
                "aspect_ratio": {
                    "enum": ["auto", "16:9", "9:16", "1:1"]
                },
                "duration_seconds": {
                    "enum": [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
                    "type": "integer"
                },
                "model": {
                    "required": True
                },
                "output_resolution": {
                    "enum": ["720p", "1080p", "4k"]
                },
                "prompt": {
                    "required": True,
                    "min": 1,
                    "max": 2500,
                    "length": True
                },
                "reference_image_urls": {
                    "min_items": 1,
                    "max_items": 4
                }
            }
        },
        "rules": [{
            "when": {
                "model": "kling-v3-omni-edit",
                "source_video_url": {
                    "present": True
                }
            },
            "forbidden": ["source_task_id"]
        }, {
            "when": {
                "model": "kling-v3-omni-edit",
                "source_task_id": {
                    "present": True
                }
            },
            "forbidden": ["source_video_url"]
        }, {
            "enum": {
                "aspect_ratio": ["auto"],
                "duration_seconds": [5]
            },
            "when": {
                "model": "kling-v3-omni-edit",
                "source_video_url": {
                    "present": True
                },
                "reference_image_urls": {
                    "present": False
                }
            },
            "required": ["aspect_ratio"]
        }, {
            "enum": {
                "aspect_ratio": ["auto"],
                "duration_seconds": [5]
            },
            "when": {
                "model": "kling-v3-omni-edit",
                "source_task_id": {
                    "present": True
                },
                "reference_image_urls": {
                    "present": False
                }
            },
            "required": ["aspect_ratio"]
        }, {
            "enum": {
                "aspect_ratio": ["16:9", "9:16", "1:1"]
            },
            "when": {
                "model": "kling-v3-omni-edit",
                "source_video_url": {
                    "present": True
                },
                "reference_image_urls": {
                    "present": True
                }
            },
            "required": ["aspect_ratio"]
        }, {
            "enum": {
                "aspect_ratio": ["16:9", "9:16", "1:1"]
            },
            "when": {
                "model": "kling-v3-omni-edit",
                "source_task_id": {
                    "present": True
                },
                "reference_image_urls": {
                    "present": True
                }
            },
            "required": ["aspect_ratio"]
        }, {
            "when": {
                "model": "kling-v3-omni-edit",
                "source_task_id": {
                    "present": False
                },
                "source_video_url": {
                    "present": False
                }
            },
            "required_any": ["source_video_url", "source_task_id"]
        }, {
            "enum": {
                "aspect_ratio": ["16:9", "9:16", "1:1"],
                "enable_sound": [False]
            },
            "when": {
                "model": "kling-v3-omni-reference",
                "source_task_id": {
                    "present": True
                },
                "reference_image_urls": {
                    "present": True
                }
            },
            "required": ["aspect_ratio"]
        }, {
            "when": {
                "model": "kling-v3-omni-reference",
                "source_task_id": {
                    "present": False
                },
                "source_video_url": {
                    "present": False
                }
            },
            "required_any": ["source_video_url", "source_task_id"]
        }, {
            "when": {
                "model": "kling-v3-omni-reference",
                "source_video_url": {
                    "present": True
                }
            },
            "forbidden": ["source_task_id"]
        }, {
            "when": {
                "model": "kling-v3-omni-reference",
                "source_task_id": {
                    "present": True
                }
            },
            "forbidden": ["source_video_url"]
        }, {
            "enum": {
                "aspect_ratio": ["auto"],
                "enable_sound": [False],
                "duration_seconds": [5]
            },
            "when": {
                "model": "kling-v3-omni-reference",
                "source_video_url": {
                    "present": True
                },
                "reference_image_urls": {
                    "present": False
                }
            },
            "required": ["aspect_ratio"]
        }, {
            "enum": {
                "aspect_ratio": ["auto"],
                "enable_sound": [False],
                "duration_seconds": [5]
            },
            "when": {
                "model": "kling-v3-omni-reference",
                "source_task_id": {
                    "present": True
                },
                "reference_image_urls": {
                    "present": False
                }
            },
            "required": ["aspect_ratio"]
        }, {
            "enum": {
                "aspect_ratio": ["16:9", "9:16", "1:1"],
                "enable_sound": [False]
            },
            "when": {
                "model": "kling-v3-omni-reference",
                "source_video_url": {
                    "present": True
                },
                "reference_image_urls": {
                    "present": True
                }
            },
            "required": ["aspect_ratio"]
        }]
    },
    "extend-video": {
        "models": ["kling-v2.5-turbo-image-to-video-pro", "kling-v2.5-turbo-text-to-video-pro"],
        "fields_by_model": {
            "kling-v2.5-turbo-image-to-video-pro": {
                "mode": {
                    "enum": ["std", "pro"]
                },
                "source_task_id": {
                    "required": True
                }
            },
            "kling-v2.5-turbo-text-to-video-pro": {
                "mode": {
                    "enum": ["std", "pro"]
                },
                "source_task_id": {
                    "required": True
                }
            }
        }
    },
    "image-to-video": {
        "models": ["kling-o1", "kling-v2.1-master-image-to-video", "kling-v2.1-pro", "kling-v2.1-standard", "kling-v2.5-turbo-image-to-video-pro", "kling-v2.6", "kling-v3-omni", "kling-v3-turbo-image-to-video"],
        "fields_by_model": {
            "kling-o1": {
                "aspect_ratio": {
                    "enum": ["16:9", "9:16", "1:1"]
                },
                "duration_seconds": {
                    "enum": [5],
                    "type": "integer"
                },
                "first_frame_image_url": {
                    "required": True
                },
                "mode": {
                    "enum": ["std", "pro"]
                },
                "model": {
                    "required": True
                },
                "prompt": {
                    "required": True,
                    "min": 1,
                    "max": 2500,
                    "length": True
                },
                "reference_image_urls": {
                    "min_items": 1,
                    "max_items": 7
                },
                "reference_video_type": {
                    "enum": ["base", "feature"]
                }
            },
            "kling-v2.1-master-image-to-video": {
                "duration_seconds": {
                    "enum": [5, 10],
                    "type": "integer"
                },
                "first_frame_image_url": {
                    "required": True
                },
                "model": {
                    "required": True
                },
                "prompt": {
                    "required": True
                }
            },
            "kling-v2.1-pro": {
                "duration_seconds": {
                    "enum": [5, 10],
                    "type": "integer"
                },
                "first_frame_image_url": {
                    "required": True
                },
                "model": {
                    "required": True
                },
                "prompt": {
                    "required": True
                }
            },
            "kling-v2.1-standard": {
                "duration_seconds": {
                    "enum": [5, 10],
                    "type": "integer"
                },
                "first_frame_image_url": {
                    "required": True
                },
                "model": {
                    "required": True
                },
                "prompt": {
                    "required": True
                }
            },
            "kling-v2.5-turbo-image-to-video-pro": {
                "duration_seconds": {
                    "enum": [5, 10],
                    "type": "integer"
                },
                "first_frame_image_url": {
                    "required": True
                },
                "model": {
                    "required": True
                },
                "prompt": {
                    "required": True
                }
            },
            "kling-v2.6": {
                "aspect_ratio": {
                    "enum": ["16:9", "9:16", "1:1"]
                },
                "duration_seconds": {
                    "enum": [5, 10],
                    "type": "integer"
                },
                "first_frame_image_url": {
                    "required": True
                },
                "mode": {
                    "enum": ["std", "pro"]
                },
                "model": {
                    "required": True
                },
                "prompt": {
                    "required": True,
                    "min": 1,
                    "max": 2500,
                    "length": True
                }
            },
            "kling-v3-omni": {
                "aspect_ratio": {
                    "enum": ["16:9", "9:16", "1:1"]
                },
                "duration_seconds": {
                    "enum": [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
                    "type": "integer"
                },
                "first_frame_image_url": {
                    "required": True
                },
                "model": {
                    "required": True
                },
                "output_resolution": {
                    "enum": ["720p", "1080p", "4k"]
                },
                "prompt": {
                    "required": True,
                    "min": 1,
                    "max": 2500,
                    "length": True
                }
            },
            "kling-v3-turbo-image-to-video": {
                "duration_seconds": {
                    "enum": [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
                    "type": "integer"
                },
                "first_frame_image_url": {
                    "required": True
                },
                "model": {
                    "required": True
                },
                "output_resolution": {
                    "enum": ["720p", "1080p"]
                },
                "prompt": {
                    "required": True,
                    "min": 1,
                    "max": 2500,
                    "length": True
                }
            }
        },
        "rules": [{
            "when": {
                "model": "kling-o1"
            },
            "forbidden": ["output_resolution", "negative_prompt", "cfg_scale"]
        }, {
            "when": {
                "model": "kling-v2.1-master-image-to-video"
            },
            "forbidden": ["output_resolution", "enable_sound", "reference_image_urls", "reference_video_url", "reference_video_type", "preserve_reference_video_audio"]
        }, {
            "when": {
                "model": "kling-v2.1-pro"
            },
            "forbidden": ["output_resolution", "enable_sound", "reference_image_urls", "reference_video_url", "reference_video_type", "preserve_reference_video_audio"]
        }, {
            "when": {
                "model": "kling-v2.1-standard"
            },
            "forbidden": ["output_resolution", "enable_sound", "reference_image_urls", "reference_video_url", "reference_video_type", "preserve_reference_video_audio"]
        }, {
            "when": {
                "model": "kling-v2.5-turbo-image-to-video-pro"
            },
            "forbidden": ["output_resolution", "enable_sound", "reference_image_urls", "reference_video_url", "reference_video_type", "preserve_reference_video_audio"]
        }, {
            "when": {
                "model": "kling-v2.6"
            },
            "forbidden": ["output_resolution", "negative_prompt", "cfg_scale", "reference_image_urls", "reference_video_url", "reference_video_type", "preserve_reference_video_audio"]
        }, {
            "when": {
                "model": "kling-v3-omni"
            },
            "forbidden": ["negative_prompt", "cfg_scale", "reference_image_urls", "reference_video_url", "reference_video_type", "preserve_reference_video_audio"]
        }, {
            "when": {
                "model": "kling-v3-turbo-image-to-video"
            },
            "forbidden": ["enable_sound", "aspect_ratio", "negative_prompt", "cfg_scale", "last_frame_image_url", "reference_image_urls", "reference_video_url", "reference_video_type", "preserve_reference_video_audio"]
        }]
    },
    "motion-control": {
        "models": ["kling-3.0", "kling-v2.6"],
        "fields_by_model": {
            "kling-3.0": {
                "background_source": {
                    "enum": ["video", "image"]
                },
                "character_orientation": {
                    "enum": ["video", "image"]
                },
                "model": {
                    "required": True
                },
                "output_resolution": {
                    "enum": ["720p", "1080p"]
                },
                "reference_video_url": {
                    "required": True
                },
                "source_image_url": {
                    "required": True
                }
            },
            "kling-v2.6": {
                "character_orientation": {
                    "enum": ["video", "image"],
                    "required": True
                },
                "model": {
                    "required": True
                },
                "output_resolution": {
                    "enum": ["720p", "1080p"],
                    "required": True
                },
                "prompt": {
                    "max": 2500,
                    "length": True
                },
                "reference_video_url": {
                    "required": True
                },
                "source_image_url": {
                    "required": True
                }
            }
        },
        "rules": [{
            "when": {
                "model": "kling-v2.6"
            },
            "forbidden": ["background_source"]
        }]
    },
    "text-to-video": {
        "models": ["kling-3.0", "kling-o1", "kling-v2.1-master-text-to-video", "kling-v2.5-turbo-text-to-video-pro", "kling-v2.6", "kling-v3-omni", "kling-v3-omni-reference", "kling-v3-turbo-text-to-video"],
        "fields_by_model": {
            "kling-3.0": {
                "aspect_ratio": {
                    "enum": ["16:9", "9:16", "1:1"]
                },
                "duration_seconds": {
                    "enum": [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
                    "type": "integer"
                },
                "model": {
                    "required": True
                },
                "output_resolution": {
                    "enum": ["720p", "1080p", "4k"]
                }
            },
            "kling-o1": {
                "aspect_ratio": {
                    "enum": ["16:9", "9:16", "1:1"]
                },
                "duration_seconds": {
                    "enum": [5],
                    "type": "integer"
                },
                "mode": {
                    "enum": ["std", "pro"]
                },
                "model": {
                    "required": True
                },
                "prompt": {
                    "required": True,
                    "min": 1,
                    "max": 2500,
                    "length": True
                },
                "reference_image_urls": {
                    "min_items": 1,
                    "max_items": 7
                },
                "reference_video_type": {
                    "enum": ["base", "feature"]
                }
            },
            "kling-v2.1-master-text-to-video": {
                "aspect_ratio": {
                    "enum": ["16:9", "9:16", "1:1"]
                },
                "duration_seconds": {
                    "enum": [5, 10],
                    "type": "integer"
                },
                "model": {
                    "required": True
                }
            },
            "kling-v2.5-turbo-text-to-video-pro": {
                "aspect_ratio": {
                    "enum": ["16:9", "9:16", "1:1"]
                },
                "duration_seconds": {
                    "enum": [5, 10],
                    "type": "integer"
                },
                "model": {
                    "required": True
                }
            },
            "kling-v2.6": {
                "aspect_ratio": {
                    "enum": ["16:9", "9:16", "1:1"]
                },
                "duration_seconds": {
                    "enum": [5, 10],
                    "type": "integer"
                },
                "mode": {
                    "enum": ["std", "pro"]
                },
                "model": {
                    "required": True
                },
                "prompt": {
                    "required": True,
                    "min": 1,
                    "max": 2500,
                    "length": True
                }
            },
            "kling-v3-omni": {
                "aspect_ratio": {
                    "enum": ["16:9", "9:16", "1:1"]
                },
                "duration_seconds": {
                    "enum": [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
                    "type": "integer"
                },
                "model": {
                    "required": True
                },
                "output_resolution": {
                    "enum": ["720p", "1080p", "4k"]
                },
                "prompt": {
                    "required": True,
                    "min": 1,
                    "max": 2500,
                    "length": True
                }
            },
            "kling-v3-omni-reference": {
                "aspect_ratio": {
                    "enum": ["16:9", "9:16", "1:1"],
                    "required": True
                },
                "duration_seconds": {
                    "enum": [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
                    "type": "integer"
                },
                "model": {
                    "required": True
                },
                "output_resolution": {
                    "enum": ["720p", "1080p", "4k"]
                },
                "prompt": {
                    "required": True,
                    "min": 1,
                    "max": 2500,
                    "length": True
                },
                "reference_image_urls": {
                    "required": True,
                    "min_items": 1,
                    "max_items": 7
                }
            },
            "kling-v3-turbo-text-to-video": {
                "aspect_ratio": {
                    "enum": ["16:9", "9:16", "1:1"]
                },
                "duration_seconds": {
                    "enum": [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
                    "type": "integer"
                },
                "model": {
                    "required": True
                },
                "output_resolution": {
                    "enum": ["720p", "1080p"]
                },
                "prompt": {
                    "required": True,
                    "min": 1,
                    "max": 2500,
                    "length": True
                }
            }
        },
        "rules": [{
            "when": {
                "model": "kling-3.0"
            },
            "forbidden": ["reference_image_urls", "reference_video_url", "reference_video_type", "preserve_reference_video_audio"]
        }, {
            "when": {
                "model": "kling-o1"
            },
            "forbidden": ["output_resolution", "negative_prompt", "cfg_scale", "multi_shots", "multi_prompt", "first_frame_image_url", "last_frame_image_url", "kling_elements"]
        }, {
            "when": {
                "model": "kling-v2.1-master-text-to-video"
            },
            "forbidden": ["mode", "reference_image_urls", "reference_video_url", "reference_video_type", "preserve_reference_video_audio"]
        }, {
            "when": {
                "model": "kling-v2.5-turbo-text-to-video-pro"
            },
            "forbidden": ["mode", "reference_image_urls", "reference_video_url", "reference_video_type", "preserve_reference_video_audio"]
        }, {
            "when": {
                "model": "kling-v2.6"
            },
            "forbidden": ["output_resolution", "negative_prompt", "cfg_scale", "multi_shots", "multi_prompt", "first_frame_image_url", "last_frame_image_url", "kling_elements", "reference_image_urls", "reference_video_url", "reference_video_type", "preserve_reference_video_audio"]
        }, {
            "when": {
                "model": "kling-v3-omni"
            },
            "forbidden": ["negative_prompt", "cfg_scale", "multi_shots", "multi_prompt", "first_frame_image_url", "last_frame_image_url", "kling_elements", "reference_image_urls", "reference_video_url", "reference_video_type", "preserve_reference_video_audio"]
        }, {
            "when": {
                "model": "kling-v3-turbo-text-to-video"
            },
            "forbidden": ["enable_sound", "negative_prompt", "cfg_scale", "multi_shots", "multi_prompt", "first_frame_image_url", "last_frame_image_url", "kling_elements", "reference_image_urls", "reference_video_url", "reference_video_type", "preserve_reference_video_audio"]
        }]
    }
}
