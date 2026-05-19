# frozen_string_literal: true

module RunApi
  module Kling
    module Types
      TEXT_TO_VIDEO_MODELS = %w[kling-3.0 kling-v2.5-turbo-text-to-video-pro].freeze

      AI_AVATAR_MODELS = %w[kling-ai-avatar-pro kling-ai-avatar-standard].freeze

      IMAGE_TO_VIDEO_MODELS = %w[kling-v2.5-turbo-image-to-video-pro].freeze

      MODES = %w[std pro].freeze

      ASPECT_RATIOS = %w[16:9 9:16 1:1].freeze

      DURATION_RANGE = (3..15)

      MULTI_PROMPT_DURATION_RANGE = (1..12)

      MULTI_PROMPT_MAX_LENGTH = 500

      class Video < RunApi::Core::BaseModel
        optional :url, String
      end

      class AsyncTaskResponse < RunApi::Core::TaskResponse
        required :id, String
        optional :status, String, enum: -> { RunApi::Core::TaskResponse::Status::ALL }
      end

      class TextToVideoResponse < AsyncTaskResponse
        optional :videos, [ -> { Video } ]
        optional :error, String
      end

      class AiAvatarResponse < AsyncTaskResponse
        optional :videos, [ -> { Video } ]
        optional :error, String
      end

      class ImageToVideoResponse < AsyncTaskResponse
        optional :videos, [ -> { Video } ]
        optional :error, String
      end

      class MotionControlResponse < AsyncTaskResponse
        optional :videos, [ -> { Video } ]
        optional :error, String
      end

      # Narrowed responses returned by `run()` methods once polling observes
      # `status: "completed"`. `videos` is required so consumers never have to
      # null-check it on a successful task.
      class CompletedTextToVideoResponse < TextToVideoResponse
        required :videos, [ -> { Video } ]
      end

      class CompletedAiAvatarResponse < AiAvatarResponse
        required :videos, [ -> { Video } ]
      end

      class CompletedImageToVideoResponse < ImageToVideoResponse
        required :videos, [ -> { Video } ]
      end

      class CompletedMotionControlResponse < MotionControlResponse
        required :videos, [ -> { Video } ]
      end
    end
  end
end
