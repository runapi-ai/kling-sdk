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

    it "rejects Kling 2.6 sound outside pro mode" do
      expect do
        text_to_video.create(model: "kling-v2.6", prompt: "test", enable_sound: true)
      end.to raise_error(RunApi::Core::ValidationError, /enable_sound requires mode pro for kling-v2.6/)
    end

    it "rejects unsupported V3 Turbo text-to-video fields" do
      expect do
        text_to_video.create(
          model: "kling-v3-turbo-text-to-video",
          prompt: "a quiet city street after rain",
          enable_sound: false
        )
      end.to raise_error(RunApi::Core::ValidationError, /enable_sound is not supported by kling-v3-turbo-text-to-video/)
    end

    it "raises ValidationError when model is missing" do
      expect { text_to_video.create(prompt: "test") }
        .to raise_error(RunApi::Core::ValidationError, /model must be one of:/)
    end

    it "raises ValidationError for invalid model" do
      expect { text_to_video.create(model: "kling-2.0", prompt: "test") }
        .to raise_error(RunApi::Core::ValidationError, /model must be one of:/)
    end

    it "raises ValidationError when prompt is missing in single-shot mode" do
      expect { text_to_video.create(model: "kling-3.0") }
        .to raise_error(RunApi::Core::ValidationError, /prompt is required/)
    end

    it "raises ValidationError for invalid output_resolution" do
      expect { text_to_video.create(model: "kling-3.0", prompt: "test", output_resolution: "ultra") }
        .to raise_error(RunApi::Core::ValidationError, /output_resolution must be one of: 720p, 1080p, 4k/)
    end

    it "raises ValidationError for invalid aspect_ratio" do
      expect { text_to_video.create(model: "kling-3.0", prompt: "test", aspect_ratio: "4:3") }
        .to raise_error(RunApi::Core::ValidationError, %r{aspect_ratio must be one of: 16:9, 9:16, 1:1})
    end

    it "raises ValidationError for out-of-range duration_seconds" do
      expect { text_to_video.create(model: "kling-3.0", prompt: "test", duration_seconds: 20) }
        .to raise_error(RunApi::Core::ValidationError, /duration_seconds must be one of: 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15/)
    end

    it "raises ValidationError for invalid V2.1 duration_seconds" do
      expect { text_to_video.create(model: "kling-v2.1-master-text-to-video", prompt: "test", duration_seconds: 7) }
        .to raise_error(RunApi::Core::ValidationError, /duration_seconds must be one of: 5, 10/)
    end
  end

  describe "#create (multi-shot)" do
    let(:valid_multi_prompt) do
      [
        {prompt: "a dog running", duration_seconds: 3},
        {prompt: "a cat watching", duration_seconds: 3}
      ]
    end

    it "accepts a valid multi-shot request" do
      params = {
        model: "kling-3.0",
        multi_shots: true,
        enable_sound: true,
        duration_seconds: 6,
        output_resolution: "1080p",
        multi_prompt: valid_multi_prompt
      }
      expect(http).to receive(:request).with(:post, endpoint, body: params)
        .and_return("id" => "task-multi")

      result = text_to_video.create(**params)
      expect(result.id).to eq("task-multi")
    end

    it "raises ValidationError when enable_sound is not true" do
      expect do
        text_to_video.create(
          model: "kling-3.0",
          multi_shots: true,
          enable_sound: false,
          multi_prompt: valid_multi_prompt
        )
      end.to raise_error(RunApi::Core::ValidationError, /enable_sound must be true when multi_shots is true/)
    end

    it "raises ValidationError when multi_prompt is missing" do
      expect do
        text_to_video.create(
          model: "kling-3.0",
          multi_shots: true,
          enable_sound: true
        )
      end.to raise_error(RunApi::Core::ValidationError, /multi_prompt must be a non-empty array/)
    end

    it "raises ValidationError when multi_prompt is empty" do
      expect do
        text_to_video.create(
          model: "kling-3.0",
          multi_shots: true,
          enable_sound: true,
          multi_prompt: []
        )
      end.to raise_error(RunApi::Core::ValidationError, /multi_prompt must be a non-empty array/)
    end

    it "raises ValidationError when a shot prompt exceeds 500 chars" do
      long_prompt = "a" * 501
      expect do
        text_to_video.create(
          model: "kling-3.0",
          multi_shots: true,
          enable_sound: true,
          multi_prompt: [{prompt: long_prompt, duration_seconds: 3}]
        )
      end.to raise_error(RunApi::Core::ValidationError, /exceeds 500 characters/)
    end

    it "raises ValidationError when a shot duration_seconds is out of range" do
      expect do
        text_to_video.create(
          model: "kling-3.0",
          multi_shots: true,
          enable_sound: true,
          multi_prompt: [{prompt: "test", duration_seconds: 15}]
        )
      end.to raise_error(RunApi::Core::ValidationError, /duration_seconds must be between 1 and 12/)
    end

    it "does not require top-level prompt when multi_shots is true" do
      params = {
        model: "kling-3.0",
        multi_shots: true,
        enable_sound: true,
        multi_prompt: valid_multi_prompt
      }
      expect(http).to receive(:request).with(:post, endpoint, body: params)
        .and_return("id" => "task-no-prompt")

      expect { text_to_video.create(**params) }.not_to raise_error
    end

    it "rejects last_frame_image_url in multi-shot mode" do
      expect do
        text_to_video.create(
          model: "kling-3.0",
          multi_shots: true,
          enable_sound: true,
          multi_prompt: valid_multi_prompt,
          last_frame_image_url: "https://cdn.runapi.ai/public/samples/last-frame.jpg"
        )
      end.to raise_error(RunApi::Core::ValidationError, /last_frame_image_url is not supported/)
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
