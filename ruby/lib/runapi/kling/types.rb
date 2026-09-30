# frozen_string_literal: true

module RunApi
  module Kling
    # Type definitions for Kling video generation.
    module Types
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
