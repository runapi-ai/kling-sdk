package kling

// TextToVideoModel identifies a Kling text-to-video model variant.
type TextToVideoModel string

type ImageToVideoModel string

type KlingTextToVideoOutputResolution string

type MotionControlOutputResolution string

type TaskStatus string

const (
	ModelKling30        TextToVideoModel = "kling-3.0"
	ModelV25TurboT2VPro TextToVideoModel = "kling-v2.5-turbo-text-to-video-pro"
	ModelV21MasterT2V   TextToVideoModel = "kling-v2.1-master-text-to-video"

	ModelV25TurboI2VPro ImageToVideoModel = "kling-v2.5-turbo-image-to-video-pro"
	ModelV21Pro         ImageToVideoModel = "kling-v2.1-pro"
	ModelV21Standard    ImageToVideoModel = "kling-v2.1-standard"
	ModelV21MasterI2V   ImageToVideoModel = "kling-v2.1-master-image-to-video"

	TextToVideoOutputResolution720p  KlingTextToVideoOutputResolution = "720p"
	TextToVideoOutputResolution1080p KlingTextToVideoOutputResolution = "1080p"
	TextToVideoOutputResolution4K    KlingTextToVideoOutputResolution = "4k"
)

type MultiPromptItem struct {
	Prompt          string `json:"prompt" help:"required; text prompt for this shot"`
	DurationSeconds int    `json:"duration_seconds" help:"required; shot duration in seconds"`
}

type KlingElement struct {
	Name                  string   `json:"name" help:"required; element name"`
	Description           string   `json:"description,omitempty" help:"optional; element description"`
	ElementInputURLs      []string `json:"element_input_urls,omitempty" help:"optional; image URLs for the element"`
	ElementInputVideoURLs []string `json:"element_input_video_urls,omitempty" help:"optional; video URLs for the element"`
}

type TextToVideoParams struct {
	Model       TextToVideoModel `json:"model" help:"required; model slug"`
	Prompt      string           `json:"prompt,omitempty" help:"required unless multi_shots; video description"`
	CallbackURL string           `json:"callback_url,omitempty" help:"optional; webhook URL for async notifications"`

	EnableSound      *bool                            `json:"enable_sound,omitempty" help:"optional; enable sound generation"`
	DurationSeconds  int                              `json:"duration_seconds,omitempty" help:"optional; duration in seconds"`
	AspectRatio      string                           `json:"aspect_ratio,omitempty" help:"optional; output aspect ratio"`
	OutputResolution KlingTextToVideoOutputResolution `json:"output_resolution,omitempty" help:"optional; output resolution"`

	NegativePrompt string   `json:"negative_prompt,omitempty" help:"optional; negative prompt for V2.1/V2.5 models"`
	CfgScale       *float64 `json:"cfg_scale,omitempty" help:"optional; guidance scale for V2.1/V2.5 models"`

	MultiShots         *bool             `json:"multi_shots,omitempty" help:"optional; true to enable multi-shot generation"`
	MultiPrompt        []MultiPromptItem `json:"multi_prompt,omitempty" help:"optional; prompt segments for multi-shot mode"`
	FirstFrameImageURL string            `json:"first_frame_image_url,omitempty" help:"optional; first frame image URL for Kling 3.0"`
	LastFrameImageURL  string            `json:"last_frame_image_url,omitempty" help:"optional; last frame image URL for Kling 3.0 single-shot mode"`

	KlingElements []KlingElement `json:"kling_elements,omitempty" help:"optional; element references for generation"`
}

type ImageToVideoParams struct {
	Model              ImageToVideoModel `json:"model" help:"required; model slug"`
	Prompt             string            `json:"prompt" help:"required; video description"`
	FirstFrameImageURL string            `json:"first_frame_image_url" help:"required; first frame image URL"`
	CallbackURL        string            `json:"callback_url,omitempty" help:"optional; webhook URL for async notifications"`
	DurationSeconds    int               `json:"duration_seconds,omitempty" help:"optional; duration in seconds"`
	NegativePrompt     string            `json:"negative_prompt,omitempty" help:"optional; negative prompt"`
	CfgScale           *float64          `json:"cfg_scale,omitempty" help:"optional; guidance scale"`
	LastFrameImageURL  string            `json:"last_frame_image_url,omitempty" help:"optional; final frame image URL for supported image-to-video models"`
}

type AsyncTaskResponse struct {
	ID     string     `json:"id"`
	Status TaskStatus `json:"status"`
	Error  string     `json:"error,omitempty"`
}

func (r AsyncTaskResponse) GetID() string     { return r.ID }
func (r AsyncTaskResponse) GetStatus() string { return string(r.Status) }
func (r AsyncTaskResponse) GetError() string  { return r.Error }

type VideoMetadata struct {
	URL string `json:"url"`
}

type TextToVideoResponse struct {
	AsyncTaskResponse
	Videos []VideoMetadata `json:"videos,omitempty"`
}

type ImageToVideoResponse struct {
	AsyncTaskResponse
	Videos []VideoMetadata `json:"videos,omitempty"`
}

type AiAvatarModel string

const (
	ModelAiAvatarPro      AiAvatarModel = "kling-ai-avatar-pro"
	ModelAiAvatarStandard AiAvatarModel = "kling-ai-avatar-standard"
	ModelAiAvatarV1Pro    AiAvatarModel = "kling-ai-avatar-v1-pro"
	ModelV1AvatarStandard AiAvatarModel = "kling-v1-avatar-standard"
)

type AiAvatarParams struct {
	Model          AiAvatarModel `json:"model" help:"required; model slug"`
	SourceImageURL string        `json:"source_image_url" help:"required; face image URL"`
	SourceAudioURL string        `json:"source_audio_url" help:"required; audio URL for lip sync"`
	Prompt         string        `json:"prompt" help:"required; description of the avatar"`
	CallbackURL    string        `json:"callback_url,omitempty" help:"optional; webhook URL for async notifications"`
}

type AiAvatarResponse struct {
	AsyncTaskResponse
	Videos []VideoMetadata `json:"videos,omitempty"`
}

type MotionControlParams struct {
	Model                TextToVideoModel              `json:"model" help:"required; model slug"`
	SourceImageURL       string                        `json:"source_image_url" help:"required; subject image URL"`
	ReferenceVideoURL    string                        `json:"reference_video_url" help:"required; reference motion video URL"`
	Prompt               string                        `json:"prompt,omitempty" help:"optional; description prompt"`
	OutputResolution     MotionControlOutputResolution `json:"output_resolution,omitempty" help:"optional; output resolution"`
	CharacterOrientation string                        `json:"character_orientation,omitempty" help:"optional; character orientation"`
	BackgroundSource     string                        `json:"background_source,omitempty" help:"optional; background source"`
	CallbackURL          string                        `json:"callback_url,omitempty" help:"optional; webhook URL for async notifications"`
}

type MotionControlResponse struct {
	AsyncTaskResponse
	Videos []VideoMetadata `json:"videos,omitempty"`
}
