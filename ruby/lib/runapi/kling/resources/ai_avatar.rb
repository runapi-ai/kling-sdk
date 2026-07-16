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
        def run(options: nil, **params)
          task = create(options: options, **params)
          poll_until_complete { get(task.id, options: options) }
        end

        # Create an AI avatar generation task.
        #
        # @param params [Hash] AI avatar parameters
        # @return [RunApi::Kling::Types::AiAvatarResponse] task creation result with id
        def create(options: nil, **params)
          params = compact_params(params)
          validate_params!(params)
          request(:post, ENDPOINT, body: params, options: options)
        end

        # Get AI avatar task status by task ID.
        #
        # @param id [String] task ID
        # @return [RunApi::Kling::Types::AiAvatarResponse] current task status
        def get(id, options: nil)
          request(:get, "#{ENDPOINT}/#{id}", options: options)
        end

        private

        def validate_params!(params)
          validate_contract!(CONTRACT["avatar"], params)
        end
      end
    end
  end
end
