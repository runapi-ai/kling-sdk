package kling

// TextToVideoModel identifies a Kling text-to-video model variant.
type TextToVideoModel string

type ImageToVideoModel string

type KlingMode string

type TaskStatus string

const (
	ModelKling30        TextToVideoModel = "kling-3.0"
	ModelV25TurboT2VPro TextToVideoModel = "kling-v2.5-turbo-text-to-video-pro"

	ModelV25TurboI2VPro ImageToVideoModel = "kling-v2.5-turbo-image-to-video-pro"

	ModeStd KlingMode = "std"
	ModePro KlingMode = "pro"
)

type MultiPromptItem struct {
	Prompt   string `json:"prompt" help:"required; text prompt for this shot"`
	Duration int    `json:"duration" help:"required; duration in seconds for this shot"`
}

type KlingElement struct {
	Name                  string   `json:"name" help:"required; element name"`
	Description           string   `json:"description,omitempty" help:"optional; element description"`
	ElementInputURLs      []string `json:"element_input_urls,omitempty" help:"optional; image URLs for the element"`
	ElementInputVideoURLs []string `json:"element_input_video_urls,omitempty" help:"optional; video URLs for the element"`
}

type TextToVideoParams struct {
	Model       TextToVideoModel `json:"model" help:"required; kling-3.0 or kling-v2.5-turbo-text-to-video-pro"`
	Prompt      string           `json:"prompt,omitempty" help:"required unless multi_shots; video description"`
	CallbackURL string           `json:"callback_url,omitempty" help:"optional; webhook URL for async notifications"`

	Sound       *bool     `json:"sound,omitempty" help:"optional; enable sound generation"`
	Duration    string    `json:"duration,omitempty" help:"optional; Kling 3 accepts 3-15; V2.5 Turbo accepts 5 or 10"`
	AspectRatio string    `json:"aspect_ratio,omitempty" help:"optional; 16:9, 9:16, 1:1"`
	Mode        KlingMode `json:"mode,omitempty" help:"optional; std (default) or pro for kling-3.0"`

	NegativePrompt string   `json:"negative_prompt,omitempty" help:"optional; negative prompt for V2.5 Turbo"`
	CfgScale       *float64 `json:"cfg_scale,omitempty" help:"optional; guidance scale for V2.5 Turbo"`

	MultiShots  *bool             `json:"multi_shots,omitempty" help:"optional; true to enable multi-shot generation"`
	MultiPrompt []MultiPromptItem `json:"multi_prompt,omitempty" help:"optional; prompt segments for multi-shot mode"`
	ImageURLs   []string          `json:"image_urls,omitempty" help:"optional; reference image URLs for kling-3.0"`

	KlingElements []KlingElement `json:"kling_elements,omitempty" help:"optional; element references for generation"`
}

type ImageToVideoParams struct {
	Model          ImageToVideoModel `json:"model" help:"required; kling-v2.5-turbo-image-to-video-pro"`
	Prompt         string            `json:"prompt" help:"required; video description"`
	ImageURL       string            `json:"image_url" help:"required; source image URL"`
	CallbackURL    string            `json:"callback_url,omitempty" help:"optional; webhook URL for async notifications"`
	Duration       string            `json:"duration,omitempty" help:"optional; 5 or 10"`
	NegativePrompt string            `json:"negative_prompt,omitempty" help:"optional; negative prompt"`
	CfgScale       *float64          `json:"cfg_scale,omitempty" help:"optional; guidance scale"`
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
)

type AiAvatarParams struct {
	Model       AiAvatarModel `json:"model" help:"required; kling-ai-avatar-pro or kling-ai-avatar-standard"`
	ImageURL    string        `json:"image_url" help:"required; face image URL"`
	AudioURL    string        `json:"audio_url" help:"required; audio URL for lip sync"`
	Prompt      string        `json:"prompt" help:"required; description of the avatar"`
	CallbackURL string        `json:"callback_url,omitempty" help:"optional; webhook URL for async notifications"`
}

type AiAvatarResponse struct {
	AsyncTaskResponse
	Videos []VideoMetadata `json:"videos,omitempty"`
}

type MotionControlParams struct {
	Model                TextToVideoModel `json:"model" help:"required; kling-3.0"`
	InputURLs            []string         `json:"input_urls" help:"required; character image URLs"`
	VideoURLs            []string         `json:"video_urls" help:"required; reference motion video URLs"`
	Prompt               string           `json:"prompt,omitempty" help:"optional; description prompt"`
	Mode                 string           `json:"mode,omitempty" help:"optional; 720p or 1080p"`
	CharacterOrientation string           `json:"character_orientation,omitempty" help:"optional; video or image"`
	BackgroundSource     string           `json:"background_source,omitempty" help:"optional; input_video or input_image"`
	CallbackURL          string           `json:"callback_url,omitempty" help:"optional; webhook URL for async notifications"`
}

type MotionControlResponse struct {
	AsyncTaskResponse
	Videos []VideoMetadata `json:"videos,omitempty"`
}
