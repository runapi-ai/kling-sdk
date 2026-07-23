package kling

import (
	"context"
	"encoding/json"
	"strings"
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
		Model:            ModelKling30,
		Prompt:           "a cat playing piano",
		DurationSeconds:  5,
		AspectRatio:      "16:9",
		OutputResolution: TextToVideoOutputResolution1080p,
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
	if body["duration_seconds"] != float64(5) {
		t.Fatalf("expected duration_seconds 5, got: %v", body["duration_seconds"])
	}
	if body["output_resolution"] != "1080p" {
		t.Fatalf("expected output_resolution '1080p', got: %v", body["output_resolution"])
	}
}

func TestTextToVideoCreate4KOutputResolution(t *testing.T) {
	stub := &stubHTTPClient{}
	client := NewClientWithHTTP(stub)
	_, err := client.TextToVideo.Create(context.Background(), TextToVideoParams{
		Model:            ModelKling30,
		Prompt:           "a 4K establishing shot of a glass observatory above clouds",
		DurationSeconds:  5,
		AspectRatio:      "16:9",
		OutputResolution: TextToVideoOutputResolution4K,
	})
	if err != nil {
		t.Fatal(err)
	}
	body := stub.body.(map[string]any)
	if body["model"] != "kling-3.0" {
		t.Fatalf("unexpected model: %v", body["model"])
	}
	if body["output_resolution"] != "4k" {
		t.Fatalf("expected output_resolution '4k', got: %v", body["output_resolution"])
	}
}

func TestTextToVideoCreateMultiShot(t *testing.T) {
	stub := &stubHTTPClient{}
	client := NewClientWithHTTP(stub)
	trueVal := true
	_, err := client.TextToVideo.Create(context.Background(), TextToVideoParams{
		Model:            ModelKling30,
		MultiShots:       &trueVal,
		EnableSound:      &trueVal,
		DurationSeconds:  6,
		OutputResolution: TextToVideoOutputResolution1080p,
		MultiPrompt: []MultiPromptItem{
			{Prompt: "a cat exploring an attic", DurationSeconds: 3},
			{Prompt: "the cat finds a treasure", DurationSeconds: 3},
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
	if firstShot["duration_seconds"].(float64) != 3 {
		t.Fatalf("unexpected first shot duration_seconds: %v", firstShot["duration_seconds"])
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
	if _, ok := body["first_frame_image_url"]; ok {
		t.Fatal("expected empty first_frame_image_url to be compacted away")
	}
	if _, ok := body["last_frame_image_url"]; ok {
		t.Fatal("expected empty last_frame_image_url to be compacted away")
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
				Name:                  "element_dog",
				Description:           "dog",
				ElementInputURLs:      []string{"https://upload.wikimedia.org/wikipedia/commons/6/6e/Golde33443.jpg", "https://upload.wikimedia.org/wikipedia/commons/9/9a/Pug_600.jpg"},
				ElementInputAudioURLs: []string{"https://cdn.runapi.ai/public/samples/music.mp3"},
			},
			{
				Name:             "element_run",
				Description:      "running dog",
				ElementInputURLs: []string{"https://cdn.runapi.ai/public/samples/video.mp4"},
				StartTime:        1000,
				EndTime:          6000,
			},
		},
	})
	if err != nil {
		t.Fatal(err)
	}
	body := stub.body.(map[string]any)
	elements, ok := body["kling_elements"].([]any)
	if !ok || len(elements) != 2 {
		t.Fatalf("expected kling_elements with 2 items, got: %v", body["kling_elements"])
	}
	el := elements[0].(map[string]any)
	if el["name"] != "element_dog" {
		t.Fatalf("unexpected element name: %v", el["name"])
	}
	urls, ok := el["element_input_urls"].([]any)
	if !ok || len(urls) != 2 {
		t.Fatalf("expected 2 element_input_urls, got: %v", el["element_input_urls"])
	}
	if audios, ok := el["element_input_audio_urls"].([]any); !ok || len(audios) != 1 {
		t.Fatalf("expected 1 element_input_audio_urls, got: %v", el["element_input_audio_urls"])
	}
	videoEl := elements[1].(map[string]any)
	if videos, ok := videoEl["element_input_urls"].([]any); !ok || len(videos) != 1 {
		t.Fatalf("expected 1 element_input_urls, got: %v", videoEl["element_input_urls"])
	}
	if videoEl["start_time"] != float64(1000) || videoEl["end_time"] != float64(6000) {
		t.Fatalf("unexpected video time range: %v", videoEl)
	}
}

func TestTextToVideoCreateV3Turbo(t *testing.T) {
	stub := &stubHTTPClient{}
	client := NewClientWithHTTP(stub)
	_, err := client.TextToVideo.Create(context.Background(), TextToVideoParams{
		Model:            ModelV3TurboT2V,
		Prompt:           "a silver train crossing a moonlit bridge",
		DurationSeconds:  7,
		AspectRatio:      "16:9",
		OutputResolution: TextToVideoOutputResolution1080p,
	})
	if err != nil {
		t.Fatal(err)
	}
	body := stub.body.(map[string]any)
	if body["model"] != "kling-v3-turbo-text-to-video" {
		t.Fatalf("unexpected model: %v", body["model"])
	}
	if body["duration_seconds"] != float64(7) {
		t.Fatalf("expected duration_seconds 7, got: %v", body["duration_seconds"])
	}
	if body["output_resolution"] != "1080p" {
		t.Fatalf("expected output_resolution '1080p', got: %v", body["output_resolution"])
	}
}

func TestTextToVideoRejectsV3TurboUnsupportedFields(t *testing.T) {
	stub := &stubHTTPClient{}
	client := NewClientWithHTTP(stub)
	falseVal := false
	_, err := client.TextToVideo.Create(context.Background(), TextToVideoParams{
		Model:       ModelV3TurboT2V,
		Prompt:      "a quiet city street after rain",
		EnableSound: &falseVal,
	})
	if err == nil {
		t.Fatal("expected validation error")
	}
	if !core.IsValidation(err) {
		t.Fatalf("expected validation error type, got: %v", err)
	}
	if !strings.Contains(err.Error(), "enable_sound is not supported by kling-v3-turbo-text-to-video") {
		t.Fatalf("unexpected error: %v", err)
	}
	if stub.body != nil {
		t.Fatalf("expected no request body, got: %v", stub.body)
	}
}

func TestTextToVideoCreateV26(t *testing.T) {
	stub := &stubHTTPClient{}
	client := NewClientWithHTTP(stub)
	trueVal := true
	_, err := client.TextToVideo.Create(context.Background(), TextToVideoParams{
		Model:           ModelV26T2V,
		Prompt:          "a paper boat crossing a rain puddle",
		Mode:            "pro",
		EnableSound:     &trueVal,
		DurationSeconds: 10,
		AspectRatio:     "16:9",
	})
	if err != nil {
		t.Fatal(err)
	}
	body := stub.body.(map[string]any)
	if body["model"] != "kling-v2.6" || body["mode"] != "pro" || body["enable_sound"] != true {
		t.Fatalf("unexpected Kling 2.6 body: %v", body)
	}
}

func TestTextToVideoCreateV3Omni(t *testing.T) {
	stub := &stubHTTPClient{}
	client := NewClientWithHTTP(stub)
	trueVal := true
	_, err := client.TextToVideo.Create(context.Background(), TextToVideoParams{
		Model:            ModelV3OmniT2V,
		Prompt:           "a paper boat crossing a rain puddle",
		OutputResolution: TextToVideoOutputResolution1080p,
		EnableSound:      &trueVal,
		DurationSeconds:  10,
		AspectRatio:      "16:9",
	})
	if err != nil {
		t.Fatal(err)
	}
	body := stub.body.(map[string]any)
	if body["model"] != "kling-v3-omni" || body["output_resolution"] != "1080p" || body["enable_sound"] != true {
		t.Fatalf("unexpected Kling V3 Omni body: %v", body)
	}
}

func TestTextToVideoRejectsV26SoundOutsideProMode(t *testing.T) {
	stub := &stubHTTPClient{}
	client := NewClientWithHTTP(stub)
	trueVal := true
	_, err := client.TextToVideo.Create(context.Background(), TextToVideoParams{
		Model:       ModelV26T2V,
		Prompt:      "a paper boat crossing a rain puddle",
		EnableSound: &trueVal,
	})
	if err == nil || !strings.Contains(err.Error(), "enable_sound requires mode pro for kling-v2.6") {
		t.Fatalf("unexpected error: %v", err)
	}
	if stub.body != nil {
		t.Fatalf("expected no request body, got: %v", stub.body)
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
		Model:          ModelAiAvatarPro,
		SourceImageURL: "https://cdn.runapi.ai/public/samples/portrait.jpg",
		SourceAudioURL: "https://cdn.runapi.ai/public/samples/music.mp3",
		Prompt:         "a person speaking naturally",
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
	if body["source_image_url"] != "https://cdn.runapi.ai/public/samples/portrait.jpg" {
		t.Fatalf("unexpected source_image_url: %v", body["source_image_url"])
	}
	if body["source_audio_url"] != "https://cdn.runapi.ai/public/samples/music.mp3" {
		t.Fatalf("unexpected source_audio_url: %v", body["source_audio_url"])
	}
	if body["prompt"] != "a person speaking naturally" {
		t.Fatalf("unexpected prompt: %v", body["prompt"])
	}
}

func TestAiAvatarCreateCompactsEmptyFields(t *testing.T) {
	stub := &stubHTTPClient{}
	client := NewClientWithHTTP(stub)
	_, err := client.AiAvatar.Create(context.Background(), AiAvatarParams{
		Model:          ModelAiAvatarStandard,
		SourceImageURL: "https://cdn.runapi.ai/public/samples/portrait.jpg",
		SourceAudioURL: "https://cdn.runapi.ai/public/samples/music.mp3",
		Prompt:         "test",
	})
	if err != nil {
		t.Fatal(err)
	}
	body := stub.body.(map[string]any)
	if _, ok := body["callback_url"]; ok {
		t.Fatal("expected empty callback_url to be compacted away")
	}
}

func TestAiAvatarCreateV1ProModel(t *testing.T) {
	stub := &stubHTTPClient{}
	client := NewClientWithHTTP(stub)
	_, err := client.AiAvatar.Create(context.Background(), AiAvatarParams{
		Model:          ModelAiAvatarV1Pro,
		SourceImageURL: "https://cdn.runapi.ai/public/samples/portrait.jpg",
		SourceAudioURL: "https://cdn.runapi.ai/public/samples/music.mp3",
		Prompt:         "a person speaking naturally",
	})
	if err != nil {
		t.Fatal(err)
	}
	body := stub.body.(map[string]any)
	if body["model"] != "kling-ai-avatar-v1-pro" {
		t.Fatalf("unexpected model: %v", body["model"])
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
		Model:           ModelV25TurboT2VPro,
		Prompt:          "a sunset over the ocean",
		DurationSeconds: 5,
		AspectRatio:     "16:9",
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
	if body["duration_seconds"] != float64(5) {
		t.Fatalf("expected duration_seconds 5, got: %v", body["duration_seconds"])
	}
}

func TestTextToVideoCreateV21Master(t *testing.T) {
	stub := &stubHTTPClient{}
	client := NewClientWithHTTP(stub)
	_, err := client.TextToVideo.Create(context.Background(), TextToVideoParams{
		Model:           ModelV21MasterT2V,
		Prompt:          "a cinematic paratrooper scene",
		DurationSeconds: 10,
		AspectRatio:     "16:9",
		NegativePrompt:  "blur",
	})
	if err != nil {
		t.Fatal(err)
	}
	body := stub.body.(map[string]any)
	if body["model"] != "kling-v2.1-master-text-to-video" {
		t.Fatalf("unexpected model: %v", body["model"])
	}
	if body["duration_seconds"] != float64(10) {
		t.Fatalf("expected duration_seconds 10, got: %v", body["duration_seconds"])
	}
	if _, ok := body["enable_sound"]; ok {
		t.Fatal("expected enable_sound to be compacted away")
	}
}

func TestImageToVideoCreateI2V(t *testing.T) {
	stub := &stubHTTPClient{}
	client := NewClientWithHTTP(stub)
	_, err := client.ImageToVideo.Create(context.Background(), ImageToVideoParams{
		Model:              ModelV25TurboI2VPro,
		Prompt:             "a flower blooming",
		FirstFrameImageURL: "https://cdn.runapi.ai/public/samples/image-to-video.jpg",
		LastFrameImageURL:  "https://cdn.runapi.ai/public/samples/last-frame.jpg",
	})
	if err != nil {
		t.Fatal(err)
	}
	body := stub.body.(map[string]any)
	if body["model"] != "kling-v2.5-turbo-image-to-video-pro" {
		t.Fatalf("unexpected model: %v", body["model"])
	}
	if body["first_frame_image_url"] != "https://cdn.runapi.ai/public/samples/image-to-video.jpg" {
		t.Fatalf("unexpected first_frame_image_url: %v", body["first_frame_image_url"])
	}
	if body["last_frame_image_url"] != "https://cdn.runapi.ai/public/samples/last-frame.jpg" {
		t.Fatalf("unexpected last_frame_image_url: %v", body["last_frame_image_url"])
	}
}

func TestImageToVideoCreateV21Pro(t *testing.T) {
	stub := &stubHTTPClient{}
	client := NewClientWithHTTP(stub)
	_, err := client.ImageToVideo.Create(context.Background(), ImageToVideoParams{
		Model:              ModelV21Pro,
		Prompt:             "animate this frame",
		FirstFrameImageURL: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Golde33443.jpg",
		LastFrameImageURL:  "https://cdn.runapi.ai/public/samples/last-frame.jpg",
		DurationSeconds:    10,
	})
	if err != nil {
		t.Fatal(err)
	}
	body := stub.body.(map[string]any)
	if body["model"] != "kling-v2.1-pro" {
		t.Fatalf("unexpected model: %v", body["model"])
	}
	if body["last_frame_image_url"] != "https://cdn.runapi.ai/public/samples/last-frame.jpg" {
		t.Fatalf("unexpected last_frame_image_url: %v", body["last_frame_image_url"])
	}
}

func TestImageToVideoCreateV3Turbo(t *testing.T) {
	stub := &stubHTTPClient{}
	client := NewClientWithHTTP(stub)
	_, err := client.ImageToVideo.Create(context.Background(), ImageToVideoParams{
		Model:              ModelV3TurboI2V,
		Prompt:             "camera glides toward the lighthouse",
		FirstFrameImageURL: "https://cdn.runapi.ai/public/samples/image-to-video.jpg",
		DurationSeconds:    7,
		OutputResolution:   ImageToVideoOutputResolution720p,
	})
	if err != nil {
		t.Fatal(err)
	}
	body := stub.body.(map[string]any)
	if body["model"] != "kling-v3-turbo-image-to-video" {
		t.Fatalf("unexpected model: %v", body["model"])
	}
	if body["output_resolution"] != "720p" {
		t.Fatalf("expected output_resolution '720p', got: %v", body["output_resolution"])
	}
}

func TestImageToVideoRejectsV3TurboUnsupportedFields(t *testing.T) {
	stub := &stubHTTPClient{}
	client := NewClientWithHTTP(stub)
	_, err := client.ImageToVideo.Create(context.Background(), ImageToVideoParams{
		Model:              ModelV3TurboI2V,
		Prompt:             "camera glides toward the lighthouse",
		FirstFrameImageURL: "https://cdn.runapi.ai/public/samples/image-to-video.jpg",
		LastFrameImageURL:  "https://cdn.runapi.ai/public/samples/last-frame.jpg",
	})
	if err == nil {
		t.Fatal("expected validation error")
	}
	if !core.IsValidation(err) {
		t.Fatalf("expected validation error type, got: %v", err)
	}
	if !strings.Contains(err.Error(), "last_frame_image_url is not supported by kling-v3-turbo-image-to-video") {
		t.Fatalf("unexpected error: %v", err)
	}
	if stub.body != nil {
		t.Fatalf("expected no request body, got: %v", stub.body)
	}
}

func TestImageToVideoCreateV26(t *testing.T) {
	stub := &stubHTTPClient{}
	client := NewClientWithHTTP(stub)
	trueVal := true
	_, err := client.ImageToVideo.Create(context.Background(), ImageToVideoParams{
		Model:              ModelV26I2V,
		Prompt:             "camera follows the cyclist through fog",
		FirstFrameImageURL: "https://cdn.runapi.ai/public/samples/image-to-video.jpg",
		LastFrameImageURL:  "https://cdn.runapi.ai/public/samples/last-frame.jpg",
		Mode:               "pro",
		EnableSound:        &trueVal,
		DurationSeconds:    5,
		AspectRatio:        "16:9",
	})
	if err != nil {
		t.Fatal(err)
	}
	body := stub.body.(map[string]any)
	if body["model"] != "kling-v2.6" || body["mode"] != "pro" || body["enable_sound"] != true {
		t.Fatalf("unexpected Kling 2.6 body: %v", body)
	}
	if body["last_frame_image_url"] != "https://cdn.runapi.ai/public/samples/last-frame.jpg" {
		t.Fatalf("unexpected last_frame_image_url: %v", body["last_frame_image_url"])
	}
}

func TestImageToVideoCreateV3Omni(t *testing.T) {
	stub := &stubHTTPClient{}
	client := NewClientWithHTTP(stub)
	falseVal := false
	_, err := client.ImageToVideo.Create(context.Background(), ImageToVideoParams{
		Model:              ModelV3OmniI2V,
		Prompt:             "camera follows the cyclist through fog",
		FirstFrameImageURL: "https://cdn.runapi.ai/public/samples/portrait.jpg",
		LastFrameImageURL:  "https://cdn.runapi.ai/public/samples/image.jpg",
		OutputResolution:   ImageToVideoOutputResolution4K,
		EnableSound:        &falseVal,
		DurationSeconds:    5,
		AspectRatio:        "9:16",
	})
	if err != nil {
		t.Fatal(err)
	}
	body := stub.body.(map[string]any)
	if body["model"] != "kling-v3-omni" || body["output_resolution"] != "4k" || body["enable_sound"] != false {
		t.Fatalf("unexpected Kling V3 Omni body: %v", body)
	}
	if body["last_frame_image_url"] != "https://cdn.runapi.ai/public/samples/image.jpg" {
		t.Fatalf("unexpected last_frame_image_url: %v", body["last_frame_image_url"])
	}
}

func TestImageToVideoRejectsV26ConditionalFields(t *testing.T) {
	trueVal := true
	tests := []struct {
		name    string
		params  ImageToVideoParams
		message string
	}{
		{
			name: "sound outside pro mode",
			params: ImageToVideoParams{
				Model: ModelV26I2V, Prompt: "test", FirstFrameImageURL: "https://example.test/first.jpg", EnableSound: &trueVal,
			},
			message: "enable_sound requires mode pro for kling-v2.6",
		},
		{
			name: "last frame outside pro mode",
			params: ImageToVideoParams{
				Model: ModelV26I2V, Prompt: "test", FirstFrameImageURL: "https://example.test/first.jpg", LastFrameImageURL: "https://example.test/last.jpg",
			},
			message: "last_frame_image_url requires mode pro for kling-v2.6",
		},
		{
			name: "last frame with ten seconds",
			params: ImageToVideoParams{
				Model: ModelV26I2V, Prompt: "test", FirstFrameImageURL: "https://example.test/first.jpg", LastFrameImageURL: "https://example.test/last.jpg", Mode: "pro", DurationSeconds: 10,
			},
			message: "last_frame_image_url requires duration_seconds 5 for kling-v2.6",
		},
	}
	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			stub := &stubHTTPClient{}
			client := NewClientWithHTTP(stub)
			_, err := client.ImageToVideo.Create(context.Background(), test.params)
			if err == nil || !strings.Contains(err.Error(), test.message) {
				t.Fatalf("unexpected error: %v", err)
			}
			if stub.body != nil {
				t.Fatalf("expected no request body, got: %v", stub.body)
			}
		})
	}
}

func TestImageToVideoRejectsV3OmniFinalFrameOutsideFiveSeconds(t *testing.T) {
	stub := &stubHTTPClient{}
	client := NewClientWithHTTP(stub)
	_, err := client.ImageToVideo.Create(context.Background(), ImageToVideoParams{
		Model:              ModelV3OmniI2V,
		Prompt:             "camera follows the cyclist through fog",
		FirstFrameImageURL: "https://cdn.runapi.ai/public/samples/portrait.jpg",
		LastFrameImageURL:  "https://cdn.runapi.ai/public/samples/image.jpg",
		DurationSeconds:    7,
	})
	if err == nil || !strings.Contains(err.Error(), "last_frame_image_url requires duration_seconds 5 for kling-v3-omni") {
		t.Fatalf("unexpected error: %v", err)
	}
	if stub.body != nil {
		t.Fatalf("expected no request body, got: %v", stub.body)
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
	if _, ok := body["first_frame_image_url"]; ok {
		t.Fatal("expected empty first_frame_image_url to be compacted away")
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
		Model:             ModelKling30,
		SourceImageURL:    "https://cdn.runapi.ai/public/samples/portrait.jpg",
		ReferenceVideoURL: "https://cdn.runapi.ai/public/samples/video.mp4",
		Prompt:            "a person dancing",
		OutputResolution:  "1080p",
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
	if body["source_image_url"] != "https://cdn.runapi.ai/public/samples/portrait.jpg" {
		t.Fatalf("unexpected source_image_url: %v", body["source_image_url"])
	}
	if body["reference_video_url"] != "https://cdn.runapi.ai/public/samples/video.mp4" {
		t.Fatalf("unexpected reference_video_url: %v", body["reference_video_url"])
	}
	if _, ok := body["input_urls"]; ok {
		t.Fatalf("unexpected provider input_urls key: %v", body["input_urls"])
	}
	if _, ok := body["video_urls"]; ok {
		t.Fatalf("unexpected provider video_urls key: %v", body["video_urls"])
	}
}

func TestMotionControlCreateWithAllOptions(t *testing.T) {
	stub := &stubHTTPClient{}
	client := NewClientWithHTTP(stub)
	_, err := client.MotionControl.Create(context.Background(), MotionControlParams{
		Model:                ModelKling30,
		SourceImageURL:       "https://cdn.runapi.ai/public/samples/portrait.jpg",
		ReferenceVideoURL:    "https://cdn.runapi.ai/public/samples/video.mp4",
		Prompt:               "a person dancing",
		OutputResolution:     "720p",
		CharacterOrientation: "video",
		BackgroundSource:     "video",
		CallbackURL:          "https://your-domain.com/webhook",
	})
	if err != nil {
		t.Fatal(err)
	}
	body := stub.body.(map[string]any)
	if body["character_orientation"] != "video" {
		t.Fatalf("unexpected character_orientation: %v", body["character_orientation"])
	}
	if body["background_source"] != "video" {
		t.Fatalf("unexpected background_source: %v", body["background_source"])
	}
	if body["output_resolution"] != "720p" {
		t.Fatalf("unexpected output_resolution: %v", body["output_resolution"])
	}
	if _, ok := body["mode"]; ok {
		t.Fatalf("unexpected provider mode key: %v", body["mode"])
	}
	if body["callback_url"] != "https://your-domain.com/webhook" {
		t.Fatalf("unexpected callback_url: %v", body["callback_url"])
	}
}

func TestMotionControlCreateCompactsEmptyFields(t *testing.T) {
	stub := &stubHTTPClient{}
	client := NewClientWithHTTP(stub)
	_, err := client.MotionControl.Create(context.Background(), MotionControlParams{
		Model:             ModelKling30,
		SourceImageURL:    "https://cdn.runapi.ai/public/samples/portrait.jpg",
		ReferenceVideoURL: "https://cdn.runapi.ai/public/samples/video.mp4",
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

func TestClientExposesUniversalResources(t *testing.T) {
	client := NewClientWithHTTP(&stubHTTPClient{})
	if client.Files == nil {
		t.Fatal("expected Files to be wired via base.Base")
	}
	if client.Account == nil {
		t.Fatal("expected Account to be wired via base.Base")
	}
}
