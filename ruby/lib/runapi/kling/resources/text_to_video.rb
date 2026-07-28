# frozen_string_literal: true

module RunApi
  module Kling
    module Resources
      # Kling text-to-video resource.
      # Generate videos from text prompts.
      class TextToVideo
        include RunApi::Core::ResourceHelpers
        include O1ReferenceValidation

        ENDPOINT = "/api/v1/kling/text_to_video"

        RESPONSE_CLASS = Types::TextToVideoResponse
        COMPLETED_RESPONSE_CLASS = Types::CompletedTextToVideoResponse
        V26_MODEL = "kling-v2.6"
        V3_TURBO_MODEL = "kling-v3-turbo-text-to-video"
        V3_TURBO_UNSUPPORTED_FIELDS = %i[
          enable_sound
          negative_prompt
          cfg_scale
          multi_shots
          multi_prompt
          first_frame_image_url
          last_frame_image_url
          kling_elements
        ].freeze

        def initialize(http)
          @http = http
        end

        # Generate a text-to-video task and wait until complete.
        #
        # @param params [Hash] text-to-video parameters
        # @return [RunApi::Kling::Types::CompletedTextToVideoResponse] completed task with videos
        def run(options: nil, **params)
          task = create(options: options, **params)
          poll_until_complete { get(task.id, options: options) }
        end

        # Create a text-to-video task.
        #
        # @param params [Hash] text-to-video parameters
        # @return [RunApi::Kling::Types::TextToVideoResponse] task creation result with id
        def create(options: nil, **params)
          params = compact_params(params)
          validate_params!(params)
          request(:post, ENDPOINT, body: params, options: options)
        end

        # Get text-to-video task status by task ID.
        #
        # @param id [String] task ID
        # @return [RunApi::Kling::Types::TextToVideoResponse] current task status
        def get(id, options: nil)
          request(:get, "#{ENDPOINT}/#{id}", options: options)
        end

        private

        def validate_params!(params)
          reject_unsupported_v3_turbo_fields!(params)
          validate_contract!(CONTRACT["text-to-video"], params)
          validate_v26_params!(params)
          validate_kling_o1_references!(params)

          # Bespoke cross-field rules the contract cannot express.
          multi_shots = param(params, :multi_shots) == true

          if multi_shots
            raise Core::ValidationError, "enable_sound must be true when multi_shots is true" unless param(params, :enable_sound) == true
            raise Core::ValidationError, "last_frame_image_url is not supported when multi_shots is true" if param(params, :last_frame_image_url)

            multi_prompt = param(params, :multi_prompt)
            validate_multi_prompt!(multi_prompt)
          else
            raise Core::ValidationError, "prompt is required" unless param(params, :prompt)
          end
        end

        def validate_v26_params!(params)
          return unless param(params, :model) == V26_MODEL
          return unless param(params, :enable_sound) == true && param(params, :mode) != "pro"

          raise Core::ValidationError, "enable_sound requires mode pro for #{V26_MODEL}"
        end

        def reject_unsupported_v3_turbo_fields!(params)
          return unless param(params, :model) == V3_TURBO_MODEL

          field = V3_TURBO_UNSUPPORTED_FIELDS.find { |candidate| field_present?(params, candidate) }
          raise Core::ValidationError, "#{field} is not supported by #{V3_TURBO_MODEL}" if field
        end

        def validate_multi_prompt!(multi_prompt)
          unless multi_prompt.is_a?(Array) && multi_prompt.any?
            raise Core::ValidationError, "multi_prompt must be a non-empty array when multi_shots is true"
          end

          multi_prompt.each_with_index do |shot, index|
            prompt = shot.is_a?(Hash) ? (shot[:prompt] || shot["prompt"]) : nil
            duration_seconds = shot.is_a?(Hash) ? (shot[:duration_seconds] || shot["duration_seconds"]) : nil

            raise Core::ValidationError, "multi_prompt[#{index}].prompt is required" if prompt.nil? || prompt.empty?

            if prompt.length > Types::MULTI_PROMPT_MAX_LENGTH
              raise Core::ValidationError, "multi_prompt[#{index}].prompt exceeds #{Types::MULTI_PROMPT_MAX_LENGTH} characters"
            end

            raise Core::ValidationError, "multi_prompt[#{index}].duration_seconds is required" if duration_seconds.nil?

            dur_int = duration_seconds.to_i
            unless Types::MULTI_PROMPT_DURATION_RANGE.cover?(dur_int)
              raise Core::ValidationError, "multi_prompt[#{index}].duration_seconds must be between #{Types::MULTI_PROMPT_DURATION_RANGE.min} and #{Types::MULTI_PROMPT_DURATION_RANGE.max}"
            end
          end
        end
      end
    end
  end
end
