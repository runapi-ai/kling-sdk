// Package kling provides the Kling video API client.
//
//	client, err := kling.NewClient(option.WithAPIKey("sk-your-api-key"))
//	result, err := client.TextToVideo.Run(ctx, kling.TextToVideoParams{
//	    Model: kling.ModelKling30, Prompt: "A cat walking through a garden",
//	})
package kling

import (
	"context"

	"github.com/runapi-ai/core-sdk/go/core"
	"github.com/runapi-ai/core-sdk/go/option"
)

const (
	textToVideoPath   = "/api/v1/kling/text_to_video"
	imageToVideoPath  = "/api/v1/kling/image_to_video"
	aiAvatarPath      = "/api/v1/kling/ai_avatar"
	motionControlPath = "/api/v1/kling/motion_control"
)

type Client struct {
	TextToVideo   *TextToVideo
	ImageToVideo  *ImageToVideo
	AiAvatar      *AiAvatar
	MotionControl *MotionControl
}

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

func NewClientWithHTTP(httpClient core.HTTPClient) *Client {
	return &Client{
		TextToVideo:   &TextToVideo{http: httpClient},
		ImageToVideo:  &ImageToVideo{http: httpClient},
		AiAvatar:      &AiAvatar{http: httpClient},
		MotionControl: &MotionControl{http: httpClient},
	}
}

type TextToVideo struct{ http core.HTTPClient }

func (r *TextToVideo) Create(ctx context.Context, params TextToVideoParams, opts ...option.RequestOption) (*core.TaskCreateResponse, error) {
	requestOptions, _ := option.ResolveRequestOptions(opts...)
	return core.PostJSON[core.TaskCreateResponse](ctx, r.http, textToVideoPath, core.CompactParams(params), requestOptions)
}
func (r *TextToVideo) Get(ctx context.Context, id string, opts ...option.RequestOption) (*TextToVideoResponse, error) {
	requestOptions, _ := option.ResolveRequestOptions(opts...)
	return core.GetJSON[TextToVideoResponse](ctx, r.http, core.ResourcePath(textToVideoPath, id), requestOptions)
}
func (r *TextToVideo) Run(ctx context.Context, params TextToVideoParams, opts ...option.RequestOption) (*TextToVideoResponse, error) {
	_, pollingOptions := option.ResolveRequestOptions(opts...)
	return core.RunAsync(ctx, func(ctx context.Context) (*core.TaskCreateResponse, error) { return r.Create(ctx, params, opts...) }, func(ctx context.Context, id string) (*TextToVideoResponse, error) { return r.Get(ctx, id, opts...) }, pollingOptions)
}

type ImageToVideo struct{ http core.HTTPClient }

func (r *ImageToVideo) Create(ctx context.Context, params ImageToVideoParams, opts ...option.RequestOption) (*core.TaskCreateResponse, error) {
	requestOptions, _ := option.ResolveRequestOptions(opts...)
	return core.PostJSON[core.TaskCreateResponse](ctx, r.http, imageToVideoPath, core.CompactParams(params), requestOptions)
}
func (r *ImageToVideo) Get(ctx context.Context, id string, opts ...option.RequestOption) (*ImageToVideoResponse, error) {
	requestOptions, _ := option.ResolveRequestOptions(opts...)
	return core.GetJSON[ImageToVideoResponse](ctx, r.http, core.ResourcePath(imageToVideoPath, id), requestOptions)
}
func (r *ImageToVideo) Run(ctx context.Context, params ImageToVideoParams, opts ...option.RequestOption) (*ImageToVideoResponse, error) {
	_, pollingOptions := option.ResolveRequestOptions(opts...)
	return core.RunAsync(ctx, func(ctx context.Context) (*core.TaskCreateResponse, error) { return r.Create(ctx, params, opts...) }, func(ctx context.Context, id string) (*ImageToVideoResponse, error) { return r.Get(ctx, id, opts...) }, pollingOptions)
}

type AiAvatar struct{ http core.HTTPClient }

func (r *AiAvatar) Create(ctx context.Context, params AiAvatarParams, opts ...option.RequestOption) (*core.TaskCreateResponse, error) {
	requestOptions, _ := option.ResolveRequestOptions(opts...)
	return core.PostJSON[core.TaskCreateResponse](ctx, r.http, aiAvatarPath, core.CompactParams(params), requestOptions)
}
func (r *AiAvatar) Get(ctx context.Context, id string, opts ...option.RequestOption) (*AiAvatarResponse, error) {
	requestOptions, _ := option.ResolveRequestOptions(opts...)
	return core.GetJSON[AiAvatarResponse](ctx, r.http, core.ResourcePath(aiAvatarPath, id), requestOptions)
}
func (r *AiAvatar) Run(ctx context.Context, params AiAvatarParams, opts ...option.RequestOption) (*AiAvatarResponse, error) {
	_, pollingOptions := option.ResolveRequestOptions(opts...)
	return core.RunAsync(ctx, func(ctx context.Context) (*core.TaskCreateResponse, error) { return r.Create(ctx, params, opts...) }, func(ctx context.Context, id string) (*AiAvatarResponse, error) { return r.Get(ctx, id, opts...) }, pollingOptions)
}

type MotionControl struct{ http core.HTTPClient }

func (r *MotionControl) Create(ctx context.Context, params MotionControlParams, opts ...option.RequestOption) (*core.TaskCreateResponse, error) {
	requestOptions, _ := option.ResolveRequestOptions(opts...)
	return core.PostJSON[core.TaskCreateResponse](ctx, r.http, motionControlPath, core.CompactParams(params), requestOptions)
}
func (r *MotionControl) Get(ctx context.Context, id string, opts ...option.RequestOption) (*MotionControlResponse, error) {
	requestOptions, _ := option.ResolveRequestOptions(opts...)
	return core.GetJSON[MotionControlResponse](ctx, r.http, core.ResourcePath(motionControlPath, id), requestOptions)
}
func (r *MotionControl) Run(ctx context.Context, params MotionControlParams, opts ...option.RequestOption) (*MotionControlResponse, error) {
	_, pollingOptions := option.ResolveRequestOptions(opts...)
	return core.RunAsync(ctx, func(ctx context.Context) (*core.TaskCreateResponse, error) { return r.Create(ctx, params, opts...) }, func(ctx context.Context, id string) (*MotionControlResponse, error) { return r.Get(ctx, id, opts...) }, pollingOptions)
}
