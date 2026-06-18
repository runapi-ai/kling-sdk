# frozen_string_literal: true

module RunApi
  module Kling
    # Type definitions and constants for Kling video generation.
    module Types
      # Text-to-video model variants. kling-3.0 supports multi-shot, sound, and elements;
      # V2.x models support negative prompts and cfg_scale.
      TEXT_TO_VIDEO_MODELS = %w[
        kling-3.0
        kling-v2.5-turbo-text-to-video-pro
        kling-v2.1-master-text-to-video
      ].freeze

      # AI avatar lip-sync quality tiers, from highest to fastest.
      AI_AVATAR_MODELS = %w[
        kling-ai-avatar-pro
        kling-ai-avatar-standard
        kling-ai-avatar-v1-pro
        kling-v1-avatar-standard
      ].freeze

      # Image-to-video model variants. V2.5 turbo and V2.1 pro support last-frame image control.
      IMAGE_TO_VIDEO_MODELS = %w[
        kling-v2.5-turbo-image-to-video-pro
        kling-v2.1-pro
        kling-v2.1-standard
        kling-v2.1-master-image-to-video
      ].freeze

      # Output resolution options. 4k is highest quality but slowest.
      TEXT_TO_VIDEO_OUTPUT_RESOLUTIONS = %w[720p 1080p 4k].freeze

      MOTION_CONTROL_MODELS = %w[kling-3.0].freeze

      MOTION_CONTROL_OUTPUT_RESOLUTIONS = %w[720p 1080p].freeze

      # Whether the character faces the direction from the video or the image.
      MOTION_CONTROL_CHARACTER_ORIENTATIONS = %w[video image].freeze

      # Whether the background comes from the reference video or the subject image.
      MOTION_CONTROL_BACKGROUND_SOURCES = %w[video image].freeze

      ASPECT_RATIOS = %w[16:9 9:16 1:1].freeze

      # Duration range for kling-3.0 (seconds).
      DURATION_RANGE = (3..15)

      # Per-shot duration range in multi-shot mode (seconds).
      MULTI_PROMPT_DURATION_RANGE = (1..12)

      # Fixed duration options for V2.x models (seconds).
      FIXED_DURATIONS = [5, 10].freeze

      # Maximum character length for each multi-shot prompt segment.
      MULTI_PROMPT_MAX_LENGTH = 500

      # A generated video file with a download URL.
      class Video < RunApi::Core::BaseModel
        optional :url, String
      end

      class AsyncTaskResponse < RunApi::Core::TaskResponse
        required :id, String
        optional :status, String, enum: -> { RunApi::Core::TaskResponse::Status::ALL }
      end

      class TextToVideoResponse < AsyncTaskResponse
        optional :videos, [-> { Video }]
        optional :error, String
      end

      class AiAvatarResponse < AsyncTaskResponse
        optional :videos, [-> { Video }]
        optional :error, String
      end

      class ImageToVideoResponse < AsyncTaskResponse
        optional :videos, [-> { Video }]
        optional :error, String
      end

      class MotionControlResponse < AsyncTaskResponse
        optional :videos, [-> { Video }]
        optional :error, String
      end

      # Narrowed responses returned by `run()` methods once polling observes
      # `status: "completed"`. `videos` is required so consumers never have to
      # null-check it on a successful task.
      class CompletedTextToVideoResponse < TextToVideoResponse
        required :videos, [-> { Video }]
      end

      class CompletedAiAvatarResponse < AiAvatarResponse
        required :videos, [-> { Video }]
      end

      class CompletedImageToVideoResponse < ImageToVideoResponse
        required :videos, [-> { Video }]
      end

      class CompletedMotionControlResponse < MotionControlResponse
        required :videos, [-> { Video }]
      end
    end
  end
end
