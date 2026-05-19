# frozen_string_literal: true

module RunApi
  module Kling
    module Resources
      # Kling motion control resource.
      # Generate videos with motion transfer from reference videos.
      class MotionControl
        include RunApi::Core::ResourceHelpers

        ENDPOINT = "/api/v1/kling/motion_control"

        RESPONSE_CLASS = Types::MotionControlResponse
        COMPLETED_RESPONSE_CLASS = Types::CompletedMotionControlResponse

        def initialize(http)
          @http = http
        end

        # Generate a motion control video and wait until complete.
        #
        # @param params [Hash] motion control parameters
        # @return [RunApi::Kling::Types::CompletedMotionControlResponse] completed task with videos
        def run(**params)
          task = create(**params)
          poll_until_complete { get(task.id) }
        end

        # Create a motion control generation task.
        #
        # @param params [Hash] motion control parameters
        # @return [RunApi::Kling::Types::MotionControlResponse] task creation result with id
        def create(**params)
          params = compact_params(params)
          validate_params!(params)
          request(:post, ENDPOINT, body: params)
        end

        # Get motion control task status by task ID.
        #
        # @param id [String] task ID
        # @return [RunApi::Kling::Types::MotionControlResponse] current task status
        def get(id)
          request(:get, "#{ENDPOINT}/#{id}")
        end

        private

        def validate_params!(params)
          model = param(params, :model)
          raise Core::ValidationError, "model is required" unless model
          unless Types::MODELS.include?(model)
            raise Core::ValidationError, "Invalid model: #{model}. Must be one of: #{Types::MODELS.join(", ")}"
          end

          input_urls = param(params, :input_urls)
          raise Core::ValidationError, "input_urls is required" unless input_urls.is_a?(Array) && input_urls.any?

          video_urls = param(params, :video_urls)
          raise Core::ValidationError, "video_urls is required" unless video_urls.is_a?(Array) && video_urls.any?
        end
      end
    end
  end
end
