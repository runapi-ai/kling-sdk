# frozen_string_literal: true

require "spec_helper"

RSpec.describe RunApi::Kling::Resources::ImageToVideo do
  let(:http) { instance_double(RunApi::Core::HttpClient) }
  let(:resource) { described_class.new(http) }

  it "POSTs image-to-video models to the canonical image_to_video endpoint" do
    params = {
      model: "kling-v2.5-turbo-image-to-video-pro",
      prompt: "a flower blooming",
      first_frame_image_url: "https://cdn.runapi.ai/public/samples/image-to-video.jpg",
      last_frame_image_url: "https://cdn.runapi.ai/public/samples/last-frame.jpg"
    }
    expect(http).to receive(:request).with(:post, "/api/v1/kling/image_to_video", body: params)
      .and_return("id" => "task-2")

    result = resource.create(**params)
    expect(result.id).to eq("task-2")
  end

  it "accepts V2.1 image-to-video models" do
    params = {
      model: "kling-v2.1-pro",
      prompt: "animate this frame",
      first_frame_image_url: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Golde33443.jpg",
      last_frame_image_url: "https://cdn.runapi.ai/public/samples/last-frame.jpg",
      duration_seconds: 10
    }
    expect(http).to receive(:request).with(:post, "/api/v1/kling/image_to_video", body: params)
      .and_return("id" => "task-v21")

    result = resource.create(**params)
    expect(result.id).to eq("task-v21")
  end

  it "accepts the V3 Turbo image-to-video model" do
    params = {
      model: "kling-v3-turbo-image-to-video",
      prompt: "camera glides toward the lighthouse",
      first_frame_image_url: "https://cdn.runapi.ai/public/samples/image-to-video.jpg",
      duration_seconds: 7,
      output_resolution: "720p"
    }
    expect(http).to receive(:request).with(:post, "/api/v1/kling/image_to_video", body: params)
      .and_return("id" => "task-v3-i2v")

    result = resource.create(**params)
    expect(result.id).to eq("task-v3-i2v")
  end

  it "requires first_frame_image_url" do
    expect do
      resource.create(model: "kling-v2.5-turbo-image-to-video-pro", prompt: "a flower blooming")
    end.to raise_error(RunApi::Core::ValidationError, /first_frame_image_url is required/)
  end

  it "rejects text-to-video models" do
    expect do
      resource.create(model: "kling-v2.5-turbo-text-to-video-pro", prompt: "a sunset")
    end.to raise_error(RunApi::Core::ValidationError, /model must be one of:/)
  end

  it "rejects last_frame_image_url outside supported image-to-video models" do
    expect do
      resource.create(
        model: "kling-v2.1-standard",
        prompt: "animate this frame",
        first_frame_image_url: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Golde33443.jpg",
        last_frame_image_url: "https://cdn.runapi.ai/public/samples/last-frame.jpg"
      )
    end.to raise_error(RunApi::Core::ValidationError, /last_frame_image_url/)
  end

  it "rejects unsupported V3 Turbo image-to-video fields" do
    expect do
      resource.create(
        model: "kling-v3-turbo-image-to-video",
        prompt: "camera glides toward the lighthouse",
        first_frame_image_url: "https://cdn.runapi.ai/public/samples/image-to-video.jpg",
        last_frame_image_url: "https://cdn.runapi.ai/public/samples/last-frame.jpg"
      )
    end.to raise_error(RunApi::Core::ValidationError, /last_frame_image_url is not supported by kling-v3-turbo-image-to-video/)
  end
end
