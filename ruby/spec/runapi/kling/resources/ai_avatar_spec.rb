# frozen_string_literal: true

require "spec_helper"

RSpec.describe RunApi::Kling::Resources::AiAvatar do
  let(:http) { instance_double(RunApi::Core::HttpClient) }
  let(:resource) { described_class.new(http) }
  let(:endpoint) { "/api/v1/kling/ai_avatar" }

  it "POSTs current avatar models to the canonical endpoint" do
    params = {
      model: "kling-ai-avatar-pro",
      source_image_url: "https://cdn.runapi.ai/public/samples/portrait.jpg",
      source_audio_url: "https://cdn.runapi.ai/public/samples/music.mp3",
      prompt: "a person speaking"
    }
    expect(http).to receive(:request).with(:post, endpoint, body: params)
      .and_return("id" => "task-avatar")

    result = resource.create(**params)
    expect(result.id).to eq("task-avatar")
  end

  it "accepts v1 avatar models" do
    params = {
      model: "kling-ai-avatar-v1-pro",
      source_image_url: "https://cdn.runapi.ai/public/samples/portrait.jpg",
      source_audio_url: "https://cdn.runapi.ai/public/samples/music.mp3",
      prompt: "a person speaking"
    }
    expect(http).to receive(:request).with(:post, endpoint, body: params)
      .and_return("id" => "task-avatar-v1")

    result = resource.create(**params)
    expect(result.id).to eq("task-avatar-v1")
  end

  it "requires source_image_url" do
    expect do
      resource.create(model: "kling-ai-avatar-v1-pro", source_audio_url: "https://cdn.runapi.ai/public/samples/music.mp3", prompt: "test")
    end.to raise_error(RunApi::Core::ValidationError, /source_image_url is required/)
  end

  it "rejects invalid models" do
    expect do
      resource.create(
        model: "kling-ai-avatar-invalid",
        source_image_url: "https://cdn.runapi.ai/public/samples/portrait.jpg",
        source_audio_url: "https://cdn.runapi.ai/public/samples/music.mp3",
        prompt: "test"
      )
    end.to raise_error(RunApi::Core::ValidationError, /model must be one of:/)
  end
end
