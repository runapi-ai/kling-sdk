# frozen_string_literal: true

require "spec_helper"

RSpec.describe RunApi::Kling::Resources::EditVideo do
  let(:http) { instance_double(RunApi::Core::HttpClient) }
  let(:resource) { described_class.new(http) }
  let(:endpoint) { "/api/v1/kling/edit_video" }
  let(:params) do
    {
      model: "kling-v3-omni-reference",
      prompt: "Keep the subject from the reference image",
      source_video_url: "https://cdn.runapi.ai/public/samples/video.mp4",
      reference_image_urls: ["https://cdn.runapi.ai/public/samples/image.jpg"],
      aspect_ratio: "16:9",
      enable_sound: false
    }
  end

  it "creates a task with the selected model" do
    expect(http).to receive(:request).with(:post, endpoint, body: params)
      .and_return("id" => "task-edit")

    expect(resource.create(**params).id).to eq("task-edit")
  end

  it "gets a task by id" do
    expect(http).to receive(:request).with(:get, "#{endpoint}/task-edit")
      .and_return("id" => "task-edit", "status" => "processing")

    expect(resource.get("task-edit").status).to eq("processing")
  end

  it "runs until the task completes" do
    expect(http).to receive(:request).with(:post, endpoint, body: params)
      .and_return("id" => "task-edit", "status" => "processing")
    expect(http).to receive(:request).with(:get, "#{endpoint}/task-edit")
      .and_return("id" => "task-edit", "status" => "completed", "videos" => [{"url" => "https://file.runapi.ai/edit.mp4"}])
    allow(RunApi::Core::Polling).to receive(:sleep)

    expect(resource.run(**params).status).to eq("completed")
  end

  it "requires a caller-supplied model" do
    expect do
      resource.create(
        prompt: "Turn the source video into a watercolor scene",
        source_video_url: "https://cdn.runapi.ai/public/samples/video.mp4",
        aspect_ratio: "auto"
      )
    end.to raise_error(RunApi::Core::ValidationError, /model must be one of/)
  end
end
