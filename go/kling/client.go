// Package kling provides the Kling video API client.
//
//	client, err := kling.NewClient(option.WithAPIKey("sk-your-api-key"))
//	result, err := client.TextToVideo.Run(ctx, kling.TextToVideoParams{
//	    Model: kling.ModelKling30, Prompt: "A cat walking through a garden",
//	})
package kling

import (
	"context"

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
	return core.PostJSON[core.TaskCreateResponse](ctx, r.http, textToVideoPath, core.CompactParams(params), requestOptions)
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
	return core.PostJSON[core.TaskCreateResponse](ctx, r.http, imageToVideoPath, core.CompactParams(params), requestOptions)
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
	return core.PostJSON[core.TaskCreateResponse](ctx, r.http, aiAvatarPath, core.CompactParams(params), requestOptions)
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
	return core.PostJSON[core.TaskCreateResponse](ctx, r.http, motionControlPath, core.CompactParams(params), requestOptions)
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
