# frozen_string_literal: true

require "spec_helper"

RSpec.describe RunApi::Kling::Resources::MotionControl do
  let(:http) { instance_double(RunApi::Core::HttpClient) }
  let(:resource) { described_class.new(http) }
  let(:endpoint) { "/api/v1/kling/motion_control" }

  it "POSTs motion-control params with output_resolution" do
    params = {
      model: "kling-3.0",
      source_image_url: "https://cdn.runapi.ai/public/samples/portrait.jpg",
      reference_video_url: "https://cdn.runapi.ai/public/samples/video.mp4",
      prompt: "a person dancing",
      output_resolution: "1080p",
      character_orientation: "video",
      background_source: "video"
    }
    expect(http).to receive(:request).with(:post, endpoint, body: params)
      .and_return("id" => "task-motion")

    result = resource.create(**params)
    expect(result.id).to eq("task-motion")
  end

  it "POSTs Kling 2.6 motion-control params" do
    params = {
      model: "kling-v2.6",
      source_image_url: "https://cdn.runapi.ai/public/samples/portrait.jpg",
      reference_video_url: "https://cdn.runapi.ai/public/samples/video.mp4",
      output_resolution: "1080p",
      character_orientation: "image"
    }
    expect(http).to receive(:request).with(:post, endpoint, body: params)
      .and_return("id" => "task-motion-v26")

    expect(resource.create(**params).id).to eq("task-motion-v26")
  end
end
