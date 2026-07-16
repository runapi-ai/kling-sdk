// Package kling provides the Kling video API client.
//
//	client, err := kling.NewClient(option.WithAPIKey("sk-your-api-key"))
//	result, err := client.TextToVideo.Run(ctx, kling.TextToVideoParams{
//	    Model: kling.ModelKling30, Prompt: "A cat walking through a garden",
//	})
package kling

import (
	"context"
	"strings"

	"github.com/runapi-ai/core-sdk/go/base"
	"github.com/runapi-ai/core-sdk/go/core"
	"github.com/runapi-ai/core-sdk/go/option"
)

const (
	textToVideoPath   = "/api/v1/kling/text_to_video"
	imageToVideoPath  = "/api/v1/kling/image_to_video"
	aiAvatarPath      = "/api/v1/kling/ai_avatar"
	motionControlPath = "/api/v1/kling/motion_control"
)

var v3TurboTextToVideoUnsupportedFields = []string{
	"enable_sound",
	"negative_prompt",
	"cfg_scale",
	"multi_shots",
	"multi_prompt",
	"first_frame_image_url",
	"last_frame_image_url",
	"kling_elements",
}

var v3TurboImageToVideoUnsupportedFields = []string{
	"aspect_ratio",
	"negative_prompt",
	"cfg_scale",
	"last_frame_image_url",
}

// Client provides Kling video generation, AI avatar lip-sync, and motion control.
type Client struct {
	base.Base
	TextToVideo   *TextToVideo
	ImageToVideo  *ImageToVideo
	AiAvatar      *AiAvatar
	MotionControl *MotionControl
}

// NewClient creates a Kling client with the given options.
func NewClient(opts ...option.ClientOption) (*Client, error) {
	resolved, err := option.ResolveClientOptions(opts...)
	if err != nil {
		return nil, err
	}
	httpClient, err := core.NewHTTPClient(resolved)
	if err != nil {
		return nil, err
	}
	return NewClientWithHTTP(httpClient), nil
}

// NewClientWithHTTP creates a Kling client with a pre-configured HTTP transport.
func NewClientWithHTTP(httpClient core.HTTPClient) *Client {
	return &Client{
		Base:          base.New(httpClient),
		TextToVideo:   &TextToVideo{http: httpClient},
		ImageToVideo:  &ImageToVideo{http: httpClient},
		AiAvatar:      &AiAvatar{http: httpClient},
		MotionControl: &MotionControl{http: httpClient},
	}
}

// TextToVideo generates video from a text prompt. Supports multi-shot mode, first/last frame images,
// sound generation, and Kling elements on [ModelKling30]; negative prompts and cfg_scale on V2.x models.
type TextToVideo struct{ http core.HTTPClient }

// Create submits a text-to-video task and returns immediately with a task id.
func (r *TextToVideo) Create(ctx context.Context, params TextToVideoParams, opts ...option.RequestOption) (*core.TaskCreateResponse, error) {
	requestOptions, _ := option.ResolveRequestOptions(opts...)
	body := core.CompactParams(params)
	if err := validateTextToVideoBody(body); err != nil {
		return nil, err
	}
	if err := core.ValidateParams(contractSchema["text-to-video"], body); err != nil {
		return nil, err
	}
	return core.PostJSON[core.TaskCreateResponse](ctx, r.http, textToVideoPath, body, requestOptions)
}

// Get fetches the current status of a text-to-video task by id.
func (r *TextToVideo) Get(ctx context.Context, id string, opts ...option.RequestOption) (*TextToVideoResponse, error) {
	requestOptions, _ := option.ResolveRequestOptions(opts...)
	return core.GetJSON[TextToVideoResponse](ctx, r.http, core.ResourcePath(textToVideoPath, id), requestOptions)
}

// Run submits a text-to-video task and polls until it completes.
func (r *TextToVideo) Run(ctx context.Context, params TextToVideoParams, opts ...option.RequestOption) (*TextToVideoResponse, error) {
	_, pollingOptions := option.ResolveRequestOptions(opts...)
	return core.RunAsync(ctx, func(ctx context.Context) (*core.TaskCreateResponse, error) { return r.Create(ctx, params, opts...) }, func(ctx context.Context, id string) (*TextToVideoResponse, error) { return r.Get(ctx, id, opts...) }, pollingOptions)
}

// ImageToVideo animates a still image into video, guided by a text prompt and first-frame image.
type ImageToVideo struct{ http core.HTTPClient }

// Create submits an image-to-video task and returns immediately with a task id.
func (r *ImageToVideo) Create(ctx context.Context, params ImageToVideoParams, opts ...option.RequestOption) (*core.TaskCreateResponse, error) {
	requestOptions, _ := option.ResolveRequestOptions(opts...)
	body := core.CompactParams(params)
	if err := validateImageToVideoBody(body); err != nil {
		return nil, err
	}
	if err := core.ValidateParams(contractSchema["image-to-video"], body); err != nil {
		return nil, err
	}
	return core.PostJSON[core.TaskCreateResponse](ctx, r.http, imageToVideoPath, body, requestOptions)
}

// Get fetches the current status of an image-to-video task by id.
func (r *ImageToVideo) Get(ctx context.Context, id string, opts ...option.RequestOption) (*ImageToVideoResponse, error) {
	requestOptions, _ := option.ResolveRequestOptions(opts...)
	return core.GetJSON[ImageToVideoResponse](ctx, r.http, core.ResourcePath(imageToVideoPath, id), requestOptions)
}

// Run submits an image-to-video task and polls until it completes.
func (r *ImageToVideo) Run(ctx context.Context, params ImageToVideoParams, opts ...option.RequestOption) (*ImageToVideoResponse, error) {
	_, pollingOptions := option.ResolveRequestOptions(opts...)
	return core.RunAsync(ctx, func(ctx context.Context) (*core.TaskCreateResponse, error) { return r.Create(ctx, params, opts...) }, func(ctx context.Context, id string) (*ImageToVideoResponse, error) { return r.Get(ctx, id, opts...) }, pollingOptions)
}

// AiAvatar lip-syncs a face image to an audio track, producing a talking-head video.
type AiAvatar struct{ http core.HTTPClient }

// Create submits an AI avatar task and returns immediately with a task id.
func (r *AiAvatar) Create(ctx context.Context, params AiAvatarParams, opts ...option.RequestOption) (*core.TaskCreateResponse, error) {
	requestOptions, _ := option.ResolveRequestOptions(opts...)
	body := core.CompactParams(params)
	if err := core.ValidateParams(contractSchema["avatar"], body); err != nil {
		return nil, err
	}
	return core.PostJSON[core.TaskCreateResponse](ctx, r.http, aiAvatarPath, body, requestOptions)
}

// Get fetches the current status of an AI avatar task by id.
func (r *AiAvatar) Get(ctx context.Context, id string, opts ...option.RequestOption) (*AiAvatarResponse, error) {
	requestOptions, _ := option.ResolveRequestOptions(opts...)
	return core.GetJSON[AiAvatarResponse](ctx, r.http, core.ResourcePath(aiAvatarPath, id), requestOptions)
}

// Run submits an AI avatar task and polls until it completes.
func (r *AiAvatar) Run(ctx context.Context, params AiAvatarParams, opts ...option.RequestOption) (*AiAvatarResponse, error) {
	_, pollingOptions := option.ResolveRequestOptions(opts...)
	return core.RunAsync(ctx, func(ctx context.Context) (*core.TaskCreateResponse, error) { return r.Create(ctx, params, opts...) }, func(ctx context.Context, id string) (*AiAvatarResponse, error) { return r.Get(ctx, id, opts...) }, pollingOptions)
}

// MotionControl transfers motion from a reference video onto a subject image.
// The subject adopts the movement patterns from the reference while preserving its own appearance.
type MotionControl struct{ http core.HTTPClient }

// Create submits a motion control task and returns immediately with a task id.
func (r *MotionControl) Create(ctx context.Context, params MotionControlParams, opts ...option.RequestOption) (*core.TaskCreateResponse, error) {
	requestOptions, _ := option.ResolveRequestOptions(opts...)
	body := core.CompactParams(params)
	if err := core.ValidateParams(contractSchema["motion-control"], body); err != nil {
		return nil, err
	}
	return core.PostJSON[core.TaskCreateResponse](ctx, r.http, motionControlPath, body, requestOptions)
}

// Get fetches the current status of a motion control task by id.
func (r *MotionControl) Get(ctx context.Context, id string, opts ...option.RequestOption) (*MotionControlResponse, error) {
	requestOptions, _ := option.ResolveRequestOptions(opts...)
	return core.GetJSON[MotionControlResponse](ctx, r.http, core.ResourcePath(motionControlPath, id), requestOptions)
}

// Run submits a motion control task and polls until it completes.
func (r *MotionControl) Run(ctx context.Context, params MotionControlParams, opts ...option.RequestOption) (*MotionControlResponse, error) {
	_, pollingOptions := option.ResolveRequestOptions(opts...)
	return core.RunAsync(ctx, func(ctx context.Context) (*core.TaskCreateResponse, error) { return r.Create(ctx, params, opts...) }, func(ctx context.Context, id string) (*MotionControlResponse, error) { return r.Get(ctx, id, opts...) }, pollingOptions)
}

func validateTextToVideoBody(body map[string]any) error {
	if body["model"] != string(ModelV3TurboT2V) {
		return nil
	}
	return rejectUnsupportedFields(body, v3TurboTextToVideoUnsupportedFields, string(ModelV3TurboT2V))
}

func validateImageToVideoBody(body map[string]any) error {
	if body["model"] != string(ModelV3TurboI2V) {
		return nil
	}
	return rejectUnsupportedFields(body, v3TurboImageToVideoUnsupportedFields, string(ModelV3TurboI2V))
}

func rejectUnsupportedFields(body map[string]any, fields []string, model string) error {
	for _, field := range fields {
		if fieldPresent(body, field) {
			return core.NewError(core.ErrValidation, field+" is not supported by "+model, 400, "", nil, nil)
		}
	}
	return nil
}

func fieldPresent(params map[string]any, field string) bool {
	value, ok := params[field]
	if !ok {
		return false
	}
	if b, isBool := value.(bool); isBool && !b {
		return true
	}
	if arr, isArray := value.([]any); isArray {
		for _, item := range arr {
			if presentValue(item) {
				return true
			}
		}
		return false
	}
	return presentValue(value)
}

func presentValue(value any) bool {
	switch v := value.(type) {
	case nil:
		return false
	case bool:
		return v
	case string:
		return strings.TrimSpace(v) != ""
	case []any:
		return len(v) > 0
	case map[string]any:
		return len(v) > 0
	default:
		return true
	}
}
