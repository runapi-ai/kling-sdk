# frozen_string_literal: true

module RunApi
  module Kling
    module Resources
      # Kling image-to-video resource.
      # Generate videos from an input image.
      class ImageToVideo
        include RunApi::Core::ResourceHelpers

        ENDPOINT = "/api/v1/kling/image_to_video"

        RESPONSE_CLASS = Types::ImageToVideoResponse
        COMPLETED_RESPONSE_CLASS = Types::CompletedImageToVideoResponse

        def initialize(http)
          @http = http
        end

        # Generate an image-to-video task and wait until complete.
        #
        # @param params [Hash] image-to-video parameters
        # @return [RunApi::Kling::Types::CompletedImageToVideoResponse] completed task with videos
        def run(**params)
          task = create(**params)
          poll_until_complete { get(task.id) }
        end

        # Create an image-to-video task.
        #
        # @param params [Hash] image-to-video parameters
        # @return [RunApi::Kling::Types::ImageToVideoResponse] task creation result with id
        def create(**params)
          params = compact_params(params)
          validate_params!(params)
          request(:post, ENDPOINT, body: params)
        end

        # Get image-to-video task status by task ID.
        #
        # @param id [String] task ID
        # @return [RunApi::Kling::Types::ImageToVideoResponse] current task status
        def get(id)
          request(:get, "#{ENDPOINT}/#{id}")
        end

        private

        def validate_params!(params)
          model = param(params, :model)
          raise Core::ValidationError, "model is required" unless model
          unless Types::IMAGE_TO_VIDEO_MODELS.include?(model)
            raise Core::ValidationError, "Invalid model: #{model}. Must be one of: #{Types::IMAGE_TO_VIDEO_MODELS.join(", ")}"
          end

          raise Core::ValidationError, "prompt is required" unless param(params, :prompt)
          raise Core::ValidationError, "first_frame_image_url is required" unless param(params, :first_frame_image_url)

          duration_seconds = param(params, :duration_seconds)
          if duration_seconds && !Types::FIXED_DURATIONS.include?(duration_seconds)
            raise Core::ValidationError, "Invalid duration_seconds: #{duration_seconds}. Must be one of: #{Types::FIXED_DURATIONS.join(", ")}"
          end

          last_frame_image_url = param(params, :last_frame_image_url)
          if last_frame_image_url && !%w[kling-v2.5-turbo-image-to-video-pro kling-v2.1-pro].include?(model)
            raise Core::ValidationError, "last_frame_image_url is only supported by kling-v2.5-turbo-image-to-video-pro and kling-v2.1-pro"
          end
        end
      end
    end
  end
end
