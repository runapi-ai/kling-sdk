package kling

import "github.com/runapi-ai/core-sdk/go/core"

// TextToVideoModel identifies a Kling text-to-video model variant.
type TextToVideoModel string

// ImageToVideoModel selects a Kling image-to-video model variant.
type ImageToVideoModel string

// EditVideoModel selects a Kling source-video editing model variant.
// It is an alias because the same model slug can also select text-to-video.
type EditVideoModel = TextToVideoModel

// MotionControlModel selects a Kling motion-control model variant.
// It remains an alias so existing ModelKling30 motion-control callers compile.
type MotionControlModel = TextToVideoModel

// ExtendVideoMode selects the Kling continuation quality.
type ExtendVideoMode string

const (
	ExtendVideoModeStd ExtendVideoMode = "std"
	ExtendVideoModePro ExtendVideoMode = "pro"
)

// KlingTextToVideoOutputResolution controls the output resolution for text-to-video tasks.
type KlingTextToVideoOutputResolution string

// KlingImageToVideoOutputResolution controls the output resolution for V3 Turbo image-to-video tasks.
type KlingImageToVideoOutputResolution string

// MotionControlOutputResolution controls the output resolution for motion control tasks.
type MotionControlOutputResolution string

// TaskStatus is the async task lifecycle state (e.g. "processing", "completed", "failed").
type TaskStatus string

const (
	// ModelKling30 is the latest-generation model with multi-shot, first/last frame images, sound generation, and Kling elements.
	ModelKling30 TextToVideoModel = generatedTextToVideoModelKling30
	// ModelV26T2V supports standard/pro generation modes and optional sound in pro mode.
	ModelV26T2V TextToVideoModel = generatedTextToVideoModelKlingV26
	// ModelO1T2V supports image and video references in five-second text-to-video requests.
	ModelO1T2V TextToVideoModel = generatedTextToVideoModelKlingO1
	// ModelV3OmniT2V supports 720p, 1080p, and 4K generation with optional sound.
	ModelV3OmniT2V TextToVideoModel = generatedTextToVideoModelKlingV3Omni
	// ModelV3OmniReference accepts reference images through TextToVideo and source videos through EditVideo.
	ModelV3OmniReference EditVideoModel = generatedEditVideoModelKlingV3OmniReference
	// ModelV3OmniEdit edits a source video through EditVideo.
	ModelV3OmniEdit EditVideoModel = generatedEditVideoModelKlingV3OmniEdit
	// ModelV3TurboT2V creates 3-15 second text-to-video clips at 720p or 1080p.
	ModelV3TurboT2V TextToVideoModel = generatedTextToVideoModelKlingV3TurboTextToVideo
	// ModelV25TurboT2VPro is a fast, high-quality V2.5 model. Supports negative prompts and cfg_scale.
	ModelV25TurboT2VPro TextToVideoModel = generatedTextToVideoModelKlingV25TurboTextToVideoPro
	// ModelV21MasterT2V is the V2.1 master model. Supports negative prompts and cfg_scale.
	ModelV21MasterT2V TextToVideoModel = generatedTextToVideoModelKlingV21MasterTextToVideo

	// ModelV3TurboI2V animates one first-frame image at 720p or 1080p.
	ModelV3TurboI2V ImageToVideoModel = generatedImageToVideoModelKlingV3TurboImageToVideo
	// ModelV26I2V supports standard/pro generation modes, optional sound, and pro final-frame control.
	ModelV26I2V ImageToVideoModel = generatedImageToVideoModelKlingV26
	// ModelO1I2V supports first/final frames plus image and feature-video references.
	ModelO1I2V ImageToVideoModel = generatedImageToVideoModelKlingO1
	// ModelV3OmniI2V supports 720p, 1080p, and 4K generation with optional sound and final-frame control.
	ModelV3OmniI2V ImageToVideoModel = generatedImageToVideoModelKlingV3Omni
	// ModelV25TurboI2VPro is the fast V2.5 image-to-video model with last-frame support.
	ModelV25TurboI2VPro ImageToVideoModel = generatedImageToVideoModelKlingV25TurboImageToVideoPro
	// ModelV21Pro balances quality and speed for image-to-video.
	ModelV21Pro ImageToVideoModel = generatedImageToVideoModelKlingV21Pro
	// ModelV21Standard is the fastest V2.1 image-to-video variant.
	ModelV21Standard ImageToVideoModel = generatedImageToVideoModelKlingV21Standard
	// ModelV21MasterI2V is the highest-quality V2.1 image-to-video variant.
	ModelV21MasterI2V ImageToVideoModel = generatedImageToVideoModelKlingV21MasterImageToVideo

	// ModelKling30MotionControl supports optional orientation and background controls.
	ModelKling30MotionControl MotionControlModel = generatedMotionControlModelKling30
	// ModelV26MotionControl requires output resolution and character orientation.
	ModelV26MotionControl MotionControlModel = generatedMotionControlModelKlingV26

	// TextToVideoOutputResolution720p produces 720p output (fastest).
	TextToVideoOutputResolution720p KlingTextToVideoOutputResolution = "720p"
	// TextToVideoOutputResolution1080p produces 1080p output.
	TextToVideoOutputResolution1080p KlingTextToVideoOutputResolution = "1080p"
	// TextToVideoOutputResolution4K produces 4K output (highest quality, slowest).
	TextToVideoOutputResolution4K KlingTextToVideoOutputResolution = "4k"

	// ImageToVideoOutputResolution720p produces 720p output for V3 Turbo image-to-video.
	ImageToVideoOutputResolution720p KlingImageToVideoOutputResolution = "720p"
	// ImageToVideoOutputResolution1080p produces 1080p output for V3 Turbo image-to-video.
	ImageToVideoOutputResolution1080p KlingImageToVideoOutputResolution = "1080p"
	// ImageToVideoOutputResolution4K produces 4K output for Kling V3 Omni image-to-video.
	ImageToVideoOutputResolution4K KlingImageToVideoOutputResolution = "4k"
)

// MultiPromptItem defines a single shot in multi-shot generation mode ([ModelKling30] only).
// Each shot has its own prompt and duration.
type MultiPromptItem struct {
	Prompt          string `json:"prompt" help:"required; text prompt for this shot"`
	DurationSeconds int    `json:"duration_seconds" help:"required; shot duration in seconds"`
}

// KlingElement is a named element (character, object, style) with reference image, video, or audio materials,
// used in [ModelKling30] generation to maintain consistency.
type KlingElement struct {
	Name                  string   `json:"name" help:"required; element name"`
	Description           string   `json:"description,omitempty" help:"optional; element description"`
	ElementInputURLs      []string `json:"element_input_urls,omitempty" help:"optional; image or video URLs for the element"`
	ElementInputVideoURLs []string `json:"element_input_video_urls,omitempty" help:"optional; video URLs for the element"`
	ElementInputAudioURLs []string `json:"element_input_audio_urls,omitempty" help:"optional; audio URLs for the element"`
	StartTime             int      `json:"start_time,omitempty" help:"optional; video capture start time in milliseconds"`
	EndTime               int      `json:"end_time,omitempty" help:"optional; video capture end time in milliseconds"`
}

// TextToVideoParams configures Kling text-to-video generation.
// Feature availability varies by model: [ModelKling30] supports multi-shot, first/last frame images,
// sound generation, and Kling elements. V2.x models support NegativePrompt and CfgScale instead.
type TextToVideoParams struct {
	Model            TextToVideoModel                 `json:"model" help:"required; model slug"`
	Prompt           string                           `json:"prompt,omitempty" help:"required unless multi_shots; video description"`
	CallbackURL      string                           `json:"callback_url,omitempty" help:"optional; webhook URL for async notifications"`
	Mode             string                           `json:"mode,omitempty" help:"optional; std or pro; defaults to std"`
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

	ReferenceImageURLs          []string `json:"reference_image_urls,omitempty" help:"optional for Kling O1 or kling-v3-omni-reference; ordered public reference image URLs"`
	ReferenceVideoURL           string   `json:"reference_video_url,omitempty" help:"optional for Kling O1; public HTTP(S) MP4 or MOV reference video URL; use video_1 marker in prompt"`
	ReferenceVideoType          string   `json:"reference_video_type,omitempty" help:"optional for Kling O1; base or feature; defaults to base"`
	PreserveReferenceVideoAudio *bool    `json:"preserve_reference_video_audio,omitempty" help:"optional for Kling O1; preserve the reference video's original audio; requires reference_video_url"`
}

// ImageToVideoParams configures Kling image-to-video generation.
// A first-frame image is required. LastFrameImageURL is supported by select models.
type ImageToVideoParams struct {
	Model                       ImageToVideoModel                 `json:"model" help:"required; model slug"`
	Prompt                      string                            `json:"prompt" help:"required; video description"`
	FirstFrameImageURL          string                            `json:"first_frame_image_url" help:"required; first frame image URL"`
	CallbackURL                 string                            `json:"callback_url,omitempty" help:"optional; webhook URL for async notifications"`
	Mode                        string                            `json:"mode,omitempty" help:"optional; std or pro; defaults to std"`
	EnableSound                 *bool                             `json:"enable_sound,omitempty" help:"optional; enable sound generation; true requires pro mode for Kling 2.6"`
	DurationSeconds             int                               `json:"duration_seconds,omitempty" help:"optional; duration in seconds"`
	AspectRatio                 string                            `json:"aspect_ratio,omitempty" help:"optional; output aspect ratio"`
	OutputResolution            KlingImageToVideoOutputResolution `json:"output_resolution,omitempty" help:"optional; output resolution for V3 Turbo or Kling V3 Omni"`
	NegativePrompt              string                            `json:"negative_prompt,omitempty" help:"optional; negative prompt"`
	CfgScale                    *float64                          `json:"cfg_scale,omitempty" help:"optional; guidance scale"`
	LastFrameImageURL           string                            `json:"last_frame_image_url,omitempty" help:"optional; final frame image URL; for Kling O1, cannot be combined with reference_image_urls or reference_video_url"`
	ReferenceImageURLs          []string                          `json:"reference_image_urls,omitempty" help:"optional for Kling O1; ordered public HTTP(S) JPG, JPEG, or PNG reference image URLs; use matching image markers in prompt; cannot be combined with last_frame_image_url"`
	ReferenceVideoURL           string                            `json:"reference_video_url,omitempty" help:"optional for Kling O1; public HTTP(S) MP4 or MOV reference video URL; use video_1 marker in prompt; cannot be combined with last_frame_image_url"`
	ReferenceVideoType          string                            `json:"reference_video_type,omitempty" help:"optional for Kling O1; base or feature; defaults to base"`
	PreserveReferenceVideoAudio *bool                             `json:"preserve_reference_video_audio,omitempty" help:"optional for Kling O1; preserve the reference video's original audio; requires reference_video_url"`
}

// ExtendVideoParams continues a completed Kling V2.5 Turbo video task.
type ExtendVideoParams struct {
	SourceTaskID string          `json:"source_task_id" help:"required; completed Kling V2.5 Turbo source task ID"`
	Mode         ExtendVideoMode `json:"mode,omitempty" help:"optional; std or pro"`
	Prompt       string          `json:"prompt,omitempty" help:"optional; continuation prompt"`
	CallbackURL  string          `json:"callback_url,omitempty" help:"optional; webhook URL"`
}

// EditVideoParams configures source-video editing for a Kling V3 Omni model.
type EditVideoParams struct {
	Model              EditVideoModel `json:"model" help:"required; model slug"`
	Prompt             string   `json:"prompt" help:"required; video description"`
	SourceVideoURL     string   `json:"source_video_url,omitempty" help:"optional; public source video URL; cannot be combined with source_task_id"`
	SourceTaskID       string   `json:"source_task_id,omitempty" help:"optional; completed compatible task ID; cannot be combined with source_video_url"`
	ReferenceImageURLs []string `json:"reference_image_urls,omitempty" help:"optional; ordered reference image URLs"`
	DurationSeconds    int      `json:"duration_seconds,omitempty" help:"optional; output duration in seconds; source-only requests use 5"`
	OutputResolution   string   `json:"output_resolution,omitempty" help:"optional; output resolution"`
	AspectRatio        string   `json:"aspect_ratio,omitempty" help:"optional; output aspect ratio; source-only requests use auto"`
	EnableSound        *bool    `json:"enable_sound,omitempty" help:"optional; enable synchronized sound"`
	CallbackURL        string   `json:"callback_url,omitempty" help:"optional; webhook URL for async notifications"`
}

// AsyncTaskResponse carries the task ID, lifecycle status, and error for all Kling async operations.
type AsyncTaskResponse struct {
	core.TaskBillingFacts
	ID     string     `json:"id"`
	Status TaskStatus `json:"status"`
	Error  string     `json:"error,omitempty"`
}

func (r AsyncTaskResponse) GetID() string     { return r.ID }
func (r AsyncTaskResponse) GetStatus() string { return string(r.Status) }
func (r AsyncTaskResponse) GetError() string  { return r.Error }

// VideoMetadata holds a URL to a generated video file.
type VideoMetadata struct {
	URL string `json:"url"`
}

// TextToVideoResponse is the completed result of a text-to-video task.
type TextToVideoResponse struct {
	AsyncTaskResponse
	Videos []VideoMetadata `json:"videos,omitempty"`
}

// ImageToVideoResponse is the completed result of an image-to-video task.
type ImageToVideoResponse struct {
	AsyncTaskResponse
	Videos []VideoMetadata `json:"videos,omitempty"`
}

// AiAvatarModel selects the AI avatar lip-sync quality tier.
type AiAvatarModel string

const (
	// ModelAiAvatarPro is the highest-quality avatar model with the most natural lip movements.
	ModelAiAvatarPro AiAvatarModel = generatedAvatarModelKlingAiAvatarPro
	// ModelAiAvatarStandard is faster with slightly less refined lip sync than Pro.
	ModelAiAvatarStandard AiAvatarModel = generatedAvatarModelKlingAiAvatarStandard
	// ModelAiAvatarV1Pro is the V1-generation pro avatar model.
	ModelAiAvatarV1Pro AiAvatarModel = generatedAvatarModelKlingAiAvatarV1Pro
	// ModelV1AvatarStandard is the V1-generation standard avatar model.
	ModelV1AvatarStandard AiAvatarModel = generatedAvatarModelKlingV1AvatarStandard
)

// AiAvatarParams configures AI avatar generation, which lip-syncs a face image to an audio track.
// The face in SourceImageURL is animated to match the speech in SourceAudioURL.
type AiAvatarParams struct {
	Model          AiAvatarModel `json:"model" help:"required; model slug"`
	SourceImageURL string        `json:"source_image_url" help:"required; face image URL"`
	SourceAudioURL string        `json:"source_audio_url" help:"required; audio URL for lip sync"`
	Prompt         string        `json:"prompt" help:"required; description of the avatar"`
	CallbackURL    string        `json:"callback_url,omitempty" help:"optional; webhook URL for async notifications"`
}

// AiAvatarResponse is the completed result of an AI avatar task.
type AiAvatarResponse struct {
	AsyncTaskResponse
	Videos []VideoMetadata `json:"videos,omitempty"`
}

// MotionControlParams configures motion transfer from a reference video onto a subject image.
// The subject in SourceImageURL adopts the motion patterns from ReferenceVideoURL.
type MotionControlParams struct {
	Model                MotionControlModel            `json:"model" help:"required; model slug"`
	SourceImageURL       string                        `json:"source_image_url" help:"required; subject image URL"`
	ReferenceVideoURL    string                        `json:"reference_video_url" help:"required; reference motion video URL; kling-v2.6 allows 3-10 seconds with image orientation or 3-30 seconds with video orientation"`
	Prompt               string                        `json:"prompt,omitempty" help:"optional; description prompt"`
	OutputResolution     MotionControlOutputResolution `json:"output_resolution,omitempty" help:"required for kling-v2.6; optional for kling-3.0; output resolution"`
	CharacterOrientation string                        `json:"character_orientation,omitempty" help:"required for kling-v2.6; optional for kling-3.0; character orientation"`
	BackgroundSource     string                        `json:"background_source,omitempty" help:"optional for kling-3.0; not supported by kling-v2.6; background source"`
	CallbackURL          string                        `json:"callback_url,omitempty" help:"optional; webhook URL for async notifications"`
}

// MotionControlResponse is the completed result of a motion control task.
type MotionControlResponse struct {
	AsyncTaskResponse
	Videos []VideoMetadata `json:"videos,omitempty"`
}
