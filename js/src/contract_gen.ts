export const contract = {
  "avatar": {
    "models": [
      "kling-ai-avatar-pro",
      "kling-ai-avatar-standard",
      "kling-ai-avatar-v1-pro",
      "kling-v1-avatar-standard"
    ],
    "fields_by_model": {
      "kling-ai-avatar-pro": {
        "model": {
          "required": true
        },
        "prompt": {
          "required": true
        },
        "source_audio_url": {
          "required": true
        },
        "source_image_url": {
          "required": true
        }
      },
      "kling-ai-avatar-standard": {
        "model": {
          "required": true
        },
        "prompt": {
          "required": true
        },
        "source_audio_url": {
          "required": true
        },
        "source_image_url": {
          "required": true
        }
      },
      "kling-ai-avatar-v1-pro": {
        "model": {
          "required": true
        },
        "prompt": {
          "required": true
        },
        "source_audio_url": {
          "required": true
        },
        "source_image_url": {
          "required": true
        }
      },
      "kling-v1-avatar-standard": {
        "model": {
          "required": true
        },
        "prompt": {
          "required": true
        },
        "source_audio_url": {
          "required": true
        },
        "source_image_url": {
          "required": true
        }
      }
    }
  },
  "image-to-video": {
    "models": [
      "kling-v2.1-master-image-to-video",
      "kling-v2.1-pro",
      "kling-v2.1-standard",
      "kling-v2.5-turbo-image-to-video-pro",
      "kling-v3-turbo-image-to-video"
    ],
    "fields_by_model": {
      "kling-v2.1-master-image-to-video": {
        "duration_seconds": {
          "enum": [
            5,
            10
          ],
          "type": "integer"
        },
        "first_frame_image_url": {
          "required": true
        },
        "model": {
          "required": true
        },
        "prompt": {
          "required": true
        }
      },
      "kling-v2.1-pro": {
        "duration_seconds": {
          "enum": [
            5,
            10
          ],
          "type": "integer"
        },
        "first_frame_image_url": {
          "required": true
        },
        "model": {
          "required": true
        },
        "prompt": {
          "required": true
        }
      },
      "kling-v2.1-standard": {
        "duration_seconds": {
          "enum": [
            5,
            10
          ],
          "type": "integer"
        },
        "first_frame_image_url": {
          "required": true
        },
        "model": {
          "required": true
        },
        "prompt": {
          "required": true
        }
      },
      "kling-v2.5-turbo-image-to-video-pro": {
        "duration_seconds": {
          "enum": [
            5,
            10
          ],
          "type": "integer"
        },
        "first_frame_image_url": {
          "required": true
        },
        "model": {
          "required": true
        },
        "prompt": {
          "required": true
        }
      },
      "kling-v3-turbo-image-to-video": {
        "duration_seconds": {
          "enum": [
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15
          ],
          "type": "integer"
        },
        "first_frame_image_url": {
          "required": true
        },
        "model": {
          "required": true
        },
        "output_resolution": {
          "enum": [
            "720p",
            "1080p"
          ]
        },
        "prompt": {
          "required": true,
          "min": 1,
          "max": 2500,
          "length": true
        }
      }
    },
    "rules": [
      {
        "when": {
          "model": "kling-v2.1-master-image-to-video"
        },
        "forbidden": [
          "output_resolution"
        ]
      },
      {
        "when": {
          "model": "kling-v2.1-pro"
        },
        "forbidden": [
          "output_resolution"
        ]
      },
      {
        "when": {
          "model": "kling-v2.1-standard"
        },
        "forbidden": [
          "output_resolution"
        ]
      },
      {
        "when": {
          "model": "kling-v2.5-turbo-image-to-video-pro"
        },
        "forbidden": [
          "output_resolution"
        ]
      },
      {
        "when": {
          "model": "kling-v3-turbo-image-to-video"
        },
        "forbidden": [
          "aspect_ratio",
          "negative_prompt",
          "cfg_scale",
          "last_frame_image_url"
        ]
      }
    ]
  },
  "motion-control": {
    "models": [
      "kling-3.0"
    ],
    "fields_by_model": {
      "kling-3.0": {
        "background_source": {
          "enum": [
            "video",
            "image"
          ]
        },
        "character_orientation": {
          "enum": [
            "video",
            "image"
          ]
        },
        "model": {
          "required": true
        },
        "output_resolution": {
          "enum": [
            "720p",
            "1080p"
          ]
        },
        "reference_video_url": {
          "required": true
        },
        "source_image_url": {
          "required": true
        }
      }
    }
  },
  "text-to-video": {
    "models": [
      "kling-3.0",
      "kling-v2.1-master-text-to-video",
      "kling-v2.5-turbo-text-to-video-pro",
      "kling-v3-turbo-text-to-video"
    ],
    "fields_by_model": {
      "kling-3.0": {
        "aspect_ratio": {
          "enum": [
            "16:9",
            "9:16",
            "1:1"
          ]
        },
        "duration_seconds": {
          "enum": [
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15
          ],
          "type": "integer"
        },
        "model": {
          "required": true
        },
        "output_resolution": {
          "enum": [
            "720p",
            "1080p",
            "4k"
          ]
        }
      },
      "kling-v2.1-master-text-to-video": {
        "aspect_ratio": {
          "enum": [
            "16:9",
            "9:16",
            "1:1"
          ]
        },
        "duration_seconds": {
          "enum": [
            5,
            10
          ],
          "type": "integer"
        },
        "model": {
          "required": true
        }
      },
      "kling-v2.5-turbo-text-to-video-pro": {
        "aspect_ratio": {
          "enum": [
            "16:9",
            "9:16",
            "1:1"
          ]
        },
        "duration_seconds": {
          "enum": [
            5,
            10
          ],
          "type": "integer"
        },
        "model": {
          "required": true
        }
      },
      "kling-v3-turbo-text-to-video": {
        "aspect_ratio": {
          "enum": [
            "16:9",
            "9:16",
            "1:1"
          ]
        },
        "duration_seconds": {
          "enum": [
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            10,
            11,
            12,
            13,
            14,
            15
          ],
          "type": "integer"
        },
        "model": {
          "required": true
        },
        "output_resolution": {
          "enum": [
            "720p",
            "1080p"
          ]
        },
        "prompt": {
          "required": true,
          "min": 1,
          "max": 2500,
          "length": true
        }
      }
    },
    "rules": [
      {
        "when": {
          "model": "kling-v3-turbo-text-to-video"
        },
        "forbidden": [
          "enable_sound",
          "negative_prompt",
          "cfg_scale",
          "multi_shots",
          "multi_prompt",
          "first_frame_image_url",
          "last_frame_image_url",
          "kling_elements"
        ]
      }
    ]
  }
} as const;
