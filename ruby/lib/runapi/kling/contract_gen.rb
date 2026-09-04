# frozen_string_literal: true

module RunApi
  module Kling
    CONTRACT = {
      "avatar" => {
        "models" => ["kling-ai-avatar-pro", "kling-ai-avatar-standard", "kling-ai-avatar-v1-pro", "kling-v1-avatar-standard"],
        "fields_by_model" => {
          "kling-ai-avatar-pro" => {
            "model" => {
              "required" => true
            },
            "prompt" => {
              "required" => true
            },
            "source_audio_url" => {
              "required" => true
            },
            "source_image_url" => {
              "required" => true
            }
          },
          "kling-ai-avatar-standard" => {
            "model" => {
              "required" => true
            },
            "prompt" => {
              "required" => true
            },
            "source_audio_url" => {
              "required" => true
            },
            "source_image_url" => {
              "required" => true
            }
          },
          "kling-ai-avatar-v1-pro" => {
            "model" => {
              "required" => true
            },
            "prompt" => {
              "required" => true
            },
            "source_audio_url" => {
              "required" => true
            },
            "source_image_url" => {
              "required" => true
            }
          },
          "kling-v1-avatar-standard" => {
            "model" => {
              "required" => true
            },
            "prompt" => {
              "required" => true
            },
            "source_audio_url" => {
              "required" => true
            },
            "source_image_url" => {
              "required" => true
            }
          }
        }
      },
      "edit-video" => {
        "models" => ["kling-v3-omni-edit", "kling-v3-omni-reference"],
        "fields_by_model" => {
          "kling-v3-omni-edit" => {
            "aspect_ratio" => {
              "enum" => ["auto", "16:9", "9:16", "1:1"]
            },
            "duration_seconds" => {
              "enum" => [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
              "type" => "integer"
            },
            "model" => {
              "required" => true
            },
            "output_resolution" => {
              "enum" => ["720p", "1080p", "4k"]
            },
            "prompt" => {
              "required" => true,
              "min" => 1,
              "max" => 2500,
              "length" => true
            },
            "reference_image_urls" => {
              "min_items" => 1,
              "max_items" => 4
            }
          },
          "kling-v3-omni-reference" => {
            "aspect_ratio" => {
              "enum" => ["auto", "16:9", "9:16", "1:1"]
            },
            "duration_seconds" => {
              "enum" => [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
              "type" => "integer"
            },
            "model" => {
              "required" => true
            },
            "output_resolution" => {
              "enum" => ["720p", "1080p", "4k"]
            },
            "prompt" => {
              "required" => true,
              "min" => 1,
              "max" => 2500,
              "length" => true
            },
            "reference_image_urls" => {
              "min_items" => 1,
              "max_items" => 4
            }
          }
        },
        "rules" => [{
          "when" => {
            "model" => "kling-v3-omni-edit",
            "source_video_url" => {
              "present" => true
            }
          },
          "forbidden" => ["source_task_id"]
        }, {
          "when" => {
            "model" => "kling-v3-omni-edit",
            "source_task_id" => {
              "present" => true
            }
          },
          "forbidden" => ["source_video_url"]
        }, {
          "enum" => {
            "aspect_ratio" => ["auto"],
            "duration_seconds" => [5]
          },
          "when" => {
            "model" => "kling-v3-omni-edit",
            "source_video_url" => {
              "present" => true
            },
            "reference_image_urls" => {
              "present" => false
            }
          },
          "required" => ["aspect_ratio"]
        }, {
          "enum" => {
            "aspect_ratio" => ["auto"],
            "duration_seconds" => [5]
          },
          "when" => {
            "model" => "kling-v3-omni-edit",
            "source_task_id" => {
              "present" => true
            },
            "reference_image_urls" => {
              "present" => false
            }
          },
          "required" => ["aspect_ratio"]
        }, {
          "enum" => {
            "aspect_ratio" => ["16:9", "9:16", "1:1"]
          },
          "when" => {
            "model" => "kling-v3-omni-edit",
            "source_video_url" => {
              "present" => true
            },
            "reference_image_urls" => {
              "present" => true
            }
          },
          "required" => ["aspect_ratio"]
        }, {
          "enum" => {
            "aspect_ratio" => ["16:9", "9:16", "1:1"]
          },
          "when" => {
            "model" => "kling-v3-omni-edit",
            "source_task_id" => {
              "present" => true
            },
            "reference_image_urls" => {
              "present" => true
            }
          },
          "required" => ["aspect_ratio"]
        }, {
          "when" => {
            "model" => "kling-v3-omni-edit",
            "source_task_id" => {
              "present" => false
            },
            "source_video_url" => {
              "present" => false
            }
          },
          "required_any" => ["source_video_url", "source_task_id"]
        }, {
          "enum" => {
            "aspect_ratio" => ["16:9", "9:16", "1:1"],
            "enable_sound" => [false]
          },
          "when" => {
            "model" => "kling-v3-omni-reference",
            "source_task_id" => {
              "present" => true
            },
            "reference_image_urls" => {
              "present" => true
            }
          },
          "required" => ["aspect_ratio"]
        }, {
          "when" => {
            "model" => "kling-v3-omni-reference",
            "source_task_id" => {
              "present" => false
            },
            "source_video_url" => {
              "present" => false
            }
          },
          "required_any" => ["source_video_url", "source_task_id"]
        }, {
          "when" => {
            "model" => "kling-v3-omni-reference",
            "source_video_url" => {
              "present" => true
            }
          },
          "forbidden" => ["source_task_id"]
        }, {
          "when" => {
            "model" => "kling-v3-omni-reference",
            "source_task_id" => {
              "present" => true
            }
          },
          "forbidden" => ["source_video_url"]
        }, {
          "enum" => {
            "aspect_ratio" => ["auto"],
            "enable_sound" => [false],
            "duration_seconds" => [5]
          },
          "when" => {
            "model" => "kling-v3-omni-reference",
            "source_video_url" => {
              "present" => true
            },
            "reference_image_urls" => {
              "present" => false
            }
          },
          "required" => ["aspect_ratio"]
        }, {
          "enum" => {
            "aspect_ratio" => ["auto"],
            "enable_sound" => [false],
            "duration_seconds" => [5]
          },
          "when" => {
            "model" => "kling-v3-omni-reference",
            "source_task_id" => {
              "present" => true
            },
            "reference_image_urls" => {
              "present" => false
            }
          },
          "required" => ["aspect_ratio"]
        }, {
          "enum" => {
            "aspect_ratio" => ["16:9", "9:16", "1:1"],
            "enable_sound" => [false]
          },
          "when" => {
            "model" => "kling-v3-omni-reference",
            "source_video_url" => {
              "present" => true
            },
            "reference_image_urls" => {
              "present" => true
            }
          },
          "required" => ["aspect_ratio"]
        }]
      },
      "extend-video" => {
        "models" => ["kling-v2.5-turbo-image-to-video-pro", "kling-v2.5-turbo-text-to-video-pro"],
        "fields_by_model" => {
          "kling-v2.5-turbo-image-to-video-pro" => {
            "mode" => {
              "enum" => ["std", "pro"]
            },
            "source_task_id" => {
              "required" => true
            }
          },
          "kling-v2.5-turbo-text-to-video-pro" => {
            "mode" => {
              "enum" => ["std", "pro"]
            },
            "source_task_id" => {
              "required" => true
            }
          }
        }
      },
      "image-to-video" => {
        "models" => ["kling-o1", "kling-v2.1-master-image-to-video", "kling-v2.1-pro", "kling-v2.1-standard", "kling-v2.5-turbo-image-to-video-pro", "kling-v2.6", "kling-v3-omni", "kling-v3-turbo-image-to-video"],
        "fields_by_model" => {
          "kling-o1" => {
            "aspect_ratio" => {
              "enum" => ["16:9", "9:16", "1:1"]
            },
            "duration_seconds" => {
              "enum" => [5],
              "type" => "integer"
            },
            "first_frame_image_url" => {
              "required" => true
            },
            "mode" => {
              "enum" => ["std", "pro"]
            },
            "model" => {
              "required" => true
            },
            "prompt" => {
              "required" => true,
              "min" => 1,
              "max" => 2500,
              "length" => true
            },
            "reference_image_urls" => {
              "min_items" => 1,
              "max_items" => 7
            },
            "reference_video_type" => {
              "enum" => ["base", "feature"]
            }
          },
          "kling-v2.1-master-image-to-video" => {
            "duration_seconds" => {
              "enum" => [5, 10],
              "type" => "integer"
            },
            "first_frame_image_url" => {
              "required" => true
            },
            "model" => {
              "required" => true
            },
            "prompt" => {
              "required" => true
            }
          },
          "kling-v2.1-pro" => {
            "duration_seconds" => {
              "enum" => [5, 10],
              "type" => "integer"
            },
            "first_frame_image_url" => {
              "required" => true
            },
            "model" => {
              "required" => true
            },
            "prompt" => {
              "required" => true
            }
          },
          "kling-v2.1-standard" => {
            "duration_seconds" => {
              "enum" => [5, 10],
              "type" => "integer"
            },
            "first_frame_image_url" => {
              "required" => true
            },
            "model" => {
              "required" => true
            },
            "prompt" => {
              "required" => true
            }
          },
          "kling-v2.5-turbo-image-to-video-pro" => {
            "duration_seconds" => {
              "enum" => [5, 10],
              "type" => "integer"
            },
            "first_frame_image_url" => {
              "required" => true
            },
            "model" => {
              "required" => true
            },
            "prompt" => {
              "required" => true
            }
          },
          "kling-v2.6" => {
            "aspect_ratio" => {
              "enum" => ["16:9", "9:16", "1:1"]
            },
            "duration_seconds" => {
              "enum" => [5, 10],
              "type" => "integer"
            },
            "first_frame_image_url" => {
              "required" => true
            },
            "mode" => {
              "enum" => ["std", "pro"]
            },
            "model" => {
              "required" => true
            },
            "prompt" => {
              "required" => true,
              "min" => 1,
              "max" => 2500,
              "length" => true
            }
          },
          "kling-v3-omni" => {
            "aspect_ratio" => {
              "enum" => ["16:9", "9:16", "1:1"]
            },
            "duration_seconds" => {
              "enum" => [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
              "type" => "integer"
            },
            "first_frame_image_url" => {
              "required" => true
            },
            "model" => {
              "required" => true
            },
            "output_resolution" => {
              "enum" => ["720p", "1080p", "4k"]
            },
            "prompt" => {
              "required" => true,
              "min" => 1,
              "max" => 2500,
              "length" => true
            }
          },
          "kling-v3-turbo-image-to-video" => {
            "duration_seconds" => {
              "enum" => [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
              "type" => "integer"
            },
            "first_frame_image_url" => {
              "required" => true
            },
            "model" => {
              "required" => true
            },
            "output_resolution" => {
              "enum" => ["720p", "1080p"]
            },
            "prompt" => {
              "required" => true,
              "min" => 1,
              "max" => 2500,
              "length" => true
            }
          }
        },
        "rules" => [{
          "when" => {
            "model" => "kling-o1"
          },
          "forbidden" => ["output_resolution", "negative_prompt", "cfg_scale"]
        }, {
          "when" => {
            "model" => "kling-v2.1-master-image-to-video"
          },
          "forbidden" => ["output_resolution", "enable_sound", "reference_image_urls", "reference_video_url", "reference_video_type", "preserve_reference_video_audio"]
        }, {
          "when" => {
            "model" => "kling-v2.1-pro"
          },
          "forbidden" => ["output_resolution", "enable_sound", "reference_image_urls", "reference_video_url", "reference_video_type", "preserve_reference_video_audio"]
        }, {
          "when" => {
            "model" => "kling-v2.1-standard"
          },
          "forbidden" => ["output_resolution", "enable_sound", "reference_image_urls", "reference_video_url", "reference_video_type", "preserve_reference_video_audio"]
        }, {
          "when" => {
            "model" => "kling-v2.5-turbo-image-to-video-pro"
          },
          "forbidden" => ["output_resolution", "enable_sound", "reference_image_urls", "reference_video_url", "reference_video_type", "preserve_reference_video_audio"]
        }, {
          "when" => {
            "model" => "kling-v2.6"
          },
          "forbidden" => ["output_resolution", "negative_prompt", "cfg_scale", "reference_image_urls", "reference_video_url", "reference_video_type", "preserve_reference_video_audio"]
        }, {
          "when" => {
            "model" => "kling-v3-omni"
          },
          "forbidden" => ["negative_prompt", "cfg_scale", "reference_image_urls", "reference_video_url", "reference_video_type", "preserve_reference_video_audio"]
        }, {
          "when" => {
            "model" => "kling-v3-turbo-image-to-video"
          },
          "forbidden" => ["enable_sound", "aspect_ratio", "negative_prompt", "cfg_scale", "last_frame_image_url", "reference_image_urls", "reference_video_url", "reference_video_type", "preserve_reference_video_audio"]
        }]
      },
      "motion-control" => {
        "models" => ["kling-3.0", "kling-v2.6"],
        "fields_by_model" => {
          "kling-3.0" => {
            "background_source" => {
              "enum" => ["video", "image"]
            },
            "character_orientation" => {
              "enum" => ["video", "image"]
            },
            "model" => {
              "required" => true
            },
            "output_resolution" => {
              "enum" => ["720p", "1080p"]
            },
            "reference_video_url" => {
              "required" => true
            },
            "source_image_url" => {
              "required" => true
            }
          },
          "kling-v2.6" => {
            "character_orientation" => {
              "enum" => ["video", "image"],
              "required" => true
            },
            "model" => {
              "required" => true
            },
            "output_resolution" => {
              "enum" => ["720p", "1080p"],
              "required" => true
            },
            "prompt" => {
              "max" => 2500,
              "length" => true
            },
            "reference_video_url" => {
              "required" => true
            },
            "source_image_url" => {
              "required" => true
            }
          }
        },
        "rules" => [{
          "when" => {
            "model" => "kling-v2.6"
          },
          "forbidden" => ["background_source"]
        }]
      },
      "text-to-video" => {
        "models" => ["kling-3.0", "kling-o1", "kling-v2.1-master-text-to-video", "kling-v2.5-turbo-text-to-video-pro", "kling-v2.6", "kling-v3-omni", "kling-v3-omni-reference", "kling-v3-turbo-text-to-video"],
        "fields_by_model" => {
          "kling-3.0" => {
            "aspect_ratio" => {
              "enum" => ["16:9", "9:16", "1:1"]
            },
            "duration_seconds" => {
              "enum" => [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
              "type" => "integer"
            },
            "model" => {
              "required" => true
            },
            "output_resolution" => {
              "enum" => ["720p", "1080p", "4k"]
            }
          },
          "kling-o1" => {
            "aspect_ratio" => {
              "enum" => ["16:9", "9:16", "1:1"]
            },
            "duration_seconds" => {
              "enum" => [5],
              "type" => "integer"
            },
            "mode" => {
              "enum" => ["std", "pro"]
            },
            "model" => {
              "required" => true
            },
            "prompt" => {
              "required" => true,
              "min" => 1,
              "max" => 2500,
              "length" => true
            },
            "reference_image_urls" => {
              "min_items" => 1,
              "max_items" => 7
            },
            "reference_video_type" => {
              "enum" => ["base", "feature"]
            }
          },
          "kling-v2.1-master-text-to-video" => {
            "aspect_ratio" => {
              "enum" => ["16:9", "9:16", "1:1"]
            },
            "duration_seconds" => {
              "enum" => [5, 10],
              "type" => "integer"
            },
            "model" => {
              "required" => true
            }
          },
          "kling-v2.5-turbo-text-to-video-pro" => {
            "aspect_ratio" => {
              "enum" => ["16:9", "9:16", "1:1"]
            },
            "duration_seconds" => {
              "enum" => [5, 10],
              "type" => "integer"
            },
            "model" => {
              "required" => true
            }
          },
          "kling-v2.6" => {
            "aspect_ratio" => {
              "enum" => ["16:9", "9:16", "1:1"]
            },
            "duration_seconds" => {
              "enum" => [5, 10],
              "type" => "integer"
            },
            "mode" => {
              "enum" => ["std", "pro"]
            },
            "model" => {
              "required" => true
            },
            "prompt" => {
              "required" => true,
              "min" => 1,
              "max" => 2500,
              "length" => true
            }
          },
          "kling-v3-omni" => {
            "aspect_ratio" => {
              "enum" => ["16:9", "9:16", "1:1"]
            },
            "duration_seconds" => {
              "enum" => [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
              "type" => "integer"
            },
            "model" => {
              "required" => true
            },
            "output_resolution" => {
              "enum" => ["720p", "1080p", "4k"]
            },
            "prompt" => {
              "required" => true,
              "min" => 1,
              "max" => 2500,
              "length" => true
            }
          },
          "kling-v3-omni-reference" => {
            "aspect_ratio" => {
              "enum" => ["16:9", "9:16", "1:1"],
              "required" => true
            },
            "duration_seconds" => {
              "enum" => [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
              "type" => "integer"
            },
            "model" => {
              "required" => true
            },
            "output_resolution" => {
              "enum" => ["720p", "1080p", "4k"]
            },
            "prompt" => {
              "required" => true,
              "min" => 1,
              "max" => 2500,
              "length" => true
            },
            "reference_image_urls" => {
              "required" => true,
              "min_items" => 1,
              "max_items" => 7
            }
          },
          "kling-v3-turbo-text-to-video" => {
            "aspect_ratio" => {
              "enum" => ["16:9", "9:16", "1:1"]
            },
            "duration_seconds" => {
              "enum" => [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
              "type" => "integer"
            },
            "model" => {
              "required" => true
            },
            "output_resolution" => {
              "enum" => ["720p", "1080p"]
            },
            "prompt" => {
              "required" => true,
              "min" => 1,
              "max" => 2500,
              "length" => true
            }
          }
        },
        "rules" => [{
          "when" => {
            "model" => "kling-3.0"
          },
          "forbidden" => ["reference_image_urls", "reference_video_url", "reference_video_type", "preserve_reference_video_audio"]
        }, {
          "when" => {
            "model" => "kling-o1"
          },
          "forbidden" => ["output_resolution", "negative_prompt", "cfg_scale", "multi_shots", "multi_prompt", "first_frame_image_url", "last_frame_image_url", "kling_elements"]
        }, {
          "when" => {
            "model" => "kling-v2.1-master-text-to-video"
          },
          "forbidden" => ["mode", "reference_image_urls", "reference_video_url", "reference_video_type", "preserve_reference_video_audio"]
        }, {
          "when" => {
            "model" => "kling-v2.5-turbo-text-to-video-pro"
          },
          "forbidden" => ["mode", "reference_image_urls", "reference_video_url", "reference_video_type", "preserve_reference_video_audio"]
        }, {
          "when" => {
            "model" => "kling-v2.6"
          },
          "forbidden" => ["output_resolution", "negative_prompt", "cfg_scale", "multi_shots", "multi_prompt", "first_frame_image_url", "last_frame_image_url", "kling_elements", "reference_image_urls", "reference_video_url", "reference_video_type", "preserve_reference_video_audio"]
        }, {
          "when" => {
            "model" => "kling-v3-omni"
          },
          "forbidden" => ["negative_prompt", "cfg_scale", "multi_shots", "multi_prompt", "first_frame_image_url", "last_frame_image_url", "kling_elements", "reference_image_urls", "reference_video_url", "reference_video_type", "preserve_reference_video_audio"]
        }, {
          "when" => {
            "model" => "kling-v3-turbo-text-to-video"
          },
          "forbidden" => ["enable_sound", "negative_prompt", "cfg_scale", "multi_shots", "multi_prompt", "first_frame_image_url", "last_frame_image_url", "kling_elements", "reference_image_urls", "reference_video_url", "reference_video_type", "preserve_reference_video_audio"]
        }]
      }
    }.freeze
  end
end
