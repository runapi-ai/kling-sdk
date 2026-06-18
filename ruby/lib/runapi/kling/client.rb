# frozen_string_literal: true

module RunApi
  module Kling
    # Kling video generation API client.
    #
    # @example
    #   client = RunApi::Kling::Client.new(api_key: "your-api-key")
    #   result = client.text_to_video.run(
    #     model: "kling-3.0", prompt: "A cat walking through a garden"
    #   )
    class Client < RunApi::Core::Client
      # @return [Resources::TextToVideo] Text-to-video operations.
      attr_reader :text_to_video
      # @return [Resources::AiAvatar] AI avatar generation operations.
      attr_reader :ai_avatar
      # @return [Resources::ImageToVideo] Image-to-video operations.
      attr_reader :image_to_video
      # @return [Resources::MotionControl] Motion control operations.
      attr_reader :motion_control

      def initialize(api_key: nil, **options)
        super
        @text_to_video = Resources::TextToVideo.new(http)
        @ai_avatar = Resources::AiAvatar.new(http)
        @image_to_video = Resources::ImageToVideo.new(http)
        @motion_control = Resources::MotionControl.new(http)
      end
    end
  end
end
