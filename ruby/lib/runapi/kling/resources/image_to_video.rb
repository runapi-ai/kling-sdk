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
        V26_MODEL = "kling-v2.6"
        V3_TURBO_MODEL = "kling-v3-turbo-image-to-video"
        V3_TURBO_UNSUPPORTED_FIELDS = %i[
          aspect_ratio
          negative_prompt
          cfg_scale
          last_frame_image_url
        ].freeze

        def initialize(http)
          @http = http
        end

        # Generate an image-to-video task and wait until complete.
        #
        # @param params [Hash] image-to-video parameters
        # @return [RunApi::Kling::Types::CompletedImageToVideoResponse] completed task with videos
        def run(options: nil, **params)
          task = create(options: options, **params)
          poll_until_complete { get(task.id, options: options) }
        end

        # Create an image-to-video task.
        #
        # @param params [Hash] image-to-video parameters
        # @return [RunApi::Kling::Types::ImageToVideoResponse] task creation result with id
        def create(options: nil, **params)
          params = compact_params(params)
          validate_params!(params)
          request(:post, ENDPOINT, body: params, options: options)
        end

        # Get image-to-video task status by task ID.
        #
        # @param id [String] task ID
        # @return [RunApi::Kling::Types::ImageToVideoResponse] current task status
        def get(id, options: nil)
          request(:get, "#{ENDPOINT}/#{id}", options: options)
        end

        private

        def validate_params!(params)
          reject_unsupported_v3_turbo_fields!(params)
          validate_contract!(CONTRACT["image-to-video"], params)

          # Bespoke: last_frame_image_url is only allowed for select models
          # (model-gating, not expressible as a contract enum/required rule).
          model = param(params, :model)
          last_frame_image_url = param(params, :last_frame_image_url)
          if model == V26_MODEL
            validate_v26_params!(params, last_frame_image_url)
          elsif last_frame_image_url && !%w[kling-v2.5-turbo-image-to-video-pro kling-v2.1-pro].include?(model)
            raise Core::ValidationError, "last_frame_image_url is only supported by kling-v2.5-turbo-image-to-video-pro and kling-v2.1-pro"
          end
        end

        def validate_v26_params!(params, last_frame_image_url)
          mode = param(params, :mode) || "std"
          if param(params, :enable_sound) == true && mode != "pro"
            raise Core::ValidationError, "enable_sound requires mode pro for #{V26_MODEL}"
          end
          return unless last_frame_image_url

          raise Core::ValidationError, "last_frame_image_url requires mode pro for #{V26_MODEL}" unless mode == "pro"

          duration_seconds = param(params, :duration_seconds) || 5
          return if duration_seconds.to_i == 5

          raise Core::ValidationError, "last_frame_image_url requires duration_seconds 5 for #{V26_MODEL}"
        end

        def reject_unsupported_v3_turbo_fields!(params)
          return unless param(params, :model) == V3_TURBO_MODEL

          field = V3_TURBO_UNSUPPORTED_FIELDS.find { |candidate| field_present?(params, candidate) }
          raise Core::ValidationError, "#{field} is not supported by #{V3_TURBO_MODEL}" if field
        end
      end
    end
  end
end
