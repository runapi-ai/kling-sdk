# frozen_string_literal: true

module RunApi
  module Kling
    module Resources
      # Kling text-to-video resource.
      # Generate videos from text prompts.
      class TextToVideo
        include RunApi::Core::ResourceHelpers

        ENDPOINT = "/api/v1/kling/text_to_video"

        RESPONSE_CLASS = Types::TextToVideoResponse
        COMPLETED_RESPONSE_CLASS = Types::CompletedTextToVideoResponse

        def initialize(http)
          @http = http
        end

        # Generate a text-to-video task and wait until complete.
        #
        # @param params [Hash] text-to-video parameters
        # @return [RunApi::Kling::Types::CompletedTextToVideoResponse] completed task with videos
        def run(**params)
          task = create(**params)
          poll_until_complete { get(task.id) }
        end

        # Create a text-to-video task.
        #
        # @param params [Hash] text-to-video parameters
        # @return [RunApi::Kling::Types::TextToVideoResponse] task creation result with id
        def create(**params)
          params = compact_params(params)
          validate_params!(params)
          request(:post, ENDPOINT, body: params)
        end

        # Get text-to-video task status by task ID.
        #
        # @param id [String] task ID
        # @return [RunApi::Kling::Types::TextToVideoResponse] current task status
        def get(id)
          request(:get, "#{ENDPOINT}/#{id}")
        end

        private

        def validate_params!(params)
          model = param(params, :model)
          raise Core::ValidationError, "model is required" unless model
          unless Types::TEXT_TO_VIDEO_MODELS.include?(model)
            raise Core::ValidationError, "Invalid model: #{model}. Must be one of: #{Types::TEXT_TO_VIDEO_MODELS.join(", ")}"
          end

          multi_shots = param(params, :multi_shots) == true

          if multi_shots
            raise Core::ValidationError, "enable_sound must be true when multi_shots is true" unless param(params, :enable_sound) == true
            raise Core::ValidationError, "last_frame_image_url is not supported when multi_shots is true" if param(params, :last_frame_image_url)

            multi_prompt = param(params, :multi_prompt)
            validate_multi_prompt!(multi_prompt)
          else
            raise Core::ValidationError, "prompt is required" unless param(params, :prompt)
          end

          validate_optional!(params, :output_resolution, Types::TEXT_TO_VIDEO_OUTPUT_RESOLUTIONS)
          validate_optional!(params, :aspect_ratio, Types::ASPECT_RATIOS)

          duration_seconds = param(params, :duration_seconds)
          if duration_seconds
            dur_int = duration_seconds.to_i
            if model == "kling-v2.1-master-text-to-video" || model == "kling-v2.5-turbo-text-to-video-pro"
              unless Types::FIXED_DURATIONS.include?(duration_seconds)
                raise Core::ValidationError, "Invalid duration_seconds: #{duration_seconds}. Must be one of: #{Types::FIXED_DURATIONS.join(", ")}"
              end
            elsif !Types::DURATION_RANGE.cover?(dur_int)
              raise Core::ValidationError, "Invalid duration_seconds: #{duration_seconds}. Must be an integer between #{Types::DURATION_RANGE.min} and #{Types::DURATION_RANGE.max}"
            end
          end
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
