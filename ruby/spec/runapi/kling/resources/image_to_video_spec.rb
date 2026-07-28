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

  it "accepts Kling 2.6 mode, sound, and final frame fields" do
    params = {
      model: "kling-v2.6",
      prompt: "camera follows the cyclist through fog",
      first_frame_image_url: "https://cdn.runapi.ai/public/samples/image-to-video.jpg",
      last_frame_image_url: "https://cdn.runapi.ai/public/samples/last-frame.jpg",
      mode: "pro",
      duration_seconds: 5,
      enable_sound: true,
      aspect_ratio: "16:9"
    }
    expect(http).to receive(:request).with(:post, "/api/v1/kling/image_to_video", body: params)
      .and_return("id" => "task-v26-i2v")

    result = resource.create(**params)
    expect(result.id).to eq("task-v26-i2v")
  end

  it "rejects Kling 2.6 sound outside pro mode" do
    expect do
      resource.create(
        model: "kling-v2.6",
        prompt: "test",
        first_frame_image_url: "https://cdn.runapi.ai/public/samples/image-to-video.jpg",
        enable_sound: true
      )
    end.to raise_error(RunApi::Core::ValidationError, /enable_sound requires mode pro for kling-v2.6/)
  end

  it "rejects Kling 2.6 final frames outside pro five-second requests" do
    base_params = {
      model: "kling-v2.6",
      prompt: "test",
      first_frame_image_url: "https://cdn.runapi.ai/public/samples/image-to-video.jpg",
      last_frame_image_url: "https://cdn.runapi.ai/public/samples/last-frame.jpg"
    }

    expect { resource.create(**base_params) }
      .to raise_error(RunApi::Core::ValidationError, /last_frame_image_url requires mode pro for kling-v2.6/)
    expect { resource.create(**base_params, mode: "pro", duration_seconds: 10) }
      .to raise_error(RunApi::Core::ValidationError, /last_frame_image_url requires duration_seconds 5 for kling-v2.6/)
  end

  it "accepts Kling V3 Omni resolution, sound, and final frame fields" do
    params = {
      model: "kling-v3-omni",
      prompt: "camera follows the cyclist through fog",
      first_frame_image_url: "https://cdn.runapi.ai/public/samples/portrait.jpg",
      last_frame_image_url: "https://cdn.runapi.ai/public/samples/image.jpg",
      output_resolution: "4k",
      duration_seconds: 5,
      enable_sound: false,
      aspect_ratio: "9:16"
    }
    expect(http).to receive(:request).with(:post, "/api/v1/kling/image_to_video", body: params)
      .and_return("id" => "task-v3-omni-i2v")

    result = resource.create(**params)
    expect(result.id).to eq("task-v3-omni-i2v")
  end

  it "rejects Kling V3 Omni final frames outside five-second requests" do
    expect do
      resource.create(
        model: "kling-v3-omni",
        prompt: "test",
        first_frame_image_url: "https://cdn.runapi.ai/public/samples/portrait.jpg",
        last_frame_image_url: "https://cdn.runapi.ai/public/samples/image.jpg",
        duration_seconds: 7
      )
    end.to raise_error(RunApi::Core::ValidationError, /last_frame_image_url requires duration_seconds 5 for kling-v3-omni/)
  end

  it "rejects Kling O1 base video references combined with frame inputs" do
    expect do
      resource.create(
        model: "kling-o1",
        prompt: "Use <<<video_1>>> as the base",
        first_frame_image_url: "https://cdn.runapi.ai/public/samples/image-to-video.jpg",
        reference_video_url: "https://cdn.runapi.ai/public/samples/video.mp4",
        reference_video_type: "base"
      )
    end.to raise_error(
      RunApi::Core::ValidationError,
      /reference_video_type base cannot be combined with first_frame_image_url or last_frame_image_url/
    )
  end

  it "rejects Kling O1 tail frames combined with reference media" do
    expect do
      resource.create(
        model: "kling-o1",
        prompt: "Move toward <<<image_1>>>",
        first_frame_image_url: "https://cdn.runapi.ai/public/samples/image-to-video.jpg",
        last_frame_image_url: "https://cdn.runapi.ai/public/samples/last-frame.jpg",
        reference_image_urls: ["https://cdn.runapi.ai/public/samples/portrait.jpg"]
      )
    end.to raise_error(
      RunApi::Core::ValidationError,
      /last_frame_image_url cannot be combined with reference_image_urls or reference_video_url/
    )
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
