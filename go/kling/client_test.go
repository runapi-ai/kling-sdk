package kling

import (
	"context"
	"encoding/json"
	"testing"

	"github.com/runapi-ai/core-sdk/go/core"
)

type stubHTTPClient struct {
	method string
	path   string
	body   any
}

func (s *stubHTTPClient) Request(_ context.Context, method, path string, opts *core.HTTPRequestOptions) (json.RawMessage, error) {
	s.method = method
	s.path = path
	if opts != nil {
		s.body = opts.Body
	}
	return json.RawMessage(`{"id":"task_123","status":"processing"}`), nil
}

func TestTextToVideoCreateSingleShot(t *testing.T) {
	stub := &stubHTTPClient{}
	client := NewClientWithHTTP(stub)
	_, err := client.TextToVideo.Create(context.Background(), TextToVideoParams{
		Model:       ModelKling30,
		Prompt:      "a cat playing piano",
		Duration:    "5",
		AspectRatio: "16:9",
		Mode:        ModePro,
	})
	if err != nil {
		t.Fatal(err)
	}
	if stub.method != "POST" || stub.path != "/api/v1/kling/text_to_video" {
		t.Fatalf("unexpected request: %s %s", stub.method, stub.path)
	}
	body := stub.body.(map[string]any)
	if body["model"] != "kling-3.0" {
		t.Fatalf("unexpected model: %v", body["model"])
	}
	if body["prompt"] != "a cat playing piano" {
		t.Fatalf("unexpected prompt: %v", body["prompt"])
	}
	if body["duration"] != "5" {
		t.Fatalf("expected duration '5', got: %v", body["duration"])
	}
	if body["mode"] != "pro" {
		t.Fatalf("expected mode 'pro', got: %v", body["mode"])
	}
}

func TestTextToVideoCreateMultiShot(t *testing.T) {
	stub := &stubHTTPClient{}
	client := NewClientWithHTTP(stub)
	trueVal := true
	_, err := client.TextToVideo.Create(context.Background(), TextToVideoParams{
		Model:      ModelKling30,
		MultiShots: &trueVal,
		Sound:      &trueVal,
		Duration:   "6",
		Mode:       ModePro,
		MultiPrompt: []MultiPromptItem{
			{Prompt: "a cat exploring an attic", Duration: 3},
			{Prompt: "the cat finds a treasure", Duration: 3},
		},
	})
	if err != nil {
		t.Fatal(err)
	}
	body := stub.body.(map[string]any)
	if body["multi_shots"] != true {
		t.Fatalf("expected multi_shots true, got: %v", body["multi_shots"])
	}
	shots, ok := body["multi_prompt"].([]any)
	if !ok || len(shots) != 2 {
		t.Fatalf("expected multi_prompt with 2 items, got: %v", body["multi_prompt"])
	}
	firstShot := shots[0].(map[string]any)
	if firstShot["prompt"] != "a cat exploring an attic" {
		t.Fatalf("unexpected first shot prompt: %v", firstShot["prompt"])
	}
	// JSON numbers decode as float64 for any
	if firstShot["duration"].(float64) != 3 {
		t.Fatalf("unexpected first shot duration: %v", firstShot["duration"])
	}
}

func TestTextToVideoCreateCompactsEmptyFields(t *testing.T) {
	stub := &stubHTTPClient{}
	client := NewClientWithHTTP(stub)
	_, err := client.TextToVideo.Create(context.Background(), TextToVideoParams{
		Model:  ModelKling30,
		Prompt: "test",
	})
	if err != nil {
		t.Fatal(err)
	}
	body := stub.body.(map[string]any)
	if _, ok := body["callback_url"]; ok {
		t.Fatal("expected empty callback_url to be compacted away")
	}
	if _, ok := body["multi_prompt"]; ok {
		t.Fatal("expected empty multi_prompt to be compacted away")
	}
	if _, ok := body["kling_elements"]; ok {
		t.Fatal("expected empty kling_elements to be compacted away")
	}
	if _, ok := body["image_urls"]; ok {
		t.Fatal("expected empty image_urls to be compacted away")
	}
}

func TestTextToVideoCreateWithElements(t *testing.T) {
	stub := &stubHTTPClient{}
	client := NewClientWithHTTP(stub)
	_, err := client.TextToVideo.Create(context.Background(), TextToVideoParams{
		Model:  ModelKling30,
		Prompt: "a bright room @element_dog",
		KlingElements: []KlingElement{
			{
				Name:             "element_dog",
				Description:      "dog",
				ElementInputURLs: []string{"https://example.com/dog1.jpg", "https://example.com/dog2.jpg"},
			},
		},
	})
	if err != nil {
		t.Fatal(err)
	}
	body := stub.body.(map[string]any)
	elements, ok := body["kling_elements"].([]any)
	if !ok || len(elements) != 1 {
		t.Fatalf("expected kling_elements with 1 item, got: %v", body["kling_elements"])
	}
	el := elements[0].(map[string]any)
	if el["name"] != "element_dog" {
		t.Fatalf("unexpected element name: %v", el["name"])
	}
	urls, ok := el["element_input_urls"].([]any)
	if !ok || len(urls) != 2 {
		t.Fatalf("expected 2 element_input_urls, got: %v", el["element_input_urls"])
	}
}

func TestTextToVideoGet(t *testing.T) {
	stub := &stubHTTPClient{}
	client := NewClientWithHTTP(stub)
	_, err := client.TextToVideo.Get(context.Background(), "task_abc")
	if err != nil {
		t.Fatal(err)
	}
	if stub.method != "GET" || stub.path != "/api/v1/kling/text_to_video/task_abc" {
		t.Fatalf("unexpected request: %s %s", stub.method, stub.path)
	}
}

// --- AI Avatar tests ---

func TestAiAvatarCreate(t *testing.T) {
	stub := &stubHTTPClient{}
	client := NewClientWithHTTP(stub)
	_, err := client.AiAvatar.Create(context.Background(), AiAvatarParams{
		Model:    ModelAiAvatarPro,
		ImageURL: "https://example.com/face.jpg",
		AudioURL: "https://example.com/audio.mp3",
		Prompt:   "a person speaking naturally",
	})
	if err != nil {
		t.Fatal(err)
	}
	if stub.method != "POST" || stub.path != "/api/v1/kling/ai_avatar" {
		t.Fatalf("unexpected request: %s %s", stub.method, stub.path)
	}
	body := stub.body.(map[string]any)
	if body["model"] != "kling-ai-avatar-pro" {
		t.Fatalf("unexpected model: %v", body["model"])
	}
	if body["image_url"] != "https://example.com/face.jpg" {
		t.Fatalf("unexpected image_url: %v", body["image_url"])
	}
	if body["audio_url"] != "https://example.com/audio.mp3" {
		t.Fatalf("unexpected audio_url: %v", body["audio_url"])
	}
	if body["prompt"] != "a person speaking naturally" {
		t.Fatalf("unexpected prompt: %v", body["prompt"])
	}
}

func TestAiAvatarCreateCompactsEmptyFields(t *testing.T) {
	stub := &stubHTTPClient{}
	client := NewClientWithHTTP(stub)
	_, err := client.AiAvatar.Create(context.Background(), AiAvatarParams{
		Model:    ModelAiAvatarStandard,
		ImageURL: "https://example.com/face.jpg",
		AudioURL: "https://example.com/audio.mp3",
		Prompt:   "test",
	})
	if err != nil {
		t.Fatal(err)
	}
	body := stub.body.(map[string]any)
	if _, ok := body["callback_url"]; ok {
		t.Fatal("expected empty callback_url to be compacted away")
	}
}

func TestAiAvatarGet(t *testing.T) {
	stub := &stubHTTPClient{}
	client := NewClientWithHTTP(stub)
	_, err := client.AiAvatar.Get(context.Background(), "task_avatar")
	if err != nil {
		t.Fatal(err)
	}
	if stub.method != "GET" || stub.path != "/api/v1/kling/ai_avatar/task_avatar" {
		t.Fatalf("unexpected request: %s %s", stub.method, stub.path)
	}
}

// --- V2.5 Turbo tests ---

func TestImageToVideoCreateT2V(t *testing.T) {
	stub := &stubHTTPClient{}
	client := NewClientWithHTTP(stub)
	_, err := client.TextToVideo.Create(context.Background(), TextToVideoParams{
		Model:       ModelV25TurboT2VPro,
		Prompt:      "a sunset over the ocean",
		Duration:    "5",
		AspectRatio: "16:9",
	})
	if err != nil {
		t.Fatal(err)
	}
	if stub.method != "POST" || stub.path != "/api/v1/kling/text_to_video" {
		t.Fatalf("unexpected request: %s %s", stub.method, stub.path)
	}
	body := stub.body.(map[string]any)
	if body["model"] != "kling-v2.5-turbo-text-to-video-pro" {
		t.Fatalf("unexpected model: %v", body["model"])
	}
	if body["prompt"] != "a sunset over the ocean" {
		t.Fatalf("unexpected prompt: %v", body["prompt"])
	}
	if body["duration"] != "5" {
		t.Fatalf("expected duration '5', got: %v", body["duration"])
	}
}

func TestImageToVideoCreateI2V(t *testing.T) {
	stub := &stubHTTPClient{}
	client := NewClientWithHTTP(stub)
	_, err := client.ImageToVideo.Create(context.Background(), ImageToVideoParams{
		Model:    ModelV25TurboI2VPro,
		Prompt:   "a flower blooming",
		ImageURL: "https://example.com/flower.jpg",
	})
	if err != nil {
		t.Fatal(err)
	}
	body := stub.body.(map[string]any)
	if body["model"] != "kling-v2.5-turbo-image-to-video-pro" {
		t.Fatalf("unexpected model: %v", body["model"])
	}
	if body["image_url"] != "https://example.com/flower.jpg" {
		t.Fatalf("unexpected image_url: %v", body["image_url"])
	}
}

func TestImageToVideoCreateCompactsEmptyFields(t *testing.T) {
	stub := &stubHTTPClient{}
	client := NewClientWithHTTP(stub)
	_, err := client.TextToVideo.Create(context.Background(), TextToVideoParams{
		Model:  ModelV25TurboT2VPro,
		Prompt: "test",
	})
	if err != nil {
		t.Fatal(err)
	}
	body := stub.body.(map[string]any)
	if _, ok := body["callback_url"]; ok {
		t.Fatal("expected empty callback_url to be compacted away")
	}
	if _, ok := body["negative_prompt"]; ok {
		t.Fatal("expected empty negative_prompt to be compacted away")
	}
	if _, ok := body["image_url"]; ok {
		t.Fatal("expected empty image_url to be compacted away")
	}
}

func TestImageToVideoGet(t *testing.T) {
	stub := &stubHTTPClient{}
	client := NewClientWithHTTP(stub)
	_, err := client.ImageToVideo.Get(context.Background(), "task_turbo")
	if err != nil {
		t.Fatal(err)
	}
	if stub.method != "GET" || stub.path != "/api/v1/kling/image_to_video/task_turbo" {
		t.Fatalf("unexpected request: %s %s", stub.method, stub.path)
	}
}

// --- Motion Control tests ---

func TestMotionControlCreate(t *testing.T) {
	stub := &stubHTTPClient{}
	client := NewClientWithHTTP(stub)
	_, err := client.MotionControl.Create(context.Background(), MotionControlParams{
		Model:     ModelKling30,
		InputURLs: []string{"https://example.com/person.jpg"},
		VideoURLs: []string{"https://example.com/dance.mp4"},
		Prompt:    "a person dancing",
		Mode:      "1080p",
	})
	if err != nil {
		t.Fatal(err)
	}
	if stub.method != "POST" || stub.path != "/api/v1/kling/motion_control" {
		t.Fatalf("unexpected request: %s %s", stub.method, stub.path)
	}
	body := stub.body.(map[string]any)
	if body["model"] != "kling-3.0" {
		t.Fatalf("unexpected model: %v", body["model"])
	}
	inputURLs, ok := body["input_urls"].([]any)
	if !ok || len(inputURLs) != 1 {
		t.Fatalf("expected input_urls with 1 item, got: %v", body["input_urls"])
	}
	videoURLs, ok := body["video_urls"].([]any)
	if !ok || len(videoURLs) != 1 {
		t.Fatalf("expected video_urls with 1 item, got: %v", body["video_urls"])
	}
}

func TestMotionControlCreateWithAllOptions(t *testing.T) {
	stub := &stubHTTPClient{}
	client := NewClientWithHTTP(stub)
	_, err := client.MotionControl.Create(context.Background(), MotionControlParams{
		Model:                ModelKling30,
		InputURLs:            []string{"https://example.com/person.jpg"},
		VideoURLs:            []string{"https://example.com/dance.mp4"},
		Prompt:               "a person dancing",
		Mode:                 "720p",
		CharacterOrientation: "video",
		BackgroundSource:     "input_video",
		CallbackURL:          "https://example.com/webhook",
	})
	if err != nil {
		t.Fatal(err)
	}
	body := stub.body.(map[string]any)
	if body["character_orientation"] != "video" {
		t.Fatalf("unexpected character_orientation: %v", body["character_orientation"])
	}
	if body["background_source"] != "input_video" {
		t.Fatalf("unexpected background_source: %v", body["background_source"])
	}
	if body["callback_url"] != "https://example.com/webhook" {
		t.Fatalf("unexpected callback_url: %v", body["callback_url"])
	}
}

func TestMotionControlCreateCompactsEmptyFields(t *testing.T) {
	stub := &stubHTTPClient{}
	client := NewClientWithHTTP(stub)
	_, err := client.MotionControl.Create(context.Background(), MotionControlParams{
		Model:     ModelKling30,
		InputURLs: []string{"https://example.com/person.jpg"},
		VideoURLs: []string{"https://example.com/dance.mp4"},
	})
	if err != nil {
		t.Fatal(err)
	}
	body := stub.body.(map[string]any)
	if _, ok := body["prompt"]; ok {
		t.Fatal("expected empty prompt to be compacted away")
	}
	if _, ok := body["callback_url"]; ok {
		t.Fatal("expected empty callback_url to be compacted away")
	}
	if _, ok := body["character_orientation"]; ok {
		t.Fatal("expected empty character_orientation to be compacted away")
	}
	if _, ok := body["background_source"]; ok {
		t.Fatal("expected empty background_source to be compacted away")
	}
}

func TestMotionControlGet(t *testing.T) {
	stub := &stubHTTPClient{}
	client := NewClientWithHTTP(stub)
	_, err := client.MotionControl.Get(context.Background(), "task_motion")
	if err != nil {
		t.Fatal(err)
	}
	if stub.method != "GET" || stub.path != "/api/v1/kling/motion_control/task_motion" {
		t.Fatalf("unexpected request: %s %s", stub.method, stub.path)
	}
}
