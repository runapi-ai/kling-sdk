# frozen_string_literal: true

module RunApi
  module Kling
    module Resources
      # Kling AI avatar generation resource.
      # Generate talking avatar videos from images and audio.
      class AiAvatar
        include RunApi::Core::ResourceHelpers

        ENDPOINT = "/api/v1/kling/ai_avatar"

        RESPONSE_CLASS = Types::AiAvatarResponse
        COMPLETED_RESPONSE_CLASS = Types::CompletedAiAvatarResponse

        def initialize(http)
          @http = http
        end

        # Generate an AI avatar video and wait until complete.
        #
        # @param params [Hash] AI avatar parameters
        # @return [RunApi::Kling::Types::CompletedAiAvatarResponse] completed task with videos
        def run(**params)
          task = create(**params)
          poll_until_complete { get(task.id) }
        end

        # Create an AI avatar generation task.
        #
        # @param params [Hash] AI avatar parameters
        # @return [RunApi::Kling::Types::AiAvatarResponse] task creation result with id
        def create(**params)
          params = compact_params(params)
          validate_params!(params)
          request(:post, ENDPOINT, body: params)
        end

        # Get AI avatar task status by task ID.
        #
        # @param id [String] task ID
        # @return [RunApi::Kling::Types::AiAvatarResponse] current task status
        def get(id)
          request(:get, "#{ENDPOINT}/#{id}")
        end

        private

        def validate_params!(params)
          model = param(params, :model)
          raise Core::ValidationError, "model is required" unless model
          unless Types::AI_AVATAR_MODELS.include?(model)
            raise Core::ValidationError, "Invalid model: #{model}. Must be one of: #{Types::AI_AVATAR_MODELS.join(", ")}"
          end

          raise Core::ValidationError, "image_url is required" unless param(params, :image_url)
          raise Core::ValidationError, "audio_url is required" unless param(params, :audio_url)
          raise Core::ValidationError, "prompt is required" unless param(params, :prompt)
        end
      end
    end
  end
end
