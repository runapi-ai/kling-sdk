# frozen_string_literal: true

require "ipaddr"
require "uri"

module RunApi
  module Kling
    module Resources
      module O1ReferenceValidation
        O1_MODEL = "kling-o1"
        O1_IMAGE_EXTENSIONS = %w[.jpg .jpeg .png].freeze
        O1_VIDEO_EXTENSIONS = %w[.mp4 .mov].freeze
        O1_NONCANONICAL_IPV4_LITERAL = /\A(?:0x[0-9a-f]+|\d+)(?:\.(?:0x[0-9a-f]+|\d+)){0,3}\z/i
        O1_BLOCKED_IP_RANGES = %w[
          0.0.0.0/8
          10.0.0.0/8
          100.64.0.0/10
          127.0.0.0/8
          169.254.0.0/16
          172.16.0.0/12
          192.0.0.0/24
          192.0.2.0/24
          192.88.99.0/24
          192.168.0.0/16
          198.18.0.0/15
          198.51.100.0/24
          203.0.113.0/24
          224.0.0.0/4
          240.0.0.0/4
          255.255.255.255/32
          ::/128
          ::1/128
          64:ff9b::/96
          64:ff9b:1::/48
          100::/64
          2001::/32
          2001:2::/48
          2001:db8::/32
          2002::/16
          3fff::/20
          fc00::/7
          fe80::/10
          ff00::/8
        ].map { |cidr| IPAddr.new(cidr) }.freeze

        private

        def validate_kling_o1_references!(params)
          return unless param(params, :model) == O1_MODEL

          if param(params, :enable_sound) == true
            raise Core::ValidationError, "enable_sound is not supported by #{O1_MODEL}"
          end

          validate_o1_frame_urls!(params)
          prompt = param(params, :prompt)
          raise Core::ValidationError, "prompt must be a string" unless prompt.is_a?(String)
          reference_images = Array(param(params, :reference_image_urls))
          reference_video_url = param(params, :reference_video_url)

          if field_present?(params, :last_frame_image_url) &&
              (reference_images.any? || field_present?(params, :reference_video_url))
            raise Core::ValidationError,
              "last_frame_image_url cannot be combined with reference_image_urls or reference_video_url"
          end

          if reference_video_url && reference_images.size > 4
            raise Core::ValidationError, "reference_image_urls must contain at most 4 items when reference_video_url is present"
          end

          validate_o1_reference_images!(prompt, reference_images)
          validate_o1_reference_video!(params, prompt, reference_video_url)
        end

        def validate_o1_frame_urls!(params)
          %i[first_frame_image_url last_frame_image_url].each do |field|
            value = param(params, field)
            next unless value
            validate_o1_media_url!(
              value,
              field: field,
              extensions: O1_IMAGE_EXTENSIONS,
              extension_error: "#{field} must use a JPG, JPEG, or PNG URL"
            )
          end
        end

        def validate_o1_reference_images!(prompt, reference_images)
          reference_images.each_with_index do |url, index|
            field = "reference_image_urls[#{index}]"
            raise Core::ValidationError, "#{field} must be a string" unless url.is_a?(String)
            validate_o1_media_url!(
              url,
              field: field,
              extensions: O1_IMAGE_EXTENSIONS,
              extension_error: "#{field} must use a JPG, JPEG, or PNG URL"
            )

            marker = "<<<image_#{index + 1}>>>"
            unless prompt.include?(marker)
              raise Core::ValidationError, "prompt must reference reference_image_urls[#{index}] as #{marker}"
            end
          end

          prompt.scan(/<<<image_(\d+)>>>/).flatten.map(&:to_i).each do |index|
            next if index.between?(1, reference_images.size)

            raise Core::ValidationError, "prompt references missing image_#{index}"
          end
        end

        def validate_o1_reference_video!(params, prompt, reference_video_url)
          unless reference_video_url
            raise Core::ValidationError, "reference_video_type requires reference_video_url" if o1_key?(params, :reference_video_type)
            if o1_key?(params, :preserve_reference_video_audio)
              raise Core::ValidationError, "preserve_reference_video_audio requires reference_video_url"
            end
            if (match = prompt.match(/<<<video_([^>]+)>>>/))
              raise Core::ValidationError, "prompt references missing video_#{match[1]}"
            end
            return
          end

          validate_o1_media_url!(
            reference_video_url,
            field: :reference_video_url,
            extensions: O1_VIDEO_EXTENSIONS,
            extension_error: "reference_video_url must use an MP4 or MOV URL"
          )
          unless prompt.include?("<<<video_1>>>")
            raise Core::ValidationError, "prompt must reference reference_video_url as <<<video_1>>>"
          end
          if prompt.scan(/<<<video_([^>]+)>>>/).flatten.any? { |index| index != "1" }
            raise Core::ValidationError, "prompt may only reference video_1"
          end

          reference_video_type = param(params, :reference_video_type) || "base"
          return unless reference_video_type == "base"
          return unless field_present?(params, :first_frame_image_url) || field_present?(params, :last_frame_image_url)

          raise Core::ValidationError,
            "reference_video_type base cannot be combined with first_frame_image_url or last_frame_image_url"
        end

        def o1_key?(params, field)
          params.key?(field) || params.key?(field.to_s)
        end

        def validate_o1_media_url!(value, field:, extensions:, extension_error:)
          raise Core::ValidationError, "#{field} must be a string" unless value.is_a?(String)

          uri = URI.parse(value.to_s)
          host = uri.hostname
          local_host = host&.casecmp?("localhost") || host&.downcase&.end_with?(".localhost")
          valid_http_url = (uri.is_a?(URI::HTTP) || uri.is_a?(URI::HTTPS)) &&
            host && !uri.userinfo && !local_host && !blocked_o1_ip_literal?(host)
          unless valid_http_url
            raise Core::ValidationError, "#{field} must be a public HTTP or HTTPS URL"
          end
          return if extensions.include?(File.extname(uri.path).downcase)

          raise Core::ValidationError, extension_error
        rescue URI::InvalidURIError
          raise Core::ValidationError, "#{field} must be a public HTTP or HTTPS URL"
        end

        def blocked_o1_ip_literal?(host)
          ip = IPAddr.new(host).native
          O1_BLOCKED_IP_RANGES.any? { |range| range.include?(ip) }
        rescue IPAddr::InvalidAddressError
          O1_NONCANONICAL_IPV4_LITERAL.match?(host)
        end
      end
    end
  end
end
