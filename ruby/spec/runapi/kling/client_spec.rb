# frozen_string_literal: true

require "spec_helper"

RSpec.describe RunApi::Kling::Client do
  before do
    allow(ConnectionPool).to receive(:new).and_return(instance_double(ConnectionPool))
  end

  after { RunApi.api_key = nil }

  it "accepts api_key as parameter" do
    client = described_class.new(api_key: "param-key")
    expect(client).to be_a(described_class)
  end

  it "falls back to global RunApi.api_key" do
    RunApi.api_key = "global-key"
    client = described_class.new
    expect(client).to be_a(described_class)
  end

  it "raises AuthenticationError without api_key" do
    expect { described_class.new }.to raise_error(RunApi::Core::AuthenticationError, /API key is required/)
  end

  context "with custom http_client" do
    it "uses the provided http_client" do
      custom_http = double("custom_http")
      client = described_class.new(api_key: "test-key", http_client: custom_http)
      expect(client.text_to_video.instance_variable_get(:@http)).to eq(custom_http)
    end

    it "falls back to Core::HttpClient when http_client is nil" do
      allow(ConnectionPool).to receive(:new).and_return(instance_double(ConnectionPool))
      client = described_class.new(api_key: "test-key")
      expect(client.text_to_video.instance_variable_get(:@http)).to be_a(RunApi::Core::HttpClient)
    end
  end

  it "exposes text_to_video accessor" do
    client = described_class.new(api_key: "test-key")
    expect(client.text_to_video).to be_a(RunApi::Kling::Resources::TextToVideo)
  end

  it "exposes image_to_video accessor" do
    client = described_class.new(api_key: "test-key")
    expect(client.image_to_video).to be_a(RunApi::Kling::Resources::ImageToVideo)
  end

  it "exposes ai_avatar accessor" do
    client = described_class.new(api_key: "test-key")
    expect(client.ai_avatar).to be_a(RunApi::Kling::Resources::AiAvatar)
  end

  it "exposes motion_control accessor" do
    client = described_class.new(api_key: "test-key")
    expect(client.motion_control).to be_a(RunApi::Kling::Resources::MotionControl)
  end

  context "universal resources inherited from Core::Client" do
    it "exposes files" do
      client = described_class.new(api_key: "test-key")
      expect(client.files).to be_a(RunApi::Core::Files)
    end

    it "exposes account" do
      client = described_class.new(api_key: "test-key")
      expect(client.account).to be_a(RunApi::Core::Account)
    end
  end
end
