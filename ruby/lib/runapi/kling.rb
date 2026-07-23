# frozen_string_literal: true

require "runapi/core"
require_relative "kling/types"
require_relative "kling/contract_gen"
require_relative "kling/resources/text_to_video"
require_relative "kling/resources/ai_avatar"
require_relative "kling/resources/image_to_video"
require_relative "kling/resources/motion_control"
require_relative "kling/resources/extend_video"
require_relative "kling/client"

module RunApi
  module Kling
    AuthenticationError = RunApi::Core::AuthenticationError
    RateLimitError = RunApi::Core::RateLimitError
    InsufficientCreditsError = RunApi::Core::InsufficientCreditsError
    NotFoundError = RunApi::Core::NotFoundError
    ValidationError = RunApi::Core::ValidationError
    TaskFailedError = RunApi::Core::TaskFailedError
    TaskTimeoutError = RunApi::Core::TaskTimeoutError
  end
end
