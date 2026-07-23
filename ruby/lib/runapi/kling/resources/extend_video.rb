# frozen_string_literal: true

module RunApi
  module Kling
    module Resources
      # Continue a completed Kling V2.5 Turbo video task.
      class ExtendVideo
        include RunApi::Core::ResourceHelpers

        ENDPOINT = "/api/v1/kling/extend_video"

        def initialize(http)
          @http = http
        end

        def run(options: nil, **params)
          task = create(options: options, **params)
          poll_until_complete { get(task.id, options: options) }
        end

        def create(options: nil, **params)
          params = compact_params(params)
          validate_contract!(CONTRACT["extend-video"], params)
          request(:post, ENDPOINT, body: params, options: options)
        end

        def get(id, options: nil)
          request(:get, "#{ENDPOINT}/#{id}", options: options)
        end
      end
    end
  end
end
