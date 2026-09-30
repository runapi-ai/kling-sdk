# frozen_string_literal: true

require "spec_helper"

RSpec.describe RunApi::Kling::Resources::TextToVideo do
  let(:http) { instance_double(RunApi::Core::HttpClient) }
  let(:text_to_video) { described_class.new(http) }
  let(:endpoint) { "/api/v1/kling/text_to_video" }

  describe "#create (single-shot)" do
    it "POSTs to the correct endpoint with basic params" do
      params = {model: "kling-3.0", prompt: "a cat playing piano"}
      expect(http).to receive(:request).with(:post, endpoint, body: params)
        .and_return("id" => "task-1")

      result = text_to_video.create(**params)
      expect(result).to be_a(RunApi::Kling::Types::TextToVideoResponse)
      expect(result.id).to eq("task-1")
      expect(result["id"]).to eq("task-1")
    end

    it "passes through full single-shot params" do
      params = {
        model: "kling-3.0",
        prompt: "a sunset",
        enable_sound: true,
        duration_seconds: 5,
        aspect_ratio: "16:9",
        output_resolution: "1080p",
        first_frame_image_url: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Golde33443.jpg",
        last_frame_image_url: "https://cdn.runapi.ai/public/samples/last-frame.jpg"
      }
      expect(http).to receive(:request).with(:post, endpoint, body: params)
        .and_return("id" => "task-2")

      text_to_video.create(**params)
    end

    it "passes through element audio and time fields" do
      params = {
        model: "kling-3.0",
        prompt: "A bright room @element_dog @element_run",
        kling_elements: [
          {
            name: "element_dog",
            description: "dog",
            element_input_urls: [
              "https://upload.wikimedia.org/wikipedia/commons/6/6e/Golde33443.jpg",
              "https://upload.wikimedia.org/wikipedia/commons/9/9a/Pug_600.jpg"
            ],
            element_input_audio_urls: ["https://cdn.runapi.ai/public/samples/music.mp3"]
          },
          {
            name: "element_run",
            description: "running dog",
            element_input_urls: ["https://cdn.runapi.ai/public/samples/video.mp4"],
            start_time: 1000,
            end_time: 6000
          }
        ]
      }
      expect(http).to receive(:request).with(:post, endpoint, body: params)
        .and_return("id" => "task-elements")

      text_to_video.create(**params)
    end

    it "accepts 4k output resolution" do
      params = {
        model: "kling-3.0",
        prompt: "a 4K establishing shot of a glass observatory above clouds",
        duration_seconds: 5,
        aspect_ratio: "16:9",
        output_resolution: "4k"
      }
      expect(http).to receive(:request).with(:post, endpoint, body: params)
        .and_return("id" => "task-4k")

      result = text_to_video.create(**params)
      expect(result.id).to eq("task-4k")
    end

    it "accepts the V2.5 Turbo text-to-video model" do
      params = {
        model: "kling-v2.5-turbo-text-to-video-pro",
        prompt: "a sunset over mountains",
        duration_seconds: 5
      }
      expect(http).to receive(:request).with(:post, endpoint, body: params)
        .and_return("id" => "task-v25-t2v")

      result = text_to_video.create(**params)
      expect(result.id).to eq("task-v25-t2v")
    end

    it "accepts the V2.1 Master text-to-video model" do
      params = {
        model: "kling-v2.1-master-text-to-video",
        prompt: "a cinematic paratrooper scene",
        duration_seconds: 10,
        aspect_ratio: "16:9",
        negative_prompt: "blur",
        cfg_scale: 0.5
      }
      expect(http).to receive(:request).with(:post, endpoint, body: params)
        .and_return("id" => "task-v21-master-t2v")

      result = text_to_video.create(**params)
      expect(result.id).to eq("task-v21-master-t2v")
    end

    it "accepts the V3 Turbo text-to-video model" do
      params = {
        model: "kling-v3-turbo-text-to-video",
        prompt: "a silver train crossing a moonlit bridge",
        duration_seconds: 7,
        aspect_ratio: "16:9",
        output_resolution: "1080p"
      }
      expect(http).to receive(:request).with(:post, endpoint, body: params)
        .and_return("id" => "task-v3-turbo-t2v")

      result = text_to_video.create(**params)
      expect(result.id).to eq("task-v3-turbo-t2v")
    end

    it "accepts Kling 2.6 mode and sound fields" do
      params = {
        model: "kling-v2.6",
        prompt: "a paper boat crossing a rain puddle",
        mode: "pro",
        duration_seconds: 10,
        enable_sound: true,
        aspect_ratio: "16:9"
      }
      expect(http).to receive(:request).with(:post, endpoint, body: params)
        .and_return("id" => "task-v26-t2v")

      result = text_to_video.create(**params)
      expect(result.id).to eq("task-v26-t2v")
    end

    it "passes through Kling O1 image and video references" do
      params = {
        model: "kling-o1",
        prompt: "Keep <<<image_1>>> beside <<<video_1>>>",
        reference_image_urls: ["https://cdn.runapi.ai/public/samples/portrait.jpg"],
        reference_video_url: "https://cdn.runapi.ai/public/samples/video.mp4",
        reference_video_type: "feature",
        preserve_reference_video_audio: true,
        duration_seconds: 5
      }
      expect(http).to receive(:request).with(:post, endpoint, body: params)
        .and_return("id" => "task-o1")

      expect(text_to_video.create(**params).id).to eq("task-o1")
    end

    it "accepts Kling V3 Omni resolution and sound fields" do
      params = {
        model: "kling-v3-omni",
        prompt: "a paper boat crossing a rain puddle",
        output_resolution: "1080p",
        duration_seconds: 10,
        enable_sound: true,
        aspect_ratio: "16:9"
      }
      expect(http).to receive(:request).with(:post, endpoint, body: params)
        .and_return("id" => "task-v3-omni-t2v")

      result = text_to_video.create(**params)
      expect(result.id).to eq("task-v3-omni-t2v")
    end

    it "does not require top-level prompt when multi_shots is true" do
      params = {
        model: "kling-3.0",
        multi_shots: true,
        enable_sound: true,
        multi_prompt: [{prompt: "a dog running", duration_seconds: 3}, {prompt: "a cat watching", duration_seconds: 3}]
      }
      expect(http).to receive(:request).with(:post, endpoint, body: params)
        .and_return("id" => "task-no-prompt")

      expect { text_to_video.create(**params) }.not_to raise_error
    end
  end

  describe "Kling V3 Omni reference images" do
    it "uses text_to_video with the reference model" do
      params = {
        model: "kling-v3-omni-reference",
        prompt: "Keep the subject from the reference image",
        reference_image_urls: ["https://cdn.runapi.ai/public/samples/image.jpg"],
        aspect_ratio: "16:9"
      }
      expect(http).to receive(:request).with(:post, endpoint, body: params)
        .and_return("id" => "task-reference-image")

      expect(text_to_video.create(**params).id).to eq("task-reference-image")
    end
  end

  describe "#get" do
    it "GETs the correct endpoint" do
      expect(http).to receive(:request).with(:get, "#{endpoint}/task-1")
        .and_return("id" => "task-1", "status" => "completed", "model" => "kling-3.0")

      result = text_to_video.get("task-1")
      expect(result).to be_a(RunApi::Kling::Types::TextToVideoResponse)
      expect(result.status).to eq("completed")
      expect(result.model).to eq("kling-3.0")
    end

    it "exposes videos array on completed response" do
      expect(http).to receive(:request).with(:get, "#{endpoint}/task-1")
        .and_return(
          "id" => "task-1",
          "status" => "completed",
          "model" => "kling-3.0",
          "videos" => [{"url" => "https://cdn.runapi.ai/public/samples/video.mp4"}]
        )

      result = text_to_video.get("task-1")
      expect(result.videos.size).to eq(1)
      expect(result.videos.first.url).to eq("https://cdn.runapi.ai/public/samples/video.mp4")
    end

    it "exposes error on failed response" do
      expect(http).to receive(:request).with(:get, "#{endpoint}/task-1")
        .and_return(
          "id" => "task-1",
          "status" => "failed",
          "model" => "kling-3.0",
          "error" => "Generation failed"
        )

      result = text_to_video.get("task-1")
      expect(result.status).to eq("failed")
      expect(result.error).to eq("Generation failed")
    end
  end

  describe "#run" do
    it "creates then polls until complete" do
      create_params = {model: "kling-3.0", prompt: "a cat"}
      expect(http).to receive(:request).with(:post, endpoint, body: create_params)
        .and_return("id" => "task-1")

      expect(http).to receive(:request).with(:get, "#{endpoint}/task-1")
        .and_return("id" => "task-1", "status" => "processing")
      expect(http).to receive(:request).with(:get, "#{endpoint}/task-1")
        .and_return(
          "id" => "task-1",
          "status" => "completed",
          "model" => "kling-3.0",
          "videos" => [{"url" => "https://cdn.runapi.ai/public/samples/video.mp4"}]
        )

      allow(RunApi::Core::Polling).to receive(:sleep)

      result = text_to_video.run(**create_params)
      expect(result.status).to eq("completed")
      expect(result.videos.first.url).to eq("https://cdn.runapi.ai/public/samples/video.mp4")
    end
  end
end
